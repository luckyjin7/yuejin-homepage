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
  Wrap,
  WrapItem,
  Badge,
  Button,
  useColorModeValue
} from '@chakra-ui/react'
import { ExternalLinkIcon } from '@chakra-ui/icons'
import { Lens, Note } from '../../components/case-study'
import { Title, Meta } from '../../components/work'
import P from '../../components/paragraph'
import Section from '../../components/section'
import Layout from '../../components/layouts/article'

const DEMO_URL = 'https://canada-retail-chatbot.streamlit.app/'

const SAMPLE_QUESTIONS = [
  'Which retail category grew fastest in 2025?',
  'How do median incomes in Ontario and Quebec compare?'
]

// An illustrative reconstruction of a chat turn, based on the README's
// description of the UI (streaming, collapsible SQL, provenance footer,
// feedback) — not a screenshot of the live app.
const ChatMockFigure = () => {
  const cardBg = useColorModeValue('white', '#1b1d24')
  const borderColor = useColorModeValue('gray.200', 'whiteAlpha.200')
  const userBg = useColorModeValue('blue.50', 'whiteAlpha.100')
  const sqlBg = useColorModeValue('gray.50', 'blackAlpha.300')
  const mutedColor = useColorModeValue('gray.500', 'gray.400')

  return (
    <Box borderWidth="1px" borderColor={borderColor} borderRadius="lg" bg={cardBg} p={{ base: 4, md: 5 }} boxShadow="sm">
      <Box bg={userBg} borderRadius="md" px={3} py={2} mb={3} maxW="80%" fontSize="sm">
        Which retail category grew fastest in 2025?
      </Box>

      <Text fontSize="xs" color={mutedColor} mb={2}>writing SQL against retail_sales_naics · executing · streaming answer…</Text>

      <Text fontSize="sm" mb={3}>
        <b>Furniture &amp; home furnishings stores</b> grew fastest among NAICS retail
        categories in 2025, up <b>7.8%</b> year over year, putting it ahead of motor
        vehicle &amp; parts dealers (+5.1%) and food &amp; beverage stores (+3.4%).
      </Text>

      <Box bg={sqlBg} borderRadius="md" px={3} py={2} mb={3} fontSize="xs" fontFamily="mono" color={mutedColor}>
        ▸ SQL · SELECT naics_category, pct_change FROM retail_sales_yoy WHERE year = 2025 ORDER BY pct_change DESC LIMIT 5
      </Box>

      <Text fontSize="xs" color={mutedColor}>
        Source: StatCan monthly retail sales by NAICS, 2026-08-31 snapshot. 👍 👎
      </Text>
    </Box>
  )
}

// A sample-question chip, styled as a small frosted-glass pill to match
// the soft pastel glassmorphism of the CTA card it lives in.
const SampleQuestionChip = ({ children }) => (
  <Badge
    textTransform="none"
    fontWeight="normal"
    px={3}
    py={1}
    borderRadius="full"
    color="rgba(70,70,95,0.85)"
    css={{
      background: 'rgba(255,255,255,0.5)',
      backdropFilter: 'blur(6px)',
      WebkitBackdropFilter: 'blur(6px)',
      border: '1px solid rgba(255,255,255,0.75)',
      boxShadow: '0 2px 10px rgba(170,170,210,0.15)'
    }}
  >
    {children}
  </Badge>
)

