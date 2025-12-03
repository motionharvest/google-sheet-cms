import HeroImage from './HeroImage.jsx';
import InlineImage from './InlineImage.jsx';
import SplitRow from './SplitRow.jsx';
import TailwindElement, { VOID_TAGS, normalizeTag as normalizeTailwindTag } from './TailwindElement.jsx';
import TextBlock from './TextBlock.jsx';

function Spacer({ size = '1rem' }) {
  return <div style={{ height: size }} aria-hidden="true" />;
}
import { slugify } from '@/lib/slugify.js';

function createTextParser(variant) {
  return function parseTextBlock(cells, context) {
    const [content = '', align = 'left'] = cells;
    if (!(content ?? '').toString().trim()) {
      return null;
    }

    return {
      key: `${variant}-${context.index}`,
      Component: TextBlock,
      props: {
        variant,
        content,
        align,
      },
    };
  };
}

const COMPONENT_PARSERS = {
  h1: createTextParser('h1'),
  h2: createTextParser('h2'),
  h3: createTextParser('h3'),
  h4: createTextParser('h4'),
  p: createTextParser('p'),
  'split-row': (cells, context) => {
    const [left = '', right = '', className = '', leftClass = '', rightClass = ''] = cells;
    const hasLeft = (left ?? '').toString().trim();
    const hasRight = (right ?? '').toString().trim();

    if (!hasLeft && !hasRight) {
      return null;
    }

    return {
      key: `split-row-${context.index}`,
      Component: SplitRow,
      props: {
        left,
        right,
        className,
        leftClass,
        rightClass,
      },
    };
  },
  space: (cells, context) => {
    const [sizeOverride = ''] = cells;
    const size = sizeOverride?.toString().trim() || '3rem';

    return {
      key: `space-${context.index}`,
      Component: Spacer,
      props: {
        size,
      },
    };
  },
  image: (cells, context) => {
    const [imageCell, altText = '', width = '', height = '', caption = '', align = 'center'] = cells;
    const imageUrl = extractImageUrl(imageCell);

    if (!imageUrl) {
      return null;
    }

    return {
      key: `image-${context.index}`,
      Component: InlineImage,
      props: {
        imageUrl,
        alt: altText || context?.fallbackAlt || 'Image',
        width,
        height,
        caption,
        align,
      },
    };
  },
  'hero-image': (cells, context) => {
    const [imageCell, heading = '', body = '', altText = '', caption = ''] = cells;
    const imageUrl = extractImageUrl(imageCell);

    if (!imageUrl) {
      return null;
    }

    const alt = altText || heading || context?.fallbackAlt || 'Hero image';

    return {
      key: `hero-image-${context.index}`,
      Component: HeroImage,
      props: {
        imageUrl,
        heading,
        body,
        alt,
        caption,
      },
    };
  },
};

const COMPONENT_ALIASES = {
  'heroimage': 'hero-image',
  'hero-image': 'hero-image',
  'splitrow': 'split-row',
  'split-row': 'split-row',
  'pair': 'split-row',
  'spread': 'split-row',
  heading: 'h1',
  heading1: 'h1',
  'heading-1': 'h1',
  heading2: 'h2',
  'heading-2': 'h2',
  heading3: 'h3',
  'heading-3': 'h3',
  heading4: 'h4',
  'heading-4': 'h4',
  img: 'image',
  paragraph: 'p',
};

function resolveComponentType(rawType) {
  if (!rawType) return null;
  const normalized = slugify(rawType);
  if (!normalized) return null;
  return COMPONENT_ALIASES[normalized] ?? normalized;
}

function extractImageUrl(value) {
  if (!value) return '';
  if (typeof value !== 'string') {
    return '';
  }

  const trimmed = value.trim();
  if (!trimmed) return '';

  const doubleQuoteMatch = trimmed.match(/^=IMAGE\(\s*"([^"]+)"/i);
  if (doubleQuoteMatch) {
    return doubleQuoteMatch[1];
  }

  const singleQuoteMatch = trimmed.match(/^=IMAGE\(\s*'([^']+)'/i);
  if (singleQuoteMatch) {
    return singleQuoteMatch[1];
  }

  return trimmed;
}

const TAILWIND_BASE_SELECTORS = new Set([
  'div',
  'span',
  'p',
  'h1',
  'h2',
  'h3',
  'h4',
  'h5',
  'h6',
  'section',
  'article',
  'header',
  'footer',
  'nav',
  'ul',
  'ol',
  'li',
  'a',
  'img',
  'figure',
  'figcaption',
  'button',
  'strong',
  'em',
  'small',
  'blockquote',
  'pre',
  'code',
  'picture',
  'image',
]);

