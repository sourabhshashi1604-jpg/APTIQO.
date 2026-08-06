const { error } = registerSchema.validate(req.body);

if (error) {
    return res.status(400).json({
        success: false,
        message: error.details[0].message
    });
}
