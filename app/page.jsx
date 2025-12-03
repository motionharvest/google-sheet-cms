import Link from 'next/link';
import { listAllPlaybills } from '@/lib/googleSheets.js';

export const revalidate = 60;

export default async function HomePage() {
  let playbills = [];
  try {
    playbills = await listAllPlaybills();
  } catch (error) {
    console.error('Error fetching playbills:', error);
  }

  return (
    <main style={{ padding: '4rem 1.5rem', maxWidth: '64rem', margin: '0 auto' }}>
      <h1>Elm Shakespeare Playbill Template</h1>
      <p>
        Create a new playbill by adding a Google Sheet in the configured Drive folder.
        Each sheet tab becomes a navigation item, and bracketed tabs provide configuration values.
      </p>
      
      {playbills.length > 0 ? (
        <div style={{ marginTop: '2rem' }}>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>Available Playbills</h2>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {playbills.map((playbill) => (
              <li key={playbill.slug} style={{ marginBottom: '0.75rem' }}>
                <Link
                  href={`/${playbill.slug}`}
                  style={{
                    color: '#2563eb',
                    textDecoration: 'none',
                    fontSize: '1.1rem',
                  }}
                >
                  {playbill.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <p style={{ marginTop: '2rem', color: '#6b7280' }}>
          No playbills found. Add a Google Sheet to the configured Drive folder to get started.
        </p>
      )}
    </main>
  );
}
