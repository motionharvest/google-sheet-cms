import Link from 'next/link';

export default function PlaybillNav({ slug, tabs, activeTabSlug }) {
  if (!tabs?.length) return null;

  return (
    <nav style={{ borderBottom: '1px solid #e5e7eb', marginBottom: '1.5rem' }}>
      <ul
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          listStyle: 'none',
          gap: '0.5rem',
        }}
      >
        {tabs.map((tab, index) => {
          const href = index === 0 ? `/${slug}` : `/${slug}/${tab.slug}`;
          const isActive = index === 0 ? (!activeTabSlug || activeTabSlug === tab.slug) : activeTabSlug === tab.slug;
          return (
            <li key={tab.slug || tab.title}>
              <Link
                href={href}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  padding: '0.5rem 0.95rem',
                  borderRadius: '9999px',
                  textDecoration: 'none',
                  background: isActive ? '#111827' : '#f3f4f6',
                  color: isActive ? '#f9fafb' : '#1f2937',
                  fontWeight: 600,
                  transition: 'background 160ms ease',
                }}
              >
                {tab.title}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
