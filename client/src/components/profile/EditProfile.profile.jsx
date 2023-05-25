import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import axios from "axios";

import "./profile.styles.css";
import { showSuccessMsg, showErrMsg } from "../notification/Notification.component";

const EditProfile = () => {

  const navigate = useNavigate();
  const { id } = useParams();
  const { token } = useSelector(({ token }) => token);
  const { users } = useSelector(({ users }) => users);

  const [checkAdmin, setCheckAdmin] = useState(false);
  const [err, setErr] = useState(false);
  const [success, setSuccess] = useState(false);
  const [num, setNum] = useState(0);
  const [editUser, setEditUser] = useState([]);

  // users because the user in the auth is the logged in user
  useEffect(() => {
    if (users.length !== 0) {
      users.forEach(user => {
        if (user._id === id) {
          setEditUser(user)
          setCheckAdmin(user.role === 1 ? true : false)
        }
      })
    } else {
      navigate('/profile')
    }
  }, [users, id, navigate]);

  const handleCheck = () => {
    setSuccess('')
    setErr('')
    setCheckAdmin(checkAdmin => !checkAdmin)
    setNum(num + 1)
  }

  const handleUpdate = async () => {
    try {
      if (num % 2 !== 0) {
        const res = await axios.patch(`/api/v1/user/${editUser._id}`, {
          role: checkAdmin ? 1 : 0
        }, {
          headers: { Authorization: `Bearer ${token}` }
        })

        setSuccess(res.data.msg)
        setNum(0)
      }
    } catch (err) {
      err.response.data.msg && setErr(err.response.data.msg)
    }

    setTimeout(() => {
      setSuccess('');
      setErr('');
    }, 3000);
  }

  return (
    <div className="profile_page edit_user">
      <div className="row">
        <button onClick={() => navigate(-1)} className="go_back">
          <i className="fas fa-long-arrow-alt-left"></i> Go Back
        </button>
      </div>

      <div className="col-left">
        <h2>Edit User</h2>

        <div className="form-group">
          <label htmlFor="name">Name</label>
          <input
            type="text"
            name="name"
            defaultValue={editUser?.name}
            disabled
          />
        </div>

        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            name="email"
            defaultValue={editUser?.email}
            disabled
          />
        </div>

        <div className="form-group">
          <input
            type="checkbox"
            id="isAdmin"
            checked={checkAdmin}
            onChange={handleCheck}
          />
          <label htmlFor="isAdmin">isAdmin</label>
        </div>

        <button onClick={handleUpdate}>Update</button>

        {err && showErrMsg(err)}
        {success && showSuccessMsg(success)}
      </div>
    </div >
  )
}

export default EditProfile