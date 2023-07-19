"use strict";(self.webpackChunkidearium_lib_docs=self.webpackChunkidearium_lib_docs||[]).push([[766],{3905:function(e,t,r){r.d(t,{Zo:function(){return c},kt:function(){return g}});var n=r(7294);function o(e,t,r){return t in e?Object.defineProperty(e,t,{value:r,enumerable:!0,configurable:!0,writable:!0}):e[t]=r,e}function i(e,t){var r=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);t&&(n=n.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),r.push.apply(r,n)}return r}function a(e){for(var t=1;t<arguments.length;t++){var r=null!=arguments[t]?arguments[t]:{};t%2?i(Object(r),!0).forEach((function(t){o(e,t,r[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(r)):i(Object(r)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(r,t))}))}return e}function u(e,t){if(null==e)return{};var r,n,o=function(e,t){if(null==e)return{};var r,n,o={},i=Object.keys(e);for(n=0;n<i.length;n++)r=i[n],t.indexOf(r)>=0||(o[r]=e[r]);return o}(e,t);if(Object.getOwnPropertySymbols){var i=Object.getOwnPropertySymbols(e);for(n=0;n<i.length;n++)r=i[n],t.indexOf(r)>=0||Object.prototype.propertyIsEnumerable.call(e,r)&&(o[r]=e[r])}return o}var l=n.createContext({}),s=function(e){var t=n.useContext(l),r=t;return e&&(r="function"==typeof e?e(t):a(a({},t),e)),r},c=function(e){var t=s(e.components);return n.createElement(l.Provider,{value:t},e.children)},p="mdxType",d={inlineCode:"code",wrapper:function(e){var t=e.children;return n.createElement(n.Fragment,{},t)}},m=n.forwardRef((function(e,t){var r=e.components,o=e.mdxType,i=e.originalType,l=e.parentName,c=u(e,["components","mdxType","originalType","parentName"]),p=s(r),m=o,g=p["".concat(l,".").concat(m)]||p[m]||d[m]||i;return r?n.createElement(g,a(a({ref:t},c),{},{components:r})):n.createElement(g,a({ref:t},c))}));function g(e,t){var r=arguments,o=t&&t.mdxType;if("string"==typeof e||o){var i=r.length,a=new Array(i);a[0]=m;var u={};for(var l in t)hasOwnProperty.call(t,l)&&(u[l]=t[l]);u.originalType=e,u[p]="string"==typeof e?e:o,a[1]=u;for(var s=2;s<i;s++)a[s]=r[s];return n.createElement.apply(null,a)}return n.createElement.apply(null,r)}m.displayName="MDXCreateElement"},2027:function(e,t,r){r.r(t),r.d(t,{assets:function(){return l},contentTitle:function(){return a},default:function(){return d},frontMatter:function(){return i},metadata:function(){return u},toc:function(){return s}});var n=r(3117),o=(r(7294),r(3905));const i={id:"log-structured",title:"@idearium/log-structured"},a=void 0,u={unversionedId:"log-structured",id:"log-structured",title:"@idearium/log-structured",description:"The Idearium logger HTTP structured logging formatter.",source:"@site/docs/log-structured.md",sourceDirName:".",slug:"/log-structured",permalink:"/idearium-lib/docs/log-structured",draft:!1,editUrl:"https://github.com/idearium/idearium-lib/tree/master/docusaurus/docs/log-structured.md",tags:[],version:"current",frontMatter:{id:"log-structured",title:"@idearium/log-structured"},sidebar:"sidebar",previous:{title:"@idearium/log-insightops",permalink:"/idearium-lib/docs/log-insightops"},next:{title:"@idearium/mongoose",permalink:"/idearium-lib/docs/mongoose"}},l={},s=[{value:"Installation",id:"installation",level:2},{value:"Usage",id:"usage",level:2},{value:"Pretty printing",id:"pretty-printing",level:3},{value:"Combining formatters and transports",id:"combining-formatters-and-transports",level:3}],c={toc:s},p="wrapper";function d(e){let{components:t,...r}=e;return(0,o.kt)(p,(0,n.Z)({},c,r,{components:t,mdxType:"MDXLayout"}),(0,o.kt)("p",null,"The Idearium logger HTTP structured logging formatter."),(0,o.kt)("h2",{id:"installation"},"Installation"),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-shell"},"$ yarn add @idearium/log-structured\n")),(0,o.kt)("h2",{id:"usage"},"Usage"),(0,o.kt)("p",null,"The Idearium logger HTTP structured logging formatter transport takes log output from ",(0,o.kt)("a",{parentName:"p",href:"/idearium-lib/docs/log-http"},(0,o.kt)("inlineCode",{parentName:"a"},"@idearium/log-http"))," and structures it according to ",(0,o.kt)("a",{parentName:"p",href:"https://cloud.google.com/logging/docs/structured-logging"},"GCP Structured Logging"),"."),(0,o.kt)("p",null,"It will transform log with ",(0,o.kt)("inlineCode",{parentName:"p"},"req")," and ",(0,o.kt)("inlineCode",{parentName:"p"},"res")," properties, completely ignoring anything."),(0,o.kt)("p",null,"Start your Node application and pipe the output to the ",(0,o.kt)("inlineCode",{parentName:"p"},"structured")," script (found at ",(0,o.kt)("inlineCode",{parentName:"p"},"node_modules/.bin/structured")," once this package is installed):"),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-shell"},"$ node server.js | structured\n")),(0,o.kt)("h3",{id:"pretty-printing"},"Pretty printing"),(0,o.kt)("p",null,"If you want to pretty print the results of this formatter, pipe the output to ",(0,o.kt)("a",{parentName:"p",href:"https://github.com/pinojs/pino-pretty"},"'pino-pretty'"),";"),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-shell"},"$ node server.js | structure | pino-pretty\n")),(0,o.kt)("h3",{id:"combining-formatters-and-transports"},"Combining formatters and transports"),(0,o.kt)("p",null,"Sometimes you will want to use multiple transports/formatters. To do this you can use the ",(0,o.kt)("inlineCode",{parentName:"p"},"tee")," command in bash:"),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-shell"},"$ node server.js | structured | tee insightops pino-stackdriver --project bar --credentials /credentials.json\n")))}d.isMDXComponent=!0}}]);