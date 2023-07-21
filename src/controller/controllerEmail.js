import nodemailer from "nodemailer";

const Email = (req, res) => {
  const { name, email, message } = req.body;

  const transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
      user: process.env.EMAIL,
      pass: process.env.PASSWORDEMAIL,
    },
  });

  const mailOptions = {
    from: "nelsonn141999@gmail.com",
    to: "negavalos99@gmail.com",
    subject: "Formulario de contacto",
    text: `Nombre: ${name}\nCorreo electrónico: ${email}\nMensaje: ${message}`,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log("Error al enviar el correo:", error);
      res.status(500).json({ message: "Error al enviar el correo" });
    } else {
      console.log("Correo enviado:", info.response);
      res.status(200).json({ message: "Correo enviado correctamente" });
    }
  });
};

export default  Email ;
