import  {FunctionComponent} from "react";

const warningBackground = `rgb(255, 204, 18, 0.12)`
const warningColor = `rgb(102, 60, 0)`
const errorBackground = `rgba(255, 69, 105, 0.12)`
const errorColor = `rgb(102, 27, 42)`

export const Alert: FunctionComponent<{ level: 'warning' | 'error'}> = ({children, level}): JSX.Element => (
    <div
        style={{
            // rgba(255, 204, 18, 0.12)
            backgroundColor: level === 'error' ? errorBackground : warningBackground,
            color: level === 'error' ? errorColor : warningColor,
            borderRadius: `4px`,
            paddingLeft: `16px`,
            paddingRight: `16px`,
            paddingTop: `8px`,
            paddingBottom: `8px`,
        }}
        role='alert'
    >
        {children}
    </div>
)