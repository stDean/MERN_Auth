import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useDispatch } from "react-redux";

import "./auth.styles.css";
import { login } from "../../redux/slices/auth.slice";
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
      dispatch(login());

      navigate('/');
    } catch (err) {
      err.response.data.msg &&
        setUser({ ...user, err: err.response.data.msg, success: '' })
    }
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

      <p>New Customer? <Link to="/register">Register</Link></p>
    </div>
  )
}

export default Login