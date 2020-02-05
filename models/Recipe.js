const mongoose = require("mongoose");
const slugify = require("slugify");

const RecipeSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Please add a title"],
      trim: true,
      maxlength: [70, "Title cannot be more that 50 characters"]
    },
    slug: String,
    servers: Number,
    prepTime: {
      type: String,
      require: [true, "Please add a prep/cook time"]
    },
    ingredientNames: {
      type: [String],
      require: [true, "Please add a list of ingredient names"]
    },
    ingredientQtys: {
      type: [String],
      require: [true, "Please add the quantity need for the ingredients"]
    },
    directions: {
      type: String,
      require: [true, "Please add directions for the recipe"]
    },
    notes: String,
    vegan: {
      type: Boolean,
      default: false
    },
    glutenFree: {
      type: Boolean,
      default: false
    },
    category: {
      type: String,
      enum: ["Breakfast", "Lunch", "Dinner", "Snack", "Dessert"],
      require: [true, "Please give a category for the recipe"]
    },
    photo: {
      type: String,
      default: "no-photo.jpg"
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: true
    }
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Create recipe slug from the name
RecipeSchema.pre("save", function(next) {
  this.slug = slugify(this.title, { lower: true });
  next();
});

module.exports = mongoose.model("Recipe", RecipeSchema);
