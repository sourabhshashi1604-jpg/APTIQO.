const { HTTP_STATUS, MESSAGES } = require("../constants");

const errorMiddleware = (err, req, res, next) => {
    console.error(err);

    const statusCode =
        err.statusCode || HTTP_STATUS.INTERNAL_SERVER_ERROR;

    const message =
        err.message || MESSAGES.GENERAL.SERVER_ERROR;

    res.status(statusCode).json({
        success: false,
        message,
        stack:
            process.env.NODE_ENV === "development"
                ? err.stack
                : undefined,
    });
};

module.exports = errorMiddleware;