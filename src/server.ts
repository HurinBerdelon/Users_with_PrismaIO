import { app } from "./app";

// The server script has, as its single responsibilty, the function of uploading the server

const PORT = 3030

app.listen(PORT, () => {
    console.log(`Server Running on Port ${PORT} 🚀`)
})