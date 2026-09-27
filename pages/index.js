import { useEffect } from 'react'
import { useRouter } from 'next/router'
import {
  Link,
  Container,
  Heading,
  Box,
  Text,
  Badge,
  Tooltip,
  useClipboard,
  useColorModeValue
} from '@chakra-ui/react'
import Paragraph from '../components/paragraph'
import Layout from '../components/layouts/article'
import Section from '../components/section'
import { WorksSection } from './works'
import Image from 'next/image'
import HeroVideo from '../components/hero-video'

const EMAIL = 'iamyuejin@gmail.com'

const Home = () => {
  const router = useRouter()
  const { onCopy, hasCopied } = useClipboard(EMAIL)

  useEffect(() => {
    if (!router.asPath.includes('#works')) return
    // wait for the page-enter and section-stagger animations to settle
    // before measuring/scrolling, so we land exactly on the heading
    const timer = setTimeout(() => {
      document.getElementById('works')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }, 1000)
    return () => clearTimeout(timer)
  }, [router.asPath])

  return (
    <Layout>
      <Container>
        <Box
          borderRadius="lg"
          mt={6}
          mb={6}
          p={3}
          textAlign="center"
          bg={useColorModeValue('whiteAlpha.500', 'whiteAlpha.200')}
          css={{ backdropFilter: 'blur(10px)' }}
        >
          Hello, I&apos;m a software developer based in Canada!
        </Box>

        <Box display={{ md: 'flex' }}>
          <Box flexGrow={1}>
            <Heading as="h2" variant="page-title">
              Hey, I&apos;m{' '}
              <ruby>
                Yue
                <rp>(</rp>
                <rt style={{ fontSize: '0.5em', fontWeight: 'normal' }}>玥</rt>
                <rp>)</rp>
              </ruby>
            </Heading>
            <Text fontSize="sm" color="gray.500" mb={2}>
            My name is pronounced as &quot;yweh&quot; (/yɥɛ/)
            </Text>
            <Text mb={8}>Developer / Designer / Architect</Text>
          </Box>
          <Box
            flexShrink={0}
            mt={{ base: 4, md: 0 }}
            ml={{ md: 6 }}
            textAlign="center"
          >
            <Box
              borderColor="whiteAlpha.800"
              borderWidth={2}
              borderStyle="solid"
              w="100px"
              h="100px"
              display="inline-block"
              borderRadius="full"
              overflow="hidden"
            >
              <Image
                src="/images/yue.jpg"
                alt="Profile image"
                width="100"
                height="100"
              />
            </Box>
          </Box>
        </Box>

        <Section delay={0.1}>
          <Heading as="h3" variant="section-title">
            Bio
          </Heading>
          <Paragraph>
            I am a develper based in Vancouver, BC, Canada. I have a cat assistant to help me{' '}
            <span style={{ textDecoration: 'underline', textDecorationStyle: 'dotted' }}>(hopefully)</span>{' '}
            when sitting in front of the computer.
          </Paragraph>
          <Paragraph>
            This website is my humble abode on the Internet, where I stash some fun personal development projects, ranging from{' '}
            <Badge colorScheme="blue">secure software development</Badge>{' to '}
            <Badge colorScheme="green">GIS</Badge>{' and '}
            <Badge colorScheme="purple">3D modeling</Badge>.
          </Paragraph>
          <Paragraph>
            Feel free to reach me at{' '}
            <Tooltip label={hasCopied ? 'Copied!' : 'Click to copy'} closeOnClick={false} hasArrow>
              <Badge
                as="button"
                type="button"
                colorScheme="blue"
                textTransform="none"
                fontSize="inherit"
                fontWeight="normal"
                cursor="pointer"
                onClick={onCopy}
              >
                {EMAIL}
              </Badge>
            </Tooltip>
            .
          </Paragraph>
        </Section>

        <Section delay={0.2} id="works" scrollMarginTop="90px">
          <Heading as="h3" variant="section-title">
            Works
          </Heading>
          <WorksSection />
        </Section>

        <Section delay={0.3}>
          <Heading as="h3" variant="section-title">
            I ♥
          </Heading>
          <Paragraph>
            Art,{' '}
            <Link href="/works/landscape" target="_blank">
              <Badge
                bg={useColorModeValue('blue.50', 'rgba(255,99,195,0.15)')}
                color={useColorModeValue('#3d7aed', '#ff63c3')}
              >Architectural Design</Badge>
            </Link>
            , Geography, Machine Learning, Music
          </Paragraph>
        </Section>

        <Text
          textAlign="center"
          fontStyle="italic"
          color={useColorModeValue('gray.600', 'gray.400')}
          mb={4}
        >
          Enjoy your time!
        </Text>

        <Box px={4}>
          <HeroVideo />
        </Box>
      </Container>
    </Layout>
  )
}

export default Home
export { getServerSideProps } from '../components/chakra'
