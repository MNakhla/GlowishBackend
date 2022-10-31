const { serviceModel } = require("../models");

async function getById(req, res) {
  const service = await serviceModel.findById(req.query.id);
  return res.status(200).send(service);
}

module.exports = { getById };
