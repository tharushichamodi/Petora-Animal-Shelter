import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Axios from 'axios';

import './css/signup.css';
import signupImg from './images/signup_image.png';
import catImage from './images/cat.png';
import googleIcon from './images/google.png';
import appleIcon from './images/apple.png';

function Signup() {
  const [activeForm, setActiveForm] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    acceptTerms: false
  });


  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.username.trim()) newErrors.username = 'Username required';
    if (!/^\S+@\S+\.\S+$/.test(formData.email)) newErrors.email = 'Invalid email';
    if (formData.password.length < 8) newErrors.password = 'Password must be 8+ characters';
    if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'Passwords do not match';
    if (!formData.acceptTerms) newErrors.acceptTerms = 'You must accept terms';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

const handleSubmit = (e) => {
  e.preventDefault();
  if (validateForm()) {
    // This is where you add your API call
    const payload = {
      userName: formData.username,
      userEmail: formData.email,
      password: formData.password
    }
    console.log(formData.password);
    Axios.post('http://localhost:3001/user/api/users', payload)
      .then((response) => {
        console.log('Form submitted successfully:', response.data);
        // Reset the form after successful submission
        setFormData({
          username: '',
          email: '',
          password: '',
          confirmPassword: '',
          acceptTerms: false
        });
        // You can also add logic to show a success message or redirect the user
        alert('Registration Successful!');
        navigate('/home');          // <-- path to your home page

      })
      .catch((error) => {
        console.error('There was an error submitting the form:', error);
        // You can handle different error scenarios here, e.g., show a user-friendly error message
        alert('Registration failed. Please try again.');
      });
  }
};

const [loginForm, setLoginForm] = useState({
  email: '',
  password: ''
});
const [loginErrors, setLoginErrors] = useState({});

const validateLogin = () => {
  const errs = {};
  if (!/^\S+@\S+\.\S+$/.test(loginForm.email)) errs.email = 'Invalid email';
  if (!loginForm.password) errs.password = 'Password required';
  setLoginErrors(errs);
  return Object.keys(errs).length === 0;
};

const [creadentials, setCredentials] = useState(["onload"]);
const handleLoginSubmit = (e) => {
  e.preventDefault();
  if (validateLogin()){

  Axios.get('http://localhost:3001/user/api/users')
    .then((res) => {
      console.log('users found:', res.data);
      // Optional: store token or user in localStorage/session
      setCredentials(res.data)
    })
    .catch((err) => {
      console.error('users not found:', err);
      alert(
        err.response?.data?.message || 'Invalid email or password'
      );
    });
};
}
useEffect(() => {
  if(creadentials[0] !== "onload")   
   validateLogins();
}, [creadentials]);

const [empType, setEmpType] = useState("")

const validateLogins = () => {
  // Find the user object whose email & password match the login form
  const matchedUser = creadentials.find(
    (user) =>
      user.userEmail === loginForm.email &&
      user.password === loginForm.password
  );
  let userID = null;
  if (matchedUser) {
    // You can access any property from the matching object, e.g.:
    userID = matchedUser.userID;
    console.log('Matched userID:', userID);
    localStorage.setItem('userID', matchedUser.userID);
    const userType = matchedUser.userType
    if(userType === 'customer'){
      navigate('/home');

    }
    
    else{
      Axios.get(`http://localhost:3001/employee/api/employees`)
      .then((res) => {

        console.log('employee found:', res.data);
        // Optional: store token or user in localStorage/session
        const role = res.data.find(emp => emp.userID === userID).role;
        console.log(role)
        
        setEmpType(role)
        
      })
      .catch((err) => {
        console.error('employee not found:', err);
        alert(
          err.response?.data?.message || 'Invalid email or password'
        );
      });
      if(empType === 'Animal Manager'){
        navigate('/animal_manager_dashboard')
        }
      else if(empType === 'Adoption Officer'){
        navigate('/adoption_officer_dashboard')
      }
      else if(empType === 'Daycare Manager'){
        navigate('/daycare_manager_dashboard')
      }
      else if(empType === 'Grooming Officer'){
        navigate('/grooming_coordinator_dashboard')
      }
      else if(empType === 'Vet'){
        navigate('/veterinary_dashboard')
      }
      else if(empType === 'Training coordinator'){
        navigate('/training_coordinator_dashboard')
      }
      else if(empType === 'Groomer'){
        navigate('/groomer_dashboard')
      }
    }
    console.log(empType)
  } else {

    alert("Invalid Credentials")
  }
};

