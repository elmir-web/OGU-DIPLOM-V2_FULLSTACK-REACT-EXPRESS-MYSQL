class VehicleController {
  async getAccess(req, res) {
    return res.status(200).json({ access: true, message: "Доступ открыт" });
  }

  async createVehicle(req, res) {
    const { Model, Number, IDgsm, IDgarage, mileage, liters, expense } =
      req.body;

    await global.connectMySQL.execute(
      `INSERT INTO car (Model, Number, IDgsm, IDgarage, mileage, liters, expense) VALUES ('${Model}', '${Number}', '${IDgsm}', '${IDgarage}', '${mileage}', '${liters}', '${expense}')`
    );

    res
      .status(200)
      .json(
        `Автомобиль (Модель: "${Model}", гос.номер: "${Number}", ID гаража: "${IDgarage}") создан.`
      );
  }

  async getVehicles(req, res) {
    let [rowsAllVeh] = await global.connectMySQL.execute(`SELECT * FROM car`);

    for (let index = 0; index < rowsAllVeh.length; index++) {
      rowsAllVeh[index].IDgsm = await global.funcRequest(
        `/api/type-gsm/get/${rowsAllVeh[index].IDgsm}`,
        "GET",
        null
      );
    }

    for (let index = 0; index < rowsAllVeh.length; index++) {
      rowsAllVeh[index].IDgarage = await global.funcRequest(
        `/api/autogarage/get/${rowsAllVeh[index].IDgarage}`,
        "GET",
        null
      );
    }

    res.status(200).json(rowsAllVeh);
  }

  async getOneVehicle(req, res) {
    const idVeh = req.params.id;

    let [rowsAllVeh] = await global.connectMySQL.execute(
      `SELECT * FROM car WHERE ID = ${idVeh}`
    );

    rowsAllVeh[0].IDgarage = await global.funcRequest(
      `/api/autogarage/get/${rowsAllVeh[0].IDgarage}`
    );

    res.status(200).json(rowsAllVeh[0]);
  }

  async updateVehicle(req, res) {
    const { ID, Model, Number, IDgarage, mileage } = req.body;

    const [rowsUpdatedVeh] = await global.connectMySQL.execute(
      `UPDATE car SET Model = '${Model}', Number = '${Number}', IDgarage = '${IDgarage}', mileage = '${mileage}' WHERE ID = ${ID}`
    );

    if (rowsUpdatedVeh["affectedRows"])
      res
        .status(200)
        .json(
          `Автомобиль (ID: "${ID}", Модель: "${Model}", гос.номер: "${Number}", ID гаража: "${IDgarage}", Пробег: "${mileage}") изменен`
        );
    else res.status(400).json(`Автомобиль с ID: ${ID} не изменен`);
  }

  async deleteVehicle(req, res) {
    const idVeh = req.params.id;

    let [checkRecordsForCar] = await global.connectMySQL.execute(
      `SELECT * FROM record WHERE IDcar = ${idVeh}`
    );

    if (checkRecordsForCar.length) {
      res
        .status(400)
        .json(`Нельзя удалить автомобиль, потому что у него есть путевой лист`);
    } else {
      let [rowsDeletedVeh] = await global.connectMySQL.execute(
        `DELETE FROM car WHERE ID = ${idVeh}`
      );

      if (rowsDeletedVeh["affectedRows"])
        res.status(200).json(`Автомобиль с ID: ${idVeh} успешно удален`);
      else
        res.status(404).json(`Удалить автомобиль с ID: ${idVeh} не получилось`);
    }
  }
}

module.exports = new VehicleController();
