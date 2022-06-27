import Cookies from "js-cookie";
import Toast from "./../../../../Toast";

import CONFIG from "./../../../../CONFIG.json";

async function eventChangedTypeGSM(
  loadTypesGSM,
  setChangedGSM,
  setInputObjectGSM,
  inputObjectGSM
) {
  if (inputObjectGSM.Name.length < 3 || inputObjectGSM.Name.length > 50) {
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
    !("ForKilo" in inputObjectGSM) ||
    !window.isValidDouble(inputObjectGSM.ForKilo)
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

  let responseFetch = await fetch(`${CONFIG.URL_BACKEND}/api/type-gsm/change`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${tempUserAuthCookie}`,
    },
    body: JSON.stringify(inputObjectGSM),
  });

  const { ok, status } = responseFetch;
  responseFetch = await responseFetch.json();

  console.log(ok, status, responseFetch);

  setChangedGSM(null);
  setInputObjectGSM({
    ID: null,
    Name: "",
    ForKilo: "",
  });

  if (ok === false && status === 400) {
    new Toast({
      title: "Ошибка при изменении типа ГСМ",
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

export default eventChangedTypeGSM;
