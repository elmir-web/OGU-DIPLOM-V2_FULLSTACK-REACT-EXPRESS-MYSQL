import Cookies from "js-cookie";
import Toast from "./../../../../Toast";

import CONFIG from "./../../../../CONFIG.json";

async function eventCreatedStoreItem(
  loadStoreHouse,
  createStoreItem,
  setCreateStoreItem
) {
  if (!createStoreItem) {
    new Toast({
      title: "Ошибка при создании элемента склада",
      text: "В поля ввода ничего не введено!",
      theme: "danger",
      autohide: true,
      interval: 10000,
    });
    return;
  }

  if (!("IDgsm" in createStoreItem) || createStoreItem.IDgsm === -1) {
    new Toast({
      title: "Ошибка при создании элемента склада",
      text: `Вид ГСМ не выбран`,
      theme: "danger",
      autohide: true,
      interval: 10000,
    });
    return;
  }

  if (
    !("liters" in createStoreItem) ||
    !window.isValidDouble(createStoreItem.liters)
  ) {
    new Toast({
      title: "Ошибка при создании элемента склада",
      text: `Поле ввода литров не должно быть пустым и должно иметь в себе число вида 3.54`,
      theme: "danger",
      autohide: true,
      interval: 10000,
    });
    return;
  }

  let tempUserAuthCookie = Cookies.get("OGU_DIPLOM_COOKIE_AUTHTOKEN");

  let responseFetch = await fetch(
    `${CONFIG.URL_BACKEND}/api/storehouse/create`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${tempUserAuthCookie}`,
      },
      body: JSON.stringify(createStoreItem),
    }
  );

  const { ok, status } = responseFetch;
  responseFetch = await responseFetch.json();

  setCreateStoreItem(null);

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

  loadStoreHouse();
}

export default eventCreatedStoreItem;
