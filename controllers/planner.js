const path = require("path");
const ErrorResponse = require("../utils/errorResponse");
const Planner = require("../models/Planner");
const asyncHandler = require("../middleware/async");

// @desc    Get all plans
// @route   GET /api/v1/planner
// @route   GET /api/v1/users/:id/planner
// @access  Public
exports.getPlans = asyncHandler(async (req, res, next) => {
    if(req.params.userId) {
        const plan = await Planner.find({user: req.params.userId})
        return res.status(200).json({
            sucess: true,
            count: plan.length,
            data: plan
        })
    }
  res.status(200).json(res.advancedResults);
});

// @desc    Get single plan
// @route   GET /api/v1/plans/:id
// @access  Public
exports.getPlan = asyncHandler(async (req, res, next) => {
  const plan = await Planner.findById(req.params.id);
  if (!plan) {
    return next(
      new ErrorResponse(`Plan not found with id of ${req.params.id}`, 404)
    );
  }
  res.status(200).json({
    success: true,
    data: plan
  });
});

// @desc  Create new plan
// @route POST /api/v1/planner
// @access Private
exports.createPlan = asyncHandler(async (req, res, next) => {
  // Add user to plan
  req.body.user = req.user.id;
  const plan = await Planner.create(req.body);

  res.status(201).json({
    sucess: true,
    data: plan
  });
});

// @desc  Update plan
// @route PUT /api/v1/planner/:id
// @access Private
exports.updatePlan = asyncHandler(async (req, res, next) => {
  let plan = await Planner.findById(req.params.id);

  if (!plan) {
    return next(new ErrorResponse(`No plan with id ${req.params.id}`, 404));
  }

  // Make sure user owns plan
  if (plan.user.toString() !== req.user.id && req.user.role !== "admin") {
    return next(
      new ErrorResponse(
        `User ${req.params.id} is not authorized to update this plan`,
        401
      )
    );
  }

  plan = await Planner.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });
  res.status(200).json({
    sucess: true,
    data: plan
  });
});

// @desc  Delete plan
// @route DELETE /api/v1/planner/:id
// @access Private
exports.deletePlan = asyncHandler(async (req, res, next) => {
  let plan = await Planner.findById(req.params.id);

  if (!plan) {
    return next(new ErrorResponse(`No plan with id ${req.params.id}`, 404));
  }

  // Make sure user owns plan
  if (plan.user.toString() !== req.user.id && req.user.role !== "admin") {
    return next(
      new ErrorResponse(
        `User ${req.params.id} is not authorized to update this plan`,
        401
      )
    );
  }
  await Planner.deleteOne();
  res.status(201).json({
    sucess: true,
    data: {}
  });
});
