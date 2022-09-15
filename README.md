# Awesome Reads

Welcome to Awesome Reads! 

We need your help adding some new features to our application. Our users want to be able to mark books as read and delete books they no longer want to read.

Get started by taking a look at our existing code, and getting the current application up and running.

## Database Setup

You'll need to create a database called `awesome_reads`. 

Use the provided `database.sql` file to create the `books` table and setup some test data.

## Base Mode

### Remove a book

Users want to be able to remove a book from the book list.  Add a `Delete` button for each book. This should make an AJAX call to a `DELETE` endpoint, passing the book `id` as a URL parameter, and removing the book from the database.

### Update a book

Users also want to be able to mark a book as read. The database has already been setup with a `isRead` column, but this is not currently rendered on the DOM. Update the book list display to show if a book has been read or not. 

Add another button to each book allowing the user to `Mark as Read`. This should trigger a `PUT` AJAX call, passing the book `id` as a URL parameter, and update the book record in the database.

### Task list

- [ ] DELETE & PUT AJAX calls
- [ ] DELETE & PUT SERVER SIDE 
- [ ] Page should refresh with up to date data after a DELETE or PUT


## Stretch Goals

### Enhanced edit

Currently, if you typo a book's title or author, it must be removed and re-added to fix it. Users want to have an edit feature to modify this information.

To do this we should first create a variable to indicate if we are in add or edit mode.

Then we can add an edit button for each book. When clicked:

- Save the book id in a global variable
- Switch the mode to edit
- Fill the form with the current title and author of the book
- Change the heading from Add Book to Edit Book
- The edit mode should also show a cancel button, which should switch back to add mode, clearing the inputs without saving data.

When the submit button is clicked:
- If the mode is add - do the original POST
- If the mode is edit - send a PUT with the updated information

### Additional Features

- [ ] Add validation to the add input form
    - The client side code should make sure that required fields are filled in. You can do this by making the HTML inputs required. Make sure to do something so the user can tell which fields are required. 
    - The server side should also check that it gets all required fields. If required fields are missing, send back a 400 status code.
- [ ] Add a way to change the order in which books are shown - sort by title vs sort by author
- [ ] Improve the styling of the page -- Bootstrap & CSS
    - [ ] Improve the table layout. Give alternating rows a difference in color
    - [ ] Make the buttons more UX friendly -- Red for delete, etc. Green for save/submit. 
    - [ ] Make the page responsive -- Bootstrap Grid & Containers will be helpful!
- [ ] Add the ability to store and show one or more of the following when marking a book as complete: the date completed, a rating, and comments.  You'll have to change many things across the full stack!



