// __________________________________________________ ИМПОРТЫ
const express = require("express");
const mysql = require("mysql2/promise");
let cors = require("cors");
let axios = require("axios");

const {
  SERVER_START_ON_PORT,
  SERVER_WORKIN_ON_ADRESS,
  SERVER_MYSQL_SETTINGS,
} = require("./ServerConfig.json");

const autoBaseRouter = require("./routes/AutoBase.Router");
const accountRouter = require(`./routes/Account.Router`);
const positionRouter = require(`./routes/Position.Router`);
const typesGSMRouter = require("./routes/TypesGSM.Router");
const autoGarageRouter = require("./routes/AutoGarage.Router");
const vehicleRouter = require("./routes/Vehicle.Router");
const storeHouseRouter = require("./routes/StoreHouse.Router");
const workersRouter = require("./routes/Worker.Router");
const sheetRouter = require("./routes/Sheet.Router");
const recordRouter = require("./routes/Record.Router");
const reportRouter = require("./routes/Report.Router");
const carWorkRouter = require("./routes/CarWork.Router");

// __________________________________________________ ОБЪЕКТЫ
const app = express(); // Создаем приложение Express JS

// __________________________________________________ ЗАПУСК СЕРВЕРА
app.listen(SERVER_START_ON_PORT, async () => {
  try {
    global.connectMySQL = await mysql.createPool(SERVER_MYSQL_SETTINGS); // Создаем Pool подключения к СуБД MySQL

    global.checkSQL = `SELECT * FROM checkconnect`; // Формируем тестовый SQL-запрос

    // Результат запроса будет массив с одним элементом, забираем этот элемент деструктуризацией массивов
    // Этот элемент будет объектом, одной единственной строчкой из таблицы "checkConnect" с одним единственным
    // свойством - названием столбца "statusConnect" и это свойство мы вытаскиваем уже деструктуризацией объекта
    let [[{ statusConnect }]] = await global.connectMySQL.execute(
      global.checkSQL // Отправляем тестовый SQL-запрос
    );

    // Если не пришла "1" значит что-то не так с той таблицей и теми данными или с подключения к СуБД MySQL
    if (statusConnect !== 1) {
      throw `
      Проверьте данные для подключения к СуБД MySQL
      Возможно, данные подключения к СуБД MySQL неверные.
      Эти данные находятся в файле "ServerConfig.json" в корне проекта.
      Проверьте, чтобы в таблице "checkconnect", единственно существующее свойство "statusConnect" было в значении "1".
      Сейчас это значение "${statusConnect}"
      `;
    }

    // Ну и если подключение успешно, и пришла однерка и все нормально то все круто и даем знать об этом тому кто сервер запустил
    console.log(
      `Приложение Express JS запущено на порту "${SERVER_START_ON_PORT}" и подключение к СуБД MySQL успешно.`
    );
  } catch (error) {
    console.log(
      `________________________________________________________________________________________________________________________`
    );
    console.log(`Ошибка подключения к СуБД MySQL!`);
    console.log(`SQL запрос: ${global.checkSQL}`);
    console.log(`Конфиг подключения к СуБД MySQL:`);
    console.log(SERVER_MYSQL_SETTINGS);
    console.log(`Информация о ошибке:`);
    console.log(error);
    console.log(
      `________________________________________________________________________________________________________________________`
    );
  }
});

// __________________________________________________ РАБОТА С СЕРВЕРОМ
global.funcRequest = async (url, method = "GET", data = null) => {
  try {
    let response;

    if (method === "GET") {
      response = await axios.get(
        `${SERVER_WORKIN_ON_ADRESS}:${SERVER_START_ON_PORT}${url}`
      );
    }

    return response.data;
  } catch (err) {
    console.error(err.message);
  }
  return 554;
};

// __________________________________________________ НАСТРОЙКА
app.use(cors());
app.use(express.json());

// __________________________________________________ РОУТИНГ API
app.use("/account", accountRouter); // API: http(s)://адрес.порт/account
app.use(`/api`, positionRouter);
app.use("/api", autoBaseRouter);
app.use("/api", typesGSMRouter);
app.use("/api", autoGarageRouter);
app.use("/api", vehicleRouter);
app.use("/api", storeHouseRouter);
app.use("/api", workersRouter);
app.use("/api", sheetRouter);
app.use("/api", recordRouter);
app.use("/api", reportRouter);
app.use("/api", carWorkRouter);
