import Emailtemp from "../models/emailtemp.js"
import emailTemplatee from "../Templates/email.template.js";


export const postemailtempdata = async (req, res) => {
    try {
        const userexist = await Emailtemp.find()
        if (!userexist) {
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
                ContentFooter,
                role } = req.body;
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
           return res.status(200).json(emailtemp);
        }
        return res.status(404).json({message:"ALREADY SAVE"});
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
};

export const getemailtempdata = async (req, res) => {
    try {
        const Data = await Emailtemp.find()
        Data.map((item) => {
            const value = {
                title: item.title,
                subtitle: item.subtitle,
                noticeid: item.noticeid,
                noticeidEg: item.noticeidEg,
                noticedate: item.noticedate,
                noticedateEg: item.noticedateEg,
                to: item.to,
                address: item.address,
                subject: item.subject,
                subjecttitle: item.subjecttitle,
                ContentInner: item.ContentInner,
                ContentFooter: item.ContentFooter,
                role: item.role,
                userId: item.userId,
                imagePath: item.imagePath
            }
            const emailHtml = emailTemplatee(value);
            return res.status(200).send(emailHtml)
        })
    } catch (error) {
        res.status(500).json({ msg: error.message })
    }
}

export const getmailtempdataforupdate = async (req, res) => {
    try {
        const data = await Emailtemp.find()
        return res.status(200).send(data)
    } catch (error) {
        res.status(500).json({ msg: error.message })
    }
}

export const getmailtempbyid = async (req, res) => {
    try {
        const id = req.params.id
        const data = await Emailtemp.findById(id)
        return res.status(200).send(data)
    } catch (error) {
        res.status(500).json({ msg: error.message })
    }
}

export const updatemailtempdata = async (req, res) => {
    try {
        const id = req.params.id
        const item = await Emailtemp.findByIdAndUpdate(id, req.body, {
            new: true
        })
        return res.status(200).send(item)
    } catch (error) {
         res.status(500).json({ msg: error.message })
    }
}