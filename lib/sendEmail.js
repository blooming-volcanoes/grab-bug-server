const nodeMailer = require('nodemailer');

const sendEmail = async (options) => {
    const transporter = nodeMailer.createTransport({
        service: 'Yandex',
        auth: {
            user: 'reabgasa@yandex.com',
            pass: 'zeyufjortueahqds',
        },
    });

    console.log(options, 'op');

    const mailOptions = {
        from: 'reabgasa@yandex.com',
        to: options.email,
        subject: options.subject,
        text: options.message,
    };

    await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;
