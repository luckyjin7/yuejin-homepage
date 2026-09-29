import { act, renderHook } from '@testing-library/react'
import { usePanZoom } from './usePanZoom'

// A minimal stand-in for the DOM node usePanZoom measures via
// containerRef.current.{clientWidth,clientHeight} — no real layout needed.
const fakeContainer = (width, height) => ({ clientWidth: width, clientHeight: height })

const fakePointerEvent = (clientX, clientY, overrides = {}) => ({
  clientX,
  clientY,
  pointerId: 1,
  preventDefault: jest.fn(),
  currentTarget: { setPointerCapture: jest.fn() },
  ...overrides
})

describe('usePanZoom', () => {
  it('starts at zoom 1, centered, not dragging', () => {
    const { result } = renderHook(() => usePanZoom())
    expect(result.current.zoom).toBe(1)
    expect(result.current.pan).toEqual({ x: 0, y: 0 })
    expect(result.current.dragging).toBe(false)
  })

  it('zoomIn increases zoom and zoomOut decreases it, within [minZoom, maxZoom]', () => {
    const { result } = renderHook(() => usePanZoom())

    act(() => result.current.zoomIn())
    expect(result.current.zoom).toBe(1.5)

    act(() => result.current.zoomOut())
    expect(result.current.zoom).toBe(1)

    // zooming out below minZoom clamps at minZoom instead of going negative
    act(() => result.current.zoomOut())
    expect(result.current.zoom).toBe(result.current.minZoom)
  })

  it('resets pan to the origin once zoomed back out to minZoom', () => {
    const { result } = renderHook(() => usePanZoom())
    result.current.containerRef.current = fakeContainer(400, 200)

    act(() => result.current.zoomIn())
    act(() => {
      result.current.onPointerDown(fakePointerEvent(0, 0))
      result.current.onPointerMove(fakePointerEvent(40, 20))
    })
    expect(result.current.pan).not.toEqual({ x: 0, y: 0 })

    act(() => result.current.zoomOut())
    expect(result.current.zoom).toBe(1)
    expect(result.current.pan).toEqual({ x: 0, y: 0 })
  })

  it('ignores drag attempts while at minZoom', () => {
    const { result } = renderHook(() => usePanZoom())
    result.current.containerRef.current = fakeContainer(400, 200)

    const downEvent = fakePointerEvent(0, 0)
    act(() => result.current.onPointerDown(downEvent))

    expect(result.current.dragging).toBe(false)
    expect(downEvent.preventDefault).not.toHaveBeenCalled()
  })

  it('pans by the pointer delta once zoomed in, clamped to the viewport', () => {
    const { result } = renderHook(() => usePanZoom())
    result.current.containerRef.current = fakeContainer(400, 200)

    act(() => result.current.zoomIn()) // zoom = 1.5

    act(() => result.current.onPointerDown(fakePointerEvent(100, 100)))
    expect(result.current.dragging).toBe(true)

    act(() => result.current.onPointerMove(fakePointerEvent(150, 130)))
    // overflow at zoom 1.5 over a 400x200 viewport: maxX=100, maxY=50
    expect(result.current.pan).toEqual({ x: 50, y: 30 })

    act(() => result.current.onPointerMove(fakePointerEvent(1000, 1000)))
    expect(result.current.pan).toEqual({ x: 100, y: 50 })

    act(() => result.current.endDrag())
    expect(result.current.dragging).toBe(false)
  })

  it('reset returns to zoom 1 and centered pan', () => {
    const { result } = renderHook(() => usePanZoom())
    result.current.containerRef.current = fakeContainer(400, 200)

    act(() => result.current.zoomIn())
    act(() => {
      result.current.onPointerDown(fakePointerEvent(0, 0))
      result.current.onPointerMove(fakePointerEvent(40, 20))
    })

    act(() => result.current.reset())
    expect(result.current.zoom).toBe(1)
    expect(result.current.pan).toEqual({ x: 0, y: 0 })
  })
})
