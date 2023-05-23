import { Routes, Route } from "react-router-dom";
import { Login, Register } from "../components";

const Body = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
    </Routes>
  )
}

export default Body