'use client';
import { useState, ChangeEvent, FormEvent } from 'react';
import { useRouter } from "next/navigation";

export default function PhoneOtpPage() {

  const router = useRouter();

  const [phoneNumber, setPhoneNumber] = useState<string>('');
  const [otp, setOtp] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [otpSent, setOtpSent] = useState<boolean>(false);
  const [otpVerified, setOtpVerified] = useState<boolean>(false);

  
  const handlePhoneNumberChange = (e: ChangeEvent<HTMLInputElement>) => {
    setPhoneNumber(e.target.value);
  };
  
// change otp
  const handleOtpChange = (e: ChangeEvent<HTMLInputElement>) => {
    setOtp(e.target.value);
  };

// send otp
  const handleSendOtp = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('http://localhost:5000/mobile-otp/send-mobile-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ phoneNumber }),
      });

      const data = await response.json();
      if (!response.ok) {
        setError(data.message || 'Failed to send OTP');
        return;
      }

      setOtpSent(true);
      alert('OTP sent to your mobile number!');
    } catch (error) {
      console.error('Error:', error);
      setError('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

// verify otp
  const handleVerifyOtp = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('http://localhost:5000/mobile-otp/verify-mobile-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ phoneNumber, otp }),
      });

      const data = await response.json();
      if (!response.ok) {
        setError(data.message || 'Failed to verify OTP');
        return;
      }

      setOtpVerified(true);
      alert('OTP verified successfully!');
      router.push(`/aadhaarVerify`);

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
        <form onSubmit={handleSendOtp}>
           <h2>OTP Verification</h2>
          <div style={{ marginBottom: '10px' }}>
            <input
              type="text"
              id="phoneNumber"
              value={phoneNumber}
              onChange={handlePhoneNumberChange}   
              placeholder="+91-Phone Number"
              required
              style={{ width: '100%', padding: '8px', margin: '5px 0' }}
            />
          </div>
          {error && <p className="text-red-500">{error}</p>}
          <button
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
            {isLoading ? 'Sending OTP...' : 'Send OTP'}
          </button>
        </form>
      ) : (
        <form onSubmit={handleVerifyOtp}>
          <h2>Verify OTP - Mobile</h2>
          <div>
            <input
              type="text"
              id="otp"
              value={otp}
              onChange={handleOtpChange}
              placeholder="Mobile OTP "
              required
              style={{ width: '100%', padding: '8px', margin: '5px 0' }}
            />
          </div>
          {error && <p className="text-red-500">{error}</p>}
          <button
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
            {isLoading ? 'Verifying OTP...' : 'Verify OTP'}
          </button>
        </form>
      )}
      {otpVerified && <p className="text-green-500 mt-4">OTP verified successfully!</p>}
    </div>
  );
}
