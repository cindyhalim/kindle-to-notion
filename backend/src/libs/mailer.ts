import nodemailer from "nodemailer";
import { config } from "src/environment";
import { Readable } from "stream";

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    type: "OAuth2",
    // setup using this article as reference: https://www.freecodecamp.org/news/use-nodemailer-to-send-emails-from-your-node-js-server/
    user: config.mailerUsername,
    clientId: config.mailerClientId,
    clientSecret: config.mailerClientSecret,
    refreshToken: config.mailerRefreshToken,
  },
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
      name: "NotionKindle Support",
      address: config.mailerUsername,
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
