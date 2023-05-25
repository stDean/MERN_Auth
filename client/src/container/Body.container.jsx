import { Routes, Route } from "react-router-dom";
import { useSelector } from "react-redux";

import {
  Login, Register, ActivateEmail, NotFound, ForgetPassword, ResetPassword, Home, Profile, EditProfile
} from "../components";

const Body = () => {

  const { isLogged, isAdmin } = useSelector(({ auth }) => auth);

  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={isLogged ? <NotFound /> : <Login />} />
      <Route path="/register" element={isLogged ? <NotFound /> : <Register />} />
      <Route path="/profile" element={isLogged ? <Profile /> : <NotFound />} />
      <Route path="/user/activate/:actToken" element={<ActivateEmail />} />
      <Route path="/forget" element={isLogged ? <NotFound /> : <ForgetPassword />} />
      <Route path="/user/reset/:token" element={isLogged ? <NotFound /> : <ResetPassword />} />
      <Route path="/edit_user/:id" element={isAdmin ? <EditProfile /> : <NotFound />} />
    </Routes>
  )
}

export default Body