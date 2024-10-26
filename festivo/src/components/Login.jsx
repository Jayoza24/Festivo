import { useState } from 'react';
import '../styles/loginStyle.css';
import 'boxicons/css/boxicons.min.css';
import loginBg from "../assets/img-login.svg";
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Login = () => {
    const [isSignIn, setIsSignIn] = useState(true);
    const [username, setUsername] = useState();
    const [password, setPassword] = useState();
    const [email, setEmail] = useState();
    const navigate = useNavigate();

    const handleSignUpClick = () => {
        setIsSignIn(false);
    };

    const handleSignInClick = () => {
        setIsSignIn(true);
    };

    const handleLogin = async(e) =>{
        e.preventDefault();
        try {
            const { data } = await axios.post(
                "https://festivo.onrender.com/api/users/login",
                { username, password }
            );
            localStorage.setItem("userInfo", JSON.stringify(data));
            navigate("/");
        } catch (error) {
            toast.error(error.response.data.message || 'Login failed!');
        }
    }

    const handleSignUp = async(e) =>{
        e.preventDefault();
        try {
            const { data } = await axios.post('https://festivo.onrender.com/api/users/register', { username, email, password });
            localStorage.setItem('userInfo', JSON.stringify(data));
            navigate('/');
        } catch (error) {
            toast.error(error.response.data.message || 'Sign up failed!');
        }
    }

    return (
        <div className="login">
            <div className="login__content">
                <div className="login__img">
                    <img src={loginBg} alt="Login" />
                </div>

                <div className="login__forms">
                    <form className={`login__registre ${isSignIn ? 'block' : 'none'}`} id="login-in">
                        <h1 className="login__title">Sign In</h1>

                        <div className="login__box">
                            <i className='bx bx-user login__icon'></i>
                            <input type="text" placeholder="Username" className="login__input" onChange={(e) => setUsername(e.target.value)}/>
                        </div>

                        <div className="login__box">
                            <i className='bx bx-lock-alt login__icon'></i>
                            <input type="password" placeholder="Password" className="login__input" onChange={(e) => setPassword(e.target.value)}/>
                        </div>

                        <a href="#" className="login__forgot">Forgot password?</a>

                        <a className="login__button" onClick={handleLogin}>Sign In</a>

                        <div>
                            <span className="login__account">Don't have an Account ?</span>
                            <span className="login__signin" id="sign-up" onClick={handleSignUpClick}>Sign Up</span>
                        </div>
                    </form>

                    <form className={`login__create ${isSignIn ? 'none' : 'block'}`} id="login-up">
                        <h1 className="login__title">Create Account</h1>

                        <div className="login__box">
                            <i className='bx bx-user login__icon'></i>
                            <input type="text" placeholder="Username" className="login__input" onChange={(e) => setUsername(e.target.value)}/>
                        </div>

                        <div className="login__box">
                            <i className='bx bx-at login__icon'></i>
                            <input type="text" placeholder="Email" className="login__input" onChange={(e) => setEmail(e.target.value)}/>
                        </div>

                        <div className="login__box">
                            <i className='bx bx-lock-alt login__icon'></i>
                            <input type="password" placeholder="Password" className="login__input" onChange={(e) => setPassword(e.target.value)}/>
                        </div>

                        <a className="login__button" onClick={handleSignUp}>Sign Up</a>

                        <div>
                            <span className="login__account">Already have an Account ?</span>
                            <span className="login__signup" id="sign-in" onClick={handleSignInClick}>Sign In</span>
                        </div>

                    </form>
                </div>
            </div>
            <ToastContainer />
        </div>
    );
}

export default Login;
