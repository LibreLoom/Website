import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { useState } from 'react'
import Navigation from './components/Navigation'
import Home from './components/Home'
import Projects from './components/Projects'
import Team from './components/Team'
import Sponsors from './components/Sponsors'

function App() {
  const [disableSnapDragging, setDisableSnapDragging] = useState(false);

  return (
    <Router>
      <Navigation disableSnapDragging={disableSnapDragging} setDisableSnapDragging={setDisableSnapDragging}/>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/projects" element={<Projects />} />
        <Route path="/team" element={<Team />} />
        <Route path="/sponsors" element={<Sponsors />} />
      </Routes>
    </Router>
  )
}

export default App
