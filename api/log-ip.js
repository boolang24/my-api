import fs from 'fs';
import path from 'path';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Only POST allowed' });
  }

  const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;

  const logPath = path.resolve('./ip-log.json');

  let existing = [];
  try {
    const content = fs.readFileSync(logPath, 'utf8');
    existing = JSON.parse(content);
  } catch {
    existing = [];
  }

  if (!existing.includes(ip)) {
    existing.push(ip);
    fs.writeFileSync(logPath, JSON.stringify(existing, null, 2));
  }

  return res.status(200).json({ message: 'IP logged', ip });
}
