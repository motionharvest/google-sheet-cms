import { notFound } from 'next/navigation';
import Navigation from '../../../(components)/Navigation.jsx';
import PlaybillContent from '../../../(components)/PlaybillContent.jsx';
import { fetchPlaybill } from '@/lib/googleSheets.js';
import { unslugify } from '@/lib/slugify.js';

export const revalidate = 60;

export default async function PlaybillPage({ params }) {
  const playbillSlug = params.slug;
  const tabParam = Array.isArray(params.tab) ? params.tab[0] ?? null : params.tab ?? null;

  const playbill = await fetchPlaybill(playbillSlug);

  if (!playbill) {
    notFound();
  }

  if (!playbill.tabs.length) {
    return (
      <>
        <Navigation title={playbill.name} slug={playbill.slug} tabs={[]} activeTabSlug={null} />
        <main style={{ padding: '2.5rem 1.5rem', maxWidth: '80rem', margin: '0 auto' }}>
          <header style={{ marginBottom: '2rem' }}>
            <h1 style={{ fontSize: '2.75rem', marginBottom: '0.5rem' }}>{playbill.name}</h1>
            <p style={{ color: '#4b5563', fontSize: '1.1rem' }}>{unslugify(playbillSlug)}</p>
            {playbill.config?.description && (
              <p style={{ color: '#4b5563', maxWidth: '48rem' }}>{playbill.config.description}</p>
            )}
          </header>
          <p>This playbill does not have any visible tabs yet.</p>
        </main>
      </>
    );
  }

  const activeTabSlug = tabParam ?? playbill.tabs[0]?.slug ?? null;
  const activeTab = playbill.tabs.find((tab) => tab.slug === activeTabSlug) ?? playbill.tabs[0] ?? null;
  const sectionTitle = activeTab?.title ?? unslugify(activeTabSlug ?? '');

  return (
    <>
      <Navigation
        title={playbill.name}
        slug={playbill.slug}
        tabs={playbill.tabs}
        activeTabSlug={activeTab?.slug ?? null}
      />
      <main style={{ padding: '2.5rem 1.5rem', maxWidth: '80rem', margin: '0 auto' }}>
        <header style={{ marginBottom: '2rem' }}>
          {playbill.config?.description && (
            <p style={{ color: '#4b5563', maxWidth: '48rem' }}>{playbill.config.description}</p>
          )}
        </header>

        <PlaybillContent tab={activeTab} config={playbill.config} showHeading={false} />
      </main>
    </>
  );
}
