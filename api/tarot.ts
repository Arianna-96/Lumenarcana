export const config = { runtime: "edge" };

export default async function handler(req: Request): Promise<Response> {
  const res = await fetch(
    "https://tarot-api-3hv5.onrender.com/api/v1/cards?type=major"
  );
  const data = await res.json();

  return new Response(JSON.stringify(data), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}
