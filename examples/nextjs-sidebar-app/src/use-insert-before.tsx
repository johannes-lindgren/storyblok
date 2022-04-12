import {ComponentType, useEffect} from "react";
import {render} from "react-dom";

export const useInsertBefore = (querySelector: string, containerClassName: string, Component: ComponentType) => {
    useEffect(() => {
        const findContainer = (element: Element) => element.querySelector(`.${containerClassName}`)
        const elements = document.querySelectorAll(querySelector)
        elements.forEach(element => {
            let container = findContainer(element) ?? undefined
            if(container === undefined){
                container = document.createElement("DIV")
                container.className = containerClassName
                element.insertBefore(container, element.firstChild)
            }
            render(
                <div style={{position: 'relative'}}>
                    <Component/>
                </div>,
                container
            )
        })
    })
}