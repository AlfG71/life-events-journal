const { Schema, model } = require("mongoose");

const lifeEventSchema = new Schema(
  {
    child: {
      type: { type: Schema.Types.ObjectId, ref: "Child" },
      required: true,
    },
    eventTitle: String,
    date: {
      type: Date,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    img: String,
  },
  {
    timestamps: true,
  }
);

module.exports = model("LifeEvent", lifeEventSchema);
