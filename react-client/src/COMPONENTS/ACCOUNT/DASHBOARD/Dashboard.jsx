import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import Button from "@mui/material/Button";
import Toast from "../../../Toast";
import { Routes, Route, Link as LinkRouter } from "react-router-dom";

import "./Dashboard.scss";

import Profile from "./PROFILE/Profile";
import AutoBase from "./AUTOBASE/AutoBase";
import TypesGSM from "./TYPESGSM/TypesGSM";
import AutoGarages from "./AUTOGARAGES/AutoGarages";
import Autos from "./AUTOS/Autos";
import Workers from "./WORKERS/Workers";
import Sheets from "./SHEETS/Sheets";
import Records from "./RECORDS/Records";
import GSMDayGarage from "./GSMDAYGARAGE/GsmDayGarage";
import ReportSheet from "./REPORTSHEET/ReportSheet";

import CONFIG from "./../../../CONFIG.json";

const DashboardNotFound = ({}) => {
  let navigate = useNavigate();

  useEffect(() => {
    navigate("/");

    new Toast({
      title: "Ошибка",
      text: `Такого URL адреса не предусмотрено! Вы были переадресованы на главную!`,
      theme: "danger",
      autohide: true,
      interval: 10000,
    });
  }, []);

  return <div></div>;
};

const Dashboard = ({ funcRequest, workerAccount, setWorkerAccount }) => {
  let navigate = useNavigate();

  useEffect(loadComponentDashboard, []);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  async function loadComponentDashboard() {
    let tempUserAuthCookie = Cookies.get("OGU_DIPLOM_COOKIE_AUTHTOKEN");

    if (tempUserAuthCookie !== undefined && workerAccount === false) {
      let responseFetch = await fetch(`${CONFIG.URL_BACKEND}/account/profile`, {
        method: "GET",
        headers: { Authorization: `Bearer ${tempUserAuthCookie}` },
      });

      const { ok, status } = responseFetch;

      responseFetch = await responseFetch.json();

      console.log(responseFetch.acc);

      if (!ok && status === 400) {
        new Toast({
          title: "Ошибка при авторизации аккаунта",
          text: "Ошибка при считывании аккаунта, обновите страницу!",
          theme: "danger",
          autohide: true,
          interval: 10000,
        });
        return;
      }

      new Toast({
        title: "Оповещение",
        text: `Вы были авторизированы под аккаунт ${responseFetch.acc.loginUser}.`,
        theme: "info",
        autohide: true,
        interval: 10000,
      });

      setWorkerAccount(responseFetch.acc);
    } else if (tempUserAuthCookie === undefined && workerAccount === false) {
      new Toast({
        title: "Ошибка",
        text: `У вас нет доступа в личный кабинет, авторизуйтесь!`,
        theme: "danger",
        autohide: true,
        interval: 5000,
      });

      navigate("/account/login");
      return;
    }
  }

  function dashboardExit() {
    Cookies.remove("OGU_DIPLOM_COOKIE_AUTHTOKEN");

    window.location.href = "/";
    // Везде navigate из react-router-dom но тут чтобы печенька удалилась, надо обновить страницу поэтому этот способ норм такой
  }

  return (
    <div className="Dashboard">
      <header className="header">
        <div className="central-container">
          <nav className="header__nav">
            <ul>
              <li>
                <LinkRouter to="">Мой профиль</LinkRouter>
              </li>
              <li>
                <LinkRouter to="autobase">Автомобильные базы</LinkRouter>
              </li>
              <li>
                <LinkRouter to="types-gsm">Виды ГСМ</LinkRouter>
              </li>
              <li>
                <LinkRouter to="autogarages">Автомобильные гаражи</LinkRouter>
              </li>
              <li>
                <LinkRouter to="autos">Все автомобили</LinkRouter>
              </li>
              <li>
                <LinkRouter to="workers">Рабочий персонал</LinkRouter>
              </li>
              <li>
                <LinkRouter to="sheets">Ведомости</LinkRouter>
              </li>
              <li>
                <LinkRouter to="records">Путевые листы</LinkRouter>
              </li>
              <li>
                <LinkRouter to="gsm-day-garage">
                  ГСМ за день по гаражу
                </LinkRouter>
              </li>
              <li>
                <LinkRouter to="report-sheet">Отчет по ведомости</LinkRouter>
              </li>
            </ul>
          </nav>
          <button onClick={dashboardExit} className="header__exit">
            Выход
          </button>
        </div>
      </header>

      <main className="main">
        <div className="central-container">
          <Routes>
            <Route path="*" element={<DashboardNotFound />} />
            <Route
              index
              element={
                <Profile
                  workerAccount={workerAccount}
                  setWorkerAccount={setWorkerAccount}
                />
              }
            />
            <Route
              path="autobase"
              element={<AutoBase funcRequest={funcRequest} />}
            />
            <Route
              path="types-gsm"
              element={<TypesGSM funcRequest={funcRequest} />}
            />
            <Route
              path="autogarages"
              element={<AutoGarages funcRequest={funcRequest} />}
            />
            <Route path="autos" element={<Autos funcRequest={funcRequest} />} />
            <Route
              path="workers"
              element={
                <Workers
                  funcRequest={funcRequest}
                  workerAccount={workerAccount}
                  dashboardExit={dashboardExit}
                />
              }
            />
            <Route
              path="sheets"
              element={
                <Sheets
                  funcRequest={funcRequest}
                  workerAccount={workerAccount}
                />
              }
            />
            <Route
              path="records"
              element={
                <Records
                  funcRequest={funcRequest}
                  workerAccount={workerAccount}
                />
              }
            />
            <Route
              path="gsm-day-garage"
              element={<GSMDayGarage funcRequest={funcRequest} />}
            />
            <Route
              path="report-sheet"
              element={<ReportSheet funcRequest={funcRequest} />}
            />
          </Routes>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
