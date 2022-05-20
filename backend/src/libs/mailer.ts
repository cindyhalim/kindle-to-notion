import nodemailer from "nodemailer";
import { config } from "src/environment";

const transporter = nodemailer.createTransport({
  service: "gmail",
  secure: true,
  auth: { user: config.mailerEmail, pass: config.mailerPassword },
});

const send = async ({
  fromEmail,
  toEmail,
  fileName,
  file,
}: {
  fromEmail: string;
  toEmail: string;
  fileName: string;
  file: Buffer;
}) => {
  return await transporter.sendMail({
    from: fromEmail,
    to: toEmail,
    attachments: [
      {
        filename: fileName,
        content: file,
        contentType: "application/epub+zip",
      },
    ],
  });
};

export const mailer = { send };
