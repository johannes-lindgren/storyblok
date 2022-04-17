import * as React from 'react';
import {GetServerSideProps, NextPage} from "next";
import {useEffect, useState} from "react";
import {Story} from "@johannes-lindgren/storyblok-js";
import {useClient, useRoles, useSpace, useUser} from "@johannes-lindgren/storyblok-app-next/dist/react";

type PageProps = {
    // storyblokToken: string
}

const IndexPage: NextPage<PageProps> = ({}) => {

    const user = useUser()
    const roles = useRoles()
    const space = useSpace()
    const client = useClient()

    const [seconds, setSeconds] = useState(0);
    const [isError, setError] = useState(false)
    const [stories, setStories] = useState<Story[]>([])

    const delay = 20
    useEffect(() => {
        const interval = setInterval(() => {
            setSeconds(seconds => seconds + delay);
            client.getStories()
                .then(s => {
                    setError(false)
                    setStories(s)
                    console.log(s)
                })
                .catch(e => {
                    console.error(e)
                    setError(true)
                })
        }, delay * 1000);
        return () => clearInterval(interval);
    }, [seconds]);

    return (
        <div>
            <p>Signed in as <em>{user.name}</em> on the <em>{space.name}</em> space</p>
            <p>Your roles are: </p>
            <ul>
                {roles.map(role => (<li key={role.name}>{role.name}</li>))}
            </ul>
            <p>Time since login: <em>{seconds} seconds</em></p>
            <p>The access token is: <em>{isError ? 'expired!' : 'valid'}</em></p>
            <h2>Stories:</h2>
            <ul>
                {stories.map(s => (
                    <li key={s.uuid}>
                        {s.name} (/{s.full_slug}) | {s.created_at}
                    </li>
                ))}
            </ul>
        </div>
    )
}

export default IndexPage

export const getServerSideProps: GetServerSideProps<PageProps> = async (_) => {
    return {
        props: {}
    }
}

