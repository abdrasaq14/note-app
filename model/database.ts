const sqlite3 = require("sqlite3").verbose();
const db = new sqlite3.Database("usersAndNote.db", (err: any) => {
  if (err) return console.log(err);
});

const user_table = `CREATE TABLE Users (
    UserId TEXT PRIMARY KEY,
    Full_name VARCHAR(50) NOT NULL,
    Gender VARCHAR(30),
    Email VARCHAR(100) NOT NULL UNIQUE,
    Phone_no CHAR(14) NOT NULL UNIQUE,
    Address VARCHAR(250),
    Password VARCHAR(255) NOT NULL

)`;

const note_table = `CREATE TABLE Notes (
    NoteId TEXT PRIMARY KEY,
    NoteCode VARCHAR(20) GENERATED ALWAYS AS ('Note' || NoteId) STORED,
    UserId TEXT,
    Title VARCHAR(255) NOT NULL,
    Description TEXT,
    DueDate DATE,
    Status VARCHAR(50),
    FOREIGN KEY (UserId) REFERENCES Users(UserId)
)`;

db.run(user_table, () => {
  console.log("user_table created successfully");
});
db.run(note_table, () => {
  console.log("note_table created successfully");
});

db.close();
