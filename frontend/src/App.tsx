import { useEffect, useState } from 'react';
import './App.css';

function App() {
  const [apiData, setApiData] = useState<any>(null);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    // Coba nembak ke port 5000 (Backend Express)
    fetch('http://localhost:5000/api/status')
      .then((res) => {
        if (!res.ok) throw new Error('Nggak bisa konek ke backend, portnya udah jalan belom?');
        return res.json();
      })
      .then((data) => setApiData(data))
      .catch((err) => setErrorMsg(err.message));
  }, []);

  return (
    <div className="card">
      <h1>Cek Jalur Frontend ke Backend</h1>
      
      {errorMsg && (
        <div style={{ color: 'red', border: '1px solid red', padding: '10px' }}>
          <strong>Waduh Error:</strong> {errorMsg}
        </div>
      )}

      {apiData ? (
        <div style={{ textAlign: 'left', background: '#242424', padding: '20px', borderRadius: '8px' }}>
          <p>✅ <strong>Status:</strong> {apiData.message}</p>
          <p>🗄️ <strong>DB State:</strong> {apiData.databaseStatus}</p>
          <hr />
          <p>Data Dummy yg nyampe dari Backend:</p>
          <pre>{JSON.stringify(apiData.dummyData, null, 2)}</pre>
        </div>
      ) : (
        !errorMsg && <p>Sabar, lagi nyoba nelpon backend nih...</p>
      )}
    </div>
  );
}

export default App;
