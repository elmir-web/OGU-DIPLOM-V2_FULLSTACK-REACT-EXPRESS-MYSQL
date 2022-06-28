let moment = require("moment");

// методы (контроллеры)
class SheetController {
  async getAccess(req, res) {
    return res.status(200).json({ access: true, message: "Доступ открыт" });
  }

  async createSheet(req, res) {
    const { NumberSheet, DateSheet, IDgarage, IDsigner } = req.body;

    await global.connectMySQL.execute(
      `INSERT INTO sheet (NumberSheet, DateSheet, IDgarage, IDsigner) VALUES ('${NumberSheet}', '${DateSheet}', '${IDgarage}', '${IDsigner}')`
    );

    res
      .status(200)
      .json(
        `Ведомость (Номер: "${NumberSheet}", Дата: "${DateSheet}", ID гаража: "${IDgarage}", ID подписанта: "${IDsigner}") создана.`
      );
  }

  async getSheets(req, res) {
    let [rowsAllSheets] = await global.connectMySQL.execute(
      `SELECT * FROM sheet`
    );

    for (let index = 0; index < rowsAllSheets.length; index++) {
      rowsAllSheets[index].DateSheet = moment(
        rowsAllSheets[index].DateSheet
      ).format("YYYY-MM-DD");

      rowsAllSheets[index].IDgarage = await global.funcRequest(
        `/api/autogarage/get/${rowsAllSheets[index].IDgarage}`
      );

      rowsAllSheets[index].IDsigner = await global.funcRequest(
        `/api/worker/get/${rowsAllSheets[index].IDsigner}`
      );
    }

    res.status(200).json(rowsAllSheets);
  }

  async getOneSheet(req, res) {
    const idSheet = req.params.id;

    let [rowsAllSheets] = await global.connectMySQL.execute(
      `SELECT * FROM sheet WHERE ID = ${idSheet}`
    );

    rowsAllSheets[0].DateSheet = moment(rowsAllSheets[0].DateSheet).format(
      "YYYY-MM-DD"
    );

    rowsAllSheets[0].IDgarage = await global.funcRequest(
      `/api/autogarage/get/${rowsAllSheets[0].IDgarage}`
    );

    rowsAllSheets[0].IDsigner = await global.funcRequest(
      `/api/worker/get/${rowsAllSheets[0].IDsigner}`
    );

    res.status(200).json(rowsAllSheets[0]);
  }

  async updateSheet(req, res) {
    const { ID, NumberSheet, DateSheet, IDgarage, IDsigner } = req.body;

    const [rowsUpdatedSheet] = await global.connectMySQL.execute(
      `UPDATE sheet SET NumberSheet = '${NumberSheet}', DateSheet = '${DateSheet}', IDgarage = '${IDgarage}', IDsigner = '${IDsigner}' WHERE ID = '${ID}'`
    );

    if (rowsUpdatedSheet["affectedRows"])
      res
        .status(200)
        .json(
          `Ведомость (ID: ${ID} Номер: "${NumberSheet}", Дата: "${DateSheet}", ID гаража: "${IDgarage}", ID подписанта: "${IDsigner}") изменена`
        );
    else res.status(400).json(`Ведомость с ID: ${ID} не изменена`);
  }

  async deleteSheet(req, res) {
    const { id: IDsigner } = req.userData;
    const { IDsigner: userData } = req.body;
    const { ID, FIO } = userData;

    if (ID !== IDsigner) {
      res
        .status(400)
        .json(
          `Ведомость подписанта ${FIO}. Вы не можете удалить не свою ведомость!`
        );
      return;
    }

    const idSheet = req.params.id;

    let [checkRecordForSheet] = await global.connectMySQL.execute(
      `SELECT * FROM record WHERE IDsheet = ${idSheet}`
    );

    if (checkRecordForSheet.length) {
      res
        .status(400)
        .json(`Нельзя удалить ведомость, потому что у неё есть путевые листы`);
    } else {
      let [rowsDeletedSheet] = await global.connectMySQL.execute(
        `DELETE FROM sheet WHERE ID = ${idSheet}`
      );

      if (rowsDeletedSheet["affectedRows"])
        res.status(200).json(`Ведомость с ID: ${idSheet} успешно удалена`);
      else
        res
          .status(400)
          .json(`Удалить ведомость с ID: ${idSheet} не получилось`);
    }
  }
}

module.exports = new SheetController();
