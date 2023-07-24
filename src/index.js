import app from "./app";
import { config } from "dotenv";

config();
const main = () => {
  app.listen(app.get("port"));
  console.log(`server on port ${app.get("port")}`);
};

main();