export async function GET() {
  const response = await fetch(
    "http://localhost:3001/api",
  );

  if (!response.ok) {
    return new Response("Failed to fetch event data", { status: 500 });
  }

  const events = await response.json();

  return Response.json(events);
}
