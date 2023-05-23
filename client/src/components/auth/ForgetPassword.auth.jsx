import { useState } from "react";
import axios from "axios";

import { showSuccessMsg, showErrMsg } from "../notification/Notification.component";
import "./auth.styles.css";


const initialState = {
  email: '',
  err: '',
  success: ''
}

const ForgetPassword = () => {

  const [data, setData] = useState(initialState);
  const { email, err, success } = data;

  const handleChangeInput = e => {
    const { name, value } = e.target
    setData({ ...data, [name]: value, err: '', success: '' })
  }

  const forgotPassword = async () => {
    try {
      const res = await axios.post('/api/v1/auth/forget', { email });
      setData({ ...data, err: '', success: res.data.msg });
    } catch (err) {
      err.response.data.msg && setData({ ...data, err: err.response.data.msg, success: '' });
    }
    setTimeout(() => {
      setData({ ...data, err: "", success: '' });
    }, 3000);
  }

  return (
    <div className="fg_pass">
      <h2>Forgot Your Password?</h2>

      <div className="row">
        {err && showErrMsg(err)}
        {success && showSuccessMsg(success)}

        <label htmlFor="email">Enter your email address</label>
        <input
          type="email"
          name="email"
          id="email"
          value={email}
          onChange={handleChangeInput}
        />
        <button onClick={forgotPassword}>Verify your email</button>
      </div>
    </div>
  )
}

export default ForgetPassword