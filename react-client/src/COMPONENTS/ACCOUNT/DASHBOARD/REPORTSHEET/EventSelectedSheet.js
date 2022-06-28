import Toast from "./../../../../Toast";
import Cookies from "js-cookie";

import CONFIG from "./../../../../CONFIG.json";

async function eventSelectedSheet(
  sheetSelected,
  setDivSheetHidden,
  setSheetReport,
  statusAccessEditing
) {
  if (!statusAccessEditing) {
    new Toast({
      title: "Ошибка при выборе ведомости",
      text: "У вашего аккаунта не достаточный уровень доступа, чтобы выбрать ведомости!",
      theme: "danger",
      autohide: true,
      interval: 10000,
    });
    return;
  }

  if (sheetSelected === null) {
    new Toast({
      title: "Ошибка при выборе ведомости",
      text: "Ошибка: Ведомость не выбрана!",
      theme: "danger",
      autohide: true,
      interval: 10000,
    });
    return true;
  }

  setDivSheetHidden(true);

  let tempUserAuthCookie = Cookies.get("OGU_DIPLOM_COOKIE_AUTHTOKEN");

  let report = await fetch(
    `${CONFIG.URL_BACKEND}/api/report-sheet/get/${sheetSelected}`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${tempUserAuthCookie}`,
      },
    }
  );

  report = await report.json();

  setSheetReport(report);
}

export default eventSelectedSheet;
