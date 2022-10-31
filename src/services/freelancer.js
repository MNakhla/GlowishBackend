const { freelancerModel, specificDateAvailabilityModel } = require("../models");
const { arePointsNear } = require("../utils/functions");
const { atSalonRadius } = require("../utils/constants");

async function getAll(req, res) {
  const freelancers = await freelancerModel
    .find({ completed: true })
    .populate("services defaultAvailability specificDateAvailability");
  res.status(200).send(freelancers);
}

async function getFreelancerById(req, res, next) {
  let freelancer = await freelancerModel
    .findById(req.params._id)
    .populate("services")
    .populate("defaultAvailability")
    .populate("specificDateAvailability")
    .populate({
      path: "reviews",
      populate: {
        path: "customer",
        select: "firstName lastName",
      },
    });
  return res.status(200).send(freelancer);
}

async function setFreelancerComplete(req, res, next) {
  const freelancerId = req.params._id;
  const isCompleted = req.body.completed;
  let updatedFreelancer = await freelancerModel.findByIdAndUpdate(
    freelancerId,
    {
      $set: { completed: isCompleted },
      $push: {
        notifications: {
          $each: [
            {
              message: isCompleted
                ? "Congratulations! Your profile is complete. Customers can now book appointments with you"
                : "Your profile is incomplete. Please fill all fields to activate your account for booking",
              read: false,
              time: new Date(),
            },
          ],
          $position: 0,
        },
      },
    }
  );
  updatedFreelancer.save();

  return res.status(200).send(updatedFreelancer);
}

async function searchByDateAndLoc(req, res) {
  const { date, latitude, longitude, service } = req.query;
  const formattedDate = new Date(date);

  let freelancers = await freelancerModel
    .find({ completed: true })
    .populate("services defaultAvailability specificDateAvailability");
  freelancers = await JSON.parse(JSON.stringify(freelancers));

  const filterFreelancers = () => {
    let filteredFreelancers = [];

    freelancers.map(async (freelancer) => {
      // service check
      const serviceAvailable = await [
        ...new Set(freelancer?.services.map((ser) => ser.serviceCategory)),
      ].includes(service);

      //specific date check
      if (serviceAvailable) {
        let specificDateAvailableMove = false;
        let specificDateAvailableSalon = false;
        for (let i = 0; i < freelancer.specificDateAvailability.length; i++) {
          if (
            new Date(freelancer.specificDateAvailability[i].date).getDate() ===
              formattedDate.getDate() &&
            new Date(freelancer.specificDateAvailability[i].date).getMonth() ===
              formattedDate.getMonth() &&
            new Date(
              freelancer.specificDateAvailability[i].date
            ).getFullYear() === formattedDate.getFullYear()
          ) {
            if (
              freelancer.specificDateAvailability[i].locationStatus ===
              "OnTheMove"
            ) {
              //specific date is available on the move

              specificDateAvailableMove = true;

              if (
                arePointsNear(
                  freelancer.specificDateAvailability[i].centerLocation,
                  { latitude, longitude },
                  freelancer.specificDateAvailability[i].areaRadius
                )
              ) {
                filteredFreelancers.push({
                  ...freelancer,
                  longitude:
                    freelancer.specificDateAvailability[i].centerLocation
                      .longitude,
                  latitude:
                    freelancer.specificDateAvailability[i].centerLocation
                      .latitude,
                  locationStatus: "OnTheMove",
                });
              }

              break;
            } else if (
              freelancer.specificDateAvailability[i].locationStatus ===
              "AtSalon"
            ) {
              // specific date is available at the salon

              specificDateAvailableSalon = true;

              if (
                arePointsNear(
                  freelancer.specificDateAvailability[i].centerLocation,
                  { latitude, longitude },
                  atSalonRadius
                )
              ) {
                filteredFreelancers.push({
                  ...freelancer,
                  longitude:
                    freelancer.specificDateAvailability[i].centerLocation
                      .longitude,
                  latitude:
                    freelancer.specificDateAvailability[i].centerLocation
                      .latitude,
                  locationStatus: "AtSalon",
                });
              }

              break;
            }
          }
        }

        //default date check

        if (!specificDateAvailableMove && !specificDateAvailableSalon) {
          // specific date is not available
          if (
            freelancer.defaultAvailability.locationStatus === "OnTheMove" &&
            arePointsNear(
              freelancer.defaultAvailability.centerLocation,
              { latitude, longitude },
              freelancer.defaultAvailability.areaRadius
            )
          ) {
            // default date is available on the move

            filteredFreelancers.push({
              ...freelancer,
              longitude:
                freelancer.defaultAvailability.centerLocation.longitude,
              latitude: freelancer.defaultAvailability.centerLocation.latitude,
              locationStatus: "OnTheMove",
            });
          } else if (
            freelancer.defaultAvailability.locationStatus === "AtSalon" &&
            arePointsNear(
              freelancer.defaultAvailability.centerLocation,
              { latitude, longitude },
              atSalonRadius
            )
          ) {
            // default date is available at the salon

            filteredFreelancers.push({
              ...freelancer,
              longitude:
                freelancer.defaultAvailability.centerLocation.longitude,
              latitude: freelancer.defaultAvailability.centerLocation.latitude,
              locationStatus: "AtSalon",
            });
          }
        }
      }

      return null;
    });

    return filteredFreelancers;
  };

  const filteredFreelancers = await filterFreelancers();
  return res.status(200).send(filteredFreelancers);
}

async function addNotification(
  freelancerId,
  notificationMessage,
  appointmentId
) {
  const freelancer = await freelancerModel.findByIdAndUpdate(
    freelancerId,
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
  return freelancer;
}

// async function fetchFreelancerService

async function putAppointment(freelancerId, appointmentId, freelancerDate) {
  let specificArgs = {};
  if (freelancerDate.bDefault) {
    let newFreelancerSpecificDateAvailability =
      new specificDateAvailabilityModel({
        locationStatus: freelancerDate.locationStatus,
        centerLocation: freelancerDate.centerLocation,
        date: freelancerDate.date,
        offDay: freelancerDate.offDay,
        schedule: freelancerDate.schedule,
        areaRadius: freelancerDate.areaRadius,
        freelancer: freelancerId,
      });
    await newFreelancerSpecificDateAvailability.save();
    specificArgs["specificDateAvailability"] = [
      newFreelancerSpecificDateAvailability._id,
    ];
  } else {
    await specificDateAvailabilityModel.findByIdAndUpdate(
      freelancerDate.specificDateAvailabilityId,
      {
        $set: {
          schedule: freelancerDate.schedule,
        },
      },
      { new: true }
    );
  }
  const freelancer = await freelancerModel.findByIdAndUpdate(
    freelancerId,
    {
      $push: {
        appointments: appointmentId,
        notifications: {
          $each: [
            {
              message: "You have a new appointment! Click to view details",
              read: false,
              appointmentId: appointmentId,
              time: new Date(),
            },
          ],
          $position: 0,
        },
        ...specificArgs,
      },
    },
    { new: true }
  );
  return freelancer;
}

async function updateFreelancerNotification(req, res) {
  const key = `notifications.${req.params._notif_idx}.read`;
  let q = {};
  q[key] = true;
  const freelancer = await freelancerModel.findByIdAndUpdate(
    req.params._id,
    {
      $set: q,
    },
    {
      new: true,
    }
  );
  return res.status(200).send(freelancer);
}

module.exports = {
  getAll,
  searchByDateAndLoc,
  getFreelancerById,
  setFreelancerComplete,
  putAppointment,
  updateFreelancerNotification,
  addNotification,
};
