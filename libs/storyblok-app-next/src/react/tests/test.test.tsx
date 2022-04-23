import { render, screen, waitFor } from "@testing-library/react"
import {CustomAppProvider} from "@src/react/custom-app-provider";


test("The content of a parapgraph", async () => {
    render(<TestApp />)

    await waitFor(() => {
        expect(screen.getByTestId("fallback").textContent).toBe("Loading...")
    })
})

function Fallback(){
    return <div data-testid="fallback">Loading...</div>
}

function TestApp() {
    return (
        <CustomAppProvider fallback={<Fallback />}>
            <p data-testid="paragraph">
                my paragraph
            </p>
        </CustomAppProvider>
    )
}