import {
  Container,
  Badge,
  List,
  ListItem,
  Box,
  Text,
  useColorModeValue
} from '@chakra-ui/react'
import { ExternalLinkIcon } from '@chakra-ui/icons'
import { Title, Meta } from '../../components/work'
import P from '../../components/paragraph'
import Layout from '../../components/layouts/article'

const Work = () => {
  const borderColor = useColorModeValue('gray.200', 'whiteAlpha.300')
  const overlayBg = useColorModeValue(
    'rgba(255,255,255,0.06)',
    'rgba(0,0,0,0.10)'
  )
  const badgeBg = useColorModeValue('whiteAlpha.900', 'blackAlpha.800')

  return (
    <Layout title="iPhoto Journey">
      <Container>
        <Title>
          iPhoto Journey <Badge>2024</Badge>
        </Title>
        <P>
          A client-side scrollytelling app that reads EXIF GPS metadata from
          iPhone photos and plots your journey on an interactive map — no
          upload, no server, everything runs in the browser. Photos are
          clustered by location, displayed in a narrative side panel, and
          linked to Leaflet map markers so you can relive each moment of a
          trip.
        </P>
        <List ml={4} my={4}>
          <ListItem>
            <Meta>Stack</Meta>
            <span>Vanilla JS, Leaflet.js, exifr, HTML/CSS</span>
          </ListItem>
          <ListItem>
            <Meta>Platform</Meta>
            <span>Browser (client-side only)</span>
          </ListItem>
          <ListItem>
            <Meta>Privacy</Meta>
            <span>All processing is local — nothing leaves your device</span>
          </ListItem>
        </List>

        {/* Demo preview — click anywhere to open full-screen in a new tab */}
        <Box
          as="a"
          href="/photo-journey.html"
          target="_blank"
          rel="noopener noreferrer"
          display="block"
          position="relative"
          borderRadius="lg"
          overflow="hidden"
          borderWidth={1}
          borderColor={borderColor}
          my={6}
          style={{ height: '620px' }}
          cursor="pointer"
          aria-label="Open iPhoto Journey app in a new tab"
          sx={{
            '&:hover .demo-overlay': { opacity: 1 }
          }}
        >
          {/* Non-interactive preview */}
          <iframe
            src="/photo-journey.html"
            title="iPhoto Journey preview"
            style={{
              width: '100%',
              height: '100%',
              border: 'none',
              display: 'block',
              pointerEvents: 'none'
            }}
            tabIndex={-1}
            aria-hidden="true"
          />

          {/* Hover overlay */}
          <Box
            className="demo-overlay"
            position="absolute"
            inset={0}
            bg={overlayBg}
            opacity={0}
            transition="opacity 0.2s"
            display="flex"
            alignItems="center"
            justifyContent="center"
          >
            <Box
              bg={badgeBg}
              borderRadius="full"
              px={6}
              py={3}
              display="flex"
              alignItems="center"
              gap={2}
              boxShadow="lg"
            >
              <Text fontWeight="semibold" fontSize="sm">
                Open in new tab
              </Text>
              <ExternalLinkIcon />
            </Box>
          </Box>
        </Box>
      </Container>
    </Layout>
  )
}

export default Work
export { getServerSideProps } from '../../components/chakra'