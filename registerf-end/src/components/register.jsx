// 1. Name 2. Email 3. Phone Number 4. Aadhar Number 5. Date of Birth
"use client";
import { useState } from 'react';
import styles from '@/components/register.module.css';

export default function Register() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    phoneNumber: '',
    aadhaarNumber: '',
    dob:''
  });

  // Handle input changes
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };
   // Handle form submission
   const handleSubmit = (e) => {
    e.preventDefault();
    // Process form data (e.g., send it to an API)
    console.log('Form Data Submitted:', formData);
    alert('Registration Successful!');
  };

  return (
    <div style={{ maxWidth: '400px', margin: 'auto', padding: '20px' }}>
      <h2>Register</h2>
      <form onSubmit={handleSubmit} className={styles.form}>

         {/* 1. Name */}
        <div className='_input' style={{marginBottom:'10px'}}>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder='Name'
              required
              style={{ width: '100%', padding: '8px', margin: '5px 0' }
            }
            />
        </div>

         {/*2. Email*/}
        <div className='_input' style={{ marginBottom: '10px' }}>
            <input
              type="email"
              name="email"
              value={formData.email}
              placeholder='E-mail'
              onChange={handleChange}
              required
              style={{ width: '100%', padding: '8px', margin: '5px 0' }}
            /> 
        </div>

         {/*3. Phone Number */}
        <div className='_input' style={{marginBottom:'10px'}}>
            <input
              type="tel"
              name="phoneNumber"
              value={formData.phoneNumber}
              placeholder='Phone Number'
              onChange={handleChange}
              required
              style={{ width: '100%', padding: '8px', margin: '5px 0' }}
            />   
        </div>

         {/*4. Aadhar Number*/}
        <div className='_input' style={{marginBottom:'10px'}}>
            <input
              type="number"
              name="aadhaarNumber"
              value={formData.aadharNumber}
              placeholder='Aadhaar Number'
              onChange={handleChange}
              required
              style={{ width: '100%', padding: '8px', margin: '5px 0' }}
            />
        </div>

         {/* 5. Date of Birth */}
         <div className='_input' style={{marginBottom:'10px'}}>
          <input
            type="date"
            name="dob"
            value={formData.dob}
            placeholder='Date Of Birth'
            onChange={handleChange}
            required
            style={{ width: '100%', padding: '8px', margin: '5px 0' }}
          /> 
      </div>

        <button type="submit" style={{ width: '100%', padding: '10px', backgroundColor: '#39FF14', color: '#000000', border: 'none', cursor: 'pointer' }}>
          Register
        </button>

      </form>
    </div>
  );
}