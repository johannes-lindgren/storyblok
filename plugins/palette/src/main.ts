import {loadPlugin} from "@/storyblok-plugin/loadPlugin";
import EcommercePlugin from "@/components/Plugin.vue";
import {config} from "@/config";

loadPlugin(EcommercePlugin, config.pluginName)