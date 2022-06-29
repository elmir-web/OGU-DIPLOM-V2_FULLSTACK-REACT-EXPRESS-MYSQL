import Cookies from "js-cookie";
import Toast from "./../../../../Toast";

import CONFIG from "./../../../../CONFIG.json";

async function eventCreatedWorker(createWorker, loadWorkers, setCreateWorker) {
  if (createWorker === null) {
    new Toast({
      title: "Ошибка при создании сотрудника",
      text: "Ошибка: Вы ничего не сделали",
      theme: "danger",
      autohide: true,
      interval: 10000,
    });
    return;
  }

  if (
    createWorker.FIO === `` ||
    createWorker.FIO === undefined ||
    createWorker.FIO === null
  ) {
    new Toast({
      title: "Ошибка при создании сотрудника",
      text: "Ошибка: Не ведены фамилия, имя и отчество",
      theme: "danger",
      autohide: true,
      interval: 10000,
    });
    return;
  }

  if (
    createWorker.loginUser === `` ||
    createWorker.loginUser === undefined ||
    createWorker.loginUser === null
  ) {
    new Toast({
      title: "Ошибка при создании сотрудника",
      text: "Ошибка: Не веден логин",
      theme: "danger",
      autohide: true,
      interval: 10000,
    });
    return;
  }

  if (
    createWorker.passwordUser === `` ||
    createWorker.passwordUser === undefined ||
    createWorker.passwordUser === null
  ) {
    new Toast({
      title: "Ошибка при создании сотрудника",
      text: "Ошибка: Не веден пароль",
      theme: "danger",
      autohide: true,
      interval: 10000,
    });
    return;
  }

  if (
    createWorker.Function === `` ||
    createWorker.Function === undefined ||
    createWorker.Function === null
  ) {
    new Toast({
      title: "Ошибка при создании сотрудника",
      text: "Ошибка: Не выбрана должность",
      theme: "danger",
      autohide: true,
      interval: 10000,
    });
    return;
  }

  if (
    createWorker.IDbase === `` ||
    createWorker.IDbase === undefined ||
    createWorker.IDbase === null
  ) {
    new Toast({
      title: "Ошибка при создании сотрудника",
      text: "Ошибка: Не выбрана автобаза",
      theme: "danger",
      autohide: true,
      interval: 10000,
    });
    return;
  }
  let tempUserAuthCookie = Cookies.get("OGU_DIPLOM_COOKIE_AUTHTOKEN");

  let responseFetch = await fetch(`${CONFIG.URL_BACKEND}/api/worker/create`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${tempUserAuthCookie}`,
    },
    body: JSON.stringify(createWorker),
  });

  const { ok, status } = responseFetch;
  responseFetch = await responseFetch.json();

  if (ok === false && status === 400) {
    new Toast({
      title: "Ошибка при создании сотрудника",
      text: responseFetch,
      theme: "danger",
      autohide: true,
      interval: 10000,
    });
    return;
  }

  new Toast({
    title: "Вас ждет успех!",
    text: responseFetch,
    theme: "success",
    autohide: true,
    interval: 10000,
  });

  setCreateWorker(null);

  loadWorkers();
}

export default eventCreatedWorker;
