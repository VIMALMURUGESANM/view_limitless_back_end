const express = require('express');
const router = express.Router();
const multer = require('multer');
const { v4: uuidv4 } = require('uuid');
const fs = require('fs');
const ffmpeg = require('fluent-ffmpeg');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, uuidv4() + '-' + file.originalname);
  },
});

const upload = multer({ storage: storage });

router.post('/upload', upload.single('mp4File'), (req, res) => {
  // Handle MP4 upload
  const mp4File = req.file;
  if (!mp4File) {
    return res.status(400).json({ error: 'No file uploaded' });
  }
  
  // Convert MP4 to sheet music
  const outputFilename = `sheet_music_${uuidv4()}.png`;
  ffmpeg(mp4File.path)
    .screenshots({
      timestamps: ['10%'], // Take screenshot at 10% of the video duration
      filename: outputFilename,
      folder: 'uploads/sheet_music/',
    })
    .on('end', () => {
      // Return path to the generated sheet music
      const sheetMusicPath = `/uploads/sheet_music/${outputFilename}`;
      res.json({ success: true, sheetMusicPath });
    })
    .on('error', (err) => {
      console.error('Error generating sheet music:', err);
      res.status(500).json({ error: 'Failed to generate sheet music' });
    });
});

module.exports = router;
