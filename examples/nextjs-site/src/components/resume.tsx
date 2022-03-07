import Container from "@mui/material/Container";
import Stack from "@mui/material/Stack";
import {Avatar} from "@mui/material";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import {Email, LocalPhone, LocationOn} from "@mui/icons-material";
import Paper from "@mui/material/Paper";
import {BlockComponent, makeBlockComponent} from "@johannes-lindgren/storyblok-react";
import {DynamicBlock, RichText} from "@src/components/dynamic-components";
import {ImageAssetData, Block, RichTextData} from "@johannes-lindgren/storyblok-js";
import {FunctionComponent} from "react";

type ResumeData = {
    profilePicture: ImageAssetData
    fullName: string
    jobTitle: string
    phoneNumber: string
    emailAddress: string
    location: string
    summary: RichTextData
    employmentHistory: Block    []
}

export const Resume = makeBlockComponent<ResumeData>( ({block}) => (
        <Container maxWidth='md'>
            <Paper elevation={6} sx={{px: 6, py: 6, my: 6}}>
                <Stack spacing={1}>
                    {block.emailAddress}
                    <Header block={block}/>
                    <Section title='About'>
                        <RichText richText={block.summary}/>
                    </Section>
                    <Section title='Employment History'>
                        {block.employmentHistory?.map(c => (
                            <DynamicBlock key={c._uid} block={c}/>
                        ))}
                    </Section>
                </Stack>
            </Paper>
        </Container>
    ), 'resume'
)

const Header: BlockComponent<ResumeData> = ({block}) => (
        <Stack alignItems='center' spacing={1}>
            <Avatar alt={block.fullName} src={block.profilePicture?.filename ?? undefined} sx={{width: 64, height: 64}}/>
            <Typography variant='h3' component='h1'>{block.fullName}</Typography>
            <Typography variant='overline'>{block.jobTitle}</Typography>
            <Grid container columns={{xs: 1, sm: 3}} justifyContent='center'>
                <Grid item>
                    <Email fontSize="inherit" sx={{verticalAlign: "middle", mx: 1}}/>
                    <Typography variant='caption' alignItems='center'>
                        {block.emailAddress}
                    </Typography>
                </Grid>
                <Grid item alignItems='center'>
                    <LocationOn fontSize="inherit" sx={{verticalAlign: "middle", mx: 1}}/>
                    <Typography variant='caption' alignItems='center'>
                        {block.location}
                    </Typography>
                </Grid>
                <Grid item alignItems='center'>
                    <LocalPhone fontSize="inherit" sx={{verticalAlign: "middle", mx: 1}}/>
                    <Typography variant='caption' alignItems='center'>
                        {block.phoneNumber}
                    </Typography>
                </Grid>
            </Grid>
        </Stack>
    )


const Section: FunctionComponent<{ title: string }> = ({title, children}) => (
    <div>
        <Typography variant='h4' component='h2'>{title}</Typography>
        {children}
    </div>
)


