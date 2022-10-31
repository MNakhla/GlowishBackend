const {
  defaultAvailabilityModel,
  freelancerModel,
  specificDateAvailabilityModel,
  serviceModel,
  customerModel,
} = require("../models");
const mongoose = require("mongoose");

async function getFreelancer(req, res, next) {
  if (req.params._id) {
    freelancerModel.findById(req.params._id, (err, freelancer) => {
      if (err) {
        next(new Error("couldn't find freelancer"));
        return;
      }
      req.freelancer = freelancer;
      next();
    });
  } else {
    next();
  }
}

//#region post,put, delete service
async function postNewFreelancerService(req, res, next) {
  const freelancerId = req.params._id;

  let newService = new serviceModel({
    serviceCategory: req.body.serviceCategory,
    name: req.body.name,
    price: req.body.price,
    estimatedTime: req.body.estimatedTime,
    freelancer: mongoose.Types.ObjectId(freelancerId),
  });
  await newService.save();

  let updatedFreelancer = await freelancerModel.findByIdAndUpdate(
    freelancerId,
    {
      $push: { services: [newService._id] },
    }
  );
  updatedFreelancer.save();
  res.status(200).send(newService);
}

async function putFreelancerService(req, res, next) {
  let freelancerId = req.params._id;
  let serviceId = req.params.serviceId;
  let updatedService = await serviceModel.findByIdAndUpdate(
    serviceId,
    req.body,
    { new: true }
  );
  await updatedService.save();
  res.status(200).send(updatedService);
}

async function deleteFreelancerService(req, res, next) {
  let freelancerId = req.params._id;
  let serviceId = req.params.serviceId;
  let found = await serviceModel.findByIdAndDelete(serviceId);
  if (!found) res.status(400).send("Service not found");
  let updatedFreelancer = await freelancerModel.findByIdAndUpdate(
    freelancerId,
    {
      $pull: { services: serviceId },
    },
    { safe: true, multi: false }
  );
  updatedFreelancer.save();
  res.status(200).send("successfully deleted");
}

//#endregion

//#region update Profile image
async function postNewFreelancerProfileImg(req, res, next) {
  const freelancerId = req.params._id;
  let updatedFreelancer = await freelancerModel.findByIdAndUpdate(
    freelancerId,
    {
      profilePicture: req.body.imgUrl,
    }
  );
  updatedFreelancer.save();
  res.status(200).send(req.body.imgUrl);
}

//#endregion

//#region post, delete portfolio image
async function postNewFreelancerPortfolioImg(req, res, next) {
  const freelancerId = req.params._id;

  let updatedFreelancer = await freelancerModel.findByIdAndUpdate(
    freelancerId,
    {
      $push: { portfolio: req.body.imgUrl },
    }
  );
  updatedFreelancer.save();
  res.status(200).send(req.body.imgUrl);
}

async function deleteFreelancerPortfolioImg(req, res, next) {
  const freelancerId = req.params._id;
  let updatedFreelancer = await freelancerModel.findByIdAndUpdate(
    freelancerId,
    {
      $pull: { portfolio: req.body.imageUrl },
    },
    { safe: true, multi: false }
  );

  await updatedFreelancer.save();
  res.status(200).send("successfully deleted");
}

//#endregion

//#region get,post,put freelancerDefaultAvailability

async function postFreelancerDefaultAvailability(req, res, next) {
  const freelancerId = req.params._id;

  let newFreelancerDefaultAvailability = new defaultAvailabilityModel({
    locationStatus: req.body.locationStatus,
    centerLocation: req.body.centerLocation,
    workingHours: req.body.workingHours,
    lunchBreakHours: req.body.lunchBreakHours,
    offDays: req.body.offDays,
    areaRadius: req.body.areaRadius,
    freelancer: mongoose.Types.ObjectId(freelancerId),
  });

  await newFreelancerDefaultAvailability.save();

  let updatedFreelancer = await freelancerModel.findByIdAndUpdate(
    freelancerId,
    { defaultAvailability: newFreelancerDefaultAvailability._id }
  );
  updatedFreelancer.save();

  return res.status(200).json(newFreelancerDefaultAvailability);
}

