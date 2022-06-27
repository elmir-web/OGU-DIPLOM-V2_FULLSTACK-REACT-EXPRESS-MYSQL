import Toast from "./../../../Toast";
import Cookies from "js-cookie";

import CONFIG from "./../../../CONFIG.json";

const authorizeAccount = async (
  event,
  setButtonLoginUsingStatus,
  setWorkerAccount,
  navigate
) => {
  event.preventDefault();

  const data = new FormData(event.currentTarget);

  const authAccount = {
    loginUser: data.get("loginUser"),
    passwordUser: data.get("passwordUser"),
  };

  if (authAccount.loginUser.length < 2 || authAccount.loginUser.length > 20) {
    new Toast({
      title: "Ошибка",
      text: "Логин не должен быть пустой строкой, либо меньше двух или больше двадцати символов",
      theme: "danger",
      autohide: true,
      interval: 5000,
    });
    return;
  }

  if (
    authAccount.passwordUser.length < 2 ||
    authAccount.passwordUser.length > 30
  ) {
    new Toast({
      title: "Ошибка",
      text: "Пароль не должен быть пустой строкой, либо меньше двух или больше тридцати символов",
      theme: "danger",
      autohide: true,
      interval: 5000,
    });
    return;
  }

  new Toast({
    title: "Авторизация аккаунта",
    text: "На сервер был отправлен запрос на авторизацию аккаунта, ждите...",
    theme: "light",
    autohide: true,
    interval: 3000,
  });

  let responseFetch = await fetch(`${CONFIG.URL_BACKEND}/account/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(authAccount),
  });

  const { ok, status } = responseFetch;
  responseFetch = await responseFetch.json();

  if (!ok && status === 400) {
    new Toast({
      title: "Ошибка при авторизации аккаунта",
      text: responseFetch,
      theme: "danger",
      autohide: true,
      interval: 5000,
    });
    return;
  }

  new Toast({
    title: "Вас ждет успех!",
    text: responseFetch.message,
    theme: "success",
    autohide: true,
    interval: 8000,
  });

  new Toast({
    title: "Переадресация",
    text: `Пожалуйста, оставайтесь на этой странице! Через 8 секунд вас автоматически перенаправит на рабочие возможности...`,
    theme: "info",
    autohide: true,
    interval: 10000,
  });

  Cookies.set("OGU_DIPLOM_COOKIE_AUTHTOKEN", responseFetch.token);

  setWorkerAccount(responseFetch.acc);

  setButtonLoginUsingStatus(true);

  setTimeout(() => navigate("/account/dashboard"), 8000);
  return;
};

export default authorizeAccount;
