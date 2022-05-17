import { useState } from "react";
import styled from "styled-components";

const PriceTable = () => {
  const [isDragIn, setDragIn] = useState(false);
  const [file, setFile] = useState<File>();
  const readFile: React.DragEventHandler<HTMLDivElement> = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    setFile(file);
    console.log(file);
  }
  return <>
    <DragToUpload isHighlight={isDragIn}
      onDragEnter={() => setDragIn(true)}
      onDragLeave={() => setDragIn(false)}
      onDragOver={e => e.preventDefault()}
      onDrop={readFile}
    >
      {file ? file.name : '拖动文件到这里'}
    </DragToUpload>
  </>
}

export default PriceTable;

const DragToUpload = styled.div<{ isHighlight?: boolean }>`
  height: 100px;
  line-height: 100px;
  border: 4px dashed ${props => props.isHighlight ? `aqua` : `#eeeeee`};
  text-align: center;
  margin: 20px 200px;
  font-size: x-large;
  border-radius: 10px;
`