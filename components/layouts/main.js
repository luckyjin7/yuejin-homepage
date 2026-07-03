import { useState } from 'react'
import Head from 'next/head'
import NavBar from '../navbar'
import { Box, Container, IconButton } from '@chakra-ui/react'
import Footer from '../footer'
import { IoVolumeHigh, IoVolumeMute } from 'react-icons/io5'
import { useVideoPlayer } from '../../hooks/useVideoPlayer'

const HeroVideo = () => {
  const [isHovered,  setIsHovered]  = useState(false)
  const [volHovered, setVolHovered] = useState(false)
  const { videoRef, muted, volume, handleVideoClick, toggleMute, handleVolume } = useVideoPlayer()

  return (
    <Box
      mt={0}
      mb={4}
      w="100%"
      position="relative"
      cursor="pointer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleVideoClick}
    >
      <Box
        as="video"
        ref={videoRef}
        src="/videos/cat-flower.mp4"
        autoPlay
        loop
        muted
        playsInline
        w="100%"
        display="block"
      />

      {isHovered && (
        <Box
          position="absolute"
          bottom="16px"
          right="16px"
          display="flex"
          flexDirection="row-reverse"
          alignItems="center"
          gap={2}
          onMouseEnter={() => setVolHovered(true)}
          onMouseLeave={() => setVolHovered(false)}
          onClick={(e) => e.stopPropagation()}
        >
          <IconButton
            onClick={toggleMute}
            icon={muted ? <IoVolumeMute /> : <IoVolumeHigh />}
            aria-label={muted ? 'Unmute' : 'Mute'}
            isRound
            size="sm"
            bg="blackAlpha.600"
            color="white"
            _hover={{ bg: 'blackAlpha.800' }}
          />
          <input
            type="range"
            min={0}
            max={1}
            step={0.05}
            value={muted ? 0 : volume}
            onChange={handleVolume}
            aria-label="Volume"
            style={{
              display: 'block',
              width: volHovered ? '72px' : '0px',
              opacity: volHovered ? 1 : 0,
              overflow: 'hidden',
              transition: 'width 0.2s ease, opacity 0.2s ease',
              cursor: 'pointer',
              accentColor: '#3182CE',
            }}
          />
        </Box>
      )}
    </Box>
  )
}

const Main = ({ children, router }) => {
  return (
    <Box as="main" pb={8}>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="description" content="Yue's homepage" />
        <meta name="author" content="Yue Jin" />
        <meta name="author" content="luckyjin7" />
        <link rel="apple-touch-icon" href="apple-touch-icon.png" />
        <link rel="shortcut icon" href="/favicon.ico" type="image/x-icon" />
        <meta property="og:site_name" content="Yue Jin" />
        <meta name="og:title" content="Yue Jin" />
        <meta property="og:type" content="website" />
        <title>Yue Jin - Homepage</title>
      </Head>

      <NavBar path={router.asPath} />

      <Container maxW="prose" px={0}>
        <Box px={4}>
          <HeroVideo />
        </Box>

        {children}

        <Footer />
      </Container>
    </Box>
  )
}

export default Main
