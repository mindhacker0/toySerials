import {css} from 'linaria';
import { styled } from 'linaria/react';
import React from 'react';
import ReactDOM from 'react-dom';
import Home from "./home";
const name = css`color:green;`;//基于模板函数
const Wrap = styled.div`color:red
&::after{
    content:"";
    width:10px;
    height:10px;
    display:block;
    background:#999;
}
`;
const ComposeMenu = function(props){
    return <div>
      <div className={name}>111</div>
      <Wrap>222</Wrap>
      <Home></Home>
    </div>
}
ReactDOM.render(
    <ComposeMenu index="1"/>,
    document.getElementById('root')
);