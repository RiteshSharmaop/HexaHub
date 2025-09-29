

import { Route, Routes } from "react-router-dom"
import IDEApplication1 from "./pages/IDEPage"
import RegisterPage from "./pages/RegisterPage"


function App() {
 
  return (
    <>

      <Routes>
        {/* <Route path="/" element={<IDEApplication1 />}/> */}
         <Route path="/room/:roomId" element={<IDEApplication1 />} />
        <Route path="/" element={<RegisterPage/>}/>
      </Routes>
    </>
  )
}

export default App
