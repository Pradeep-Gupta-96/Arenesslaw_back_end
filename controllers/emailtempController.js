import Emailtemp from "../models/emailtemp.js"
import emailTemplatee from "../Templates/email.template.js";
import pdf from 'html-pdf'
import fs from 'fs'
import path from 'path'

const createNewHTMLFile = async (htmlContent, folderPath, filename) => {
    const filepath = path.join(folderPath, filename);
    try {
      await fs.promises.writeFile(filepath, htmlContent);
      console.log('HTML file created successfully:', filepath);
    } catch (error) {
      console.error('Error creating HTML file:', error);
    }
  };
  
  export const postEmailTempData = async (req, res) => {
    try {
      const {
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
      } = req.body;
      const userId = req.userId;
      const imagePath = req.file ? `/${req.file.path}` : null;
      console.log(imagePath);
  
      const userExist = await Emailtemp.findOne({ username });
      if (userExist) {
        return res.status(400).json({ message: "This user is already a temp created" });
      }
  
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
        imagePath,
      });
  
      await emailtemp.save();
  
      const emailHtml = emailTemplatee(emailtemp);
      const filepath = "./htmltemplates";
      const filename = `${username}.html`;
      await createNewHTMLFile(emailHtml, filepath, filename);
  
      return res.status(200).json(emailtemp);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server error" });
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

const updateHTMLFile = async (htmlContent, folderPath, filename) => {
    const filepath = path.join(folderPath, filename);
    try {
      await fs.promises.writeFile(filepath, htmlContent);
      console.log('HTML file updated successfully:', filepath);
    } catch (error) {
      console.error('Error updating HTML file:', error);
    }
  };
  
  export const updateMailTempData = async (req, res) => {
    try {
      const id = req.params.id;
      const updatedData = req.body;
      const item = await Emailtemp.findByIdAndUpdate(id, updatedData, {
        new: true
      });
  
      const emailHtml = emailTemplatee(item);
      const filepath = "./htmltemplates";
      const filename = `${item.username}.html`;
      await updateHTMLFile(emailHtml, filepath, filename);
  
      return res.status(200).json(item);
    } catch (error) {
      res.status(500).json({ msg: error.message });
    }
  };
  

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