import dotenv from "dotenv"
dotenv.config()
import { Server } from "http";
import mongoose from 'mongoose'
import app from "./app";
let server:Server
const port = process.env.PORT || 5000;
async function main() {
    try {
        await mongoose.connect(process.env.MONGODB_URI as string);
        console.log("Connected to mongoose")
        server = app.listen(port, ()=>{
            console.log(`Library Management App is listening on port ${port}`)
        })
    } catch (error) {
        console.log(error)
    }
}

main()