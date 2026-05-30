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
const isProduction = process.env.NODE_ENV === "production"

const allowedOrigins = [
  process.env.CLIENT_URL,
  ...(process.env.CLIENT_URLS || "")
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean),
  "https://talentlens-ai-app.onrender.com"
].filter(Boolean)

const isAllowedOrigin = (origin) => {
    if (!origin) return true

    if (allowedOrigins.includes(origin)) return true

    try {
    const { hostname, protocol } = new URL(origin)

    if (hostname === "localhost" || hostname === "127.0.0.1") {
      return true
    }

    if (protocol !== "https:") {
      return false
    }

    return hostname.endsWith(".onrender.com") || hostname.endsWith(".vercel.app")
    } catch {
        return false
    }
}

if (isProduction) {
  app.set("trust proxy", 1)
}

app.use(cors({
  origin: (origin, callback) => {
    if (isAllowedOrigin(origin)) {
      callback(null, true)
      return
    }

    callback(new Error(`CORS blocked for origin: ${origin}`))
  },
  credentials: true,
  optionsSuccessStatus: 200
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
