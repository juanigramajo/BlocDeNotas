const titleNotes = document.getElementById('addNote');
const noteContent = document.getElementById('noteContent');
const formNote = document.getElementById('addFormNote');
const bodyTableNote = document.getElementById('tableNote');
const editTitle = document.getElementById('editTitle');
const editContent = document.getElementById('editContent');
const editedNote = document.getElementById('editEverything');
let noteID = ''



var ID = function () {
    return '_' + Math.random().toString(36).substr(2, 9);
  };


formNote.onsubmit = (e) => {
    e.preventDefault()
    const userNote = JSON.parse(localStorage.getItem('notasDeUsuarios')) || [];
    const title = titleNotes.value;
    const content = noteContent.value;
    formNote.reset()
    userNote.push ({
        id: ID(),
        tituloDeNotas: title,
        contenidoDeNotas: content,
        createdAt: Date.now()
    })
    const userNoteJSON = JSON.stringify(userNote);
    localStorage.setItem('notasDeUsuarios', userNoteJSON)
    createTable()
}

function createTable(){
    const userNote = JSON.parse(localStorage.getItem('notasDeUsuarios'));
    const objeto = []
    for (let i = 0; i < userNote.length; i++) {
        const element = userNote[i];
        const createdAt = new Date(element.createdAt)
        const tr = `
        <tr>
            <th>${element.tituloDeNotas}</th>
            <td>${element.contenidoDeNotas}</td>
            <td>
                <buttom onclick="deleteNote('${element.id}')" class="btn btn-danger"> <i class="fas fa-trash-alt"></i> </buttom>
                <buttom onclick="editNote('${element.id}')" class="btn btn-info"> <i class="far fa-edit"></i> </buttom>
            </td>
            <td>
                ${createdAt.toLocaleString()}
            </td>
        </tr>
        `
        objeto.push(tr)
    }
    bodyTableNote.innerHTML = objeto.join('')
}

function deleteNote(deleteLine) {
    const userNote = JSON.parse(localStorage.getItem('notasDeUsuarios'));
    const noteStaying = userNote.filter((n) => deleteLine !== n.id)
    const userNoteJSON = JSON.stringify(noteStaying);
    localStorage.setItem('notasDeUsuarios', userNoteJSON)
    createTable()
}

function editNote(editLine) {
    $('#modal').modal('show')
    const userNote = JSON.parse(localStorage.getItem('notasDeUsuarios')) || [];
    const editingNote = userNote.filter((n) => editLine == n.id)
    editTitle.value = editingNote[0].tituloDeNotas
    editContent.value = editingNote[0].contenidoDeNotas
    noteID = editLine
    
}

editedNote.onsubmit = (e) => {
    $('#modal').modal('hide')
    e.preventDefault()
    const newTitle = editTitle.value;
    const newContent = editContent.value;
    const userNote = JSON.parse(localStorage.getItem('notasDeUsuarios')) || [];
    const editingNote = userNote.map((n) => {
        if (noteID == n.id){
            const extraNote = {
                ...n,
                tituloDeNotas: newTitle,
                contenidoDeNotas: newContent
            }
            return extraNote
        } else {
            return n
        }
    })
    const userNoteJSON = JSON.stringify(editingNote);
    localStorage.setItem('notasDeUsuarios', userNoteJSON)
    createTable()
}

const searchForm = document.getElementById('searchForm')
const searchInput = document.getElementById('searchInput')
let timeOut;
searchInput.oninput = () => {
    clearTimeout(timeOut);
    timeOut =setTimeout(() => {
        const usersNotes = getNotes()
        const term = searchInput.value;
        const filteredNotes = usersNotes.filter(n => (
            n.noteName.toLowerCase().includes(term.toLowerCase()) 
            || n.noteTextarea.toLowerCase().includes(term.toLowerCase())
        ))
        displayNotes(filteredNotes)
    }, 1500)
}

createTable()
