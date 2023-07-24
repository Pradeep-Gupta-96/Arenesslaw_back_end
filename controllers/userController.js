import jwt from "jsonwebtoken"
import User from "../models/users.js"
import bcrypt from 'bcrypt'
import nodemailer from "nodemailer"

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

const generateOPT = () => {
    return Math.floor(100000 + Math.random() * 900000)
}

export const sendOPT = async (req, res) => {
    try {
        const { email } = req.body
        const userexist = await User.findOne({ email: email })
        if (!userexist) {
            return res.status(404).json({ message: "please enter your register email" })
        }
        // generate and save otp in database
        const OTP = generateOPT()
        userexist.otp = OTP
        userexist.otpexpiredAt = Date.now() + 300000;
        await userexist.save()

        const transporter = nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 587,
            secure: false,
            auth: {
                user: 'Mrlucifer9651@gmail.com',
                pass: process.env.PASS
            }
        });

        const HtmlContent = `
        <p>Hello ${userexist.username},</p>
          <p>Your OTP for password reset is: <b>${OTP}</b></p>
          <p>Please use this OTP within 05 minutes to reset your password.</p>
          <p>If you didn't request this OTP, please ignore this email.</p>
          <p>Best regards,<br/>Your Team</p>
          `

        async function main() {
            const info = await transporter.sendMail({
                from: 'Mrlucifer9651@gmail.com',
                to: email,
                subject: "Password Reset OTP",
                html: HtmlContent,
            });

            console.log("Message sent: %s", info.messageId);
        }

        main().catch(console.error);
        return res.status(404).json({ message: "email send successfully" })

    } catch (error) {
        res.status(500).json({ error: error, message: "An error accured on the server side" })
    }
}


export const verifyOPT = async (req, res) => {
    try {
        const { enteredOTP } = req.body;
        const userExist = await User.findOne({ otp: enteredOTP, otpexpiredAt: { $gt: Date.now() } });

        if (!userExist) {
            return res.status(400).json({ message: "Invalid or expired OTP" });
        }

        return res.status(200).json({ otp:enteredOTP, message: "Verified" });
    } catch (error) {
        res.status(500).json({ message: "An error occurred on the server side" });
    }
}


export const updatePassword = async (req, res) => {
    try {
        const { email,enteredOTP, Cpassword } = req.body;
        
        const userExist = await User.findOne({ email: email, otp: enteredOTP });

        if (!userExist) {
            return res.status(400).json({ message: "Invalid Email" });
        }
        const hashpassword = await bcrypt.hash(Cpassword, 10)

        userExist.password = hashpassword;
        await userExist.save();

        return res.status(200).json({ message: "Password update successful" });
    } catch (error) {
        res.status(500).json({ error: error, message: "An error occurred on the server side" });
    }
}

