
const jwt = require("jsonwebtoken");
export const authorize = (req, res, next) => {
  const token = req.headers.authorization;
  const isAuthenticated = jwt.verify(token, "nelslo134131321");

  if (isAuthenticated) {
    next();
  } else {
    res
      .status(401)
      .json({ message: "No tienes autorización para acceder a esta ruta" });
  }
};
