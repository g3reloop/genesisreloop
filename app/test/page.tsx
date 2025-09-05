export default function TestPage() {
  return (
    <div style={{ background: 'black', color: 'white', padding: '50px', minHeight: '100vh' }}>
      <h1 style={{ fontSize: '48px', marginBottom: '20px' }}>Genesis Reloop Test Page</h1>
      <p style={{ fontSize: '24px', marginBottom: '20px' }}>If you can see this styled text, basic rendering works.</p>
      <div style={{ background: '#10b981', padding: '20px', borderRadius: '8px', marginTop: '20px' }}>
        <p>This should have a green background.</p>
      </div>
    </div>
  );
}
