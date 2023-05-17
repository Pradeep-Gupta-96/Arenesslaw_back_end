import { createTransport } from 'nodemailer';
import Excel from '../models/excel.js';
import { BitlyClient } from 'bitly';

export const sendEmail = async (req, res) => {
  try {
    const id = req.params.id;
    const excelData = await Excel.findByIdAndUpdate(id, req.body, {
      new: true
    });


    const transport = createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      auth: {
        user: 'aryanna.konopelski37@ethereal.email',
        pass: 'vAxrV41SGuWc8JCSf8'
      }
    });


    // Initialize Bit.ly client
    const accessToken = 'ebae410e55a245607c620b6de56f10226dd3c8fa';
    const bitly = new BitlyClient(accessToken);

    const mailPromises = excelData.xlData.map(async (data) => {
      const pdfUrl = `http://localhost:4000/excel/pdf/${id}/${data._id}`


      // Generate short link
      const shortLink = await generateShortLink(bitly, pdfUrl)
      const mailOptions = {
        from: 'aryanna.konopelski37@ethereal.email',
        to: data.E_mail,
        subject: 'Friendly Reminder: Outstanding Payment Due',
        text: 'Node.js testing mail for Areness',
        html: `<div>
        <p>Dear [Client's Name],</p>

        <p>I hope this email finds you well. I wanted to bring to your attention that there is an outstanding balance on your account for the invoice(s) dated [Invoice Date(s)].</p>

        <p>According to our records, the total amount due is [Total Amount Due]. We kindly request that you settle this payment as soon as possible to ensure the smooth continuation of our business relationship.</p>

        <p>We understand that oversight can happen, so we wanted to send this friendly reminder to ensure that nothing has been overlooked. Your timely attention to this matter would be greatly appreciated.</p>

        <p>To facilitate the payment process, I have attached a pdf <a href="${shortLink}">Areness Attorneys</a> to this email for your reference. You can make the payment through the following methods:</p>

        <p>Option 1: [Payment Method 1]</p>
        <p>Option 2: [Payment Method 2]</p>
        <p>Option 3: [Payment Method 3]</p>
        <p>If you have any questions or need further clarification regarding the invoice or the payment process, please don't hesitate to reach out to me. I'm here to assist you and find a solution that works for both parties.</p>

        <p>Thank you for your attention to this matter. We value your business and look forward to your prompt payment.</p>

        <p>Best regards,</p>

        <p>[Your Name]</p>
        <p>[Your Position]</p>
        <p>[Your Company Name]</p>
        <p>[Your Contact Information] </p>
       </div>`,
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
    return response.data.url;
  } catch (error) {
    return longUrl;
  }
};
