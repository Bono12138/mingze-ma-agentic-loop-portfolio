import QRCode from "qrcode";

const url = "https://bono12138.github.io/mingze-ma-agentic-loop-portfolio/";

await QRCode.toFile("downloads/portfolio-qr.png", url, {
  errorCorrectionLevel: "H",
  margin: 2,
  width: 640,
  color: {
    dark: "#102538",
    light: "#FFFFFF"
  }
});

console.log(`Generated QR code for ${url}`);
