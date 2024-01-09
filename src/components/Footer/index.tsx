import React from 'react'
import styled from 'styled-components'
import { ExternalLink } from '../../theme'
import Telegram from '../icon/MdiTelegram'
import Twitter from '../icon/MdiTwitter'

const FooterWrapper = styled.div`
    display: flex;
    align-items: center;
    padding: 20px;
    border-top: 1px solid ${({ theme }) => theme.bg3};
    width: 100%;
`

const HeaderLinkNav = styled(ExternalLink)`
  color: ${({ theme }) => theme.text2};
  font-weight: 500;
  text-decoration: underline;
  :hover {
    color: ${({ theme }) => theme.text1};
    cursor: pointer;
  }
`

export default function Header() {
    return (
        <FooterWrapper>
            <HeaderLinkNav id="link" href="https://dischain.xyz/">DISChain</HeaderLinkNav>
            <HeaderLinkNav id="link" href="https://dischain.xyz/" style={{fontSize: '22px', margin: '0 0 0 auto'}}><Telegram/></HeaderLinkNav>
            <HeaderLinkNav id="link" href="https://dischain.xyz/" style={{fontSize: '20px', margin: '0 0 0 10px'}}><Twitter/></HeaderLinkNav>
        </FooterWrapper>
    )
}
