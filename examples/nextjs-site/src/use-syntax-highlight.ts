import hljs from 'highlight.js';
import 'highlight.js/styles/github.css';

// Languages
import javascript from 'highlight.js/lib/languages/javascript';
import xml from 'highlight.js/lib/languages/xml';
import json from 'highlight.js/lib/languages/json';
import shell from 'highlight.js/lib/languages/shell';

import {useEffect} from "react";

hljs.registerLanguage('language-' + javascript.name, javascript);
hljs.registerLanguage('language-' + xml.name, xml);
hljs.registerLanguage('language-' + json.name, json);
hljs.registerLanguage('language-' + shell.name, shell);

export const useSyntaxHighlight = (dependencies: unknown[]) => {
    useEffect(()=> {
        hljs.highlightAll()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, dependencies)
}