import crypto from "crypto";

export default async function handler(req, res) {
  const ip = req.headers["x-forwarded-for"]?.split(',')[0] || req.socket.remoteAddress;

  const hash = crypto.createHash("sha256").update(ip).digest("hex").substring(0, 16);

  const sheetURL = "https://script.google.com/macros/s/AKfycbz52lT0lKEUDIHjhc9xQ_RIOfqO9EchaF1Jk-WCcoNyxdHiJyW5jhRLgT6e8yR6_Ok/exec";

  try {
    // Cek apakah hash sudah ada di Google Sheet
    const checkURL = `${sheetURL}?check=${hash}`;
    const checkRes = await fetch(checkURL);
    const checkText = await checkRes.text();

    const clicked = checkText.includes("FOUND");

    // Log IP ke sheet (untuk mencatat baru)
    await fetch(`${sheetURL}?ip=${ip}&hash=${hash}`);

    res.status(200).json({
      ip,
      hash,
      clicked
    });
  } catch (error) {
    console.error("Gagal fetch ke Google Sheet:", error);
    res.status(500).json({ error: "Gagal komunikasi ke Google Sheet" });
  }
}
