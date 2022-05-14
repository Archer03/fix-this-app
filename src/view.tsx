import type { Handlers } from "./app";
import { useEffect, useRef, useState } from 'react';
import { Note } from "./api";
import styled from "styled-components";

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
    <NotesSideBar>
      <NoteAddBtn type="button" onClick={onNoteAdd}>添加新的笔记 📒</NoteAddBtn>
      <div>
        {
          notes.map(({ id, title, body, updated }) =>
            <NotesListItem
              key={id}
              active={id === activeNoteId}
              onClick={() => setActiveNoteId(id)}
              onDoubleClick={() => deleteNote(id)}>
              <NotesSmallTitle>{title}</NotesSmallTitle>
              <NoteSmallBody>
                {body.substring(0, MAX_BODY_LENGTH)}
                {body.length > MAX_BODY_LENGTH ? "..." : ""}
              </NoteSmallBody>
              <NotesSmallUpdate>
                {new Date(updated).toLocaleString(undefined, {
                  dateStyle: "full",
                  timeStyle: "short",
                })}
              </NotesSmallUpdate>
            </NotesListItem>)
        }
      </div>
    </NotesSideBar>

    {
      activeNote && <NotesPreview>
        <NoteTitle type="text" placeholder="新笔记..."
          ref={titleRef} onBlur={editNote} />
        <NoteBody
          ref={bodyRef} onBlur={editNote} />
      </NotesPreview>
    }
  </>
}
export default View;

const NotesSideBar = styled.div`
  border-right: 2px solid #dddddd;
  flex-shrink: 0;
  overflow-y: auto;
  padding: 1em;
  width: 300px;
`

const NoteAddBtn = styled.button`
  background: #009578;
  border: none;
  border-radius: 7px;
  color: #ffffff;
  cursor: pointer;
  font-size: 1.25em;
  font-weight: bold;
  margin-bottom: 1em;
  padding: 0.75em 0;
  width: 100%;
  &:hover {
    background: #00af8c;
  }
`

const NotesListItem = styled.div<{ active: boolean }>`
  cursor: pointer;
  border: 2px dotted;
  margin: 2px;
  border-radius: 10px;
  ${props => !props.active ? '' : `
    background: #eeeeee;
    border-radius: 7px;
    font-weight: bold;
    border-radius: 10px;
  `}
`

const Small_Title_Update = `
  padding: 10px;
`
const NotesSmallTitle = styled.div`
  ${Small_Title_Update}
  font-size: 1.2em;
`

const NotesSmallUpdate = styled.div`
  ${Small_Title_Update}
  color: #aaaaaa;
  font-style: italic;
  text-align: right;
`

const NotesPreview = styled.div`
  display: flex;
  flex-direction: column;
  padding: 2em 3em;
  flex-grow: 1;
`

const NoteSmallBody = styled.div`
  padding: 0 10px;
`

const NoteTitle_Body = `
  border: none;
  outline: none;
  width: 100%;
`
const NoteTitle = styled.input`
  ${NoteTitle_Body}
  font-size: 3em;
  font-weight: bold;
`

const NoteBody = styled.textarea`
  ${NoteTitle_Body}
  flex-grow: 1;
  font-size: 1.2em;
  line-height: 1.5;
  margin-top: 2em;
  resize: none;
`