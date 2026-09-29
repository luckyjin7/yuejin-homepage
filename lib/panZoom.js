// Pure math behind the drag-to-pan / zoom diagram viewer (see
// hooks/usePanZoom.js). Kept free of React and the DOM so it can be unit
// tested directly, without rendering anything.

export const MIN_ZOOM = 1
export const MAX_ZOOM = 3
export const ZOOM_STEP = 0.5

export const clamp = (value, min, max) => Math.min(max, Math.max(min, value))

// Zoom always rounds to two decimals and stays within [MIN_ZOOM, MAX_ZOOM].
export const zoomInFrom = zoom => clamp(+(zoom + ZOOM_STEP).toFixed(2), MIN_ZOOM, MAX_ZOOM)
export const zoomOutFrom = zoom => clamp(+(zoom - ZOOM_STEP).toFixed(2), MIN_ZOOM, MAX_ZOOM)

// Keeps the pan offset from dragging the zoomed content fully out of view:
// at a given zoom level, the content can only be dragged until its edge
// reaches the viewport's edge, in either axis.
export const clampPan = (pan, zoom, viewport) => {
  if (!viewport || !viewport.width || !viewport.height) return { x: 0, y: 0 }
  const { width, height } = viewport
  const maxX = Math.max(0, (width * zoom - width) / 2)
  const maxY = Math.max(0, (height * zoom - height) / 2)
  return { x: clamp(pan.x, -maxX, maxX), y: clamp(pan.y, -maxY, maxY) }
}
