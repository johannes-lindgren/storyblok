import * as React from 'react';
import { GetServerSideProps, NextPage } from "next";
import {useClient, useUser} from "@src/custom-app/custom-app-provider";
import {useEffect, useState} from "react";
import {Space, Story} from "@johannes-lindgren/storyblok-js";

type PageProps = {
    // storyblokToken: string
}

// const useStoryblokApp = (): StoryblokSession | undefined => {
//     useEffect()
// }

// const useSession = () => {
//     const [session, setSession] = useState<StoryblokSession | undefined>(undefined)
//     useEffect(() => {
//         setSession(getStoryblokSessionFromCookie(document.cookie))
//     }, [])
//     return session
// }
//
// const useClient = (): ContentManagementClient | undefined => {
//     const session = useSession()
//     if(!session?.access_token){
//         return undefined
//     }
//     return client
// }

// const useCustomApp = () => {
//     const session = useSession()
//     const client = useRef(new ContentManagementClient(''))
//     if(session) {
//         client.current.setToken(session?.access_token)
//     }
//     const ready = session !== undefined
//
//     return {
//         client: ready ? client : undefined,
//         session,
//     }
// }

const HomePage: NextPage<PageProps> = ({  }) => {
    // const client = useClient()
    // const session = useSession()
    // const app = useCustomApp()

    // const [space, setSpace] = useState<unknown>(null)
    //
    // useEffect(() => {
    //     console.log('useEffect')
    //     // console.log('initiating request')
    //     // client?.getSpace(session?.space.id).then((s) => {
    //     //     console.log({space: s})
    //     //     setSpace(s)
    //     // })
    // }, [])

    const user = useUser()
    const client = useClient()

    const [stories, setStories] = useState<Story[] | undefined>(undefined)
    const [space, setSpace] = useState<Space | undefined>(undefined)
    useEffect(() => {
        (async () => {
            const strs = await client.getStories()
            const sp = await client.getSpace()
            setStories(strs)
            setSpace(sp)
        })()
    }, [])

    console.log({stories})
    console.log({space})

    // if(!session){
        return <div>
            <p>Signed in as {user.name}</p>
            {/*<p>Space: <i>{JSON.stringify(space)}</i></p>*/}
            {/*<p>Session: <i>{JSON.stringify(app.session ?? null)}</i></p>*/}
            {/*<Button onClick={() => signIn('storyblok')} variant="contained">*/}
            {/*    Sign in*/}
            {/*</Button>*/}
        </div>
    // }

    // return (
    //     <Container maxWidth="sm">
    //         Hello {storyblokToken.user?.name}!
    //     </Container>
    // )
}

export default HomePage

export const getServerSideProps: GetServerSideProps<PageProps> = async (context) => {
    console.log('Page /');

    // const sbSession = getStoryblokSession(context)
    // if(!sbSession){
    //     console.log('Not signed in...')
    //     return {
    //         redirect: {
    //             permanent: false,
    //             destination: '/api/auth/signin/storyblok',
    //         }
    //     }
    // }
    // console.log('Signed in!', sbSession)

    return {
        props: {
        }
    }
}

// const getSession

