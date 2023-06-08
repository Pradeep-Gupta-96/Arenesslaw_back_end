import emailInfo from "../mailinfo/mail_info.js";
import Emailscript from '../models/emailscript.js'
import pdf from 'html-pdf'



export const postemailscriptedata = async (req, res) => {
    try {
        const { Subject, SubjectContent, CustomerName, ContentInner, ContentFooter, username, role } = req.body
        const userId = req.userId
        const userexist = await Emailscript.findOne({ username })
        if (!userexist) {
            const emailscript = new Emailscript({
                Subject,
                SubjectContent,
                CustomerName,
                ContentInner,
                ContentFooter,
                username,
                role,
                userId,
            });
            await emailscript.save();
            return res.status(200).json(emailscript);
        }
        return res.status(400).json({ message: "this user is already script created" });

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
};

export const getMailScript = async (req, res) => {
    try {
        const { username } = req.query;
        const script = await Emailscript.findOne({ username });

        if (!script) {
            return res.status(404).json({ message: "Script not found" });
        }

        return res.status(200).send(script);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error in script" });
    }
};

export const getmailscriptdatabyid = async (req, res) => {
    try {
        const { id } = req.params
        const userexist = await Emailscript.findById(id)
        if (!userexist) {
            return res.status(404).json({ message: "did't get any script" })
        }
        return res.status(200).json(userexist)
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
}

export const editemailscriptedata = async (req, res) => {
    try {
        const id = req.params.id
        const userexist = await Emailscript.findByIdAndUpdate(id, req.body, {
            new: true
        })
        if (!userexist) {
            return res.status(404).json({ message: "did't get any script" })
        }
        return res.status(200).json(userexist)
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
};


export const pdfview = async (req, res) => {
  try {
    const { id } = req.params;
    const userexist = await Emailscript.findById(id);
    if (!userexist) {
      return res.status(404).json({ message: "Didn't get any PDF" });
    }
     const value={
        Subject:userexist.Subject,
        SubjectContent:userexist.SubjectContent,
        CustomerName:userexist.CustomerName,
        ContentInner:userexist.ContentInner,
        ContentFooter:userexist.ContentFooter,
     }
    const emailHtml = emailInfo(value);
    const options = { format: "A4" };

    const generatePDF = (html, opts) => {
      return new Promise((resolve, reject) => {
        pdf.create(html, opts).toBuffer((error, buffer) => {
          if (error) {
            console.log(error);
            reject('Error generating PDF');
          }
          resolve(buffer);
        });
      });
    };

    const pdfBuffer = await generatePDF(emailHtml, options);

    res.setHeader('Content-Type', 'application/pdf');
    return res.status(200).send(pdfBuffer);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

export const deletescript = async (req, res) => {
    try {
        const { id } = req.params
        const userexist = await Emailscript.findByIdAndDelete(id, { new: true })
        if (userexist) return res.status(202).json({ message: "succcess" })
        return res.status(404).json({ message: "user not found" })
    } catch (error) {
        console.error(error)
        res.status(500).json({ message: "Server error" })
    }
}
