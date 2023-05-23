import axios from "axios";

export const fetchUser = async token => {
  const res = await axios.get('/api/v1/user/info', {
      headers: {Authorization: `Bearer ${token}`}
  })
  return res;
}