async function putFreelancerDefaultAvailability(req, res, next) {
  const freelancerId = req.params._id;
  let defaultAvailabilityToUpdate = await defaultAvailabilityModel.findOne({
    freelancer: mongoose.Types.ObjectId(freelancerId),
  });

  let updatedFreelancerDefaultAvailability =
    await defaultAvailabilityModel.findByIdAndUpdate(
      defaultAvailabilityToUpdate._id,
      {
        ...req.body,
        freelancer: mongoose.Types.ObjectId(req.params._id),
      },

      { new: true }
    );

  await updatedFreelancerDefaultAvailability.save();

  res.status(200).json(updatedFreelancerDefaultAvailability);
}
//#endregion

//#region get,post,put,delte specificDateAvailability
async function postFreelancerSpecificDateAvailability(req, res, next) {
  const freelancerId = req.params._id;

  let newFreelancerSpecificDateAvailability = new specificDateAvailabilityModel(
    {
      locationStatus: req.body.locationStatus,
      centerLocation: req.body.centerLocation,
      date: req.body.date,
      offDay: req.body.offDay,
      schedule: req.body.schedule,
      areaRadius: req.body.areaRadius,
      freelancer: mongoose.Types.ObjectId(freelancerId),
    }
  );

  await newFreelancerSpecificDateAvailability.save();

  let updatedFreelancer = await freelancerModel.findByIdAndUpdate(
    freelancerId,
    {
      $push: {
        specificDateAvailability: [newFreelancerSpecificDateAvailability._id],
      },
    }
  );
  updatedFreelancer.save();

  return res.status(200).json(newFreelancerSpecificDateAvailability);
}

async function putFreelancerSpecificDateAvailability(req, res, next) {
  const freelancerId = req.params._id;
  const specificDateAvailabilityId = req.params.specificDateAvailabilityId;

  let updatedFreelancerSpecificDateAvailability =
    await specificDateAvailabilityModel.findByIdAndUpdate(
      specificDateAvailabilityId,
      {
        ...req.body,
        freelancer: mongoose.Types.ObjectId(freelancerId),
      },

      { new: true }
    );

  await updatedFreelancerSpecificDateAvailability.save();

  res.status(200).json(updatedFreelancerSpecificDateAvailability);
}

//#endregion

//#region put info
async function putFreelancerInfo(req, res, next) {
  let freelancerId = req.params._id;

  let { firstName, lastName, phone, bio, facebookURL, instagramURL } = req.body;

  let updatedFreelancer = await freelancerModel.findByIdAndUpdate(
    freelancerId,
    {
      firstName: firstName,
      lastName: lastName,
      phone: phone,
      bio: bio,
      facebookURL: facebookURL,
      instagramURL: instagramURL,
    }
  );
  updatedFreelancer.save();
  return res.status(200).send(updatedFreelancer);
}

//#endregion

//#region post review
async function postFreelancerReview(req, res, next) {
  const freelancerId = req.params._id;
  const customerId = req.params.customerId;
  const newAvgRating = req.body.newAverageRating;
  let newReview = { ...req.body.newReview, customer: customerId };
  let newRating = newReview.rating;
  let customer = await customerModel.findById(customerId);
  let postedReview = {
    ...newReview,
    customer: { firstName: customer.firstName, lastName: customer.lastName },
  };

  let updatedFreelancer = await freelancerModel.findByIdAndUpdate(
    freelancerId,
    {
      $push: {
        reviews: [newReview],
        notifications: {
          $each: [
            {
              message: `${customer.firstName} ${customer.lastName} added a new review for you. Your average rating is now ${newAvgRating}`,
              read: false,
              time: new Date(),
            },
          ],
          $position: 0,
        },
      },
      averageRating: newAvgRating,
    }
  );
  updatedFreelancer.save();

  // let newAverageRating =
  //   updatedFreelancer.reviews.reduce(
  //     (previousValue, review) => previousValue + review.rating,
  //     0
  //   ) / updatedFreelancer.reviews.length;

  // updatedFreelancer = await freelancerModel.findByIdAndUpdate(freelancerId, {
  //   averageRating: newAverageRating,
  // });
  // updatedFreelancer.save();

  res.status(200).send(postedReview);
}
//#endregion

module.exports = {
  getFreelancer,
  postFreelancerDefaultAvailability,
  putFreelancerDefaultAvailability,
  postNewFreelancerService,
  putFreelancerService,
  deleteFreelancerService,
  postNewFreelancerPortfolioImg,
  deleteFreelancerPortfolioImg,
  postNewFreelancerProfileImg,
  postFreelancerSpecificDateAvailability,
  putFreelancerSpecificDateAvailability,
  putFreelancerInfo,
  postFreelancerReview,
};
