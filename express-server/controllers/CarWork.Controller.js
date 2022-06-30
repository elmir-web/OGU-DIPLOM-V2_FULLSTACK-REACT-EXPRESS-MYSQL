class CarWorkController {
  async getAccess(req, res) {
    return res.status(200).json({ access: true, message: "Доступ открыт" });
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
}

module.exports = new CarWorkController();
