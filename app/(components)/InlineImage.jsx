const alignmentMap = {
  left: 'flex-start',
  center: 'center',
  right: 'flex-end',
};

function normalizeDimension(value, fallback) {
  if (value === undefined || value === null) return fallback;
  const raw = value.toString().trim();
  if (!raw) return fallback;

  if (/^\d+(\.\d+)?$/.test(raw)) {
    return `${raw}px`;
  }

  return raw;
}

export default function InlineImage({
  imageUrl,
  alt = 'Image',
  width = '',
  height = '',
  caption = '',
  align = 'center',
}) {
  if (!imageUrl) return null;

  const justifyContent = alignmentMap[align] ?? alignmentMap.center;

  const normalizedWidth = normalizeDimension(width, '');
  const normalizedHeight = normalizeDimension(height, '');

  const styleDimensions = normalizedWidth
    ? { width: normalizedWidth }
    : { width: '100%', maxWidth: '40rem' };

  const imageStyle = {
    display: 'block',
    width: '100%',
    height: 'auto',
    borderRadius: '0.5rem',
  };

  if (normalizedHeight) {
    imageStyle.height = normalizedHeight;
    imageStyle.objectFit = 'cover';
  }

  return (
    <figure
      style={{
        display: 'flex',
        flexDirection: 'column',
        margin: 0,
        gap: '0.75rem',
        alignItems: justifyContent,
      }}
    >
      <div style={{ display: 'flex', justifyContent, width: '100%' }}>
        <img src={imageUrl} alt={alt || caption || 'Image'} style={{ ...imageStyle, ...styleDimensions }} />
      </div>
      {caption && (
        <figcaption style={{ color: '#4b5563', fontSize: '0.95rem', textAlign: align }}>
          {caption}
        </figcaption>
      )}
    </figure>
  );
}

