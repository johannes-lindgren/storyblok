import { API } from '@stoplight/elements'
import '@stoplight/elements/styles.min.css'
import openaApi from '@johannes-lindgren/openapi/openapi.yml'
import './App.css'

console.log(openaApi)

function App() {
  return (
    <API apiDescriptionDocument={openaApi} router="hash" hideSchemas={false} />
  )
}

export default App
