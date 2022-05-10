(window.webpackJsonp=window.webpackJsonp||[]).push([[9],{76:function(e,t,n){"use strict";n.r(t),n.d(t,"frontMatter",(function(){return o})),n.d(t,"metadata",(function(){return c})),n.d(t,"rightToc",(function(){return l})),n.d(t,"default",(function(){return s}));var a=n(3),r=n(7),i=(n(0),n(87)),o={id:"apm",title:"@idearium/apm"},c={unversionedId:"apm",id:"apm",isDocsHomePage:!1,title:"@idearium/apm",description:"Defaults for our Elastic APM integration.",source:"@site/docs/apm.md",slug:"/apm",permalink:"/idearium-lib/docs/apm",editUrl:"https://github.com/idearium/idearium-lib/tree/master/docusaurus/docs/apm.md",version:"current",sidebar:"sidebar",previous:{title:"About",permalink:"/idearium-lib/docs/"},next:{title:"@idearium/cookie",permalink:"/idearium-lib/docs/cookie"}},l=[{value:"Installation",id:"installation",children:[{value:"Beta installation",id:"beta-installation",children:[]}]},{value:"Usage",id:"usage",children:[]},{value:"Advanced usage",id:"advanced-usage",children:[]}],u={rightToc:l};function s(e){var t=e.components,n=Object(r.a)(e,["components"]);return Object(i.a)("wrapper",Object(a.a)({},u,n,{components:t,mdxType:"MDXLayout"}),Object(i.a)("p",null,"Defaults for our Elastic APM integration."),Object(i.a)("h2",{id:"installation"},"Installation"),Object(i.a)("pre",null,Object(i.a)("code",Object(a.a)({parentName:"pre"},{className:"language-shell"}),"$ yarn add -E @idearium/apm\n")),Object(i.a)("h3",{id:"beta-installation"},"Beta installation"),Object(i.a)("p",null,"If you need to install a beta version, you can:"),Object(i.a)("pre",null,Object(i.a)("code",Object(a.a)({parentName:"pre"},{className:"language-shell"}),"$ yarn add -E @idearium/apm@beta\n")),Object(i.a)("h2",{id:"usage"},"Usage"),Object(i.a)("p",null,"To use ",Object(i.a)("inlineCode",{parentName:"p"},"@idearium/apm"),", simply require it at the top of your server.js file."),Object(i.a)("p",null,"You will need to include the following environment variables in your manifests:"),Object(i.a)("pre",null,Object(i.a)("code",Object(a.a)({parentName:"pre"},{className:"language-yaml"}),"ELASTIC_APM_IGNORE_URLS: '/_status/ping,/version.json'\nELASTIC_APM_SERVER_URL: 'https://elasticserverurl:443'\nELASTIC_APM_SERVICE_NAME: 'project-repo-container-environment'\n")),Object(i.a)("h2",{id:"advanced-usage"},"Advanced usage"),Object(i.a)("p",null,"In addition to the required environment variables above, you can customize the apm integration using any of the Elastic APM agent ",Object(i.a)("a",Object(a.a)({parentName:"p"},{href:"https://www.elastic.co/guide/en/apm/agent/nodejs/current/configuration.html"}),"configuration options"),"."))}s.isMDXComponent=!0},87:function(e,t,n){"use strict";n.d(t,"a",(function(){return m}));var a=n(0),r=n.n(a);function i(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function o(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);t&&(a=a.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,a)}return n}function c(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?o(Object(n),!0).forEach((function(t){i(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):o(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function l(e,t){if(null==e)return{};var n,a,r=function(e,t){if(null==e)return{};var n,a,r={},i=Object.keys(e);for(a=0;a<i.length;a++)n=i[a],t.indexOf(n)>=0||(r[n]=e[n]);return r}(e,t);if(Object.getOwnPropertySymbols){var i=Object.getOwnPropertySymbols(e);for(a=0;a<i.length;a++)n=i[a],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(r[n]=e[n])}return r}var u=r.a.createContext({}),s=function(e){var t=r.a.useContext(u),n=t;return e&&(n="function"==typeof e?e(t):c(c({},t),e)),n},p={inlineCode:"code",wrapper:function(e){var t=e.children;return r.a.createElement(r.a.Fragment,{},t)}},d=r.a.forwardRef((function(e,t){var n=e.components,a=e.mdxType,i=e.originalType,o=e.parentName,u=l(e,["components","mdxType","originalType","parentName"]),d=s(n),m=a,b=d["".concat(o,".").concat(m)]||d[m]||p[m]||i;return n?r.a.createElement(b,c(c({ref:t},u),{},{components:n})):r.a.createElement(b,c({ref:t},u))}));function m(e,t){var n=arguments,a=t&&t.mdxType;if("string"==typeof e||a){var i=n.length,o=new Array(i);o[0]=d;var c={};for(var l in t)hasOwnProperty.call(t,l)&&(c[l]=t[l]);c.originalType=e,c.mdxType="string"==typeof e?e:a,o[1]=c;for(var u=2;u<i;u++)o[u]=n[u];return r.a.createElement.apply(null,o)}return r.a.createElement.apply(null,n)}d.displayName="MDXCreateElement"}}]);