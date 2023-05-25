import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useDispatch } from "react-redux";
import { GoogleLogin } from "@react-oauth/google";

import "./auth.styles.css";
import { LOGIN } from "../../redux/slices/auth.slice";
import { showSuccessMsg, showErrMsg } from "../notification/Notification.component";

const initialState = {
  email: '',
  password: '',
  err: '',
  success: ''
}

const Login = () => {

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [user, setUser] = useState(initialState);
  const { email, password, err, success } = user;

  const handleChangeInput = e => {
    const { name, value } = e.target;
    setUser({ ...user, [name]: value, err: '', success: '' });
  }

  const handleSubmit = async e => {
    e.preventDefault();

    try {
      const res = await axios.post("/api/v1/auth/login", { email, password });
      setUser({ ...user, err: '', success: res.data.msg });
      localStorage.setItem('firstLogin', true);
      dispatch(LOGIN());

      navigate('/');
    } catch (err) {
      err.response.data.msg &&
        setUser({ ...user, err: err.response.data.msg, success: '' })
    }

    setTimeout(() => {
      setUser({ ...user, success: "", err: '' })
    }, 3000)
  }

  const responseGoogle = async response => {
    try {
      const { data } = await axios.post('/api/v1/auth/google_login', { tokenId: response.credential });
      setUser({ ...user, error: '', success: data.msg })
      localStorage.setItem('firstLogin', true)

      dispatch(LOGIN());
      navigate('/');
    } catch (err) {
      err.response.data.msg &&
        setUser({ ...user, err: err.response.data.msg, success: '' })
    }

    setTimeout(() => {
      setUser({ ...user, success: "", err: '' })
    }, 3000)
  }

  return (
    <div className="login_page">
      <h2>Login</h2>

      {err && showErrMsg(err)}
      {success && showSuccessMsg(success)}

      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="email">Email Address</label>
          <input
            type="text"
            placeholder="Email"
            id="email"
            value={email}
            name="email"
            onChange={handleChangeInput}
          />
        </div>

        <div>
          <label htmlFor="email">Password</label>
          <input
            type="password"
            placeholder="Password"
            id="password"
            value={password}
            name="password"
            onChange={handleChangeInput}
          />
        </div>

        <div className="row">
          <button type="submit">Login</button>
          <Link to="/forget">Forgot your password?</Link>
        </div>
      </form>

      <div className="socials">
        <GoogleLogin
          onSuccess={responseGoogle}
          onError={() => {
            console.log('Login Failed');
          }}
        />;
      </div>

      <p>New Customer? <Link to="/register">Register</Link></p>
    </div>
  )
}

export default Login