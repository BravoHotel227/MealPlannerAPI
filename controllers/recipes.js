const path = require("path");
const ErrorResponse = require("../utils/errorResponse");
const Recipe = require("../models/Recipe");
const asyncHandler = require("../middleware/async");

// @desc    Get all recipes
// @route   GET /api/v1/recipes
// @access  Public
exports.getRecipes = asyncHandler(async (req, res, next) => {
  res.status(200).json(res.advancedResults);
});

// @desc    Get single recipes
// @route   GET /api/v1/recipes/:id
// @access  Public
exports.getRecipe = asyncHandler(async (req, res, next) => {
  const recipe = await Recipe.findById(req.params.id);
  if (!recipe) {
    return next(
      new ErrorResponse(`Recipe not found with id of ${req.params.id}`, 404)
    );
  }
  res.status(200).json({
    success: true,
    data: recipe
  });
});

// @desc  Create new recipe
// @route POST /api/v1/recipes
// @access Private
exports.createRecipe = asyncHandler(async (req, res, next) => {
  // Add user to recipe
  req.body.user = req.user.id;
  const recipe = await Recipe.create(req.body);

  res.status(201).json({
    sucess: true,
    data: recipe
  });
});

// @desc  Update recipe
// @route PUT /api/v1/recipes/:id
// @access Private
exports.updateRecipe = asyncHandler(async (req, res, next) => {
  let recipe = await Recipe.findById(req.params.id);

  if (!recipe) {
    return next(new ErrorResponse(`No recipe with id ${req.params.id}`, 404));
  }

  // Make sure user owns recipe
  if (recipe.user.toString() !== req.user.id && req.user.role !== "admin") {
    return next(
      new ErrorResponse(
        `User ${req.params.id} is not authorized to update this recipe`,
        401
      )
    );
  }

  recipe = await Recipe.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });
  res.status(200).json({
    sucess: true,
    data: recipe
  });
});

// @desc  Delete recipe
// @route DELETE /api/v1/recipes/:id
// @access Private
exports.deleteRecipe = asyncHandler(async (req, res, next) => {
  let recipe = await Recipe.findById(req.params.id);

  if (!recipe) {
    return next(new ErrorResponse(`No recipe with id ${req.params.id}`, 404));
  }

  // Make sure user owns recipe
  if (recipe.user.toString() !== req.user.id && req.user.role !== "admin") {
    return next(
      new ErrorResponse(
        `User ${req.params.id} is not authorized to update this recipe`,
        401
      )
    );
  }

  await Recipe.deleteOne();
  res.status(201).json({
    sucess: true,
    data: {}
  });
});

// @desc    Upload photo for recipe
// @route   PUT /api/v1/recipes/:id/photo
// @access  Private
exports.recipePhotoUpload = asyncHandler(async (req, res, next) => {
  const recipe = await Recipe.findById(req.params.id);
  if (!recipe) {
    return next(
      new ErrorResponse(`Recipe not found with id of ${req.params.id}`, 404)
    );
  }
  
  // Make sure user owns recipe
  if (recipe.user.toString() !== req.user.id && req.user.role !== "admin") {
    return next(
      new ErrorResponse(
        `User ${req.params.id} is not authorized to update this recipe`,
        401
      )
    );
  }

  if (!req.files) {
    return next(new ErrorResponse(`Please upload a file`, 400));
  }

  const file = req.files.file;
  // Make sure the image is a photo
  if (!file.mimetype.startsWith("image")) {
    return next(new ErrorResponse(`Please upload a image file`, 400));
  }

  // Check filesize
  if (file.size > process.env.MAX_FILE_UPLOAD) {
    return next(
      new ErrorResponse(
        `Please upload a image less than ${process.env.MAX_FILE_UPLOAD}`,
        400
      )
    );
  }

  // Create custom filename
  file.name = `photo_${recipe.slug}${path.parse(file.name).ext}`;

  file.mv(`${process.env.FILE_UPLOAD_PATH}/${file.name}`, async err => {
    if (err) {
      console.error(err);
      return next(new ErrorResponse(`Problem with file upload`, 500));
    }

    await Recipe.findByIdAndUpdate(req.params.id, { photo: file.name });

    res.status(200).json({
      success: true,
      data: file.name
    });
  });
});
