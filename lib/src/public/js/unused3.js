
const editBtn = document.querySelectorAll(".edit-notes");
let eachPop = document.getElementById("each-note-display")
const addNewNoteBtn = document.getElementById("add-new-notes");
const newNotePop = document.getElementById("add-new-note-pop-up") 

// function to display edit note pop up
function editNote(noteId){
    eachPop.style.display = "flex";
    eachPop.style.flexDirection = "column";
    eachPop.style.alignItems = "center";
    eachPop.style.justifyContent = "center";
}


editBtn.forEach((item)=>{
    item.addEventListener("click", displayMyPop);
})


// adding event listener
function displayMyPop(e) {

    if (e.target.classList.contains('edit-notes')) {
        // Extract the note ID from the data-id attribute
        const noteId = e.target.getAttribute('data-id');
    
        // Call the editNote function with the note ID
        editNote(noteId);
    }
 
}




// add new btn event listener
addNewNoteBtn.addEventListener('click', displayNewNote);

function displayNewNote(){
    newNotePop.style.display = "flex";
    newNotePop.style.flexDirection = "column";
    newNotePop.style.alignItems = "center";
    newNotePop.style.justifyContent = "center";
}

// closing the edit note pop up
let close_btn = document.querySelectorAll(".cancel-btn");
for (i = 0; i < close_btn.length; i++) {
  close_btn[i].addEventListener("click", closePopup);
}

function closePopup() {
  document.getElementById("each-note-display").style.display = "none";
}

// closing the new note pop up
let newNoteCloseBtn = document.querySelectorAll(".cancel-btn");
for (i = 0; i < close_btn.length; i++) {
  close_btn[i].addEventListener("click", closeNewNotePopup);
}

function closeNewNotePopup() {
  document.getElementById("add-new-note-pop-up").style.display = "none";
}

// code to send a POST request to delete route 
async function deleteNote(noteId) {
    try {
      const token = localStorage.getItem('mytoken'); // Use the appropriate method to retrieve the token
  
      const response = await fetch('http://localhost:3000/notes/dashboard/delete-note', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`, // Include the token in the headers
        },
        body: JSON.stringify({ noteId }), // Include NoteId in the request body
      });
  
      const result = await response.json();
      console.log(result); // Log the result (optional)
  
      // Optionally, you can reload the page or update the UI after successful deletion
      location.reload();
    } catch (error) {
      console.error('Error deleting note:', error);
    }
  }
  