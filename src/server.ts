import { app } from "./app";
import envConfig from "./config/envConfig";

// The server script has, as its single responsibilty, the function of uploading the server

const PORT = envConfig.appPORT

app.listen(PORT, () => {
    console.log(`Server Running on Port ${PORT} 🚀`)
})