import { useEffect, useState } from 'react'
import {
  Container,
  List,
  ListItem,
  Box,
  Text,
  Divider,
  Heading,
  SimpleGrid,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  Code,
  HStack,
  IconButton,
  Portal,
  useColorModeValue
} from '@chakra-ui/react'
import { AddIcon, MinusIcon } from '@chakra-ui/icons'
import { IoExpand, IoContract } from 'react-icons/io5'
import { usePanZoom } from '../../hooks/usePanZoom'
import { Title, Meta } from '../../components/work'
import P from '../../components/paragraph'
import Section from '../../components/section'
import Layout from '../../components/layouts/article'

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
const DiagramFrame = ({ children, naturalWidth, naturalHeight }) => {
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

// Shared caption style used for every figure below, matching the figure
// captions on the other /works pages (e.g. geospatial.js).
const FigCaption = ({ children }) => (
  <Text fontSize="sm" color="gray.500" textAlign="center" mt={2} mb={4}>
    {children}
  </Text>
)

// Fig. 01 — the loop as shipped: chat -> ingest -> TensorFlow -> Unity -> scene
const FlowDiagramFigure = () => {
  const boxFill = useColorModeValue('#ffffff', '#2a2a2e')
  const lineColor = useColorModeValue('#cbd5e0', '#4a5568')
  const titleColor = useColorModeValue('#1a202c', '#f7fafc')
  const subColor = '#718096'

  return (
      <svg
        viewBox="0 0 1000 320"
        width="100%"
        height="100%"
        role="img"
        aria-label="Flow diagram: a viewer's Twitch chat message is ingested, classified by a TensorFlow NLP model into an intent and category, then handed to the Unity C# scene controller, which renders an update to the 3D scene."
      >
        <defs>
          <marker id="ls-arrow-a" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
            <path d="M0,0 L6,3 L0,6 Z" fill={lineColor} />
          </marker>
        </defs>

        <g>
          <rect x="10" y="40" width="260" height="70" rx="4" fill={boxFill} stroke={lineColor} strokeWidth="1.4" />
          <text x="140" y="70" textAnchor="middle" fontSize="13" fontWeight="600" fill={titleColor}>Twitch chat</text>
          <text x="140" y="88" textAnchor="middle" fontSize="11" fill={subColor}>!vote bedroom</text>
        </g>
        <g>
          <rect x="370" y="40" width="260" height="70" rx="4" fill={boxFill} stroke={lineColor} strokeWidth="1.4" />
          <text x="500" y="70" textAnchor="middle" fontSize="13" fontWeight="600" fill={titleColor}>Chat ingest</text>
          <text x="500" y="88" textAnchor="middle" fontSize="11" fill={subColor}>stream + de-dupe</text>
        </g>
        <g>
          <rect x="730" y="40" width="260" height="70" rx="4" fill={boxFill} stroke={lineColor} strokeWidth="1.4" />
          <text x="860" y="70" textAnchor="middle" fontSize="13" fontWeight="600" fill={titleColor}>TensorFlow NLP</text>
          <text x="860" y="88" textAnchor="middle" fontSize="11" fill={subColor}>intent + category</text>
        </g>

        <g>
          <rect x="370" y="230" width="260" height="70" rx="4" fill={boxFill} stroke={lineColor} strokeWidth="1.4" />
          <text x="500" y="260" textAnchor="middle" fontSize="13" fontWeight="600" fill={titleColor}>Unity · C#</text>
          <text x="500" y="278" textAnchor="middle" fontSize="11" fill={subColor}>scene controller</text>
        </g>
        <g>
          <rect x="730" y="230" width="260" height="70" rx="4" fill={boxFill} stroke={lineColor} strokeWidth="1.4" />
          <text x="860" y="260" textAnchor="middle" fontSize="13" fontWeight="600" fill={titleColor}>3D scene</text>
          <text x="860" y="278" textAnchor="middle" fontSize="11" fill={subColor}>element updates</text>
        </g>

        <g stroke={lineColor} strokeWidth="1.4" fill="none">
          <line x1="270" y1="75" x2="368" y2="75" markerEnd="url(#ls-arrow-a)" />
          <line x1="630" y1="75" x2="728" y2="75" markerEnd="url(#ls-arrow-a)" />
          <line x1="630" y1="265" x2="728" y2="265" markerEnd="url(#ls-arrow-a)" />
          <polyline points="860,110 860,170 500,170 500,228" markerEnd="url(#ls-arrow-a)" />
        </g>

        <g fill={subColor} fontSize="10.5">
          <text x="319" y="60" textAnchor="middle">raw message</text>
          <text x="679" y="60" textAnchor="middle">text batch</text>
          <text x="679" y="250" textAnchor="middle">scene command</text>
          <text x="680" y="163" textAnchor="middle">classified intent</text>
        </g>
      </svg>
  )
}

// The demo's split view: a low-poly build growing on the left, chat + vote
// tallies on the right. Kept as a dark "screen capture" panel since it's
// standing in for a screenshot of the live stream, not a piece of site UI.
const SceneReconstructionFigure = () => (
  <Box
    borderRadius="lg"
    overflow="hidden"
    boxShadow="md"
    display={{ md: 'flex' }}
    bg="#14141c"
  >
    <Box position="relative" flex="1" p={4} minH="220px">
      <Box
        position="absolute"
        top={3}
        left={3}
        display="flex"
        alignItems="center"
        gap={2}
        fontSize="10px"
        letterSpacing="0.05em"
        color="white"
      >
        <Box as="span" w="6px" h="6px" borderRadius="full" bg="#ff4d4d" />
        LIVE · LiveStream Architecture
      </Box>
      <svg viewBox="0 0 400 260" width="100%" height="100%" role="img" aria-label="Illustration reconstructing the demo: low-poly architectural blocks in orange, purple, and pink clustered in a 3D viewport, with floating vote markers nearby.">
        <polygon points="150,90 210,60 270,90 270,150 150,150" fill="#e8896a" />
        <polygon points="150,90 210,60 210,120 150,150" fill="#d9724f" opacity=".85" />
        <rect x="90" y="120" width="55" height="60" fill="#8a5fd6" />
        <polygon points="90,120 117,100 145,120" fill="#6f45bd" />
        <rect x="235" y="140" width="60" height="45" fill="#f2c9d6" />
        <polygon points="235,140 265,118 295,140" fill="#e0a7ba" />
        <rect x="185" y="150" width="40" height="30" fill="#5fb3ad" />
        <rect x="60" y="180" width="230" height="8" fill="#3a3a48" />
        <rect x="40" y="70" width="16" height="16" fill="#e9d24a" />
        <rect x="300" y="90" width="16" height="16" fill="#e9d24a" />
        <rect x="320" y="150" width="16" height="16" fill="#e9d24a" />
        <rect x="55" y="150" width="16" height="16" fill="#e9d24a" />
      </svg>
      <Box position="absolute" bottom={3} left={4} fontSize="9.5px" color="#d8d8e2">
        <Box opacity={0.85}>bedroom&nbsp; 4.8%</Box>
        <Box opacity={0.85}>living room&nbsp; 3.1%</Box>
        <Box opacity={0.85}>playground&nbsp; 1.7%</Box>
        <Box opacity={0.85}>patio&nbsp; 1.05%</Box>
      </Box>
    </Box>
    <Box bg="#0d0d13" borderLeft="1px solid #23232f" p={3} w={{ base: 'full', md: '220px' }} flexShrink={0}>
      {[
        ['viewer_42:', '!vote patio'],
        ['modArchitect:', '!build bedroom'],
        ['lurker99:', 'nice roofline lol'],
        ['chatgremlin:', '!vote playground'],
        ['yuejin:', 'top spend unlocked'],
        ['stream_bot:', '+1 living room']
      ].map(([who, msg]) => (
        <Box key={who} fontSize="10.5px" color="#c9c9d6" mb={2} display="flex" gap={1}>
          <Box as="span" color="#ff8f6b">{who}</Box>
          {msg}
        </Box>
      ))}
    </Box>
  </Box>
)

// A small analysis card used in the "lenses" and "shipping" grids
const Lens = ({ num, title, children }) => {
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

// A callout note, styled after the highlighted banner on the home page
const Note = ({ children }) => (
  <Box
    borderLeftWidth="3px"
    borderColor={useColorModeValue('blue.400', 'pink.300')}
    bg={useColorModeValue('blackAlpha.50', 'whiteAlpha.100')}
    borderRadius="md"
    px={4}
    py={3}
    fontSize="sm"
    color={useColorModeValue('gray.600', 'gray.400')}
  >
    {children}
  </Box>
)

// Fig. 02 — the proposed three-layer extension, with payload shapes labeled
// on the arrows between layers
const LayeredArchitectureFigure = () => {
  const boxFill = useColorModeValue('#ffffff', '#2a2a2e')
  const lineColor = useColorModeValue('#cbd5e0', '#4a5568')
  const titleColor = useColorModeValue('#1a202c', '#f7fafc')
  const subColor = '#718096'
  const bandBg = useColorModeValue('rgba(61,122,237,0.06)', 'rgba(255,99,195,0.06)')
  const accent = useColorModeValue('#3d7aed', '#ff63c3')

  const NodeBox = ({ x, y, title, sub, stroke = lineColor }) => (
    <g>
      <rect x={x} y={y} width="260" height="80" rx="4" fill={boxFill} stroke={stroke} strokeWidth="1.4" />
      <text x={x + 130} y={y + 35} textAnchor="middle" fontSize="13" fontWeight="600" fill={titleColor}>{title}</text>
      <text x={x + 130} y={y + 54} textAnchor="middle" fontSize="11" fill={subColor}>{sub}</text>
    </g>
  )

  return (
      <svg
        viewBox="0 0 1000 660"
        width="100%"
        height="100%"
        role="img"
        aria-label="Layered architecture diagram: layer one, streaming input, handles Twitch IRC and EventSub, ingestion and rate limiting, and a command queue. Layer two, Python and TensorFlow processing, tokenizes messages, classifies intent and entities, and validates against a command grammar. Layer three, the C# modeling server, dispatches commands, resolves them through an architectural rule engine, and instantiates meshes, then broadcasts a scene delta to Unity render clients. Each arrow between layers is labeled with the shape of the payload crossing it."
      >
        <defs>
          <marker id="ls-arrow-b" markerWidth="9" markerHeight="9" refX="7" refY="3.5" orient="auto">
            <path d="M0,0 L7,3.5 L0,7 Z" fill={lineColor} />
          </marker>
        </defs>

        <rect x="10" y="25" width="980" height="150" rx="4" fill={bandBg} />
        <text x="30" y="50" fontSize="12" letterSpacing="0.08em" fill={subColor}>{'01 · STREAMING INPUT'}</text>
        <NodeBox x={40} y={70} title="Twitch IRC / EventSub" sub="chat connection" />
        <NodeBox x={370} y={70} title="Ingest + rate limiter" sub="dedupe, per-user cooldown" />
        <NodeBox x={700} y={70} title="Command queue" sub="ordered message stream" />
        <g stroke={lineColor} strokeWidth="1.4" fill="none">
          <line x1="300" y1="110" x2="368" y2="110" markerEnd="url(#ls-arrow-b)" />
          <line x1="630" y1="110" x2="698" y2="110" markerEnd="url(#ls-arrow-b)" />
          <line x1="500" y1="175" x2="500" y2="215" markerEnd="url(#ls-arrow-b)" />
        </g>
        <text x="516" y="198" fontSize="10.5" fill={subColor}>{'raw text envelope · {user, msg, ts}'}</text>

        <rect x="10" y="215" width="980" height="150" rx="4" fill={bandBg} />
        <text x="30" y="240" fontSize="12" letterSpacing="0.08em" fill={subColor}>{'02 · PYTHON + TENSORFLOW PROCESSING'}</text>
        <NodeBox x={40} y={260} title="Tokenizer + normalizer" sub="strip emotes, lowercase" />
        <NodeBox x={370} y={260} title="Intent / entity classifier" sub="TensorFlow model" />
        <NodeBox x={700} y={260} title="Grammar validator" sub="confidence gate" />
        <g stroke={lineColor} strokeWidth="1.4" fill="none">
          <line x1="300" y1="300" x2="368" y2="300" markerEnd="url(#ls-arrow-b)" />
          <line x1="630" y1="300" x2="698" y2="300" markerEnd="url(#ls-arrow-b)" />
          <line x1="500" y1="365" x2="500" y2="405" markerEnd="url(#ls-arrow-b)" />
        </g>
        <text x="516" y="388" fontSize="10.5" fill={subColor}>{'Command · {action, target, material, confidence}'}</text>

        <rect x="10" y="405" width="980" height="150" rx="4" fill={bandBg} />
        <text x="30" y="430" fontSize="12" letterSpacing="0.08em" fill={subColor}>{'03 · C# MODELING SERVER'}</text>
        <NodeBox x={40} y={450} title="Command dispatcher" sub="sequencing, undo stack" />
        <NodeBox x={370} y={450} title="Architectural rule engine" sub="resolves valid placements" />
        <NodeBox x={700} y={450} title="Mesh / module instantiator" sub="builds the scene graph diff" />
        <g stroke={lineColor} strokeWidth="1.4" fill="none">
          <line x1="300" y1="490" x2="368" y2="490" markerEnd="url(#ls-arrow-b)" />
          <line x1="630" y1="490" x2="698" y2="490" markerEnd="url(#ls-arrow-b)" />
          <line x1="500" y1="555" x2="500" y2="595" markerEnd="url(#ls-arrow-b)" />
        </g>
        <text x="516" y="578" fontSize="10.5" fill={subColor}>{'SceneDelta · WebSocket broadcast'}</text>

        <rect x="300" y="595" width="400" height="55" rx="4" fill={boxFill} stroke={accent} strokeWidth="1.6" />
        <text x="500" y="628" textAnchor="middle" fontSize="13" fontWeight="600" fill={titleColor}>Unity render clients + OBS overlay</text>
      </svg>
  )
}

const Work = () => (
  <Layout title="livestream architecture">
    <Container>
      <Title>
        Livestream Architecture
      </Title>
      <P>
        Developed an interactive real-time project on the Twitch gaming platform that enabled dynamic audience engagement
        through live streaming, leveraging NLP tooling to process and respond to user chat interactions.
      </P>
      <List ml={1} my={1}>
        <ListItem>
          <Meta>Stack</Meta>
          <span>Unity, C#, Tensorflow</span>
        </ListItem>
      </List>

      <div style={{ maxWidth: '640px', margin: '1rem 0', position: 'relative' }}>
        <video
          src="https://dbgftyntvqk2gwwb.public.blob.vercel-storage.com/livestream_architecture.mp4"
          controls
          preload="none"
          poster="/images/works/livestream_01.png"
          aria-label="livestream demo on twitch"
          style={{ width: '100%', height: 'auto', display: 'block' }}
        >
          Your browser does not support the video tag.
        </video>
      </div>

      <Divider my={6} />

      <Section delay={0.1}>
        <Heading as="h3" variant="section-title">
          How it worked
        </Heading>
        <P>
          A viewer&apos;s chat message moves through a single loop: it&apos;s read off Twitch chat, classified by a
          TensorFlow model into an intent and a room category, and handed to the Unity scene controller, which
          drops the matching piece of geometry into the shared build.
        </P>
        <DiagramFrame naturalWidth={1000} naturalHeight={320}>
          <FlowDiagramFigure />
        </DiagramFrame>
        <FigCaption>
          Fig. 01 — chat text becomes a rendered scene change in a single pass, with TensorFlow doing the only
          interpretation step in between.
        </FigCaption>
      </Section>

      <Section delay={0.15}>
        <Heading as="h3" variant="section-title">
          What the demo shows
        </Heading>
        <P>
          A reconstruction of the clip embedded on the original page: a chat rail feeding a live tally, and a
          cluster of low-poly geometry that grows as votes land.
        </P>
        <SceneReconstructionFigure />
        <FigCaption>
          Illustrative reconstruction based on the demo clip, not a frame capture — proportions and copy are
          approximate.
        </FigCaption>
      </Section>

      <Section delay={0.2}>
        <Heading as="h3" variant="section-title">
          Six lenses on the loop
        </Heading>
        <P>
          Read as a product rather than a demo reel: what job it does for a viewer, and where the design carries
          weight versus where it&apos;s simply implied by the stack.
        </P>
        <SimpleGrid columns={{ base: 1, sm: 2 }} spacing={4} my={2}>
          <Lens num="01 · core loop">Type a command, see a number move, watch geometry appear. No page reload, no account: the entire interaction surface is the chat box a viewer already has open.</Lens>
          <Lens num="02 · users & motivation">Twitch chat is high-volume and low-attention by default. The bet: a visible, shared, cumulative effect (the house grows) turns passive lurking into repeated small actions.</Lens>
          <Lens num="03 · information architecture">A flat set of room categories keeps the vote tally legible at a glance, but caps expressiveness — no sub-choices for style, material, or placement.</Lens>
          <Lens num="04 · interaction model">Voting happens through free-text chat rather than buttons or polls. NLP is the interface, which is expressive but harder to guarantee correct.</Lens>
          <Lens num="05 · feedback signifiers">A percentage readout and new geometry are the only confirmations. There&apos;s no per-message acknowledgment, so a viewer can&apos;t easily tell if their own message landed.</Lens>
          <Lens num="06 · constraints from the stack">One NLP hop drives the scene directly, so a misclassification becomes a visible, public mistake — there&apos;s no moderation or confidence gate in the loop.</Lens>
        </SimpleGrid>
      </Section>

      <Section delay={0.25}>
        <Heading as="h3" variant="section-title">
          Where the design opens up
        </Heading>
        <P>
          The tight, single-hop loop is exactly why it&apos;s hard to grow: NLP, game logic, and rendering all live
          in reach of one Unity process.
        </P>
        <SimpleGrid columns={{ base: 1, md: 3 }} spacing={4} my={2}>
          <Lens num="Problem 1 · coupling">Swapping or retraining the classifier means touching the same codebase that renders the scene — ML iteration speed is bound to game-build iteration speed.</Lens>
          <Lens num="Problem 2 · vocabulary ceiling">A flat category classifier can vote, but can&apos;t say &quot;which wall&quot; or &quot;what material.&quot; Richer commands need a real grammar, not just a label.</Lens>
          <Lens num="Problem 3 · no safety valve">Nothing sits between &quot;classified&quot; and &quot;rendered,&quot; so a misclassified or hostile message becomes a permanent, visible change to a shared scene.</Lens>
        </SimpleGrid>
      </Section>

      <Section delay={0.3}>
        <Heading as="h3" variant="section-title">
          A proposed three-layer extension
        </Heading>
        <P>
          Splitting the single hop into a pipeline with a real boundary at each seam: streaming input owns the chat
          connection and rate control, Python + TensorFlow owns language understanding, and a dedicated C# modeling
          server owns the architectural rule set and mesh generation.
        </P>
        <DiagramFrame naturalWidth={1000} naturalHeight={660}>
          <LayeredArchitectureFigure />
        </DiagramFrame>
        <FigCaption>
          Fig. 02 — <Code>!build bedroom oak</Code> crosses three ownership boundaries; each arrow marks a
          payload-shape change, the seam the original design skipped by fusing NLP output directly to scene state.
        </FigCaption>

        <Note>
          <b>Why split it this way:</b> Python owns layer two because the ML ecosystem (TensorFlow, tokenizers,
          retraining, evaluation) is native there and shouldn&apos;t require a Unity rebuild to iterate on. C# owns
          layer three because rule resolution and mesh instantiation want Unity&apos;s own geometry and asset types,
          and keeping the rule engine outside the classifier means the same validated command can be replayed,
          tested, or fed from a source other than Twitch chat.
        </Note>
      </Section>

      <Section delay={0.35}>
        <Heading as="h3" variant="section-title">
          From free text to architectural elements
        </Heading>
        <P>
          The proposed grammar keeps the original&apos;s low floor — anyone can type <Code>!vote bedroom</Code> —
          while giving the classifier enough structure to target a specific element instead of a category tally.
        </P>
        <TableContainer my={2}>
          <Table size="sm" variant="simple">
            <Thead>
              <Tr>
                <Th>Chat message</Th>
                <Th>Parsed intent</Th>
                <Th>Scene effect</Th>
              </Tr>
            </Thead>
            <Tbody>
              <Tr>
                <Td><Code>!vote patio</Code></Td>
                <Td fontSize="sm" color="gray.500">VOTE · category=patio</Td>
                <Td fontSize="sm" color="gray.500">Vote weight +1, no geometry change</Td>
              </Tr>
              <Tr>
                <Td><Code>!build patio oak</Code></Td>
                <Td fontSize="sm" color="gray.500">BUILD · category=patio, material=oak</Td>
                <Td fontSize="sm" color="gray.500">Oak-textured patio mesh instantiated</Td>
              </Tr>
              <Tr>
                <Td><Code>!undo</Code></Td>
                <Td fontSize="sm" color="gray.500">UNDO</Td>
                <Td fontSize="sm" color="gray.500">Last module removed, vote restored</Td>
              </Tr>
              <Tr>
                <Td><Code>!lock roof 5m</Code></Td>
                <Td fontSize="sm" color="gray.500">LOCK · target=roof, duration=5m</Td>
                <Td fontSize="sm" color="gray.500">Roof immutable for 5 min, throttles griefing</Td>
              </Tr>
              <Tr>
                <Td><Code>nice roofline lol</Code></Td>
                <Td fontSize="sm" color="gray.500">below confidence threshold</Td>
                <Td fontSize="sm" color="gray.500">Dropped — no scene effect</Td>
              </Tr>
            </Tbody>
          </Table>
        </TableContainer>
      </Section>

      <Section delay={0.4}>
        <Heading as="h3" variant="section-title">
          What the extra layers buy
        </Heading>
        <SimpleGrid columns={{ base: 1, sm: 2 }} spacing={4} my={2}>
          <Lens num="→ latency budget">Three network hops instead of one in-process call — target well under half a second, chat-to-render, so the &quot;I typed it, it happened&quot; feeling still holds live.</Lens>
          <Lens num="→ moderation surface">The grammar validator and per-user cooldown become the place to rate-limit spam and gate low-confidence parses — a seam the original single-hop design didn&apos;t have.</Lens>
          <Lens num="→ streamer controls">A separate modeling server can expose admin controls (pause, force-undo, reset) without touching the classifier or the Unity render client.</Lens>
          <Lens num="→ testability">Structured commands between layers two and three can be replayed from a fixture file, so the rule engine becomes testable without a live Twitch connection.</Lens>
          <Lens num="→ operational cost">Three deployable services instead of one Unity build — worth it once the classifier needs its own retrain/deploy cycle, not before.</Lens>
          <Lens num="→ what to measure">Command-to-render latency, parse confidence distribution, noise-vs-command ratio, and repeat participation per viewer session.</Lens>
        </SimpleGrid>
      </Section>
    </Container>
  </Layout>
)

export default Work
export { getServerSideProps } from '../../components/chakra'
