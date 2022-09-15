$(document).ready(function(){
  console.log('jQuery sourced.');
  refreshBooks();
  addClickHandlers();
});

function addClickHandlers() {
  // checks to see what state edit mode is in on page load.
  console.log('Edit mode is:',editModeVar);

  $('#book-form').on('click','#submitBtn',handleSubmit);
  
  // turns off edit mode.
  $('#book-form').on('click', '.cancelBtn', function(){
    editModeVar = false;
    formatEditMode();
  });

  // TODO - Add code for edit & delete buttons
  $('#bookShelf').on('click', '.delBtn', deleteBook);
  $('#bookShelf').on('click', '.readBtn', updateBook);
  // click handler for edit mode
  $('#bookShelf').on('click', '.editBtn', toggleEditMode);
}

// variable to check if the user is in edit mode.
let editModeVar = false;
// global variable to store book id for edit mode.
let editBookId;


// toggle edit mode for user to edit book data.
function toggleEditMode(event) {
  // set editMode variable to true.
  editModeVar = true;
  console.log('Toggle:',editModeVar);
  editBookId = $(event.target).siblings('.delBtn').data('bookid');
  formatEditMode();
}

// format the editMode layout.
function formatEditMode() {
  if(editModeVar === true) {
    $('h3').text('Edit Book');
    $('#book-form').append(`<button class="cancelBtn">Cancel</button>`);
    getBookWithId();
  } else {
    $('#h3').text('Add New Book');
    $('#title').val('');
    $('#author').val('');
    $('.cancelBtn').remove();
  }
}

// get book with specific bookid and change the 
// input values to the book's title and author.
function getBookWithId() {
  $.ajax({
    method: 'GET',
    url: `/books/${editBookId}`
  }).then((response) => {
    $('#title').val(`${response[0].title}`);
    $('#author').val(`${response[0].author}`);
  }).catch((error) => {
    console.log(error);
  });
  console.log(editBookId);
}

function handleSubmit() {
  console.log('Submit button clicked.');
  if (editModeVar === true) {
    editBook();
  } else {
    let book = {};
    book.author = $('#author').val();
    book.title = $('#title').val();
    addBook(book);
  }
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
          <button class="editBtn">Edit</button>
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

// changes the isRead value of a book.
// what a mess this function has become.
function updateBook(event) {
  // get the buttons parent td then the td's next sibling's
  // child with class .delBtn 's data.
  let bookid = $(event.target)
    .closest('td').next('td')
    .find('.delBtn').data('bookid');
  // console.log(bookid);
  let isRead = changeIsRead(event);
  // console.log(isRead);
  // PUT request for "books".
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

// changed the author and title of a book.
function editBook() {
  // console.log('updateBook:',editBookId, editModeVar);
  $.ajax({
    method: 'PUT',
    url: `/books/edit/${editBookId}`,
    data:{
      title: $('#title').val(),
      author: $('#author').val()
    }
  }).then((response) => {
    console.log(`successfully updated book with id:${editBookId}`);
    refreshBooks();
  }).catch((error) => {
    console.log(error);
  });
}

// get the clicked button's data.
function changeIsRead (event) {
  let currentIsRead = $(event.target).data('readid');
  // console.log(currentIsRead);
  let isRead = false;
  // inverse the isRead value to send back to the server.
  if (currentIsRead === false) {
    isRead = true;
  } else if (currentIsRead === true) {
    isRead = false;
  }
  return isRead;
}
