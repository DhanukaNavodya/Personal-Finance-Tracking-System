import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

const UserSchema = new mongoose.Schema({
  username: { 
    type: String, 
    required: true, 
    unique: true,
    trim: true // Removes extra spaces
  },
  contactNumber: { 
    type: String, 
    required: true 
  },
  email: { 
    type: String, 
    required: true, 
    unique: true, 
    lowercase: true, // Ensures case-insensitive email storage
    trim: true
  },
  role: { 
    type: String, 
    enum: ["USER", "ADMIN"], // Ensures only valid roles are assigned
    default: "USER"
  },
  password: { 
    type: String, 
    required: true, 
    minlength: 6 // Enforces password length
  }
}, { timestamps: true });

// Hash password before saving
UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Method to compare passwords
UserSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model('User', UserSchema);
export default User;
