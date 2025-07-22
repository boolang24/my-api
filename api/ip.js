import crypto from "crypto";

export default async function handler(req, res) {
  const ip = req.headers["x-forwarded-for"]?.split(',')[0] || req.socket.remoteAddress;
  const hash = crypto.createHash("sha256").update(ip).digest("hex").substring(0, 16);

  // URL GSC terbaru kamu (yang sudah pakai validasi per hari)
  const sheetURL = "https://script.google.com/macros/s/AKfycbwLrnM-rD3I6z7e7Qg9Dp_hVybDVKV2VM3tQ1fIJq0A4M2WJXprUcSgOTQnLvTFGOtF/exec";

  try {
    // 1. Cek apakah sudah dicatat hari ini
    const checkRes = await fetch(`${sheetURL}?check=${hash}`);
    const checkText = await checkRes.text();
    const clicked = checkText.includes("FOUND");

    // 2. Jika belum, catat IP + hash
    if (!clicked) {
      await fetch(`${sheetURL}?ip=${ip}&hash=${hash}`);
    }

    // 3. Respon ke frontend
    res.status(200).json({ ip, hash, clicked });
  } catch (error) {
    console.error("Gagal komunikasi ke Google Sheet:", error);
    res.status(500).json({ error: "Gagal komunikasi ke Google Sheet" });
  }
}
