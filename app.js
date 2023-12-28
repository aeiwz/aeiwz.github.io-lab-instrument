const express = require('express');
const sqlite3 = require('sqlite3');
const bodyParser = require('body-parser');

const app = express();
const port = 3000;

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

// SQLite Database Setup
const db = new sqlite3.Database('lab_inventory.db');
db.serialize(() => {
  db.run('CREATE TABLE IF NOT EXISTS instruments (id INTEGER PRIMARY KEY, name TEXT, quantity INTEGER)');
});

// Routes

// Home page
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/index.html');
});

// Get inventory data
app.get('/inventory', (req, res) => {
  db.all('SELECT * FROM instruments', (err, rows) => {
    if (err) {
      res.status(500).send('Internal Server Error');
    } else {
      res.json(rows);
    }
  });
});

// Add a new item to the database
app.post('/add', (req, res) => {
  const { name, quantity } = req.body;

  db.run('INSERT INTO instruments (name, quantity) VALUES (?, ?)', [name, quantity], function(err) {
    if (err) {
      res.status(500).send('Internal Server Error');
    } else {
      res.send('Item added successfully');
    }
  });
});

// Update an item's quantity in the database
app.post('/update', (req, res) => {
  const { id, quantity } = req.body;

  db.run('UPDATE instruments SET quantity = ? WHERE id = ?', [quantity, id], function(err) {
    if (err) {
      res.status(500).send('Internal Server Error');
    } else {
      res.send('Update successful');
    }
  });
});

// Remove an item from the database
app.post('/remove', (req, res) => {
  const { id } = req.body;

  db.run('DELETE FROM instruments WHERE id = ?', [id], function(err) {
    if (err) {
      res.status(500).send('Internal Server Error');
    } else {
      res.send('Item removed successfully');
    }
  });
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
