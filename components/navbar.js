import { useState, useEffect } from 'react'
import Logo from './logo'
import NextLink from 'next/link'
import {
  Container,
  Box,
  Link,
  Flex,
  Heading,
  Text,
  useColorModeValue
} from '@chakra-ui/react'
import ThemeToggleButton from './theme-toggle-button'
import { IoLogoGithub, IoHeart } from 'react-icons/io5'

const VancouverClock = () => {
  const [display, setDisplay] = useState('')
  const pillBg    = useColorModeValue('#f9fafb', 'whiteAlpha.100')
  const pillHover = useColorModeValue('#f3f4f6', 'whiteAlpha.200')
  const pillBorder = useColorModeValue('#e5e7eb', 'whiteAlpha.200')
  const textColor  = useColorModeValue('#4b5563', 'whiteAlpha.600')
  const kbdBorder  = useColorModeValue('#d1d5db', 'whiteAlpha.300')
  const kbdBg     = useColorModeValue('#f0e7db',  'bgAlpha.100')

  useEffect(() => {
    const update = () => {
      const now = new Date()
      const weekday = now.toLocaleDateString('en-US', {
        timeZone: 'America/Vancouver',
        weekday: 'short'
      })
      const time = now.toLocaleTimeString('en-US', {
        timeZone: 'America/Vancouver',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
      })
      setDisplay(`${weekday} ${time}`)
    }
    update()
    const id = setInterval(update, 30000)
    return () => clearInterval(id)
  }, [])

  if (!display) return null

  return (
    <Box
      display="inline-flex"
      alignItems="center"
      gap={2}
      px="0.6rem"
      py="0.25rem"
      borderRadius="full"
      border="1px solid"
      borderColor={pillBorder}
      bg={pillBg}
      color={textColor}
      fontSize="0.85rem"
      userSelect="none"
      cursor="default"
      transition="background 0.15s"
      _hover={{ bg: pillHover }}
    >
      <Text as="span" fontSize="0.85rem" whiteSpace="nowrap">
        Vancouver
      </Text>
      <Box
        as="kbd"
        px="0.35rem"
        py="0.05rem"
        borderRadius="0.25rem"
        border="1px solid"
        borderColor={kbdBorder}
        bg={kbdBg}
        fontFamily="mono"
        fontSize="0.75rem"
        whiteSpace="nowrap"
      >
        {display}
      </Box>
    </Box>
  )
}

const Navbar = () => {
  const bg          = useColorModeValue('#f0e7db', '#202023')
  const borderColor = useColorModeValue('#e5e7eb', 'whiteAlpha.200')
  const linkColor   = useColorModeValue('#4b5563', 'whiteAlpha.600')
  const linkHover   = useColorModeValue('#111827', 'whiteAlpha.900')

  return (
    <Box
      position="sticky"
      top={0}
      as="nav"
      w="100%"
      bg={bg}
      borderBottom="1px solid"
      borderColor={borderColor}
      fontFamily="system-ui, -apple-system, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji'"
      zIndex={50}
    >
      <Container
        display="flex"
        px={6}
        py={3}
        maxW="container.md"
        alignItems="center"
        justifyContent="space-between"
      >
        {/* Left: Logo */}
        <Heading
          as="h1"
          fontWeight={600}
          fontSize="1rem"
          fontFamily="system-ui, -apple-system, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji'"
          letterSpacing="tight"
        >
          <Logo />
        </Heading>

        {/* Middle: Works + GitHub + Theme toggle */}
        <Flex alignItems="center" gap={4}>
          <Link
            as={NextLink}
            href="/#works"
            fontSize="0.95rem"
            color={linkColor}
            _hover={{ color: linkHover, textDecoration: 'none' }}
            scroll={false}
          >
            Works
          </Link>

          <Link
            href="/works/landscape"
            target="_blank"
            display="inline-flex"
            alignItems="center"
            color={linkColor}
            _hover={{ color: '#e05c8a' }}
          >
            <IoHeart size={20} />
          </Link>

          <Link
            href="https://github.com/luckyjin7"
            target="_blank"
            display="inline-flex"
            alignItems="center"
            color={linkColor}
            _hover={{ color: linkHover }}
          >
            <IoLogoGithub size={20} />
          </Link>

          <ThemeToggleButton />
        </Flex>

        {/* Right: Vancouver time pill */}
        <Box display={{ base: 'none', md: 'block' }}>
          <VancouverClock />
        </Box>
      </Container>
    </Box>
  )
}

export default Navbar
