const nodeMailer = require('nodemailer');
const sendEmail = async(options) => {
    const transporter = nodeMailer.createTransport({
        host: "smtp.gmail.com",
        port: 465,
        service: "gmail",
        auth: {
            user: "deepak.verma.cd.che20@itbhu.ac.in",
            pass: "Deepakv@1403"
        }
    });

    const mailOptions = {
        from: "deepak.verma.cd.che20@itbhu.ac.in",
        to: options.email,
        subject: options.subject,
        text: options.message
    }

    await transporter.sendMail(mailOptions);

}

module.exports = sendEmail;