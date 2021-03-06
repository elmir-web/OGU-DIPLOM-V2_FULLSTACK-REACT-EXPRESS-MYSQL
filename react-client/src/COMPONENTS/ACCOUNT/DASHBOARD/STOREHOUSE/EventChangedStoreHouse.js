import Cookies from "js-cookie";
import Toast from "./../../../../Toast";

import CONFIG from "./../../../../CONFIG.json";

async function eventChangedStoreHouse(
  loadStoreHouse,
  changeInputStoreItem,
  setChangedStoreItem,
  setChangeInputStoreItem
) {
  if (
    !("IDgsm" in changeInputStoreItem) ||
    changeInputStoreItem.IDgsm === -1 ||
    changeInputStoreItem.IDgsm === null
  ) {
    new Toast({
      title: "Ошибка при изменении элемента склада",
      text: `Вид ГСМ не выбран`,
      theme: "danger",
      autohide: true,
      interval: 10000,
    });
    return;
  }

  if (
    !("liters" in changeInputStoreItem) ||
    !window.isValidDouble(changeInputStoreItem.liters)
  ) {
    new Toast({
      title: "Ошибка при изменении элемента склада",
      text: `Поле ввода литров не должно быть пустым и должно иметь в себе число вида 3.54`,
      theme: "danger",
      autohide: true,
      interval: 10000,
    });
    return;
  }

  let tempUserAuthCookie = Cookies.get("OGU_DIPLOM_COOKIE_AUTHTOKEN");

  let responseFetch = await fetch(
    `${CONFIG.URL_BACKEND}/api/storehouse/change/`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${tempUserAuthCookie}`,
      },
      body: JSON.stringify(changeInputStoreItem),
    }
  );

  const { ok, status } = responseFetch;
  responseFetch = await responseFetch.json();

  setChangedStoreItem(null);
  setChangeInputStoreItem({
    ID: null,
    IDgsm: null,
    liters: null,
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

  loadStoreHouse();
}

export default eventChangedStoreHouse;
