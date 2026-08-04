const { HTTP_STATUS } = require("../constants");

const requireRole = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return res.status(HTTP_STATUS.FORBIDDEN).json({
                success: false,
                message: "Access forbidden.",
            });
        }

        next();
    };
};

module.exports = requireRole;
