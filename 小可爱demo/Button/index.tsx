/** @jsxImportSource @emotion/react */
import { css, SerializedStyles } from "@emotion/react";
import { createRef, useEffect, useState } from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement>{
    children?:React.ReactNode;
    css?:SerializedStyles;
    onMouseDown?:(e:React.MouseEvent<HTMLButtonElement>)=>void;
}
const Button:React.FC<ButtonProps> = ({children,css:ecss,onMouseDown,...attrs})=>{
    const ref = createRef<HTMLButtonElement>();
    const [position,setPosition] = useState<{x:number;y:number;}>({x:0,y:0});
    const handleMouseDown = (e:React.MouseEvent<HTMLButtonElement>)=>{
        const mouseX = e.clientX;
        const mouseY = e.clientY;
        const rect = ref.current!.getBoundingClientRect();
        setPosition({x:mouseX - rect.left - rect.width/2,y:mouseY - rect.top - rect.width/2});
        onMouseDown && onMouseDown(e);
    }
    useEffect(()=>{//修正初始位置
      if(ref.current)  setPosition({x:0,y:ref.current.clientHeight/2-ref.current.clientWidth/2});
    },[]);
    return (<button
    ref={ref}
    css={css`
        height:32px;
        line-height:32px;
        position:relative;
        color:#fff;
        cursor:pointer;
        padding:0px 8px;
        border-radius: 4px;
        box-shadow:rgba(0, 0, 0, 0.2) 0px 3px 1px -2px, rgba(0, 0, 0, 0.14) 0px 2px 2px 0px, rgba(0, 0, 0, 0.12) 0px 1px 5px 0px;
        &:hover{
            opacity:0.84;
            box-shadow:0px 2px 4px -1px rgba(0,0,0,0.2),0px 4px 5px 0px rgba(0,0,0,0.14),0px 1px 10px 0px rgba(0,0,0,0.12);
        }
        ${ecss}
    `}
    onMouseDown={handleMouseDown}
    {...attrs}
    >
        {children}
        <div css={css`
        width:100%;
        height:100%;
        overflow: hidden;
        position: absolute;
        inset: 0px;
        border-radius: inherit;
        &::after{
            content: "";
            width: 100%;
            aspect-ratio: 1/1;
            background: #f1f1f1;
            position: absolute;
            left:${position.x}px;
            top:${position.y}px;
            border-radius: 100%;
            opacity: 0;
            transition: all 0.25s;
        }
        :active::after {
            transform:scale(0.3);
            opacity: 0.6;
            transition: 0s;
        }
        `}></div>
    </button>);
}

export default Button;