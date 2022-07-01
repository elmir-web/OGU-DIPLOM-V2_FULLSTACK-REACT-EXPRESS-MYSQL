class StoreHouseController {
  async getAccess(req, res) {
    return res.status(200).json({ access: true, message: "Доступ открыт" });
  }

  async createStore(req, res) {
    const { IDgsm, liters } = req.body;

    await global.connectMySQL.execute(
      `INSERT INTO storehouse (IDgsm, liters) VALUES ('${IDgsm}', '${liters}')`
    );

    res
      .status(200)
      .json(
        `Элемент склада (IDgsm: "${IDgsm}", liters.номер: "${liters}") создан.`
      );
  }

  async getStores(req, res) {
    let [rowsAllStores] = await global.connectMySQL.execute(
      `SELECT * FROM storehouse`
    );

    for (let index = 0; index < rowsAllStores.length; index++) {
      rowsAllStores[index].IDgsm = await global.funcRequest(
        `/api/type-gsm/get/${rowsAllStores[index].IDgsm}`,
        "GET",
        null
      );
    }

    res.status(200).json(rowsAllStores);
  }

  async getOneStore(req, res) {
    const idSheet = req.params.id;
  }

  async updateStore(req, res) {
    const { ID, IDgsm, liters } = req.body;

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

  async deleteStore(req, res) {
    const idStoreItem = req.params.id;

    let [rowsDeletedStoreItem] = await global.connectMySQL.execute(
      `DELETE FROM storehouse WHERE ID = ${idStoreItem}`
    );

    if (rowsDeletedStoreItem["affectedRows"])
      res
        .status(200)
        .json(`Топливо с ID: ${idStoreItem} успешно удалено со склада`);
    else
      res
        .status(404)
        .json(`Удалить топливо с ID: ${idStoreItem} не получилось со склада`);
  }
}

module.exports = new StoreHouseController();
