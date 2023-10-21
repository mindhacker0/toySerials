import { Provider } from "react-redux";
import { Component } from "react";
import store from "../store";
const AppStoreHoc = (Wrapper)=>{
    return class Shell extends Component{
        constructor(props){
            super(props);
            console.log(props)
        }
        render(){
            return (<Provider store={store}>
                <Wrapper {...this.props}/>
            </Provider>)
        }
    } 
}
export default AppStoreHoc;