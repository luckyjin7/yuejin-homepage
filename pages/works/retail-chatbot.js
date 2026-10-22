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

// A compact reusable node box for the architecture-style diagrams below:
// a bordered rect with a bold title line and a smaller detail line.
const makeNodeBox = ({ boxFill, lineColor, titleColor, subColor }) => {
  const NodeBox = ({ x, y, w = 260, h = 80, title, sub, stroke = lineColor, titleSize = 13, subSize = 11 }) => (
    <g>
      <rect x={x} y={y} width={w} height={h} rx="4" fill={boxFill} stroke={stroke} strokeWidth="1.4" />
      <text x={x + w / 2} y={y + h / 2 - 6} textAnchor="middle" fontSize={titleSize} fontWeight="600" fill={titleColor}>{title}</text>
      {sub && <text x={x + w / 2} y={y + h / 2 + 14} textAnchor="middle" fontSize={subSize} fill={subColor}>{sub}</text>}
    </g>
  )
  return NodeBox
}

// Fig. 01 — the fail-closed path a question takes from the chat box to a
// number, mirroring the pipeline documented in the project README.
const ArchitectureFigure = () => {
  const boxFill = useColorModeValue('#ffffff', '#2a2a2e')
  const lineColor = useColorModeValue('#cbd5e0', '#4a5568')
  const titleColor = useColorModeValue('#1a202c', '#f7fafc')
  const subColor = '#718096'
  const bandBg = useColorModeValue('rgba(61,122,237,0.06)', 'rgba(255,99,195,0.06)')
  const accent = useColorModeValue('#3d7aed', '#ff63c3')
  const NodeBox = makeNodeBox({ boxFill, lineColor, titleColor, subColor })

  const arrow = (x1, y1, x2, y2) => (
    <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={lineColor} strokeWidth="1.4" markerEnd="url(#rc-arrow)" />
  )
  const connector = (y1, y2, label) => (
    <g>
      <line x1="500" y1={y1} x2="500" y2={y2} stroke={lineColor} strokeWidth="1.4" markerEnd="url(#rc-arrow)" />
      <text x="516" y={(y1 + y2) / 2 + 4} fontSize="10.5" fill={subColor}>{label}</text>
    </g>
  )

  return (
    <svg
      viewBox="0 0 1000 900"
      width="100%"
      height="100%"
      role="img"
      aria-label="Architecture diagram: a question enters through the Streamlit UI, passes Guardrails L0 (injection filters, rate limits, a daily budget breaker), then Guardrails L1 (a Haiku topic triage that fails open), then the agent loop (Claude Opus 5 falling back to Sonnet 5, with concurrency and time budgets, tool results wrapped in random tags), then the database gateway (lexical validation, an EXPLAIN cost gate, a 200-row cap), and finally a read-only, 15-second-timeout Postgres role, which is the hard wall. Each arrow is labeled with what crosses that boundary."
    >
      <defs>
        <marker id="rc-arrow" markerWidth="9" markerHeight="9" refX="7" refY="3.5" orient="auto">
          <path d="M0,0 L7,3.5 L0,7 Z" fill={lineColor} />
        </marker>
      </defs>

      <NodeBox x={300} y={20} w={400} h={55} title="Streamlit UI" sub="streaming answer · SQL provenance · disclosure" />
      {connector(75, 110, 'every submitted question')}

      <rect x="10" y="110" width="980" height="150" rx="4" fill={bandBg} />
      <text x="30" y="135" fontSize="12" letterSpacing="0.08em" fill={subColor}>{'GUARDRAILS L0 · DEAD RULES'}</text>
      <NodeBox x={40} y={155} title="Injection + raw-SQL filters" sub="pattern signatures, FP≈0" />
      <NodeBox x={370} y={155} title="3-tier rate limits" sub="10/min global · 5/min/session · 40/day" />
      <NodeBox x={700} y={155} title="Daily budget breaker" sub="$ cap, checked pre-call" />
      {arrow(300, 195, 368, 195)}
      {arrow(630, 195, 698, 195)}
      {connector(260, 300, 'passed input filters')}

      <rect x="10" y="300" width="980" height="110" rx="4" fill={bandBg} />
      <text x="30" y="325" fontSize="12" letterSpacing="0.08em" fill={subColor}>{'GUARDRAILS L1 · TOPIC TRIAGE'}</text>
      <NodeBox x={250} y={345} w={500} h={55} title="Claude Haiku triage" sub="a fail-open cost filter, not a security wall" />
      {connector(400, 440, 'triage verdict (fail-open)')}

      <rect x="10" y="440" width="980" height="150" rx="4" fill={bandBg} />
      <text x="30" y="465" fontSize="12" letterSpacing="0.08em" fill={subColor}>{'AGENT LOOP'}</text>
      <NodeBox x={40} y={485} title="Claude Opus 5" sub="→ Sonnet 5 on overload" />
      <NodeBox x={370} y={485} title="Budgets" sub="concurrency ×2 · 8 rounds/30s · 60s hard cap" />
      <NodeBox x={700} y={485} title="Tool results" sub={'wrapped in random <data-…> tags'} />
      {arrow(300, 525, 368, 525)}
      {arrow(630, 525, 698, 525)}
      {connector(590, 630, 'SQL statement string')}

      <rect x="10" y="630" width="980" height="150" rx="4" fill={bandBg} />
      <text x="30" y="655" fontSize="12" letterSpacing="0.08em" fill={subColor}>{'DB GATEWAY · THE ONLY EXIT'}</text>
      <NodeBox x={40} y={675} title="Lexical validate" sub="strip literals/comments → single SELECT/WITH" />
      <NodeBox x={370} y={675} title="EXPLAIN cost gate" sub="rejects expensive plans" />
      <NodeBox x={700} y={675} title="200-row cap" sub="truncate + disclose" />
      {arrow(300, 715, 368, 715)}
      {arrow(630, 715, 698, 715)}
      {connector(780, 820, 'validated, bounded query')}

      <NodeBox x={250} y={820} w={500} h={55} title="Neon Postgres · role app_ro" sub="SELECT-only · 15s timeout (the hard wall)" stroke={accent} />
    </svg>
  )
}

