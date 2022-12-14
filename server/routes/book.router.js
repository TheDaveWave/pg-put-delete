const express = require('express');
const router = express.Router();

const pool = require('../modules/pool');

// Get all books
router.get('/', (req, res) => {
  let queryText = 'SELECT * FROM "books" ORDER BY "title";';
  pool.query(queryText).then(result => {
    // Sends back the results in an object
    res.send(result.rows);
  })
  .catch(error => {
    console.log('error getting books', error);
    res.sendStatus(500);
  });
});

router.get('/author', (req, res) => {
  let queryText = 'SELECT * FROM "books" ORDER BY "author";';
  pool.query(queryText).then(result => {
    // Sends back the results in an object
    res.send(result.rows);
  })
  .catch(error => {
    console.log('error getting books', error);
    res.sendStatus(500);
  });
});

// Adds a new book to the list of awesome reads
// Request body must be a book object with a title and author.
router.post('/',  (req, res) => {
  let newBook = req.body;
  
  if(newBook.author === '' || newBook.title === '') {
    res.sendStatus(400);
  } else {
    console.log(`Adding book`, newBook);
    let queryText = `INSERT INTO "books" ("author", "title")
                    VALUES ($1, $2);`;
    pool.query(queryText, [newBook.author, newBook.title])
    .then((result) => {
      res.sendStatus(201);
    })
    .catch((error) => {
      console.log(`Error adding new book`, error);
      res.sendStatus(500);
    });
  }
});

// GET request to get book with specific id.
router.get('/:bookid', (req,res) => {
  let bookid = req.params.bookid;
  console.log(`In GET route /books/${bookid}`, req.params);
  let query = `SELECT * FROM "books" WHERE "id"=$1;`;
  if(!bookid || bookid === '') {
    res.status(400).send('Missing data in required request');
  } else {
    pool.query(query, [bookid]).then((result) => {
      res.send(result.rows);
    }).catch((error) => {
      console.log(`Error getting book with id${bookid}`, error);
      res.sendStatus(500);
    });
  }
});

// TODO - PUT
// Updates a book to show that it has been read
// Request must include a parameter indicating what book to update - the id
// Request body must include the content to update - the status
router.put('/:bookid', (req, res) => {
  console.log(`In PUT route /books`, req.params, req.body);
  let bookid = req.params.bookid;
  let book = req.body;
  let query = `UPDATE "books" SET "isRead" = $1 WHERE id = $2 RETURNING *;`;
  if(!bookid || bookid === '') {
    res.status(400).send('Missing data in required request');
  } else {
    pool.query(query, [book.isRead, bookid]).then((result) => {
      res.send(result.rows);
    }).catch((error) => {
      console.log(`Error updating book`, error);
      res.sendStatus(500);
    })
  }
});

router.put('/edit/:bookid', (req,res) => {
  let bookid = req.params.bookid;
  console.log(`In PUT route /books/edit/${bookid}`);
  let book = req.body;
  let query = `UPDATE "books" SET "title"=$1, "author"=$2 WHERE id=$3 RETURNING *;`;
  if(!bookid || !book.title || !book.author || bookid === '' || book.title === '' || book.author === '') {
    res.status(400).send('Missing data in required request');
  } else {
    pool.query(query, [book.title, book.author, bookid])
    .then((result) => {
      res.send(result.rows);
    }).catch((error) => {
      console.log(`Error editing book`, error);
      res.sendStatus(500);
    });
  }
});

// TODO - DELETE 
// Removes a book to show that it has been read
// Request must include a parameter indicating what book to update - the id
router.delete('/:bookid', (req, res) => {
  console.log('In DELETE route /books', req.params);
  let bookid = req.params.bookid;
  const query = `DELETE FROM "books" WHERE id=$1;`;
  if(!bookid || bookid === '') {
    res.status(400).send('Missing data in required request');
  } else {
    pool.query(query, [bookid]).then(() => {
      res.sendStatus(204);
    }).catch((error) => {
      console.log(`Error deleting new book`, error);
      res.sendStatus(500);
    });
  }
});

module.exports = router;
