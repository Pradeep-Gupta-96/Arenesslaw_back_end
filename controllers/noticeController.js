import { createTransport } from 'nodemailer';
import Excel from '../models/excel.js';

export const sendemail = async (req, res) => {
    try {
        const id = req.params.id;
        const excelData = await Excel.findByIdAndUpdate(id, req.body, {
            new: true
        });

        const transport = createTransport({
            host: 'smtp.ethereal.email',
            port: 587,
            auth: {
                user: 'isadore.wiegand@ethereal.email',
                pass: '3rjNKmrwDPXYtsN2AJ',
            },
        });

        const mailPromises = excelData.xlData.map(async (data) => {
            const pdfUrl = `http://localhost:4000/excel/pdf/${id}/${data._id}`

            const mailOptions = {
                from: 'isadore.wiegand@ethereal.email',
                to: data.E_mail,
                subject: 'Notice Letter',
                text: 'Node.js testing mail for awareness',
                html: `<p>Click <a href="${pdfUrl}">here</a> to download the PDF file.</p>`,
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
        res.status(500).json({ message: error });
    }
};
