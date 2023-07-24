import { createTransport } from 'nodemailer';
import Excel from '../models/excel.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { generateShortLink } from './urlController.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const transport = createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: 'Mrlucifer9651@gmail.com',
    pass: process.env.PASS
  }
});

export const sendEmail = async (req, res) => {
  try {
    const id = req.params.id;
    const { username } = req.body;
    const excelData = await Excel.findByIdAndUpdate(id, req.body, {
      new: true
    });

    const mailPromises = excelData.xlData.map(async (data) => {
      const pdfUrl = `http://localhost:4000/excel/pdf/${id}/${data._id}`;
      const candidatename = data.FPR_NAME

      const shortLink = await generateShortLink(pdfUrl);
      const ShortUrl = `http://localhost:4000/url/${shortLink}`
      const html = generateEmailHtml(username, ShortUrl, candidatename);

      const mailOptions = {
        from: 'Mrlucifer9651@gmail.com',
        to: data.E_mail,
        subject: 'Friendly Reminder: Outstanding Payment Due',
        text: 'Node.js testing mail for Areness',
        html: html,
        attachments: [
          {
            filename: 'Notice.pdf',
            content: data.pdfBuffer,
          },
        ],
      };
      await transport.sendMail(mailOptions);
    });

    await Promise.all(mailPromises);

    return res.status(200).json({ message: "Saved" });
  } catch (error) {
    console.error(error); // Log the error
    res.status(500).json({ message: "Internal Server Error" });
  }
};



const generateEmailHtml = (username, ShortUrl, candidatename) => {
  const templateFilePath = path.join(__dirname, '..', 'htmlscript', `${username}.html`);
  const htmlTemplate = fs.readFileSync(templateFilePath, 'utf8');
  let html = htmlTemplate.replace('{{shortLink}}', `<a href="${ShortUrl}">${ShortUrl}</a>`);
  html = html.replace('[FPR_NAME]', candidatename);
  // html = htmlTemplate.replace('[Amount]', amount);
  // html = htmlTemplate.replace('[Provide details of the products or services provided]', productDetails);
  // html = htmlTemplate.replace('[Contact Information]', contactInfo);
  return html;
};


/// this is for sms sending

export const sendSMS = async (req, res) => {
  try {

    // 
    const { username, password, type, dlr, destination, source, message } = req.query;
    console.log(req.query)

    // Send SMS request
    // Bulk Http Link : 
    // http://sms6.rmlconnect.net:8080/bulksms/bulksms?username=xxxxxxxx&password=xxxxxx&type=0&dlr=1&destination=xxxxxxxxxx&source=Demo&message=Demo%20Message
    // const response = await axios.get('http://sms6.rmlconnect.net:8080/bulksms/bulksms', {
    //   params: {
    //     username,
    //     password,
    //     type,
    //     dlr,
    //     destination,
    //     source,
    //     message,
    //   },
    // });
    // res.status(200).json({ success: true, message: 'SMS sent successfully' });

  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'An error occurred while sending SMS' });
  }
}
