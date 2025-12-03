export default function HomePage() {
  return (
    <main style={{ padding: '4rem 1.5rem', maxWidth: '64rem', margin: '0 auto' }}>
      <h1>Elm Shakespeare Playbill Template</h1>
      <p>
        Create a new playbill by adding a Google Sheet in the configured Drive folder.
        Each sheet tab becomes a navigation item, and bracketed tabs provide configuration values.
      </p>
      <p>
        Visit <code>/playbill-name</code> or <code>/playbill-name/section</code> to see a specific playbill
        once the sheet is available.
      </p>
    </main>
  );
}
