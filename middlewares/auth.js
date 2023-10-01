const User = require('../models/userModel');
const jwt = require('jsonwebtoken');

exports.isAuthenticatedUser = async(req, res, next) => {
    const { token } = req.cookies; // Object
    // So Either we can write req.cookies.token or const {token}

    if (!token) {
        return res.status(401).json({
            success: false,
            message: "Please Login to access this resource"
        })
    }

    const decodedData = jwt.verify(token, "DEEPAKVERMA"); // token, SECRET_KEY
    // DecodedData has ID, SECRETKEY, EXPIRY
    req.user = await User.findById(decodedData.id);
    next();
}

exports.authorizedRoles = (...roles) => { // array
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) { // includes -> array function
            return res.status(403).json({ // 403 -> Refused 
                status: false,
                message: `Role:${req.user.role} is not allowed to access this resource!`
            })
        };
        next();
    }
}