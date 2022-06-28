import Toast from "./../../../../Toast";
import Cookies from "js-cookie";

import CONFIG from "./../../../../CONFIG.json";

async function deleteRecord(record, loadRecords, statusAccessEditing) {
  if (!statusAccessEditing) {
    new Toast({
      title: "Ошибка при удалении путевого листа",
      text: "У вашего аккаунта не достаточный уровень доступа, чтобы удалить путевой лист!",
      theme: "danger",
      autohide: true,
      interval: 10000,
    });
    return;
  }

  let tempUserAuthCookie = Cookies.get("OGU_DIPLOM_COOKIE_AUTHTOKEN");

  let responseFetch = await fetch(
    `${CONFIG.URL_BACKEND}/api/record/delete/${record.ID}`,
    {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${tempUserAuthCookie}`,
      },
      body: JSON.stringify(record),
    }
  );

  const { ok, status } = responseFetch;
  responseFetch = await responseFetch.json();

  if (ok === false && status === 400) {
    new Toast({
      title: "Ошибка при удалении путевого листа",
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

export default deleteRecord;
