import {Component} from "react";

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
            <button onClick={this.onChange}>ssss</button>
        </>
    }
}
export default ActionBar;