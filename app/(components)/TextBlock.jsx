const baseStyles = {
  h1: {
    fontSize: '2.75rem',
    fontWeight: 700,
    lineHeight: 1.1,
    margin: '0',
  },
  h2: {
    fontSize: '2.25rem',
    fontWeight: 700,
    lineHeight: 1.15,
    margin: '0',
  },
  h3: {
    fontSize: '1.75rem',
    fontWeight: 600,
    lineHeight: 1.2,
    margin: '0',
  },
  h4: {
    fontSize: '1.35rem',
    fontWeight: 600,
    lineHeight: 1.3,
    margin: '0',
  },
  p: {
    fontSize: '1.125rem',
    lineHeight: 1.6,
    margin: '0',
  },
};

const blockSpacing = {
  h1: '0 0 1.25rem',
  h2: '0 0 1rem',
  h3: '0 0 0.75rem',
  h4: '0 0 0.5rem',
  p: '0 0 1rem',
};

export default function TextBlock({ variant = 'p', content = '', align = 'left' }) {
  const safeVariant = ['h1', 'h2', 'h3', 'h4', 'p'].includes(variant) ? variant : 'p';
  const Tag = safeVariant;
  const alignment = (align ?? '').toString().trim().toLowerCase();
  const normalizedAlign = ['left', 'right', 'center', 'justify'].includes(alignment) ? alignment : 'left';
  const stringContent = content?.toString() ?? '';
  const containsHtml = /<\/?[a-z][\s\S]*>/i.test(stringContent);

  const commonStyle = {
    ...baseStyles[safeVariant],
    textAlign: normalizedAlign,
    margin: blockSpacing[safeVariant],
  };

  if (containsHtml) {
    return <Tag style={commonStyle} dangerouslySetInnerHTML={{ __html: stringContent }} />;
  }

  return <Tag style={commonStyle}>{stringContent}</Tag>;
}

