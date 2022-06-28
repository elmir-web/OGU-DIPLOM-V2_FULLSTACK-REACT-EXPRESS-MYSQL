import Cookies from "js-cookie";
import Toast from "./../../../../Toast";

import CONFIG from "./../../../../CONFIG.json";

async function closeStatusRecord(
  statusAccessEditing,
  record,
  workerAccount,
  loadRecords
) {
  if (!statusAccessEditing) {
    new Toast({
      title: "Ошибка при измении статуса путевого листа",
      text: "У вашего аккаунта не достаточный уровень доступа, чтобы изменить статус путевого листа!",
      theme: "danger",
      autohide: true,
      interval: 10000,
    });
    return;
  }

  const { ID: IDsigner } = workerAccount;
  const { IDsheet: sheetData } = record;
  const { IDsigner: userData } = sheetData;
  const { ID, FIO } = userData;

  if (ID !== IDsigner) {
    new Toast({
      title: "Ошибка при изменении статуса путевого листа",
      text: `Путевой лист ведомости подписанта ${FIO}. Вы не можете изменить статус не своего путевого листа!`,
      theme: "danger",
      autohide: true,
      interval: 10000,
    });
    return;
  }

  record.recStatus = Number(!record.recStatus);

  let tempUserAuthCookie = Cookies.get("OGU_DIPLOM_COOKIE_AUTHTOKEN");

  let responseFetch = await fetch(`${CONFIG.URL_BACKEND}/api/record/change`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${tempUserAuthCookie}`,
    },
    body: JSON.stringify(record),
  });

  const { ok, status } = responseFetch;
  responseFetch = await responseFetch.json();

  loadRecords();
}

export default closeStatusRecord;
