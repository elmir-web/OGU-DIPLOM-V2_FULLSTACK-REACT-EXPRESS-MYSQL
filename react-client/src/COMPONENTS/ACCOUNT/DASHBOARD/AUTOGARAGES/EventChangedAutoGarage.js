import Cookies from "js-cookie";
import Toast from "./../../../../Toast";

import CONFIG from "./../../../../CONFIG.json";

async function eventChangedAutoGarage(
  loadAutoGarages,
  inputObjectAutoGarage,
  setChangedAutoGarage,
  setInputObjectAutoGarage
) {
  if (
    !("Name" in inputObjectAutoGarage) ||
    inputObjectAutoGarage.Name.length < 3 ||
    inputObjectAutoGarage.Name.length > 50
  ) {
    new Toast({
      title: "Ошибка при изменении гаража",
      text: `Поле ввода названия не должно быть пустым и в нем должнобыть от 3 до 50 символов (включительно)`,
      theme: "danger",
      autohide: true,
      interval: 10000,
    });
    return;
  }

  if (
    !("IDbase" in inputObjectAutoGarage) ||
    inputObjectAutoGarage.IDbase === null ||
    inputObjectAutoGarage.IDbase === -1
  ) {
    new Toast({
      title: "Ошибка при изменении гаража",
      text: `Автобаза не выбрана`,
      theme: "danger",
      autohide: true,
      interval: 10000,
    });
    return;
  }

  let tempUserAuthCookie = Cookies.get("OGU_DIPLOM_COOKIE_AUTHTOKEN");

  let responseFetch = await fetch(
    `${CONFIG.URL_BACKEND}/api/autogarage/change`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${tempUserAuthCookie}`,
      },
      body: JSON.stringify(inputObjectAutoGarage),
    }
  );

  const { ok, status } = responseFetch;
  responseFetch = await responseFetch.json();

  setChangedAutoGarage(null);
  setInputObjectAutoGarage({
    ID: null,
    Name: "",
    IDbase: null,
  });

  if (ok === false && status === 400) {
    new Toast({
      title: "Ошибка при изменении гаража",
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

export default eventChangedAutoGarage;
