import {ThemeContext} from "./context.js";
import {compose} from "redux";
import AppStoreHoc from "./libs/store.hoc.js";
import RouteWrapper from "./router";
function App(props) {
  //const logProfiler = (...attrs)=>{console.log(attrs)}
  return (
    <div className="App">
      <ThemeContext.Provider value={{name:"9990"}}>
        <RouteWrapper {...props}/>
      </ThemeContext.Provider>
    </div>
  );
}

export default compose(AppStoreHoc)(App);
