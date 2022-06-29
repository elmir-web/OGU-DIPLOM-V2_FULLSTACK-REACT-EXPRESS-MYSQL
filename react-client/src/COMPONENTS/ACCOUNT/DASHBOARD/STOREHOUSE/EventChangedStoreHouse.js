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
    !("liters" in changeInputStoreItem) ||
    !window.isValidDouble(changeInputStoreItem.liters)
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

  loadStoreHouse();
}

export default eventChangedStoreHouse;
