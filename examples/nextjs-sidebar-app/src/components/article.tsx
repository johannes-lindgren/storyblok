import Container from "@mui/material/Container";
import {
    Block,
    getImageSrc,
    RichTextData, StoryOptionData
} from "@johannes-lindgren/storyblok-js";
import {makeStoryComponent} from "@johannes-lindgren/storyblok-react";
import * as React from "react";
import {RichText} from "@src/components/dynamic-components";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import {AuthorData} from "@src/components/author";
import {Story} from "@johannes-lindgren/storyblok-js";
import {
    Alert,
    Avatar,
    AvatarGroup,
    Card,
    CardActions,
    CardHeader,
    IconButton,
    ThemeProvider,
    Tooltip
} from "@mui/material";
import {Edit, Facebook, Link, Mail, PlayArrow, PlayCircle, Twitter} from "@mui/icons-material";
import Box from "@mui/material/Box";
import {darkTheme} from "@src/theme";
import {DynamicBlock} from "@src/components/dynamic-components";

export type ArticleData = {
    title: string
    subtitle: string
    body: RichTextData
    authors: StoryOptionData<AuthorData>[]
    header: Block[]
}

export const Article = makeStoryComponent<ArticleData>(({story}) => {
        const article = story.content
        const created = new Date(story.created_at)
        const lastUpdate = new Date(story.published_at ?? story.created_at)
        const authors = (article.authors?.filter(author => typeof author !== 'string') ?? []) as Story<AuthorData>[]
        const title = article.title ? article.title : story.name
        return (
            <Paper elevation={0} sx={{borderRadius: 0}}>
                <ThemeProvider theme={darkTheme}>
                    <Paper elevation={0} sx={{borderRadius: 0, pt: 8, pb: 24}}>
                        <Container maxWidth='md'>
                            {/* TODO navigate to category... Breadcrumbs? */}
                            {/*<Hero title={title} />*/}
                            <Typography variant='h2'>{title}</Typography>
                            <Typography variant='subtitle1'>{article.subtitle}</Typography>
                        </Container>
                    </Paper>
                </ThemeProvider>
                <Container maxWidth='md' sx={{position: 'relative', marginTop: -20}}>
                    {article.header?.map((h) => <DynamicBlock block={h} key={h._uid}/>)}
                    <Paper elevation={0} sx={{py: 4, px: {xs: 0, sm: 4}}}>
                        <Header authors={authors} published={created}/>
                        {/*<Typography variant='caption'>Published on {created.toLocaleString()}</Typography>*/}
                        <RichText richText={article.body}/>
                        <Typography variant='caption'>Last updated
                            on {lastUpdate.toLocaleString()}
                        </Typography>
                    </Paper>
                </Container>
            </Paper>
        )
    },
    'article'
)

// const Hero = ({title}: {title: string}) => (
//     <ThemeProvider theme={}></ThemeProvider>
// )

const Header = ({authors, published}: { authors: Story<AuthorData>[], published: Date }) => {
    const publishedOn = published.toLocaleDateString(undefined, {day: 'numeric', month: 'long', year: 'numeric'})
    return (
        <Card elevation={0}>
            <CardActions disableSpacing>
                <Share/>
            </CardActions>
            <CardHeader
                avatar={
                    <Avatars authors={authors}/>
                }
                action={
                    <IconButton aria-label="settings">
                        {/* TODO link to callback editor */}
                        <Tooltip title='Edit this article'>
                            <Edit/>
                        </Tooltip>
                    </IconButton>
                }
                title={joinNames(authors.map(it => it.name))}
                subheader={publishedOn}
            />
        </Card>
        // <Box my={2} display='flex' >
        //     <Avatars authors={authors}/>
        //     <Names authors={authors}/>
        // </Box>
    )
}

const Share = () => (
    <Box my={2}>
        <IconButton aria-label="Share on Facebook" color='primary'>
            <Tooltip title='Share on Facebook'>
                <Facebook/>
            </Tooltip>
        </IconButton>
        <IconButton aria-label="Share on Twitter" color='primary'>
            <Tooltip title='Share on Twitter'>
                <Twitter/>
            </Tooltip>
        </IconButton>
        <IconButton aria-label="share via mail" color='primary'>
            {/* TODO */}
            <Tooltip title='Share via mail'>
                <Mail/>
            </Tooltip>
        </IconButton>
        <IconButton aria-label="copy link" color='primary'>
            {/* TODO */}
            <Tooltip title='Copy link to clipboard'>
                <Link/>
            </Tooltip>
        </IconButton>
    </Box>
)

