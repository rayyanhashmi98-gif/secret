import { useRef, useState } from 'react'
import './App.css'
import angryPenguin from '../images/images.jpg'

function App() {
  const [accepted, setAccepted] = useState(false)
  const [declined, setDeclined] = useState(false)
  const [confirmYes, setConfirmYes] = useState(false)
  const [noPosition, setNoPosition] = useState({ x: 66, y: 50 })
  const [noClicks, setNoClicks] = useState(0)
  const [isNoRunning, setIsNoRunning] = useState(false)
  const headingRef = useRef(null)
  const yesButtonRef = useRef(null)
  const noButtonRef = useRef(null)

  const overlaps = (a, b) =>
    a.left < b.right && a.right > b.left && a.top < b.bottom && a.bottom > b.top

  const expandedRect = (rect, padding) => ({
    left: rect.left - padding,
    right: rect.right + padding,
    top: rect.top - padding,
    bottom: rect.bottom + padding,
  })

  const moveNoToSafePosition = () => {
    const noRect = noButtonRef.current?.getBoundingClientRect()
    if (!noRect) {
      return
    }

    const noWidth = noRect.width
    const noHeight = noRect.height
    const margin = 12
    const minX = noWidth / 2 + margin
    const maxX = window.innerWidth - noWidth / 2 - margin
    const minY = noHeight / 2 + margin
    const maxY = window.innerHeight - noHeight / 2 - margin

    const forbidden = []
    if (headingRef.current) {
      forbidden.push(expandedRect(headingRef.current.getBoundingClientRect(), 28))
    }
    if (yesButtonRef.current) {
      forbidden.push(expandedRect(yesButtonRef.current.getBoundingClientRect(), 42))
    }

    for (let i = 0; i < 80; i += 1) {
      const centerX = Math.random() * (maxX - minX) + minX
      const centerY = Math.random() * (maxY - minY) + minY
      const candidate = {
        left: centerX - noWidth / 2,
        right: centerX + noWidth / 2,
        top: centerY - noHeight / 2,
        bottom: centerY + noHeight / 2,
      }

      if (!forbidden.some((zone) => overlaps(candidate, zone))) {
        setNoPosition({
          x: (centerX / window.innerWidth) * 100,
          y: (centerY / window.innerHeight) * 100,
        })
        return
      }
    }
  }

  const handleNoClick = () => {
    setConfirmYes(false)
    const nextClicks = noClicks + 1

    if (nextClicks >= 3) {
      setDeclined(true)
      return
    }

    setIsNoRunning(true)
    setNoClicks(nextClicks)
    moveNoToSafePosition()
  }

  const handleYesClick = () => {
    if (!confirmYes) {
      setConfirmYes(true)
      return
    }

    setAccepted(true)
  }

  if (accepted) {
    return (
      <main className="screen celebrate">
        <h1>Yay!</h1>
      </main>
    )
  }

  if (declined) {
    return (
      <main className="screen meanie">
        <h1>Meanie</h1>
        <img className="angry-penguin" src={angryPenguin} alt="Angry penguin" />
      </main>
    )
  }

  return (
    <main className="screen question-screen">
      <h1 ref={headingRef}>
        {confirmYes
          ? noClicks === 1
            ? 'So you do want to be my valentine'
            : 'Are you sure?'
          : noClicks >= 2
            ? (
                <>
                  Well this is embarassing
                  <br />
                  Did you actually mean yes
                </>
              )
            : noClicks === 1
              ? 'Stop messing with me!'
              : 'Will you be my valentine?'}
      </h1>
      <div className="actions">
        <button
          ref={yesButtonRef}
          className="btn yes fixed-yes"
          type="button"
          style={{ transform: `translate(-50%, -50%) scale(${1 + noClicks * 1.5})` }}
          onClick={handleYesClick}
        >
          Yes
        </button>

        <button
          ref={noButtonRef}
          className={`btn no ${isNoRunning ? 'evasive' : 'start'}`}
          type="button"
          style={isNoRunning ? { left: `${noPosition.x}%`, top: `${noPosition.y}%` } : undefined}
          onClick={handleNoClick}
        >
          No
        </button>
      </div>
    </main>
  )
}

export default App