const Work = () => (
  <Layout title="Canada Retail Market Assistant">
    <Container>
      <Title>
        Canada Retail Market Assistant
      </Title>
      <P>
        A production-minded chat agent over Statistics Canada retail data. Ask in any
        language, and it writes real SQL against StatCan&apos;s retail-sales, CPI, and
        income tables, streams back an answer, and shows the exact query behind every
        number it gives you.
      </P>
      <P>
        The project treats trustworthiness as the main feature, not an afterthought:
        it&apos;s built to refuse an answer rather than guess at one, and every figure
        it states is meant to be traceable back to a query result.
      </P>
      <List ml={1} my={1}>
        <ListItem>
          <Meta>Stack</Meta>
          <span>Claude Opus 5 · Sonnet 5 · Haiku, Streamlit, Neon Postgres, Grafana Cloud</span>
        </ListItem>
        <ListItem>
          <Meta>Data</Meta>
          <span>StatCan monthly retail sales by NAICS (1991–2026), CPI, provincial income (~137k rows total)</span>
        </ListItem>
      </List>

      <Box
        borderRadius="24px"
        p={{ base: 4, md: 6 }}
        textAlign="center"
        my={4}
        css={{
          background:
            'linear-gradient(135deg, rgba(186,220,255,0.45) 0%, rgba(221,209,250,0.4) 50%, rgba(255,209,229,0.45) 100%), rgba(255,255,255,0.65)',
          backdropFilter: 'blur(20px) saturate(160%)',
          WebkitBackdropFilter: 'blur(20px) saturate(160%)',
          border: '1px solid rgba(255,255,255,0.7)',
          boxShadow: '0 8px 30px rgba(170,170,210,0.18), inset 0 1px 0 rgba(255,255,255,0.6)'
        }}
      >
        <Text fontSize="sm" color="rgba(70,70,95,0.75)" mb={3}>
          🍁 Live demo: ask it something
        </Text>
        <Button
          as="a"
          href={DEMO_URL}
          target="_blank"
          rel="noopener noreferrer"
          size="lg"
          rightIcon={<ExternalLinkIcon />}
          color="white"
          css={{
            background: 'linear-gradient(135deg, rgba(137,176,255,0.95), rgba(190,160,255,0.9))',
            backdropFilter: 'blur(8px)',
            WebkitBackdropFilter: 'blur(8px)',
            border: '1px solid rgba(255,255,255,0.55)',
            boxShadow: '0 6px 18px rgba(140,150,220,0.35)'
          }}
          _hover={{ filter: 'brightness(1.05)' }}
          _active={{ filter: 'brightness(0.95)' }}
        >
          Try the Retail Market Assistant
        </Button>
        <Wrap justify="center" mt={4} spacing={2}>
          {SAMPLE_QUESTIONS.map(q => (
            <WrapItem key={q}>
              <SampleQuestionChip>{q}</SampleQuestionChip>
            </WrapItem>
          ))}
        </Wrap>
      </Box>

      <Divider my={6} />

      <Section delay={0.1}>
        <Heading as="h3" variant="section-title">
          Strengths
        </Heading>
        <P>
          What the design is willing to bet on:
        </P>
        <SimpleGrid columns={{ base: 1, sm: 2 }} spacing={4} my={2}>
          <Lens num="+ grounded, not recalled">
            Every number comes from a live SQL query against StatCan tables, re-run
            each time, rather than from what a model remembers being trained on.
          </Lens>
          <Lens num="+ provenance you can click through">
            The SQL behind an answer sits one tap away. Not &quot;trust me&quot;.
          </Lens>
          <Lens num="− memory resets with the tab">
            Chat history is session-only; there are no accounts yet, so nothing persists
            across visits.
          </Lens>
          <Lens num="− limits are per-session, not per-person">
            Without login, a new tab is a new rate-limit budget.
          </Lens>
        </SimpleGrid>

        <Heading as="h4" fontSize="md" mt={6} mb={3}>
          vs. just asking ChatGPT
        </Heading>
        <TableContainer>
          <Table size="sm" variant="simple">
            <Thead>
              <Tr>
                <Th></Th>
                <Th>A general chatbot</Th>
                <Th>This assistant</Th>
              </Tr>
            </Thead>
            <Tbody>
              <Tr>
                <Td fontSize="sm" color="gray.500">Where the number comes from</Td>
                <Td fontSize="sm">Training-time recall</Td>
                <Td fontSize="sm">A live query, run fresh every time</Td>
              </Tr>
              <Tr>
                <Td fontSize="sm" color="gray.500">Can you check it</Td>
                <Td fontSize="sm">No, taken on faith</Td>
                <Td fontSize="sm">Yes, because the SQL is shown, not claimed</Td>
              </Tr>
              <Tr>
                <Td fontSize="sm" color="gray.500">When it doesn&apos;t know</Td>
                <Td fontSize="sm">Tends to hedge and answer anyway</Td>
                <Td fontSize="sm">Refuses, since &quot;no data&quot; beats a guess</Td>
              </Tr>
              <Tr>
                <Td fontSize="sm" color="gray.500">Scope</Td>
                <Td fontSize="sm">Broad, shallow on any one dataset</Td>
                <Td fontSize="sm">One database, guardrails tuned to it</Td>
              </Tr>
            </Tbody>
          </Table>
        </TableContainer>
      </Section>

      <Section delay={0.2}>
        <Heading as="h3" variant="section-title">
          What a session looks like
        </Heading>
        <P>
          Streaming status, a plain-language answer, SQL provenance one tap away, and a
          source line with a feedback control, so nothing claims a number the SQL below
          it didn&apos;t produce.
        </P>
        <ChatMockFigure />
      </Section>

      <Section delay={0.3}>
        <Heading as="h3" variant="section-title">
          Defense in depth
        </Heading>
        <P>
          Every layer has attack-suite evidence behind it (a 21-case suite covering
          comment smuggling, statement splitting, and encoded literals runs in CI), and
          every layer has a named backstop for when it fails.
        </P>
        <TableContainer my={2}>
          <Table size="sm" variant="simple">
            <Thead>
              <Tr>
                <Th>Layer</Th>
                <Th>Defense</Th>
                <Th>Backstop if it fails</Th>
              </Tr>
            </Thead>
            <Tbody>
              <Tr>
                <Td fontSize="sm">Input</Td>
                <Td fontSize="sm" color="gray.500">FP≈0 injection signatures, raw-SQL block, 3-tier rate limits</Td>
                <Td fontSize="sm" color="gray.500">Rejected free, pre-model</Td>
              </Tr>
              <Tr>
                <Td fontSize="sm">Money</Td>
                <Td fontSize="sm" color="gray.500">Daily budget breaker (process)</Td>
                <Td fontSize="sm" color="gray.500">Platform monthly spend cap</Td>
              </Tr>
              <Tr>
                <Td fontSize="sm">SQL</Td>
                <Td fontSize="sm" color="gray.500">Lexical allowlist after comment/literal stripping</Td>
                <Td fontSize="sm" color="gray.500">EXPLAIN cost gate</Td>
              </Tr>
              <Tr>
                <Td fontSize="sm">Execution</Td>
                <Td fontSize="sm" color="gray.500">Single-exit gateway module</Td>
                <Td fontSize="sm" color="gray.500"><Code>app_ro</Code>: SELECT-only + 15s timeout</Td>
              </Tr>
              <Tr>
                <Td fontSize="sm">Data-side</Td>
                <Td fontSize="sm" color="gray.500">Results wrapped in random tags, &quot;data ≠ instructions&quot;</Td>
                <Td fontSize="sm" color="gray.500">Worst case is still one validated SELECT</Td>
              </Tr>
              <Tr>
                <Td fontSize="sm">Output</Td>
                <Td fontSize="sm" color="gray.500">Image-markdown stripped (beacon channel closed)</Td>
                <Td fontSize="sm" color="gray.500">HTML escaped by the framework</Td>
              </Tr>
              <Tr>
                <Td fontSize="sm">Logs</Td>
                <Td fontSize="sm" color="gray.500">Separate DB, INSERT-only writer, parameterized writes</Td>
                <Td fontSize="sm" color="gray.500">Fail-open, disclosed in the UI</Td>
              </Tr>
            </Tbody>
          </Table>
        </TableContainer>
      </Section>

      <Section delay={0.35}>
        <Heading as="h3" variant="section-title">
          How we know it&apos;s right
        </Heading>
        <SimpleGrid columns={{ base: 1, sm: 2 }} spacing={4} my={2}>
          <Lens num="→ golden set, computed live">
            30 cases where the expected number comes from reference SQL run against the
            same database, rather than being hand-written, with a sample checked against
            official published figures.
          </Lens>
          <Lens num="→ behavior, not just answers">
            Refusals, clarifications, definition traps, and follow-up chains are graded
            by regex anchors plus an independent judge model (Sonnet 5), since the
            answering model never grades itself.
          </Lens>
          <Lens num="→ contamination control">
            Cases whose SQL appears as a few-shot example in the prompt are bucketed
            separately; the reported score is the uncontaminated held-out bucket.
          </Lens>
          <Lens num="→ a blind bucket">
            7 questions authored by someone who never saw the system or the data
            dictionary scored 6/7, and the one failure exposed three real, documented
            defects rather than being hidden.
          </Lens>
        </SimpleGrid>
        <Note mt={4}>
          <b>Latest authored-set run:</b> 30/30 (100% held-out), every answer under the
          60-second budget, with the full replies archived so the score is inspectable,
          not just claimed.
        </Note>
      </Section>

    </Container>
  </Layout>
)

export default Work
export { getServerSideProps } from '../../components/chakra'
