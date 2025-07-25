import crypto from "crypto";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const ip = req.headers["x-forwarded-for"]?.split(',')[0] || req.socket.remoteAddress || "unknown";
  const hash = crypto.createHash("sha256").update(ip).digest("hex").substring(0, 16);

  // Ganti ke link Google Apps Script milikmu
  const sheetURL = "https://script.google.com/macros/s/AKfycbwLrnM-rD3I6z7e7Qg9Dp_hVybDVKV2VM3tQ1fIJq0A4M2WJXprUcSgOTQnLvTFGOtF/exec";

  const directlinks = [
    "https://siblinggut.com/u5se2wg3?key=3bdba92060257b990b3bf917b9fa01e9",
    "https://siblinggut.com/u5se2wg3?key=d8fec171c5e71319b894d7bf45ea954c",
    "https://siblinggut.com/u5se2wg3?key=267cf6ba29121d04dca551dd8586fbed",
    "https://siblinggut.com/u5se2wg3?key=66e79a753269d03ddec67bae4a63fdcd"
  ];

  const nativeAds = [
    {
      key: "6f272ad156a043df17f952f8be2133c7",
      domain: "thermometerpushfulabnegate.com"
    },
    {
      key: "087a5434b38672b575440c316bebe4f4",
      domain: "siblinggut.com"
    }
  ];

  try {
    const checkRes = await fetch(`${sheetURL}?check=${hash}`);
    const clicked = (await checkRes.text()).includes("FOUND");

    if (!clicked) {
      await fetch(`${sheetURL}?ip=${ip}&hash=${hash}`);

      const directlink = directlinks[Math.floor(Math.random() * directlinks.length)];
      const native = nativeAds[Math.floor(Math.random() * nativeAds.length)];
      const popunder = directlink; // atau pisahkan kalau mau beda

      return res.status(200).json({
        showAds: true,
        directlink,
        nativeKey: native.key,
        nativeDomain: native.domain,
        popunder,
        hash
      });
    }

    return res.status(200).json({
      showAds: false,
      hash
    });

  } catch (e) {
    console.error("Gagal komunikasi ke Sheet:", e);
    return res.status(500).json({ error: "Gagal komunikasi ke Google Sheet" });
  }
}
