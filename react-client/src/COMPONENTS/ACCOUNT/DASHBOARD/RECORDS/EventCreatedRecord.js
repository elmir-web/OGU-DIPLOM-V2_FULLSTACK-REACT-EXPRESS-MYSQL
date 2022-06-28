import Cookies from "js-cookie";
import Toast from "./../../../../Toast";

import CONFIG from "./../../../../CONFIG.json";

async function eventCreatedRecord(loadRecords, createRecord, setCreateRecord) {
  if (createRecord === null) {
    new Toast({
      title: "Ошибка при создании путевого листа",
      text: "Ошибка: вы нечего не сделали",
      theme: "danger",
      autohide: true,
      interval: 10000,
    });
    return;
  }

  if (
    !("IDsheet" in createRecord) ||
    createRecord.IDsheet === null ||
    createRecord.IDsheet === -1
  ) {
    new Toast({
      title: "Ошибка при создании путевого листа",
      text: `Ведомость не выбрана`,
      theme: "danger",
      autohide: true,
      interval: 10000,
    });
    return;
  }

  if (
    !("IDcar" in createRecord) ||
    createRecord.IDcar === null ||
    createRecord.IDcar === -1
  ) {
    new Toast({
      title: "Ошибка при создании путевого листа",
      text: `Автомобиль не выбран`,
      theme: "danger",
      autohide: true,
      interval: 10000,
    });
    return;
  }

  if (
    !("IDdriver" in createRecord) ||
    createRecord.IDdriver === null ||
    createRecord.IDdriver === -1
  ) {
    new Toast({
      title: "Ошибка при создании путевого листа",
      text: `Водитель не выбран`,
      theme: "danger",
      autohide: true,
      interval: 10000,
    });
    return;
  }

  if (
    !("NumberPL" in createRecord) ||
    createRecord.NumberPL === null ||
    createRecord.NumberPL.length < 3 ||
    createRecord.NumberPL.length > 10
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

  if (
    !("IDgsm" in createRecord) ||
    createRecord.IDgsm === null ||
    createRecord.IDgsm === -1
  ) {
    new Toast({
      title: "Ошибка при создании путевого листа",
      text: `ГСМ не выбран`,
      theme: "danger",
      autohide: true,
      interval: 10000,
    });
    return;
  }

  if (
    !("Liter" in createRecord) ||
    createRecord.Liter === null ||
    !window.isValidDouble(createRecord.Liter)
  ) {
    new Toast({
      title: "Ошибка при создании путевого листа",
      text: `Поле ввода литров не должно быть пустым и должно иметь в себе число вида 3.54`,
      theme: "danger",
      autohide: true,
      interval: 10000,
    });
    return;
  }

  let tempUserAuthCookie = Cookies.get("OGU_DIPLOM_COOKIE_AUTHTOKEN");

  let responseFetch = await fetch(`${CONFIG.URL_BACKEND}/api/record/create`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${tempUserAuthCookie}`,
    },
    body: JSON.stringify(createRecord),
  });

  const { ok, status } = responseFetch;
  responseFetch = await responseFetch.json();

  setCreateRecord(null);

  if (ok === false && status === 400) {
    new Toast({
      title: "Ошибка при создании путевого листа",
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

  loadRecords();
}

export default eventCreatedRecord;
