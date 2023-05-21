const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please provide a name."],
    minLength: 4,
    maxLength: 100,
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Please provide you email.'],
    match: [
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    ],
    unique: true,
    trim: true
  },
  password: {
    type: String,
    required: [true, 'Please enter a secure password.'],
    minLength: 6,
    trim: true
  },
  role: {
    type: Number,
    default: 0 // 0 = user, 1 = admin
  },
  avater: {
    type: String,
    default: "https://media.istockphoto.com/id/1300845620/vector/user-icon-flat-isolated-on-white-background-user-symbol-vector-illustration.jpg?s=612x612&w=0&k=20&c=yBeyba0hUkh14_jgv1OKqIH0CCSWU_4ckRkAoy2p73o="
  }
},
  { timestamps: true }
);

module.exports = mongoose.model('User', UserSchema);