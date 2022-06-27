import Cookies from "js-cookie";
import Toast from "./../../../../Toast";

import CONFIG from "./../../../../CONFIG.json";

async function eventChangedAutoBase(
  loadAutoBases,
  changedAutoBase,
  inputNameAutoBase,
  setChangedAutoBase,
  setInputNameAutoBase
) {
  if (inputNameAutoBase.length < 3 || inputNameAutoBase.length > 50) {
    new Toast({
      title: "Ошибка при изменении автомобильной базы",
      text: "Название автомобильной базы от 3 до 50 символов (включительно)",
      theme: "danger",
      autohide: true,
      interval: 10000,
    });
    return;
  }

  let tempUserAuthCookie = Cookies.get("OGU_DIPLOM_COOKIE_AUTHTOKEN");

  console.log(tempUserAuthCookie);

  let tempChanged = {
    ...changedAutoBase,
    Name: inputNameAutoBase,
  };

  setChangedAutoBase(null);
  setInputNameAutoBase("");

  let responseFetch = await fetch(`${CONFIG.URL_BACKEND}/api/autobase/change`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${tempUserAuthCookie}`,
    },
    body: JSON.stringify(tempChanged),
  });

  const { ok, status } = responseFetch;
  responseFetch = await responseFetch.json();

  if (ok === false && status === 400) {
    new Toast({
      title: "Ошибка при изменении автомобильной базы",
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
}

export default eventChangedAutoBase;
