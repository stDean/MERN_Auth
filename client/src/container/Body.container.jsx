import { Routes, Route } from "react-router-dom";

import { Login, Register, ActivateEmail } from "../components";

const Body = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/user/activate/:actToken" element={<ActivateEmail />} />
    </Routes>
  )
}

export default Body