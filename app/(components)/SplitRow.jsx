function hasHtml(value) {
  if (!value) return false;
  return /<\/?[a-z][\s\S]*>/i.test(value.toString());
}

function renderContent(value, className, style) {
  const stringValue = value?.toString() ?? '';

  if (!stringValue.trim()) {
    return <span className={className || undefined} style={style} />;
  }

  if (hasHtml(stringValue)) {
    return (
      <span
        className={className || undefined}
        style={style}
        dangerouslySetInnerHTML={{ __html: stringValue }}
      />
    );
  }

  return (
    <span className={className || undefined} style={style}>
      {stringValue}
    </span>
  );
}

export default function SplitRow({
  left = '',
  right = '',
  className = '',
  leftClass = '',
  rightClass = '',
}) {
  const baseRowStyle = className
    ? undefined
    : {
        display: 'flex',
        width: '100%',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: '1rem',
        padding: '0.5rem 0',
        borderBottom: '1px solid rgba(148, 163, 184, 0.35)',
      };

  const leftDefaultStyle = !leftClass
    ? {
        fontWeight: 600,
        flex: 1,
        minWidth: 0,
        letterSpacing: '0.08em',
      }
    : undefined;

  const rightDefaultStyle = !rightClass
    ? {
        fontWeight: 500,
        marginLeft: 'auto',
        minWidth: 0,
        textAlign: 'right',
      }
    : undefined;

  return (
    <div
      className={className || undefined}
      style={baseRowStyle}
    >
      {renderContent(left, leftClass, leftDefaultStyle)}
      {renderContent(right, rightClass, rightDefaultStyle)}
    </div>
  );
}

