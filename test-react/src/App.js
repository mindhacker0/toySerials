import './App.css';
import ActionBar from './components/actionBar';
import {ThemeContext} from "./context.js"
function App() {
  //const logProfiler = (...attrs)=>{console.log(attrs)}
  return (
    <div className="App">
      <ThemeContext.Provider value={{name:"9990"}}>
        <ActionBar id="888">
          <div>ooo</div>
        </ActionBar>
      </ThemeContext.Provider>
    </div>
  );
}

export default App;
