class CarWorkController {
  async getAccess(req, res) {
    return res.status(200).json({ access: true, message: "Доступ открыт" });
  }

  async change(req, res) {
    console.log(req.body);
    return res.status(200).json({ access: true, message: "Доступ открыт" });
  }
}

module.exports = new CarWorkController();
