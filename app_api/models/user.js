const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name:     { type: String, required: true, trim: true },
  email:    { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true, minlength: 8 }
}, { timestamps: true });

// Hash the password automatically whenever it's set or changed
userSchema.pre('save', async function () {
  if (!this.isModified('password')) return;
  this.password = await bcrypt.hash(this.password, 10);
});

// Check a login attempt against the stored hash
userSchema.methods.checkPassword = function (attempt) {
  return bcrypt.compare(attempt, this.password);
};

module.exports = mongoose.model('User', userSchema);