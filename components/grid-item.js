import NextLink from 'next/link'
import Image from 'next/image'
import { Badge, Box, Text, LinkBox, LinkOverlay, useColorModeValue } from '@chakra-ui/react'
import { Global } from '@emotion/react'

export const GridItem = ({ children, href, title, thumbnail }) => (
  <Box w="100%" textAlign="center">
    <LinkBox cursor="pointer">
      <Image
        src={thumbnail}
        alt={title}
        className="grid-item-thumbnail"
        placeholder="blur"
        loading="lazy"
      />
      <LinkOverlay href={href} target="_blank">
        <Text mt={2}>{title}</Text>
      </LinkOverlay>
      <Text fontSize={14}>{children}</Text>
    </LinkBox>
  </Box>
)

export const WorkGridItem = ({
  children,
  category = 'works',
  id,
  title,
  thumbnail
}) => (
  <Box w="100%" textAlign="center">
    <LinkBox
      as={NextLink}
      href={`/${category}/${id}`}
      scroll={false}
      cursor="pointer"
    >
      <Box
        w="100%"
        borderRadius="12px"
        overflow="hidden"
        position="relative"
        aspectRatio="16/9"
      >
        <Image
          src={thumbnail}
          alt={title}
          className="grid-item-thumbnail"
          placeholder="blur"
          fill
          style={{ objectFit: 'cover' }}
        />
      </Box>
      <LinkOverlay as="div" href={`/${category}/${id}`}>
        <Text mt={2} fontSize={20}>
          {title}
        </Text>
      </LinkOverlay>
      <Text fontSize={14}>{children}</Text>
    </LinkBox>
  </Box>
)

// A wider, highlighted variant of WorkGridItem meant to span the full row
// of the Works grid (pass gridColumn: '1 / -1' on the wrapping <Section>
// and place it first) — for a project worth calling out above the rest.
// Pass a `thumbnail` for a real cover image; without one it falls back to
// a gradient/emoji card.
export const FeaturedWorkGridItem = ({
  children,
  category = 'works',
  id,
  title,
  thumbnail,
  badge = 'Featured',
  icon = '✨'
}) => {
  const borderColor = useColorModeValue('blue.200', 'pink.300')
  const gradient = useColorModeValue(
    'linear(to-br, blue.50, purple.50, pink.50)',
    'linear(to-br, whiteAlpha.100, blackAlpha.400)'
  )
  return (
    <Box w="100%" textAlign="center">
      <LinkBox
        as={NextLink}
        href={`/${category}/${id}`}
        scroll={false}
        cursor="pointer"
      >
        <Box
          w="100%"
          borderRadius="12px"
          overflow="hidden"
          position="relative"
          aspectRatio={{ base: '16/9', md: '32/9' }}
          bgGradient={thumbnail ? undefined : gradient}
          borderWidth="1px"
          borderColor={borderColor}
        >
          {thumbnail ? (
            <Image
              src={thumbnail}
              alt={title}
              className="grid-item-thumbnail"
              placeholder="blur"
              fill
              style={{ objectFit: 'cover' }}
            />
          ) : (
            <Box
              position="absolute"
              inset={0}
              display="flex"
              alignItems="center"
              justifyContent="center"
              fontSize={{ base: '56px', md: '96px' }}
              opacity={0.18}
              aria-hidden="true"
            >
              {icon}
            </Box>
          )}
        </Box>
        <LinkOverlay as="div" href={`/${category}/${id}`}>
          <Text mt={2} fontSize={20}>
            <Badge bg={useColorModeValue('blue.50', 'rgba(255,99,195,0.15)')} color={useColorModeValue('#3d7aed', '#ff63c3')} verticalAlign="middle" mr={2}>
              {badge}
            </Badge>
            {title}
          </Text>
        </LinkOverlay>
        <Text fontSize={14}>{children}</Text>
      </LinkBox>
    </Box>
  )
}

export const GridItemStyle = () => (
  <Global
    styles={`
      .grid-item-thumbnail {
        border-radius: 12px;
      }
    `}
  />
)
