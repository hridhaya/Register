'use client';
import React, { useState } from 'react';

const AadhaarVerify = () => {
  
  const [aadhaarNumber, setAadhaarNumber] = useState('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [message, setMessage] = useState('');

  const handleVerify = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('http://localhost:5000/api/aadhaar/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ aadhaarNumber }),
      });

      const responsedata = await response.json();
      const data=responsedata.dataResponse;
      if (response.ok) {
        setMessage(data.message);
        if(data.data==true){
            setMessage('Aadhar verified');
        }
        else{
            setMessage('Invalid aadhar');
        }
      } else {
        setMessage(data.error || 'Verification failed');
      }
    } catch (error) {
      setMessage('An error occurred while verifying Aadhaar!!!');
    }finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: 'auto', padding: '20px' }}>
      <h2>Aadhaar Verification</h2>
      <input
        type="text"
        placeholder="Aadhaar Number"
        value={aadhaarNumber}
        onChange={(e) => setAadhaarNumber(e.target.value)}
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
    {isLoading ? 'Verifying Aadhaar...' : 'Verify Aadhaar'}
    </button>
      {message && <p>{message}</p>}
    </div>
  );
};

export default AadhaarVerify;
