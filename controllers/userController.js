import jwt from "jsonwebtoken"
import User from "../models/users.js"
import bcrypt from 'bcrypt'

import nodemailer from "nodemailer"

// User signup function
export const signup = async (req, res) => {
    try {
      const { username, email, role, password } = req.body;
      
      // Check for missing input fields
      if (!username || !email || !role || !password) {
        return res.status(400).json({ success: false, message: "Please fill in all details." });
      }
      
      // Check if user already exists
      const existingUser = await User.findOne({ email: email });
      if (existingUser) {
        return res.status(400).json({ success: false, message: "User already registered." });
      }
      
      // Hash the password
      const hashpassword = await bcrypt.hash(password, 10);
      
      // Create a new user
      const newUser = new User({
        username: username,
        email: email,
        role: role,
        password: hashpassword
      });
      await newUser.save();
      
      // Generate and send JWT token
      const token = jwt.sign({ user: newUser.email, id: newUser._id }, process.env.SECRET_KEY);
      return res.status(200).json({ success: true, user: newUser, token: token });
    } catch (error) {
      console.error("Error in signup:", error);
      res.status(500).json({ success: false, message: error.message });
    }
  };
  

  // User signin function
  export const signin = async (req, res) => {
    try {
      const { email, password } = req.body;

      // Check for missing credentials
      if (!email || !password) {
        return res.status(400).json({ success: false, message: "Please provide both email and password." });
      }
  
      // Find the user
      const user = await User.findOne({ email: email });
      if (!user) {
        return res.status(400).json({ success: false, message: "Invalid credentials." });
      }
  
      // Compare passwords
      const matchPassword = await bcrypt.compare(password, user.password);
      if (!matchPassword) {
        return res.status(400).json({ success: false, message: "Invalid credentials." });
      }
  
      // Generate and send JWT token
      const token = jwt.sign({ user: user.email, id: user._id }, process.env.SECRET_KEY);
      return res.status(200).json({ success: true, user: user, token: token });
    } catch (error) {
      console.error("Error in signin:", error);
      res.status(500).json({ success: false, message: "An error occurred while signing in." });
    }
  };
  

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



export const userdetails = async (req, res) => {
    try {
      const id = req.params.id
      const data = await User.findById(id)
      return res.status(200).json({ message:data });
    } catch (error) {
      res.status(500).json({ msg: error.message })
    }
  }
  
  
  
  
