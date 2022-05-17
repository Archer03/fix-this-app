export interface Note {
  id: number
  title: string
  body: string
  updated: string
}

export default class NotesAPI {
  static getAllNotes(): Note[] {
    const notes: Note[] = JSON.parse(localStorage.getItem("notesapp-notes") || "[]");

    return notes.sort((a, b) => {
      return new Date(a.updated!) > new Date(b.updated!) ? -1 : 1;
    });
  }

  static saveNote(noteToSave: { id?: Note['id'], title: Note['title'], body: Note['body'] }) {
    const notes = NotesAPI.getAllNotes();
    if (noteToSave.id) {
      // Edit/Update
      const existing = notes.find((note) => note.id === noteToSave.id);
      if (!existing) throw ('id not exists.');
      existing.title = noteToSave.title;
      existing.body = noteToSave.body;
      existing.updated = new Date().toISOString();
    } else {
      // Add
      notes.push({
        id: Math.floor(Math.random() * 1000000),
        title: noteToSave.title,
        body: noteToSave.body,
        updated: new Date().toISOString()
      });
    }

    localStorage.setItem("notesapp-notes", JSON.stringify(notes));
  }

  static deleteNote(id: number) {
    const notes = NotesAPI.getAllNotes();
    const newNotes = notes.filter((note) => note.id != id);

    localStorage.setItem("notesapp-notes", JSON.stringify(newNotes));
  }
}
