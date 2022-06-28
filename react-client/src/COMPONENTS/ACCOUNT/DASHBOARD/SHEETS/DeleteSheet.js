import Toast from "./../../../../Toast";
import Cookies from "js-cookie";

import CONFIG from "./../../../../CONFIG.json";

async function deleteSheet(sheet, loadSheets, statusAccessEditing) {
  if (!statusAccessEditing) {
    new Toast({
      title: "Ошибка при удалении ведомости",
      text: "У вашего аккаунта не достаточный уровень доступа, чтобы удалить ведомость!",
      theme: "danger",
      autohide: true,
      interval: 10000,
    });
    return;
  }

  let tempUserAuthCookie = Cookies.get("OGU_DIPLOM_COOKIE_AUTHTOKEN");

  let response = await fetch(
    `${CONFIG.URL_BACKEND}/api/sheet/delete/${sheet.ID}`,
    {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${tempUserAuthCookie}`,
      },
      body: JSON.stringify(sheet),
    }
  );

  const { ok, status } = response;
  response = await response.json();

  if (ok === false && status === 400) {
    new Toast({
      title: "Ошибка при удалении ведомости",
      text: response,
      theme: "danger",
      autohide: true,
      interval: 10000,
    });
    return;
  }

  new Toast({
    title: "Вас ждет успех!",
    text: response,
    theme: "success",
    autohide: true,
    interval: 10000,
  });

  loadSheets();
}

export default deleteSheet;
