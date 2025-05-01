import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: [true, "Full name is required"], minlength: [12, "The full name should be at least 12 characters"] },
    email: { type: String, required: [true, "Email is required"], minlength: 15, unique: true },
    password: { type: String, required: [true, "Password is required"], select: false },
    age: { type: Number, required: [true, "Age is required"] },
    role: { type: String, enum: ["admin", "user"], default: "user" }
  },
  { timestamps: true }
);

userSchema.methods = {
  comparePassword: async function (enteredPassword) {
    return bcrypt.compare(enteredPassword, this.password);
  },

  getJwtToken: function () {
    return jwt.sign(
      { id: this._id, email: this.email, role: this.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );
  }
};

const User = mongoose.model('User', userSchema);
export default User;
