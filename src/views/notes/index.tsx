import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import NotesAPI, { Note } from "./api";
import styled from "styled-components";
import { ShakeCss } from "../../globalStyle";
import Dialog from "../../components/dialog";
import { ReactComponent as DeleteSvg } from "../../assets/svg/delete_fill.svg";
import { ReactComponent as PinSvg } from "../../assets/svg/pin-fill.svg";
import { ReactComponent as PaintPinSvg } from "../../assets/svg/pushpin.svg";

const View = () => {
  const [notes, setNotes] = useState<Note[]>([]);
  const getNotes = useCallback(() => setNotes(NotesAPI.getAllNotes()), []);
  const { onNoteAdd, onNoteEdit, onNoteDelete, onNotePin } = useMemo(() => ({
    onNoteAdd: () => {
      NotesAPI.addNote({
        title: "新建笔记",
        body: "开始记录..."
      });
      getNotes()
    },
    onNoteEdit: (note: Parameters<typeof NotesAPI.editNote>[0]) => {
      NotesAPI.editNote(note);
      getNotes()
    },
    onNoteDelete: (noteId: number) => {
      NotesAPI.deleteNote(noteId);
      getNotes()
    },
    onNotePin: (noteId: number, isPined: boolean) => {
      NotesAPI.pinNote(noteId, isPined);
      getNotes()
    }
  }), []);

  useEffect(() => {
    getNotes(); // 如果是请求则要取消订阅
  }, []);

  const [activeNoteId, setActiveNoteId] = useState<number>();
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

  const editNote = () => {
    const title = titleRef.current!.value.trim();
    const body = bodyRef.current!.value.trim();
    onNoteEdit({ id: activeNoteId!, title, body });
  }

  const titleRef = useRef<HTMLInputElement>(null);
  const bodyRef = useRef<HTMLTextAreaElement>(null);
  return <>
    <NoteViewLayout>
      <NotesSideBar>
        <NoteAddBtn onClick={onNoteAdd}>添加新的笔记 📒</NoteAddBtn>
        <NoteScroll>
          {
            notes.map((note) =>
              <NoteItemWrapper note={note} key={note.id}
                activeNoteId={activeNoteId}
                setActiveNoteId={setActiveNoteId}
                onNoteDelete={onNoteDelete}
                onNotePin={onNotePin}
              />
            )
          }
        </NoteScroll>
      </NotesSideBar>

      {
        activeNote && <NotesPreview>
          <NoteTitle>
            <input type="text" placeholder="新笔记..." ref={titleRef} />
            <NoteSaveBtn title="保存" onClick={editNote} />
          </NoteTitle>
          <NoteBody ref={bodyRef} />
        </NotesPreview>
      }
    </NoteViewLayout>
  </>
}
export default View;


