module.exports = {
  sendPushNotification: (message) => {
    admin
      .messaging()
      .send(message)
      .then((res) => {
        console.log({ msg: "message succesfully sent !" });
      })
      .catch((error) => {
        res.status(500).json({ error: error });
      });
  },
};
