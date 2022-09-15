$(document).ready(function(){
  console.log('jQuery sourced.');
  refreshBooks();
  addClickHandlers();
});

function addClickHandlers() {
  $('#submitBtn').on('click', handleSubmit);

  // TODO - Add code for edit & delete buttons
  $('#bookShelf').on('click', '.delBtn', deleteBook);
  $('#bookShelf').on('click', '.readBtn', updateBook);
}

function handleSubmit() {
  console.log('Submit button clicked.');
  let book = {};
  book.author = $('#author').val();
  book.title = $('#title').val();
  addBook(book);
}

// adds a book to the database
function addBook(bookToAdd) {
  $.ajax({
    type: 'POST',
    url: '/books',
    data: bookToAdd,
    }).then(function(response) {
      console.log('Response from server.', response);
      refreshBooks();
    }).catch(function(error) {
      console.log('Error in POST', error)
      alert('Unable to add book at this time. Please try again later.');
    });
}

// refreshBooks will get all books from the server and render to page
function refreshBooks() {
  $.ajax({
    type: 'GET',
    url: '/books'
  }).then(function(response) {
    console.log('refreshed book list:',response);
    renderBooks(response);
  }).catch(function(error){
    console.log('error in GET', error);
  });
}


// Displays an array of books to the DOM
function renderBooks(books) {
  $('#bookShelf').empty();

  for(let i = 0; i < books.length; i += 1) {
    let book = books[i];
    let read = 'No';
    // change the boolean value for isRead to yes or no.
    if(book.isRead === true) {
      read = 'Yes';
    }
    // For each book, append a new row to our table
    $('#bookShelf').append(`
      <tr>
        <td>${book.title}</td>
        <td>${book.author}</td>
        <td>${read}</td>
        <td>
          <button data-readid="${book.isRead}" class="readBtn">Read</button>
        </td>
        <td>
          <button data-bookid="${book.id}" class="delBtn">Delete</button>
        </td>
      </tr>
    `);
  }
}

// deletes a book from the database
function deleteBook(event) {
  let bookid = $(event.target).data('bookid');
  $.ajax({
    method: 'DELETE',
    url: `/books/${bookid}`
  }).then(() => {
    // get the updated list from "books" after 
    // a book has been deleted.
    refreshBooks();
  }).catch((error) => {
    console.log(error);
  });
}

// changes the isRead value of a book 
// what a mess this function has become.
function updateBook(event) {
  // get the buttons parent td then the td's next sibling's child's data.
  let bookid = $(event.target)
    .closest('td').next('td')
    .find('.delBtn').data('bookid');
  // console.log(bookid);
  // get the clicked button's data.
  let currentIsRead = $(event.target).data('readid');
  // console.log(currentIsRead);
  let isRead = false;
  // inverse the isRead value to send back to the server.
  if (currentIsRead === false) {
    isRead = true;
  } else if (currentIsRead === true) {
    isRead = false;
  }
  // console.log(isRead);

  $.ajax({
    method: 'PUT',
    url: `/books/${bookid}`,
    data: {isRead}
  }).then(() => {
    console.log(`successfully updated book with id:${bookid}`);
    refreshBooks();
  }).catch((error) => {
    console.log(error);
  });
}