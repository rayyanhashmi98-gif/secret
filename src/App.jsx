import { useState } from 'react'
import './App.css'

function App() {
  const [accepted, setAccepted] = useState(false)
  const [noPosition, setNoPosition] = useState({ x: 66, y: 50 })
  const [isNoRunning, setIsNoRunning] = useState(false)

  const moveNoButton = () => {
    setIsNoRunning(true)
    const x = Math.random() * 86 + 7
    const y = Math.random() * 78 + 10
    setNoPosition({ x, y })
  }

  if (accepted) {
    return (
      <main className="screen celebrate">
        <h1>Yippie!</h1>
      </main>
    )
  }

  return (
    <main className="screen question-screen">
      <h1>Will you be my valentine?</h1>

      <div className="actions">
        <button className="btn yes fixed-yes" type="button" onClick={() => setAccepted(true)}>
          Yes
        </button>

        <button
          className={`btn no ${isNoRunning ? 'evasive' : 'start'}`}
          type="button"
          style={isNoRunning ? { left: `${noPosition.x}%`, top: `${noPosition.y}%` } : undefined}
          onClick={moveNoButton}
        >
          No
        </button>
      </div>
    </main>
  )
}

export default App
