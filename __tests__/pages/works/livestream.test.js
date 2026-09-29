import { ChakraProvider } from '@chakra-ui/react'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import theme from '../../../lib/theme'
import Work from '../../../pages/works/livestream'

const renderPage = () => render(
  <ChakraProvider theme={theme}>
    <Work />
  </ChakraProvider>
)

describe('Livestream Architecture page', () => {
  it('renders the title and both diagrams', () => {
    renderPage()

    expect(screen.getByRole('heading', { name: /livestream architecture/i })).toBeInTheDocument()
    expect(screen.getByRole('img', { name: /flow diagram/i })).toBeInTheDocument()
    expect(screen.getByRole('img', { name: /layered architecture diagram/i })).toBeInTheDocument()
  })

  it('gives each diagram its own zoom controls, starting zoomed out', () => {
    renderPage()

    const zoomOutButtons = screen.getAllByRole('button', { name: 'Zoom out' })
    const zoomInButtons = screen.getAllByRole('button', { name: 'Zoom in' })

    // one card per diagram (the fill-screen overlay isn't open yet)
    expect(zoomOutButtons).toHaveLength(2)
    expect(zoomInButtons).toHaveLength(2)
    zoomOutButtons.forEach(btn => expect(btn).toBeDisabled())
    zoomInButtons.forEach(btn => expect(btn).toBeEnabled())
  })

  it('zooming in on one diagram enables its zoom-out control without affecting the other', async () => {
    const user = userEvent.setup()
    renderPage()

    const [firstZoomIn] = screen.getAllByRole('button', { name: 'Zoom in' })
    await user.click(firstZoomIn)

    const [firstZoomOut, secondZoomOut] = screen.getAllByRole('button', { name: 'Zoom out' })
    expect(firstZoomOut).toBeEnabled()
    expect(secondZoomOut).toBeDisabled()
  })

  it('opens a fill-screen overlay of the diagram and can be closed again', async () => {
    const user = userEvent.setup()
    renderPage()

    const [fillButton] = screen.getAllByRole('button', { name: 'Fill screen' })
    await user.click(fillButton)

    const exitButton = await screen.findByRole('button', { name: 'Exit full screen' })
    expect(exitButton).toBeInTheDocument()

    await user.click(exitButton)
    expect(screen.queryByRole('button', { name: 'Exit full screen' })).not.toBeInTheDocument()
  })

  it('closes the fill-screen overlay on Escape', async () => {
    const user = userEvent.setup()
    renderPage()

    const [fillButton] = screen.getAllByRole('button', { name: 'Fill screen' })
    await user.click(fillButton)
    await screen.findByRole('button', { name: 'Exit full screen' })

    await user.keyboard('{Escape}')
    expect(screen.queryByRole('button', { name: 'Exit full screen' })).not.toBeInTheDocument()
  })

  it('renders the command grammar table', () => {
    renderPage()

    const table = screen.getByRole('table')
    expect(within(table).getByText('!vote patio')).toBeInTheDocument()
    expect(within(table).getByText('!build patio oak')).toBeInTheDocument()
  })
})
