const Router = require("express");
const CarWorkController = require("../controllers/CarWork.Controller");
const roleMiddleware = require("../middlewares/Role.Middleware"); // Middleware проверки на доступ

const router = new Router();

router.get(
  "/carwork/access",
  roleMiddleware(["Водитель"]),
  CarWorkController.getAccess
);
router.get("/carwork/my-records/get", () => {});
router.get("/carwork/my-cars/get", () => {});

module.exports = router;