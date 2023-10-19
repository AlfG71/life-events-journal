const { Schema, model } = require("mongoose");

const childSchema = new Schema(
  {
    parent: {
      type: { type: Schema.Types.ObjectId, ref: "User" },
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    dateOfBirth: {
      type: Date,
      required: true,
    },
    img: String,
    events: [{ type: Schema.Types.ObjectId, ref: "Event" }],
  },
  {
    timestamps: true,
  }
);

module.exports = model("Child", childSchema);
