import { useEffect } from 'react'
import { useRouter } from 'next/router'
import { SimpleGrid } from '@chakra-ui/react'
import Section from '../components/section'
import { WorkGridItem } from '../components/grid-item'
import { Meta } from '../components/work'

import thumbLivestreamArch from '../public/images/works/livestream_01.png'
import thumbGeospatialMetrotech from '../public/images/works/geospatial_metrotech.png'
import thumbPhotoJourney from '../public/images/works/photojourney.png'
import thumbDDoS from '../public/images/works/ddos.png'

const Works = () => {
  const router = useRouter()

  useEffect(() => {
    // Redirect to homepage with works section
    router.replace('/#works')
  }, [router])

  return null
}

// Component for use in other pages
export const WorksSection = () => (
    <SimpleGrid columns={[1, 1, 2]} gap={6}>
      <Section delay={0.1}>
        <WorkGridItem id="ddos" thumbnail={thumbDDoS} title={<strong>DDoS Detection Simulator</strong>}>
          <span><Meta>Software/Cyber Security</Meta>Real-time DDoS detection simulator — configure a botnet and launch TCP/UDP/HTTP flood attacks.</span>
        </WorkGridItem>
      </Section>
      <Section>
        <WorkGridItem id="livestream" title={<strong>Livestream Architecture</strong>} thumbnail={thumbLivestreamArch}>
           <span><Meta>Tensorflow</Meta> Live streaming 3D architectural reconstruction.</span>
        </WorkGridItem>
      </Section>
      <Section>
        <WorkGridItem
          id="geospatial"
          title={<strong>Geospatial Data Visualization</strong>}
          thumbnail={thumbGeospatialMetrotech}
        >
           <span><Meta>GIS</Meta>Geospatial data visualization for Spatial Analytics</span>
        </WorkGridItem>
      </Section>

      <Section delay={0.1}>
        <WorkGridItem
          id="photojourney"
          title={<strong>iPhoto Journey</strong>}
          thumbnail={thumbPhotoJourney}
        >
          <span><Meta>JavaScript + HTML + CSS</Meta>A browser-based scrollytelling app that maps your iPhone photos</span>
          on an interactive journey using EXIF GPS data
        </WorkGridItem>
      </Section>
    </SimpleGrid>
)

export default Works
export { getServerSideProps } from '../components/chakra'
