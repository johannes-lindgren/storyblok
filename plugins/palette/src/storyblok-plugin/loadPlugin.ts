import Vue, {Component} from "vue";
import {withPluginName} from "@/storyblok-plugin/withPluginName";

declare global {
    interface Window {
        Fieldtype: Component
        Storyblok: { vue: typeof Vue }
        storyblok: { field_types: Record<string, Component> }
        StoryblokPluginRegistered: boolean
    }
}

export const loadPlugin = (PluginArg: any, pluginName: string) => {
    const Plugin = withPluginName(PluginArg, pluginName)

    if (process.env.NODE_ENV === 'development') {
        window.Fieldtype = Plugin
        const customComp = window.Storyblok.vue.extend(Plugin);
        window.Storyblok.vue.component('custom-plugin', customComp);
        window.StoryblokPluginRegistered = true;
    } else {
        window.storyblok.field_types[Plugin.methods.getPluginName()] = Plugin
    }
}