type NoteItemWrapperProps = {
  activeNoteId?: number
  note: Note
  setActiveNoteId: (id: number) => void
  onNoteDelete: (id: number) => void
  onNotePin: (id: number, isPined: boolean) => void
}
const NoteItemWrapper = (props: NoteItemWrapperProps) => {
  const { activeNoteId, note, setActiveNoteId, onNoteDelete, onNotePin } = props;
  const { id, title, body, updated, isPined } = note;
  const [isHoverDelete, setHoverDelete] = useState(false);
  const [isHoverNote, setHoverNote] = useState(false);
  const [isShowDelDialog, setShowDelDialog] = useState(false);
  const pinNoteClick = (e: React.MouseEvent, noteId: number, toPin: boolean) => {
    onNotePin(noteId, toPin);
    setHoverNote(false);
    e.stopPropagation();
  }
  const confirmDelete = () => {
    setShowDelDialog(true);
  }
  return <NotesListItem
    key={id} shaking={isHoverDelete || isShowDelDialog}
    clickActive={id === activeNoteId}
    onClick={() => setActiveNoteId(id)}
    onMouseEnter={() => setHoverNote(true)}
    onMouseLeave={() => setHoverNote(false)}>
    {isPined && <RightCornerPin onClick={e => pinNoteClick(e, id, false)}>
      <PaintPinSvg width="40" height="40" />
    </RightCornerPin>}
    <NotesSmallTitle>{title}</NotesSmallTitle>
    <NoteSmallBody>
      {body}
    </NoteSmallBody>
    <NotesSmallUpdate>
      {new Date(updated).toLocaleString(undefined, {
        dateStyle: "full",
        timeStyle: "short",
      })}
    </NotesSmallUpdate>
    <NoteBtnArea>
      {!isPined && <NotePinBtn
        isShowBtns={isHoverNote || isShowDelDialog}
        onClick={(e) => pinNoteClick(e, id, true)} >
        <PinSvg width="30" height="30" style={{ marginTop: '45px' }} />
      </NotePinBtn>}
      <NoteDeleteBtn
        isShowBtns={isHoverNote || isShowDelDialog}
        onMouseEnter={() => setHoverDelete(true)}
        onMouseLeave={() => setHoverDelete(false)}
        onClick={() => confirmDelete()}>
        <DeleteSvg width="25" height="25" style={{ marginTop: '47px' }} />
      </NoteDeleteBtn>
    </NoteBtnArea>
    <Dialog
      visible={isShowDelDialog}
      height={150}
      width={350}
      title={'确认删除笔记吗？'}
      onCancel={() => setShowDelDialog(false)}
      onOk={() => {
        setShowDelDialog(false);
        onNoteDelete(id);
      }} />
  </NotesListItem>
}

const NoteViewLayout = styled.div`
  display: flex;
  height: calc(100vh - 60px);
`

const NotesSideBar = styled.div`
  border-right: 2px solid #dddddd;
  flex-shrink: 0;
  padding: 1em;
  box-sizing: border-box;
  width: 300px;
  height: 95%;
  display: flex;
  flex-direction: column;
`

const NoteScroll = styled.div`
  overflow-y: auto;
  overflow-x: hidden;
  width:106%;
  padding-top: 20px;
  ::-webkit-scrollbar {
      width: 8px;
  }
  ::-webkit-scrollbar-track {
      background-color: transparent;
      -webkit-border-radius: 2em;
      -moz-border-radius: 2em;
      border-radius:2em;
  }
  ::-webkit-scrollbar-thumb {
      background-color:#ccc;
      -webkit-border-radius: 2em;
      -moz-border-radius: 2em;
      border-radius:2em;
  }
  ::-webkit-scrollbar-thumb:hover {
    background-color: #d5d5d5;
  }
`

const NoteAddBtn = styled.button`
  background-image: ${({ theme }) => {
    const gradient = {
      light: 'linear-gradient(to right, #02AAB0 0%, #00CDAC  51%, #02AAB0  100%)',
      // dark: 'linear-gradient(to right, #FEAC5E 0%, #C779D0  51%, #FEAC5E  100%)'
      dark: 'linear-gradient(to right, #fc00ff 0%, #00dbde  51%, #fc00ff  100%)'
    }
    return gradient[theme.color];
  }};
  text-transform: uppercase;
  transition: 0.5s;
  background-size: 200% auto;
  color: white;
  display: block;
  border: none;
  border-radius: 7px;
  cursor: pointer;
  font-size: 1.25em;
  font-weight: bold;
  padding: 0.75em 0;
  width: 100%;
  &:hover {
    background-position: right center; /* change the direction of the change here */
    color: #fff;
    text-decoration: none;
  }
`

const NotesListItem = styled.div<{ clickActive: boolean, shaking: boolean }>`
  position: relative;
  width: 94%;
  cursor: pointer;
  border: 2px dotted;
  margin: 2px;
  border-radius: 10px;
  ${props => props.shaking && ShakeCss}
  ${props => props.clickActive && `
    font-weight: bold;
    background-image: linear-gradient${{
      light: `(315deg, #eeeeee 0%, #b3cdd185 74%);`,
      dark: `(315deg, #045de9 0%, #11b0ffd6 74%);`
    }[props.theme.color]}
  `}
  &:hover {
    background-color: ${props => ({
    light: `#eeeeee`,
    dark: `#ced6e075`
  }[props.theme.color])};
  }
