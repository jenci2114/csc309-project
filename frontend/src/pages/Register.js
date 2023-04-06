import React, { useState } from 'react';
export default Register;

function Register() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    password2: '',
  });

  const [errorMessage, setErrorMessage] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.password2) {
      setErrorMessage('Passwords do not match.');
      return;
    }

    if (formData.password.length < 8) {
      setErrorMessage('Password must be at least 8 characters long.');
      return;
    }

    const response = await fetch('http://localhost:8000/account/register/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: formData.username,
        email: formData.email,
        password: formData.password,
        password2: formData.password2,
      }),
    });

    if (response.status === 201) {
      setErrorMessage('');
      window.alert('Successfully registered! Click OK to go to the login page.');
      window.location.href = '/login';
    } else {
      const data = await response.json();
      setErrorMessage(data.message || 'User name already existed.');
    }
  };

  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'center', paddingTop: '15vh' }}>
        <h1 className="display-4">Welcome to Restify</h1>
      </div>
      <div className="container" style={{ marginTop: '30px', marginBottom: '0px' }}>
        {errorMessage && (
          <div className="col-lg-4 alert alert-danger start-50 translate-middle" role="alert" style={{bottom:"-20px"}}>
            {errorMessage}
          </div>
        )}
        <div className="row mb-3">
          <div className="col-lg-4 themed-grid-col"></div>
          <div className="col-lg-4 themed-grid-col user-form">
            <form onSubmit={handleSubmit}>
              <div className="form-floating mb-3">
                <input
                  type="text"
                  className="form-control"
                  id="username"
                  name="username"
                  placeholder="name@example.com"
                  value={formData.username}
                  onChange={handleChange}
                />
                <label htmlFor="username">Username</label>
              </div>
              <div className="form-floating mb-3">
                <input
                  type="email"
                  className="form-control"
                  id="email"
                  name="email"
                  placeholder="name@example.com"
                  value={formData.email}
                  onChange={handleChange}
                />
                <label htmlFor="email">Email address</label>
              </div>

              <div className="form-floating" style={{ marginBottom: '10px' }}>
                <input
                  type="password"
                  className="form-control"
                  id="password"
                  name="password"
                  placeholder="Password"
                  value={formData.password}
                  onChange={handleChange}
                />
                <label htmlFor="password">Password</label>
              </div>
              <div className="form-floating" style={{ marginBottom: '20px' }}>
                <input
                  type="password"
                  className="form-control"
                  id="password2"
                  name="password2"
                  placeholder="Confirm Password"
                  value={formData.password2}
                  onChange={handleChange}
                />
                <label htmlFor="password2">Confirm Password</label>
              </div>
              <button type="submit" className="btn btn-dark">
                Register
              </button>
              <a href="/login" className="link-secondary" style={{ paddingLeft: '1rem' }}>
            Already have an account? Login
          </a>
        </form>
      </div>
    </div>
  </div>
</>
      );
}