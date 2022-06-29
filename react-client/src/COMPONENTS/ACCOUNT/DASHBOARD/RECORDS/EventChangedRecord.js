import Cookies from "js-cookie";
import Toast from "./../../../../Toast";

import CONFIG from "./../../../../CONFIG.json";

async function eventChangedRecord(
  loadRecords,
  inputObjectRecord,
  setChangedRecord,
  setInputObjectRecord,
  changedRecord
) {
  let completedObject = {
    ...inputObjectRecord,
    ID: changedRecord.ID,
  };

  if (
    !("IDsheet" in completedObject) ||
    completedObject.IDsheet === null ||
    completedObject.IDsheet === -1
  ) {
    new Toast({
      title: "Ошибка при изменении путевого листа",
      text: `Ведомость не выбрана`,
      theme: "danger",
      autohide: true,
      interval: 10000,
    });
    return;
  }

  if (
    !("IDcar" in completedObject) ||
    completedObject.IDcar === null ||
    completedObject.IDcar === -1
  ) {
    new Toast({
      title: "Ошибка при изменении путевого листа",
      text: `Автомобиль не выбран`,
      theme: "danger",
      autohide: true,
      interval: 10000,
    });
    return;
  }

  if (
    !("IDdriver" in completedObject) ||
    completedObject.IDdriver === null ||
    completedObject.IDdriver === -1
  ) {
    new Toast({
      title: "Ошибка при изменении путевого листа",
      text: `Водитель не выбран`,
      theme: "danger",
      autohide: true,
      interval: 10000,
    });
    return;
  }

  if (
    !("NumberPL" in completedObject) ||
    completedObject.NumberPL === null ||
    completedObject.NumberPL.length < 3 ||
    completedObject.NumberPL.length > 10
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
    !("IDgsm" in completedObject) ||
    completedObject.IDgsm === null ||
    completedObject.IDgsm === -1
  ) {
    new Toast({
      title: "Ошибка при изменении путевого листа",
      text: `ГСМ не выбрана`,
      theme: "danger",
      autohide: true,
      interval: 10000,
    });
    return;
  }

  if (
    !("Liter" in completedObject) ||
    completedObject.Liter === null ||
    !window.isValidDouble(completedObject.Liter)
  ) {
    new Toast({
      title: "Ошибка при изменении путевого листа",
      text: `Поле ввода литров не должно быть пустым и должно иметь в себе число вида 3.54`,
      theme: "danger",
      autohide: true,
      interval: 10000,
    });
    return;
  }

  if (completedObject.Liter < changedRecord.usedLiter) {
    new Toast({
      title: "Ошибка при изменении путевого листа",
      text: `Вы не можете установить количество литров меньше, чем уже выдано!`,
      theme: "danger",
      autohide: true,
      interval: 10000,
    });
    return;
  }

  if (
    !("openMileage" in completedObject) ||
    completedObject.openMileage === null ||
    completedObject.openMileage.length < 1 ||
    completedObject.openMileage.length > 10
  ) {
    new Toast({
      title: "Ошибка при изменении ведомости",
      text: `Поле ввода пробега на момент открытия не должно быть пустым и в нем должнобыть от 1 до 10 символов (включительно)`,
      theme: "danger",
      autohide: true,
      interval: 10000,
    });
    return;
  }

  if (
    !("closeMileage" in completedObject) ||
    completedObject.closeMileage === null ||
    completedObject.closeMileage.length < 1 ||
    completedObject.closeMileage.length > 10
  ) {
    new Toast({
      title: "Ошибка при изменении ведомости",
      text: `Поле ввода пробега на момент закрытия не должно быть пустым и в нем должнобыть от 1 до 10 символов (включительно)`,
      theme: "danger",
      autohide: true,
      interval: 10000,
    });
    return;
  }

  if (completedObject.closeMileage === "-1") {
    completedObject.closeMileage = null;
  }

  completedObject.recStatus = 1;

  let tempUserAuthCookie = Cookies.get("OGU_DIPLOM_COOKIE_AUTHTOKEN");

  let responseFetch = await fetch(`${CONFIG.URL_BACKEND}/api/record/change`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${tempUserAuthCookie}`,
    },
    body: JSON.stringify(completedObject),
  });

  const { ok, status } = responseFetch;
  responseFetch = await responseFetch.json();

  setChangedRecord(null);

  setInputObjectRecord({
    ID: null,
    IDsheet: null,
    IDcar: null,
    IDdriver: null,
    NumberPL: null,
    IDgsm: null,
    Liter: null,
  });

  if (ok === false && status === 400) {
    new Toast({
      title: "Ошибка при изменении путевого листа",
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

export default eventChangedRecord;