const Avatars = ({authors}: { authors: StoryOptionData<AuthorData>[] }) => {
    const authorStories = authors.filter(it => typeof it !== 'string') as Story<AuthorData>[]
    return (
        <AvatarGroup max={5} sx={{justifyContent: 'flex-end'}}>
            {authorStories.map(author => (
                <AuthorAvatar story={author} key={author.uuid}/>
            ))}
        </AvatarGroup>
    )
}

export const AuthorAvatar = makeStoryComponent<AuthorData>(({story}) => (
    <Tooltip title={<>
        <Typography variant='body2'>{story.name}</Typography>
        <Typography variant='caption'>{story.content.summary}</Typography>
    </>}>
        <Avatar
            sx={{bgcolor: name2Color(story.name)}}
            aria-label="author-photo"
            alt={story.content.photo?.alt ?? undefined}
            title={story.content.photo?.title}
            src={story.content.photo && getImageSrc(story.content.photo, {width: 100, height: 100, focal: 'smart'})}
        >
            {getInitials(story.name)}
        </Avatar>
    </Tooltip>
))

const getInitials = (name: string): string => (
    name.split(' ').map(s => s[0].toUpperCase()).join('')
)

const joinNames = (names: string[]): string => {
    if (names.length === 1) {
        return names[0]
    }
    const firsts = names.slice(0, names.length - 1);
    const last = names[names.length - 1];
    return firsts.join(', ') + ' and ' + last;
}

const colors = ["rgba(222, 222, 236, 1)", "rgba(176, 195, 224, 1)", "rgba(132, 174, 236, 1)", "rgba(56, 195, 218, 1)", "rgba(52, 150, 206, 1)", "rgba(37, 96, 184, 1)", "rgba(78, 87, 142, 1)", "rgba(52, 127, 166, 1)", "rgba(25, 105, 183, 1)", "rgba(47, 65, 107, 1)", "rgba(202, 163, 183, 1)", "rgba(135, 201, 166, 1)", "rgba(150, 150, 150, 1)", "rgba(94, 157, 111, 1)", "rgba(24, 220, 67, 1)", "rgba(119, 119, 119, 1)", "rgba(36, 191, 71, 1)", "rgba(79, 79, 79, 1)", "rgba(54, 81, 69, 1)", "rgba(65, 63, 60, 1)", "rgba(255, 254, 254, 1)", "rgba(237, 191, 166, 1)", "rgba(165, 165, 165, 1)", "rgba(255, 69, 73, 1)", "rgba(188, 179, 138, 1)", "rgba(185, 196, 106, 1)", "rgba(160, 139, 104, 1)", "rgba(91, 67, 35, 1)", "rgba(97, 33, 27, 1)", "rgba(0, 0, 0, 1)", "rgba(255, 255, 255, 1)", "rgba(180, 180, 180, 1)", "rgba(165, 185, 167, 1)", "rgba(170, 170, 170, 1)", "rgba(125, 186, 179, 1)", "rgba(115, 166, 174, 1)", "rgba(97, 102, 98, 1)", "rgba(43, 81, 99, 1)", "rgba(50, 89, 73, 1)", "rgba(33, 45, 40, 1)", "rgba(210, 211, 213, 1)", "rgba(184, 184, 184, 1)", "rgba(126, 133, 161, 1)", "rgba(117, 113, 170, 1)", "rgba(117, 119, 158, 1)", "rgba(92, 96, 171, 1)", "rgba(104, 77, 152, 1)", "rgba(49, 49, 50, 1)", "rgba(48, 42, 52, 1)", "rgba(3, 11, 32, 1)", "rgba(222, 205, 222, 1)", "rgba(220, 159, 170, 1)", "rgba(174, 152, 194, 1)", "rgba(198, 124, 161, 1)", "rgba(163, 95, 130, 1)", "rgba(189, 51, 127, 1)", "rgba(194, 42, 62, 1)", "rgba(103, 103, 103, 1)", "rgba(98, 62, 77, 1)", "rgba(21, 9, 22, 1)"] as const

const name2Color = (name: string): string => {
    const index = Math.abs(quickHash(name) % colors.length)
    return colors[index]
}

const quickHash = (s: string): number => {
    let h = 0
    for (let i = 0; i < s.length; i++) {
        h = Math.imul(31, h) + s.charCodeAt(i) | 0;
    }
    return h
}