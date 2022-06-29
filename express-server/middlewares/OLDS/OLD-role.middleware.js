// __________________________________________________ ИМПОРТЫ
const jwt = require("jsonwebtoken");

// __________________________________________________ НАСТРОЙКИ
const { SERVER_SECRET_KEY } = require("../../ServerConfig.json");

// __________________________________________________ ДОПОЛНИТЕЛЬНЫЙ ФУНКЦИОНАЛ
// Функция вернет массив ID ролей если на нее передать массив ролей текстом
async function getAllRoles(rolesNamesArray) {
  let retArrayIDsRoles = []; // Создаем пока что пустой массив для наших будущих ID ролей

  let [rowsAllRoles] = await global.connectMySQL.execute(
    `SELECT * FROM positions` // отправляем запрос для получения актуальных ролей с СуБД MySQL таблицы ролей
  );

  // Бегаем по массиву ролей полученных с СуБД MySQL
  for (let indexBD = 0; indexBD < rowsAllRoles.length; indexBD++) {
    // Бегаем по локальному массиву ролей
    for (
      let indexLocal = 0;
      indexLocal < rolesNamesArray.length;
      indexLocal++
    ) {
      // Если название роли с таблицы ролей СуБД MySQL совпадает с массивом ролей полученных от параметра middleware при его инициализации
      if (rowsAllRoles[indexBD].Role === rolesNamesArray[indexLocal]) {
        retArrayIDsRoles.push(rowsAllRoles[indexBD].ID); // Пушим в массив ID этой роли
      }
    }
  }
  return retArrayIDsRoles; // Возращаем массив ID ролей
}

// __________________________________________________ MIDDLEWARE
// Получаем массив ролей текстом
module.exports = function (roles) {
  // с помощью замыкания создаем middleware
  return async function (req, res, next) {
    // Скипаем данный метод
    if (req.method === "OPTIONS") {
      next(); // запускаем следующий по ходу middleware
    }

    try {
      roles = await getAllRoles(roles); // Функция вернет массив ID ролей если на нее передать массив ролей текстом

      const token = req.headers.authorization.split(" ")[1]; // Получаем токен из шапки запроса

      // Если токена нет
      if (!token) {
        return res
          .status(403)
          .json({ access: false, message: "Пользователь не авторизован" });
      }

      const decodedData = jwt.verify(token, SERVER_SECRET_KEY); // Декодируем токен с использованием секретного серверного ключа

      const { func: UserRole } = decodedData; // Берем ID роли из декодированных данных и переименовывем на UserRole

      let hasRole = false; // по умолчанию нет доступа

      // бегаем по переданным ролям в мидлваер
      for (let index = 0; index < roles.length; index++) {
        if (UserRole === roles[index]) {
          hasRole = true;
        }
      }

      // если роли так и не подошли
      if (!hasRole) {
        return res.status(403).json({ access: false, message: "Нет доступа" });
      }

      req.userData = decodedData; // Помещаем токен в запрос чтобы дальше с ним работать

      next(); // вызываем следующий мидлваер
    } catch (err) {
      // Обработаем ошибки по необходимости
      res.status(403).json({ message: `Пользователь не авторизован` });
    }
  };
};
