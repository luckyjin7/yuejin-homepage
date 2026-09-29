// Adds custom jest matchers for asserting on DOM nodes, e.g.
// expect(el).toBeInTheDocument()
import '@testing-library/jest-dom'

// jsdom doesn't implement matchMedia, but Chakra's ColorModeProvider (used
// by every Chakra component under test) queries it to watch the OS color
// scheme. Stub it out so components render without needing a real browser.
if (typeof window !== 'undefined' && !window.matchMedia) {
  window.matchMedia = query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => false
  })
}
