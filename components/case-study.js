import { useEffect, useState } from 'react'
import {
  Box,
  Heading,
  HStack,
  IconButton,
  Portal,
  Text,
  useColorModeValue
} from '@chakra-ui/react'
import { AddIcon, MinusIcon } from '@chakra-ui/icons'
import { IoExpand, IoContract } from 'react-icons/io5'
import { usePanZoom } from '../hooks/usePanZoom'

// Shared building blocks for the case-study-style /works pages (e.g.
// livestream.js, retail-chatbot.js): a pannable/zoomable diagram frame plus
// the small text pieces (lens cards, callout notes, figure captions) used
// around them.

// The pannable/zoomable viewport itself: a clipped box holding the diagram,
// transformed by the given usePanZoom() state. Reused by both the inline
// card and the fill-screen overlay below.
const PanZoomStage = ({ view, children }) => (
  <Box
    ref={view.containerRef}
    position="relative"
    overflow="hidden"
    w="100%"
    h="100%"
    style={{
      touchAction: view.zoom > 1 ? 'none' : 'auto',
      userSelect: view.zoom > 1 ? 'none' : 'auto',
      WebkitUserSelect: view.zoom > 1 ? 'none' : 'auto'
    }}
    cursor={view.zoom > 1 ? (view.dragging ? 'grabbing' : 'grab') : 'default'}
    onPointerDown={view.onPointerDown}
    onPointerMove={view.onPointerMove}
    onPointerUp={view.endDrag}
    onPointerLeave={view.endDrag}
  >
    <Box
      position="absolute"
      top="50%"
      left="50%"
      w="100%"
      h="100%"
      style={{
        transform: `translate(-50%, -50%) translate(${view.pan.x}px, ${view.pan.y}px) scale(${view.zoom})`,
        transformOrigin: 'center center',
        transition: view.dragging ? 'none' : 'transform 0.15s ease-out'
      }}
    >
      {children}
    </Box>
  </Box>
)

// The zoom in / zoom out / fill-screen (or exit) button cluster, pinned to
// the bottom-right corner of whichever box it's placed in.
const DiagramControls = ({ view, onToggleFill, isFilled, ...props }) => {
  const controlBg = useColorModeValue('whiteAlpha.800', 'blackAlpha.500')
  return (
    <HStack
      position="absolute"
      bottom={2}
      right={2}
      spacing={1}
      bg={controlBg}
      borderRadius="md"
      p="2px"
      css={{ backdropFilter: 'blur(6px)' }}
      {...props}
    >
      <IconButton
        aria-label="Zoom out"
        icon={<MinusIcon boxSize={2.5} />}
        size="xs"
        variant="ghost"
        onClick={view.zoomOut}
        isDisabled={view.zoom <= view.minZoom}
      />
      <IconButton
        aria-label="Zoom in"
        icon={<AddIcon boxSize={2.5} />}
        size="xs"
        variant="ghost"
        onClick={view.zoomIn}
        isDisabled={view.zoom >= view.maxZoom}
      />
      <IconButton
        aria-label={isFilled ? 'Exit full screen' : 'Fill screen'}
        icon={isFilled ? <IoContract size={12} /> : <IoExpand size={12} />}
        size="xs"
        variant="ghost"
        onClick={onToggleFill}
      />
    </HStack>
  )
}

// Wraps a diagram with drag-to-pan, +/- zoom, and a fill-screen toggle that
// opens the same diagram in an overlay covering the viewport below the
// sticky navbar. naturalWidth/naturalHeight should match the child svg's
// viewBox so the inline card keeps the same aspect ratio at any zoom level.
export const DiagramFrame = ({ children, naturalWidth, naturalHeight }) => {
  const cardView = usePanZoom()
  const overlayView = usePanZoom()
  const [isMaximized, setIsMaximized] = useState(false)

  const openMaximize = () => {
    cardView.reset()
    overlayView.reset()
    setIsMaximized(true)
  }
  const closeMaximize = () => {
    overlayView.reset()
    setIsMaximized(false)
  }

  useEffect(() => {
    if (!isMaximized) return undefined
    const onKeyDown = e => {
      if (e.key === 'Escape') closeMaximize()
    }
    document.addEventListener('keydown', onKeyDown)
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKeyDown)
      document.body.style.overflow = prevOverflow
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isMaximized])

  const borderColor = useColorModeValue('gray.200', 'whiteAlpha.300')
  const bg = useColorModeValue('white', 'whiteAlpha.50')
  const overlayBg = useColorModeValue('#f0e7db', '#202023')

  return (
    <>
      <Box borderWidth="1px" borderColor={borderColor} borderRadius="lg" bg={bg} p={4} position="relative">
        <Box w="100%" style={{ aspectRatio: `${naturalWidth} / ${naturalHeight}` }}>
          <PanZoomStage view={cardView}>{children}</PanZoomStage>
        </Box>
        <DiagramControls view={cardView} onToggleFill={openMaximize} isFilled={false} />
      </Box>

      {isMaximized && (
        <Portal>
          <Box
            position="fixed"
            top={0}
            left={0}
            right={0}
            bottom={0}
            zIndex={40}
            bg={overlayBg}
          >
            <Box position="absolute" top={0} left={0} right={0} bottom={0} p={{ base: 4, md: 8 }}>
              <PanZoomStage view={overlayView}>{children}</PanZoomStage>
            </Box>
            <DiagramControls
              view={overlayView}
              onToggleFill={closeMaximize}
              isFilled
              bottom={4}
              right={4}
              p="4px"
            />
          </Box>
        </Portal>
      )}
    </>
  )
}

// Shared caption style used under every figure, matching the figure
// captions on the other /works pages (e.g. geospatial.js).
export const FigCaption = ({ children }) => (
  <Text fontSize="sm" color="gray.500" textAlign="center" mt={2} mb={4}>
    {children}
  </Text>
)

// A small analysis card used in "lenses"-style grids (product-design
// lenses, problem callouts, eval results, proposed extensions, …).
export const Lens = ({ num, title, children }) => {
  const borderColor = useColorModeValue('gray.200', 'whiteAlpha.300')
  const bg = useColorModeValue('white', 'whiteAlpha.100')
  return (
    <Box borderWidth="1px" borderColor={borderColor} bg={bg} borderRadius="md" p={4}>
      <Text fontSize="xs" color="gray.500" mb={1}>{num}</Text>
      <Heading as="h4" fontSize="md" mb={2}>{title}</Heading>
      <Text fontSize="sm" color={useColorModeValue('gray.600', 'gray.400')}>{children}</Text>
    </Box>
  )
}

// A callout note, styled after the highlighted banner on the home page.
export const Note = ({ children, ...props }) => (
  <Box
    borderLeftWidth="3px"
    borderColor={useColorModeValue('blue.400', 'pink.300')}
    bg={useColorModeValue('blackAlpha.50', 'whiteAlpha.100')}
    borderRadius="md"
    px={4}
    py={3}
    fontSize="sm"
    color={useColorModeValue('gray.600', 'gray.400')}
    {...props}
  >
    {children}
  </Box>
)
