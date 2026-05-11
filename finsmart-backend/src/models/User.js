const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    passwordHash: { type: String, required: true },
    businessProfile: { type: mongoose.Schema.Types.Mixed, default: null },
    onboardingCompletedAt: { type: Date, default: null },
  },
  { timestamps: true }
);

UserSchema.methods.toSafeObject = function toSafeObject() {
  const o = this.toObject({ versionKey: false });
  delete o.passwordHash;
  return o;
};

module.exports = mongoose.model('User', UserSchema);
