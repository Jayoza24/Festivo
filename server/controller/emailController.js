const fs = require("fs");
const csv = require("csv-parser");
const dns = require("dns");
const nodemailer = require("nodemailer");
const { Parser } = require("json2csv");
const path = require("path");

const isValidEmail = (email) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};

const checkEmailDomain = (email) => {
  return new Promise((resolve) => {
    const domain = email.split("@")[1];
    dns.resolveMx(domain, (err, addresses) => {
      resolve(!err && addresses.length > 0);
    });
  });
};

const validateEmails = async (emails) => {
  const results = { valid: [], invalid: [] };

  for (const email of emails) {
    if (isValidEmail(email)) {
      const domainIsValid = await checkEmailDomain(email);
      if (domainIsValid) {
        results.valid.push(email);
      } else {
        results.invalid.push(email);
      }
    } else {
      results.invalid.push(email);
    }
  }

  return results;
};

const parseCsv = (filePath) => {
  return new Promise((resolve, reject) => {
    const emails = [];
    fs.createReadStream(filePath)
      .pipe(csv())
      .on("data", (row) => {
        if (row["Email Address"]) {
          emails.push(row["Email Address"]);
        }
      })
      .on("end", () => {
        resolve(emails);
      })
      .on("error", (error) => {
        reject(error);
      });
  });
};

const sendEmails = async (emails, details) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
      user: "ozajay990@gmail.com",
      pass: "jiuv yozy yiei wtyu",
    },
    tls: {
      rejectUnauthorized: false,
    },
  });

  let htmlTemplatePath;
  switch (details.invitationType) {
    case "Wedding Invitation":
      htmlTemplatePath = path.join(
        __dirname,
        "../invitations/WeddingInvite.html"
      );
      break;
    case "Birthday Invitation":
      htmlTemplatePath = path.join(
        __dirname,
        "../invitations/BirthdayInvite.html"
      );
      break;
    case "Haldi Invitation":
      htmlTemplatePath = path.join(
        __dirname,
        "../invitations/HaldiInvite.html"
      );
      break;
    default:
      throw new Error("Unsupported invitation type");
  }

  const htmlTemplate = fs.readFileSync(htmlTemplatePath, "utf8");

  for (const email of emails) {
    const htmlContent = htmlTemplate
      .replace("{{couple_names}}", details.names || "")
      .replace("{{celebrant_name}}", details.names || "")
      .replace("{{event_date}}", details.eventDate)
      .replace("{{event_location}}", details.eventLocation)
      .replace("{{event_time}}", details.eventTime);

    await transporter.sendMail({
      from: `${details.userName} <ozajay990@gmail.com>`,
      to: email,
      subject: details.invitationType,
      html: htmlContent,
    });
  }
};

const uploadEmails = async (req, res) => {
  try {
    const emails = await parseCsv(req.file.path);
    if (emails.length === 0) {
      return res.status(400).json({ error: "No valid emails found in CSV" });
    }

    const { valid, invalid } = await validateEmails(emails);

    const validEmailsCsv = new Parser({ fields: ["email"] }).parse(
      valid.map((email) => ({ email }))
    );
    const validEmailsPath = `uploads/emailCsv/valid_emails_${Date.now()}.csv`;
    fs.writeFileSync(validEmailsPath, validEmailsCsv);

    res.status(200).json({ valid, invalid, validEmailsPath });
  } catch (error) {
    console.error("Error in uploadEmails:", error);
    res.status(500).json({ error: error.message });
  }
};

const dispatchEmails = async (req, res) => {
  try {
    const validEmails = req.body.validEmails;
    const msg = req.body.message;
    await sendEmails(validEmails, msg);

    res.status(200).json({ message: "Emails sent successfully" });
  } catch (error) {
    console.error("Error in dispatchEmails:", error);
    res.status(500).json({ error: error.message });
  }
};

module.exports = { uploadEmails, dispatchEmails };
