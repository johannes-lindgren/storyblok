import * as React from 'react';
import {GetServerSideProps, NextPage} from "next";
import {useEffect, useState} from "react";
import {Story} from "@johannes-lindgren/storyblok-js";
import {Alert, Chip, Container, IconButton, Link, Tooltip, Typography} from "@mui/material";
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import {Edit, Power, PowerOff, TimerOutlined} from "@mui/icons-material";
import {useContentManagementClient, useUserInfo} from "@johannes-lindgren/storyblok-app-next/dist/react";

type PageProps = {
    // storyblokToken: string
}

const IndexPage: NextPage<PageProps> = ({}) => {

    const {user, roles, space} = useUserInfo()
    const client = useContentManagementClient()

    const [hasErrored, setErrored] = useState(false)
    const [seconds, setSeconds] = useState(0);
    const [isConnected, setConnected] = useState(true)
    const [stories, setStories] = useState<Story[]>([])

    const delay = 20
    useEffect(() => {
        const interval = setInterval(() => {
            setSeconds(seconds => seconds + delay);
            client.getStories()
                .then(s => {
                    setConnected(true)
                    setStories(s)
                    console.log(s)
                })
                .catch(e => {
                    console.error(e)
                    setErrored(true)
                    setConnected(false)
                })
        }, delay * 1000);
        return () => clearInterval(interval);
    }, [seconds]);

    return (
        <Container maxWidth='sm' sx={{bgcolor: 'secondary'}}>
            <p>Signed in as <em>{user.name}</em> on the <Link href={`https://app.storyblok.com/#!/me/spaces/${space.id}/dashboard`}>{space.name} space</Link></p>
            <p>Your roles are: </p>
            {roles.map(role => (<
                    Chip key={role.name} variant="outlined" label={role.name}/>
            ))}

            <p><TimerOutlined fontSize="small" /><em>{seconds} seconds</em> since application was opened.</p>

            {isConnected ? (
                <Chip label="connected" color="success" variant="outlined" icon={<Power/>}/>
            ) : (
                <Chip label="disconnected" color="error" variant="outlined" icon={<PowerOff/>}/>
            )}

            {hasErrored ? (
                <Alert severity='error' sx={{my: 2}}>
                    The connection was broken at least once since startup. See the log for details.
                </Alert>
            ) : (
                <Alert severity='success' sx={{my: 2}}>
                    The connection has not been broken since startup.
                </Alert>
            )}

            <Typography variant="h4" sx={{my: 2}}>
                Stories
            </Typography>
            <TableContainer component={Paper} sx={{my: 2}} elevation={6}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Name</TableCell>
                            <TableCell align="right">Full slug</TableCell>
                            <TableCell align="right">Created at</TableCell>
                            <TableCell align="right">Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {stories.map((story) => (
                            <TableRow
                                key={story.uuid}
                                sx={{'&:last-child td, &:last-child th': {border: 0}}}
                            >
                                <TableCell component="th" scope="row">
                                    {story.name}
                                </TableCell>
                                <TableCell align="right">/{story.full_slug}</TableCell>
                                <TableCell align="right">
                                    {new Date(story.created_at).toLocaleDateString(undefined, {
                                        weekday: 'long',
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric'
                                    })}
                                </TableCell>
                                <TableCell align="right">
                                    <Tooltip title="Edit">
                                        <IconButton aria-label="edit">
                                            <Edit
                                                href={`https://app.storyblok.com/#!/me/spaces/${space.id}/stories/0/0/${story.id}`}/>

                                        </IconButton>
                                    </Tooltip>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Container>
    )
}

export default IndexPage

export const getServerSideProps: GetServerSideProps<PageProps> = async (_) => {
    return {
        props: {}
    }
}

