import Cookies from "js-cookie";
import Toast from "./../../../../Toast";

import CONFIG from "./../../../../CONFIG.json";

async function eventChangedAuto(
  loadVehicles,
  inputObjectVehicle,
  setChangedVehicle,
  setInputObjectVehicle
) {
  if (
    !("Model" in inputObjectVehicle) ||
    inputObjectVehicle.Model.length < 3 ||
    inputObjectVehicle.Model.length > 50
  ) {
    new Toast({
      title: "Ошибка при изменении транспорта",
      text: `Поле ввода модели не должно быть пустым и в нем должнобыть от 3 до 50 символов (включительно)`,
      theme: "danger",
      autohide: true,
      interval: 10000,
    });
    return;
  }

  if (
    !("Number" in inputObjectVehicle) ||
    inputObjectVehicle.Number.length < 3 ||
    inputObjectVehicle.Number.length > 10
  ) {
    new Toast({
      title: "Ошибка при изменении транспорта",
      text: `Поле ввода гос.номера не должно быть пустым и в нем должнобыть от 3 до 10 символов (включительно)`,
      theme: "danger",
      autohide: true,
      interval: 10000,
    });
    return;
  }

  if (
    !("IDgarage" in inputObjectVehicle) ||
    inputObjectVehicle.IDgarage === null ||
    inputObjectVehicle.IDgarage === -1
  ) {
    new Toast({
      title: "Ошибка при изменении транспорта",
      text: `Гараж не выбран`,
      theme: "danger",
      autohide: true,
      interval: 10000,
    });
    return;
  }

  if (
    !("mileage" in inputObjectVehicle) ||
    inputObjectVehicle.mileage.length < 3 ||
    inputObjectVehicle.mileage.length > 10
  ) {
    new Toast({
      title: "Ошибка при изменении транспорта",
      text: `Поле ввода пробега не должно быть пустым и в нем должнобыть от 3 до 10 символов (включительно)`,
      theme: "danger",
      autohide: true,
      interval: 10000,
    });
    return;
  }

  let tempUserAuthCookie = Cookies.get("OGU_DIPLOM_COOKIE_AUTHTOKEN");

  let responseFetch = await fetch(`${CONFIG.URL_BACKEND}/api/vehicle/change/`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${tempUserAuthCookie}`,
    },
    body: JSON.stringify(inputObjectVehicle),
  });

  const { ok, status } = responseFetch;
  responseFetch = await responseFetch.json();

  setChangedVehicle(null);
  setInputObjectVehicle({
    ID: null,
    Model: "",
    Number: "",
    IDgarage: null,
  });

  if (ok === false && status === 400) {
    new Toast({
      title: "Ошибка при изменении автомобиля",
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

export default eventChangedAuto;
