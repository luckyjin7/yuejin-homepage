import { MAX_ZOOM, MIN_ZOOM, ZOOM_STEP, clamp, clampPan, zoomInFrom, zoomOutFrom } from './panZoom'

describe('clamp', () => {
  it('passes values already inside the range through unchanged', () => {
    expect(clamp(5, 0, 10)).toBe(5)
  })

  it('pulls values below the minimum up to it', () => {
    expect(clamp(-5, 0, 10)).toBe(0)
  })

  it('pulls values above the maximum down to it', () => {
    expect(clamp(15, 0, 10)).toBe(10)
  })
})

describe('zoomInFrom / zoomOutFrom', () => {
  it('steps up by ZOOM_STEP', () => {
    expect(zoomInFrom(1)).toBe(1 + ZOOM_STEP)
  })

  it('steps down by ZOOM_STEP', () => {
    expect(zoomOutFrom(2)).toBe(2 - ZOOM_STEP)
  })

  it('never zooms in past MAX_ZOOM', () => {
    expect(zoomInFrom(MAX_ZOOM)).toBe(MAX_ZOOM)
  })

  it('never zooms out past MIN_ZOOM', () => {
    expect(zoomOutFrom(MIN_ZOOM)).toBe(MIN_ZOOM)
  })

  it('rounds to two decimal places', () => {
    // 1 + 0.5 + 0.5 should land exactly on 2, not 1.9999999999999998
    expect(zoomInFrom(zoomInFrom(MIN_ZOOM))).toBe(2)
  })
})

describe('clampPan', () => {
  const viewport = { width: 400, height: 200 }

  it('collapses to the origin when there is no viewport to measure yet', () => {
    expect(clampPan({ x: 50, y: 50 }, 2, null)).toEqual({ x: 0, y: 0 })
  })

  it('collapses to the origin at zoom 1, since there is nowhere to pan to', () => {
    // at zoom 1 the content exactly fills the viewport, so max pan is 0
    expect(clampPan({ x: 999, y: 999 }, 1, viewport)).toEqual({ x: 0, y: 0 })
  })

  it('allows panning up to half the overflow in each axis', () => {
    // zoom 2 doubles the content; overflow is (width*zoom - width) = width,
    // so the max pan in either direction is half of that
    const result = clampPan({ x: 1000, y: 1000 }, 2, viewport)
    expect(result).toEqual({ x: 200, y: 100 })
  })

  it('leaves an in-range pan untouched', () => {
    expect(clampPan({ x: 10, y: -10 }, 2, viewport)).toEqual({ x: 10, y: -10 })
  })

  it('clamps negative overshoot symmetrically', () => {
    const result = clampPan({ x: -1000, y: -1000 }, 2, viewport)
    expect(result).toEqual({ x: -200, y: -100 })
  })
})
