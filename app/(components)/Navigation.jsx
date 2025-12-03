'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import TOC from './TOC.jsx';
import { unslugify } from '@/lib/slugify.js';

export default function Navigation({ title, slug, tabs = [], activeTabSlug = null, extraLinks = [] }) {
  const [navOpen, setNavOpen] = useState(false);
  const [theme, setTheme] = useState('light');

  useEffect(() => {
    const storedTheme = typeof window !== 'undefined' ? localStorage.getItem('theme') : null;
    if (storedTheme) {
      setTheme(storedTheme);
      document.documentElement.setAttribute('data-theme', storedTheme);
    } else {
      document.documentElement.setAttribute('data-theme', 'light');
    }
  }, []);

  useEffect(() => {
    document.body.style.overflow = navOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [navOpen]);

  const toggleTheme = () => {
    const nextTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(nextTheme);
    document.documentElement.setAttribute('data-theme', nextTheme);
    localStorage.setItem('theme', nextTheme);
  };

  const displayTitle = title ? unslugify(title) : unslugify(slug);

  return (
    <>
      <div className="navbar">
        <button
          type="button"
          aria-label="Toggle navigation"
          className="hamburger"
          onClick={() => setNavOpen((prev) => !prev)}
        >
          <span className="hamburger-lines">
            <span />
            <span />
            <span />
          </span>
          <span className="menu-label">{navOpen ? 'Close Menu' : 'Open Menu'}</span>
        </button>

        <div className="navbar-controls">
          <Link className="nav-title" href={`/${slug}`}>
            {displayTitle}
          </Link>
          <button type="button" className="theme-toggle" onClick={toggleTheme}>
            {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
          </button>
        </div>
      </div>

      {navOpen && (
        <div id="elm_super_menu" className="fadein">
          <button
            type="button"
            aria-label="Close navigation"
            className="close-menu"
            onClick={() => setNavOpen(false)}
          >
            <span aria-hidden="true">×</span>
            <span>Close Menu</span>
          </button>

          <TOC
            title={title}
            slug={slug}
            tabs={tabs}
            activeTabSlug={activeTabSlug}
            extraLinks={extraLinks}
            onNavigate={() => setNavOpen(false)}
          />
        </div>
      )}

      <div className="navbar-spacer" />
    </>
  );
}
