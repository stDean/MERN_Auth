import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { Link } from "react-router-dom";

import "./profile.styles.css";
import { showSuccessMsg, showErrMsg } from "../notification/Notification.component";
import { isMatch } from "../../utils/validation";
import { fetchUser } from "../../utils/fetchUser";
import { GET_USERS } from "../../redux/slices/users.slice";

const initialState = {
  name: '',
  password: '',
  cf_password: '',
  err: '',
  success: ''
}

const Profile = () => {

  const dispatch = useDispatch();
  const { token } = useSelector(({ token }) => token);
  const { user, isAdmin } = useSelector(({ auth }) => auth);
  const { users } = useSelector(({ users }) => users);
  const [data, setData] = useState(initialState);
  const { name, password, cf_password, err, success } = data;

  const [avatar, setAvatar] = useState(false);
  const [loading, setLoading] = useState(false);
  const [callback, setCallback] = useState(false);

  useEffect(() => {
    if (isAdmin) {
      const getUsers = async () => {
        const { data } = await fetchUser('/api/v1/user', token);
        dispatch(GET_USERS(data))
      }
      getUsers()
    }
  }, [token, callback, isAdmin, dispatch])

  const handleChange = e => {
    const { name, value } = e.target
    setData({ ...data, [name]: value, err: '', success: '' })
  }

  const changeAvatar = async e => {
    e.preventDefault()

    try {
      const file = e.target.files[0]

      if (!file) return setData({ ...data, err: "No files were uploaded.", success: '' })

      if (file.size > 1024 * 1024)
        return setData({ ...data, err: "Size too large.", success: '' })

      if (file.type !== 'image/jpeg' && file.type !== 'image/png')
        return setData({ ...data, err: "File format is incorrect.", success: '' })

      let formData = new FormData()
      formData.append('file', file)

      setLoading(true)
      const res = await axios.post('/api/v1/user_avatar', formData, {
        headers: { 'content-type': 'multipart/form-data', Authorization: `Bearer ${token}` }
      })

      setLoading(false)
      setAvatar(res.data.url)

    } catch (err) {
      setData({ ...data, err: err.response.data.msg, success: '' })
    }
  }

  const updateInfo = () => {
    try {
      axios.patch('/api/v1/user/update', {
        name: name ? name : user.name,
        avatar: avatar ? avatar : user.avatar
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setData({ ...data, err: '', success: "Update Successful!" })
    } catch (err) {
      setData({ ...data, err: err.response.data.msg, success: '' })
    }

    setTimeout(() => {
      setData({ ...data, success: '', err: '' });
    }, 3000)
  }

  const updatePassword = () => {
    if (!isMatch(password, cf_password))
      return setData({ ...data, err: "Password did not match.", success: '' })

    try {
      axios.patch('/api/v1/auth/reset', { password }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setData({ ...data, err: '', success: "Update Successful!" })
    } catch (err) {
      setData({ ...data, err: err.response.data.msg, success: '' })
    }

    setTimeout(() => {
      setData({ ...data, success: '', err: '' });
    }, 3000)
  }

  const handleUpdate = () => {
    if (name || avatar) updateInfo();
    if (password) updatePassword();
  }

  const handleDelete = async id => {
    try {
      if (user._id !== id) {
        if (window.confirm("Are you sure you want to delete this account?")) {
          setLoading(true)
          await axios.delete(`/api/v1/user/${id}`, {
            headers: { Authorization: `Bearer ${token}` }
          })
          setLoading(false)
          setCallback(!callback)
        }
      }

    } catch (err) {
      setData({ ...data, err: err.response.data.msg, success: '' })
    }
  }
  
  return (
    <>
      <div>
        {err && showErrMsg(err)}
        {success && showSuccessMsg(success)}
        {loading && <h3>Loading.....</h3>}
      </div>

      <div className="profile_page">
        <div className="col-left">
          <h2>{isAdmin ? "Admin Profile" : "User Profile"}</h2>

          <div className="avatar">
            <img src={avatar ? avatar : user?.avatar} alt="" />
            <span>
              <i className="fas fa-camera"></i>
              <p>Change</p>
              <input type="file" name="file" id="file_up" onChange={changeAvatar} />
            </span>
          </div>

          <div className="form-group">
            <label htmlFor="name">Name</label>
            <input
              type="text"
              name="name"
              id="name"
              defaultValue={user?.name}
              placeholder="Your name"
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              name="email"
              id="email"
              defaultValue={user?.email}
              placeholder="Your email address"
              disabled />
          </div>

          <div className="form-group">
            <label htmlFor="password">New Password</label>
            <input
              type="password"
              name="password"
              id="password"
              placeholder="Your password"
              value={password}
              onChange={handleChange} />
          </div>

          <div className="form-group">
            <label htmlFor="cf_password">Confirm New Password</label>
            <input
              type="password"
              name="cf_password"
              id="cf_password"
              placeholder="Confirm password"
              value={cf_password}
              onChange={handleChange} />
          </div>

          <div>
            <em style={{ color: "crimson" }}>
              * If you update your password here, you will not be able
              to login quickly using google and facebook.
            </em>
          </div>
          <button disabled={loading} onClick={handleUpdate}>Update</button>
        </div>

        <div className="col-right">
          <h2>{isAdmin ? "Users" : "My Orders"}</h2>

          <div style={{ overflowX: "auto" }}>
            <table className="customers">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Admin</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>
                {
                  users.map(user => (
                    <tr key={user?._id}>
                      <td>{user?._id}</td>
                      <td>{user?.name}</td>
                      <td>{user?.email}</td>
                      <td>
                        {
                          user.role === 1
                            ? <i className="fas fa-check" title="Admin"></i>
                            : <i className="fas fa-times" title="User"></i>
                        }
                      </td>
                      <td>
                        <Link to={`/edit_user/${user?._id}`}>
                          <i className="fas fa-edit" title="Edit"></i>
                        </Link>
                        <i
                          className="fas fa-trash-alt"
                          title="Remove"
                          onClick={() => handleDelete(user?._id)} ></i>
                      </td>
                    </tr>
                  ))
                }
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  )
}

export default Profile