import React, { Fragment, useState, useEffect } from "react";
import { ChainId } from '@diswap/sdk'
import styled, { keyframes } from "styled-components";
import Web3Status from '../../components/Web3Status'
import ethers from 'ethers'
import { isMobile } from 'react-device-detect'
import { useActiveWeb3React, useEagerConnect } from '../../hooks'
import { useETHBalances } from '../../state/wallet/hooks'
import { useHistory } from 'react-router-dom'
import { Text } from 'rebass'
import { YellowCard } from '../../components/Card'
import { getMakerProof, checkWhite } from '../../api/index'
import { ButtonOutlined, ButtonLight } from '../../components/Button'
import { useAirdropContract } from '../../hooks/useContract'
import Loader from '../../components/Loader'
import Round from '../../assets/images/round.png'
import BG from '../../assets/images/ardrop-bg.png'
import LOGOTEXT from '../../assets/svg/disney-w.svg'

const NETWORK_LABELS: { [chainId in ChainId]: string | null } = {
  [ChainId.MAINNET]: null,
  [ChainId.DIS]: 'DIS'
}

interface WhiteResult {
  id: number;
  address: string;
  amount: string | number;
  showAmount: string;
}

const Airdrop = () => {
  const { account, chainId, library } = useActiveWeb3React()
  useEagerConnect()
  const userEthBalance = useETHBalances(account ? [account] : [])?.[account ?? '']
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [isShowResult, setIsShowResult] = useState<boolean>(false)
  const [checkWhiteResult, setCheckWhiteResult] = useState<WhiteResult | null>(null)
  const [proofLoading, setProofLoading] = useState<boolean>(false)
  const [proofResult, setProofResult] = useState<WhiteResult | null>(null)
  const [claimed, setClaimed] = useState<boolean>(false)
  const [isSuccess, setIsSuccess] = useState<boolean|null>(null)
  const history = useHistory();
  const ADDRESS = '0xe49E5c52c7135B55eb4E72f64f047A55AaC8EF4C'
  let airdropContract = useAirdropContract(ADDRESS, true)

  const handleCheckWhite = () => {
    if (!!isLoading) return;
    setIsLoading(true)
    checkWhite({
      address: account 
    }).then(respose => {
      if (respose.code == 200) {
        let data = respose.data.airdrop
        setCheckWhiteResult({
          id: data.id,
          address: data.address,
          showAmount: ethers.utils.formatUnits(ethers.BigNumber.from(data.amount.toString()), 18),
          amount: data.amount,
        })
        setIsShowResult(true)

      }
      setIsLoading(false)
    })
  }

  const handleGetProof = () => {
    if (proofLoading) return;
    setProofLoading(true)
    getMakerProof({
      address: account 
    }).then(res => {
      if (res.code == 200) {
        setProofResult(res.data.proof)     
      } else {
        setProofLoading(false)
      }
    })
  }

  const getClaimed = async (address: string) => {
    if (address && airdropContract) {
      let claimedResult = await airdropContract.hasClaimed(address)
      setClaimed(claimedResult)
    }
  }

  const handleCliam = async () => {
    
    try {

      if(!checkWhiteResult?.amount || !window.ethereum) return;

      const claimArgs = [checkWhiteResult?.amount, proofResult];

      let gasLimit = await airdropContract?.estimateGas.claim(claimArgs[0], claimArgs[1])
      const nonce = await library?.getTransactionCount(checkWhiteResult?.address);
      let transaction = await airdropContract?.claim(claimArgs[0], claimArgs[1], { 
        gasLimit: gasLimit,
        from: checkWhiteResult?.address,
        nonce: nonce
      })

      let r = await transaction.wait()

      // Check if the transaction was successful
      if (r && r.status === 1) { // Transaction was successful, update loading state
        setProofLoading(false)
        setClaimed(true)
        setIsSuccess(true)
        console.log("Transaction successful"); 
      } else { // Transaction failed, handle the error or update loading state accordingly
        setProofLoading(false)
        setIsSuccess(false)
        console.error("Transaction failed");
      }
    } catch(err) {
      setProofLoading(false)
      console.log('claim err>>', err)
    }
  }

  // 是白单，检查 claim 状态
  useEffect(() => {
    if (proofResult) {
      handleCliam()
    }
  }, [proofResult])

  // 是白单，检查 claim 状态
  useEffect(() => {
    if (checkWhiteResult?.address) {
      getClaimed(checkWhiteResult.address)
    }
  }, [checkWhiteResult])

  useEffect(() => {
    if (account) {
      
    }
  }, [account])

  const handleBack = () => {
    history.push('/');
  };

  return (
    <Fragment>
      <AirdropWrapper>
        <LogoContainer>
          <Logo onClick={() => handleBack()} src={LOGOTEXT} />
        </LogoContainer>
        <HeaderElement>
          <TestnetWrapper>
            {!isMobile && chainId && NETWORK_LABELS[chainId] && <NetworkCard>{NETWORK_LABELS[chainId]}</NetworkCard>}
          </TestnetWrapper>
          <AccountElement active={!!account} style={{ pointerEvents: 'auto' }}>
            {account && userEthBalance ? (
              <BalanceText style={{ flexShrink: 0 }} pl="0.75rem" pr="0.5rem" fontWeight={500}>
                {userEthBalance?.toSignificant(4)} DIS
              </BalanceText>
            ) : null}
            <Web3Status />
          </AccountElement>
        </HeaderElement>

        <TextWord>Dear community member,</TextWord>
        <TextSub>Exciting news! We are happy to inform you that you can now verify your inclusion in our airdrop whitelist. This exclusive whitelist comes with additional benefits and ensures you are one of the first to participate in our upcoming airdrops.</TextSub>
        
        <BigButtonWrapper>
          <RoundImgWrapper>
            <RoundImg src={Round} alt="" />
          </RoundImgWrapper>
          <SubmitButton onClick={() => handleCheckWhite()}>
            {
              isLoading
                ? <Loader size="12px"/>
                : <span>CHECK NOW</span> 
            }
          </SubmitButton>
        </BigButtonWrapper>
        <ClipCircle className={isShowResult?'active':''}>
          {
            checkWhiteResult?.id == 0
              ? <Fragment>
                  <TextWord color="white">Sorry, you are not on the whitelist for the airdrop.</TextWord>
                  <ButtonOutlined width="100px">OK</ButtonOutlined>
                </Fragment>
              : <Fragment>
                  <TextWord color="white">Congratulations</TextWord>
                  <TextSub color="white">address: { checkWhiteResult?.address }</TextSub>
                  <TextSub color="white">amount: { checkWhiteResult?.showAmount }</TextSub>
                  {
                    claimed
                      ? <ButtonLight width="220px" padding="12px">You have already claimed.</ButtonLight>
                      : <ButtonLight width="120px" disabled={proofLoading} padding="12px" onClick={() => handleGetProof()}>{ proofLoading ? <Loader size="12px"/> : <></> }CLAIM</ButtonLight>
                  }
                  {
                    isSuccess ? <TextSub color="white">successful</TextSub> : <></>
                  }
                  {
                    isSuccess === false ? <TextSub color="white">failed</TextSub> : <></>
                  }
                  
                </Fragment>
          }
          
        </ClipCircle>
        
        <BgImage src={BG}></BgImage>
      </AirdropWrapper>
    </Fragment>
  )
}
const HeaderElement = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  position: fixed;
  top: 10px;
  right: 10px;
  z-index: 99;
