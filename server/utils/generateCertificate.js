const PDFDocument = require("pdfkit");
const fs = require("fs");

const generateCertificate = (
  volunteerName,
  eventName,
  ngoName,
  eventDate,
  filePath
) => {
  return new Promise((resolve, reject) => {

    const doc = new PDFDocument({
      size: "A4",
      layout: "landscape",
      margin: 0
    });

    const stream = fs.createWriteStream(filePath);
    doc.pipe(stream);

    // ===============================
    // UNIQUE CERTIFICATE ID
    // ===============================

    const certificateId =
      "PRAYAAS-" +
      Date.now().toString().slice(-6);

    // ===============================
    // BORDER
    // ===============================

    doc.rect(20, 20, 800, 555).lineWidth(5).stroke("#d4af37");
    doc.rect(35, 35, 770, 525).lineWidth(2).stroke("#2e8b57");

    // ===============================
    // WATERMARK
    // ===============================

    doc.save();
    doc.rotate(-25, { origin: [420, 300] });

    doc
      .fontSize(120)
      .fillColor("#2e8b57")
      .opacity(0.08)
      .text("PRAYAAS", 120, 250);

    doc.restore();
    doc.opacity(1);

    // ===============================
    // NGO NAME TOP
    // ===============================

    doc
      .fontSize(22)
      .fillColor("#2e8b57")
      .text(ngoName.toUpperCase(), 0, 70, {
        align: "center"
      });

    // ===============================
    // TITLE
    // ===============================

    doc
      .fontSize(42)
      .fillColor("#d4af37")
      .text("CERTIFICATE OF APPRECIATION", 0, 130, {
        align: "center"
      });

    // ===============================
    // BODY
    // ===============================

    doc
      .fontSize(20)
      .fillColor("black")
      .text(
        "This certificate is proudly presented to",
        0,
        220,
        { align: "center" }
      );

    // Volunteer Name
    doc
      .fontSize(36)
      .fillColor("#2c3e50")
      .text(volunteerName.toUpperCase(), 0, 270, {
        align: "center",
        underline: true
      });

    doc
      .fontSize(20)
      .text(
        "For successfully volunteering in",
        0,
        340,
        { align: "center" }
      );

    doc
      .fontSize(26)
      .fillColor("#2e8b57")
      .text(`"${eventName}"`, 0, 380, {
        align: "center"
      });

    doc
      .fontSize(18)
      .fillColor("black")
      .text(
        `Date of Participation: ${new Date(eventDate).toDateString()}`,
        0,
        430,
        { align: "center" }
      );

    // ===============================
    // CERTIFICATE ID
    // ===============================

    doc
      .fontSize(14)
      .fillColor("gray")
      .text(`Certificate ID: ${certificateId}`, 60, 520);

    // ===============================
    // FOOTER
    // ===============================

    doc
      .fontSize(12)
      .fillColor("gray")
      .text(
        "Issued under PRAYAAS Volunteer Recognition Program",
        0,
        540,
        { align: "center" }
      );

    doc.end();

    stream.on("finish", resolve);
    stream.on("error", reject);
  });
};

module.exports = generateCertificate;