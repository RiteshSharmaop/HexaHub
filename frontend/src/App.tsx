

import { Route, Routes } from "react-router-dom"
import IDEApplication1 from "./pages/IDEPage"


function App() {
 
  return (
    <>

      <Routes>
        <Route path="/" element={<IDEApplication1 />}/>
      </Routes>
    </>
  )
}

export default App
