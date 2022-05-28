import nodemailer from "nodemailer";
import { config } from "src/environment";
import { Readable } from "stream";

const transporter = nodemailer.createTransport({
  service: "Gmail",
  secure: true,
  auth: { user: config.mailerEmail, pass: config.mailerPassword },
});

const send = async ({
  toEmail,
  fileName,
  file,
}: {
  toEmail: string;
  fileName: string;
  file: Buffer | Readable;
}) => {
  const contentType = "application/epub+zip";

  return await transporter.sendMail({
    from: {
      name: "KindleNotion Support",
      address: config.mailerEmail,
    },
    to: toEmail,
    subject: "send to kindle",
    attachments: [
      {
        filename: fileName,
        content: file,
        contentType,
      },
    ],
    // this is required otherwise amazon rejects
    // email due to no attachments found
    alternatives: [{ contentType }],
  });
};

export const mailer = { send };
