export default async function handler(req, res) {
  const ip =
    req.headers["x-forwarded-for"]?.split(",")[0] ||
    req.connection?.remoteAddress ||
    req.socket?.remoteAddress ||
    "unknown";

  const today = new Date().toISOString().split("T")[0]; // Format: YYYY-MM-DD
  const sheetURL =
    "https://script.google.com/macros/s/AKfycbwLrnM-rD3I6z7e7Qg9Dp_hVybDVKV2VM3tQ1fIJq0A4M2WJXprUcSgOTQnLvTFGOtF/exec";

  try {
    const checkURL = `${sheetURL}?ip=${ip}&date=${today}&check=1`;
    const check = await fetch(checkURL);
    const isAlreadyLogged = await check.text();

    if (isAlreadyLogged === "exists") {
      // Sudah tercatat hari ini → tidak redirect ke iklan
      return res.redirect(302, "https://your-website-url.com"); // ganti ke landing page kamu
    }

    // Belum tercatat → log IP dan redirect ke iklan
    await fetch(`${sheetURL}?ip=${ip}&date=${today}`);

    // Daftar directlink acak
    const links = [
      "https://thermometerpushfulabnegate.com/dwrpn1ns7?key=61637c39d8fe762ff37b9627e3bd95d3",
      "https://thermometerpushfulabnegate.com/dwrpn1ns7?key=98924fe5e40aa1565494e91c2887bb37",
      "https://thermometerpushfulabnegate.com/dwrpn1ns7?key=aa66bc713fed7d0d95815a2ccaa4db97"
    ];

    const randomLink = links[Math.floor(Math.random() * links.length)];
    return res.redirect(302, randomLink);
  } catch (error) {
    console.error("Redirect error:", error);
    return res.status(500).json({ error: "Something went wrong." });
  }
}
