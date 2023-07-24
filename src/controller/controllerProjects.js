import { ObjectId } from "mongodb";
import { client } from "../config/database";
import { cloudinary } from "../config/cloudinary";
import fs from "fs-extra";

const db = client.db("portafolio");
const uploadProject = async (req, res) => {
  try {
    const folderName = "portafolio";
    const createFolderResult = await cloudinary.api.create_folder(folderName);
    const { urlweb, urlrepository, description, title } = JSON.parse(req.body.data);
    if (!createFolderResult || createFolderResult.error) {
      console.error(
        "Error al crear la carpeta en Cloudinary:",
        createFolderResult.error
      );
      return;
    }
    const images = await Promise.all(
      req.files.map(async (file) => {
        const resultcloud = await cloudinary.v2.uploader.upload(file.path, {
          folder: folderName,
        });
        return {
          url: resultcloud.secure_url,
          public_id: resultcloud.public_id,
        };
      })
    );
    const result = await db.collection("projects").insertOne({
      urlweb,
      urlrepository,
      description,
      images,
      title,
    });
    req.files.map(async (file) => await fs.unlink(file.path));
    res.status(200).json({ message: "Datos guardados correctamente" });
  } catch (error) {
    console.error("Error al guardar los datos en MongoDB:", error);
    res.status(500).json({ message: "Error al guardar los datos" });
  }
};

const getProjects = async (req, res) => {
  try {
    const datos = await db.collection("projects").find().toArray();

    res.status(200).json(datos);
  } catch (error) {
    console.error("Error al obtener los datos de MongoDB:", error);
    res.status(500).json({ message: "Error al obtener los datos" });
  }
};
const getProjectspage = async (req, res) => {
  try {
    const page = parseInt(req.params.page) || 1;
    const itemsPerPage = 5;
    const skip = (page - 1) * itemsPerPage;

    const totalProjects = await db.collection("projects").countDocuments();
    const projects = await db
      .collection("projects")
      .find()
      .skip(skip)
      .limit(itemsPerPage)
      .toArray();

    res.status(200).json({
      projects,
      currentPage: page,
      totalPages: Math.ceil(totalProjects / itemsPerPage),
    });
  } catch (error) {
    console.error("Error al obtener los datos de MongoDB:", error);
    res.status(500).json({ message: "Error al obtener los datos" });
  }
};

const editProject = async (req, res) => {
  const { id } = req.params;
  const { name, email, message } = req.body;

  try {
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
    const project = await db
      .collection("projects")
      .findOne({ _id: new ObjectId(id) });

    if (!project) {
      return res.status(404).json({ message: "El dato no fue encontrado" });
    }
    // Eliminar las imágenes de Cloudinary
    await Promise.all(
      project.images.map(async (img) => {
        await cloudinary.v2.uploader.destroy(img.public_id);
      })
    );

    // Eliminar el proyecto de la base de datos
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
  getProjectspage,
};
