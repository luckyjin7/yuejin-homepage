import { useRef, useState, useEffect } from 'react'

export function useVideoPlayer({ trackProgress = false } = {}) {
  const videoRef = useRef(null)
  const [playing,  setPlaying]  = useState(false)
  const [muted,    setMuted]    = useState(true)
  const [volume,   setVolume]   = useState(1)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    if (!trackProgress) return
    const v = videoRef.current
    if (!v) return
    const onPlay       = () => setPlaying(true)
    const onPause      = () => setPlaying(false)
    const onTimeUpdate = () => {
      if (v.duration) setProgress((v.currentTime / v.duration) * 100)
    }
    v.addEventListener('play',       onPlay)
    v.addEventListener('pause',      onPause)
    v.addEventListener('timeupdate', onTimeUpdate)
    return () => {
      v.removeEventListener('play',       onPlay)
      v.removeEventListener('pause',      onPause)
      v.removeEventListener('timeupdate', onTimeUpdate)
    }
  }, [trackProgress])

  function togglePlay() {
    const v = videoRef.current
    if (!v) return
    if (v.paused) v.play()
    else          v.pause()
  }

  function handleVideoClick() {
    const v = videoRef.current
    if (!v) return
    if (v.paused) v.play()
    else          v.pause()
    if (v.muted) {
      v.muted = false
      setMuted(false)
    }
  }

  function handleSeek(e) {
    const v = videoRef.current
    if (!v || !v.duration) return
    const pct = parseFloat(e.target.value)
    v.currentTime = (pct / 100) * v.duration
    setProgress(pct)
  }

  function toggleMute() {
    const v = videoRef.current
    if (!v) return
    v.muted = !v.muted
    setMuted(v.muted)
  }

  function handleVolume(e) {
    const v = videoRef.current
    if (!v) return
    const val = parseFloat(e.target.value)
    v.volume  = val
    v.muted   = val === 0
    setVolume(val)
    setMuted(val === 0)
  }

  return {
    videoRef,
    playing,
    muted,
    volume,
    progress,
    togglePlay,
    handleVideoClick,
    handleSeek,
    toggleMute,
    handleVolume,
  }
}
