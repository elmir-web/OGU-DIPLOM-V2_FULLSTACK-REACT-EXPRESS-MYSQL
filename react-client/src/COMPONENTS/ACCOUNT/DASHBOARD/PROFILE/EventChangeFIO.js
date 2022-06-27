import Cookies from "js-cookie";
import Toast from "./../../../../Toast";

import CONFIG from "./../../../../CONFIG.json";

async function changeFIOEvent(
  dataFIO,
  setWorkerAccount,
  workerAccount,
  setChangedFIO
) {
  if (dataFIO.FIO1.length < 3 || dataFIO.FIO1.length > 33) {
    new Toast({
      title: "Ошибка при изменении данных",
      text: "Строка с фамилией не должна быть пустой. От 3 до 33 символов (включительно).",
      theme: "danger",
      autohide: true,
      interval: 10000,
    });
    return;
  }

  if (dataFIO.FIO2.length < 3 || dataFIO.FIO2.length > 33) {
    new Toast({
      title: "Ошибка при изменении данных",
      text: "Строка с именем не должна быть пустой. От 3 до 33 символов (включительно).",
      theme: "danger",
      autohide: true,
      interval: 10000,
    });
    return;
  }

  if (dataFIO.FIO3.length < 3 || dataFIO.FIO3.length > 33) {
    new Toast({
      title: "Ошибка при изменении данных",
      text: "Строка с отчеством не должна быть пустой. От 3 до 33 символов (включительно).",
      theme: "danger",
      autohide: true,
      interval: 10000,
    });
    return;
  }

  let tempUserAuthCookie = Cookies.get("OGU_DIPLOM_COOKIE_AUTHTOKEN");

  let responseFetch = await fetch(
    `${CONFIG.URL_BACKEND}/account/profile/change`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${tempUserAuthCookie}`,
      },
      body: JSON.stringify(dataFIO),
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

  setWorkerAccount({ ...workerAccount, FIO: responseFetch.data });

  setChangedFIO(false);

  new Toast({
    title: "Вас ждет успех!",
    text: responseFetch.message,
    theme: "success",
    autohide: true,
    interval: 10000,
  });
  return;
}

export default changeFIOEvent;
