import { useState } from 'react'
import { Route } from 'react-router-dom'
import { BrowserRouter } from 'react-router-dom'
import { Routes } from 'react-router-dom'
import Landing from './pages/Landing'
import Dashboard from './pages/Dashboard'
import Bulk from './pages/Bulk'
import History from './pages/History'
import Report from './pages/Report'
function App() {

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Landing/>}></Route>
          <Route path='/dashboard' element={<Dashboard/>}></Route>
          <Route path='/history' element={<History/>}></Route>
          <Route path='/bulk' element={<Bulk/>}></Route>
          <Route path='/report/:id' element={<Report/>}></Route>
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
