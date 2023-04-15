import fs from 'fs'
import { createTransport } from 'nodemailer'
import Excel from '../models/excel.js'

export const savehtml = async (req, res) => {
    try {
        const { html } = req.body
        fs.writeFileSync("output.html", html)
        return res.status(200).json({ message: "Saved" })
    } catch (error) {
        res.status(500).json({ message: error })
    }
}

export const sendemail = async (req, res) => {
    try {
        const id = (req.params.id)
        await Excel.findByIdAndUpdate(id, req.body, {
            new: true
        })
        // const transport = createTransport({
        //     host: 'smtp.ethereal.email',
        //     port: 587,
        //     auth: {
        //         user: 'abbigail14@ethereal.email',
        //         pass: 'ujaWxheawN9rJdgv2R'
        //     }
        // });

        // await transport.sendMail({
        //     from: 'abbigail14@ethereal.email',
        //     to: 'Pradeep@gmail.com',
        //     subject: 'Notice Latter',
        //     text: 'node js testing mail for areness',
        //     attachments: [
        //         {
        //             // path: res.filename
        //         }
        //     ]
        // });

        return res.status(200).json({ message: "Saved" })
    } catch (error) {
        res.status(500).json({ message: error })
    }
}