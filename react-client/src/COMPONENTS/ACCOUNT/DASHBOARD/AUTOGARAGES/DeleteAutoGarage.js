import Toast from "./../../../../Toast";
import Cookies from "js-cookie";

async function deleteAutoGarage(
  autogarage = null,
  funcRequest,
  loadAutoGarages,
  statusAccessEditing
) {
  if (!statusAccessEditing) {
    new Toast({
      title: "Ошибка при изменении автомобильной базы",
      text: "У вашего аккаунта не достаточный уровень доступа, чтобы изменить автомобильную базу!",
      theme: "danger",
      autohide: true,
      interval: 10000,
    });
    return;
  }

  // TODO: РАЗОБРАТЬСЯ ПОЧЕМУ "УСПЕХ БЫЛ ЕСЛИ ВЫШЕ УБРАТЬ ОТСУТСТВИЕ ДОСТУПА"

  let tempUserAuthCookie = Cookies.get("OGU_DIPLOM_COOKIE_AUTHTOKEN");

  const response = await funcRequest(
    `/api/autogarage/delete/${autogarage.ID}`,
    "DELETE",
    null,
    tempUserAuthCookie
  );

  if (response.ok === false && response.status === 400) {
    new Toast({
      title: "Ошибка при удалении гаража",
      text: response.responseFetch,
      theme: "danger",
      autohide: true,
      interval: 10000,
    });
    return;
  }

  new Toast({
    title: "Вас ждет успех!",
    text: response.responseFetch,
    theme: "success",
    autohide: true,
    interval: 10000,
  });

  loadAutoGarages();
}

export default deleteAutoGarage;