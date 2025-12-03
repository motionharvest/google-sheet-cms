function normalizeHeight(value) {
  if (value === undefined || value === null) return '100%';
  const raw = value.toString().trim();
  if (!raw) return '100%';

  // If it's just a number, assume pixels
  if (/^\d+(\.\d+)?$/.test(raw)) {
    return `${raw}px`;
  }

  // Otherwise use as-is (could be '100%', '50vh', '400px', etc.)
  return raw;
}

export default function Embed({ url = '', title = '', height = '', style = {} }) {
  if (!url) return null;

  const normalizedHeight = normalizeHeight(height);

  const containerStyle = {
    width: '100%',
    height: normalizedHeight,
    ...style,
  };

  const iframeStyle = {
    width: '100%',
    height: '100%',
    border: 'none',
    display: 'block',
  };

  return (
    <div style={containerStyle}>
      <iframe
        src={url}
        title={title || 'Embedded content'}
        style={iframeStyle}
        allowFullScreen
        loading="lazy"
      />
    </div>
  );
}

