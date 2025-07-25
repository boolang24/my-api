import crypto from "crypto";

export default async function handler(req, res) {
  const ip = req.headers["x-forwarded-for"]?.split(',')[0] || req.socket.remoteAddress;
  const hash = crypto.createHash("sha256").update(ip).digest("hex").substring(0, 16);

  // Ganti dengan URL Google Apps Script kamu
  const sheetURL = "https://script.google.com/macros/s/AKfycbwLrnM-rD3I6z7e7Qg9Dp_hVybDVKV2VM3tQ1fIJq0A4M2WJXprUcSgOTQnLvTFGOtF/exec";

  // Daftar link direct Adsterra
  const directlinks = [
    "https://siblinggut.com/u5se2wg3?key=3bdba92060257b990b3bf917b9fa01e9",
    "https://siblinggut.com/u5se2wg3?key=d8fec171c5e71319b894d7bf45ea954c",
    "https://siblinggut.com/u5se2wg3?key=267cf6ba29121d04dca551dd8586fbed",
    "https://siblinggut.com/u5se2wg3?key=66e79a753269d03ddec67bae4a63fdcd"
  ];

  try {
    // 1. Cek apakah hash IP sudah dicatat hari ini
    const checkRes = await fetch(`${sheetURL}?check=${hash}`);
    const checkText = await checkRes.text();
    const clicked = checkText.includes("FOUND");

    if (!clicked) {
      // 2. Catat hash/IP ke sheet
      await fetch(`${sheetURL}?ip=${ip}&hash=${hash}`);

      // 3. Kirim link redirect
      const randomUrl = directlinks[Math.floor(Math.random() * directlinks.length)];
      return res.status(200).json({
        shouldRedirect: true,
        url: randomUrl,
        hash,
      });
    }

    // Sudah pernah redirect hari ini
    return res.status(200).json({
      shouldRedirect: false,
      hash,
    });
  } catch (error) {
    console.error("Gagal komunikasi ke Google Sheet:", error);
    return res.status(500).json({ error: "Gagal komunikasi ke Google Sheet" });
  }
      }
