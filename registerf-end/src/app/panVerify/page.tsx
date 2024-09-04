'use client';
import React, { useState } from 'react';
import { useRouter } from "next/navigation";


const PanVerify = () => {
  const router = useRouter();

  const [panNumber, setPanNumber] = useState('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [message, setMessage] = useState('');

  const handleVerify = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('http://localhost:5000/api/pan/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ panNumber }),
      });

      const responsedata = await response.json();
      const data = responsedata.dataResponse;
      if (response.ok) {
        setMessage(data.message);
        if (data.result.link_status === true) {
          setMessage('PAN verified');
      router.push(`/gstVerify`);

        } else {
          setMessage('Invalid PAN');
        }
      } else {
        setMessage(data.error || 'Verification failed');
      }
    } catch (error) {
      setMessage('An error occurred while verifying PAN!');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: 'auto', padding: '20px' }}>
      <h2>PAN Card Verification</h2>
      <input
        type="text"
        placeholder="PAN Card Number"
        value={panNumber}
        onChange={(e) => setPanNumber(e.target.value)}
        style={{ width: "100%", padding: "8px", margin: "5px 0" }}
      />
      <button
        onClick={handleVerify}
        type="submit"
        style={{
          width: '100%',
          padding: '10px',
          backgroundColor: '#28a745',
          color: '#000000',
          border: 'none',
          cursor: 'pointer',
        }}
      >
        {isLoading ? 'Verifying PAN...' : 'Verify PAN'}
      </button>
      {message && <p>{message}</p>}
    </div>
  );
};

export default PanVerify;