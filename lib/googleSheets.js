import { google } from 'googleapis';
import { isBracketedTitle, slugify, unslugify } from './slugify.js';

const SCOPES = [
  'https://www.googleapis.com/auth/spreadsheets.readonly',
  'https://www.googleapis.com/auth/drive.readonly',
];

const cache = new Map();
let cacheTimestamp = 0;
const CACHE_TTL_MS = 1000 * 60; // 1 minute

function getPrivateKey() {
  const key = process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY;
  return key ? key.replace(/\\n/g, '\n') : undefined;
}

function assertEnv() {
  const missing = [];
  if (!process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL) missing.push('GOOGLE_SERVICE_ACCOUNT_EMAIL');
  if (!process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY) missing.push('GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY');
  if (!process.env.GOOGLE_DRIVE_PLAYBILL_FOLDER_ID) missing.push('GOOGLE_DRIVE_PLAYBILL_FOLDER_ID');

  if (missing.length) {
    throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
  }
}

async function getAuthClient() {
  assertEnv();

  const auth = new google.auth.GoogleAuth({
    credentials: {
      client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
      private_key: getPrivateKey(),
    },
    scopes: SCOPES,
  });

  return auth.getClient();
}

async function listPlaybillFiles(auth) {
  const now = Date.now();
  if (cache.size && now - cacheTimestamp < CACHE_TTL_MS) {
    return cache;
  }

  const drive = google.drive({ version: 'v3', auth });
  const folderId = process.env.GOOGLE_DRIVE_PLAYBILL_FOLDER_ID;

  const response = await drive.files.list({
    q: `'${folderId}' in parents and mimeType = 'application/vnd.google-apps.spreadsheet' and trashed = false`,
    fields: 'files(id,name,modifiedTime)',
    orderBy: 'modifiedTime desc',
    pageSize: 200,
  });

  cache.clear();
  for (const file of response.data.files ?? []) {
    const slug = slugify(file.name);
    cache.set(slug, { id: file.id, name: file.name });
  }
  cacheTimestamp = now;

  return cache;
}

function normalizeRows(values = []) {
  if (!values.length) return [];
  const [header = [], ...rows] = values;
  const keys = header.map((key) => slugify(key));

  return rows
    .map((row) => {
      return keys.reduce((acc, key, index) => {
        if (!key) return acc;
        acc[key] = row[index] ?? '';
        return acc;
      }, {});
    })
    .filter((row) => Object.values(row).some((value) => value !== ''));
}

function parseConfig(values = []) {
  const config = {};
  for (const row of values) {
    const [key, value] = row;
    if (!key) continue;
    const normalizedKey = slugify(key);
    if (!normalizedKey) continue;
    config[normalizedKey] = value ?? '';
  }
  return config;
}

export async function fetchPlaybill(slug) {
  if (!slug) {
    throw new Error('Playbill slug is required.');
  }

  const client = await getAuthClient();
  const files = await listPlaybillFiles(client);
  const entry = files.get(slug);

  if (!entry) {
    return null;
  }

  const sheetsApi = google.sheets({ version: 'v4', auth: client });
  const spreadsheet = await sheetsApi.spreadsheets.get({
    spreadsheetId: entry.id,
    includeGridData: false,
  });

  const sheetTitles = (spreadsheet.data.sheets ?? []).map(
    (sheet) => sheet.properties?.title ?? ''
  );

  const ranges = sheetTitles.map((title) => `'${title.replace(/'/g, "''")}'`);

  const { data } = await sheetsApi.spreadsheets.values.batchGet({
    spreadsheetId: entry.id,
    ranges,
    majorDimension: 'ROWS',
    valueRenderOption: 'FORMULA',
  });

  const tabs = [];
  const config = {};

  data.valueRanges?.forEach((range, index) => {
    const title = sheetTitles[index];
    const values = range.values ?? [];
    if (!title) return;

    if (isBracketedTitle(title)) {
      Object.assign(config, parseConfig(values));
      return;
    }

    const sluggedTitle = slugify(title) || `section-${index + 1}`;
    tabs.push({
      title,
      slug: sluggedTitle,
      rows: normalizeRows(values),
      raw: values,
    });
  });

  const displayName = entry.name ? unslugify(entry.name) : unslugify(slug);

  return {
    id: entry.id,
    name: displayName,
    slug,
    tabs,
    config,
    fetchedAt: new Date().toISOString(),
  };
}
