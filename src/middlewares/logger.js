const logger = (req, res, next) => {
    console.log(`[${req.method}] ${req.url}`);
    console.log("Body:", req.body);
    next();
};

module.exports = logger;
