/**
 * Decorator that adds a function for getting the name of the plugin
 * @param component
 * @param pluginName
 */
export const withPluginName = <T extends { methods: { getPluginName: () => string } }, >(component: T, pluginName: string): T => {
    component.methods.getPluginName = () => pluginName
    return component
}