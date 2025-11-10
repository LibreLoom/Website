import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import useState from 'react'
import Navigation from './components/Navigation'
import Home from './components/Home'
import Projects from './components/Projects'
import Team from './components/Team'

function App() {
  return (
    <Router>
      const [disableSnapDragging, setDisableSnapDragging] = useState(false);
      <Navigation disableSnapDragging={disableSnapDragging}/>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/projects" element={<Projects />} />
        <Route path="/team" element={<Team />} />
      </Routes>
    </Router>
  )
}

export default App

