const fs = require("fs");
const mongoose = require("mongoose");
const colors = require("colors");
const dotenv = require("dotenv");

// Load env vars
dotenv.config({ path: "./config/config.env" });

// Load models
const Recipe = require("./models/Recipe");
const User = require("./models/User");

// Connect to DB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true
});

// Read JSON files
const recipes = JSON.parse(
  fs.readFileSync(`${__dirname}/_data/recipes.json`, "utf-8")
);
const users = JSON.parse(
  fs.readFileSync(`${__dirname}/_data/users.json`, "utf-8")
);

// Import into DB
const importData = async () => {
  try {
    await Recipe.create(recipes);
    await User.create(users);
    console.log("Data imported".green.inverse);
    process.exit();
  } catch (err) {
    console.log(err);
  }
};

// Delete data from DB
const deleteData = async () => {
  try {
    await Recipe.deleteMany();
    await User.deleteMany();

    console.log("Data deleted".red.inverse);
    if (process.argv[2] === "-d") {
      process.exit();
    }
  } catch (err) {
    console.log(err);
  }
};

// Reset Data
const resetData = async () => {
  try {
    console.log("Deleting data...");
    await deleteData();
    console.log("data deleted");
    console.log("Importing data...");
    await importData();
    console.log("data imported");
  } catch (error) {
    console.error(error);
  }
};

if (process.argv[2] === "-i") {
  importData();
} else if (process.argv[2] === "-d") {
  deleteData();
} else if (process.argv[2] === "-r") {
  resetData();
}
