import Cookies from "js-cookie";
import Toast from "../../../../Toast";

import CONFIG from "./../../../../CONFIG.json";

async function eventCreatedAutoBase(
  loadAutoBases,
  createNameAutoBase,
  setCreateNameAutoBase
) {
  if (createNameAutoBase.length < 3 || createNameAutoBase.length > 50) {
    new Toast({
      title: "Ошибка при создании автомобильной базы",
      text: "Название автомобильной базы от 3 до 50 символов (включительно)",
      theme: "danger",
      autohide: true,
      interval: 10000,
    });
    return;
  }

  let tempUserAuthCookie = Cookies.get("OGU_DIPLOM_COOKIE_AUTHTOKEN");

  let responseFetch = await fetch(`${CONFIG.URL_BACKEND}/api/autobase/create`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${tempUserAuthCookie}`,
    },
    body: JSON.stringify({
      Name: createNameAutoBase,
    }),
  });

  const { ok, status } = responseFetch;
  responseFetch = await responseFetch.json();

  setCreateNameAutoBase("");

  if (ok === false && status === 400) {
    new Toast({
      title: "Ошибка при создании автомобильной базы",
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

  loadAutoBases();
}

export default eventCreatedAutoBase;
