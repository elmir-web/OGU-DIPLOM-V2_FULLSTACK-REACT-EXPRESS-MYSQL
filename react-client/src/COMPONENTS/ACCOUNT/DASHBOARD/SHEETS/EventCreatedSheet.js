import Cookies from "js-cookie";
import Toast from "./../../../../Toast";
import moment from "moment";

import CONFIG from "./../../../../CONFIG.json";

async function eventCreatedSheet(
  loadSheets,
  createSheet,
  setCreateSheet,
  workerAccount
) {
  if (createSheet === null) {
    new Toast({
      title: "Ошибка при создании ведомости",
      text: "Ошибка: вы нечего не сделали",
      theme: "danger",
      autohide: true,
      interval: 10000,
    });
    return;
  }

  let tempObjectCreatedSheetSend = {
    ...createSheet,
    IDsigner: workerAccount.ID,
  };

  if (
    !("NumberSheet" in tempObjectCreatedSheetSend) ||
    tempObjectCreatedSheetSend.NumberSheet.length < 3 ||
    tempObjectCreatedSheetSend.NumberSheet.length > 10
  ) {
    new Toast({
      title: "Ошибка при создании ведомости",
      text: `Поле ввода номера не должно быть пустым и в нем должнобыть от 3 до 10 символов (включительно)`,
      theme: "danger",
      autohide: true,
      interval: 10000,
    });
    return;
  }

  if (tempObjectCreatedSheetSend.DateSheet === undefined) {
    tempObjectCreatedSheetSend = {
      ...tempObjectCreatedSheetSend,
      DateSheet: moment(new Date()).format("YYYY-MM-DD"),
    };
  }

  if (
    !("IDgarage" in tempObjectCreatedSheetSend) ||
    tempObjectCreatedSheetSend.IDgarage === -1
  ) {
    new Toast({
      title: "Ошибка при создании ведомости",
      text: `Гараж не выбран`,
      theme: "danger",
      autohide: true,
      interval: 10000,
    });
    return;
  }

  let tempUserAuthCookie = Cookies.get("OGU_DIPLOM_COOKIE_AUTHTOKEN");

  let responseFetch = await fetch(`${CONFIG.URL_BACKEND}/api/sheet/create`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${tempUserAuthCookie}`,
    },
    body: JSON.stringify(tempObjectCreatedSheetSend),
  });

  const { ok, status } = responseFetch;
  responseFetch = await responseFetch.json();

  if (ok === false && status === 400) {
    new Toast({
      title: "Ошибка при создании ведомости",
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

  setCreateSheet(null);

  loadSheets();
}

export default eventCreatedSheet;
