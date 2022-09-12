import React from "./toy-react";
import Animation from "../Animation/index.js"
class MyComponent extends React.Component{
    constructor(props){
        super(props);
        setTimeout(()=>{
            let timeLine = new Animation.Timeline;
            let elem = document.getElementById("aniNo1");
            let ani1 = new Animation.Animation(elem.style,"transform",0,200,3000,0,v=>v,v=>`translateX(${v}px)`);
            timeLine.add(ani1);
            timeLine.start();
        });
    }
    state={
        a:1,
        b:2
    }
    addNumber(e){
        console.log(e);
        this.setState({a:this.state.a+1});
    }
    render(){
        const {a,b}  = this.state;
        return <div className="wrapper">
            <h1>my component</h1>
            <button onclick={this.addNumber.bind(this)}>add</button>
            <div>
                <div>{a}</div>
                <div>{b}</div>
            </div>
            {this.props.children}
        </div>
    }
}
React.render(<MyComponent>
    <div id="aniNo1"></div>
    <div id="aniNo2"></div>
</MyComponent>,document.getElementById("test"));