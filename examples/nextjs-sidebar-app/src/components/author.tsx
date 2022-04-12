import {makeBlockComponent, makeStoryComponent} from "@johannes-lindgren/storyblok-react";
import {Avatar, Card, CardHeader} from "@mui/material";
import Container from "@mui/material/Container";
import {getImageSrc, ImageAssetData} from "@johannes-lindgren/storyblok-js";
import {red} from "@mui/material/colors";

export type AuthorData = {
    summary: string
    photo: ImageAssetData
}

export const AuthorPreview = makeStoryComponent<AuthorData>(({story}) => (
    <Container maxWidth={'md'} sx={{my:8}}>
        <AuthorCard name={story.name} block={story.content} />
    </Container>
), 'author')

const AuthorCard = makeBlockComponent<AuthorData, {name: string}>(({block, name}) => (
    <Card sx={{maxWidth: 'xs'}}>
        <CardHeader
            avatar={
                <Avatar
                    sx={{bgcolor: red[500]}}
                    aria-label="author-photo"
                    alt={block.photo?.alt || undefined}
                    title={block.photo?.title}
                    src={block.photo && getImageSrc(block.photo, {width: 100, height: 100, focal: 'smart'})}
                >
                    {name[0].toUpperCase()}
                </Avatar>
            }
            title={name}
            subheader={block.summary}
        />
    </Card>
))
