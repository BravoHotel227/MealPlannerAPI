const express = require("express");
const {
  getPlans,
  getPlan,
  createPlan,
  updatePlan,
  deletePlan
} = require("../controllers/planner");

const Planner = require("../models/Planner");

const router = express.Router();

const { protect, authorize } = require("../middleware/auth");
const advancedResults = require("../middleware/advancedResults");

router
  .route("/")
  .get(advancedResults(Planner), getPlans)
  .post(protect, authorize("user", "admin"), createPlan);
router
  .route("/:id")
  .get(getPlan)
  .put(protect, authorize("user", "admin"), updatePlan)
  .delete(protect, authorize("user", "admin"), deletePlan);
module.exports = router;