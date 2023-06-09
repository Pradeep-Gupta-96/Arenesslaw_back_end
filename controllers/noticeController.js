import { createTransport } from 'nodemailer';
import Excel from '../models/excel.js';
import { BitlyClient } from 'bitly';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const transport = createTransport({
  host: 'smtp.ethereal.email',
  port: 587,
  auth: {
      user: 'hazle.deckow51@ethereal.email',
      pass: 'Wy3qBXmjrQvPSwFYqP'
  }
});

export const sendEmail = async (req, res) => {
  try {
    const id = req.params.id;
    const { username } = req.body;
    const excelData = await Excel.findByIdAndUpdate(id, req.body, {
      new: true
    });

    const accessToken = 'ebae410e55a245607c620b6de56f10226dd3c8fa';
    const bitly = new BitlyClient(accessToken);

    const mailPromises = excelData.xlData.map(async (data) => {
      const pdfUrl = `http://localhost:4000/excel/pdf/${id}/${data._id}`;
      const shortLink = await generateShortLink(bitly, pdfUrl);
      const html = generateEmailHtml(username, shortLink);

      const mailOptions = {
        from: 'hazle.deckow51@ethereal.email',
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

const generateShortLink = async (bitly, longUrl) => {
  try {
    const response = await bitly.shorten(longUrl);
    return response.url;
  } catch (error) {
    return longUrl;
  }
};

const generateEmailHtml = (username, shortLink) => {
  const templateFilePath = path.join(__dirname, '..', 'htmlscript', `${username}.html`);
  const htmlTemplate = fs.readFileSync(templateFilePath, 'utf8');


  
  const html = htmlTemplate.replace('{{shortLink}}',`<a href="${shortLink}">click here for pdf link</a>`);
  return html;
};






//incorporates SendGrid for email sending, Twilio for SMS messaging,
// and WhatsApp Business API for sending WhatsApp messages. It also includes functionality to receive SMS and WhatsApp messages
/**
import { createTransport } from 'nodemailer';
import Excel from '../models/excel.js';
import emailInfo from '../mailinfo/mail_info.js';
import { TwilioClient } from 'twilio'; // Twilio library for SMS
import { WhatsAppClient } from 'whatsapp'; // WhatsApp library for sending/receiving messages
import { Client as SendGridClient } from '@sendgrid/mail'; // SendGrid library for email

export const sendEmail = async (req, res) => {
  try {
    const id = req.params.id;
    const excelData = await Excel.findByIdAndUpdate(id, req.body, { new: true });

    const sendGridApiKey = 'your_sendgrid_api_key'; // Placeholder for SendGrid API key
    const sendGridClient = new SendGridClient();
    sendGridClient.setApiKey(sendGridApiKey);

    const twilioAccountSid = 'your_twilio_account_sid'; // Placeholder for Twilio credentials
    const twilioAuthToken = 'your_twilio_auth_token';
    const twilioClient = new TwilioClient(twilioAccountSid, twilioAuthToken);

    const whatsappApiKey = 'your_whatsapp_api_key'; // Placeholder for WhatsApp credentials
    const whatsappClient = new WhatsAppClient(whatsappApiKey);

    const mailPromises = excelData.xlData.map(async (data) => {
      const pdfUrl = `http://localhost:4000/excel/pdf/${id}/${data._id}`;

      // Send email via SendGrid
      const mailOptions = {
        from: 'example@example.com',
        to: data.E_mail,
        subject: 'Friendly Reminder: Outstanding Payment Due',
        text: 'Node.js testing mail for Areness',
        html: emailInfo(pdfUrl),
        attachments: [
          {
            filename: 'Notice.pdf',
            content: data.pdfBuffer,
          },
        ],
      };
      await sendGridClient.send(mailOptions);

      // Send SMS via Twilio
      const smsMessage = `Friendly Reminder: Outstanding Payment Due. Link: ${pdfUrl}`;
      await twilioClient.messages.create({
        body: smsMessage,
        from: 'your_twilio_phone_number',
        to: data.PhoneNumber,
      });

      // Send WhatsApp message
      const whatsappMessage = `Friendly Reminder: Outstanding Payment Due. Link: ${pdfUrl}`;
      await whatsappClient.messages.create({
        body: whatsappMessage,
        from: 'your_whatsapp_phone_number',
        to: data.WhatsAppNumber,
      });
    });

    await Promise.all(mailPromises);

    return res.status(200).json({ message: 'Saved' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

// Twilio webhook for receiving SMS
export const receiveSMS = async (req, res) => {
  try {
    const { body, from } = req.body;
    // Process received SMS

    return res.status(200).send();
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

// WhatsApp webhook for receiving messages
export const receiveWhatsAppMessage = async (req, res) => {
  try {
    const { body, from } = req.body;
    // Process received WhatsApp message

    return res.status(200).send();
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};
 */