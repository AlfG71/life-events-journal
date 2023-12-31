const { Schema, model } = require("mongoose");

const userSchema = new Schema(
  {
    userName: {
      type: String,
      required: true,
      unique: true,
    },
    email: String,
    password: {
      type: String,
      required: true,
      unique: true,
    },
    img: {
      type: String,
      default:
        "https://cvhrma.org/wp-content/uploads/2015/07/default-profile-photo.jpg",
    },
    children: [{ type: Schema.Types.ObjectId, ref: "Child" }],
  },
  {
    timestamps: true,
  }
);

module.exports = model("User", userSchema);
