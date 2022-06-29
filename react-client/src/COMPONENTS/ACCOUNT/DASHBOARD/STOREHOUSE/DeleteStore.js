import Toast from "./../../../../Toast";
import Cookies from "js-cookie";

import CONFIG from "./../../../../CONFIG.json";

async function deleteStore(statusAccessEditing, loadStoreHouse, storeItem) {
  if (!statusAccessEditing) {
    new Toast({
      title: "Ошибка при удалении гсм со склада",
      text: "У вашего аккаунта не достаточный уровень доступа, чтобы удалить часть склада!",
      theme: "danger",
      autohide: true,
      interval: 10000,
    });
    return;
  }

  let tempUserAuthCookie = Cookies.get("OGU_DIPLOM_COOKIE_AUTHTOKEN");

  let responseFetch = await fetch(
    `${CONFIG.URL_BACKEND}/api/storehouse/delete/${storeItem.ID}`,
    {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${tempUserAuthCookie}`,
      },
    }
  );
  const { ok, status } = responseFetch;
  responseFetch = await responseFetch.json();

  if (ok === false && status === 400) {
    new Toast({
      title: "Ошибка при удалении гсм со склада",
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

export default deleteStore;
