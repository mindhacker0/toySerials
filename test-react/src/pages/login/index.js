import { useCallback } from "react";
import {useNavigate } from "react-router";
import { connect } from "react-redux";
const Login = (props)=>{
    let history = useNavigate();
    let HdClick = useCallback(()=>{
        history("/");
    },[])
    return (<div>login<button onClick={HdClick}>xxxx</button></div>)
};
const mapStateToProps = (state) => {
    console.log(state)
    return {
      
    }
};

const mapDispatchToProps = (dispatch) => ({
  
});
export default connect(mapStateToProps)(Login);