import Emailtemp from "../models/emailtemp.js"
import emailTemplatee from "../Templates/email.template.js";
import pdf from 'html-pdf'
import fs from 'fs'
import { error } from "console";


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
            ContentFooter,
            username,
            role } = req.body;
        const userId = req.userId
        const imagePath = req.file ? `/${req.file.path}` : null;
        console.log(imagePath)

        const userexist = await Emailtemp.findOne({ username })
        if (!userexist) {
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
                username,
                role,
                userId,
                imagePath
            });
            await emailtemp.save();
            return res.status(200).json(emailtemp);
        }
        return res.status(400).json({ message: "this user is already temp created" });

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
        const { username } = req.query
        const userexist = await Emailtemp.findOne({ username })
        if (!userexist) {
            return res.status(404).json({ message: "temp data is not found" })
        }
        return res.status(200).send(userexist)
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


export const viewpdf = async (req, res) => {
    try {
        const { id } = req.params
        const userexist = await Emailtemp.findById(id)
        if (!userexist) {
            return res.status(404).json({ message: "Didn't get any PDF" })
        }
        const value = {
            title: userexist.title,
            subtitle: userexist.subtitle,
            noticeid: userexist.noticeid,
            noticeidEg: userexist.noticeidEg,
            noticedate: userexist.noticedate,
            noticedateEg: userexist.noticedateEg,
            to: userexist.to,
            address: userexist.address,
            subject: userexist.subject,
            subjecttitle: userexist.subjecttitle,
            ContentInner: userexist.ContentInner,
            ContentFooter: userexist.ContentFooter,
            role: userexist.role,
            userId: userexist.userId,
            imagePath: userexist.imagePath
        };
        const emailHtml = emailTemplatee(value)
        const options = {
            format: 'A4'
        }
        const generatePDF = (html, opts) => {
            return new Promise((resolve, reject) => {
                pdf.create(html, opts).toBuffer((error, buffer) => {
                    if (error) {
                        console.log(error)
                        reject('Error generating PDF')
                    }
                    resolve(buffer)
                })
            })
        }
        const pdfBuffer = await generatePDF(emailHtml, options)
        res.setHeader('Content-Type', 'application/pdf')
        res.status(200).send(pdfBuffer)

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
}

export const delettemp = async (req, res) => {
    try {
        const { id } = req.params
        const userexist = await Emailtemp.findByIdAndDelete(id, { new: true })
        if (userexist) return res.status(202).json({ message: "succcess" })
        return res.status(404).json({ message: "user not found" })
    } catch (error) {
        console.error(error)
        res.status(500).json({ message: "Server error" })
    }
}