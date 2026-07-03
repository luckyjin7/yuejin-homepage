import { useState, useEffect, useRef } from 'react'
import {
  Container,
  Badge,
  Link,
  List,
  ListItem,
  Box
} from '@chakra-ui/react'
import Layout from '../../components/layouts/article'
import { ExternalLinkIcon } from '@chakra-ui/icons'
import { Title, Meta } from '../../components/work'
import P from '../../components/paragraph'

const Work = () => {
  const iframeRef = useRef(null)
  const [frameHeight, setFrameHeight] = useState(600)

  useEffect(() => {
    const el = iframeRef.current
    if (!el) return
    const onLoad = () => {
      try {
        // Collapse to 1px so min-height:100vh inside the iframe doesn't inflate scrollHeight
        el.style.height = '1px'
        const h = el.contentDocument.documentElement.scrollHeight
        el.style.height = '100%'
        if (h > 0) setFrameHeight(h)
      } catch (_) {}
    }
    el.addEventListener('load', onLoad)
    return () => el.removeEventListener('load', onLoad)
  }, [])

  return (
    <Layout title="DDoS Detection Simulator">
      <Container>
        <Title>
          DDoS Detection Simulator <Badge>2024-2025</Badge>
        </Title>
        <P>
          An interactive simulation of the LUCID CNN-based intrusion detection
          framework evaluated against MHDDoS-simulated TCP, UDP, and HTTP GET
          flood attacks in a LAN environment.
        </P>
        <P>
          Configure botnet parameters, launch a simulated attack, and watch LUCID
          respond in real-time with live accuracy, F1, TPR, and FPR metrics across
          three attack vectors.
        </P>

        <List ml={4} my={4}>
          <ListItem>
            <Meta>Platform</Meta>
            <span>Web</span>
          </ListItem>
          <ListItem>
            <Meta>Stack</Meta>
            <span>Vanilla HTML/CSS/JS, Chart.js, CNN (LUCID), MHDDoS</span>
          </ListItem>
          {/* <ListItem>
            <Meta>Reference</Meta>
            <Link href="https://github.com/doriguzzi/lucid-ddos" isExternal>
              github.com/doriguzzi/lucid-ddos <ExternalLinkIcon mx="2px" />
            </Link>
          </ListItem> */}
          <ListItem>
            <Meta>Reference</Meta>
            <Link href="https://ieeexplore.ieee.org/document/9016093" isExternal>
              Original LUCID Paper (IEEE TNSM) <ExternalLinkIcon mx="2px" />
            </Link>
          </ListItem>
        </List>

        <Box
          my={6}
          borderRadius="lg"
          overflow="hidden"
          position="relative"
          style={{ height: `${frameHeight}px` }}
        >
          <iframe
            ref={iframeRef}
            src="/ddos-attack/index.html"
            title="LUCID DDoS Detection Simulator"
            scrolling="no"
            style={{ width: '100%', height: '100%', border: 'none', display: 'block' }}
          />
        </Box>
      </Container>
    </Layout>
  )
}

export default Work
export { getServerSideProps } from '../../components/chakra'
