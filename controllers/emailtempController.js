import Emailtemp from "../models/emailtemp.js"
import emailTemplatee from "../Templates/email.template.js";
import pdf from 'html-pdf'
import fs from 'fs'
import path from "path";


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
        return res.status(404).json({ message: "ALREADY SAVE" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
};

export const getemailtempdata = async (req, res) => {
    try {
        const Data = await Emailtemp.find();

        const pdfPromises = Data.map((item) => {
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
            };

            const emailHtml = emailTemplatee(value);

            // creating a sample template in html form
            const CreatenewHTMLfile = async (htmlContent, folderPath, filename) => {
                const filepath = path.join(folderPath, filename)
                await fs.writeFile(filepath, htmlContent, (err) => {
                    if (err) {
                        console.error('error creating html file', err)
                    } else {
                        console.log('HTML file created successfully', filepath)
                    }
                })
            }
            const filepath = "./htmltemplates"
            const filename = "template.html"
            CreatenewHTMLfile(emailHtml, filepath, filename)

            //creating sample pdf for demo
            const options = { format: "A4" };
            return new Promise((resolve, reject) => {
                pdf.create(emailHtml, options).toBuffer((error, buffer) => {
                    if (error) {
                        console.log(error);
                        reject('Error generating PDF');
                    }
                    resolve(buffer);
                });
            });
        });

        const buffers = await Promise.all(pdfPromises);
        const mergedBuffer = Buffer.concat(buffers);

        res.setHeader('Content-Type', 'application/pdf');
        return res.status(200).send(mergedBuffer);

    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
};


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
        return res.status(200).json(item)
    } catch (error) {
        res.status(500).json({ msg: error.message })
    }
}