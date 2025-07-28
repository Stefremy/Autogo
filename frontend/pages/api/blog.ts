import type { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import path from 'path';

const blogDir = path.join(process.cwd(), 'data/blog');

function getAllPosts() {
  const files = fs.readdirSync(blogDir);
  return files.filter(f => f.endsWith('.md')).map(filename => {
    const filePath = path.join(blogDir, filename);
    const content = fs.readFileSync(filePath, 'utf-8');
    return { filename, content };
  });
}

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    // List all blog posts
    try {
      const posts = getAllPosts();
      res.status(200).json(posts);
    } catch (err) {
      res.status(500).json({ error: 'Failed to read blog posts.' });
    }
  } else if (req.method === 'POST') {
    // Add a new blog post (expects { filename, content })
    try {
      const { filename, content } = req.body;
      if (!filename || !content) {
        return res.status(400).json({ error: 'Missing filename or content.' });
      }
      const filePath = path.join(blogDir, filename);
      fs.writeFileSync(filePath, content);
      res.status(201).json({ filename });
    } catch (err) {
      res.status(500).json({ error: 'Failed to add blog post.' });
    }
  } else if (req.method === 'DELETE') {
    // Delete a blog post by filename
    try {
      const { filename } = req.query;
      if (!filename) {
        return res.status(400).json({ error: 'Missing filename.' });
      }
      const filePath = path.join(blogDir, filename as string);
      if (!fs.existsSync(filePath)) {
        return res.status(404).json({ error: 'Blog post not found.' });
      }
      fs.unlinkSync(filePath);
      res.status(200).json({ success: true });
    } catch (err) {
      res.status(500).json({ error: 'Failed to delete blog post.' });
    }
  } else {
    res.setHeader('Allow', ['GET', 'POST', 'DELETE']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
