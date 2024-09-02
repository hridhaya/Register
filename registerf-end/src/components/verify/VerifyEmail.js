import React from 'react';

export default function RegisterForm({ formData, handleChange, handleSubmit, isLoading, error }) {
  return (
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
          onChange={handleChange}
          autoComplete='email'
          placeholder='E-mail'
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
  );
}
