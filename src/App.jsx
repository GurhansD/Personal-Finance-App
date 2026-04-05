import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Dashboard from './pages/Dashboard'
import Budget from './pages/Budget'
import Goals from './pages/Goals'
import Debt from './pages/Debt'
import Invest from './pages/Invest'
import Learn from './pages/Learn'

function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/budget" element={<Budget />} />
          <Route path="/goals" element={<Goals />} />
          <Route path="/debt" element={<Debt />} />
          <Route path="/invest" element={<Invest />} />
          <Route path="/learn" element={<Learn />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  )
}

export default App