`

const Small_Title_Update = `
  padding: 10px;
`
const NotesSmallTitle = styled.div`
  ${Small_Title_Update}
  font-size: 1.2em;
  text-align: left;
`

const NotesSmallUpdate = styled.div`
  ${Small_Title_Update}
  color: #aaaaaa;
  font-style: italic;
  text-align: right;
`

const NoteSmallBody = styled.div`
  padding: 0 10px;
  text-align: left;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
`

const RightCornerPin = styled.div`
  position: absolute;
  display: inline-block;
  right: -16px;
  top: -16px;
  z-index: 1;
  height: 40px;
`

const NotePinBtn = styled.div<{ isShowBtns: boolean }>`
  background-color: ${props => ({
    light: '#fffa65',
    dark: '#F9F871'
  })[props.theme.color]};
  position: absolute;
  width: var(--btnCardWidth);
  height: 100%;
  right: calc(0px - var(--btnCardWidth));
  transition: right 0.23s;
  ${props => props.isShowBtns && `right: var(--btnCardWidth);`}
`

const NoteDeleteBtn = styled.div<{ isShowBtns: boolean }>`
  background-color: ${props => ({
    light: '#ff4d4d',
    dark: '#F35373'
  })[props.theme.color]};
  position: absolute;
  width: var(--btnCardWidth);
  height: 100%;
  right: calc(0px - var(--btnCardWidth));
  transition: right 0.23s;
  ${props => props.isShowBtns && `right: 0;`}
`

const NoteBtnArea = styled.div`
  --btnCardWidth: 40px;
  width: calc(var(--btnCardWidth) * 2);
  position: absolute;
  overflow: hidden;
  top: 0;
  right: 0;
  height: 100%;
  border-radius: 3px 10px 10px 3px;
`

const NotesPreview = styled.div`
  display: flex;
  flex-direction: column;
  padding: 2em 3em;
  flex-grow: 1;
  background-color: ${props => ({
    light: '#f7f4f4',
    dark: '#adb2cd'
  })[props.theme.color]};
  border: f7f4f4 solid 20px;
  border-radius: 20px;
  margin: 20px 30px 30px 30px;
`

const NoteSaveBtn = styled.div`
  cursor: pointer;
  display: flex;
  width: 2.5em;
  height: 2.5em;
  border: 3px solid transparent;
  border-top-color: ${props => ({
    light: '#3cefff',
    dark: '#fc2f70'
  })[props.theme.color]};
  border-bottom-color: ${props => ({
    light: '#3cefff',
    dark: '#fc2f70'
  })[props.theme.color]};
  border-radius: 50%;
  animation: spin 1.5s linear infinite;
  animation-play-state: paused;
  &:hover {
    animation-play-state: running;
    &::before {
      animation-play-state: running;
    }
  }

  &::before {
    content: '';
    display: block;
    margin: auto;
    width: 1.25em;
    height: 1.25em;
    border: 3px solid ${props => ({
    light: '#3cefff',
    dark: '#fc2f70'
  })[props.theme.color]};
    border-radius: 50%;
    animation: pulse 1s alternate ease-in-out infinite;
    animation-play-state: paused;
  }

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }

  @keyframes pulse {
    from {
      transform: scale(0.5);
    }
    to {
      transform: scale(0.8);
    }
  }
`

const NoteTitle_Body = `
  border: none;
  outline: none;
  width: 100%;
  background-color: transparent;
`
const NoteTitle = styled.div`
  display: flex;
  input {
    ${NoteTitle_Body}
    font-size: 3em;
    font-weight: bold;
  }
`

const NoteBody = styled.textarea`
  ${NoteTitle_Body}
  flex-grow: 1;
  font-size: 1.2em;
  line-height: 1.5;
  margin-top: 2em;
  resize: none;
`