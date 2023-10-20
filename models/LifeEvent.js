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
        "https://cvhrma.org/wp-content/uploads/2015/07/default-profile-photo.jpg",

    },

  },

  {

    timestamps: true,

  }

);

module.exports = model("LifeEvent", lifeEventSchema);
