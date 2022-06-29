import moment from "moment";
import Cookies from "js-cookie";
import Toast from "./../../../../Toast";

import CONFIG from "./../../../../CONFIG.json";

async function eventChangedSheet(
  loadSheets,
  inputObjectSheet,
  setChangedSheet,
  setInputObjectSheet,
  changedSheet
) {
  let tempObjectChangedSheetSend = {
    ...inputObjectSheet,
    ID: changedSheet.ID,
    IDsigner: changedSheet.IDsigner.ID,
  };

  if (
    !("NumberSheet" in tempObjectChangedSheetSend) ||
    tempObjectChangedSheetSend.NumberSheet === null ||
    tempObjectChangedSheetSend.NumberSheet.length < 3 ||
    tempObjectChangedSheetSend.NumberSheet.length > 10
  ) {
    new Toast({
      title: "Ошибка при изменении ведомости",
      text: `Поле ввода номера не должно быть пустым и в нем должнобыть от 3 до 10 символов (включительно)`,
      theme: "danger",
      autohide: true,
      interval: 10000,
    });
    return;
  }

  if (
    !("IDgarage" in tempObjectChangedSheetSend) ||
    tempObjectChangedSheetSend.IDgarage === null ||
    tempObjectChangedSheetSend.IDgarage === -1
  ) {
    new Toast({
      title: "Ошибка при изменении ведомости",
      text: `Гараж не выбран`,
      theme: "danger",
      autohide: true,
      interval: 10000,
    });
    return;
  }

  let tempUserAuthCookie = Cookies.get("OGU_DIPLOM_COOKIE_AUTHTOKEN");

  let responseFetch = await fetch(`${CONFIG.URL_BACKEND}/api/sheet/change/`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${tempUserAuthCookie}`,
    },
    body: JSON.stringify(tempObjectChangedSheetSend),
  });

  const { ok, status } = responseFetch;
  responseFetch = await responseFetch.json();

  setChangedSheet(null);
  setInputObjectSheet({
    ID: null,
    NumberSheet: null,
    DateSheet: moment(new Date()).format("YYYY-MM-DD"),
    IDgarage: null,
    IDsigner: null,
  });

  if (ok === false && status === 400) {
    new Toast({
      title: "Ошибка при изменении ведомости",
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

  loadSheets();
}

export default eventChangedSheet;
