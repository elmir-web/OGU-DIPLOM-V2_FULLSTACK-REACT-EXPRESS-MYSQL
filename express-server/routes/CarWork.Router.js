const Router = require("express");
const CarWorkController = require("../controllers/CarWork.Controller");
const roleMiddleware = require("../middlewares/Role.Middleware"); // Middleware проверки на доступ

const router = new Router();

router.get(
  "/carwork/access",
  roleMiddleware(["Водитель"]),
  CarWorkController.getAccess
);
router.get(
  "/carwork/my-records/get/worker/:id",
  roleMiddleware(["Водитель"]),
  CarWorkController.getMyRecords
);
router.get(
  "/carwork/my-cars/get/worker/:id",
  roleMiddleware(["Водитель"]),
  CarWorkController.getMyCars
);
router.put(
  "/carwork/my-cars/change",
  roleMiddleware(["Водитель"]),
  CarWorkController.updateMyCar
);
router.put(
  "/carwork/my-records/change",
  roleMiddleware(["Водитель"]),
  CarWorkController.updateMyRecords
);
router.put(
  "/carwork/storehouse/change",
  roleMiddleware(["Водитель"]),
  CarWorkController.updateStoreHouseItem
);

module.exports = router;
