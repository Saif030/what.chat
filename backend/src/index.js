import app from "./api/app.js";
import dbConnect from "./dbConnect/dbConnect.js";
import dotenv from "dotenv";
dotenv.config({ path: './src/.env' });

const PORT = process.env.PORT || 3000;

dbConnect()
.then(() => {
    app.listen(process.env.PORT, () => {
        console.log(`Server is running on port ${process.env.PORT}`);
    });
})
.catch((err) => {
    console.log(`Error: ${err.message}`);
});
