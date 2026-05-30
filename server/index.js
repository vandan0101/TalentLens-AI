import express from "express"
import dotenv from "dotenv"
import connectDb from "./config/connectDb.js"
import cookieParser from "cookie-parser"
dotenv.config()
import cors from "cors"
import authRouter from "./routes/auth.route.js"
import userRouter from "./routes/user.route.js"
import interviewRouter from "./routes/interview.route.js"
import paymentRouter from "./routes/payment.route.js"

const app = express()
const clientUrl = process.env.CLIENT_URL
const isAllowedDevOrigin = (origin) => {
    if (!origin) return true
    try {
        const { hostname } = new URL(origin)
        return hostname === "localhost" || hostname === "127.0.0.1"
    } catch {
        return false
    }
}

app.use(cors({
  origin: [
    "http://localhost:5173",
    "https://talentlens-ai-app.onrender.com"
  ],
  credentials: true
}))
app.use(express.json())
app.use(cookieParser())

app.use("/api/auth" , authRouter)
app.use("/api/user", userRouter)
app.use("/api/interview" , interviewRouter)
app.use("/api/payment" , paymentRouter)

const PORT = process.env.PORT || 6000
app.listen(PORT , ()=>{
    console.log(`Server running on port ${PORT}`)
    connectDb()
})
