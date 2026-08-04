const paginate = (page = 1, limit = 20) => {
    page = Number(page);
    limit = Number(limit);

    const skip = (page - 1) * limit;

    return {
        page,
        limit,
        skip,
    };
};

module.exports = paginate;
