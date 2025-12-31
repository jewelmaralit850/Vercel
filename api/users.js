import { writeFileSync, readFileSync, existsSync, mkdirSync } from 'fs';
import path from 'path';

export default function handler(req, res) {
  const { userId, filePath, key, newContents } = req.body;

  if (!userId || !filePath) {
    return res.status(400).json({ error: "Missing userId or filePath" });
  }

  const storageDir = path.join('/tmp/uploads', userId);
  const fullPath = path.join(storageDir, filePath);

  if (!existsSync(storageDir)) mkdirSync(storageDir, { recursive: true });

  if (req.method === 'PUT') {
    const validKey = "example-91728jekj-91819";
    if (key && key !== validKey) return res.status(403).json({ error: "Invalid API key" });

    writeFileSync(fullPath, newContents || '');
    return res.json({ message: "File saved/updated successfully" });
  }

  if (req.method === 'GET') {
    if (!existsSync(fullPath)) return res.status(404).json({ error: "File not found" });
    const contents = readFileSync(fullPath, 'utf-8');
    return res.send(contents);
  }

  res.status(405).json({ error: "Method not allowed" });
}
