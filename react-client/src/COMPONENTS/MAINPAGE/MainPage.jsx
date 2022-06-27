import React, { useEffect } from "react";
import Toast from "./../../Toast";

import "./MainPage.scss";

import { Link as RouterLink } from "react-router-dom";

export default function MainPage({ error }) {
  useEffect(() => {
    if (error !== undefined || error?.status === true) {
      new Toast({
        title: "Ошибка",
        text: `Такого URL адреса не предусмотрено! Вы были переадресованы на главную страницу!`,
        theme: "danger",
        autohide: true,
        interval: 10000,
      });
    }
  }, []);

  return (
    <React.Fragment>
      <div className="MainPage">
        <header className="header">
          <div className="central-container">
            <div
              className="header__logo"
              onClick={() => {
                window.open("http://osu.ru/", "_blank");
              }}
            ></div>

            <div className="header__center">
              <span className="header__desktop-title">
                Проект Оренбургского Государственного Университета
              </span>
              <span className="header__mobile-title">Проект ОГУ</span>
            </div>

            <div className="header__right">
              <RouterLink to="/account/dashboard" className="header-dashboard">
                Личный кабинет
              </RouterLink>
            </div>
          </div>
        </header>

        <main className="main">
          <div className="central-container">
            <div className="main__title">
              Панель управления планирования топлива на автомобильных базах
            </div>

            <div className="main__description">
              Добро пожаловать в панель управления автомобильной компании
              "ОГУ"*. Выберите ниже, что вам требуется сделать. При регистрации
              вы попадете в базу данных как "Кандидат" и с вами свяжется отдел
              кадров. При авторизации вы войдете в свой личный кабинет.
            </div>

            <div className="main__account-controlls">
              <RouterLink
                to="/account/register"
                className="main__account-button button-register"
              >
                Стать кандидатом
              </RouterLink>

              <RouterLink
                to="/account/login"
                className="main__account-button button-authorize"
              >
                Авторизация
              </RouterLink>
            </div>
          </div>
        </main>
        <footer className="footer">
          <div className="central-container">
            <div>
              Началом работы считается третий курс. Предмет Дмитрия
              Владимировича Горбачёва - "БД и СуБД".
            </div>

            <div>
              Проект разрабатывается согласно моему решению о расширении до темы
              диплома. Разработчик - студент З-18ПИнж(ба)РПиС -{" "}
              <a href="http://elmir-web.github.io" target="_blank">
                Кубагушев Эльмир
              </a>
              .
            </div>
            <div>
              Тема диплома: "Прогнозирование стратегического запаса топлива".
            </div>
          </div>
        </footer>
      </div>
    </React.Fragment>
  );
}
