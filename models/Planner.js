const mongoose = require("mongoose");

const PlannerSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: true
  },
  startDate: {
    type: Date,
    default: Date.now
  },
  monday: {
    type: [mongoose.Schema.ObjectId],
    ref: "Recipe",
    required: true
  },
  tuesday: {
    type: [mongoose.Schema.ObjectId],
    ref: "Recipe",
    required: true
  },
  wednesday: {
    type: [mongoose.Schema.ObjectId],
    ref: "Recipe",
    required: true
  },
  thursday: {
    type: [mongoose.Schema.ObjectId],
    ref: "Recipe",
    required: true
  },
  friday: {
    type: [mongoose.Schema.ObjectId],
    ref: "Recipe",
    required: true
  },
  saturday: {
    type: [mongoose.Schema.ObjectId],
    ref: "Recipe",
    required: true
  },
  sunday: {
    type: [mongoose.Schema.ObjectId],
    ref: "Recipe",
    required: true
  },
  veganOnly: {
      type: Boolean,
      default: false
  },
  glutenFreeOnly: {
      type: Boolean,
      default: false
  }
});

module.exports = mongoose.model("Planner", PlannerSchema);
