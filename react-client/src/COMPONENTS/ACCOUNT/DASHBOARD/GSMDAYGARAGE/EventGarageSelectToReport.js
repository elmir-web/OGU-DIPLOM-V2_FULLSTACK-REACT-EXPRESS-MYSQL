import Toast from "./../../../../Toast";
import Cookies from "js-cookie";

import CONFIG from "./../../../../CONFIG.json";

async function eventGarageSelectToReport(
  garageSelected,
  setDivGarageHidden,
  setSheetsToGarage,
  setSheetLoaded,
  statusAccessEditing
) {
  if (!statusAccessEditing) {
    new Toast({
      title: "Ошибка при выборе гаража",
      text: "У вашего аккаунта не достаточный уровень доступа, чтобы получить отчет!",
      theme: "danger",
      autohide: true,
      interval: 10000,
    });
    return;
  }

  if (garageSelected === null) {
    new Toast({
      title: "Ошибка при выборе гаража",
      text: "Вы не выбрали гараж!",
      theme: "danger",
      autohide: true,
      interval: 10000,
    });
    return true;
  }

  setDivGarageHidden(true);

  let tempUserAuthCookie = Cookies.get("OGU_DIPLOM_COOKIE_AUTHTOKEN");

  let sheets = await fetch(
    `${CONFIG.URL_BACKEND}/api/gsm-day-garage/get-sheet/get/${garageSelected}`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${tempUserAuthCookie}`,
      },
    }
  );

  sheets = await sheets.json();

  setSheetsToGarage(sheets);
  setSheetLoaded(true);
}

export default eventGarageSelectToReport;
