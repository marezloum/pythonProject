import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Login.scss";
import { useSelector } from "react-redux";
import { RootState } from "../store/store";
import { useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";

const Login: React.FC = () => {
  let navigate = useNavigate();
  const { id: userId } = useSelector((state: RootState) => state.user);
  console.log(userId);
  useEffect(() => {
    if (userId) {
      navigate("/");
    }
  }, [userId, navigate]);
  const [_, setCookie] = useCookies<"userId", CookieValues>(["userId"]);

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
      setCookie("userId", response.data.user.id);
      navigate("/");
    } catch (error: any) {
      // Handle error
      setLoginMessage(
        error.response?.data?.error
          ? "Ошибка: " + error.response.data.error
          : "Ошибка входа. Попробуйте еще раз."
      );
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
      setSignUpMessage(
        error.response?.data?.error
          ? "Ошибка: " + error.response.data.error
          : "Ошибка регистрации. Попробуйте еще раз."
      );
      // Handle error
    }
  };

  return (
    <div className="auth-component">
      <div className={`auth-container ${isLoginForm ? "" : "signup-form"}`}>
        <form onSubmit={handleLogin} className="form sign-in">
          <label>
            <span>Почта</span>
            <input
              type="email"
              value={loginEmail}
              onChange={(e) => setLoginEmail(e.target.value)}
              required
            />
          </label>
          <label>
            <span>Пароль</span>
            <input
              type="password"
              value={loginPassword}
              onChange={(e) => setLoginPassword(e.target.value)}
              required
            />
          </label>
          <button type="submit" className="submit">
            Войти
          </button>
          {loginMessage}
        </form>
        <div className="transition-container">
          <div className="img">
            <div className="img__text signup">
              <h2>Присоединяйтесь к нашему онлайн-словарю!</h2>
              <p>
                Зарегистрируйтесь, чтобы получить доступ ко всем функциям и исследовать множество слов и их значений.
              </p>
            </div>
            <div className="img__text signin">
              <h2>Уже с нами?</h2>
              <p>
                Если у вас уже есть аккаунт в Lexoverse, просто войдите. Мы очень рады видеть вас снова!
              </p>
            </div>
            <div
              className="img__btn"
              onClick={(e) => setIsLoginForm(!isLoginForm)}
            >
              <span className="signup">Регистрация</span>
              <span className="signin">Войти</span>
            </div>
          </div>
          <form onSubmit={handleSignUp} className="form sign-up">
            <label>
              <span>Имя пользователя</span>
              <input
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                required
              />
            </label>
            <label>
              <span>Почта</span>
              <input
                type="email"
                value={signupEmail}
                onChange={(e) => setSignupEmail(e.target.value)}
                required
              />
            </label>
            <label>
              <span>Пароль</span>
              <input
                type="password"
                value={signupPassword}
                onChange={(e) => setSignupPassword(e.target.value)}
                required
              />
            </label>
            <button type="submit" className="submit">
              Зарегистрироваться
            </button>
            {signUpMessage}
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
