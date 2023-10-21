import {BrowserRouter,Routes,Route} from "react-router-dom";
import Home from "../pages/home";
import Login from "../pages/login";
const routes = [
    {
        path:"/",
        component:Home,
        exact:true
    },{
        path:"/login",
        component:Login,
        exact:true
    } 
];
export default (props)=>{
    console.log(props)

    return <BrowserRouter>
        <Routes>
           {routes.map(({path,component:BindComponent})=>(<Route path ={path} element={<BindComponent {...props}/>}></Route>))}
        </Routes>
    </BrowserRouter>
}
