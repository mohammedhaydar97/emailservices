require('dotenv').config(); // Load environment variables from .env file
const express = require('express');
const multer = require('multer');
const upload = multer({ 
  dest: 'uploads/',
  fileFilter: function (req, file, cb) {
    if (!file.originalname.match(/\.(pdf|doc|docx)$/)) {
      return cb(new Error('Only PDF, DOC, and DOCX files are allowed!'));
    }
    cb(null, true);
  }
});
const app = express();
const port = process.env.PORT || 3000;
const nodemailer = require("nodemailer");

app.use(express.json()); 

app.post('/sendEmail', upload.single('attachment'), (req, res) => {
  async function main() {
    let transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    let htmlContent = `
      <h1>Full Name:</h1>${req.body.fullName ? `<p>${req.body.fullName}</p>` : ''}
      <h1>Email:</h1>${req.body.email ? `<p>${req.body.email}</p>` : ''}
      <h1>Phone number:</h1>${req.body.phoneNumber ? `<p>${req.body.phoneNumber}</p>` : ''}
      <h1>Recommendation:</h1>${req.body.recommendation ? `<p>${req.body.recommendation}</p>` : ''}
      <h1>Your Experience:</h1>${req.body.yourExperience ? `<p>${req.body.yourExperience}</p>` : ''}
      <h1>Professional Detail:</h1>${req.body.professionalDetail ? `<p>${req.body.professionalDetail}</p>` : ''}
      <h1>Company name:</h1>${req.body.companyName ? `<p>${req.body.companyName}</p>` : ''}
      <h1>Type Of Franchise:</h1>${req.body.typeOfFranchise ? `<p>${req.body.typeOfFranchise}</p>` : ''}
      <h1>Investment:</h1>${req.body.investment ? `<p>${req.body.investment}</p>` : ''}
      <h1>Previous Experience With A Franchise Company:</h1>${req.body.previousExperienceWithAFranchiseCompany ? `<p>${req.body.previousExperienceWithAFranchiseCompany}</p>` : ''}
      <h1>Pre-Qualifications:</h1>${req.body.preQualifications ? `<p>${req.body.preQualifications}</p>` : ''}
    `;

    let mailOptions = {
      from: 'Mohammedhaydar',
      to: "mohammedhaydar97@gmail.com",
      subject: "Using nodemailer",
      html: htmlContent
    };

    if (req.file) {
      mailOptions.attachments = [
        {
          filename: req.file.originalname,
          content: req.file.buffer
        }
      ];
    }

    let info = await transporter.sendMail(mailOptions);

    console.log(info.messageId);
    res.send('Email sent successfully');
  }

  main()
    .catch(err => {
      console.error(err);
      res.status(500).send('Failed to send email');
    });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
