const defaultDevProxyUrl = 'http://localhost:3000/api/fetch'
const productionProxyUrl = 'https://app-functions.vercel.app/api/fetch'

const proxyUrl = process.env.NODE_ENV === 'development' ? (
    process.env.PROXY_URL ?? defaultDevProxyUrl
) : productionProxyUrl

/**
 * Performs a fetch request via a proxy
 * @param input
 * @param init
 */
export const fetchViaProxy: typeof fetch = (input, init) => (
    fetch(proxyUrl, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            input,
            init,
        }),
    })
)