import Head from 'next/head'
import NavBar from '../navbar'
import { Box, Container } from '@chakra-ui/react'
import Footer from '../footer'

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
        {children}

        <Footer />
      </Container>
    </Box>
  )
}

export default Main
