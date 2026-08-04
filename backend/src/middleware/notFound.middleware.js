const { HTTP_STATUS } = require("../constants");

const notFoundMiddleware = (req, res) => {
    res.status(HTTP_STATUS.NOT_FOUND).json({
        success: false,
        message: `Route ${req.originalUrl} not found`,
    });
};

module.exports = notFoundMiddleware;