const path = require('path');
const ErrorResponse = require('../utils/errorResponse');
const Planner = require('../models/Planner');
const Recipe = require('../models/Recipe');
const asyncHandler = require('../middleware/async');

// @desc    Get all plans
// @route   GET /api/v1/planner
// @route   GET /api/v1/users/:id/planner
// @access  Public
exports.getPlans = asyncHandler(async (req, res, next) => {
  if (req.params.userId) {
    const plan = await Planner.find({ user: req.params.userId });
    return res.status(200).json({
      sucess: true,
      count: plan.length,
      data: plan,
    });
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
    data: plan,
  });
});

// @desc  Create new plan
// @route POST /api/v1/planner
// @access Private
exports.createPlan = asyncHandler(async (req, res, next) => {
  // Add user to plan
  req.body.user = req.user.id;

  let breakfast = [];
  let breakfastTitle = [];
  let lunch = [];
  let lunchTitle = [];
  let dinner = [];
  let dinnerTitle = [];
  let dessert = [];
  let dessertTitle = [];
  let snack = [];
  let snackTitle = [];
  for (i = 0; i < 7; i++) {
    if (req.body.breakfastID[i] == '') {
      breakfast[i] = '';
    } else {
      breakfast[i] = await Recipe.findById(req.body.breakfastID[i]).select(
        'title'
      );
    }
    if (req.body.lunchID[i] == '') {
      lunch[i] = '';
    } else {
      lunch[i] = await Recipe.findById(req.body.lunchID[i]).select('title');
    }
    if (req.body.dinnerID[i] == '') {
      dinner[i] = '';
    } else {
      dinner[i] = await Recipe.findById(req.body.dinnerID[i]).select('title');
    }
    if (req.body.dessertID[i] == '') {
      dessert[i] = '';
    } else {
      dessert[i] = await Recipe.findById(req.body.dessertID[i]).select('title');
    }
    if (req.body.snackID[i] == '') {
      snack[i] = '';
    } else {
      snack[i] = await Recipe.findById(req.body.snackID[i]).select('title');
    }

    breakfastTitle[i] = breakfast[i].title;
    lunchTitle[i] = lunch[i].title;
    dinnerTitle[i] = dinner[i].title;
    dessertTitle[i] = dessert[i].title;
    snackTitle[i] = snack[i].title;
  }
  req.body.breakfastName = breakfastTitle;
  req.body.lunchName = lunchTitle;
  req.body.dinnerName = dinnerTitle;
  req.body.dessertName = dessertTitle;
  req.body.snackName = snackTitle;
  const plan = await Planner.create(req.body);
  //console.log(recipe);
  res.status(201).json({
    sucess: true,
    data: plan,
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
  if (plan.user.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(
      new ErrorResponse(
        `User ${req.params.id} is not authorized to update this plan`,
        401
      )
    );
  }
  let breakfast = [];
  let breakfastTitle = [];
  let lunch = [];
  let lunchTitle = [];
  let dinner = [];
  let dinnerTitle = [];
  let dessert = [];
  let dessertTitle = [];
  let snack = [];
  let snackTitle = [];
  for (i = 0; i < 7; i++) {
    if (req.body.breakfastID) {
      if (req.body.breakfastID[i] == '' || null) {
        breakfast[i] = '';
      } else {
        breakfast[i] = await Recipe.findById(req.body.breakfastID[i]).select(
          'title'
        );
      }
      breakfastTitle[i] = breakfast[i].title;
    }
    if (req.body.lunchID) {
      if (req.body.lunchID[i] == '' || null) {
        lunch[i] = '';
      } else {
        lunch[i] = await Recipe.findById(req.body.lunchID[i]).select('title');
      }
      lunchTitle[i] = lunch[i].title;
    }
    if (req.body.dinnerID) {
      if (req.body.dinnerID[i] == '' || null) {
        dinner[i] = '';
      } else {
        dinner[i] = await Recipe.findById(req.body.dinnerID[i]).select('title');
      }
      dinnerTitle[i] = dinner[i].title;
    }
    if (req.body.dessertID) {
      if (req.body.dessertID[i] == '' || null) {
        dessert[i] = '';
      } else {
        dessert[i] = await Recipe.findById(req.body.dessertID[i]).select(
          'title'
        );
      }
      dessertTitle[i] = dessert[i].title;
    }
    if (req.body.snack) {
      if (req.body.snackID[i] == '' || null) {
        snack[i] = '';
      } else {
        snack[i] = await Recipe.findById(req.body.snackID[i]).select('title');
      }
      snackTitle[i] = snack[i].title;
    }
  }
  req.body.breakfastName = breakfastTitle;
  req.body.lunchName = lunchTitle;
  req.body.dinnerName = dinnerTitle;
  req.body.dessertName = dessertTitle;
  req.body.snackName = snackTitle;
  plan = await Planner.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  res.status(200).json({
    sucess: true,
    data: plan,
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
  if (plan.user.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(
      new ErrorResponse(
        `User ${req.params.id} is not authorized to update this plan`,
        401
      )
    );
  }
  await plan.deleteOne();
  res.status(201).json({
    sucess: true,
    data: {},
  });
});
