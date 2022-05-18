export interface Note {
  id: number
  title: string
  body: string
  updated: string
  isPined: boolean
}

export default class NotesAPI {
  static getAllNotes(): Note[] {
    const notes: Note[] = JSON.parse(localStorage.getItem("notesapp-notes") || "[]");

    return notes.sort((a, b) => {
      if (a.isPined && !b.isPined) return -1;
      if (!a.isPined && b.isPined) return 1;
      return new Date(a.updated) > new Date(b.updated) ? -1 : 1;
    });
  }

  static #updateNote(noteToSave: Partial<Note>, isUpdateTime: boolean) {
    const notes = NotesAPI.getAllNotes();
    if (noteToSave.id) {
      // Edit/Update
      const existing = notes.find((note) => note.id === noteToSave.id);
      if (!existing) throw ('id not exists.');
      existing.title = noteToSave.title ?? existing.title;
      existing.body = noteToSave.body ?? existing.body;
      existing.isPined = noteToSave.isPined ?? existing.isPined;
      if (isUpdateTime) {
        existing.updated = new Date().toISOString();
      }
    } else {
      // Add
      notes.push({
        id: Math.floor(Math.random() * 1000000),
        title: noteToSave.title ?? '',
        body: noteToSave.body ?? '',
        isPined: noteToSave.isPined ?? false,
        updated: new Date().toISOString()
      });
    }

    localStorage.setItem("notesapp-notes", JSON.stringify(notes));
  }

  static addNote(noteToAdd: Partial<Omit<Note, 'id'>>) {
    this.#updateNote(noteToAdd, true);
  }

  static editNote(noteToSave: Partial<Omit<Note, 'isPined'>> & { id: number }) {
    this.#updateNote(noteToSave, true);
  }

  static pinNote(id: number, isPined: boolean) {
    this.#updateNote({ id, isPined }, false);
  }

  static deleteNote(id: number) {
    const notes = NotesAPI.getAllNotes();
    const newNotes = notes.filter((note) => note.id != id);

    localStorage.setItem("notesapp-notes", JSON.stringify(newNotes));
  }
}
