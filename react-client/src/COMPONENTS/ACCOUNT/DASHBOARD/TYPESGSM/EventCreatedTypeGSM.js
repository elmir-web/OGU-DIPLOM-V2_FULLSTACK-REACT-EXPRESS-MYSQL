import Cookies from "js-cookie";
import Toast from "./../../../../Toast";

import CONFIG from "./../../../../CONFIG.json";

async function eventCreatedTypeGSM(
  createObjectGSM,
  setCreateObjectGSM,
  loadTypesGSM
) {
  if (!createObjectGSM) {
    new Toast({
      title: "Ошибка при создании типа ГСМ",
      text: `Поля ввода остались совершенно пустыми`,
      theme: "danger",
      autohide: true,
      interval: 10000,
    });
    return;
  }

  if (
    !("Name" in createObjectGSM) ||
    createObjectGSM.Name.length < 3 ||
    createObjectGSM.Name.length > 50
  ) {
    new Toast({
      title: "Ошибка при создании типа ГСМ",
      text: `Поле ввода названия не должно быть пустым и в нем должнобыть от 3 до 50 символов (включительно)`,
      theme: "danger",
      autohide: true,
      interval: 10000,
    });
    return;
  }

  if (
    !("ForKilo" in createObjectGSM) ||
    !window.isValidDouble(createObjectGSM.ForKilo)
  ) {
    new Toast({
      title: "Ошибка при создании типа ГСМ",
      text: `Поле ввода веса не должно быть пустым и должно иметь в себе число вида 3.54`,
      theme: "danger",
      autohide: true,
      interval: 10000,
    });
    return;
  }

  let tempUserAuthCookie = Cookies.get("OGU_DIPLOM_COOKIE_AUTHTOKEN");

  let responseFetch = await fetch(`${CONFIG.URL_BACKEND}/api/type-gsm/create`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${tempUserAuthCookie}`,
    },
    body: JSON.stringify(createObjectGSM),
  });

  const { ok, status } = responseFetch;
  responseFetch = await responseFetch.json();

  setCreateObjectGSM(null);

  if (ok === false && status === 400) {
    new Toast({
      title: "Ошибка при создании типа ГСМ",
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

  loadTypesGSM();
}

export default eventCreatedTypeGSM;
