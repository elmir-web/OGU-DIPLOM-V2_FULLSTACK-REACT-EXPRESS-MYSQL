class StoreHouseController {
  async getAccess(req, res) {
    return res.status(200).json({ access: true, message: "Доступ открыт" });
  }

  async createStore(req, res) {}

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

  async getOneStore(req, res) {}

  async updateStore(req, res) {
    console.log(req.body);

    // TODO: продолжить тут
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
