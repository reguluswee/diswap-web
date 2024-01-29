import React, { Fragment, useState, useCallback } from "react";
import styled from 'styled-components';
import { ButtonPrimary, ButtonSecondary } from '../../components/Button';
import { Input as NumericalInput } from '../../components/NumericalInput'
import ListItem from './listItem'

export default function LP() {
    const [value, setValue] = useState<number | string>('')
    const [day, setDay] = useState<number | string>(30)
    
    const handleTypeInput = useCallback(
        (value: string) => {
            setValue(value)
        },
        [value]
    )
    
    const handleTypeDay = useCallback(
        (value: string) => {
            setDay(value)
        },
        [day]
    )

    const handleMaxInput = useCallback(() => {
        // TODO:
    }, [value])

    return (
        <Fragment>
            <LPWrapper>

                <LpList>
                    <Title>Liquidity Mining Tokens</Title>
                    <ListItem />
                    <LpItem>
                        <LpButton>LP-Token1</LpButton>
                        <Description>5% Pay</Description>
                    </LpItem>
                    <LpItem>
                        <LpButton>LP-Token1</LpButton>
                        <Description>5% Pay</Description>
                    </LpItem>
                </LpList>

                <LPMain>
                    <TitleSe>Token: LP-Token1</TitleSe>
                    <TitleSe>LP Balance: 121212</TitleSe>
                    <InputWrapper>
                        <NumericalInputWrapper
                            className="amount-input"
                            value={value}
                            onUserInput={val => {
                                handleTypeInput(val)
                            }}
                        />
                        <StyledBalanceMax onClick={handleMaxInput}>MAX</StyledBalanceMax>
                    </InputWrapper>
                    <InputWrapper>
                        <DayButton onClick={handleMaxInput}>30</DayButton>
                        <DayButton onClick={handleMaxInput}>50</DayButton>
                        <NumericalInputWrapper
                            style={{'width': '60px', 'textAlign': 'right'}}
                            value={day}
                            onUserInput={val => {
                                handleTypeDay(val)
                            }}
                        />
                        <Description style={{'marginTop': '10px'}}>days Deadline</Description>
                    </InputWrapper>
                    <PledgeButton>Pledge</PledgeButton>
                </LPMain>

                <RewardWrapper>
                    <Title>Pledge income</Title>
                    <IncomeWrapper>
                        <IncomeItemWrapper>
                            <IncomeItem>
                                <Description>LP-Token1:</Description>
                                <Description>Deadline: 2024-22-22</Description>
                                <Description style={{'marginLeft': 'auto'}}>Income: 23232323</Description>
                            </IncomeItem>
                            <IncomeItem>
                                <IncomeButton>Cliam</IncomeButton>
                                <IncomeButton>Retracement</IncomeButton>
                            </IncomeItem>
                        </IncomeItemWrapper>
                        <IncomeItemWrapper>
                            <IncomeItem>
                                <Description>LP-Token1:</Description>
                                <Description>Deadline: 2024-22-22</Description>
                                <Description style={{'marginLeft': 'auto'}}>Income: 23232323</Description>
                            </IncomeItem>
                            <IncomeItem>
                                <IncomeButton>Cliam</IncomeButton>
                                <IncomeButton>Retracement</IncomeButton>
                            </IncomeItem>
                        </IncomeItemWrapper>
                        <IncomeItemWrapper>
                            <IncomeItem>
                                <Description>LP-Token1:</Description>
                                <Description>Deadline: 2024-22-22</Description>
                                <Description style={{'marginLeft': 'auto'}}>Income: 23232323</Description>
                            </IncomeItem>
                            <IncomeItem>
                                <IncomeButton>Cliam</IncomeButton>
                                <IncomeButton>Retracement</IncomeButton>
                            </IncomeItem>
                        </IncomeItemWrapper>
                    </IncomeWrapper>
                </RewardWrapper>
            </LPWrapper>
        </Fragment>
    )
}

const LPWrapper = styled.div`
    width: 88%;
    display: flex;
    background: ${({ theme }) => theme.bg1};
    box-sizing: border-box;
    border-radius: 12px;
    padding: 64px 8px;
    gap: 24px;
`
const LpList = styled.div`
    width: 33%;
    padding: 0 12px;
    overflow-y: scroll;
`
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
const Title = styled.div`
    font-size: 18px;
    font-weight: bold;
    line-height: 1.4;
`
const TitleSe = styled.div`
    font-size: 13px;
    font-weight: bold;
    line-height: 2;
    color: ${({ theme }) => theme.text2}
`
const Description = styled.div`
    font-size: 12px;
    color: ${({ theme }) => theme.text2}
`

const LPMain = styled.div`
    width: 420px;
    border: 1px solid ${({ theme }) => theme.primary1};
    border-radius: 24px;
    padding: 24px;
`
const InputWrapper = styled.div`
    display: flex;
    align-items: center;
    border: 1px solid ${({ theme }) => theme.bg3};
    border-radius: 24px;
    padding: 10px;
    margin-top: 10px;
    gap: 12px;
`
const NumericalInputWrapper = styled(NumericalInput)`
    height: 42px;
    width: 100px;
`
const PledgeButton = styled(ButtonPrimary)`
    padding: 16px 14px;
    font-size: 14px;
    border-radius: 8px;
    width: 100%;
    margin-top: 12px;
`
const DayButton = styled(ButtonSecondary)`
    flex: 1;
    height: 30px;
`

const RewardWrapper = styled.div`
    width: 33%;
`
const IncomeWrapper = styled.div`
    overflow-y: scroll;
`
const IncomeItemWrapper = styled.div`
    border-bottom: 1px solid ${({theme}) => theme.bg3};
`
const IncomeItem = styled.div`
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
const StyledBalanceMax = styled.button`
  height: 30px;
  background-color: ${({ theme }) => theme.primary5};
  border: 1px solid ${({ theme }) => theme.primary5};
  border-radius: 0.5rem;
  font-size: 0.875rem;

  font-weight: 500;
  cursor: pointer;
  margin-right: 0.5rem;
  color: ${({ theme }) => theme.primaryText1};
  :hover {
    border: 1px solid ${({ theme }) => theme.primary1};
  }
  :focus {
    border: 1px solid ${({ theme }) => theme.primary1};
    outline: none;
  }

  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
    margin-right: 0.5rem;
  `};
`


