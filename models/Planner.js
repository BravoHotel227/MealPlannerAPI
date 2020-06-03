const mongoose = require('mongoose');

const PlannerSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true,
  },
  name: {
    type: String,
    required: true
  },
  breakfastID: {
    type: [String],
  },
  lunchID: {
    type: [String],
  },
  dinnerID: {
    type: [String],
  },
  dessertID: {
    type: [String],
  },
  snackID: {
    type: [String],
  },
  breakfastName: {
    type: [String],
    default: '',
  },
  lunchName: {
    type: [String],
    default: '',
  },
  dinnerName: {
    type: [String],
    default: '',
  },
  dessertName: {
    type: [String],
    default: '',
  },
  snackName: {
    type: [String],
    default: '',
  },
  veganOnly: {
    type: Boolean,
    default: false,
  },
  glutenFreeOnly: {
    type: Boolean,
    default: false,
  },
});

module.exports = mongoose.model('Planner', PlannerSchema);
