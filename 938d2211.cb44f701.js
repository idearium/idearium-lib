(window.webpackJsonp=window.webpackJsonp||[]).push([[10],{77:function(e,t,n){"use strict";n.r(t),n.d(t,"frontMatter",(function(){return a})),n.d(t,"metadata",(function(){return l})),n.d(t,"rightToc",(function(){return c})),n.d(t,"default",(function(){return s}));var r=n(3),o=n(7),i=(n(0),n(84)),a={id:"log",title:"@idearium/log"},l={unversionedId:"log",id:"log",isDocsHomePage:!1,title:"@idearium/log",description:"The Idearium JSON logger. Uses Pino under the hood.",source:"@site/docs/log.md",slug:"/log",permalink:"/idearium-lib/docs/log",editUrl:"https://github.com/idearium/idearium-lib/tree/master/docusaurus/docs/log.md",version:"current",sidebar:"sidebar",previous:{title:"@idearium/lists",permalink:"/idearium-lib/docs/lists"},next:{title:"@idearium/log-insightops",permalink:"/idearium-lib/docs/log-insightops"}},c=[{value:"Installation",id:"installation",children:[]},{value:"Usage",id:"usage",children:[{value:"Configuration",id:"configuration",children:[]}]},{value:"Transports",id:"transports",children:[]}],p={rightToc:c};function s(e){var t=e.components,n=Object(o.a)(e,["components"]);return Object(i.b)("wrapper",Object(r.a)({},p,n,{components:t,mdxType:"MDXLayout"}),Object(i.b)("p",null,"The Idearium JSON logger. Uses ",Object(i.b)("a",Object(r.a)({parentName:"p"},{href:"https://getpino.io/"}),"Pino")," under the hood."),Object(i.b)("h2",{id:"installation"},"Installation"),Object(i.b)("pre",null,Object(i.b)("code",Object(r.a)({parentName:"pre"},{className:"language-shell"}),"$ yarn add @idearium/log\n")),Object(i.b)("h2",{id:"usage"},"Usage"),Object(i.b)("pre",null,Object(i.b)("code",Object(r.a)({parentName:"pre"},{className:"language-JavaScript"}),"const log = require('@idearium/log')();\n\nlog.info('A simple example of @idearium/log');\n")),Object(i.b)("p",null,"The above produces the following log output:"),Object(i.b)("pre",null,Object(i.b)("code",Object(r.a)({parentName:"pre"},{}),"{\n    level: 30,\n    severity: 'INFO',\n    time: '2021-05-05T04:17:45.096Z',\n    'logging.googleapis.com/sourceLocation': {\n        file: '/tests/index.test.js'\n    },\n    message: 'A simple example of @idearium/log'\n}\n")),Object(i.b)("h3",{id:"configuration"},"Configuration"),Object(i.b)("p",null,"There are two methods to configure the Idearium logger:"),Object(i.b)("ul",null,Object(i.b)("li",{parentName:"ul"},"Using predefined environment variables for the most common configurations."),Object(i.b)("li",{parentName:"ul"},"Using an options object for complete customisation.")),Object(i.b)("h4",{id:"environment-variables"},"Environment variables"),Object(i.b)("p",null,"The Idearium logger can be configured with environment variables:"),Object(i.b)("ul",null,Object(i.b)("li",{parentName:"ul"},Object(i.b)("inlineCode",{parentName:"li"},"LOG_ENABLED")," - Whether to enable the logger or not. Defaults to ",Object(i.b)("inlineCode",{parentName:"li"},"true"),"."),Object(i.b)("li",{parentName:"ul"},Object(i.b)("inlineCode",{parentName:"li"},"LOG_LEVEL")," - The minimum log level to log. Defaults to ",Object(i.b)("inlineCode",{parentName:"li"},"info"),". Other accepted values are ",Object(i.b)("inlineCode",{parentName:"li"},"trace | debug | info | warn | error | fatal"),"."),Object(i.b)("li",{parentName:"ul"},Object(i.b)("inlineCode",{parentName:"li"},"LOG_PRETTY_PRINT")," - Whether to pretty print the logs or not, useful for development. Defaults to ",Object(i.b)("inlineCode",{parentName:"li"},"false"),"."),Object(i.b)("li",{parentName:"ul"},Object(i.b)("inlineCode",{parentName:"li"},"LOG_REDACT_PATHS")," - Optionally provide a comma separated list of paths to redact. ",Object(i.b)("a",Object(r.a)({parentName:"li"},{href:"https://github.com/pinojs/pino/blob/master/docs/redaction.md#path-syntax"}),"https://github.com/pinojs/pino/blob/master/docs/redaction.md#path-syntax"))),Object(i.b)("h4",{id:"options"},"Options"),Object(i.b)("p",null,"Please be aware that the Idearium Logger has been setup to support ",Object(i.b)("a",Object(r.a)({parentName:"p"},{href:"https://cloud.google.com/logging/docs/structured-logging"}),"GCP structured logging")," and that altering any of the options could reduce the effectiveness of that integration."),Object(i.b)("p",null,Object(i.b)("strong",{parentName:"p"},Object(i.b)("inlineCode",{parentName:"strong"},"sourceLocation"))),Object(i.b)("p",null,"By default the logger will determine the file in which the log took place and put this information in the ",Object(i.b)("inlineCode",{parentName:"p"},"logging.googleapis.com/sourceLocation")," property. You can customise this by providing the ",Object(i.b)("inlineCode",{parentName:"p"},"sourceLocation")," option."),Object(i.b)("p",null,"Further to this, you can pass in any ",Object(i.b)("a",Object(r.a)({parentName:"p"},{href:"https://getpino.io/#/docs/api?id=options"}),"options supported by Pino"),"."),Object(i.b)("h2",{id:"transports"},"Transports"),Object(i.b)("p",null,"The Idearium logger does not support transports out of the box. See ",Object(i.b)("a",Object(r.a)({parentName:"p"},{href:"https://idearium.github.io/idearium-lib/docs/log"}),"@idearium/log-insightops")," for a transport for InsightOps."))}s.isMDXComponent=!0},84:function(e,t,n){"use strict";n.d(t,"a",(function(){return u})),n.d(t,"b",(function(){return m}));var r=n(0),o=n.n(r);function i(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function a(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,r)}return n}function l(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?a(Object(n),!0).forEach((function(t){i(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):a(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function c(e,t){if(null==e)return{};var n,r,o=function(e,t){if(null==e)return{};var n,r,o={},i=Object.keys(e);for(r=0;r<i.length;r++)n=i[r],t.indexOf(n)>=0||(o[n]=e[n]);return o}(e,t);if(Object.getOwnPropertySymbols){var i=Object.getOwnPropertySymbols(e);for(r=0;r<i.length;r++)n=i[r],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(o[n]=e[n])}return o}var p=o.a.createContext({}),s=function(e){var t=o.a.useContext(p),n=t;return e&&(n="function"==typeof e?e(t):l(l({},t),e)),n},u=function(e){var t=s(e.components);return o.a.createElement(p.Provider,{value:t},e.children)},b={inlineCode:"code",wrapper:function(e){var t=e.children;return o.a.createElement(o.a.Fragment,{},t)}},d=o.a.forwardRef((function(e,t){var n=e.components,r=e.mdxType,i=e.originalType,a=e.parentName,p=c(e,["components","mdxType","originalType","parentName"]),u=s(n),d=r,m=u["".concat(a,".").concat(d)]||u[d]||b[d]||i;return n?o.a.createElement(m,l(l({ref:t},p),{},{components:n})):o.a.createElement(m,l({ref:t},p))}));function m(e,t){var n=arguments,r=t&&t.mdxType;if("string"==typeof e||r){var i=n.length,a=new Array(i);a[0]=d;var l={};for(var c in t)hasOwnProperty.call(t,c)&&(l[c]=t[c]);l.originalType=e,l.mdxType="string"==typeof e?e:r,a[1]=l;for(var p=2;p<i;p++)a[p]=n[p];return o.a.createElement.apply(null,a)}return o.a.createElement.apply(null,n)}d.displayName="MDXCreateElement"}}]);