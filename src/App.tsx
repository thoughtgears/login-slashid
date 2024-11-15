import {BrowserRouter as Router, Routes, Route} from "react-router-dom";
import Home from "./pages/Home";
import Reset from "./pages/Reset";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home/>}/>
        <Route path="/reset" element={<Reset/>}/>
      </Routes>
    </Router>
  );
}

export default App;
