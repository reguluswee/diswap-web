import React from "react";
import styled from "styled-components";
import { ButtonPrimary } from '../../components/Button';

const ListItem = () => {
    return (
        <LpItem>
            <LpButton>LP-Token1</LpButton>
            <Description>5% Pay</Description>
        </LpItem>
    )
}

const LpItem = styled.div`
    display: flex;
    align-items: center;
    gap: 8px;
    margin-top: 12px;
`
const LpButton = styled(ButtonPrimary)`
    padding: 5px 14px;
    font-size: 14px;
    border-radius: 8px;
    width: auto;
`
const Description = styled.div`
    font-size: 12px;
    color: ${({ theme }) => theme.text2}
`

export default ListItem