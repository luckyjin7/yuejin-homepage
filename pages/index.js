import {
  Link,
  Container,
  Heading,
  Box,
  Text,
  Badge,
  useColorModeValue
} from '@chakra-ui/react'
import Paragraph from '../components/paragraph'
import Layout from '../components/layouts/article'
import Section from '../components/section'
import { WorksSection } from './works'
import Image from 'next/image'

const Home = () => (
  <Layout>
    <Container>
      <Box
        borderRadius="lg"
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
            Yue JIN<Text as="span" fontSize="sm" color="gray.500" ml={2}>(English name: Shirley)</Text>
          </Heading>
          <p>Developer / Designer / Architect</p>
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
          <Badge colorScheme="blue">software development</Badge>{' to '}
          <Badge colorScheme="green">GIS</Badge>{' and '}
          <Badge colorScheme="purple">3D modeling</Badge>.
        </Paragraph>

        <Box mt={6} mb={2}>
          <Text fontWeight="bold" mb={3}>
            My take on LLM:
          </Text>
          <Box
            borderLeftWidth="3px"
            borderLeftStyle="solid"
            borderLeftColor={useColorModeValue('#3d7aed', '#ff63c3')}
            pl={4}
            py={1}
          >
            <Text textAlign="justify" color={useColorModeValue('gray.700', 'gray.300')}>
              Fully understanding how to use new tools + cleary recognizing the mutual limitations between humans and LLMs, is what lets us move past the fear of uncertainty, both about ourselves and about where AI is headed.
            </Text>
          </Box>
        </Box>
      </Section>

      <Section delay={0.2} id="works">
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
    </Container>
  </Layout>
)

export default Home
export { getServerSideProps } from '../components/chakra'
