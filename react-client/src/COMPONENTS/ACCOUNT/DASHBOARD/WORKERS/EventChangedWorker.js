import Cookies from "js-cookie";
import Toast from "./../../../../Toast";

import CONFIG from "./../../../../CONFIG.json";

async function eventChangedWorker(
  inputObjectWorker,
  changedWorker,
  setChangedWorker,
  setInputObjectWorker,
  loadWorkers,
  workerAccount,
  dashboardExit
) {
  if (
    !("FIO" in inputObjectWorker) ||
    inputObjectWorker.FIO.length < 11 ||
    inputObjectWorker.FIO.length > 101
  ) {
    new Toast({
      title: "Ошибка при изменении сотрудника",
      text: `Поле ввода ФИО не должно быть пустым. ФИО вместе включая пробелы должно быть от 11 до 101 символа (включительно)`,
      theme: "danger",
      autohide: true,
      interval: 10000,
    });
    return;
  }

  if (
    !("loginUser" in inputObjectWorker) ||
    inputObjectWorker.loginUser.length < 2 ||
    inputObjectWorker.loginUser.length > 20
  ) {
    new Toast({
      title: "Ошибка при изменении сотрудника",
      text: `Поле ввода логина не должно быть пустым. Логин должен быть от 2 до 20 символа (включительно)`,
      theme: "danger",
      autohide: true,
      interval: 10000,
    });
    return;
  }

  if (
    !("passwordUser" in inputObjectWorker) ||
    inputObjectWorker.passwordUser.length < 2 ||
    inputObjectWorker.passwordUser.length > 30
  ) {
    new Toast({
      title: "Ошибка при изменении сотрудника",
      text: `Поле ввода пароля не должно быть пустым. Пароль должен быть от 2 до 30 символа (включительно)`,
      theme: "danger",
      autohide: true,
      interval: 10000,
    });
    return;
  }

  let tempUserAuthCookie = Cookies.get("OGU_DIPLOM_COOKIE_AUTHTOKEN");

  let changedThisWorker = {
    ...inputObjectWorker,
    ID: changedWorker.ID,
    IDbase: inputObjectWorker.IDbase.ID,
    Function: inputObjectWorker.Function.ID,
  };

  let responseFetch = await fetch(`${CONFIG.URL_BACKEND}/api/worker/change`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${tempUserAuthCookie}`,
    },
    body: JSON.stringify(changedThisWorker),
  });

  const { ok, status } = responseFetch;

  responseFetch = await responseFetch.json();

  if (ok === false && status === 400) {
    new Toast({
      title: "Ошибка при изменении данных сотрудника",
      text: responseFetch,
      theme: "danger",
      autohide: true,
      interval: 10000,
    });
    return;
  }

  setChangedWorker(null);

  setInputObjectWorker({
    ID: null,
    FIO: "",
    loginUser: "",
    passwordUser: "",
    Function: null,
    IDbase: null,
  });

  new Toast({
    title: "Вас ждет успех!",
    text: responseFetch,
    theme: "success",
    autohide: true,
    interval: 10000,
  });

  loadWorkers();

  if (workerAccount.ID === changedThisWorker.ID) {
    new Toast({
      title: "Вы отредактировали свой профиль!",
      text: "Так как вы отредактировали свой профиль, сейчас будет произведен выход из аккаунта. Авторизуйтесь под новыми данными.",
      theme: "warning",
      autohide: true,
      interval: 10000,
    });
    setTimeout(() => dashboardExit(), 2000);
  }
}

export default eventChangedWorker;
