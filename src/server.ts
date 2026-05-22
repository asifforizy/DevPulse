import app from "./app";
import { initDB } from "./db";


const main = async () => {
    await initDB();
    app.listen(process.env.PORT, () => {

        
        console.log(`Server is running on port ${process.env.PORT}`);
    });
}


main();