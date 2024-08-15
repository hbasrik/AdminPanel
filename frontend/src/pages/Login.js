import React from 'react';
import {useRef, useState, useEffect, useContext} from 'react';
import axios from '../api/axios';
import AuthContext from "../context/AuthProvider";
import { useNavigate , Link } from 'react-router-dom';
import bcrypt from 'bcryptjs';

const LOGIN_URL = 'http://localhost:5206/api/Account/login'
const Login = (props) => {

  const { setAuth } = useContext(AuthContext);
  const userRef = useRef();
  const errorRef=useRef();

const [username,setUser]=useState('');
const [password,setPassword]=useState('');
const [errorMessage,setErrorMessage]=useState('');
const [success,setSuccess]=useState(false);

const navigate = useNavigate(); 

useEffect (()=>{
  userRef.current.focus();
},[])

useEffect (()=>{
  setErrorMessage('');
},[username,password])

const handleSubmit= async (e) => {
  e.preventDefault();
  try {

    const response = await axios.post(LOGIN_URL,
      {
        Username: username,
        Password: password
      },
        {
            headers: { 'Content-Type': 'application/json' },
            withCredentials: true
        }
    );
    
    console.log(response);
    
    if (response.status === 200) {
      const token = response.data.token;
      setAuth({ username, password, token });
      console.log("Auth Context:", { username, password, token });
      setUser('');
      setPassword('');
      navigate('/dashboard');
      setSuccess(true);
  }

} catch (error) {
  console.log(error);
    if (!error.response) {
        setErrorMessage('No Server Response');
    } else if (error.response?.status === 400) {
      setErrorMessage('Missing Username or Password');
    } else if (error.response?.status === 401) {
      setErrorMessage('Unauthorized');
    } else {
      setErrorMessage('Login Failed');
    }
    errorRef.current.focus();
}
}

  return (

    <section>
      <p ref={errorRef} className={errorMessage ? "errorMessage" : "offscreen"} aria-live="assertive">
            {errorMessage}
      </p>

      <h1>Sign In</h1>

      <form onSubmit={handleSubmit}>
        <label htmlFor='username'>Username: </label>
        <input 
        type='text' 
        id='username'
        ref={userRef}
        autoComplete='off'
        onChange={(e)=>setUser(e.target.value)}
        value={username}
        required
        />
      
      <label htmlFor='password'>Password: </label>
        <input 
        type='password' 
        id='password'
        onChange={(e)=>setPassword(e.target.value)}
        value={password}
        required
        />
        <button>Sign In</button>
      </form>
      <p>Need an account? <br/>
      <span className='line'>
      {/* <a onClick={() => props.onFormSwitch('register')}>Sing Up</a> */}
      <Link to="/register">Sign Up</Link>
      </span>
      </p>

    </section>

  )

}

export default Login
