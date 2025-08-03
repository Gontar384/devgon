export default async function globalSetup() {
  const res = await fetch('http://localhost:4000/test-utils/reset-db', {
    method: 'POST',
  });

  if (res.ok) {
    console.log('Successfully set up');
  }

  if (!res.ok) {
    throw new Error(`Failed to reset DB. Status: ${res.status}`);
  }
}
