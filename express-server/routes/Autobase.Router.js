const Router = require("express");
const autoBaseController = require("../controllers/AutoBase.Controller");
const roleMiddleware = require("../middlewares/Role.Middleware"); // Middleware проверки на доступ по должности

const router = new Router();

router.get("/autobase/get", autoBaseController.getAutoBase);
router.get("/autobase/get/:id", autoBaseController.getOneAutoBase);
router.get(
  "/autobase/access",
  roleMiddleware(["Админ"]),
  autoBaseController.getAccess
);
router.delete(
  "/autobase/delete/:id",
  roleMiddleware(["Админ"]),
  autoBaseController.deleteAutoBase
);
router.put(
  "/autobase/change",
  roleMiddleware(["Админ"]),
  autoBaseController.updateAutoBase
);
router.post(
  "/autobase/create",
  roleMiddleware(["Админ"]),
  autoBaseController.createAutoBase
); // перенесено

module.exports = router;
