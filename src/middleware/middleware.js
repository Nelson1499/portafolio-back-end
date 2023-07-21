export const authorizeAdmin = (req, res, next) => {

  const userEmail = req.headers.email;
  const adminEmails = ["negavalos99@gmail.com"];

  if (adminEmails.includes(userEmail)) {
    next();
  } else {
    res
      .status(401)
      .json({ message: "No tienes autorización para crear un proyecto" });
  }
};
