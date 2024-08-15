import React from 'react'
import {useRef, useState, useEffect} from "react";
import { faCheck, faTimes, faInfoCircle} from "@fortawesome/free-solid-svg-icons"
import { faFontAwesomeIcon, FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from '../api/axios';
import { Link } from 'react-router-dom';
const USER_REGEX = /^[A-z][A-z0-9-_]{3,23}$/;
const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{8,24}$/;
const EMAIL_REGEX = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i;

const REGISTER_URL = 'http://localhost:5206/api/Account/register';
const Register = (props) => {
    const userRef=useRef();
    const errorRef=useRef();

    const [username,setUser]=useState();
    const [validName,setValidName]=useState(false);
    const [userFocus,setUserFocus]=useState(false);

    const [password,setPassword]=useState();
    const [validPassword,setValidPassword]=useState(false);
    const [passwordFocus,setPasswordFocus]=useState(false);

    const [email,setEmail]=useState();
    const [validEmail,setValidEmail]=useState(false);
    const [emailFocus,setEmailFocus]=useState(false);

    const [errorMessage,setErrorMessage]=useState('');
    const [success, setSuccess] = useState(false);


    useEffect(()=>{
        userRef.current.focus();
    },[])

    useEffect(()=>{
        const result= USER_REGEX.test(username);
        console.log(username);
        console.log(result);
        setValidName(result);
    },[username])

    useEffect(()=>{
        const result= PASSWORD_REGEX.test(password);
        console.log(result);
        console.log(password);
        setValidPassword(result);
    },[password])

    useEffect(()=>{
        const result=EMAIL_REGEX.test(email);
        setValidEmail(result);
    },[email])

    useEffect(()=>{
        setErrorMessage('');
    },[username,password,email])

    const handleSubmit = async (e) => {
        e.preventDefault();

        const v1=USER_REGEX.test(username);
        const v2=PASSWORD_REGEX.test(password);
        const v3=EMAIL_REGEX.test(email)

        if(!v1 || !v2 || !v3){
            setErrorMessage("Invalid Attempt");
            return;
        }
        try {
            const response = await axios.post(REGISTER_URL,
               {
                Username:username,
                Password:password,
                Email: email
               },
                {
                    headers:{'Content-Type': 'application/json'},
                    withCredentials: true
                }
            );
            console.log(response?.data);
            console.log(response?.accessToken);
            setSuccess(true);
            setUser('');
            setPassword('');
            setEmail('');
        }catch(error){
            console.log(error.response?.data); 
            if(!error?.response){
                setErrorMessage('No Response');
            }else if (error.response?.status ===409){
                setErrorMessage('Username is taken')
            }else {
                setErrorMessage('Regstration Failed')
            }
            errorRef.current.focus();
        }
    }
    return (
        <> 
        {success ? ( 
        <section>
            <h1>Successfully Done!</h1>
            <span className='line'>
                    <Link to="/login">Sign In Here</Link>
                    </span>
        </section>
        ):(
        
        <section>
            <p ref={errorRef} className={errorMessage ? "errorMessage" : "offscreen"} aria-live="assertive">
            {errorMessage}
            </p>

            <h1>Register</h1>

            <form onSubmit={handleSubmit}>
                <label htmlFor="username">
                    Username: 
                    <span className={validName ? "valid" : "hide"}>
                        <FontAwesomeIcon icon={faCheck} />
                    </span>
                    <span className={validName || !username ? "hide" : "invalid"}>
                        <FontAwesomeIcon icon={faTimes} />
                    </span>
                </label>

                <input
                type="text"
                id="username"
                ref={userRef}
                autoComplete="off"
                onChange={(e) =>setUser(e.target.value)}
                required
                aria-invalid={validName ? "false" : "true"}
                aria-describedby="idnote"
                onFocus={()=>setUserFocus(true)}
                onBlur={()=>setUserFocus(false)}
                />
                
                <p id="idnote" className={userFocus && username && !validName ? "instructions" : "offscreen"}>
                    <FontAwesomeIcon icon={faInfoCircle}/>
                    It must be at least 4 maximum 24 characters.
                    Must begin with a letter.
                </p>
                
                <label htmlFor="password"> 
                    Password: 
                    <span className={validPassword ? "valid" : "hide"}>
                        <FontAwesomeIcon icon={faCheck} />
                    </span>
                    <span className={validPassword || !password ? "hide" : "invalid"}>
                        <FontAwesomeIcon icon={faTimes} />
                    </span>
                </label>

                <input
                type="password"
                id="password"
                onChange={(e) =>setPassword(e.target.value)}
                required
                aria-invalid={validPassword ? "false" : "true"}
                aria-describedby="passwordnote"
                onFocus={()=>setPasswordFocus(true)}
                onBlur={()=>setPasswordFocus(false)}
                />
                
                <p id="passwordnote" className={passwordFocus && !validPassword ? "instructions" : "offscreen"}>
                    <FontAwesomeIcon icon={faInfoCircle}/>
                    It must be at least 8 maximum 24 characters.
                    Must include uppercase and lowercase, a number and a special character.
                </p>

                <label htmlFor="email">
                    Email: 
                    <span className={validEmail  ? "valid" : "hide"}>
                        <FontAwesomeIcon icon={faCheck} />
                    </span>
                    <span className={validEmail || !email ? "hide" : "invalid"}>
                        <FontAwesomeIcon icon={faTimes} />
                    </span>
                </label>

                <input
                type="text"
                id="email"
                onChange={(e) =>setEmail(e.target.value)}
                required
                aria-invalid={validEmail ? "false" : "true"}
                aria-describedby="emailnote"
                onFocus={()=>setEmailFocus(true)}
                onBlur={()=>setEmailFocus(false)}
                />
                
                <p id="emailnote" className={emailFocus && !validEmail ? "instructions" : "offscreen"}>
                    <FontAwesomeIcon icon={faInfoCircle}/>
                    Email should be in a correct format!
                </p>


                <button disabled={!validName || !validPassword || !validEmail ? true : false}>
                Sign Up
                </button>
            </form>
            <p>
                Already registered? <br/>
                <span className='line'>
                    
                {/* <a onClick={() => props.onFormSwitch('login')}>Sing In Here</a> */}
                <Link to="/login">Sign In Here</Link>
                </span>
            </p>
        </section>
        )}
        </>
  )
}

export default Register
