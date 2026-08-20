import { useState } from 'react'
import { Box, IconButton } from '@chakra-ui/react'
import { IoVolumeHigh, IoVolumeMute } from 'react-icons/io5'
import { useVideoPlayer } from '../hooks/useVideoPlayer'

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
        src="https://dbgftyntvqk2gwwb.public.blob.vercel-storage.com/cat-flower.mp4"
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

export default HeroVideo
