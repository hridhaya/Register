'use client';
import { useState } from 'react';

export default function Register() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
  });
  const [otp, setOtp] = useState(''); // State to store the OTP entered by the user
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [otpSent, setOtpSent] = useState(false); // State to track if OTP has been sent
  const [otpVerified, setOtpVerified] = useState(false); // State to track if OTP has been verified

//  form submission handling

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleOtpChange = (e) => {
    setOtp(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch('http://localhost:5000/send-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        // Handle specific error message for already registered email
        if (response.status === 400 && data.message === 'Already registered with this email') {
          setError('This email is already registered. Please use a different email.');
        } else {
          setError(data.message || 'Registration Failed');
        }
        return;
      }

      setOtpSent(true);
      alert('OTP sent to your email. Please check your inbox!');
      console.log('Form Data Submitted:', formData);
    } catch (error) {
      console.error('Error:', error);
      setError('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

// OTP verification handling
const handleOtpSubmit = async (e) => {
  e.preventDefault();
  setIsLoading(true);
  setError(null);

  try {
    const response = await fetch('http://localhost:5000/verify-otp', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email: formData.email, otp }),
    });

    const data = await response.json();

    if (!response.ok) {
      // Check the response message to display specific error
      if (data.message === 'Invalid OTP') {
        setError('The OTP you entered is invalid. Please try again.');
      } else if (data.message === 'OTP has expired') {
        setError('The OTP has expired. Please request a new OTP.');
      } else {
        setError(data.message || 'OTP Verification Failed');
      }
      return;
    }

    setOtpVerified(true); // OTP verified successfully
    alert('OTP verified successfully! Registration complete.');
    
  } catch (error) {
    console.error('Error:', error);
    setError('An error occurred. Please try again.');
  } finally {
    setIsLoading(false);
  }
};


  return (
    <div style={{ maxWidth: '400px', margin: 'auto', padding: '20px' }}>

      {!otpSent ? (
        <form onSubmit={handleSubmit} className='form' autoComplete='on'>
          <h2>Register</h2>
          <div style={{ marginBottom: '10px' }}>
            <input
              type='text'
              name='username'
              value={formData.username}
              onChange={handleChange}
              autoComplete='name'
              placeholder='Name'
              required
              style={{ width: '100%', padding: '8px', margin: '5px 0' }}
            />
          </div>

          <div style={{ marginBottom: '10px' }}>
            <input
              type='email'
              name='email'
              value={formData.email}
              placeholder='E-mail'
              onChange={handleChange}
              autoComplete='email'
              required
              style={{ width: '100%', padding: '8px', margin: '5px 0' }}
            />
          </div>

          {error && <p style={{ color: 'red' }}>{error}</p>}

          <button
            type='submit'
            style={{
              width: '100%',
              padding: '10px',
              backgroundColor: '#28a745',
              color: '#000000',
              border: 'none',
              cursor: 'pointer',
            }}
          >
            {isLoading ? 'Sending OTP...' : 'Register'}
          </button>
        </form>
      ) : (
        <form onSubmit={handleOtpSubmit} className='form'>
          <h2>OTP Verification</h2>
          <div style={{ marginBottom: '10px' }}>
            <input
              type='text'
              name='otp'
              value={otp}
              onChange={handleOtpChange}
              placeholder='Enter OTP'
              required
              style={{ width: '100%', padding: '8px', margin: '5px 0' }}
            />
          </div>

          {error && <p style={{ color: 'red' }}>{error}</p>}

          <button
            type='submit'
            style={{
              width: '100%',
              padding: '10px',
              backgroundColor: '#28a745',
              color: '#000000',
              border: 'none',
              cursor: 'pointer',
            }}
          >
            {isLoading ? 'Verifying OTP...' : 'Verify OTP'}
          </button>
        </form>
      )}

      {otpVerified && <p style={{ color: 'green' }}>Registration Complete!</p>}
    </div>
  );
}
