'use client';
import React, { useState } from 'react';

const AddressLookup= () => {
  const [pinCode, setPinCode] = useState('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [message, setMessage] = useState('');

  const handleVerify = async () => {
    

    setIsLoading(true);
    try {
      const response = await fetch('http://localhost:5000/api/pinCode/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pinCode }),
      });

      const responsedata = await response.json();
      const data = responsedata.dataResponse[0];
      if (response.ok) {
        setMessage(data.message);
        if (data.Status=== 'Success') {
        //   setMessage('Found');
          const { Name: city, District: district, State: state } = data.PostOffice[0];
        setMessage(`City: ${city}
            District: ${district}
             State: ${state}`);
      
        //   const city=data.PostOffice[0].Name;
        //   const b=data.PostOffice[0].District;
        //   const a=data.PostOffice[0].State;

        } else {
          setMessage('Not Found');
        }
      } else {
        setMessage(data.error || 'Searching failed');
      }
    } catch (error) {
      setMessage('An error occurred while searching!');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: 'auto', padding: '20px' }}>
      <h2>Address Lookup</h2>
      <input
        type="text"
        placeholder="Pin Code"
        value={pinCode}
        onChange={(e) => setPinCode(e.target.value)}
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
        {isLoading ? 'Searching...' : 'Search'}
      </button>
      {message && <p>{message}</p>}
    </div>
  );
};

export default AddressLookup;
