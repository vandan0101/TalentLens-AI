import genToken from "../config/token.js"
import User from "../models/user.model.js"

const isProduction = process.env.NODE_ENV === "production"

const getCookieOptions = () => ({
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? "none" : "lax",
    path: "/",
    maxAge: 7 * 24 * 60 * 60 * 1000
})

const getClearCookieOptions = () => ({
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? "none" : "lax",
    path: "/"
})


export const googleAuth = async (req,res) => {
    try {
        const {name , email} = req.body
        let user = await User.findOne({email})
        if(!user){
            user = await User.create({
                name , 
                email
            })
        }
        let token = await genToken(user._id)
        res.cookie("token" , token , getCookieOptions())

        return res.status(200).json(user)



    } catch (error) {
        return res.status(500).json({message:`Google auth error ${error}`})
    }
    
}

export const logOut = async (req,res) => {
    try {
        res.clearCookie("token", getClearCookieOptions())
        return res.status(200).json({message:"LogOut Successfully"})
    } catch (error) {
         return res.status(500).json({message:`Logout error ${error}`})
    }
    
}
