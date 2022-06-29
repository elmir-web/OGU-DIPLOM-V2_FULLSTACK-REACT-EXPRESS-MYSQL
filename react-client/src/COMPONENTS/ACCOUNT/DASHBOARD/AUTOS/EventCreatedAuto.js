import Cookies from "js-cookie";
import Toast from "./../../../../Toast";

import CONFIG from "./../../../../CONFIG.json";

async function eventCreatedAuto(loadVehicles, createVehicle, setCreateVehicle) {
  if (!createVehicle) {
    new Toast({
      title: "Ошибка при создании транспорта",
      text: "В поля ввода ничего не введено!",
      theme: "danger",
      autohide: true,
      interval: 10000,
    });
    return;
  }

  if (
    !("Model" in createVehicle) ||
    createVehicle.Model.length < 3 ||
    createVehicle.Model.length > 50
  ) {
    new Toast({
      title: "Ошибка при создании транспорта",
      text: `Поле ввода модели не должно быть пустым и в нем должнобыть от 3 до 50 символов (включительно)`,
      theme: "danger",
      autohide: true,
      interval: 10000,
    });
    return;
  }

  if (
    !("Number" in createVehicle) ||
    createVehicle.Number.length < 3 ||
    createVehicle.Number.length > 10
  ) {
    new Toast({
      title: "Ошибка при создании транспорта",
      text: `Поле ввода гос.номера не должно быть пустым и в нем должнобыть от 3 до 10 символов (включительно)`,
      theme: "danger",
      autohide: true,
      interval: 10000,
    });
    return;
  }

  if (!("IDgsm" in createVehicle) || createVehicle.IDgsm === -1) {
    new Toast({
      title: "Ошибка при создании транспорта",
      text: `Вид ГСМ не выбран`,
      theme: "danger",
      autohide: true,
      interval: 10000,
    });
    return;
  }

  if (!("IDgarage" in createVehicle) || createVehicle.IDgarage === -1) {
    new Toast({
      title: "Ошибка при создании транспорта",
      text: `Гараж не выбран`,
      theme: "danger",
      autohide: true,
      interval: 10000,
    });
    return;
  }

  if (
    !("mileage" in createVehicle) ||
    createVehicle.mileage.length < 3 ||
    createVehicle.mileage.length > 10
  ) {
    new Toast({
      title: "Ошибка при создании транспорта",
      text: `Поле ввода пробега не должно быть пустым и в нем должнобыть от 3 до 10 символов (включительно)`,
      theme: "danger",
      autohide: true,
      interval: 10000,
    });
    return;
  }

  if (!Number.isInteger(parseFloat(createVehicle.mileage))) {
    new Toast({
      title: "Ошибка при создании транспорта",
      text: `Поле ввода пробега должно быть числом`,
      theme: "danger",
      autohide: true,
      interval: 10000,
    });
    return;
  }

  if (
    !("liters" in createVehicle) ||
    !window.isValidDouble(createVehicle.liters)
  ) {
    new Toast({
      title: "Ошибка при создании транспорта",
      text: `Поле ввода литров не должно быть пустым и должно иметь в себе число вида 3.54`,
      theme: "danger",
      autohide: true,
      interval: 10000,
    });
    return;
  }

  if (
    !("expense" in createVehicle) ||
    !window.isValidDouble(createVehicle.expense)
  ) {
    new Toast({
      title: "Ошибка при создании транспорта",
      text: `Поле ввода расхода не должно быть пустым и должно иметь в себе число вида 3.54`,
      theme: "danger",
      autohide: true,
      interval: 10000,
    });

    return;
  }

  let tempUserAuthCookie = Cookies.get("OGU_DIPLOM_COOKIE_AUTHTOKEN");

  let responseFetch = await fetch(`${CONFIG.URL_BACKEND}/api/vehicle/create`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${tempUserAuthCookie}`,
    },
    body: JSON.stringify(createVehicle),
  });

  const { ok, status } = responseFetch;
  responseFetch = await responseFetch.json();

  setCreateVehicle(null);

  if (ok === false && status === 400) {
    new Toast({
      title: "Ошибка при создании автомобиля",
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

  loadVehicles();
}

export default eventCreatedAuto;
