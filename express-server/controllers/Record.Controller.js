// методы (контроллеры)
class RecordController {
  async getAccess(req, res) {
    return res.status(200).json({ access: true, message: "Доступ открыт" });
  }

  async createRecord(req, res) {
    const { IDsheet, IDcar, IDdriver, NumberPL, IDgsm, Liter } = req.body;

    await global.connectMySQL.execute(
      `INSERT INTO record(IDsheet, IDcar, IDdriver, NumberPL, IDgsm, Liter) values('${IDsheet}', '${IDcar}', '${IDdriver}', '${NumberPL}', '${IDgsm}', '${Liter}')`
    );

    res
      .status(200)
      .json(
        `Путевой лист (ID ведомости: "${IDsheet}", ID автомобиля: "${IDcar}", ID водителя: "${IDdriver}", Номер: "${NumberPL}", ID ГСМ "${IDgsm}", Литры: "${Liter}") создан.`
      );
  }

  async getRecords(req, res) {
    let [rowsAllRecords] = await global.connectMySQL.execute(
      `SELECT * FROM record`
    );

    for (let index = 0; index < rowsAllRecords.length; index++) {
      rowsAllRecords[index].IDsheet = await global.funcRequest(
        `/api/sheet/get/${rowsAllRecords[index].IDsheet}`
      );

      rowsAllRecords[index].IDcar = await global.funcRequest(
        `/api/vehicle/get/${rowsAllRecords[index].IDcar}`
      );

      rowsAllRecords[index].IDdriver = await global.funcRequest(
        `/api/worker/get/${rowsAllRecords[index].IDdriver}`
      );

      rowsAllRecords[index].IDgsm = await global.funcRequest(
        `/api/type-gsm/get/${rowsAllRecords[index].IDgsm}`
      );
    }

    res.status(200).json(rowsAllRecords);
  }

  async getOneRecord(req, res) {
    const idRecord = req.params.id;

    let [rowsAllRecords] = await global.connectMySQL.execute(
      `SELECT * FROM record WHERE ID = ${idRecord}`
    );

    rowsAllRecords[0].IDsheet = await global.funcRequest(
      `/api/sheet/get/${rowsAllRecords[0].IDsheet}`
    );

    rowsAllRecords[0].IDcar = await global.funcRequest(
      `/api/vehicle/get/${rowsAllRecords[0].IDcar}`
    );

    rowsAllRecords[0].IDdriver = await global.funcRequest(
      `/api/worker/get/${rowsAllRecords[0].IDdriver}`
    );

    rowsAllRecords[0].IDgsm = await global.funcRequest(
      `/api/type-gsm/get/${rowsAllRecords[0].IDgsm}`
    );

    res.status(200).json(rowsAllRecords[0]);
  }

  async updateRecord(req, res) {
    const {
      ID,
      IDgsm,
      IDcar,
      IDsheet,
      IDdriver,
      NumberPL,
      Liter,
      openMileage,
      closeMileage,
      recStatus,
    } = req.body;

    console.log(closeMileage);

    const [rowsUpdatedRecord] = await global.connectMySQL.execute(
      `UPDATE record SET IDgsm = '${IDgsm}', IDcar = '${IDcar}', IDsheet = '${IDsheet}', IDdriver = '${IDdriver}', NumberPL = '${NumberPL}', Liter = '${Liter}', openMileage = '${openMileage}', closeMileage = ${
        closeMileage === null ? `NULL` : `${closeMileage}`
      }, recStatus = '${recStatus}' WHERE ID = '${ID}'`
    );

    if (rowsUpdatedRecord["affectedRows"])
      res
        .status(200)
        .json(
          `Путевой лист (ID: ${ID} ID ГСМ: "${IDgsm}", ID автомобиля: "${IDcar}", ID ведомости: "${IDsheet}", ID водителя: "${IDdriver}", Номер путевого листа: "${NumberPL}", Литры: "${Liter}", Пробег на момент открытия путевого листа: "${closeMileage}", Пробег на момент закрытия путевого листа: "${recStatus}", Статус путевого листа: "${recStatus}") изменен`
        );
    else res.status(400).json(`Путеовой лист с ID: ${ID} не изменен`);
  }

  async deleteRecord(req, res) {
    const { id: IDsigner } = req.userData;
    const { IDsheet: sheetData } = req.body;
    const { IDsigner: userData } = sheetData;
    const { ID, FIO } = userData;

    if (ID !== IDsigner) {
      res
        .status(400)
        .json(
          `Путевой лист ведомости подписанта ${FIO}. Вы не можете удалить не свой путевой лист!`
        );
      return;
    }

    const idRecord = req.params.id;

    console.log(idRecord);

    let [rowsDeletedRecord] = await global.connectMySQL.execute(
      `DELETE FROM record WHERE ID = ${idRecord}`
    );

    if (rowsDeletedRecord["affectedRows"])
      res.status(200).json(`Путевой лист с ID: ${idRecord} успешно удален`);
    else
      res
        .status(400)
        .json(`Удалить путевой лист с ID: ${idRecord} не получилось`);
  }
}

module.exports = new RecordController();
