const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto'); // Built-in module, need not to be installed -- RESET PASSWORD for generating TOKEN

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please Enter your Name"],
        maxLength: [30, "Name cannot exceed 30 characters"],
        minLength: [4, "Name shoud have more than 4 characters"]
    },
    email: {
        type: String,
        required: [true, "Please enter your Email"],
        unique: true,
        validate: [validator.isEmail, "Please Enter a Valid Email"],
    },
    password: {
        type: String,
        required: [true, "Please enter your password"],
        minLength: [8, "Password shoud be greater than 8 characters"],
        select: false // On using find() query, It won't be visible when set to false explicitly
    },
    avtar: {
        // When we upload images on Cloud, we get a "public_id" and "url"
        public_id: {
            type: String,
            required: true
        },
        url: {
            type: String,
            required: true
        }
    },
    role: {
        type: String,
        default: "user"
    },
    resetPasswordToken: String,
    resetPasswordExpire: Date,
})

userSchema.pre("save", async function(next) { // Here ()=> is not used because 'this' keyword can't be used in Arrow()
    if (!this.isModified("password")) {
        next();
    }
    this.password = await bcrypt.hash(this.password, 10); // Salting
})

//JWT TOKEN
userSchema.methods.getJWTToken = function() {

    return jwt.sign({ id: this._id }, "DEEPAKVERMA", {
            expiresIn: "3d",
        }) // payload, secretKey, expiryTime
}

//Compare Password
userSchema.methods.comparePassword = async function(enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
}

// Reset password
userSchema.methods.getResetPasswordToken = async function() {
    const resetToken = crypto.randomBytes(20).toString("hex"); // Generating a Token

    /*
      crypto.randomBytes(20) -> gives me a Buffer Value  
      crypto.randomBytes(20).toString() -> Some garbage value
      crypto.randomBytes(20).toString("hex") -> 20 length String 
      */

    // Hashing and adding resetPasswordToken to userSchema   
    const resetPasswordToken = crypto.createHash("sha256").update(resetToken).digest("hex") // sha256 is an algorithm

    this.resetPasswordExpire = Date.now() + 15 * 60 * 1000; // 15 minutes

    return resetToken;

}

module.exports = mongoose.model('User', userSchema);