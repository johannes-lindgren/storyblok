import {MyButton} from '@johannes-lindgren/storyblok-vue'

export default defineComponent({
    render () {
        return <>
            <h1>Index page</h1>
            <div>
                This is from Nuxt!
                <MyButton a={1} />
            </div>
        </>
    }
})