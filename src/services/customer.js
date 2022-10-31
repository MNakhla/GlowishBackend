const { customerModel } = require("../models");

async function getCustomer(req, res) {
  const customer = await customerModel
    .findById(req.params._id)
    .populate("payments appointments")
    .populate({
      path: "appointments",

      populate: {
        path: "freelancer",
        model: "freelancer",
        populate: {
          path: "specificDateAvailability",
          model: "specificDateAvailability",
        },
      },
    })
    .populate({
      path: "appointments",
      populate: { path: "services", model: "service" },
    })
    .populate({
      path: "appointments",
      populate: { path: "payment", model: "payment" },
      options: { sort: { date: -1 } },
    })
    .select("appointments payments notifications");

  return res.status(200).send(customer);
}

async function addNotification(customerId, notificationMessage, appointmentId) {
  const customer = await customerModel.findByIdAndUpdate(
    customerId,
    {
      $push: {
        notifications: {
          $each: [
            {
              message: notificationMessage,
              read: false,
              appointmentId: appointmentId,
              time: new Date(),
            },
          ],
          $position: 0,
        },
      },
    },
    { new: true }
  );
  return customer;
}

async function putAppointment(customerId, paymentId, appointmentId) {
  const customer = await customerModel.findByIdAndUpdate(
    customerId,
    {
      $push: {
        payments: paymentId,
        appointments: appointmentId,
        notifications: {
          $each: [
            {
              message:
                "Your appointment has been booked! Click to view details",
              read: false,
              appointmentId: appointmentId,
              time: new Date(),
            },
          ],
          $position: 0,
        },
      },
    },
    { new: true }
  );
  return customer;
}

async function updateCustomerNotification(req, res) {
  // mark notification as read
  const key = `notifications.${req.params._notif_idx}.read`;
  let q = {};
  q[key] = true;
  const customer = await customerModel.findByIdAndUpdate(
    req.params._id,
    {
      $set: q,
    },
    {
      new: true,
    }
  );
  return res.status(200).send(customer);
}

module.exports = {
  getCustomer,
  putAppointment,
  updateCustomerNotification,
  addNotification,
};
