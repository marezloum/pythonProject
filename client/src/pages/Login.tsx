import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Login.scss";
import { useDispatch, useSelector } from "react-redux";
import { setUser } from "../store/userSlice";
import { RootState } from "../store/store";
import { useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";

const Login: React.FC = () => {
  let navigate = useNavigate();
  const {id: userId} = useSelector((state: RootState) => state.user);
  console.log(userId);
  useEffect(() => {
    if (userId) {
      navigate("/");
    }
  }, [userId, navigate]);
  const [cookie, setCookie] = useCookies<"userId", CookieValues>(["userId"]);
  const dispatch = useDispatch();

  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [signupEmail, setSignupEmail] = useState("");
  const [signupPassword, setSignupPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [signUpMessage, setSignUpMessage] = useState("");
  const [loginMessage, setLoginMessage] = useState("");
  const [isLoginForm, setIsLoginForm] = useState(true);

  const handleLogin = async (e: React.FormEvent) => {
    setLoginMessage("");
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:3008/login", {
        email: loginEmail,
        password: loginPassword,
      });
      setLoginMessage(response.data.message);
      dispatch(setUser(response.data.user)); // Dispatch user to Redux store
      setCookie("userId", response.data.user.id);
      navigate("/");
    } catch (error: any) {
      // Handle error
      setLoginMessage(error.response.data.error);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    setSignUpMessage("");
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:3008/signup", {
        email: signupEmail,
        password: signupPassword,
        displayName,
      });
      setSignUpMessage(response.data.message);
      setIsLoginForm(true);
    } catch (error: any) {
      setSignUpMessage(error.response.data.error);
      // Handle error
    }
  };

  return (
    <div className="auth-component">
      <div>User ID: {userId}</div>
      <div className={`auth-container ${isLoginForm ? "" : "signup-form"}`}>
        <form onSubmit={handleLogin} className="form sign-in">
          <label>
            <span>Email</span>
            <input
              type="email"
              value={loginEmail}
              onChange={(e) => setLoginEmail(e.target.value)}
              required
            />
          </label>
          <label>
            <span>Password</span>
            <input
              type="password"
              value={loginPassword}
              onChange={(e) => setLoginPassword(e.target.value)}
              required
            />
          </label>
          <button type="submit" className="submit">
            Sign In
          </button>
          {loginMessage}
        </form>
        <div className="transition-container">
          <div className="img">
            <div className="img__text signup">
              <h2>New here?</h2>
              <p>
                Send a request regarding one of our products and we are going to
                be in contact with you shortly
              </p>
            </div>
            <div className="img__text signin">
              <h2>One of us?</h2>
              <p>
                If you already have a Weston account, just sign in. We've missed
                you!
              </p>
            </div>
            <div
              className="img__btn"
              onClick={(e) => setIsLoginForm(!isLoginForm)}
            >
              <span className="signup">Sign Up</span>
              <span className="signin">Sign In</span>
            </div>
          </div>
          <form onSubmit={handleSignUp} className="form sign-up">
            <label>
              <span>Display Name</span>
              <input
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                required
              />
            </label>
            <label>
              <span>Email</span>
              <input
                type="email"
                value={signupEmail}
                onChange={(e) => setSignupEmail(e.target.value)}
                required
              />
            </label>
            <label>
              <span>Password</span>
              <input
                type="password"
                value={signupPassword}
                onChange={(e) => setSignupPassword(e.target.value)}
                required
              />
            </label>
            <button type="submit" className="submit">
              Sign Up
            </button>
            {signUpMessage}
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
