// __________________________________________________ ИМПОРТЫ
const Router = require("express");
const { check } = require("express-validator"); // Импортируем функцию проверки данных "check" из express-validator

// __________________________________________________ ОБЪЕКТЫ
const router = new Router();

// __________________________________________________ КОНТРОЛЛЕРЫ
const AccountController = require("../controllers/Account.Controller"); // Контроллер аккаунта

// __________________________________________________ Middlewares
const authMiddleware = require("../middlewares/Auth.Middleware"); // Middleware проверки на авторизованность
// const roleMiddleware = require("./../middlewares/role.middleware"); // Middleware проверки на доступ по должности

// __________________________________________________ Роутеры API
// Роутер регистрации
router.post(
  "/register", // API: http(s)://адрес.порт/account/register
  // Передаем массив middlewares проверки валидности данных
  [
    // Первый элемент массива
    check(
      "fio1", // Проверяем "fio1"
      "Фамилия не может быть меньше 2 или больше 33 символа" // Если "fio1" не валид то будет такое сообщение
    ).isLength({ min: 2, max: 33 }), // условия валидности, а именно длинна от 2 до 33 включительно

    // Второй элемент массива
    check(
      "fio2", // Проверяем "fio2"
      "Имя не может быть меньше 2 или больше 33 символа" // Если "fio2" не валид то будет такое сообщение
    ).isLength({ min: 2, max: 33 }), // условия валидности, а именно длинна от 2 до 33 включительно

    // Третий элемент массива
    check(
      "fio3", // Проверяем "fio3"
      "Отчество не может быть меньше 2 или больше 33 символа" // Если "fio3" не валид то будет такое сообщение
    ).isLength({ min: 2, max: 33 }), // условия валидности, а именно длинна от 2 до 33 включительно

    // Четвертый элемент массива
    check(
      "loginUser", // Проверяем "loginUser"
      "Логин не должен быть меньше 2 или больше 20 символов" // Если "loginUser" не валид то будет такое сообщение
    ).isLength({ min: 2, max: 20 }), // условия валидности, а именно длинна от 2 до 20 включительно

    // Пятый элемент массива
    check(
      "passwordUser", // Проверяем "passwordUser"
      "Пароль не должен быть меньше 2 или больше 30 символов" // Если "passwordUser" не валид то будет такое сообщение
    ).isLength({ min: 2, max: 30 }), // условия валидности, а именно длинна от 2 до 30 включительно
  ],
  AccountController.register // Передаем метод регистрации контроллера аккаунта
);

// Роутер авторизации
router.post(
  "/login", // API: http(s)://адрес.порт/account/login
  // Передаем массив middlewares проверки валидности данных
  [
    // Первый элемент массива
    check(
      "loginUser", // Проверяем "loginUser"
      "Логин не должен быть меньше 2 или больше 20 символов" // Если "loginUser" не валид то будет такое сообщение
    ).isLength({ min: 2, max: 20 }), // условия валидности, а именно длинна от 2 до 20 включительно

    // Второй элемент массива
    check(
      "passwordUser", // Проверяем "passwordUser"
      "Пароль не должен быть меньше 2 или больше 30 символов" // Если "passwordUser" не валид то будет такое сообщение
    ).isLength({ min: 2, max: 30 }), // условия валидности, а именно длинна от 2 до 30 включительно
  ],
  AccountController.login // Передаем метод авторизации контроллера аккаунта
);

router.get("/profile", authMiddleware, AccountController.getWorkerProfile);

router.post("/profile/change", authMiddleware, AccountController.setFIO);

router.post(
  "/profile/access-data/change",
  authMiddleware,
  AccountController.setAccessData
);

// Роутер получения всех пользователей
// router.get("/users", authMiddleware, AccountController.getAllUsers); // только для авторизованных пользователей

// Роутер получения всех пользователей
// router.get(
//   "/users",
//   roleMiddleware([`Подписант`]),
//   AccountController.getAllUsers
// );

module.exports = router;
