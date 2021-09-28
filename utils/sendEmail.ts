import { ConfigService } from '@nestjs/config';
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(`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`);

const sendEmail = (receiver, source, subject, content) => {
  try {
    const data = {
      to: receiver,
      from: source,
      subject,
      html: content,
    };
    return sgMail.send(data);
  } catch (error) {
    console.log(error);
    return new Error(error);
  }
};
export default sendEmail;

