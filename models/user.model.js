const mongoose = require("mongoose");

const subTaskSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, lowercase: true },
    description: { type: String, required: true, lowercase: true },
    completed: { type: Boolean, default: false },
  },
  { minimize: true, timestamps: true }
);

const taskSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, lowercase: true },
    description: { type: String, required: true, lowercase: true },
    status: {
      type: String,
      enum: ["in progress", "completed"],
      default: "in progress",
    },
    subTasks: { type: [subTaskSchema], default: [] },
  },
  { minimize: true, timestamps: true }
);

const userSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, trim: true, lowercase: true },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      validate: {
        validator: function (value) {
          return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
        },
        message: (props) => `${props.value} is not a valid email address!`,
      },
    },
    phone: {
      type: String,
      required: true,
      validate: {
        validator: function (value) {
          return /^\d{10}$/.test(value);
        },
        message: (props) => `${props.value} is not a valid phone number!`,
      },
    },
    password: { type: String, required: true, minlength: 6 },
    tasks: { type: [taskSchema], default: [] },
  },
  { minimize: true, timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
