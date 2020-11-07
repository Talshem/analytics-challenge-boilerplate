import styled from 'styled-components'

export const Grid = styled.div`
text-align:center;
width:140%;
margin-left:-20%;
`

export const Row = styled.div`
display: flex;
height:480px;
`

type Column = {
    size: number;
};

export const Column = styled.div<Column>`
border: 1px solid #e9e9e9;
flex: ${(props) => props.size};
`

export const Table = styled.table`
border-collapse: collapse;
font-size:16px;
width:100%;
height:84%
`
export const TableRow = styled.tr`
`

interface TableDataProps {
retention?: number,
}

export const TableData = styled.td<TableDataProps>`
border: 2px solid #e9e9e9;
background: ${props => !props.retention ? 'white' : props.retention > 75 ? '#3B68BE' : props.retention > 50 ? '#749DEB' : props.retention > 25 ? '#AAD1F9' : '#CEE6FF'}
`
export const TableHeader = styled.th`
border: 2px solid #e9e9e9;
background: #f0f0f0;
padding: 10px;
`