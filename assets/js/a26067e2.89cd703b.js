"use strict";(self.webpackChunkidearium_lib_docs=self.webpackChunkidearium_lib_docs||[]).push([[626],{3905:function(e,t,r){r.d(t,{Zo:function(){return u},kt:function(){return f}});var n=r(7294);function a(e,t,r){return t in e?Object.defineProperty(e,t,{value:r,enumerable:!0,configurable:!0,writable:!0}):e[t]=r,e}function i(e,t){var r=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);t&&(n=n.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),r.push.apply(r,n)}return r}function l(e){for(var t=1;t<arguments.length;t++){var r=null!=arguments[t]?arguments[t]:{};t%2?i(Object(r),!0).forEach((function(t){a(e,t,r[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(r)):i(Object(r)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(r,t))}))}return e}function o(e,t){if(null==e)return{};var r,n,a=function(e,t){if(null==e)return{};var r,n,a={},i=Object.keys(e);for(n=0;n<i.length;n++)r=i[n],t.indexOf(r)>=0||(a[r]=e[r]);return a}(e,t);if(Object.getOwnPropertySymbols){var i=Object.getOwnPropertySymbols(e);for(n=0;n<i.length;n++)r=i[n],t.indexOf(r)>=0||Object.prototype.propertyIsEnumerable.call(e,r)&&(a[r]=e[r])}return a}var c=n.createContext({}),s=function(e){var t=n.useContext(c),r=t;return e&&(r="function"==typeof e?e(t):l(l({},t),e)),r},u=function(e){var t=s(e.components);return n.createElement(c.Provider,{value:t},e.children)},d="mdxType",p={inlineCode:"code",wrapper:function(e){var t=e.children;return n.createElement(n.Fragment,{},t)}},m=n.forwardRef((function(e,t){var r=e.components,a=e.mdxType,i=e.originalType,c=e.parentName,u=o(e,["components","mdxType","originalType","parentName"]),d=s(r),m=a,f=d["".concat(c,".").concat(m)]||d[m]||p[m]||i;return r?n.createElement(f,l(l({ref:t},u),{},{components:r})):n.createElement(f,l({ref:t},u))}));function f(e,t){var r=arguments,a=t&&t.mdxType;if("string"==typeof e||a){var i=r.length,l=new Array(i);l[0]=m;var o={};for(var c in t)hasOwnProperty.call(t,c)&&(o[c]=t[c]);o.originalType=e,o[d]="string"==typeof e?e:a,l[1]=o;for(var s=2;s<i;s++)l[s]=r[s];return n.createElement.apply(null,l)}return n.createElement.apply(null,r)}m.displayName="MDXCreateElement"},7590:function(e,t,r){r.r(t),r.d(t,{assets:function(){return c},contentTitle:function(){return l},default:function(){return p},frontMatter:function(){return i},metadata:function(){return o},toc:function(){return s}});var n=r(3117),a=(r(7294),r(3905));const i={id:"certs",title:"@idearium/certs"},l=void 0,o={unversionedId:"certs",id:"certs",title:"@idearium/certs",description:"Easily load custom and OS certificate authority certs into Node.js.",source:"@site/docs/certs.md",sourceDirName:".",slug:"/certs",permalink:"/idearium-lib/docs/certs",draft:!1,editUrl:"https://github.com/idearium/idearium-lib/tree/master/docusaurus/docs/certs.md",tags:[],version:"current",frontMatter:{id:"certs",title:"@idearium/certs"},sidebar:"sidebar",previous:{title:"@idearium/apm",permalink:"/idearium-lib/docs/apm"},next:{title:"@idearium/cloudflare-queues",permalink:"/idearium-lib/docs/cloudflare-queues"}},c={},s=[{value:"Installation",id:"installation",level:2},{value:"Beta installation",id:"beta-installation",level:3},{value:"Usage",id:"usage",level:2},{value:"<code>loadCerts</code>",id:"loadcerts",level:3},{value:"Requirements",id:"requirements",level:4},{value:"<code>loadOsCerts</code>",id:"loadoscerts",level:3}],u={toc:s},d="wrapper";function p(e){let{components:t,...r}=e;return(0,a.kt)(d,(0,n.Z)({},u,r,{components:t,mdxType:"MDXLayout"}),(0,a.kt)("p",null,"Easily load custom and OS certificate authority certs into Node.js."),(0,a.kt)("h2",{id:"installation"},"Installation"),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-shell"},"$ yarn add -E @idearium/certs\n")),(0,a.kt)("h3",{id:"beta-installation"},"Beta installation"),(0,a.kt)("p",null,"If you need to install a beta version, you can:"),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-shell"},"$ yarn add -E @idearium/certs@beta\n")),(0,a.kt)("h2",{id:"usage"},"Usage"),(0,a.kt)("h3",{id:"loadcerts"},(0,a.kt)("inlineCode",{parentName:"h3"},"loadCerts")),(0,a.kt)("p",null,"Use the ",(0,a.kt)("inlineCode",{parentName:"p"},"loadCerts")," function to load multiple certificates and keys from a directory structure."),(0,a.kt)("p",null,"Given the following directory structure:"),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre"},"/ssl/amqp.crt\n/ssl/amqp.key\n/ssl/redis.crt\n/ssl/redis.key\n/ssl/ca/ca.crt\n")),(0,a.kt)("p",null,(0,a.kt)("inlineCode",{parentName:"p"},"loadCerts")," will return the following:"),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-JavaScript"},"{\n    ca: [ 'ca.crt content' ],\n    certs: {\n        amqp: { crt: 'amqp.crt content', key: 'amqp.key content' },\n        redis: { crt: 'redis.crt content', key: 'redis.key content' }\n    }\n}\n")),(0,a.kt)("p",null,"By default, it will look for custom certs in the ",(0,a.kt)("inlineCode",{parentName:"p"},"/ssl")," directory but this can easily be changed:"),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-JavaScript"},"const { loadCerts } = require('@idearium/certs');\n\nawait loadCerts('/certs');\n")),(0,a.kt)("h4",{id:"requirements"},"Requirements"),(0,a.kt)("p",null,(0,a.kt)("inlineCode",{parentName:"p"},"loadCerts")," has the following expectations:"),(0,a.kt)("ul",null,(0,a.kt)("li",{parentName:"ul"},"It will load CA certs in the ",(0,a.kt)("inlineCode",{parentName:"li"},"ca")," directory, relative to the directory provided to it. If the directory doesn't exist, it will ignored."),(0,a.kt)("li",{parentName:"ul"},"It will only load files with ",(0,a.kt)("inlineCode",{parentName:"li"},".crt")," and ",(0,a.kt)("inlineCode",{parentName:"li"},".key")," extensions.")),(0,a.kt)("h3",{id:"loadoscerts"},(0,a.kt)("inlineCode",{parentName:"h3"},"loadOsCerts")),(0,a.kt)("p",null,"Use the ",(0,a.kt)("inlineCode",{parentName:"p"},"loadOsCerts")," function to OS provided certs:"),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-JavaScript"},"const { loadOsCerts } = require('@idearium/certs');\n\nawait loadOsCerts();\n")))}p.isMDXComponent=!0}}]);