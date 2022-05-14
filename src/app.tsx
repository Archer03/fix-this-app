import NotesView from "./view";
import NotesAPI, { Note } from "./api";
import { useCallback, useEffect, useState } from "react";


export default () => {
  const [notes, setNotes] = useState<Note[]>([])
  const getNotes = useCallback(() => setNotes(NotesAPI.getAllNotes()), []);

  const handlers = {
    onNoteAdd: () => {
      NotesAPI.saveNote({
        title: "新建笔记",
        body: "开始记录..."
      });
      getNotes()
    },
    onNoteEdit: (note: Omit<Note, 'updated'>) => {
      NotesAPI.saveNote(note);
      getNotes()
    },
    onNoteDelete: (noteId: number) => {
      NotesAPI.deleteNote(noteId);
      getNotes()
    }
  };
  
  useEffect(() => {
    getNotes(); // 如果是请求则要取消订阅
  }, [])
  return <NotesView notes={notes} handlers={handlers} />
}


export type Handlers = {
  onNoteAdd: () => void;
  onNoteEdit: (note: Omit<Note, 'updated'>) => void;
  onNoteDelete: (noteId: number) => void;
}