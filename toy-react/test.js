import React from "./toy-react";
class MyComponent extends React.Component{
    constructor(props){
        super(props);
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
            {this.children}
        </div>
    }
}
React.render(<MyComponent>
    <div>sss</div>
    <div></div>
</MyComponent>,document.body);