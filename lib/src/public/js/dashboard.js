// stickerheader header begins
window.addEventListener("scroll", function () {
  const header = document.getElementById("header");
  const headerOffset = header.offsetHeight;

  if (window.scrollY > headerOffset) {
    header.classList.add("sticky-header");
  } else {
    header.classList.remove("sticky-header");
  }
});
// sticky heaer ends

// night-mode function begins
const nightMode = document.getElementById("night-mode");
const dayMode = document.getElementById("day-mode");
const bodyElement = document.getElementById("body");
document.addEventListener("DOMContentLoaded", function () {
  dayMode.style.display = "none";
});
nightMode.addEventListener("click", function () {
  changeBodyBackground();
});

dayMode.addEventListener("click", function () {
  changeBodyBackground();
});

function changeBodyBackground() {
  nightMode.style.display =
    nightMode.style.display === "none" ? "inline-block" : "none";
  dayMode.style.display =
    dayMode.style.display === "inline-block" ? "none" : "inline-block";

  bodyElement.classList.toggle("changeBackground");
}
// night mode function ends

// logout function begins
async function clearCookieAndRedirect() {
  try {
    const response = await fetch("/users/logout", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });

    /*reload the notes page after the post request
     so that the session cleared and take effect 
     and redirect to login page
    */
    location.reload();
    /*
    Now this redirect to the homepage
    */
    window.location.href = "/";
  } catch (error) {}
}
// logout function ends

// function to display edit note pop up
const editBtn = document.querySelectorAll(".edit-notes");
const popup = document.getElementById("each-note-display");
editBtn.forEach((btn) => {
  const form = popup.querySelector("form");
  btn.addEventListener("click", function displayEditPop() {
    const noteData = JSON.parse(btn.dataset.note);

    // Set default values in the form fields
    form.title.value = noteData.Title;
    form.description.value = noteData.Description;
    form.dueDate.value = noteData.DueDate;
    form.status.value = noteData.Status;
    form.noteId.value = noteData.NoteId;

    // set display
    popup.style.display = "flex";
  });
  const cancelButton = form.querySelectorAll(".cancel-btn");
  cancelButton.forEach((btn) => {
    btn.addEventListener("click", function closePopup(event) {
      event.preventDefault();
      popup.style.display = "none";
    });
  });
  form.addEventListener("submit", async function (event) {
    event.preventDefault(); // Prevent the default form submission behavior

    // Get form data
    const formData = new FormData(form);
    console.log(formData);

    // Convert FormData to a plain object
    const formDataObject = {};
    formData.forEach((value, key) => {
      formDataObject[key] = value;
    });

    // Make a POST request using Fetch API
    await submitForm(formDataObject);
  });
});
// closing the edit note pop up

// Handle form submission

async function submitForm(formDataObject) {
  // Make a POST request using Fetch API
  fetch("/notes/dashboard/edit", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(formDataObject),
    credentials: "include",
  })
    .then((response) => response.json())
    .then((data) => {
      // closing the pop up
      popup.style.display = "none";
      // referesh the page to see updates
      location.reload();
    })
    .catch((error) => console.error("Error:", error));
}

// add new btn event listener
const addNewNoteBtn = document.getElementById("add-new-notes");
const newNotePop = document.getElementById("add-new-note-pop-up");

addNewNoteBtn.addEventListener("click", displayNewNote);

function displayNewNote() {
  newNotePop.style.display = "flex";
  // closing the new note pop up
  let newNoteCloseBtn = document.querySelectorAll(".cancel-btn");
  for (i = 0; i < newNoteCloseBtn.length; i++) {
    newNoteCloseBtn[i].addEventListener("click", closeNewNotePopup);
  }

  function closeNewNotePopup() {
    document.getElementById("add-new-note-pop-up").style.display = "none";
  }
}

// code to send a POST request to delete route
async function deleteNote(noteId) {
  try {
    const token = localStorage.getItem("mytoken");
    const response = await fetch("/notes/dashboard/delete-note", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`, // Include the token in the headers
      },
      body: JSON.stringify({ noteId }), // Include NoteId in the request body
    });

    const result = await response.json();
    console.log(result); // Log the result (optional)

    // Optionally, you can reload the page or update the UI after successful deletion
    location.reload();
  } catch (error) {
    console.error("Error deleting note:", error);
  }
}
