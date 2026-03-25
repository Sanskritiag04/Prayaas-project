const PDFDocument = require("pdfkit");
const fs = require("fs");

const generateCertificate = (filePath, volunteerName, eventName, ngoName) => {
  const doc = new PDFDocument();

  doc.pipe(fs.createWriteStream(filePath));

  doc.fontSize(26).text("Certificate of Participation", {
    align: "center"
  });

  doc.moveDown();

  doc.fontSize(16).text(`This is to certify that`, { align: "center" });

  doc.moveDown();

  doc.fontSize(20).text(volunteerName, { align: "center" });

  doc.moveDown();

  doc.fontSize(16).text(
    `has successfully participated in "${eventName}"`,
    { align: "center" }
  );

  doc.moveDown();

  doc.text(`Organized by ${ngoName}`, { align: "center" });

  doc.end();
};

module.exports = generateCertificate;