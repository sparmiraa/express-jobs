import nodemailer from "nodemailer";

export const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: "miroslavkosiuk@gmail.com",
    pass: "nidm tleg octk isny",
  },
});
