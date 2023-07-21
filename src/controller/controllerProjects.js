import { ObjectId } from "mongodb";
import { connectToDatabase, client } from "../config/database";

connectToDatabase();
const uploadProject = async (req, res) => {
  try {
    const { urlweb, urlrepository, description } = JSON.parse(req.body.data);
    const db = client.db("<database>");

    const images = req.files.map((file) => `/image/${file.filename}`);

    const result = await db.collection("projects").insertOne({
      urlweb,
      urlrepository,
      description,
      images,
    });

    res.status(200).json({ message: "Datos guardados correctamente" });
  } catch (error) {
    console.error("Error al guardar los datos en MongoDB:", error);
    res.status(500).json({ message: "Error al guardar los datos" });
  }
};

const getProjects = async (req, res) => {
  try {
    const db = client.db("<database>");
    const datos = await db.collection("projects").find().toArray();

    res.status(200).json(datos);
  } catch (error) {
    console.error("Error al obtener los datos de MongoDB:", error);
    res.status(500).json({ message: "Error al obtener los datos" });
  }
};

const editProject = async (req, res) => {
  const { id } = req.params;
  const { name, email, message } = req.body;

  try {
    const db = client.db("<database>");

    const existingData = await db
      .collection("projects")
      .findOne({ _id: new ObjectId(id) });

    const updatedData = {
      name: name || existingData.name,
      email: email || existingData.email,
      message: message || existingData.message,
    };

    const result = await db
      .collection("projects")
      .updateOne({ _id: new ObjectId(id) }, { $set: updatedData });

    console.log("Datos actualizados en MongoDB");
    res.status(200).json({ message: "Datos actualizados correctamente" });
  } catch (error) {
    console.error("Error al editar los datos en MongoDB:", error);
    res.status(500).json({ message: "Error al editar los datos" });
  }
};

const deleteProject = async (req, res) => {
  const { id } = req.params;

  try {
    const db = client.db("<database>");
    const result = await db
      .collection("projects")
      .deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      return res.status(404).json({ message: "El dato no fue encontrado" });
    }

    res.status(200).json({ message: "Dato eliminado correctamente" });
  } catch (error) {
    console.error("Error al eliminar el dato de MongoDB:", error);
    res.status(500).json({ message: "Error al eliminar el dato" });
  }
};

export const Projects = {
  uploadProject,
  getProjects,
  editProject,
  deleteProject,
};
