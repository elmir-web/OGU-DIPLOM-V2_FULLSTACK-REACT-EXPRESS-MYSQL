import Cookies from "js-cookie";
import Toast from "./../../../../Toast";

import CONFIG from "./../../../../CONFIG.json";

async function changeAccessDataEvent(
  dataAccess,
  setWorkerAccount,
  workerAccount,
  setChangedAccessData
) {
  if (dataAccess.loginUser.length < 2 || dataAccess.loginUser.length > 20) {
    new Toast({
      title: "Ошибка при изменении данных",
      text: "Строка с логином не должна быть пустой. От 2 до 20 символов (включительно).",
      theme: "danger",
      autohide: true,
      interval: 10000,
    });
    return;
  }

  if (
    dataAccess.passwordUser.length < 2 ||
    dataAccess.passwordUser.length > 30
  ) {
    new Toast({
      title: "Ошибка при изменении данных",
      text: "Строка с паролем не должна быть пустой. От 2 до 20 символов (включительно).",
      theme: "danger",
      autohide: true,
      interval: 10000,
    });
    return;
  }

  let tempUserAuthCookie = Cookies.get("OGU_DIPLOM_COOKIE_AUTHTOKEN");

  let responseFetch = await fetch(
    `${CONFIG.URL_BACKEND}/account/profile/access-data/change`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${tempUserAuthCookie}`,
      },
      body: JSON.stringify(dataAccess),
    }
  );

  const { ok, status } = responseFetch;

  responseFetch = await responseFetch.json();

  if (ok === false && status === 400) {
    new Toast({
      title: "Ошибка при изменении данных",
      text: responseFetch.message,
      theme: "danger",
      autohide: true,
      interval: 10000,
    });
    return;
  }

  setWorkerAccount({
    ...workerAccount,
    loginUser: responseFetch.loginUser,
    passwordUser: responseFetch.passwordUser,
  });

  setChangedAccessData(false);

  new Toast({
    title: "Вас ждет успех!",
    text: responseFetch.message,
    theme: "success",
    autohide: true,
    interval: 10000,
  });
}

export default changeAccessDataEvent;