const navigate = useNavigate();

  return (
    <div className='signup_cont'>
      <header className="signup_header">
        <div>
          <span >Home</span>
          <span>About Us</span>
          <span>Contact Us</span>          
        </div>
      </header>
      <div className="main_container">
      {/* Base Layer - Always Visible */}
      <div className="base_layer">
        <img src={signupImg} alt="Happy Cat" className="cat_img" />

        <div className="welcome_box">
          <h1>Find Your Best Pet!</h1>
          <p>Now you can find a pet for your lovely family in just a few minutes.</p>
          <div className="action_buttons">
            <button 
              className="primary_btn" 
              onClick={() => setActiveForm('signup')}
            >
              Get Started
            </button>
            <button 
              className="secondary_btn" 
              onClick={() => setActiveForm('login')}
            >
              I Have an Account
            </button>
          </div>
        </div>
      </div>

      {/* Overlay Layer - Conditional Forms */}
      {activeForm && (
        <div className="overlay_layer">
          <div className={`form_box ${activeForm}`}>
            <button 
              className="close_btn" 
              onClick={() => setActiveForm(null)}
              aria-label="Close form"
            >
              &times;
            </button>

            {activeForm === 'signup' ? (
              <>
                <h2>Create your account</h2>
                <form onSubmit={handleSubmit}>
                  <div className="input_group">
                    <input
                      type="text"
                      name="username"
                      placeholder="Username"
                      value={formData.username}
                      onChange={handleChange}
                      className={errors.username ? 'error_input' : ''}
                    />
                    {errors.username && <span className="error">{errors.username}</span>}
                  </div>

                  <div className="input_group">
                    <input
                      type="email"
                      name="email"
                      placeholder="Email"
                      value={formData.email}
                      onChange={handleChange}
                      className={errors.email ? 'error-input' : ''}
                    />
                    {errors.email && <span className="error">{errors.email}</span>}
                  </div>

                  <div className="input_group password_field">
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      placeholder="Password"
                      value={formData.password}
                      onChange={handleChange}
                      className={errors.password ? 'error_input' : ''}
                    />
                    <span 
                      className="toggle_password"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? '🙈' : '👁️'}
                    </span>
                    {errors.password && <span className="error">{errors.password}</span>}
                  </div>

                  <div className="input_group">
                    <input
                      type={showPassword ? "text" : "password"}
                      name="confirmPassword"
                      placeholder="Confirm Password"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      className={errors.confirmPassword ? 'error_input' : ''}
                    />
                    {errors.confirmPassword && <span className="error">{errors.confirmPassword}</span>}
                  </div>

                  <div className="checkbox_group">
                    <input
                      type="checkbox"
                      id="terms"
                      name="acceptTerms"
                      checked={formData.acceptTerms}
                      onChange={handleChange}
                    />
                    <label htmlFor="terms">
                      I accept <a href="#">Privacy Policy</a> & <a href="#">Terms of Use</a>
                    </label>
                    {errors.acceptTerms && <span className="error">{errors.acceptTerms}</span>}
                  </div>
                  <div style={{width:'100%', display:'flex', justifyContent:'center',alignItems:'center'}}><button type="submit" className="submit_btn">
                    Sign Up
                  </button></div>
                  

                  <div className="divider">OR</div>

                  <div className="social_logins">
                    <button type="button" className="google_btn">
                      <img src={googleIcon} alt="Google" />
                      Sign Up with Google
                    </button>
                    <button type="button" className="apple_btn">
                      <img src={appleIcon} alt="Apple" />
                      Sign Up with Apple
                    </button>
                  </div>

                  <p className="switch_form">
                    Already have an account?{' '}
                    <span onClick={() => setActiveForm('login')}>Log In</span>
                  </p>
                </form>
              </>
            ) : (
              <>
                <h2>Welcome Back</h2>
                <form onSubmit={handleLoginSubmit}>
                  <div className="input_group">
                    <input
                      type="email"
                      name="email"
                      placeholder="Email"
                      value={loginForm.email}
                      onChange={(e) =>
                        setLoginForm({ ...loginForm, email: e.target.value })
                      }
                      className={loginErrors.email ? 'error_input' : ''}
                    />
                    {loginErrors.email && <span className="error">{loginErrors.email}</span>}
                  </div>

                  <div className="input_group password_field">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      name="password"
                      placeholder="Password"
                      value={loginForm.password}
                      onChange={(e) =>
                        setLoginForm({ ...loginForm, password: e.target.value })
                      }
                      className={loginErrors.password ? 'error_input' : ''}
                    />
                    <span
                      className="toggle_password"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? '🙈' : '👁️'}
                    </span>
                    {loginErrors.password && (
                      <span className="error">{loginErrors.password}</span>
                    )}
                  </div>
                  <div style={{width:'100%', display:'flex', justifyContent:'center',alignItems:'center'}}>
                  <button type="submit" className="signup submit_btn">
                    Log In
                  </button>
                  </div>
                  <p className="forgot_password">
                    <span>Forgot Password?</span>
                  </p>
                  <div className="divider">OR</div>
                  <div className="social_logins">
                    <button type="button" className="google_btn">
                      <img src={googleIcon} alt="Google" />
                      Log In with Google
                    </button>
                    <button type="button" className="apple_btn">
                      <img src={appleIcon} alt="Apple" />
                      Log In with Apple
                    </button>
                  </div>
                  <p className="switch_form">
                    Don't have an account?{' '}
                    <span onClick={() => setActiveForm('signup')}>Sign Up</span>
                  </p>
                </form>
              </>
            )}
          </div>
        </div>
      )}
    </div>
    </div>
    
  );
}

export default Signup;