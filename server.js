require("dotenv").config(); // Load environment variables from .env file
const express = require("express");
const multer = require("multer");
const cors = require("cors");

app.use(cors());

const upload = multer({
  dest: "uploads/",
  fileFilter: function (req, file, cb) {
    if (!file.originalname.match(/\.(pdf|doc|docx)$/)) {
      return cb(new Error("Only PDF, DOC, and DOCX files are allowed!"));
    }
    cb(null, true);
  },
});
const app = express();
const port = process.env.PORT || 3000;
const nodemailer = require("nodemailer");

app.use(express.json());

app.post("/sendEmail", upload.single("attachment"), (req, res) => {
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
    <div>
      <h1 style=" color: #000;font-size:20px; font-weight:bold; display: inline-block;">Full Name:</h1>${
        req.body.fullName
          ? `<p style=" color: #000;font-size: 16px; display:inline-block; margin-left: 5px;">${req.body.fullName}</p>`
          : ""
      }
    </div>
    <div>
        <h1 style=" color: #000;font-size:20px; font-weight:bold; display: inline-block;">Email:</h1>${
          req.body.email
            ? `<p style=" color: #000;font-size: 16px; display:inline-block; margin-left: 5px;">${req.body.email}</p>`
            : ""
        }
    </div>
    <div>
    <h1 style=" color: #000;font-size:20px; font-weight:bold; display: inline-block;">Phone number:</h1>${
      req.body.phoneNumber
        ? `<p style=" color: #000;font-size: 16px; display:inline-block; margin-left: 5px;">${req.body.phoneNumber}</p>`
        : ""
    }
    </div>
    <div>
      ${
        req.body.recommendation
          ? `<h1 style=" color: #000;font-size:20px; font-weight:bold; display: inline-block;">Recommendation:</h1> <p style=" color: #000;font-size: 16px; display:inline-block; margin-left: 5px;">${req.body.recommendation}</p>`
          : ""
      }
      </div>
      <div>
      ${
        req.body.yourExperience
          ? `<h1 style=" color: #000;font-size:20px; font-weight:bold; display: inline-block;">Your Experience:</h1> <p style=" color: #000;font-size: 16px; display:inline-block; margin-left: 5px;">${req.body.yourExperience}</p>`
          : ""
      }
      </div>
      <div>
      ${
        req.body.professionalDetail
          ? `<h1 style=" color: #000;font-size:20px; font-weight:bold; display: inline-block;">Professional Detail:</h1> <p style=" color: #000;font-size: 16px; display:inline-block; margin-left: 5px;">${req.body.professionalDetail}</p>`
          : ""
      }
      </div>
      <div>
      ${
        req.body.companyName
          ? `<h1 style=" color: #000;font-size:20px; font-weight:bold; display: inline-block;">Company name:</h1> <p style=" color: #000;font-size: 16px; display:inline-block; margin-left: 5px;">${req.body.companyName}</p>`
          : ""
      }
      </div>
      <div>
      ${
        req.body.typeOfFranchise
          ? `<h1 style=" color: #000;font-size:20px; font-weight:bold; display: inline-block;">Type Of Franchise:</h1> <p style=" color: #000;font-size: 16px; display:inline-block; margin-left: 5px;">${req.body.typeOfFranchise}</p>`
          : ""
      }
      </div>
      <div>
      ${
        req.body.investment
          ? `<h1 style=" color: #000;font-size:20px; font-weight:bold; display: inline-block;">Investment:</h1> <p style=" color: #000;font-size: 16px; display:inline-block; margin-left: 5px;">${req.body.investment}</p>`
          : ""
      }
      </div>
      <div>
      ${
        req.body.previousExperienceWithAFranchiseCompany
          ? `<h1 style=" color: #000;font-size:20px; font-weight:bold; display: inline-block;">Previous Experience With A Franchise Company:</h1> <p style=" color: #000;font-size: 16px; display:inline-block; margin-left: 5px;">${req.body.previousExperienceWithAFranchiseCompany}</p>`
          : ""
      }
      </div>
      <div>
      ${
        req.body.preQualifications
          ? `<h1 style=" color: #000;font-size:20px; font-weight:bold; display: inline-block;">Pre-Qualifications:</h1> <p style=" color: #000;font-size: 16px; display:inline-block; margin-left: 5px;">${req.body.preQualifications.map(
              (qualification) => {
                return qualification;
              }
            )}</p>`
          : ""
      }
      </div>
      
    `;

    let mailOptions = {
      from: "Mohammedhaydar",
      to: "mohammedhaydar97@gmail.com",
      subject: "The Wok Website",
      html: htmlContent,
    };

    if (req.file) {
      mailOptions.attachments = [
        {
          filename: req.file.originalname,
          content: req.file.buffer,
        },
      ];
    }

    let info = await transporter.sendMail(mailOptions);

    console.log(info.messageId);
    res.send("Email sent successfully");
  }

  main().catch((err) => {
    console.error(err);
    res.status(500).send("Failed to send email");
  });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
