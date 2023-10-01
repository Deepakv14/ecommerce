const User = require('../models/userModel');
const sendToken = require('../utils/jwtToken');
const sendEmail = require("../utils/sendEmail.js");
// Register a User
exports.registerUser = async(req, res) => {
    const { name, email, password } = req.body;
    const user = await User.create({
        name,
        email,
        password,
        avtar: {
            public_id: "Sample avatar for user",
            url: "Sample url for user"
        }
    })
    sendToken(user, 201, res);
}

// Log In user
exports.loginUser = async(req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({
            success: false,
            message: "Email or Password is missing"
        })
    }

    const user = await User.findOne({ email }).select("+password");

    if (!user) {
        return res.status(401).json({
            success: false,
            message: "Invalid Email or Password"
        })
    }

    const isPassswordMatched = await user.comparePassword(password);

    if (!isPassswordMatched) {
        return res.status(401).json({
            success: false,
            message: "Invalid Email or Password"
        })
    }
    sendToken(user, 200, res);
}

// LogOut user
exports.logout = async(req, res) => {

    res.cookie("token", null, {
        expires: new Date(Date.now()),
        httpOnly: true
    });
    res.status(200).json({
        success: true,
        message: "Logged Out"
    })
}

// Forgot Password
exports.forgotPassword = async(req, res, next) => {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
        return res.status(404).json({
            success: false,
            message: "Invalid Email"
        })
    }
    // Get Reset Password Token
    const resetToken = user.getResetPasswordToken();

    await user.save({ validateBeforeSave: false });


    const resetPasswordUrl = `${req.protocol}://${req.get("host")}/api/v1/password/reset/${resetToken}`; // `http://localhost/api/v1/password/reset/${resetToken}`

    const message = `Your password reset token is: \n\n ${resetPasswordUrl} \n\n If you haven't requested this email, Please ignore it.`;

    try {

        await sendEmail({
            email: user.email, // To
            subject: `Ecommerce Password Recovery`,
            message,
        });

        res.status(200).json({
            success: true,
            message: `Email sent to ${user.email} successfully`
        })
    } catch (error) {
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;
        await user.save({ validateBeforeSave: false });

        return res.status(500).json({
            success: false,
            message: error.message
        })
    }

}