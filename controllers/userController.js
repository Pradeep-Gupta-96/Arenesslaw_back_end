import jwt from "jsonwebtoken"
import User from "../models/users.js"
import bcrypt from 'bcrypt'

export const signup = async (req, res) => {
    try {
        const { username, email, role, password } = req.body
        if (!username || !email || !role || !password) {
            return res.status(404).json({ message: "please fill all details" })
        } else {
            const userexit = await User.findOne({ email: email })
            if (userexit) {
                return res.status(400).json({ message: "user already registerd" })
            } else {
                const hashpassword = await bcrypt.hash(password, 10)
                const user = new User({
                    username: username,
                    email: email,
                    role: role,
                    password: hashpassword
                })
                await user.save()
                const Tokens = jwt.sign({ user: user.email, id: user._id }, process.env.SECRET_KEY)
                return res.status(200).json({ users: user, Token: Tokens })
            }
        }
    } catch (error) {
        res.status(500).json({ message: error })
    }
}

export const signin = async (req, res) => {
    try {
        const { email, password } = req.body
        if (!email || !password) {
            return res.status(404).json("please fill all details")
        } else {
            const userexit = await User.findOne({ email: email })
            if (!userexit) {
                return res.status(400).json("invalid")
            } else {
                const matchpassword = await bcrypt.compare(password, userexit.password)
                if (!matchpassword) {
                    return res.status(400).json({ message: "invalid" })
                } else {
                    const Tokens = jwt.sign({ user: userexit.email, id: userexit._id }, process.env.SECRET_KEY)
                    return res.status(200).json({ user: userexit, Token: Tokens })
                }
            }
        }
    } catch (error) {
        res.status(500).json({ message: error })
    }
}

export const resetpass = async (req, res) => {
    try {
        const id = req.params.id
        const { Epassword, Cpassword } = req.body
        if (!Epassword || !Cpassword) {
            return res.status(404).json({ message: "empaty" })
        }
        const userexit = await User.findById(id)
        if (!userexit) {
            return res.status(400).json("user not found")
        } else {
            const matchpassword = await bcrypt.compare(Epassword, userexit.password)
            if (!matchpassword) {
                return res.status(400).json({ message: "invalid credential" })
            } else {
                const hashpassword = await bcrypt.hash(Cpassword, 10)
                const item = await User.findByIdAndUpdate(id, { password: hashpassword }, { new: true })
                if (item) return res.status(200).json({ Message: "Done" })
                return res.status(404).json({ message: "NOT FOUND" })
            }
        }
    } catch (error) {
        res.status(500).json({ Message: error })
    }
}
