import "dotenv/config";
import connectDB from "./db/index.js";
import { app } from "./app.js";

connectDB()
  .then(() => {
    app.listen(process.env.PORT || 7000, () => {
      console.log("Server Start At Port: ", process.env.PORT || 7000);
    });
  })
  .catch((err) => console.log("MongoDB Connection failed !!", err));
