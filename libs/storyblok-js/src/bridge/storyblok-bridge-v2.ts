declare global {
    interface Window {
        StoryblokBridge?: unknown
    }
}
type StoryblokBridgeEventType = 'customEvent' | 'published' | 'input' | 'change' | 'unpublished' | 'enterEditmode'
type StoryblokBridgeEventCallback = (event: StoryblokEventPayload) => void
type StoryblokBridgeOptions = {
    resolveRelations?: string[]
}

type StoryblokBridgeV2 = {
    new(options?: StoryblokBridgeOptions): StoryblokBridgeV2
    on: (type: StoryblokBridgeEventType | StoryblokBridgeEventType[], callback: StoryblokBridgeEventCallback) => void
}


// appends the bridge script tag to our document
// see https://www.storyblok.com/docs/guide/essentials/visual-editor#installing-the-storyblok-js-bridge
// TODO figure out a way to load the script without polluting the global namespace
const loadBridge = async (): Promise<StoryblokBridgeV2> => {
    if(typeof document === 'undefined' || typeof window === 'undefined'){
        return Promise.reject(new Error('This function should only be called in the browser'))
    }
    const storyblokBridgeId = 'storyblokBridge'
    // Check if the script is already present
    // const existingScript = document.getElementById(storyblokBridgeId)
    // TODO handle scenario where this method is invoked a second time before the script has been loaded.
    //  In such scenario, the script would be loaded twice
    // TODO verify that the below works
    const existingScript = document.getElementById(storyblokBridgeId)
    if(existingScript && !isBridgeInitialized()){
        console.warn(`script#${storyblokBridgeId} already exists but it hasn't been loaded.` )
        return new Promise((resolve) => {
            existingScript.addEventListener('load', () => {
                return resolve(getBridgeClassFromWindow())
            })
        })
    }
    if (isBridgeInitialized()) {
        return Promise.resolve(getBridgeClassFromWindow())
    }
    const script = document.createElement("script")
    script.async = true
    script.src = "//app.storyblok.com/f/storyblok-v2-latest.js"
    script.id = storyblokBridgeId
    document.body.appendChild(script)
    // Promisify callback
    return new Promise((resolve) => {
        script.addEventListener('load', () => {
            return resolve(getBridgeClassFromWindow())
        })
    })
}

const isBridgeInitialized = (): boolean => (
    'StoryblokBridge' in window
)

const getBridgeClassFromWindow = (): StoryblokBridgeV2 => {
    if (typeof window.StoryblokBridge === 'undefined') {
        throw new Error("Failed to load StoryblokBridge")
    }
    return window.StoryblokBridge as StoryblokBridgeV2
}

export {StoryblokBridgeV2, StoryblokBridgeEventType, StoryblokBridgeOptions, loadBridge}