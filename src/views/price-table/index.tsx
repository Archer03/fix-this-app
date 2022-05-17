import { ArtColumn, BaseTable } from "ali-react-table";
import { useState } from "react";
import styled from "styled-components";
import FileDragger from "../../components/fileDragger";

const PriceTable = () => {
  const [columns, setColumns] = useState<ArtColumn[]>([]);
  const [dataSource, setDataSource] = useState<any>([]);

  const processFileStr = (result: string) => {
    const arr = result.toString().split('\r\n');
    if (!arr?.length) return;
    const header: ArtColumn[] = arr[0].split(',').map((name, index) => ({
      code: index + '',
      name,
      width: 150,
      align: 'left'
    }));
    const content = arr.slice(1).map(line => line.split(',')
      .reduce((p, v, i) => {
        p[i] = v;
        return p;
      }, ({} as any)));
    setColumns(header);
    setDataSource(content);
  }
  return <PricePageWraper>
    <FileDragger onFileDrop={processFileStr} />
    <DarkSupportBaseTable dataSource={dataSource} columns={columns}></DarkSupportBaseTable>
  </PricePageWraper>
}

export default PriceTable;

const PricePageWraper = styled.div`
  display: flex;
  flex-direction: column;
  height: calc(100vh - 60px);
  ${props => ({
    light: '',
    dark: `background-color: #333333;`
  })[props.theme.color]}
`

const DarkSupportBaseTable: any = styled(BaseTable)`
  ${props => props.theme.color === 'dark' ? `
    --bgcolor: #333;
    --header-bgcolor: #45494f;
    --hover-bgcolor: #46484a;
    --header-hover-bgcolor: #606164;
    --highlight-bgcolor: #191a1b;
    --header-highlight-bgcolor: #191a1b;
    --color: #dadde1;
    --header-color: #dadde1;
    --lock-shadow: rgb(37 37 37 / 0.5) 0 0 6px 2px;
    --border-color: #3c4045;
  ` : ``}
`