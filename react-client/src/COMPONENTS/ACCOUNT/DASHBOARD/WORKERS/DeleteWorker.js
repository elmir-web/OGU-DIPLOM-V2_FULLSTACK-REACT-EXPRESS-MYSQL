import Toast from "./../../../../Toast";
import Cookies from "js-cookie";

import CONFIG from "./../../../../CONFIG.json";

async function deleteWorker(
  worker,
  loadWorkers,
  statusAccessEditing,
  workerAccount,
  dashboardExit
) {
  if (!statusAccessEditing) {
    new Toast({
      title: "Ошибка при удалении сотрудника",
      text: "У вашего аккаунта не достаточный уровень доступа, чтобы удалить сотрудника!",
      theme: "danger",
      autohide: true,
      interval: 10000,
    });
    return;
  }

  let tempUserAuthCookie = Cookies.get("OGU_DIPLOM_COOKIE_AUTHTOKEN");

  let responseFetch = await fetch(
    `${CONFIG.URL_BACKEND}/api/worker/delete/${worker.ID}`,
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
      title: "Ошибка при удалении сотрудника",
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

  loadWorkers();

  if (workerAccount.ID === worker.ID) {
    new Toast({
      title: "Вы удалили свой аккаунт!",
      text: "Так как вы удалили свой аккаунт, с этого момента у вас нет доступа к вашему профилю. Прощайте:)",
      theme: "warning",
      autohide: true,
      interval: 10000,
    });

    setTimeout(() => dashboardExit(), 2000);
  }
}

export default deleteWorker;