function parseTailwindElement(value) {
  if (!value) return null;
  const selector = value.toString().trim();
  if (!selector) return null;

  let tagCandidate = selector;
  let classList = [];

  if (selector.includes('.')) {
    const segments = selector.split('.');
    tagCandidate = segments.shift() || 'div';
    classList = segments.filter(Boolean);
  } else if (!TAILWIND_BASE_SELECTORS.has(selector.toLowerCase())) {
    return null;
  }

  const normalizedTag = normalizeTailwindTag(tagCandidate);

  if (!classList.length && normalizedTag === 'div') {
    classList = [];
  }

  if (!classList.length && normalizedTag !== 'div') {
    return null;
  }

  return {
    tag: normalizedTag,
    className: classList.join(' '),
    isVoid: VOID_TAGS.has(normalizedTag),
  };
}

function parseAttributeObject(raw) {
  if (!raw) return {};
  if (typeof raw !== 'string') {
    return raw && typeof raw === 'object' ? raw : {};
  }

  const trimmed = raw.trim();
  if (!trimmed) return {};

  try {
    return JSON.parse(trimmed);
  } catch (error) {
    console.warn('[Playbill] Failed to parse attributes JSON:', trimmed, error);
    return {};
  }
}

function buildComponentEntries(tab) {
  if (!tab?.raw) return [];

  const rows = tab.raw.filter((row) => Array.isArray(row));

  return rows
    .map((row, index) => {
      const [type, ...cells] = row;
      const tailwindElement = parseTailwindElement(type);
      if (tailwindElement) {
        const [content = '', additionalClasses = '', rawAttributes = '', altText = ''] = cells;
        const composedClassName = [tailwindElement.className, additionalClasses]
          .filter(Boolean)
          .join(' ')
          .trim();

        const parsedAttributes = parseAttributeObject(rawAttributes);

        if (tailwindElement.isVoid) {
          const srcCandidate = (parsedAttributes.src ?? content)?.toString().trim();
          if (srcCandidate) {
            parsedAttributes.src = srcCandidate;
          }

          const altCandidate = (parsedAttributes.alt ?? altText)?.toString().trim();
          if (altCandidate) {
            parsedAttributes.alt = altCandidate;
          }
        }

        const resolvedContent = tailwindElement.isVoid ? '' : content;

        return {
          key: `tailwind-${index}`,
          Component: TailwindElement,
          props: {
            tag: tailwindElement.tag,
            className: composedClassName,
            content: resolvedContent,
            attributes: parsedAttributes,
          },
        };
      }

      const componentType = resolveComponentType(type);
      if (!componentType) return null;

      const parser = COMPONENT_PARSERS[componentType];
      if (!parser) return null;

      return parser(cells, { index, fallbackAlt: tab.title });
    })
    .map((result, index) => {
      if (result) return result;
      return {
        key: `spacer-${index}`,
        Component: Spacer,
        props: { size: '1rem' },
      };
    });
}

export default function PlaybillContent({ tab, config, showHeading = true }) {
  if (!tab) {
    return (
      <section style={{ padding: '2rem 0' }}>
        <p>No content available for this section.</p>
      </section>
    );
  }

  const componentEntries = buildComponentEntries(tab);

  if (componentEntries.length > 0) {
    return (
      <section style={{ padding: '1rem 0 2rem' }}>
        {showHeading && (
          <header style={{ marginBottom: '1rem' }}>
            <h2 style={{ fontSize: '2rem', marginBottom: '0.25rem' }}>{tab.title}</h2>
            {config?.subtitle && <p style={{ color: '#4b5563' }}>{config.subtitle}</p>}
          </header>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          {componentEntries.map(({ Component, key, props }) => (
            <Component key={key} {...props} />
          ))}
        </div>
      </section>
    );
  }

  const [headers = [], ...rows] = tab.raw ?? [];

  if (!headers.length && !rows.length) {
    return (
      <section style={{ padding: '2rem 0' }}>
        <p>This section does not have any rows yet.</p>
      </section>
    );
  }

  return (
    <section style={{ padding: '1rem 0 2rem' }}>
      {showHeading && (
        <header style={{ marginBottom: '1rem' }}>
          <h2 style={{ fontSize: '2rem', marginBottom: '0.25rem' }}>{tab.title}</h2>
          {config?.subtitle && <p style={{ color: '#4b5563' }}>{config.subtitle}</p>}
        </header>
      )}

      {headers.length > 0 ? (
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            {headers.length > 0 && (
              <thead>
                <tr>
                  {headers.map((heading, index) => (
                    <th
                      key={`${heading}-${index}`}
                      style={{
                        textAlign: 'left',
                        padding: '0.5rem 0.75rem',
                        borderBottom: '1px solid #e5e7eb',
                        background: '#f9fafb',
                        fontWeight: 600,
                      }}
                    >
                      {heading}
                    </th>
                  ))}
                </tr>
              </thead>
            )}
            <tbody>
              {rows.map((row, rowIdx) => (
                <tr key={rowIdx}>
                  {headers.map((_, colIdx) => (
                    <td
                      key={`${rowIdx}-${colIdx}`}
                      style={{
                        padding: '0.75rem',
                        borderBottom: '1px solid #f1f5f9',
                        verticalAlign: 'top',
                      }}
                    >
                      {row[colIdx] ?? ''}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p>There is no structured data for this tab yet.</p>
      )}
    </section>
  );
}