// Fig. 02 — four bets the design makes, and what actually backs each one
// up if the bet is wrong (problem → why it matters → solution → backstop).
const ProblemSolutionFigure = () => {
  const boxFill = useColorModeValue('#ffffff', '#2a2a2e')
  const lineColor = useColorModeValue('#cbd5e0', '#4a5568')
  const titleColor = useColorModeValue('#1a202c', '#f7fafc')
  const subColor = '#718096'
  const accent = useColorModeValue('#3d7aed', '#ff63c3')
  const NodeBox = makeNodeBox({ boxFill, lineColor, titleColor, subColor })

  const colW = 233
  const gap = 16
  const colXs = [10, 10 + colW + gap, 10 + 2 * (colW + gap), 10 + 3 * (colW + gap)]
  const headers = ['PROBLEM', 'WHY IT MATTERS', 'SOLUTION', 'BACKSTOP']

  const rows = [
    {
      cells: [
        { title: '01 · fabricate a number?', sub: 'the easy failure mode for any chatbot' },
        { title: 'Trust breaks on one bad figure', sub: 'a single wrong number undoes every right one' },
        { title: 'Answer only from query results', sub: 'no data → no numbers, by rule' },
        { title: 'Runtime grounding check', sub: 'flags any figure not traceable to a query' }
      ]
    },
    {
      cells: [
        { title: '02 · smuggle write access?', sub: 'the agent writes real SQL' },
        { title: 'Stakes are a real database', sub: 'one bad query is more than a bad answer' },
        { title: 'Lexical allowlist', sub: 'strip comments/literals → single SELECT/WITH only' },
        { title: 'EXPLAIN gate + read-only role', sub: 'app_ro: SELECT-only, 15s timeout' }
      ]
    },
    {
      cells: [
        { title: '03 · cost abuse without login?', sub: 'anyone can open a new session' },
        { title: 'Anonymous sessions are cheap', sub: 'per-session limits alone are evadable' },
        { title: '3-tier rate limits', sub: 'global · per-session · daily, plus a budget breaker' },
        { title: 'Platform spend cap', sub: 'a hard monthly ceiling behind the app-level one' }
      ]
    },
    {
      cells: [
        { title: '04 · right, or just plausible?', sub: 'fluent and wrong looks like fluent and right' },
        { title: 'Confident ≠ correct', sub: 'the model itself can’t grade its own answers' },
        { title: 'Golden set vs. live SQL', sub: 'expected numbers computed fresh, not hand-written' },
        { title: 'Independent judge + blind bucket', sub: 'graded by a different model, on unseen questions' }
      ]
    }
  ]

  const rowY = i => 42 + i * 100

  return (
    <svg
      viewBox="0 0 1000 460"
      width="100%"
      height="100%"
      role="img"
      aria-label="Four problem rows, each read left to right as problem, why it matters, the solution shipped, and the backstop behind it: fabricating a number is caught by answering only from query results plus a runtime grounding check; SQL injection is blocked by a lexical allowlist backed by an EXPLAIN cost gate and a read-only database role; cost abuse without login is bounded by three-tier rate limits backed by a platform-wide spend cap; and answer correctness is graded against a live-computed golden set by an independent judge model, backed by a blind question bucket."
    >
      <defs>
        <marker id="rc-arrow-2" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
          <path d="M0,0 L6,3 L0,6 Z" fill={lineColor} />
        </marker>
      </defs>

      <g fill={subColor} fontSize="11" letterSpacing="0.08em">
        {headers.map((h, i) => (
          <text key={h} x={colXs[i]} y="28">{h}</text>
        ))}
      </g>

      {rows.map((row, ri) => (
        <g key={row.cells[0].title}>
          {row.cells.map((cell, ci) => (
            <NodeBox
              key={cell.title}
              x={colXs[ci]}
              y={rowY(ri)}
              w={colW}
              h={86}
              title={cell.title}
              sub={cell.sub}
              titleSize="12"
              subSize="10"
              stroke={ci === 3 ? accent : lineColor}
            />
          ))}
          <line x1={colXs[0] + colW} y1={rowY(ri) + 43} x2={colXs[1]} y2={rowY(ri) + 43} stroke={lineColor} strokeWidth="1.2" markerEnd="url(#rc-arrow-2)" />
          <line x1={colXs[1] + colW} y1={rowY(ri) + 43} x2={colXs[2]} y2={rowY(ri) + 43} stroke={lineColor} strokeWidth="1.2" markerEnd="url(#rc-arrow-2)" />
          <line x1={colXs[2] + colW} y1={rowY(ri) + 43} x2={colXs[3]} y2={rowY(ri) + 43} stroke={lineColor} strokeWidth="1.2" markerEnd="url(#rc-arrow-2)" />
        </g>
      ))}
    </svg>
  )
}

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
