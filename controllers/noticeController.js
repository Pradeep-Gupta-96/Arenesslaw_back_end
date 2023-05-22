import { createTransport } from 'nodemailer';
import Excel from '../models/excel.js';
import emailInfo from '../mailinfo/mail_info.js';
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
        user: 'kayleigh.schmidt65@ethereal.email',
        pass: '1DgvW5SNAbrkXfQu9A'
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
        from: 'kayleigh.schmidt65@ethereal.email',
        to: data.E_mail,
        subject: 'Friendly Reminder: Outstanding Payment Due',
        text: 'Node.js testing mail for Areness',
        html: emailInfo(shortLink),
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




// same code with sendgrid
// import nodemailer from 'nodemailer';
// import Excel from '../models/excel.js';
// import { BitlyClient } from 'bitly';
// import sgMail from '@sendgrid/mail';

// export const sendEmail = async (req, res) => {
//   try {
//     const id = req.params.id;
//     const excelData = await Excel.findByIdAndUpdate(id, req.body, {
//       new: true
//     });

//     sgMail.setApiKey('YOUR_SENDGRID_API_KEY');

//     // Initialize Bit.ly client
//     const accessToken = 'ebae410e55a245607c620b6de56f10226dd3c8fa';
//     const bitly = new BitlyClient(accessToken);

//     const mailPromises = excelData.xlData.map(async (data) => {
//       const pdfUrl = `http://localhost:4000/excel/pdf/${id}/${data._id}`;

//       // Generate short link
//       const shortLink = await generateShortLink(bitly, pdfUrl);

//       const msg = {
//         to: 'pradeepguptamern@gmail.com',
//         from: 'mrlucifer9651@gmail.com',
//         subject: 'Friendly Reminder: Outstanding Payment Due',
//         text: 'Node.js testing mail for Areness',
//         html: `
//           <div>
//             <!-- Your HTML email content goes here -->
//           </div>
//         `,
//         attachments: [
//           {
//             filename: 'Notice.pdf',
//             content: data.pdfBuffer,
//           },
//         ],
//       };

//       await sgMail.send(msg);
//     });

//     await Promise.all(mailPromises);

//     return res.status(200).json({ message: "Saved" });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: "Internal Server Error" });
//   }
// };

// const generateShortLink = async (bitly, longUrl) => {
//   try {
//     const response = await bitly.shorten(longUrl);
//     return response.data.url;
//   } catch (error) {
//     return longUrl;
//   }
// };
