const express = require("express");
const {
  getRecipes,
  getRecipe,
  createRecipe,
  updateRecipe,
  deleteRecipe,
  recipePhotoUpload
} = require("../controllers/recipes");

const Recipe = require("../models/Recipe");

// Include resoure routers

const router = express.Router();

const { protect, authorize } = require("../middleware/auth");
const advancedResults = require("../middleware/advancedResults");

// Re-route into other resource routers

router
  .route("/")
  .get(advancedResults(Recipe), getRecipes)
  .post(protect, authorize("user", "admin"), createRecipe);
router
  .route("/:id")
  .get(getRecipe)
  .put(protect, authorize("user", "admin"), updateRecipe)
  .delete(protect, authorize("user", "admin"), deleteRecipe);
router
  .route("/:id/photo")
  .put(protect, authorize("user", "admin"), recipePhotoUpload);
module.exports = router;
