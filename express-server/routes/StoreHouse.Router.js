const Router = require("express");
const storeHouseController = require("../controllers/StoreHouse.Controller");
const roleMiddleware = require("../middlewares/Role.Middleware"); // Middleware проверки на доступ по должности

const router = new Router();

router.get("/storehouse/get", storeHouseController.getStores);
router.get("/storehouse/get/:id", storeHouseController.getOneStore);
router.get(
  "/storehouse/access",
  roleMiddleware(["Подписант"]),
  storeHouseController.getAccess
);
router.delete(
  "/storehouse/delete/:id",
  roleMiddleware(["Подписант"]),
  storeHouseController.deleteStore
);
router.put(
  "/storehouse/change",
  roleMiddleware(["Подписант"]),
  storeHouseController.updateStore
);
router.post(
  "/storehouse/create",
  roleMiddleware(["Подписант"]),
  storeHouseController.createStore
);

module.exports = router;
