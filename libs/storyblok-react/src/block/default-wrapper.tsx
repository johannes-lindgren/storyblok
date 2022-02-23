import {useEffect, useState} from "react";
import {useEditable} from "@src/block/use-editable";
import {usePreview} from "@src/story";
import ErrorBoundary from "@src/helpers/error-boundary";
import {BlockWrapperComponent} from "@src/block/block-wrapper";

const transitionMixin = {
    transition: `opacity 211ms cubic-bezier(0.4, 0, 0.2, 1) 0ms, transform 141ms cubic-bezier(0.4, 0, 0.2, 1) 0ms`
}
const initialStyle = {
    ...transitionMixin,
    opacity: 0,
    transform: `scale(0.75, 0.5625)`,
} as const
const mountedStyle = {
    ...transitionMixin,
    opacity: 1,
    transform: 'none',
} as const

// In preview mode, the content will be editable
const DefaultWrapper: BlockWrapperComponent = ({block, children}) => {
    const ref = useEditable<HTMLDivElement>(block)
    const preview = usePreview()

    // Include a "grow" transition when the component is added to the DOM
    const [mounted, setMounted] = useState(false)
    useEffect(() => setMounted(true))

    if (!preview) {
        return (
            <ErrorBoundary>
                {children}
            </ErrorBoundary>
        )
    }

    return (
        <div ref={ref} style={mounted ? mountedStyle : initialStyle}>
            <ErrorBoundary>
                {children}
            </ErrorBoundary>
        </div>
    )
}

export {DefaultWrapper}