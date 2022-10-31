const { specificDateAvailabilityModel } = require("../models");

async function updateSchedule(specificDateAvailabilityId, schedule) {
  const specificDateAvailability =
    await specificDateAvailabilityModel.findByIdAndUpdate(
      specificDateAvailabilityId,
      { schedule: schedule },
      { new: true }
    );

  return specificDateAvailability;
}

module.exports = { updateSchedule };
