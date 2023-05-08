import Emailtemp from "../models/emailtemp.js"
import emailTemplatee from "../Templates/email.template.js";


export const postemailtempdata = async (req, res) => {
    try {
        const { title,
            subtitle,
            noticeid,
            noticeidEg,
            noticedate,
            noticedateEg,
            to,
            address,
            subject,
            subjecttitle,
            ContentInner,
            ContentFooter, role } = req.body;
        const userId = req.userId
        const imagePath = req.file ? `/${req.file.path}` : null;
        const emailtemp = new Emailtemp({
            title,
            subtitle,
            noticeid,
            noticeidEg,
            noticedate,
            noticedateEg,
            to,
            address,
            subject,
            subjecttitle,
            ContentInner,
            ContentFooter,
            role,
            userId,
            imagePath
        });
        await emailtemp.save();
        res.json(emailtemp);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
};


export const getemailtempdata = async (req, res) => {
    try {
        const Data = await Emailtemp.find()
        const emailHtml = emailTemplatee(Data);
        return res.status(200).send(emailHtml)
    } catch (error) {
        res.status(500).json({ msg: error.message })
    }
}