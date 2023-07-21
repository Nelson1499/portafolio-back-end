// import { ObjectId } from "mongodb";
const { ObjectId } = require("mongodb");
import { connectToDatabase, client } from "../config/database";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

connectToDatabase();
const signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const db = client.db("<database>");

    const existingUser = await db.collection("user").findOne({ email });

    if (existingUser) {
      res
        .status(409)
        .json({ message: "El correo electrónico ya está registrado" });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const result = db.collection("user").insertOne({
      name,
      email,
      password: hashedPassword,
    });
    res.status(200).json({ message: "Datos guardados correctamente" });
  } catch (error) {
    console.error("Error al guardar los datos en MongoDB:", error);
    res.status(500).json({ message: "Error al guardar los datos" });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const db = client.db("<database>");

    const user = await db.collection("user").findOne({ email });

    if (!user) {
      res.status(401).json({ message: "Credenciales inválidas" });
      return;
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      res.status(401).json({ message: "Credenciales inválidas" });
      return;
    }

    const token = jwt.sign({ userId: user._id }, "nelslo134131321");

    res.status(200).json({ userId: user._id, token });
  } catch (error) {
    console.error(
      "Error al verificar las credenciales de inicio de sesión:",
      error
    );
    res.status(500).json({ message: "Error en el servidor" });
  }
};

const authGoogle = async (req, res) => {
  try {
    const { email, name, googleId } = req.body;
    const db = client.db("<database>");

    const user = await db.collection("user").findOne({ email });

    if (user) {
      const token = jwt.sign({ userId: user._id }, "nelslo134131321");
      res.status(200).json({ userId: user._id, token });
    } else {
      const result = await db.collection("user").insertOne({
        email,
        name,
        googleId,
      });
      const user = await db.collection("user").findOne({ email });
      if (user) {
        
        const token = jwt.sign({ userId: user._id }, "nelslo134131321");
        res.status(200).json({ userId: user._id, token });
      }
    }
  } catch (error) {
    console.error("Error al procesar el inicio de sesión con Google:", error);
    res.status(500).json({ message: "Error en el servidor" });
  }
};

const authGet = async (req, res) => {
  try {
    const { id } = req.params; 
    const db = client.db("<database>");

    const data = await db.collection("user").findOne({ _id: new ObjectId(id) });

    if (data) {
      res.status(200).json(data);
    } else {
      res.status(404).json({ message: "No se encontraron datos" });
    }

  } catch (error) {
    res.status(500).json({ message: "Error al obtener los datos" });
  }
};

export const users = {
  signup,
  login,
  authGoogle,
  authGet,
};
