/*
 * Copyright (c) 2022, Salesforce, Inc.
 * All rights reserved.
 * SPDX-License-Identifier: BSD-3-Clause
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import React, {useEffect} from 'react'
import {useIntl, FormattedMessage} from 'react-intl'
import {useLocation, useSearchParams} from 'react-router-dom'

// Components
import {
    Box,
    Button,
    SimpleGrid,
    HStack,
    VStack,
    Text,
    Flex,
    Stack,
    Container,
    Link
} from '@salesforce/retail-react-app/app/components/shared/ui'

// Project Components
import Hero from '@salesforce/retail-react-app/app/components/hero'
import Seo from '@salesforce/retail-react-app/app/components/seo'
import Section from '@salesforce/retail-react-app/app/components/section'
import ProductScroller from '@salesforce/retail-react-app/app/components/product-scroller'
import Island from '@salesforce/retail-react-app/app/components/island'


// Others
import {HTTPError, HTTPNotFound} from '@salesforce/pwa-kit-react-sdk/ssr/universal/errors'
import {getAssetUrl} from '@salesforce/pwa-kit-react-sdk/ssr/universal/utils'
import {heroFeatures, features} from '@salesforce/retail-react-app/app/pages/home/data'

//Hooks
import useEinstein from '@salesforce/retail-react-app/app/hooks/use-einstein'
import useDataCloud from '@salesforce/retail-react-app/app/hooks/use-datacloud'

// Commerce SDK
import {usePage} from '@salesforce/commerce-sdk-react'
import {Page} from '@salesforce/commerce-sdk-react/components'

// Constants
import {
    HOME_SHOP_PRODUCTS_CATEGORY_ID,
    HOME_SHOP_PRODUCTS_LIMIT,
    MAX_CACHE_AGE,
    STALE_WHILE_REVALIDATE
} from '@salesforce/retail-react-app/app/constants'
import {useServerContext} from '@salesforce/pwa-kit-react-sdk/ssr/universal/hooks'
import homeJson from './home2.json'
import {renderPage} from '../../utils/page-utils'


/**
 * This is the home page for Retail React App.
 * The page is created for demonstration purposes.
 * The page renders SEO metadata and a few promotion
 * categories and products, data is from local file.
 */
const Home = () => {
    const intl = useIntl()
    const einstein = useEinstein()
    const dataCloud = useDataCloud()
    const {pathname} = useLocation() // This is the pathname of the page '/'
    
    console.log('Shopex Home Page Rendered')
    const {data: page, error} = usePage({parameters: {pageId: 'homepage-example'}})

    if (error) {
        console.log('Shopex API Error', error)
    }

    if (page) {
        console.log('Shopex API Data: ', page)
    }

    const {res} = useServerContext()
    if (res) {
        res.set(
            'Cache-Control',
            `s-maxage=${MAX_CACHE_AGE}, stale-while-revalidate=${STALE_WHILE_REVALIDATE}`
        )
    }

    /**************** Einstein ****************/
    useEffect(() => {
        einstein.sendViewPage(pathname)
        dataCloud.sendViewPage(pathname)
    }, [])

    return (
        <Box data-testid="home-page" layerStyle="page">
            <div>Home Page</div>
            {/* {renderPage(homeJson)} */}

            <Page page={page} components={page.components || {}}/>

            {/* <Island hydrateOn={'visible'}>
                <Section
                    padding={4}
                    paddingTop={32}
                    title={intl.formatMessage({
                        defaultMessage: 'Features',
                        id: 'home.heading.features'
                    })}
                    subtitle={intl.formatMessage({
                        defaultMessage:
                            'Out-of-the-box features so that you focus only on adding enhancements.',
                        id: 'home.description.features'
                    })}
                >
                    <Container maxW={'6xl'} marginTop={10}>
                        <SimpleGrid columns={{base: 1, md: 2, lg: 3}} spacing={10}>
                            {features.map((feature, index) => {
                                const featureMessage = feature.message
                                return (
                                    <HStack key={index} align={'top'}>
                                        <VStack align={'start'}>
                                            <Flex
                                                width={16}
                                                height={16}
                                                align={'center'}
                                                justify={'left'}
                                                color={'gray.900'}
                                                paddingX={2}
                                            >
                                                {feature.icon}
                                            </Flex>
                                            <Text
                                                as="h3"
                                                color={'black'}
                                                fontWeight={700}
                                                fontSize={20}
                                            >
                                                {intl.formatMessage(featureMessage.title)}
                                            </Text>
                                            <Text color={'black'}>
                                                {intl.formatMessage(featureMessage.text)}
                                            </Text>
                                        </VStack>
                                    </HStack>
                                )
                            })}
                        </SimpleGrid>
                    </Container>
                </Section>
            </Island>

            <Island hydrateOn={'visible'}>
                <Section
                    padding={4}
                    paddingTop={32}
                    title={intl.formatMessage({
                        defaultMessage: "We're here to help",
                        id: 'home.heading.here_to_help'
                    })}
                    subtitle={
                        <>
                            <>
                                {intl.formatMessage({
                                    defaultMessage: 'Contact our support staff.',
                                    id: 'home.description.here_to_help'
                                })}
                            </>
                            <br />
                            <>
                                {intl.formatMessage({
                                    defaultMessage: 'They will get you to the right place.',
                                    id: 'home.description.here_to_help_line_2'
                                })}
                            </>
                        </>
                    }
                    actions={
                        <Button
                            as={Link}
                            href="https://help.salesforce.com/s/?language=en_US"
                            target="_blank"
                            width={'auto'}
                            paddingX={7}
                            _hover={{textDecoration: 'none'}}
                        >
                            <FormattedMessage
                                defaultMessage="Contact Us"
                                id="home.link.contact_us"
                            />
                        </Button>
                    }
                    maxWidth={'xl'}
                />
            </Island> */}
        </Box>
    )
}

Home.getTemplateName = () => 'home'

export default Home
