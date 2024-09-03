'use client';
import { useState, ChangeEvent, FormEvent } from 'react';
import { useRouter } from "next/navigation";

interface FormData {
  username: string;
  email: string;
  phoneNumber:string;
  aadhaarNumber:string;
  // dob:string;
}

export default function Register() {
  const router = useRouter();

  const [formData, setFormData] = useState<FormData>({
    username: '',
    email: '',
    phoneNumber:'',
    aadhaarNumber:'',
    // dob:'',
  });
  const [otp, setOtp] = useState<string>(''); // State to store the OTP entered by the user
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [otpSent, setOtpSent] = useState<boolean>(false); // State to track if OTP has been sent
  const [otpVerified, setOtpVerified] = useState<boolean>(false); // State to track if OTP has been verified

  // Form data change handler
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };
  // OTP input change handler
  const handleOtpChange = (e: ChangeEvent<HTMLInputElement>) => {
    setOtp(e.target.value);
  };

  // Form submission handler for sending OTP
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('http://localhost:5000/auth/send-otp', { 
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

  // Form submission handler for verifying OTP
  const handleOtpSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('http://localhost:5000/auth/verify-otp', { // Updated to match the route in authRoutes
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
      router.push(`/phoneOtp`);
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
        <form onSubmit={handleSubmit} className="form" autoComplete="on">
          <h2>Register</h2>
          <div style={{ marginBottom: '10px' }}>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              autoComplete="name"
              placeholder="Name"
              required
              style={{ width: '100%', padding: '8px', margin: '5px 0' }}
            />
          </div>

          <div style={{ marginBottom: '10px' }}>
            <input
              type="email"
              name="email"
              value={formData.email}
              placeholder="E-mail"
              onChange={handleChange}
              autoComplete="email"
              required
              style={{ width: '100%', padding: '8px', margin: '5px 0' }}
            />
          </div>
           {/*3. Phone Number */}
        <div style={{ marginBottom: "10px" }}>
          <input
            type="tel"
            name="phoneNumber"
            value={formData.phoneNumber}
            placeholder="Phone Number"
            onChange={handleChange}
            required
            style={{ width: "100%", padding: "8px", margin: "5px 0" }}
          />
        </div>

        {/*4. Aadhaar Number*/}
        <div style={{ marginBottom: "10px" }}>
          <input
            type="text"
            name="aadhaarNumber"
            value={formData.aadhaarNumber}
            placeholder="Aadhaar Number"
            onChange={handleChange}
            required
            style={{ width: "100%", padding: "8px", margin: "5px 0" }}
          />
        </div>

        {/* <div style={{ marginBottom: "10px" }}>
          <input
            type="date"
            name="dob"
            value={formData.dob}
            placeholder="Date Of Birth"
            onChange={handleChange}
            required
            style={{ width: "100%", padding: "8px", margin: "5px 0" }}
         />
        </div>  */}

          {error && <p style={{ color: 'red' }}>{error}</p>}

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
            {isLoading ? 'Sending OTP...' : 'Register'}
          </button>
        </form>
      ) : (
        <form onSubmit={handleOtpSubmit} className="form">
          <h2>OTP Verification</h2>
          <div style={{ marginBottom: '10px' }}>
            <input
              type="text"
              name="otp"
              value={otp}
              onChange={handleOtpChange}
              placeholder="Enter OTP"
              required
              style={{ width: '100%', padding: '8px', margin: '5px 0' }}
            />
          </div>

          {error && <p style={{ color: 'red' }}>{error}</p>}

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

      {otpVerified && <p style={{ color: 'green' }}>Registration Complete!</p>}
    </div>
  );
}