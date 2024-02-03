import React from "react";
import styled from "styled-components";
import { ButtonPrimary } from '../../components/Button';

interface IncomeItemProps {
    onClaim: (e: any) => void
}

export default function IncomeItem({
    onClaim
}: IncomeItemProps) {
    return (
        <IncomeItemWrapper>
            <Row>
                <Description>LP-Token1:</Description>
                <Description>Deadline: 2024-22-22</Description>
                <Description style={{'marginLeft': 'auto'}}>Income: 23232323</Description>
            </Row>
            <Row>
                <IncomeButton onClick={() => onClaim('claim')}>Cliam</IncomeButton>
                <IncomeButton>Retracement</IncomeButton>
            </Row>
        </IncomeItemWrapper>
    )
}

const IncomeItemWrapper = styled.div`
    border-bottom: 1px solid ${({theme}) => theme.bg3};
`
const Row = styled.div`
    display: flex;
    align-items: center;
    gap: 6px;
    margin: 12px 0;
`
const IncomeButton = styled(ButtonPrimary)`
    padding: 5px 14px;
    font-size: 12px;
    border-radius: 8px;
    width: auto;
`
const Description = styled.div`
    font-size: 12px;
    color: ${({ theme }) => theme.text2}
`