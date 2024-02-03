import React, { Fragment, useState, useCallback, useEffect, useRef } from "react";
import styled from 'styled-components';
import ethers from 'ethers';
import { ButtonPrimary, ButtonSecondary } from '../../components/Button';
import { Input as NumericalInput } from '../../components/NumericalInput'
import { Contract } from '@ethersproject/contracts'
import { useActiveWeb3React } from '../../hooks'
import { useLPContract } from '../../hooks/useContract'
import ListItem from './listItem'
import IncomeItem from "./incomeItem";
import Loader from '../../components/Loader'

interface CurrentObject {
    name?: string;
    amount?: string | number;
    showAmount?: string | number
}

export default function LP() {
    const { account, library } = useActiveWeb3React()
    const [value, setValue] = useState<number | string>('')
    const [readLoading, setReadLoading] = useState<boolean>(false)
    const [currentContract, setCurrentContract] = useState<Contract | null>(null)
    const [currentInfo, setCurrentInfo] = useState<CurrentObject>({ name: '--', showAmount: '--' })
    const isFirstLoad = useRef(true);
    const [deadlineDays, setDeadlineDays] = useState<number | string>(30)
    const [pledgeLoading, setPledgeLoading] = useState<boolean>(false)
    const LPAddress = '0x8d64F2abC7bAf00F5c845372EE7aa388Ab5a23e4'
    const LPContract = useLPContract(LPAddress)

    // token list 地址
    const tokenList = [
        '0x57b0Edf3897477A2068de53D0c53812d8a278b03',
        '0xC828727FBe8232D10C62DD359F9Aa4aD7c8B5Ea5'
    ]
    
    const handleTypeInput = useCallback(
        (value: string) => {
            setValue(value)
        },
        [value]
    )
    
    const handleTypeDay = useCallback(
        (value: string) => {
            setDeadlineDays(value)
        },
        [deadlineDays]
    )

    const handleMaxInput = () => {
        if (currentInfo) {
            setValue(currentInfo.showAmount || "");
        }
    }

    // 选择 token
    const getTokenItem = async (e: any) => {
        console.log(':::::e:', e)
        setCurrentContract(e)
        setReadLoading(true)
    }
    const handleClaim = (e: any) => {
        console.log('....>>e:', e)
    }

    const handlePledge = async () => {
        try {
            setPledgeLoading(true)
            const yieldArgs = [currentContract?.address, ethers.utils.parseEther(value.toString()).toString(), Number(deadlineDays)*60*60]
            console.log('yieldArgs::', yieldArgs)

            // let config = await LPContract?.lpTokenConfig(yieldArgs[0])
            // console.log('config:', config)
            // const gasLimit = await LPContract?.estimateGas.goYield(...yieldArgs)

            const nonce = await library?.getTransactionCount(account ?? '');
            const transaction = await LPContract?.goYield(...yieldArgs, {
                gasLimit: 300000,
                from: account, 
                nonce: nonce,
            })

            let r = await transaction.wait()

            if (r && r.status === 1) {
                setPledgeLoading(false)
                console.log("Transaction successful"); 
            } else {
                setPledgeLoading(false)
                console.error("Transaction failed");
            }
        } catch (err) {
            console.log('er:', err)
            setPledgeLoading(false)
        }
    }

    useEffect(() => {
        const fetchData = async () => {
            try {
                let name = await currentContract?.name();
                let amount = await currentContract?.balanceOf(account);
                setCurrentInfo({
                    ...currentInfo,
                    name: name,
                    amount: amount.toString(),
                    showAmount: ethers.utils.formatUnits(ethers.BigNumber.from(amount.toString()), 18),
                });
            } catch (error) {
                // 处理错误
                console.error('Error fetching data:', error);
            } finally {
                setReadLoading(false);
            }
        };

        // 初次加载时不执行
        if (!isFirstLoad.current) {
            fetchData();
        } else {
            isFirstLoad.current = false;
        }
    
    }, [currentContract])

    return (
        <Fragment>
            <LPWrapper>

                <LpList>
                    <Title>Liquidity Mining Tokens</Title>
                    {
                        tokenList.map((item: string) => {
                            return <ListItem onCheck={getTokenItem} address={item} key={item} />
                        })
                    }
                </LpList>

                <LPMain>
                    <TitleSe>Token: { readLoading ? <Loader size="12px" />  : currentInfo?.name }</TitleSe>
                    <TitleSe>Balance: { readLoading ? <Loader size="12px" />  : currentInfo?.showAmount }</TitleSe>
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
                        <DayButton onClick={() => handleTypeDay('30') }>30</DayButton>
                        <DayButton onClick={() => handleTypeDay('50') }>50</DayButton>
                        <NumericalInputWrapper
                            style={{'width': '60px', 'textAlign': 'right'}}
                            value={deadlineDays}
                            onUserInput={val => {
                                handleTypeDay(val)
                            }}
                        />
                        <Description style={{'marginTop': '10px'}}>days Deadline</Description>
                    </InputWrapper>
                    <PledgeButton onClick={() => handlePledge() } disabled={pledgeLoading}>
                        {pledgeLoading?<Loader size="14px" />:''}
                        Pledge
                    </PledgeButton>
                </LPMain>

                <RewardWrapper>
                    <Title>Pledge income</Title>
                    <IncomeWrapper>
                        {/* {
                            tokenList.map((item: number) => {
                                return <IncomeItem onClaim={handleClaim} />
                            })
                        } */}
                        <IncomeItem onClaim={handleClaim} />
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
    max-height: 340px;
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
    max-height: 340px;
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


