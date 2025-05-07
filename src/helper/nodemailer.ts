import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { stringify } from 'querystring';

dotenv.config();

const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false, 
    auth: {
      user: process.env.GoogleEmail, 
      pass: process.env.GooglePassword, 
    },
  });

  const emailTemplatePath = path.resolve('src/template/welcome.html');
  const emailTemplate = fs.readFileSync(emailTemplatePath, "utf8");

  export const sendWelcomeMail = async(email:string, firstName:string) => {
    if(!firstName || !email){
      throw new Error("Invalid input: FirstName  , and email are required.");
    }
    const personalizedHTML = emailTemplate.replace("{{firstName}}", firstName);
    try {
      
      const info = await transporter.sendMail({
        from: `CourageGroup<${process.env.GoogleEmail}>`, 
        to: email,
        subject: "Your OTP  for CourageGroup",
        html: personalizedHTML,
      });
      return true;
    } catch (error) {
      console.error("Error sending email:", error);
    }
  }

  const verificationEmailPath = path.resolve('src/template/setpassword.html');
  const verificationEmail = fs.readFileSync(verificationEmailPath, "utf8")

  export const sendDeviceVerificationMail = async (email: string, firstName:string, link:string) => {
    if(!firstName || !email){
      throw new Error("Invalid input: FirstName , and email are required.");
    }
    const personalizedHTML = verificationEmail
    .replace("{{firstName}}", firstName)  // Replace firstName
    .replace("{{passwordResetLink}}", link);  // Replace password reset link

    try {
        const info = await transporter.sendMail({
            from: `CourageGroup<${process.env.GoogleEmail}>`,
            to: email,
            subject: "New Device Login Attempt - Routly",
            html: personalizedHTML,
        });

        console.log("Message sent: %s", info.messageId);
        return true;
    } catch (error) {
        console.error("Error sending email:", error);
        return false;
    }
};

// Read template once (as you did)
const absenteeEmailPath = path.resolve("src/template/absent.html");
const absentEmailTemplate = fs.readFileSync(absenteeEmailPath, "utf8");

export const sentAutoMatedMail = async (
  email: string,
  users: {
    fullName: string;
    email: string;
    position: string;
  }[],
  date: string
) => {
  try {
    // Format table rows
    const userRows = users.map((user, i) => `
      <tr>
        <td>${i + 1}</td>
        <td>${user.fullName}</td>
        <td>${user.email}</td>
        <td>${user.position}</td>
      </tr>
    `).join("");

    // Replace placeholders
    const emailHtml = absentEmailTemplate
      .replace("{{DATE}}", date)
      .replace("{{ABSENT_USERS}}", userRows);

    // Send email
    await transporter.sendMail({
      from: `"Attendance Bot" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: `Absentee Report - ${date}`,
      html: emailHtml,
    });

    console.log("Email sent to:", email);
  } catch (error) {
    console.error("Error sending absentee email:", error);
    throw error;
  }
};

// Read template once (as you did)
const payrollEmailPath = path.resolve("src/template/payrollNotification.html");
const payrollEmailTemplate = fs.readFileSync(payrollEmailPath, "utf8");

export const sendPayrollMail = async(email: string,firstName:string, month:number, year:number) => {
  const personalizedHTML = payrollEmailTemplate
    .replace("{{adminName}}", firstName)  // Replace firstName
    .replace("{{month}}", month.toString())
    .replace("{{year}}", year.toString())
  try{
      const info = await transporter.sendMail({
        from: `CourageGroup<${process.env.GoogleEmail}>`,
        to: email,
        subject: "New Device Login Attempt - Routly",
        html: personalizedHTML,
    });
  console.log("Message sent: %s", info.messageId);
  return true;
  }catch(error){
    console.log('Error sending Mail', error)
    throw error

  }
}


  
