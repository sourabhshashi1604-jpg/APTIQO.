const jwt = require("jsonwebtoken");
const { HTTP_STATUS } = require("../constants");

const requireAuth = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(HTTP_STATUS.UNAUTHORIZED).json({
            success: false,
            message: "Access denied. No token provided.",
        });
    }

    try {
        const token = authHeader.split(" ")[1];

        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET
        );

        req.user = decoded;

        next();
    } catch (error) {
        return res.status(HTTP_STATUS.UNAUTHORIZED).json({
            success: false,
            message: "Invalid or expired token.",
        });
    }
};

module.exports = requireAuth;
