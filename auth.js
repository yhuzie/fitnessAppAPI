const jwt = require("jsonwebtoken");

module.exports.verify = (req, res, next) => {
    const authorizationHeader = req.headers.authorization;
    if (!authorizationHeader) {
        return res.status(401).json({ auth: "Failed", message: "No token provided." });
    }

    const token = authorizationHeader.startsWith("Bearer ")
        ? authorizationHeader.slice(7)
        : authorizationHeader;

    jwt.verify(token, process.env.JWT_SECRET_KEY, (err, decodedToken) => {
        if (err) {
            console.error("Token verification error:", err);
            return res.status(403).json({ auth: "Failed", message: "Invalid token." });
        }
        req.user = decodedToken;
        console.log("User authenticated:", decodedToken);
        next();
    });
};