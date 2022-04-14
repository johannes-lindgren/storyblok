import * as React from 'react';
import {GetServerSideProps, NextPage} from "next";
import {useClient, useRoles, useSpace, useUser} from "@src/storyblok-next-sidebar-app/custom-app-provider";
import {useEffect, useState} from "react";
// import {Space, Story} from "@johannes-lindgren/storyblok-js";

type PageProps = {
    // storyblokToken: string
}

const IndexPage: NextPage<PageProps> = ({}) => {

    const user = useUser()
    const roles = useRoles()
    const space = useSpace()
    const client = useClient()

    // const [stories, setStories] = useState<Story[] | undefined>(undefined)

    const [seconds, setSeconds] = useState(0);
    const [isError, setError] = useState(false)

    const delay = 20
    useEffect(() => {
        const interval = setInterval(() => {
            setSeconds(seconds => seconds + delay);
            client.getStories()
                .then(s => {
                    setError(false)
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
        </div>
    )
}

export default IndexPage

export const getServerSideProps: GetServerSideProps<PageProps> = async (context) => {
    return {
        props: {}
    }
}

