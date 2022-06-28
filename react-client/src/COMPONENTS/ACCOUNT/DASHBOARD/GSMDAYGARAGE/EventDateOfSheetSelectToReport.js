import Toast from "./../../../../Toast";
import Cookies from "js-cookie";

import CONFIG from "./../../../../CONFIG.json";

async function eventDateOfSheetSelectToReport(
  setSheetLoaded,
  setDivTableReport,
  garageSelected,
  sheetSelected,
  setReportGSM,
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

  if (sheetSelected === null) {
    new Toast({
      title: "Ошибка при выборе даты",
      text: "Вы не выбрали дату!",
      theme: "danger",
      autohide: true,
      interval: 10000,
    });
    return;
  }

  setSheetLoaded(false);
  setDivTableReport(true);

  const sendObject = {
    garageID: garageSelected,
    date: sheetSelected,
  };

  let tempUserAuthCookie = Cookies.get("OGU_DIPLOM_COOKIE_AUTHTOKEN");

  let responseFetch = await fetch(
    `${CONFIG.URL_BACKEND}/api/gsm-day-garage/get-report/get`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${tempUserAuthCookie}`,
      },
      body: JSON.stringify(sendObject),
    }
  );

  responseFetch = await responseFetch.json();

  setReportGSM(responseFetch);
}

export default eventDateOfSheetSelectToReport;
