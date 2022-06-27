import React, { useState } from "react";
import { Routes, Route } from "react-router-dom";

import "./App.scss";

import MainPage from "./MAINPAGE/MainPage";

import Register from "./ACCOUNT/REGISTER/Register";
import Login from "./ACCOUNT/LOGIN/Login";
import Dashboard from "./ACCOUNT/DASHBOARD/Dashboard";

import CONFIG from "./../CONFIG.json";

window.isValidDouble = (v) => Number.isFinite(+v) && +v % 1 !== 0;

async function funcRequest(url, method = "GET", data = null, token = null) {
  try {
    let headers = {};
    let body = null;

    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    if (data) {
      headers["Content-Type"] = "application/json";
      body = JSON.stringify(data);
    }

    let responseFetch = await fetch(`${CONFIG.URL_BACKEND}${url}`, {
      method: method,
      headers: headers,
      body: body,
    });

    const { ok, status } = responseFetch;

    responseFetch = await responseFetch.json();

    const returnFetch = { ok, status, responseFetch };

    return returnFetch;
  } catch (err) {
    console.error(err.message);
  }
}

const App = () => {
  const [workerAccount, setWorkerAccount] = useState(false);

  return (
    <div className="App">
      <Routes>
        <Route
          path="*"
          element={
            <MainPage
              error={{ status: true, message: "Такая страница не найдена" }}
            />
          }
        />

        <Route path="/" element={<MainPage />} />

        <Route
          path="/account/register"
          element={<Register workerAccount={workerAccount} />}
        />
        <Route
          path="/account/login"
          element={
            <Login
              workerAccount={workerAccount}
              setWorkerAccount={setWorkerAccount}
            />
          }
        />
        <Route
          path="/account/dashboard/*"
          element={
            <Dashboard
              funcRequest={funcRequest}
              workerAccount={workerAccount}
              setWorkerAccount={setWorkerAccount}
            />
          }
        />
      </Routes>
    </div>
  );
};

export default App;
