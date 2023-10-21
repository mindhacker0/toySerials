import {createStore} from "redux";
const reducer = (state = {counter:9},action)=>{
    switch(action.type) {
        case "add": return {...state,counter:state.counter+1};
        case "dec": return {...state,counter:state.counter-1};
        default: return state;
    }
}
export default createStore(reducer);