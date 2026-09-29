import { useRef, useState } from 'react'
import { MAX_ZOOM, MIN_ZOOM, clampPan, zoomInFrom, zoomOutFrom } from '../lib/panZoom'

// Drag-to-pan + zoom state for one diagram viewport. The math itself lives
// in lib/panZoom.js (plain functions, unit tested); this hook just wires
// that math up to a DOM node (via containerRef) and pointer events.
export function usePanZoom() {
  const containerRef = useRef(null)
  const dragRef = useRef(null)
  const [zoom, setZoom] = useState(MIN_ZOOM)
  const [pan, setPan] = useState({ x: 0, y: 0 })
  const [dragging, setDragging] = useState(false)

  const viewport = () => {
    const el = containerRef.current
    return el ? { width: el.clientWidth, height: el.clientHeight } : null
  }

  const zoomIn = () => setZoom(z => {
    const nz = zoomInFrom(z)
    setPan(p => clampPan(p, nz, viewport()))
    return nz
  })
  const zoomOut = () => setZoom(z => {
    const nz = zoomOutFrom(z)
    setPan(p => (nz === MIN_ZOOM ? { x: 0, y: 0 } : clampPan(p, nz, viewport())))
    return nz
  })
  const reset = () => {
    setZoom(MIN_ZOOM)
    setPan({ x: 0, y: 0 })
  }

  const onPointerDown = e => {
    if (zoom <= MIN_ZOOM) return
    e.preventDefault()
    dragRef.current = { startX: e.clientX, startY: e.clientY, origin: pan }
    setDragging(true)
    e.currentTarget.setPointerCapture?.(e.pointerId)
  }
  const onPointerMove = e => {
    if (!dragRef.current) return
    const dx = e.clientX - dragRef.current.startX
    const dy = e.clientY - dragRef.current.startY
    setPan(clampPan({ x: dragRef.current.origin.x + dx, y: dragRef.current.origin.y + dy }, zoom, viewport()))
  }
  const endDrag = () => {
    dragRef.current = null
    setDragging(false)
  }

  return {
    containerRef,
    zoom,
    pan,
    dragging,
    minZoom: MIN_ZOOM,
    maxZoom: MAX_ZOOM,
    zoomIn,
    zoomOut,
    reset,
    onPointerDown,
    onPointerMove,
    endDrag
  }
}
