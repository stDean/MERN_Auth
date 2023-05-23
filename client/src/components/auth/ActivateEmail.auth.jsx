import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

import { showSuccessMsg, showErrMsg } from "../notification/Notification.component";

const ActivateEmail = () => {

  const { actToken } = useParams();
  const [err, setErr] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (actToken) {
      const activationEmail = async () => {
        try {
          const res = await axios.post('/api/v1/auth/activate', { actToken });
          setSuccess(res.data.msg);

          setTimeout(() => {
            setSuccess("");
          }, 3000);
        } catch (err) {
          err.response.data.msg && setErr(err.response.data.msg);
          setTimeout(() => {
            setErr("");
          }, 3000);
        }
      }
      return () => activationEmail();
    }
  }, [actToken])

  return (
    <div className="active_page">
      {err && showErrMsg(err)}
      {success && showSuccessMsg(success)}
    </div>
  )
}

export default ActivateEmail