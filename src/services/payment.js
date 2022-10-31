const { paymentModel } = require("../models");
const stripe = require("stripe")(process.env.STRIPE_SECRET_TEST);

async function createSecret(req, res) {
  const { amount } = req.body;
  const intent = await stripe.paymentIntents.create({
    amount: amount * 100, // amount in cents
    currency: "eur",
    payment_method_types: ["card"],
  });
  return res.json({ client_secret: intent.client_secret });
}

async function partialRefund(req, res) {
  const { paymentIntentId } = req.query;
  const { amount } = req.body;
  const refund = await stripe.refunds.create({
    payment_intent: paymentIntentId,
    amount: amount,
  });
  return res.status(200).send({ refund: refund });
}

async function fullRefund(req, res) {
  const { paymentIntentId } = req.query;
  const refund = await stripe.refunds.create({
    payment_intent: paymentIntentId,
  });
  return res.status(200).send({ refund: refund });
}

async function addPayment(
  paymentIntentId,
  date,
  amount,
  paymentStatus,
  appointment,
  freelancer,
  customer
) {
  const payments = await paymentModel.insertMany([
    {
      paymentIntentId: paymentIntentId,
      date: date,
      amount: amount,
      paymentStatus: paymentStatus,
      appointment: appointment,
      freelancer: freelancer,
      customer: customer,
    },
  ]);
  return payments[0];
}

async function updatePaymentStatus(req, res) {
  const { paymentIntentId } = req.query;
  const { paymentStatus } = req.body;
  const payment = await paymentModel.findOneAndUpdate(
    { paymentIntentId: paymentIntentId },
    { paymentStatus: paymentStatus },
    { new: true }
  );
  return res.status(200).send({ payment: payment });
}
module.exports = {
  createSecret,
  addPayment,
  partialRefund,
  fullRefund,
  updatePaymentStatus,
};
