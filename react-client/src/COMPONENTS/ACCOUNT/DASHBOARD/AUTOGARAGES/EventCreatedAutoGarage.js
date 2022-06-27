import Cookies from "js-cookie";
import Toast from "./../../../../Toast";

import CONFIG from "./../../../../CONFIG.json";

async function eventCreatedAutoGarage(
  loadAutoGarages,
  createAutoBase,
  setCreateAutoBase
) {
  if (!createAutoBase) {
    new Toast({
      title: "Ошибка при создании гаража",
      text: "В поля ввода ничего не введено!",
      theme: "danger",
      autohide: true,
      interval: 10000,
    });
    return;
  }

  if (
    !("Name" in createAutoBase) ||
    createAutoBase.Name.length < 3 ||
    createAutoBase.Name.length > 50
  ) {
    new Toast({
      title: "Ошибка при создании гаража",
      text: `Поле ввода названия не должно быть пустым и в нем должнобыть от 3 до 50 символов (включительно)`,
      theme: "danger",
      autohide: true,
      interval: 10000,
    });
    return;
  }

  if (!("IDbase" in createAutoBase) || createAutoBase.IDbase === -1) {
    new Toast({
      title: "Ошибка при создании гаража",
      text: `Автобаза не выбрана`,
      theme: "danger",
      autohide: true,
      interval: 10000,
    });
    return;
  }

  let tempUserAuthCookie = Cookies.get("OGU_DIPLOM_COOKIE_AUTHTOKEN");

  let responseFetch = await fetch(
    `${CONFIG.URL_BACKEND}/api/autogarage/create`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${tempUserAuthCookie}`,
      },
      body: JSON.stringify(createAutoBase),
    }
  );

  const { ok, status } = responseFetch;
  responseFetch = await responseFetch.json();

  setCreateAutoBase(null);

  if (ok === false && status === 400) {
    new Toast({
      title: "Ошибка при создании гаража",
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

  loadAutoGarages();
}

export default eventCreatedAutoGarage;
