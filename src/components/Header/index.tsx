import { ChainId } from '@diswap/sdk'
import React, { useState, useEffect } from 'react'
import { isMobile } from 'react-device-detect'
import { Text } from 'rebass'

import styled from 'styled-components'

import Logo from '../../assets/svg/logo.svg'
import LogoDark from '../../assets/images/logo.png'
import { useActiveWeb3React } from '../../hooks'
import { useDarkModeManager } from '../../state/user/hooks'
import { useETHBalances } from '../../state/wallet/hooks'

import { YellowCard } from '../Card'
import Settings from '../Settings'

import Row, { RowBetween } from '../Row'
import Web3Status from '../Web3Status'
import { NavLink } from 'react-router-dom'
import Modal from '../../components/Modal'

const HeaderFrame = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-direction: column;
  width: 100%;
  top: 0;
  position: absolute;
  z-index: 2;
  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
    padding: 12px 0 0 0;
    width: calc(100%);
    position: relative;
  `};
`

const HeaderElement = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
`

const HeaderNav = styled(NavLink)`
  color: ${({ theme }) => theme.text2};
  font-weight: 500;
  :hover {
    color: ${({ theme }) => theme.text1};
    cursor: pointer;
  }
`

// const HeaderNavFun = styled.div`
//   color: ${({ theme }) => theme.text2};
//   font-weight: 500;
//   text-decoration: underline;
//   :hover {
//     color: ${({ theme }) => theme.text1};
//     cursor: pointer;
//   }
// `

const ComingSoon = styled.div`
  color: ${({ theme }) => theme.text2};
  font-weight: 500;
  padding: 16px;
`

const HeaderElementWrap = styled.div`
  display: flex;
  align-items: center;

  ${({ theme }) => theme.mediaWidth.upToSmall`
    margin-top: 0.5rem;
`};
`

const Title = styled.a`
  display: flex;
  align-items: center;
  pointer-events: auto;

  :hover {
    cursor: pointer;
  }
`

const TitleText = styled(Row)`
  width: fit-content;
  white-space: nowrap;
  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
    display: none;
  `};
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

const TestnetWrapper = styled.div`
  white-space: nowrap;
  width: fit-content;
  margin-left: 10px;
  pointer-events: auto;
`

const NetworkCard = styled(YellowCard)`
  width: fit-content;
  margin-right: 10px;
  border-radius: 12px;
  padding: 8px 12px;
`

const UniIcon = styled.div`
  transition: transform 0.3s ease;
  :hover {
    transform: rotate(-5deg);
  }
`

const HeaderControls = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;

  ${({ theme }) => theme.mediaWidth.upToSmall`
    flex-direction: column;
    align-items: flex-end;
  `};
`

const BalanceText = styled(Text)`
  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
    display: none;
  `};
`

const NETWORK_LABELS: { [chainId in ChainId]: string | null } = {
  [ChainId.MAINNET]: null,
  // [ChainId.RINKEBY]: 'Rinkeby',
  // [ChainId.ROPSTEN]: 'Ropsten',
  // [ChainId.GÖRLI]: 'Görli',
  // [ChainId.KOVAN]: 'Kovan',
  [ChainId.DIS]: 'DIS'
}

export default function Header() {
  const { account, chainId } = useActiveWeb3React()
  const userEthBalance = useETHBalances(account ? [account] : [])?.[account ?? '']
  const [isDark] = useDarkModeManager()
  const [isOpen, setIsOpen] = useState(false)

  // const showModal = () => {
  //   setIsOpen(true)
  //   setTimeout(() => {
  //     setIsOpen(false)
  //   }, 2000);
  // }

  // 添加 useEffect 钩子
  useEffect(() => {
    // 在这里执行与 useActiveWeb3React 相关的操作
    console.log('useActiveWeb3React updated:', { account, chainId });
  }, [account, chainId]);

  return (
    <HeaderFrame>
      <RowBetween style={{ alignItems: 'flex-start' }} padding="1rem 1rem 0 1rem">
        <HeaderElement>
          <Title href=".">
            <UniIcon>
              <img src={isDark ? LogoDark : Logo} style={{'width': isDark?'2rem':'7.2rem'}} alt="logo" />
            </UniIcon>
            <TitleText>
              {/* <img style={{ marginLeft: '4px', marginTop: '4px' }} src={isDark ? WordmarkDark : Wordmark} alt="logo" /> */}
            </TitleText>
          </Title>
          <HeaderNav to="/">Index</HeaderNav>
          <HeaderNav to="/swap">Swap</HeaderNav>
          <HeaderNav to="/pool">Liquidity</HeaderNav>
          {/* <HeaderNav to="/airdrop">Airdrop</HeaderNav> */}
          {/* <HeaderNavFun onClick={showModal}>Infos</HeaderNavFun> */}
        </HeaderElement>
        <HeaderControls>
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
          <HeaderElementWrap>
            {/* <VersionSwitch /> */}
            <Settings />
            {/* <Menu /> */}
          </HeaderElementWrap>
        </HeaderControls>

        <Modal isOpen={isOpen} onDismiss={() => setIsOpen(false)}>
          <ComingSoon>Coming soon, stay tuned for the launch!</ComingSoon>
        </Modal>
      </RowBetween>
    </HeaderFrame>
  )
}
