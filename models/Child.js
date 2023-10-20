const { Schema, model } = require("mongoose");

const childSchema = new Schema(
  {
    parent: { type: { type: Schema.Types.ObjectId, ref: "User" } },

    name: {
      type: String,
      required: true,
    },

    dateOfBirth: {
      type: Date,
      required: true,
    },

    img: {
      type: String,
      default:
        "https://cvhrma.org/wp-content/uploads/2015/07/default-profile-photo.jpg",
    },

    events: [ { type: Schema.Types.ObjectId, ref: "Event" } ],
  },

  {
    timestamps: true,
  }
);

module.exports = model("Child", childSchema);
