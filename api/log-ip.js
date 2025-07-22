import fs from 'fs';
import path from 'path';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Only POST allowed' });
  }

  const ip = req.headers['x-forwarded-for']?.split(',')[0] || req.socket.remoteAddress;
  const today = new Date().toISOString().slice(0, 10); // Format: YYYY-MM-DD

  const logPath = path.resolve('./ip-log.json');

  let existing = [];

  try {
    if (fs.existsSync(logPath)) {
      const content = fs.readFileSync(logPath, 'utf8');
      existing = JSON.parse(content);
    }
  } catch (error) {
    console.error("Gagal membaca file log:", error);
    return res.status(500).json({ message: "Gagal membaca file log" });
  }

  const isAlreadyLoggedToday = existing.some(entry => entry.ip === ip && entry.date === today);

  if (!isAlreadyLoggedToday) {
    existing.push({ ip, date: today });

    try {
      fs.writeFileSync(logPath, JSON.stringify(existing, null, 2));
    } catch (error) {
      console.error("Gagal menulis file log:", error);
      return res.status(500).json({ message: "Gagal menulis file log" });
    }

    return res.status(200).json({ message: 'IP dicatat hari ini', ip, date: today });
  } else {
    return res.status(200).json({ message: 'IP sudah tercatat hari ini', ip, date: today });
  }
}
