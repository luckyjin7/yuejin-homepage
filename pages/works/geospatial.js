import {
  Container,
  Badge,
  List,
  ListItem,
  UnorderedList,
  Box,
  Text,
  AspectRatio,
  Image
} from '@chakra-ui/react'
import Layout from '../../components/layouts/article'
import { Title, WorkImage, Meta } from '../../components/work'
import P from '../../components/paragraph'

const Work = () => (
  <Layout title="geospatial">
    <Container>
      <Title>
        geospatial data visualization
      </Title>
      <P>
        Geospatial data visualization for Spatial Analytics aims to use Yelp data to examine how people&apos;s affect is spatially distributed across
        the neighborhood - MetroTech Center in New York City.
      </P>
      <P>
        Three main areas where people are most likely to be happy are:
      </P>
      <UnorderedList>
          <ListItem><Badge mr={2}>Jay Street–MetroTech Station area</Badge></ListItem>
          <ListItem><Badge mr={2}>City Point</Badge></ListItem>
          <ListItem><Badge mr={2}>MetroTech Center Plaza</Badge></ListItem>
      </UnorderedList>
      <List ml={2} my={2}>
        <ListItem>
          <Meta>Stack</Meta>
          <span>Python, ArchGIS, QGIS</span>
        </ListItem>
      </List>

      <Box>
        <WorkImage src="/images/works/geospatial_metrotech.png" alt="geospatial" />
        <Text fontSize="sm" color="gray.500" textAlign="center" mt={-2} mb={4}>
          Figure 1: area of MetroTech Center
        </Text>
      </Box>
      <Box>
        <AspectRatio ratio={4/3} mb={4}>
          <Image
            src="/images/works/geospatial_01.jpg"
            alt="geospatial"
            borderRadius="lg"
            objectFit="cover"
            w="100%"
            h="100%"
          />
        </AspectRatio>
        <Text fontSize="sm" color="gray.500" textAlign="center" mt={-2} mb={4}>
          Figure 2: restaurants density in the area of MetroTech Center (spatial joint with hexagon grid)
        </Text>
      </Box>
      <Box>
        <AspectRatio ratio={4/3} mb={4}>
          <Image
            src="/images/works/geospatial_02.jpg"
            alt="geospatial"
            borderRadius="lg"
            objectFit="cover"
            w="100%"
            h="100%"
          />
        </AspectRatio>
        <Text fontSize="sm" color="gray.500" textAlign="center" mt={-2} mb={4}>
          Figure 3: spatial distribution of restaurants with the value of star grades
        </Text>
      </Box>
      <Box>
        <AspectRatio ratio={4/3} mb={4}>
          <Image
            src="/images/works/geospatial_03.jpg"
            alt="geospatial"
            borderRadius="lg"
            objectFit="cover"
            w="100%"
            h="100%"
          />
        </AspectRatio>
        <Text fontSize="sm" color="gray.500" textAlign="center" mt={-2} mb={4}>
          Figure 4: local Moran&apos;s I clustering in the area of MetroTech Center
        </Text>
      </Box>
    </Container>
  </Layout>
)

export default Work
export { getServerSideProps } from '../../components/chakra'
