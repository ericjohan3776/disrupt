import React, { useState, useRef, useEffect } from 'react';

// IMPORTANT: Replace 'YOUR_API_KEY' in HELIUS_RPC_URL with your actual Helius API key before deploying to Netlify.
const HELIUS_RPC_URL = 'https://rpc.helius.xyz/?api-key=7a326393-36cf-4fbc-888f-3b6ae0d9bbed'; // Replace with your Helius API key
const DEMO_WALLET = '5KnfDQQJ8k5upjqZDuBgCKDGeGcPXxwB2fKdWiydsAXG'; // Replace with a real wallet if desired

function getBalance(wallet) {
  return fetch(HELIUS_RPC_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      jsonrpc: '2.0',
      id: 1,
      method: 'getBalance',
      params: [wallet],
    }),
  })
    .then((res) => res.json())
    .then((data) => data.result?.value || 0)
    .catch(() => 0);
}

export default function App() {
  const [clicks, setClicks] = useState(0);
  const [balance, setBalance] = useState(null);
  const [cps, setCps] = useState(0);
  const clickTimes = useRef([]);

  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now();
      clickTimes.current = clickTimes.current.filter((t) => now - t < 1000);
      setCps(clickTimes.current.length);
    }, 100);
    return () => clearInterval(interval);
  }, []);

  const handleClick = async () => {
    setClicks((c) => c + 1);
    clickTimes.current.push(Date.now());
    const bal = await getBalance(DEMO_WALLET);
    setBalance(bal);
  };

  return (
    <div style={{ textAlign: 'center', marginTop: 40 }}>
      <h1>Helius Clicker Game</h1>
      <button style={{ fontSize: 32, padding: '20px 40px' }} onClick={handleClick}>
        Click me!
      </button>
      <div style={{ marginTop: 30 }}>
        <h2>Stats</h2>
        <p>Total Clicks: {clicks}</p>
        <p>Clicks per Second: {cps}</p>
        <p>Last Balance: {balance === null ? 'N/A' : balance}</p>
      </div>
      <div style={{ marginTop: 40, fontSize: 12, color: '#888' }}>
        <p>Demo wallet: {DEMO_WALLET}</p>
        <p>Helius endpoint: {HELIUS_RPC_URL}</p>
      </div>
    </div>
  );
} 