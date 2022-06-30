const Router = require("express");
const CarWorkController = require("../controllers/CarWork.Controller");
const roleMiddleware = require("../middlewares/Role.Middleware"); // Middleware проверки на доступ

const router = new Router();

router.get(
  "/carwork/access",
  roleMiddleware(["Водитель"]),
  CarWorkController.getAccess
);
router.put(
  "/carwork/change",
  roleMiddleware(["Водитель"]),
  CarWorkController.change
);

module.exports = router;
