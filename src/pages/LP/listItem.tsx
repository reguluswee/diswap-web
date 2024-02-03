import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { ButtonPrimary } from '../../components/Button';
import { useTokenContract } from '../../hooks/useContract'

interface ListItemProps {
    onCheck: (e: any) => void;
    address: string;
}
export default function ListItem({
    onCheck,
    address
}: ListItemProps) {
    const [name, setName] = useState<string>('')
    const contract = useTokenContract(address)

    const readContract = async () => {
        let result = await contract?.name()
        setName(result)
    }   

    useEffect(() => {
        readContract()
    }, [])
    
    return (
        <LpItem onClick={() => {onCheck(contract)}}>
            <LpButton>{ name }</LpButton>
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

