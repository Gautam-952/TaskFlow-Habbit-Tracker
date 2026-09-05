import React, { useState, useEffect, useRef, useCallback } from 'react'
import { createPortal } from 'react-dom'

const MODES = [
  { key: 'focus', label: 'Focus', color: 'lime' },
  { key: 'break', label: 'Break', color: 'amber' },
]

const MIN_MINUTES = 5
const MAX_MINUTES = 120
const STEP_MINUTES = 5

const COLOR_CLASSES = {
  lime: { border: 'border-lime-300', bg: 'bg-lime-600', hover: 'hover:bg-lime-500', text: 'text-lime-400' },
  amber: { border: 'border-amber-300', bg: 'bg-amber-600', hover: 'hover:bg-amber-500', text: 'text-amber-400' },
}

function clamp(value) {
  return Math.min(MAX_MINUTES, Math.max(MIN_MINUTES, value))
}

function Focus({ onClose = () => {}, taskName }) {
  const [mode, setMode] = useState('focus')
  const [durations, setDurations] = useState({ focus: 25, break: 5 })
  const [secondsLeft, setSecondsLeft] = useState(durations.focus * 60)
  const [isRunning, setIsRunning] = useState(false)
  const intervalRef = useRef(null)

  const activeConfig = MODES.find((m) => m.key === mode)
  const colorClasses = COLOR_CLASSES[activeConfig.color]

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        setSecondsLeft((prev) => {
          if (prev <= 1) {
            clearInterval(intervalRef.current)
            setIsRunning(false)
            return 0
          }
          return prev - 1
        })
      }, 1000)
    }
    return () => clearInterval(intervalRef.current)
  }, [isRunning])

  const handleStart = useCallback(() => {
    if (secondsLeft > 0) setIsRunning(true)
  }, [secondsLeft])

  const handlePause = useCallback(() => setIsRunning(false), [])

  const handleReset = useCallback(() => {
    setIsRunning(false)
    setSecondsLeft(durations[mode] * 60)
  }, [durations, mode])

  const handleSwitchMode = useCallback((nextMode) => {
    setIsRunning(false)
    setMode(nextMode)
    setSecondsLeft(durations[nextMode] * 60)
  }, [durations])

  const adjustDuration = useCallback((modeKey, delta) => {
    if (isRunning) return
    setDurations((prev) => {
      const nextValue = clamp(prev[modeKey] + delta)
      const nextDurations = { ...prev, [modeKey]: nextValue }
      if (modeKey === mode) {
        setSecondsLeft(nextValue * 60)
      }
      return nextDurations
    })
  }, [isRunning, mode])

  const handleClose = useCallback(() => {
    if (isRunning) {
      const confirmClose = window.confirm('A session is running. Close Focus Mode anyway?')
      if (!confirmClose) return
      setIsRunning(false)
    }
    onClose()
  }, [isRunning, onClose])

  const minutes = String(Math.floor(secondsLeft / 60)).padStart(2, '0')
  const seconds = String(secondsLeft % 60).padStart(2, '0')

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="relative flex flex-col justify-between w-[90%] max-w-105 min-h-120 bg-linear-to-br from-[#0f3739] to-[#051e1c] border-2 border-[#dad085] rounded-2xl p-6 shadow-2xl">

        {/* Top Header */}
        <div className="relative flex flex-col items-center w-full pt-8">
          <img
            className='flex w-10 h-8 absolute top-0 left-1/2 -translate-x-1/2'
            src="./logo/logo.png" alt="lotus2" />

          <button
            type="button"
            onClick={handleClose}
            className="absolute right-0 top-0 text-gray-300 hover:text-white text-xl font-bold cursor-pointer transition-colors"
            aria-label="Close focus mode"
          >
            ✕
          </button>

          <h2 className="text-white font-serif text-2xl tracking-wide">
            Focus
          </h2>

          {taskName && (
            <p className="text-lime-400 font-mono text-xs pt-1 truncate max-w-[85%] text-center">
              {taskName}
            </p>
          )}
        </div>

        {/* Mode rows — each with its own +/- controls */}
        <div className="flex flex-col gap-2 mt-4">
          {MODES.map((m) => {
            const isActive = mode === m.key
            const cc = COLOR_CLASSES[m.color]
            return (
              <div
                key={m.key}
                role="button"
                tabIndex={0}
                onClick={() => handleSwitchMode(m.key)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault()
                    handleSwitchMode(m.key)
                  }
                }}
                className={`flex items-center justify-between px-3 py-2 rounded-lg border transition-all cursor-pointer ${
                  isActive ? `${cc.border} bg-white/5` : 'border-white/10 hover:border-white/30 hover:bg-white/5'
                }`}
              >
                <span
                  className={`text-xs font-mono uppercase tracking-wide ${
                    isActive ? cc.text : 'text-gray-400'
                  }`}
                >
                  {m.label}
                </span>

                <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                  <button
                    type="button"
                    onClick={() => adjustDuration(m.key, -STEP_MINUTES)}
                    disabled={isRunning || durations[m.key] <= MIN_MINUTES}
                    className="w-6 h-6 flex items-center justify-center rounded-full border border-white/20 text-white text-sm hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                    aria-label={`Decrease ${m.label} duration`}
                  >
                    −
                  </button>
                  <span className="text-gray-300 font-mono text-xs w-14 text-center">
                    {durations[m.key]} min
                  </span>
                  <button
                    type="button"
                    onClick={() => adjustDuration(m.key, STEP_MINUTES)}
                    disabled={isRunning || durations[m.key] >= MAX_MINUTES}
                    className="w-6 h-6 flex items-center justify-center rounded-full border border-white/20 text-white text-sm hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                    aria-label={`Increase ${m.label} duration`}
                  >
                    +
                  </button>
                </div>
              </div>
            )
          })}
        </div>

        {/* Center Clock */}
        <div className="flex flex-col items-center justify-center my-6">
          <div
            className={`text-white font-mono font-bold tracking-widest drop-shadow-md tabular-nums leading-none ${
              minutes.length >= 3 ? 'text-4xl' : 'text-6xl'
            }`}
          >
            {minutes}:{seconds}
          </div>
          <span className={`font-mono text-xs uppercase tracking-widest mt-2 ${colorClasses.text}`}>
            {secondsLeft === 0 ? 'Complete' : activeConfig.label}
          </span>
        </div>

        {/* Bottom Buttons */}
        <div className="flex flex-row justify-center items-center gap-3 w-full">
          <button
            type="button"
            onClick={handleStart}
            disabled={isRunning || secondsLeft === 0}
            className={`flex-1 py-2 text-sm font-semibold text-white border-2 rounded-lg ${colorClasses.border} ${colorClasses.bg} ${colorClasses.hover} active:scale-95 transition-all shadow-md cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed`}
          >
            Start
          </button>
          <button
            type="button"
            onClick={handlePause}
            disabled={!isRunning}
            className="flex-1 py-2 text-sm font-semibold text-white border-2 rounded-lg border-amber-300 bg-amber-600 hover:bg-amber-500 active:scale-95 transition-all shadow-md cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Pause
          </button>
          <button
            type="button"
            onClick={handleReset}
            className="flex-1 py-2 text-sm font-semibold text-white border-2 rounded-lg border-gray-400 bg-gray-600/70 hover:bg-gray-500 active:scale-95 transition-all shadow-md cursor-pointer"
          >
            Reset
          </button>
        </div>

      </div>
    </div>,
    document.body
  )
}

export default Focus
