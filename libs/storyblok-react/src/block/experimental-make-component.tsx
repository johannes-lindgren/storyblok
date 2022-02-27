// import {Block} from "@johannes-lindgren/storyblok-js";
// import {BlockComponent, BlockComponentProps} from "@src/block/block-component";
// import {useEditable} from "@src/block/use-editable";
// import {usePreview} from "@src/story";
// import {useEffect, useState} from "react";
// import ErrorBoundary from "@src/helpers/error-boundary";

// const transitionMixin = {
//     transition: `opacity 211ms cubic-bezier(0.4, 0, 0.2, 1) 0ms, transform 141ms cubic-bezier(0.4, 0, 0.2, 1) 0ms`
// }
// const initialStyle = {
//     ...transitionMixin,
//     opacity: 0,
//     transform: `scale(0.75, 0.5625)`,
// } as const
// const mountedStyle = {
//     ...transitionMixin,
//     opacity: 1,
//     transform: 'none',
// } as const

const makeComponent = "hello"

// const makeComponent = <C extends Record<string, any>,>(BlockComponent: BlockComponent<Block<C>>): BlockComponent<Block<C>> => (
//     ({block}: BlockComponentProps<Block<C>>) => {
//         const ref = useEditable<HTMLDivElement>(block)
//         const preview = usePreview()
//
//         // Include a "grow" transition when the component is added to the DOM
//         const [mounted, setMounted] = useState(false)
//         useEffect(() => setMounted(true))
//
//         if (!preview) {
//             return (
//                 <ErrorBoundary>
//                     <BlockComponent block={block} />
//                 </ErrorBoundary>
//             )
//         }
//
//         return (
//             <div ref={ref} style={mounted ? mountedStyle : initialStyle}>
//                 <ErrorBoundary>
//                     <BlockComponent block={block} />
//                 </ErrorBoundary>
//             </div>
//         )
//     })

export {makeComponent}