const { Schema, model } = require("mongoose");

const lifeEventSchema = new Schema(
  {
    child: { type: Schema.Types.ObjectId, ref: "Child" } ,

    eventTitle: String,

    date: {

      type: Date,
      required: true,

    },

    description: {

      type: String,
      required: true,

    },

    img: {

      type: String,
      default:
        "https://fetv.tv/wp-content/uploads/2017/07/event_default.png",

    },

  },

  {

    timestamps: true,

  }

);

module.exports = model("LifeEvent", lifeEventSchema);
