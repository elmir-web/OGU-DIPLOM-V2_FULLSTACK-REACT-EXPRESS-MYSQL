import Toast from "./../../../../Toast";
import Cookies from "js-cookie";

import CONFIG from "./../../../../CONFIG.json";

async function deleteAutoBase(
  itemAutoBase,
  statusAccessEditing,
  loadAutoBases
) {
  if (!statusAccessEditing) {
    new Toast({
      title: "Ошибка при удалении автомобильной базы",
      text: "У вашего аккаунта не достаточный уровень доступа, чтобы удалить автомобильную базу!",
      theme: "danger",
      autohide: true,
      interval: 10000,
    });
    return;
  }

  let tempUserAuthCookie = Cookies.get("OGU_DIPLOM_COOKIE_AUTHTOKEN");

  let responseFetch = await fetch(
    `${CONFIG.URL_BACKEND}/api/autobase/delete/${itemAutoBase.ID}`,
    {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${tempUserAuthCookie}`,
      },
    }
  );

  const { ok, status } = responseFetch;
  responseFetch = await responseFetch.json();

  console.log(ok, status, responseFetch);

  if (ok === false && status === 400) {
    new Toast({
      title: "Ошибка при удалении автомобильной базы",
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

  loadAutoBases();
  return;
}

export default deleteAutoBase;
