import {Component,useState,useContext,useDeferredValue, useEffect,useId, forwardRef, useImperativeHandle,useRef} from "react";
import {ThemeContext} from "../context.js"
const Caper = (str)=>(<div>the name is {str}</div>);
const Input = ({value,onChange})=>(<input value={value} onChange={onChange}/>);
const Dec = forwardRef((props,ref)=>{
    useImperativeHandle(ref,()=>({Caper}))
    return (<div>xxxxx</div>)
});
const Form = function(props){
    const [val1,setVal1] = useState(0);
    const [val2,setVal2] = useState(1);
    const xref = useRef(null);
    const elder = useDeferredValue(val1);
    const theme = useContext(ThemeContext);
    console.log(useId());
    useEffect(()=>{
        console.log("init",xref);
        return ()=>{
            console.log("destory");
        }
    },[val1])
    let fn = (x)=>{
        console.log("1",x);
        setVal1(x.target.value);
        Promise.resolve().then(()=>{console.log("xxx",elder,val1);})
    }
    let fn1 = (x)=>{
        console.log("2",x);
        setVal2(x.target.value);
    }
    return (<div>
        <div>{val1+val2}</div>
        <Input value={val1} onChange={fn}/>
        <Input value={val2} onChange={fn1}/>
        <Dec ref={xref}></Dec>
    </div>)
}
class ActionBar extends Component{
    constructor(props){
        super(props);
        this.onChange = this.onChange.bind(this);
        this.state = {name:"xiaomin",id:"777"};
        console.log(this)
    }
    // static getDerivedStateFromProps(props,state){
    //     console.log('getDerivedStateFromProps',props,state);
    //     return {
    //         id:"999"
    //     }//State
    // }
    componentDidMount(){
        console.log("组件挂载")
    }
    componentWillUnmount(){
        console.log("组件卸载") 
    }
    componentDidUpdate(){
        console.log("组件更新")
    }
    shouldComponentUpdate(nextProps,nextState){
        console.log("state or props change");
        return true;
    }
    onChange=(e)=>{
        console.log(e,this.state);
        this.setState({...this.state,id:"000"},(...states)=>{console.log(this.state)});
    }
    render(){
        return <>
            <div>abc123 {this.state.id}</div>
            {Caper('zpf')}
            <button onClick={this.onChange}>ssss</button>
            <Form />
        </>
    }
}
export default ActionBar;