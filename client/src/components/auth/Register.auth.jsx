import { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

import "./auth.styles.css";
import { showSuccessMsg, showErrMsg } from "../notification/Notification.component";
import { isMatch } from "../../utils/validation";

const initialState = {
  name: '',
  email: '',
  password: '',
  cf_password: '',
  err: '',
  success: ''
}

const Register = () => {

  const [user, setUser] = useState(initialState);
  const { name, email, password, cf_password, err, success } = user;

  const handleChangeInput = e => {
    const { name, value } = e.target;
    setUser({ ...user, [name]: value, err: '', success: '' });
  }

  const handleSubmit = async e => {
    e.preventDefault();

    if (!isMatch(password, cf_password))
      return setUser({ ...user, err: "Password don't match.", success: '' });

    try {
      const res = await axios.post("/api/v1/auth/register", { name, email, password });
      setUser({ ...user, err: '', success: res.data.msg });
    } catch (err) {
      err.response.data.msg &&
        setUser({ ...user, err: err.response.data.msg, success: '' })
    }
  }

  return (
    <div className="login_page">
      <h2>Register</h2>

      {err && showErrMsg(err)}
      {success && showSuccessMsg(success)}

      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="email">Email Address</label>
          <input
            type="text"
            placeholder="Name"
            id="name"
            value={name}
            name="name"
            onChange={handleChangeInput}
          />
        </div>

        <div>
          <label htmlFor="email">Email Address</label>
          <input
            type="email"
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

        <div>
          <label htmlFor="email">Confirm Password</label>
          <input
            type="password"
            placeholder="Confirm Password"
            id="cf_password"
            value={cf_password}
            name="cf_password"
            onChange={handleChangeInput}
          />
        </div>

        <div className="row">
          <button type="submit">Register</button>
        </div>
      </form>

      <p>Already a Customer? <Link to="/login">Login</Link></p>
    </div>
  )
}

export default Register