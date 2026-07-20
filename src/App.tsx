import { BrowserRouter, Route, Routes } from 'react-router/internal/react-server-client'
import './App.css'
import { PropertiesList } from './pages/PropertysList'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route index path="/" element={<PropertiesList />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