`
const LogoContainer = styled.div`
  position: fixed;
  top: 18px;
  left: 20px;
  z-index: 99;
  mix-blend-mode: difference;
`;
const Logo = styled.img`
  width: 70px;
  cursor: pointer;
`;
const TestnetWrapper = styled.div`
  white-space: nowrap;
  width: fit-content;
  margin-left: 10px;
  pointer-events: auto;
`
const AccountElement = styled.div<{ active: boolean }>`
  display: flex;
  flex-direction: row;
  align-items: center;
  background-color: ${({ theme, active }) => (!active ? theme.bg1 : theme.bg3)};
  border-radius: 12px;
  white-space: nowrap;
  width: 100%;

  :focus {
    border: 1px solid blue;
  }
`
const TextWord = styled.div`
  font-size: 2rem;
  font-weight: bold;
  text-align: center;
  padding-bottom: 16px;
  color: ${({ color }) => color ? color : 'black'};
`
const TextSub = styled.div`
  font-size: 1rem;
  font-weight: bold;
  text-align: center;
  max-width: 70%;
  margin: 6px auto;
  line-height: 1.6;
  color: ${({ color }) => color ? color : 'black'};
`
const BalanceText = styled(Text)`
  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
    display: none;
  `};
`
const NetworkCard = styled(YellowCard)`
  width: fit-content;
  margin-right: 10px;
  border-radius: 12px;
  padding: 8px 12px;
`
const AirdropWrapper = styled.div`
  background: #D1C1B2;
  height: 100vh;
  padding: 10rem 0;
`
const BgImage = styled.img`
  width: 60%;
  max-width: 800px;
  position: absolute;
  left: 50%;
  bottom: 0;
  transform: translateX(-50%);
  z-index: 0;
  // mix-blend-mode: difference;
`
// 定义 keyframes 动画
const rotateAnimation = keyframes`
  100% {
    transform: rotate(360deg);
  }
`;
const BigButtonWrapper = styled.div`
  position: relative;
  width: 200px;
  height: 200px;
  margin: 50px auto 0;
  z-index: 1;
`
const RoundImgWrapper = styled.div`
  transition: all .3s;
  width: 200px;
  height: 200px;
  &:hover {
    transform: scale(1.1);
  }
`;
const RoundImg = styled.img`
  width: 200px;
  height: 200px;
  display: block;
  animation: ${rotateAnimation} 10s linear infinite;
  // mix-blend-mode: difference;
  cursor: pointer;
`
const SubmitButton = styled.button`
  border: none;
  position: absolute;
  width: 190px;
  height: 64px;
  top: 56%;
  color: black;
  left: 50%;
  padding: 0;
  z-index: 2;
  -webkit-mask: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' height='868' width='2500' viewBox='0 0 726 252.17'%3E%3Cpath d='M483.92 0S481.38 24.71 466 40.11c-11.74 11.74-24.09 12.66-40.26 15.07-9.42 1.41-29.7 3.77-34.81-.79-2.37-2.11-3-21-3.22-27.62-.21-6.92-1.36-16.52-2.82-18-.75 3.06-2.49 11.53-3.09 13.61S378.49 34.3 378 36a85.13 85.13 0 0 0-30.09 0c-.46-1.67-3.17-11.48-3.77-13.56s-2.34-10.55-3.09-13.61c-1.45 1.45-2.61 11.05-2.82 18-.21 6.67-.84 25.51-3.22 27.62-5.11 4.56-25.38 2.2-34.8.79-16.16-2.47-28.51-3.39-40.21-15.13C244.57 24.71 242 0 242 0H0s69.52 22.74 97.52 68.59c16.56 27.11 14.14 58.49 9.92 74.73C170 140 221.46 140 273 158.57c69.23 24.93 83.2 76.19 90 93.6 6.77-17.41 20.75-68.67 90-93.6 51.54-18.56 103-18.59 165.56-15.25-4.21-16.24-6.63-47.62 9.93-74.73C656.43 22.74 726 0 726 0z'/%3E%3C/svg%3E") no-repeat 50% 50%;
  mask: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' height='868' width='2500' viewBox='0 0 726 252.17'%3E%3Cpath d='M483.92 0S481.38 24.71 466 40.11c-11.74 11.74-24.09 12.66-40.26 15.07-9.42 1.41-29.7 3.77-34.81-.79-2.37-2.11-3-21-3.22-27.62-.21-6.92-1.36-16.52-2.82-18-.75 3.06-2.49 11.53-3.09 13.61S378.49 34.3 378 36a85.13 85.13 0 0 0-30.09 0c-.46-1.67-3.17-11.48-3.77-13.56s-2.34-10.55-3.09-13.61c-1.45 1.45-2.61 11.05-2.82 18-.21 6.67-.84 25.51-3.22 27.62-5.11 4.56-25.38 2.2-34.8.79-16.16-2.47-28.51-3.39-40.21-15.13C244.57 24.71 242 0 242 0H0s69.52 22.74 97.52 68.59c16.56 27.11 14.14 58.49 9.92 74.73C170 140 221.46 140 273 158.57c69.23 24.93 83.2 76.19 90 93.6 6.77-17.41 20.75-68.67 90-93.6 51.54-18.56 103-18.59 165.56-15.25-4.21-16.24-6.63-47.62 9.93-74.73C656.43 22.74 726 0 726 0z'/%3E%3C/svg%3E") no-repeat 50% 50%;
  -webkit-mask-size: 100%;
  cursor: pointer;
  background-color: transparent;
  transform: translate(-50%, -50%);
  &:after {
    content: '';
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    box-shadow: 0px 0 0 0 white;
    transition: all 2s ease;
  }
  &:before {
    content: '';
    position: absolute;
    width: 0;
    height: 100%;
    background-color: black;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    transition: all 1s ease;
  }
  &:hover {
    &:before {
      width: 100%;
    }
    :after {
      box-shadow: 0px -13px 56px 12px #ffffffa6;
    }
    span {
      color: white;
    }
  }
  &:active {
    transform: translate(-50%, -49%);
  }
  &:focus {
    &:before {
      width: 100%;
    }
    :after {
      box-shadow: 0px -13px 56px 12px #ffffffa6;
    }
    span {
      color: white;
    }
  }
  span {
    position: absolute;
    width: 100%;
    font-size: 15px;
    font-weight: 200;
    left: 50%;
    top: 39%;
    letter-spacing: 3px;
    text-align: center;
    transform: translate(-50%,-50%);
    color: black;
    transition: all 2s ease;
  }
`
const ClipCircle = styled.div`
  width: 0px;
  height: 0px;
  clip-path: circle(0);
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 9;
  background: black;
  transition: width 1s, height 1s, clip-path 2s;
  display: flex;
  align-items: center;
  flex-direction: column;
  justify-content: center;
  &.active {
    width: 110vw;
    height: 110vw;
    clip-path: circle(100%);
  }
`
export default Airdrop