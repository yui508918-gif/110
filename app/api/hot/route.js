export async function GET() {
  const res = await fetch(
    `http://web.juhe.cn/finance/stock/hot?key=${process.env.JUHE_API_KEY}`
  );
  const data = await res.json();
  return Response.json(data.result || []);
}
