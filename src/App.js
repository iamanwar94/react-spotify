import React, { useEffect, useState } from "react";
import Login from "./Pages/Login/Login";
import { getTokenFromUrl } from "./spotify";
import "./App.css";
import Tracks from "./Pages/Tracks/Tracks";

const tokenFromLocal = () => {
  let data = localStorage.getItem("token");
  if (data) return data;
  else return null
}

function App() {
  const [token, setToken] = useState(tokenFromLocal());

  useEffect(() => {
    const hash = getTokenFromUrl();
    window.location.hash = "";
    const _token = hash.access_token;

    if (_token) {
      localStorage.setItem("token", _token);
      setToken(_token);
    }
  }, []);

  return <div className="app">{token ? <Tracks token={token} setToken={setToken}/> : <Login />}</div>;
}

export default App;

