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
    <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <a className="skip-link" href="#main-content">Skip to content</a>
      <Navigation disableSnapDragging={disableSnapDragging} setDisableSnapDragging={setDisableSnapDragging}/>
      <main id="main-content" tabIndex="-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/team" element={<Team />} />
          <Route path="/sponsors" element={<Sponsors />} />
        </Routes>
      </main>
    </Router>
  )
}

export default App
