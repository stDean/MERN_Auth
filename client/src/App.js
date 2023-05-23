import { useSelector, useDispatch } from "react-redux";
import { useEffect } from "react";
import axios from "axios";

import { Header } from "./components";
import { Body } from "./container";
import { GET_TOKEN } from "./redux/slices/token.slice";
import { GET_USER, LOGIN } from "./redux/slices/auth.slice";
import { fetchUser } from "./utils/fetchUser";

function App() {

  const token = useSelector(({ token }) => token.token);
  const { isLogged } = useSelector(({ auth }) => auth);
  const dispatch = useDispatch();

  useEffect(() => {
    const firstLogin = localStorage.getItem('firstLogin');
    if (firstLogin) {
      const getToken = async () => {
        const res = await axios.post('/api/v1/auth/refresh_token', null);
        dispatch(GET_TOKEN(res.data.access_token));
      }
      getToken()
    }
  }, [isLogged, dispatch]);

  useEffect(() => {
    if (token) {
      const getUser = async () => {
        dispatch(LOGIN());
        const { data } = await fetchUser(token);
        dispatch(GET_USER({ user: data, isAdmin: data.role === 1 ? true : false }))
      }
      getUser()
    }
  }, [token, dispatch])

  return (
    <div className="App">
      <Header />
      <Body />
    </div>
  );
}

export default App;
