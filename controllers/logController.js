const { json } = require("body-parser");
const logModel = require("../models/logModel");

//creer un log
module.exports.createLog = async (req, res) => {
  const { email, status, message } = req.body;
  const userId = req.user._id;

  try {
    const log = await logModel.create({ userId, email, status, message });
    res.status(200).json(log);
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

//obtenir tout les logs d'un utilisateur
module.exports.getLogs = async (req, res) => {
  const userId = req.user._id;

  try {
    const log = await logModel.find({ userId }).sort({ timmestamp: -1 });
    res.status(200).json(log);
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};
