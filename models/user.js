const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  tasks : [{type:mongoose.SchemaTypes.ObjectId,ref:"Task"}]
});

const User = mongoose.model("User", UserSchema);
module.exports = User;