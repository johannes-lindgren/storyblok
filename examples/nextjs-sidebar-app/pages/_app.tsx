import * as React from 'react';
import Head from 'next/head';
import {AppProps} from 'next/app';
import {ThemeProvider} from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import {CacheProvider, EmotionCache} from '@emotion/react';
import storyblokLightTheme from '@src/theme/storyblok-light-theme';
import createEmotionCache from '@src/create-emotion-cache';
import {CircularProgress} from "@mui/material";
import {CustomAppProvider} from "@johannes-lindgren/storyblok-app-next/react";
import {ContentManagementClientProvider} from "@src/client/content-management-client-provider";
import {StoryblokJsClientProvider} from "@src/client/storyblok-js-client-provider";

// Client-side cache, shared for the whole session of the user in the browser.
const clientSideEmotionCache = createEmotionCache();

interface MyAppProps extends AppProps {
    emotionCache?: EmotionCache;
}

export default function MyApp(props: MyAppProps) {
    const {Component, emotionCache = clientSideEmotionCache, pageProps} = props;

    return (
        <CacheProvider value={emotionCache}>
            <Head>
                <title>Storyblok Custom App</title>
                <meta name="viewport" content="initial-scale=1, width=device-width"/>
            </Head>
            <ThemeProvider theme={storyblokLightTheme}>
                {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
                <CssBaseline/>
                <CustomAppProvider fallback={<CircularProgress/>}>
                    <ContentManagementClientProvider>
                        <StoryblokJsClientProvider>
                            <Component {...pageProps} />
                        </StoryblokJsClientProvider>
                    </ContentManagementClientProvider>
                </CustomAppProvider>
            </ThemeProvider>
        </CacheProvider>
    );
}

