/**
 * The plugin container's sends it's state to the plugin
 */
export type OnMessage<T> = (message: T) => void
