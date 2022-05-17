import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import NotesAPI, { Note } from "./api";
import styled from "styled-components";
import { ShakeCss } from "../../globalStyle";
import Dialog from "../../components/dialog";

const MAX_BODY_LENGTH = 60;

const View = () => {
  const [notes, setNotes] = useState<Note[]>([])
  const getNotes = useCallback(() => setNotes(NotesAPI.getAllNotes()), []);
  const { onNoteAdd, onNoteEdit, onNoteDelete } = useMemo(() => ({
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
  }), []);

  useEffect(() => {
    getNotes(); // 如果是请求则要取消订阅
  }, []);

  const [activeNoteId, setActiveNoteId] = useState<number | undefined>(undefined);
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
}
const NoteItemWrapper = (props: NoteItemWrapperProps) => {
  const { activeNoteId, note, setActiveNoteId, onNoteDelete } = props;
  const { id, title, body, updated } = note;
  const [isHoverDelete, setHoverDelete] = useState(false);
  const [isHoverNote, setHoverNote] = useState(false);
  const [isShowDelDialog, setShowDelDialog] = useState(false);

  const confirmDelete = () => {
    setShowDelDialog(true);
  }
  return <NotesListItem
    key={id} shaking={isHoverDelete || isShowDelDialog}
    clickActive={id === activeNoteId}
    onClick={() => setActiveNoteId(id)}
    onMouseEnter={() => setHoverNote(true)}
    onMouseLeave={() => setHoverNote(false)}>
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
    <NoteBtns isShowBtns={isHoverNote || isShowDelDialog}>
      <NotePinBtn>
        <svg viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="3491" style={{ marginTop: '40px', pointerEvents: 'none' }} width="25" height="25"><path d="M911.15102 323.918367L689.632653 102.4c-18.808163-18.808163-50.155102-20.897959-71.053061-2.089796l-267.493878 229.877551-96.130612 14.628572c-6.269388 0-12.538776 4.179592-16.718367 8.359183l-58.514286 58.514286c-20.897959 20.897959-20.897959 54.334694 0 73.142857l152.555102 152.555102L125.387755 844.277551c-12.538776 12.538776-12.538776 31.346939 0 43.885714 6.269388 6.269388 14.628571 10.44898 20.897959 10.44898s16.718367-2.089796 22.987755-8.359184l204.8-204.8 152.555102 152.555102c10.44898 10.44898 22.987755 14.628571 37.616327 14.628572s27.167347-6.269388 37.616326-14.628572l58.514286-58.514285c4.179592-4.179592 8.359184-10.44898 8.359184-16.718368l14.628571-96.130612 227.787755-267.493878c18.808163-25.077551 18.808163-56.42449 0-75.232653zM631.118367 629.028571c-4.179592 4.179592-6.269388 10.44898-6.269387 14.628572l-14.628572 94.040816-45.97551 45.97551-334.367347-334.367347 43.885714-43.885714 94.040817-14.628571c6.269388 0 10.44898-4.179592 14.628571-6.269388l269.583674-229.877551 206.889795 206.889796-227.787755 267.493877z" p-id="3492" fill="#ffffff"></path></svg>
      </NotePinBtn>
      <NoteDeleteBtn
        onMouseEnter={() => setHoverDelete(true)}
        onMouseLeave={() => setHoverDelete(false)}
        onClick={() => confirmDelete()}>
        <svg viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1395" style={{ marginTop: '40px', pointerEvents: 'none' }} width="25" height="25"><path d="M398.753773 834.390571c-10.326183 0-18.696828-8.370645-18.696828-18.696828L380.056945 328.657298c0-10.326183 8.370645-18.696828 18.696828-18.696828s18.696828 8.370645 18.696828 18.696828l0 487.036445C417.4506 826.019926 409.079956 834.390571 398.753773 834.390571z" p-id="1396" fill="#ffffff"></path><path d="M633.890095 834.390571c-10.326183 0-18.696828-8.370645-18.696828-18.696828L615.193267 328.657298c0-10.326183 8.370645-18.696828 18.696828-18.696828s18.696828 8.370645 18.696828 18.696828l0 487.036445C652.586922 826.019926 644.216277 834.390571 633.890095 834.390571z" p-id="1397" fill="#ffffff"></path><path d="M710.574614 985.684346c-4.027733 0-8.083096-1.295506-11.500938-3.967358-26.988678-21.096481-80.083943-25.731034-98.264001-25.735128l-27.973098 0c-0.036839 0-0.073678 0-0.109494 0l-39.437198-0.233314L233.780441 955.748546c-0.335644 0-0.670266-0.00921-1.00591-0.026606-22.538319-1.214664-35.687804-11.190877-42.74964-19.345604-15.238053-17.596773-14.937201-40.310078-14.603603-45.898353L175.421288 248.768807c0-10.326183 8.370645-18.696828 18.696828-18.696828s18.696828 8.370645 18.696828 18.696828l0 642.355907c0 0.660032 0 0.968048-0.066515 1.597381-0.212848 3.461845 0.393973 13.353123 5.653767 19.300578 3.352351 3.791349 8.56405 5.863545 15.921621 6.332219l299.029514 0c0.036839 0 0.073678 0 0.109494 0l39.437198 0.233314 27.913746 0c3.199878 0.001023 78.735226 0.404206 121.287367 33.667797 8.135284 6.359848 9.575076 18.10945 3.216251 26.244734C721.630415 983.217155 716.130144 985.684346 710.574614 985.684346z" p-id="1398" fill="#ffffff"></path><path d="M798.810215 955.980837l-24.01495 0c-10.326183 0-18.696828-8.370645-18.696828-18.696828s8.370645-18.696828 18.696828-18.696828l21.841447 0c0.64059-0.102331 1.287319-0.170892 1.937119-0.205685 7.676843-0.413416 13.07069-2.534729 16.490579-6.483668 6.093788-7.039323 5.560646-18.983353 5.550413-19.097964-0.050142-0.556679-0.074701-1.116427-0.074701-1.676176L820.540122 248.768807c0-10.326183 8.370645-18.696828 18.696828-18.696828l49.27117 0c0.075725 0 0.12075 0 0.172939-0.00307 0.047072-0.00307-0.020466-0.007163 0.063445-0.002047 6.862291-0.254803 6.854105-4.354168 6.847965-7.356548l0-92.054579c0-3.504824-2.849908-6.356778-6.352685-6.356778l-214.925001 0c-5.02034 0.021489-42.351574-0.751107-71.783907-32.649608-0.141216-0.152473-0.278339-0.306992-0.413416-0.463558-9.723455-11.266601-23.842011-17.33276-41.968857-18.031679l-86.940095 0c-18.124799 0.698918-32.240285 6.764054-41.961694 18.030655-0.1361 0.157589-0.274246 0.312108-0.415462 0.464581-29.434379 31.898501-66.768683 32.68133-71.785953 32.649608L144.119375 124.298957c-3.504824 0-6.355755 2.851954-6.355755 6.356778l0 92.015693c-0.00614 3.038196-0.013303 7.140631 6.852058 7.394411 0.086981-0.00614 0.017396-0.001023 0.062422 0.002047 0.052189 0.002047 0.095167 0.002047 0.172939 0.00307l49.2681 0c10.326183 0 18.696828 8.370645 18.696828 18.696828s-8.370645 18.696828-18.696828 18.696828l-49.134047 0c-3.726881 0.057305-19.807115-0.533143-32.124651-12.625552-5.714142-5.610788-12.521175-15.752776-12.489452-32.202423l0-91.980901c0-24.12342 19.62599-43.750433 43.74941-43.750433l214.997656 0c0.289596 0 0.270153-0.005117 0.499373 0.005117 1.973958 0 24.966625-0.446162 43.546795-20.420075 11.642155-13.380752 33.026184-29.455869 69.042469-30.719652 0.218988-0.008186 0.436952-0.01228 0.655939-0.01228l87.62878 0c0.218988 0 0.436952 0.004093 0.655939 0.01228 36.020378 1.263783 57.405431 17.337877 69.049632 30.718629 18.577101 19.971867 41.568744 20.420075 43.545772 20.420075 0.230244-0.011256 0.210801-0.005117 0.499373-0.005117l214.998679 0c24.121374 0 43.745317 19.627013 43.745317 43.750433l0 92.015693c0.032746 16.412808-6.771217 26.554796-12.486382 32.166607-12.317537 12.094456-28.389584 12.67774-32.124651 12.626575l-30.441313 0 0 623.010303c0.334621 5.586229 0.638543 28.300556-14.59951 45.899376-6.843872 7.904017-19.404955 17.519002-40.690748 19.208481C801.38383 955.847807 800.09958 955.980837 798.810215 955.980837z" p-id="1399" fill="#ffffff"></path></svg>
      </NoteDeleteBtn>
    </NoteBtns>
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
  margin-bottom: 1em;
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
  overflow: hidden;
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
`

const NotesSmallUpdate = styled.div`
  ${Small_Title_Update}
  color: #aaaaaa;
  font-style: italic;
  text-align: right;
`


const NoteSmallBody = styled.div`
  padding: 0 10px;
`

const NotePinBtn = styled.div`
  background-color: ${props => ({
    light: '#fffa65',
    dark: '#F9F871'
  })[props.theme.color]};
  width: var(--btnCardWidth);
  `

const NoteDeleteBtn = styled.div`
  background-color: ${props => ({
    light: '#ff4d4d',
    dark: '#F35373'
  })[props.theme.color]};
  width: var(--btnCardWidth);
`

const NoteBtns = styled.div<{ isShowBtns: boolean }>`
  --btnCardWidth: 40px;
  position: absolute;
  top: 0;
  right: calc(0px - var(--btnCardWidth) * 2);
  width: calc(var(--btnCardWidth) * 2);
  height: 100%;
  display: flex;
  transition: right 0.2s ease;
  ${props => props.isShowBtns && `right: 0;`}
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