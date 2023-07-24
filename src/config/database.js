const { MongoClient } = require("mongodb");
import { config } from "dotenv";

config();

const uri = process.env.API_KEY;
const client = new MongoClient(uri);

const connectToDatabase = async () => {
  try {
    await client.connect();
    console.log("Conectado a la base de datos MongoDB");
  } catch (error) {
    console.error("Error al conectar a la base de datos:", error);
    process.exit(1);
  }
};

export { client, connectToDatabase };
