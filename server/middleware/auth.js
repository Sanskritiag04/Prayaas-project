// const jwt = require("jsonwebtoken");

// module.exports = function (requiredRole) {
//   return function (req, res, next) {

//     const authHeader = req.headers?.authorization;

//     if (!authHeader) {
//       return res.status(401).json({ message: "No token provided" });
//     }

//     const token = authHeader.split(" ")[1];

//     try {
//       const decoded = jwt.verify(token, "PRAYAAS_SECRET");

//       // Role check
//       if (requiredRole && decoded.role !== requiredRole) {
//         return res.status(403).json({ message: "Access denied" });
//       }

//       req.user = decoded;

//       next();

//     } catch (err) {
//       return res.status(401).json({ message: "Invalid token" });
//     }

//   };
// };

const jwt = require("jsonwebtoken");

module.exports = function (requiredRole) {
  return function (req, res, next) {
    const authHeader = req.headers?.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "No token provided or invalid format" });
    }

    const token = authHeader.split(" ")[1];

    try {
      const decoded = jwt.verify(token, "PRAYAAS_SECRET");

      if (requiredRole && decoded.role !== requiredRole) {
        return res.status(403).json({ 
          message: `Access denied: Requires ${requiredRole} privileges` 
        });
      }
      req.user = decoded;

      next();

    } catch (err) {
      console.error("JWT Auth Error:", err.message);
      return res.status(401).json({ message: "Session expired or invalid token" });
    }
  };
};