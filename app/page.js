"use client";
import { useState, useEffect } from "react";

export default function Home() {
  const [code, setCode] = useState("");
  const [buyPrice, setBuyPrice] = useState("");
  const [result, setResult] = useState(null);
  const [hot, setHot] = useState([]);

  useEffect(() => {
    fetch("/api/hot")
      .then(res => res.json())
      .then(data => setHot(data || []));
  }, []);

  const analyze = async () => {
    const res = await fetch("/api/analyze", {
      method: "POST",
      body: JSON.stringify({ code, buyPrice })
    });
    const data = await res.json();
    setResult(data);
  };

  const tvCode = code.startsWith("6") ? `SH${code}` : `SZ${code}`;

  return (
    <div style={{ background:"#000", color:"#fff", minHeight:"100vh", padding:20 }}>
      <h1>🚀 AI投研系统</h1>

      <h3>🔥 市场热点</h3>
      {hot.map((i, idx) => (
        <div key={idx}>{i.name} ({i.code})</div>
      ))}

      <input placeholder="股票代码" onChange={e=>setCode(e.target.value)} />
      <input placeholder="买入价" onChange={e=>setBuyPrice(e.target.value)} />

      <button onClick={analyze}>分析</button>

      {code && (
        <iframe
          src={`https://s.tradingview.com/widgetembed/?symbol=${tvCode}&theme=dark`}
          width="100%"
          height="400"
        />
      )}

      {result && (
        <div>
          <h2>{result.name}</h2>
          <p>价格：{result.currentPrice}</p>
          <p>趋势：{result.trend}</p>
          <p>建议：{result.advice}</p>
          <pre>{result.ai}</pre>
        </div>
      )}
    </div>
  );
}
