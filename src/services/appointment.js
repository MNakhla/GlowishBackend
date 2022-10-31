const { appointmentModel } = require("../models");
const {
  putAppointment: putFreelancerAppointment,
  addNotification: addFreelancerNotification,
} = require("./freelancer");
const {
  putAppointment: putCustomerAppointment,
  addNotification: addCustomerNotification,
} = require("./customer");
const { addPayment } = require("./payment");
const { updateSchedule } = require("./specificDateAvailability");

async function getAll(req, res) {
  const appointments = await appointmentModel.find({});
  return res.status(200).send(appointments);
}
async function get(req, res) {
  const appointment = await appointmentModel.findById(req.params._id);
  return res.status(200).send(appointment);
}

async function addAppointment(req, res) {
  // console.log("adding appointment");
  const {
    date,
    location,
    freelancer,
    customer,
    services,
    price,
    startTime,
    endTime,
    paymentIntentId,
    freelancerDate,
  } = req.body;
  const appointments = await appointmentModel.insertMany([
    {
      date: date,
      location: location,
      freelancer: freelancer,
      customer: customer,
      services: services,
      price: price,
      cancelled: false,
      startTime: startTime,
      endTime: endTime,
    },
  ]);
  if (!appointments) return;
  let appointment = appointments[0];
  if (appointment) {
    const payment = await addPayment(
      paymentIntentId,
      new Date(),
      price,
      "succeeded",
      appointment._id,
      freelancer,
      customer
    );
    if (payment) {
      appointment = await putPaymentId(appointment._id, payment._id);
      await putCustomerAppointment(customer, payment._id, appointment._id);
    }
    await putFreelancerAppointment(freelancer, appointment._id, freelancerDate);
    return res.status(200).send(appointment);
  }
}

async function cancelAppointment(req, res) {
  const appointment = await appointmentModel.findByIdAndUpdate(
    req.query.appointmentId,
    {
      $set: { cancelled: true },
    },
    { new: true }
  );

  if (appointment.cancelled) {
    await updateSchedule(
      req.body.specificDateAvailabilityId,
      req.body.schedule
    );
    await addCustomerNotification(
      appointment.customer,
      "Your appointment has been cancelled",
      appointment._id
    );
    await addFreelancerNotification(
      appointment.freelancer,
      "Your appointment has been cancelled",
      appointment._id
    );
  }
  return res.status(200).send(appointment);
}

async function putPaymentId(appointmentId, paymentId) {
  const appointment = await appointmentModel.findByIdAndUpdate(
    appointmentId,
    {
      $set: { payment: paymentId },
    },
    { new: true }
  );
  return appointment;
}
module.exports = {
  getAll,
  get,
  addAppointment,
  putPaymentId,
  cancelAppointment,
};
