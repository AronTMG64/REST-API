const express = require('express');
const path = require('path');
const mysql = require('mysql2')

const server = express();

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  database: 'movies'
});

server.use(express.static(path.resolve('public')));
server.use(express.json());

server.get('/api/movies', async (req, res) => {
  db.query(
    'SELECT * FROM movies',
    (err, results, fields) => {
      res.status(200).json(results);
    }
  );
});

server.get('/api/movies/:id', async (req, res) => {
  const movieId = req.params.id;
  db.query(
    'SELECT * FROM movies WHERE id = ?',
    [movieId],
    (err, results, fields) => {
      if (err) {
        console.error('Error:', err);
        res.status(500).send('Server error');
      } else if (results.length === 0) {
        res.status(404).send('Movie not found');
      } else {
        res.status(200).json(results[0]);
      }
    }
  );
});

server.post('/api/movies', (req, res) => {
  db.query(`INSERT INTO movies (name, year) VALUES ('${req.body.name}', ${req.body.year})`);
});

server.delete('/api/movies/:id', async (req, res) => {
  const movieId = req.params.id;
  db.query(
    'DELETE FROM movies WHERE id = ?',
    [movieId],
    (err, results, fields) => {
      if (err) {
        console.error('Error:', err);
        res.status(500).send('Server error');
      } else if (results.affectedRows === 0) {
        res.status(404).send('Movie not found');
      } else {
        res.status(200).send('Movie deleted');
      }
    }
  );
});

server.put('/api/movies/:id', async (req, res) => {
  const movieId = req.params.id;
  db.query(
    `UPDATE movies SET name = '${req.body.name}', year = ${req.body.year} WHERE id = ?`,
    [movieId],
    (err, results, fields) => {
      if (err) {
        console.error('Error:', err);
        res.status(500).send('Server error');
      } else if (results.affectedRows === 0) {
        res.status(404).send('Movie not found');
      } else {
        res.status(200).send('Movie edited');
      }
    }
  );
});

server.listen(3000, () => console.log('Connected'));