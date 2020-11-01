import styled from 'styled-components'

export const Grid = styled.div`
background:grey;
text-align:center;
`

export const Row = styled.div`
display: flex;
`

type Column = {
    size: number;
};

export const Column = styled.div<Column>`
border: 1px solid black;
flex: ${(props) => props.size};
`