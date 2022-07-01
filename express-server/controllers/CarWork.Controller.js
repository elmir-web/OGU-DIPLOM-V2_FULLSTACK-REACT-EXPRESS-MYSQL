class CarWorkController {
  async getAccess(req, res) {
    return res.status(200).json({ access: true, message: "Доступ открыт" });
  }

  async getMyRecords(req, res) {
    const idWorker = req.params.id;

    let allRecords = await global.funcRequest(`/api/records/get`);

    let recordsWorker = [];

    for (let index = 0; index < allRecords.length; index++) {
      if (allRecords[index].IDdriver.ID === Number(idWorker)) {
        recordsWorker.push(allRecords[index]);
      }
    }

    res.status(200).json(recordsWorker);
  }

  async getMyCars(req, res) {
    const idWorker = req.params.id;

    let allRecords = await global.funcRequest(`/api/records/get`);

    let idsCarsWorker = [];
    let carsWorker = [];

    for (let index = 0; index < allRecords.length; index++) {
      if (allRecords[index].IDdriver.ID === Number(idWorker)) {
        idsCarsWorker.push(allRecords[index].IDcar.ID);
      }
    }

    idsCarsWorker = [...new Set(idsCarsWorker)];

    for (let index = 0; index < idsCarsWorker.length; index++) {
      carsWorker.push(
        await global.funcRequest(`/api/vehicle/get/${idsCarsWorker[index]}`)
      );
    }

    res.status(200).json(carsWorker);
  }

  async updateMyCar(req, res) {
    const { ID, expense, liters, mileage, IDgarage, IDgsm, Number, Model } =
      req.body;

    const [rowsUpdatedCar] = await global.connectMySQL.execute(
      `UPDATE car SET Model = '${Model}', Number = '${Number}', IDgsm = '${IDgsm}', IDgarage = '${IDgarage}', mileage = '${mileage}', liters = '${liters}', expense = '${expense}' WHERE ID = ${ID}`
    );

    if (rowsUpdatedCar["affectedRows"])
      res
        .status(200)
        .json(
          `Автомобиль (ID: "${ID}", Модель: "${Model}", гос.номер: "${Number}", ID гсм: "${IDgsm}", ID гаража: "${IDgarage}", Пробег: "${mileage}", Литры: "${liters}", Расход: "${expense}") изменен`
        );
    else res.status(400).json(`Автомобиль с ID: ${ID} не изменен`);
  }

  async updateMyRecords(req, res) {
    const {
      ID,
      IDgsm,
      IDcar,
      IDsheet,
      IDdriver,
      NumberPL,
      Liter,
      usedLiter,
      openMileage,
      closeMileage,
      recStatus,
    } = req.body;

    const [rowsUpdatedRecord] = await global.connectMySQL.execute(
      `UPDATE record SET IDgsm = '${IDgsm}', IDcar = '${IDcar}', IDsheet = '${IDsheet}', IDdriver = '${IDdriver}', NumberPL = '${NumberPL}', Liter = '${Liter}', usedLiter = '${usedLiter}', openMileage = '${openMileage}', closeMileage = ${
        closeMileage === null ? `NULL` : `${closeMileage}`
      }, recStatus = '${recStatus}' WHERE ID = '${ID}'`
    );

    if (rowsUpdatedRecord["affectedRows"])
      res
        .status(200)
        .json(
          `Путевой лист (ID: ${ID} ID ГСМ: "${IDgsm}", ID автомобиля: "${IDcar}", ID ведомости: "${IDsheet}", ID водителя: "${IDdriver}", Номер путевого листа: "${NumberPL}", Литры: "${Liter}" (Исп.: ${usedLiter}), Пробег на момент открытия путевого листа: "${closeMileage}", Пробег на момент закрытия путевого листа: "${recStatus}", Статус путевого листа: "${recStatus}") изменен`
        );
    else res.status(400).json(`Путеовой лист с ID: ${ID} не изменен`);
  }

  async updateStoreHouseItem(req, res) {
    const { ID, IDgsm, liters } = req.body;

    console.log(req.body);

    const [rowsUpdatedStoreItem] = await global.connectMySQL.execute(
      `UPDATE storehouse SET IDgsm = '${IDgsm}', liters = '${liters}' WHERE ID = ${ID}`
    );

    if (rowsUpdatedStoreItem["affectedRows"])
      res
        .status(200)
        .json(
          `Элемент склада (ID: "${ID}", IDgsm: "${IDgsm}", liters: "${liters}" изменен`
        );
    else res.status(400).json(`Элемент склада с ID: ${ID} не изменен`);
  }
}

module.exports = new CarWorkController();
