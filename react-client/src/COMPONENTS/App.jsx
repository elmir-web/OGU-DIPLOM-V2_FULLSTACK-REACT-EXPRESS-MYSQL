import React, { useState } from "react";
import { Routes, Route } from "react-router-dom";

import "./App.scss";

import MainPage from "./MAINPAGE/MainPage";

import Register from "./ACCOUNT/REGISTER/Register";
import Login from "./ACCOUNT/LOGIN/Login";
import Dashboard from "./ACCOUNT/DASHBOARD/Dashboard";

import CONFIG from "./../CONFIG.json";

window.isValidDouble = (v) => Number.isFinite(+v) && +v % 1 !== 0;

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
