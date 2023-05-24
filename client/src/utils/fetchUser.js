import axios from "axios";

export const fetchUser = async (url, token) => {
  const res = await axios.get(url, {
    headers: { Authorization: `Bearer ${token}` }
  })
  return res;
}