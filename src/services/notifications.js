const { Server } = require("socket.io");
const { customerModel, freelancerModel } = require("../models");

const socketServer = (httpServer) => {
  // socket.io connection
  const io = new Server(httpServer, {
    cors: {
      origin: "http://localhost:3000/",
      credentials: true,
    },
  });

  async function getUser(userId, userType, callback, fields = "notifications") {
    const userModel =
      userType === "freelancer" ? freelancerModel : customerModel;
    userModel
      .findById(userId, fields)
      .populate({
        path: "notifications",
        populate: {
          path: "appointmentId",
          populate: [
            {
              path: "payment",
            },
            {
              path: userType === "freelancer" ? "customer" : "freelancer",
              select: "firstName lastName profilePicture",
            },
          ],
        },
      })
      .exec(callback);
  }

  io.on("connection", (socket) => {
    console.log("a user connected", socket.id);

    // socket.emit("hello", "world");

    socket.on("setUser", (userId, userType) => {
      // console.log("set user", userId);
      socket.userId = userId;
      socket.userType = userType;
      socket.join(userId);
      // console.log("joined rooms", socket.rooms, "socket userid", socket.userId);
      getUser(
        userId,
        userType,
        (err, user) => {
          if (err) console.log(err);
          else {
            // console.log(user?._id);
            io.to(userId).emit(
              "newUser",
              userId,
              userType,
              user?.firstName + user?.lastName,
              user?.notifications,
              user?.profilePicture
            );
          }
        },
        "firstName lastName notifications profilePicture"
      );
    });

    socket.on("getUser", (userId, userType, callback) => {
      // console.log("get user", userId);
      getUser(
        userId,
        userType,
        callback,
        "firstName lastName notifications profilePicture"
      );
    });

    socket.on("updateNotifications", (otherUserId, otherUserType) => {
      // console.log("update notifs");
      // console.log(socket.userId, socket.userType);
      getUser(socket.userId, socket.userType, (err, user) => {
        if (err) console.log(err);
        else {
          // console.log(user);
          io.to(socket.userId).emit("newNotifications", user?.notifications);
          if (otherUserId) {
            getUser(otherUserId, otherUserType, (err, otherUser) => {
              if (err) console.log(err);
              else {
                io.to(otherUserId).emit(
                  "newNotifications",
                  otherUser?.notifications
                );
              }
            });
          }
        }
      });
    });

    socket.on("updateProfilePic", () => {
      // console.log("update pic");
      freelancerModel.findById(socket.userId, (err, user) => {
        // console.log(socket.userId, user);
        io.to(socket.userId).emit("newProfilePicture", user?.profilePicture);
      });
    });

    socket.on("updateName", () => {
      // console.log("update name");
      freelancerModel.findById(socket.userId, (err, user) => {
        // console.log(socket.userId, user);
        io.to(socket.userId).emit(
          "newName",
          `${user?.firstName} ${user?.lastName}`
        );
      });
    });

    socket.on("disconnect", (reason) => {
      console.log(reason);
    });
  });
};

module.exports = { socketServer };
