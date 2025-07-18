export default async function handler(req, res) {
  const ip = req.headers["x-forwarded-for"] || req.socket.remoteAddress;
  const sheetURL = "https://script.google.com/macros/s/AKfycbz52lT0lKEUDIHjhc9xQ_RIOfqO9EchaF1Jk-WCcoNyxdHiJyW5jhRLgT6e8yR6_Ok/exec";

  try {
    const response = await fetch(sheetURL + `?ip=${ip}`);
    const text = await response.text();
    console.log("Hasil fetch ke Google Sheet:", text);

    res.status(200).json({ ip, googleResponse: text });
  } catch (error) {
    console.error("Gagal kirim ke Sheet:", error);
    res.status(500).json({ error: "Gagal kirim ke Google Sheet" });
  }
}
