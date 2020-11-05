import styled from 'styled-components'

export const Grid = styled.div`
text-align:center;
width:120%;
margin-left:-10%;
`

export const Row = styled.div`
display: flex;
height:300px;
`

type Column = {
    size: number;
};

export const Column = styled.div<Column>`
border: 1px solid black;
flex: ${(props) => props.size};
`

export const Table = styled.table`
border-collapse: collapse;
font-size:12px;
`
export const TableRow = styled.tr`
`

export const TableData = styled.td`
border: 1px solid black;
`
export const TableHeader = styled.th`
border: 1px solid black;
`