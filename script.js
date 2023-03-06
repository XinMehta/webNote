const addBox = document.querySelector(".add-box"),
popupBox = document.querySelector(".popup-box"),
popupTitle = popupBox.querySelector("header p"),
closeIcon = popupBox.querySelector("header i"),     // document.qS is replaced by popupbox.qS 
titleTag = popupBox.querySelector("input"),         // because its already attached 
descTag = popupBox.querySelector("textarea"),       // with header, i, input, textarea, button
addBtn = popupBox.querySelector("button");

const months = ["january", "February", "March", "April", "May", "June",
                "July", "August", "September", "October", "November", "December"]; 

// getting localstorage notes if exist and parsing them
// to js object else passing them empty array to notes
const notes = JSON.parse(localStorage.getItem("notes") || "[]" );

let isUpdate = false;
let updateId;

addBox.addEventListener("click", () => {
    titleTag.focus();
    popupBox.classList.add("show");
});

closeIcon.addEventListener("click", () => {
    isUpdate = false;
    titleTag.value = "";        // for blank on title and desc value while closing popup box
    descTag.value = ""; 
    popupTitle.innerText = "Add a New Note";
    addBtn.innerText = "Add Note";
    popupBox.classList.remove("show");
});

function showNotes(){
    document.querySelectorAll(".note").forEach(note => note.remove());              // used querySelectorAll methods and with forEach to remove duplicate note
    notes.forEach((note, index) => {
         // li Tag statement are under backtics which called String interpolate
        let liTag = `<li class="note">      
                        <div class="details">
                            <p> ${note.title} </p>
                            <span> ${note.description} </span>
                        </div>
                        <div class="bottom-content">
                            <span> ${note.date} </span>
                            <div class="settings">
                                <i onclick="showMenu(this)" class="uil uil-ellipsis-h"></i>
                                <ul class="menu">
                                    <li onclick = "updateNote(${index}, '${note.title}', '${note.description}')"><i class="uil uil-pen"></i>Edit</li> 
                                    <li onclick = "deleteNote(${index})" ><i class="uil uil-trash"></i>Delete</li> 
                                </ul>
                            </div>
                        </div>
                    </li>`
        addBox.insertAdjacentHTML("afterend", liTag);            
    });
}
showNotes();

function showMenu(elem){
    elem.parentElement.classList.add("show");
    document.addEventListener("click" , e =>{
        //removing show class from the settings menu on document click
        if(e.target.tagName != "I" || e.target != elem){
            elem.parentElement.classList.remove("show");
        }
    });
}
    

function deleteNote(noteId){
    let confirmDel = confirm("Are you sure you want to delete a note?");
    if ( !confirmDel ){
        return;
    }
    notes.splice(noteId, 1);    //removing selected note from tasks/arrays
    //saving updated notes to localStorage
    localStorage.setItem("notes", JSON.stringify(notes));
    showNotes();
}

function updateNote(noteId, title, description){
    isUpdate = true;
    updateId = noteId;
    addBox.click();
    titleTag.value = title;
    descTag.value = description;
    popupTitle.innerText = "Update a Note";
    addBtn.innerText = "Update Note";
    console.log(noteId, title, description);
}

addBtn.addEventListener("click", () => {
    let noteTitle = titleTag.value,         // get input title value
    noteDesc = descTag.value;               // get textarea description value

    if(noteTitle || noteDesc){
        // getting month day and year from the current date with using array
        let dateObj = new Date(),
        month = months[dateObj.getMonth()],         // months[] contains 12 months which is declare in getMonth to print months name 
        day = dateObj.getDay(), 
        year= dateObj.getFullYear();

        let noteInfo = {
            title: noteTitle, description: noteDesc,        // used a method of String Interpolation - Template literals provide an easy way
            date: `${month} ${day}, ${year}`                // to interpolate variables and expressions into strings Syntax as `${.....}` - ( `` called backtics)
        }
        
        if( !isUpdate ){       // conditions value should be false 
            notes.push(noteInfo);   // adding a new note to notes  & if condition is true then it will create new note while updating note
        }else{      
            notes[updateId] = noteInfo;     // updating note & if condition false it will updated on same note
        }

        // saving notes to localStorage
        localStorage.setItem("notes", JSON.stringify(notes));       // JSON.stringify is the convert object into string to store in localStorage
        closeIcon.click();      // after submitting form then popup box will disapper/close
        showNotes();
    }
});