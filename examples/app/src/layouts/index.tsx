import React from 'react';
import { useLocation } from 'react-router-dom';
import { Page, Content, Header } from '@alita/flow';
import { useKeepOutlets } from '@myfrontframe/keepalive';
import "./index.css";

const Layout = () => {
    const { pathname } = useLocation();
    const element = useKeepOutlets();
    return (
        <Page className='myfrontframe-layout'>
            <Header>当前路由: {pathname},当前页面位置</Header>
            <Content>
                {element}
            </Content>
        </Page>
    )
}

export default Layout;