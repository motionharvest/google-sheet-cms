'use client';

import Link from 'next/link';

export default function TOC({ title, slug, tabs = [], activeTabSlug = null, extraLinks = [], onNavigate }) {
  const items = tabs.map((tab, index) => {
    const href = index === 0 ? `/${slug}` : `/${slug}/${tab.slug}`;
    return {
      key: tab.slug || tab.title || `tab-${index}`,
      label: tab.title,
      href,
      active: activeTabSlug ? tab.slug === activeTabSlug : index === 0,
      external: false,
    };
  });

  const normalizedExtras = extraLinks.map((link, index) => ({
    key: link.key || link.slug || `extra-${index}`,
    label: link.label || link.title || link.text || `Link ${index + 1}`,
    href: link.href,
    active: Boolean(link.active),
    external: link.external ?? (typeof link.href === 'string' ? link.href.startsWith('http') : false),
  }));

  const links = [...items, ...normalizedExtras];

  return (
    <div className="wrap">
      <div className="toc">
        {title && <h2>{title}</h2>}
        {tabs.length > 0 && <p>Jump To</p>}
        <ul className="playbill-highlights--list">
          {links.map((item) => (
            <li key={item.key} className={item.active ? 'active' : undefined}>
              {item.external ? (
                <a
                  href={item.href}
                  target="_blank"
                  rel="noreferrer"
                  className="toc-link"
                  onClick={() => onNavigate?.()}
                >
                  <div className="toc-item">
                    <span>{item.label}</span>
                    <span className="toc-item__icon">➜</span>
                  </div>
                </a>
              ) : (
                <Link
                  href={item.href}
                  className="toc-link"
                  onClick={() => onNavigate?.()}
                >
                  <div className="toc-item">
                    <span>{item.label}</span>
                    <span className="toc-item__icon">➜</span>
                  </div>
                </Link>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
