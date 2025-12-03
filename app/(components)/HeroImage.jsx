export default function HeroImage({ imageUrl, heading = '', body = '', alt = 'Hero image', caption = '' }) {
  if (!imageUrl) {
    return null;
  }

  return (
    <article style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <figure style={{ margin: 0 }}>
        <div
          style={{
            width: '100%',
            borderRadius: '0.75rem',
            overflow: 'hidden',
            backgroundColor: '#f3f4f6',
          }}
        >
          <img
            src={imageUrl}
            alt={alt || caption || heading || 'Hero image'}
            style={{ display: 'block', width: '100%', height: 'auto' }}
          />
        </div>

        {(heading || body || caption) && (
          <figcaption style={{ marginTop: '0.75rem', color: '#4b5563' }}>
            {heading && (
              <h3 style={{ fontSize: '2.25rem', lineHeight: 1.2, margin: '0 0 0.5rem', color: '#111827' }}>
                {heading}
              </h3>
            )}
            {body && <p style={{ margin: '0 0 0.5rem' }}>{body}</p>}
            {caption && <p style={{ margin: 0, fontSize: '0.95rem' }}>{caption}</p>}
          </figcaption>
        )}
      </figure>
    </article>
  );
}

