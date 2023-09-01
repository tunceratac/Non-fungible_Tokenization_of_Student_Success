const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const app = express();
const path = require('path');
const fs = require('fs');
const dbFilePath = './nftDB.db';

const port = process.env.PORT || 3001;

app.use(cors());  
app.use(express.json());

fs.access(dbFilePath, fs.constants.F_OK, (err) => {
  if (err) {
    console.error('nftDB.db not found!', err);
    return;
  }

  console.log('nftDB.db found!');

  let db = new sqlite3.Database(dbFilePath, sqlite3.OPEN_READWRITE, (err) => {
    if (err) {
      console.error('Error opening database: ', err.message);
      return;
    }
    console.log('Database opened successfully!');
  });

  app.use(express.static(path.join(__dirname, 'client/build')));

  app.post('/api/NFT', (req, res) => {
    const { a, b, c, d } = req.body;

    let sql = `INSERT INTO NFT (TokenID, Student_ID, Semester, Status, Certificate_Name)
               SELECT ?, S.ID, ?, 'Active', ?
               FROM Student S
               WHERE S.Student_ID = ?`;

    db.run(sql, [a, b, c, d], (err) => {
      if (err) {
        console.error('Database insert error:', err.message);
        return res.status(500).json({ error: 'Database error' });
      }
      res.status(200).json({ message: 'Record inserted' });
    });
  });

app.post('/api/updateStudentValue', (req, res) => {
  const { semester, tokenId } = req.body;

  let sql = `UPDATE Student SET Value = Value + 10 WHERE Id = (SELECT Student_ID FROM NFT WHERE Semester = ? AND TokenID = ?)`;

  db.run(sql, [semester, tokenId], (err) => {
    if (err) {
      console.error('Database update error:', err.message);
      return res.status(500).json({ error: 'Database error' });
    }
    res.status(200).json({ message: 'Record updated' });
  });
});

app.post('/api/updateBurn', (req, res) => {
  const { semester, tokenId } = req.body;

  let sql = `UPDATE NFT SET Status = 'Burned' WHERE Semester = ? AND TokenID = ?`;

  db.run(sql, [semester, tokenId], (err) => {
    if (err) {
      console.error('Database update error:', err.message);
      return res.status(500).json({ error: 'Database error' });
    }
    res.status(200).json({ message: 'Record updated' });
  });
});


  app.get('/api/Student/:id', (req, res) => {
    const id = Number(req.params.id);
    if (isNaN(id)) {
        return res.status(400).json({ error: 'Invalid ID' });
    }

    let sql = `SELECT * FROM STUDENT WHERE ID = (SELECT Student_ID FROM NFT WHERE Status='Burned' and TokenID = ${id})`;

    db.get(sql, [], (err, row) => {
        if (err) {
            console.error('Database query error:', err.message);
            return res.status(500).json({ error: 'Database error' });
        }
        res.json(row);
    });
  });

  app.get('*', (req, res) => {
    console.log('Homepage loaded!');
    res.sendFile(path.join(__dirname, 'client/build/index.html'));
  });

  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
});
