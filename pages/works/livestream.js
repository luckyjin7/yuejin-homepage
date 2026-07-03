import {
  Container,
  Badge,
  List,
  ListItem
} from '@chakra-ui/react'
import { Title, Meta } from '../../components/work'
import P from '../../components/paragraph'
import Layout from '../../components/layouts/article'

const Work = () => (
  <Layout title="livestream architecture">
    <Container>
      <Title>
        Livestream Architecture <Badge>2020-</Badge>
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
          src="/videos/livestream_architecture.mp4"
          controls
          preload="none"
          poster="/images/works/livestream_01.png"
          aria-label="livestream demo on twitch"
          style={{ width: '100%', height: 'auto', display: 'block' }}
        >
          Your browser does not support the video tag.
        </video>
      </div>
    </Container>
  </Layout>
)

export default Work
export { getServerSideProps } from '../../components/chakra'
