
import express from 'express';
import fs from 'fs';

const testRouter = express.Router();


testRouter.get('/.well-known/assetlinks.json', (req, res) => {
    const assetlinksPath = 'src/.well-known/assetlinks.json';
  
    fs.readFile(assetlinksPath, 'utf8', (err, data) => {
      if (err) {
        console.error(err);
        res.status(500).json({ error: 'Không thể đọc tệp assetlinks.json' });
        return;
      }
  
      try {
        const jsonData = JSON.parse(data);
        res.json(jsonData);
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Lỗi khi chuyển đổi sang JSON' });
      }
    });
  });

export {testRouter}
  