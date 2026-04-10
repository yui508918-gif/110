export async function POST(req) {
  const { code, buyPrice } = await req.json();

  const stockRes = await fetch(
    `http://web.juhe.cn/finance/stock/hs?gid=${code}&key=${process.env.JUHE_API_KEY}`
  );
  const stockData = await stockRes.json();

  if (!stockData.result) {
    return Response.json({ error: "数据获取失败" });
  }

  const stock = stockData.result[0].data;
  const price = parseFloat(stock.nowPri);

  let advice = "观望";
  if (buyPrice) {
    const profit = (price - buyPrice) / buyPrice;
    if (profit > 0.1) advice = "止盈";
    else if (profit < -0.05) advice = "止损";
    else advice = "持有";
  }

  // ✅ Gemini AI
  const aiRes = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${process.env.GEMINI_API_KEY}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: `分析股票：${stock.name} 当前价${price} 成交量${stock.volume}，给出趋势和建议`
          }]
        }]
      })
    }
  );

  const aiData = await aiRes.json();
  const ai = aiData?.candidates?.[0]?.content?.parts?.[0]?.text || "分析失败";

  return Response.json({
    name: stock.name,
    currentPrice: price,
    trend: price > stock.yestodEndPri ? "偏多" : "偏空",
    advice,
    ai
  });
}
