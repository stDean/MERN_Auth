import { useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

import { showSuccessMsg, showErrMsg } from "../notification/Notification.component";
import { isMatch } from "../../utils/validation";

const initialState = {
  password: '',
  cf_password: '',
  err: '',
  success: ''
}

const ResetPassword = () => {

  const { token } = useParams();
  const [data, setData] = useState(initialState);
  const { password, cf_password, err, success } = data;

  const handleChangeInput = e => {
    const { name, value } = e.target
    setData({ ...data, [name]: value, err: '', success: '' })
  }

  const handleResetPass = async () => {
    if (!isMatch(password, cf_password))
      return setData({ ...data, err: "Password don't match, Try Again.", success: '' });

    try {
      const res = await axios.patch('/api/v1/auth/reset', { password }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return setData({ ...data, err: '', success: res.data.msg })
    } catch (err) {
      err.response.data.msg && setData({ ...data, err: err.response.data.msg, success: '' });
    }
  }

  return (
    <div className="fg_pass">
      <h2>Reset Your Password</h2>

      <div className="row">
        {err && showErrMsg(err)}
        {success && showSuccessMsg(success)}

        <label htmlFor="password">Password</label>
        <input type="password" name="password" id="password" value={password}
          onChange={handleChangeInput} />

        <label htmlFor="cf_password">Confirm Password</label>
        <input type="password" name="cf_password" id="cf_password" value={cf_password}
          onChange={handleChangeInput} />

        <button onClick={handleResetPass}>Reset Password</button>
      </div>
    </div>
  )
}

export default ResetPassword