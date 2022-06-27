import Toast from "./../../../Toast";

import CONFIG from "./../../../CONFIG.json";

const createAccount = async (event, setButtonRegisterUsingStatus, navigate) => {
  event.preventDefault();

  const data = new FormData(event.currentTarget);

  const newAccount = {
    fio1: data.get("FIO1"),
    fio2: data.get("FIO2"),
    fio3: data.get("FIO3"),
    loginUser: data.get("loginUser"),
    passwordUser: data.get("passwordUser"),
  };

  if (newAccount.fio1.length < 3 || newAccount.fio1.length > 33) {
    new Toast({
      title: "Ошибка",
      text: "Строка с фамилией не должна быть пустой. От 3 до 33 символов (включительно).",
      theme: "danger",
      autohide: true,
      interval: 5000,
    });
    return;
  }

  if (newAccount.fio2.length < 3 || newAccount.fio2.length > 33) {
    new Toast({
      title: "Ошибка",
      text: "Строка с именем не должна быть пустой. От 3 до 33 символов (включительно).",
      theme: "danger",
      autohide: true,
      interval: 5000,
    });
    return;
  }

  if (newAccount.fio3.length < 3 || newAccount.fio3.length > 33) {
    new Toast({
      title: "Ошибка",
      text: "Строка с отчеством не должна быть пустой. От 3 до 33 символов (включительно).",
      theme: "danger",
      autohide: true,
      interval: 5000,
    });
    return;
  }

  if (newAccount.loginUser.length < 2 || newAccount.loginUser.length > 20) {
    new Toast({
      title: "Ошибка",
      text: "Логин не должен быть пустой строкой, либо меньше двух или больше двадцати символов",
      theme: "danger",
      autohide: true,
      interval: 5000,
    });
    return;
  }

  if (
    newAccount.passwordUser.length < 2 ||
    newAccount.passwordUser.length > 30
  ) {
    new Toast({
      title: "Ошибка",
      text: "Пароль не должен быть пустой строкой, либо меньше двух или больше тридцати символов",
      theme: "danger",
      autohide: true,
      interval: 5000,
    });
    return;
  }

  new Toast({
    title: "Создание аккаунта",
    text: "На сервер был отправлен запрос на создание аккаунта, ждите...",
    theme: "light",
    autohide: true,
    interval: 3000,
  });

  let responseFetch = await fetch(`${CONFIG.URL_BACKEND}/account/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(newAccount),
  });

  const { ok, status } = responseFetch;
  responseFetch = await responseFetch.json();

  if (!ok && status === 400) {
    new Toast({
      title: "Ошибка при создании аккаунта",
      text: responseFetch,
      theme: "danger",
      autohide: true,
      interval: 5000,
    });
    return;
  }

  new Toast({
    title: "Вас ждет успех!",
    text: `${responseFetch}`,
    theme: "success",
    autohide: true,
    interval: 8000,
  });

  new Toast({
    title: "Переадресация",
    text: `Пожалуйста, оставайтесь на этой странице! Через 8 секунд вас автоматически перенаправит на страницу авторизации...`,
    theme: "info",
    autohide: true,
    interval: 10000,
  });

  setButtonRegisterUsingStatus(true);
  setTimeout(() => navigate("/account/login"), 8000);
  return;
};

export default createAccount;
