import * as React from 'react';
import Container from "@mui/material/Container";
import {GetServerSideProps} from "next";
import {getPageProps} from "@storyblok-nextjs/getPageProps";
import {PageProps} from "./[...slugs]";

const HomePage = () => (
        <Container maxWidth="sm">
            Hello Index
        </Container>
    )

export default HomePage

export const getServerSideProps: GetServerSideProps<PageProps> = async ({preview, locale, defaultLocale}) => {
    const storyProps = await getPageProps(['pages'], {
        preview,
        previewToken: process.env.STORYBLOK_PREVIEW_TOKEN,
        locale: locale,
        defaultLocale
    })
    if (!storyProps) {
        return {
            notFound: true
        }
    }
    return {
        props: storyProps
    }
}


