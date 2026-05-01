const jwt = require("jsonwebtoken");

const protect = (req, res, next) => {
    try {
        let token = req.headers.authorization;

        console.log("HEADER TOKEN:", token);

        if (!token) {
            return res.status(401).json({
                message: "No token provided"
            });
        }

        // Remove Bearer if present
        if (token.startsWith("Bearer ")) {
            token = token.split(" ")[1];
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET || "secretkey");

        req.user = decoded;

        next();

    } catch (error) {
        console.log(error);
        return res.status(401).json({
            message: "Invalid token"
        });
    }
};

module.exports = protect;