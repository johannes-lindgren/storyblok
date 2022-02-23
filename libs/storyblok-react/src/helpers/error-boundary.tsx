import {Component, ErrorInfo} from "react";
import {Alert} from "@src/helpers/alert";

type Props = {
    message?: string
}

type State = {
    error: Error | undefined,
    errorInfo: ErrorInfo | undefined,
}

const defaultMessage = `We're Sorry, this component cannot be displayed.`

class ErrorBoundary extends Component<Props, State> {

    constructor(props: Props) {
        super(props);
        this.state = {
            error: undefined,
            errorInfo: undefined
        }
    }

    componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        this.setState({
            error: error,
            errorInfo: errorInfo
        })
        console.log(error, errorInfo);
    }

    render() {
        if (this.state.error) {
            // You can render any custom fallback UI
            return (
                <Alert level="error">
                    <h2>{this.props.message ?? defaultMessage}</h2>
                    <details style={{whiteSpace: 'pre-wrap'}}>
                        {this.state.error?.toString()}
                        <br/>
                        {this.state.errorInfo?.componentStack}
                    </details>
                </Alert>
            )
        }

        return this.props.children;
    }
}

export default ErrorBoundary