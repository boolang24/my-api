export default async function handler(req, res) {
  const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
  const ua = req.headers['user-agent'] || '';
  
  // Contoh geo dummy
  const country = 'Indonesia';
  const city = 'Jakarta';

  // Kirim data ke Google Sheet lewat Apps Script
  await fetch("https://script.google.com/macros/s/AKfycbyhdZb-LWztRf6a6J1KoD2GwuHKk0jZMVWeie4eZgOCMfM5VyBCnE6faT9fRb4I__co/exec", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      ip: ip,
      ua: ua,
      country: country,
      city: city
    })
  });

  res.status(200).json({ ip, ua, country, city });
}
