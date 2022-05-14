import type { Handlers } from "./app";
import { useEffect, useRef, useState } from 'react';
import { Note } from "./api";

const MAX_BODY_LENGTH = 60;

type ViewProps = {
  notes: Note[]
  handlers: Handlers
}
const View = (props: ViewProps) => {
  const { notes, handlers } = props;
  const { onNoteAdd, onNoteDelete, onNoteEdit } = handlers;

  const [activeNoteId, setActiveNoteId] = useState<number | null>(null);
  const activeNote = notes.find(note => note.id === activeNoteId);

  useEffect(() => {
    if (notes.length) {
      setActiveNoteId(notes[0].id);
    }
  }, [notes.length]);

  useEffect(() => {
    if (activeNote) {
      titleRef.current!.value = activeNote.title;
      bodyRef.current!.value = activeNote.body;
    }
  }, [activeNote]);

  const deleteNote = (noteId: number) => {
    const doDelete = confirm("确认要删除该笔记吗?");
    if (doDelete) {
      onNoteDelete(noteId);
    }
  }
  const editNote = () => {
    const title = titleRef.current!.value.trim();
    const body = bodyRef.current!.value.trim();
    onNoteEdit({ id: activeNoteId!, title, body });
  }

  const titleRef = useRef<HTMLInputElement>(null);
  const bodyRef = useRef<HTMLTextAreaElement>(null);
  return <>
    <div className="notes__sidebar">
      <button className="notes__add" type="button" onClick={onNoteAdd}>添加新的笔记 📒</button>
      <div className="notes__list">
        {
          notes.map(({ id, title, body, updated }) => <div key={id}
            className={`notes__list-item ${id === activeNoteId ? 'notes__list-item--selected' : ''}`}
            onClick={() => setActiveNoteId(id)} onDoubleClick={() => deleteNote(id)}>
            <div className="notes__small-title">{title}</div>
            <div className="notes__small-body">
              {body.substring(0, MAX_BODY_LENGTH)}
              {body.length > MAX_BODY_LENGTH ? "..." : ""}
            </div>
            <div className="notes__small-updated">
              {new Date(updated).toLocaleString(undefined, {
                dateStyle: "full",
                timeStyle: "short",
              })}
            </div>
          </div>)
        }
      </div>
    </div>

    {
      activeNote && <div className="notes__preview">
        <input className="notes__title" type="text" placeholder="新笔记..."
          ref={titleRef} onBlur={editNote} />
        <textarea className="notes__body"
          ref={bodyRef} onBlur={editNote} />
      </div>
    }
  </>
}
export default View;