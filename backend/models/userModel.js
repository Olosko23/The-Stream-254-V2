const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      unique: [true, "Email in use"],
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    avatar: {
      type: String,
    },
    sports: {
      //To be updated depending on the available sports services
      type: [String],
      enum: [
        "Football",
        "Basketball",
        "Netball",
        "Tennis",
        "Motorsport",
        "Golf",
        "Rugby",
        "Hockey",
        "Atheltics",
        "Cycling",
        "Swimming",
        "Equestrian",
        "Baseball",
        "Ice Hockey",
        "Snooker",
        "Boxing",
        "American Football",
        "MMA",
        "Cricket",
      ],
    },
    interests: {
      //To be updated depending on the available sports services
      type: [String],
      enum: [
        "Premier League",
        "La Liga",
        "Serie A",
        "Bundesliga",
        "Ligue 1",
        "UEFA Champions League",
        "UEFA Europa League",
        "UEFA Conference League",
        "FA Cup",
        "UEFA Euros",
        "UEFA Nations League",
        "NBA",
        "NFL",
        "MLB",
        "NHL",
        "PGA Tour",
        "Formula 1",
        "Moto GP",
        "NASCAR",
        "WRC",
        "IPL",
        "CAF Champions League",
        "BAL",
        "Euroleague",
        "IndyCar",
        "WSL",
        "EFL Championship",
        "Eredivisie",
      ],
    },
    location: {
      type: String,
    },
    phone_number: {
      type: String,
    },
    terms: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model("User", userSchema);

module.exports = User;
