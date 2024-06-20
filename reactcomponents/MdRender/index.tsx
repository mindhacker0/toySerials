import MarkDownIt from "markdown-it";
import { extractHeadPlugin,linkCovertPlugin} from "./mdPlugins";
import { FC,useEffect,useState } from "react";

const MdRender:FC<{content:string,tocCallback?:Function,imageSrcCovert?:Function}> = ({content,tocCallback,imageSrcCovert})=>{
    const [parse,setParse] = useState("");
    useEffect(()=>{
        const md = new MarkDownIt({html:true,breaks:true,});
        md.use(extractHeadPlugin,{callback:tocCallback});//markdown标题提取处理
        md.use(linkCovertPlugin,{imageSrcCovert});//markdown图片链接处理
        setParse(md.render(content));
    },[content,tocCallback,imageSrcCovert])
    return (<div dangerouslySetInnerHTML={{__html:parse}}></div>);
}

export default MdRender;