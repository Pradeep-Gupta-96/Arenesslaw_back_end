
const emailInfo = (data) => {
    return`
    <div>
        <p>Dear [Client's Name],</p>

        <p>I hope this email finds you well. I wanted to bring to your attention that there is an outstanding balance on your account for the invoice(s) dated [Invoice Date(s)].</p>

        <p>According to our records, the total amount due is [Total Amount Due]. We kindly request that you settle this payment as soon as possible to ensure the smooth continuation of our business relationship.</p>

        <p>We understand that oversight can happen, so we wanted to send this friendly reminder to ensure that nothing has been overlooked. Your timely attention to this matter would be greatly appreciated.</p>

        <p>To facilitate the payment process, I have attached a pdf <a style="color: blue" href="${data}">Areness Attorneys</a> to this email for your reference. You can make the payment through the following methods:</p>

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
       </div>`
};

export default emailInfo;
