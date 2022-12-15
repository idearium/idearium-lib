(window.webpackJsonp=window.webpackJsonp||[]).push([[8],{75:function(e,t,r){"use strict";r.r(t),r.d(t,"frontMatter",(function(){return c})),r.d(t,"metadata",(function(){return i})),r.d(t,"rightToc",(function(){return s})),r.d(t,"default",(function(){return u}));var n=r(3),a=r(7),o=(r(0),r(91)),c={id:"react-state-router",title:"@idearium/react-state-router"},i={unversionedId:"react-state-router",id:"react-state-router",isDocsHomePage:!1,title:"@idearium/react-state-router",description:"The Idearium React state router component for XState.",source:"@site/docs/react-state-router.md",slug:"/react-state-router",permalink:"/idearium-lib/docs/react-state-router",editUrl:"https://github.com/idearium/idearium-lib/tree/master/docusaurus/docs/react-state-router.md",version:"current",sidebar:"sidebar",previous:{title:"@idearium/promise-all-settled",permalink:"/idearium-lib/docs/promise-all-settled"},next:{title:"@idearium/safe-promise",permalink:"/idearium-lib/docs/safe-promise"}},s=[{value:"Installation",id:"installation",children:[]},{value:"Usage",id:"usage",children:[]}],p={rightToc:s};function u(e){var t=e.components,r=Object(a.a)(e,["components"]);return Object(o.a)("wrapper",Object(n.a)({},p,r,{components:t,mdxType:"MDXLayout"}),Object(o.a)("p",null,"The Idearium React state router component for XState."),Object(o.a)("h2",{id:"installation"},"Installation"),Object(o.a)("pre",null,Object(o.a)("code",Object(n.a)({parentName:"pre"},{className:"language-shell"}),"$ yarn add @idearium/react-state-router\n")),Object(o.a)("h2",{id:"usage"},"Usage"),Object(o.a)("p",null,"To use this component, first create a ",Object(o.a)("a",Object(n.a)({parentName:"p"},{href:"https://beta.reactjs.org/blog/2018/03/29/react-v-16-3#official-context-api"}),"react context")," and use the ",Object(o.a)("inlineCode",{parentName:"p"},"service")," created through xstate for the provider value."),Object(o.a)("pre",null,Object(o.a)("code",Object(n.a)({parentName:"pre"},{className:"language-js"}),"import ReactContext from 'context/reactContext';\nimport xstatemachine from 'machines/xstatemachine';\nimport { useInterpret } from '@xstate/react';\n\nconst Component = ({ children }) => {\n    const service = useInterpret(xstatemachine);\n\n    return (\n        <ReactContext.Provider value={{ service }}>\n            {children}\n        </ReactContext.Provider>\n    );\n};\n")),Object(o.a)("p",null,"Then inside your component, import the state router component and context you created above."),Object(o.a)("pre",null,Object(o.a)("code",Object(n.a)({parentName:"pre"},{className:"language-js"}),"import StateRouter from '@idearium/react-state-router';\nimport ReactContext from 'context/reactContext';\nimport Step1 from 'steps/step1';\nimport Step2 from 'steps/step2';\nimport Step3 from 'steps/step3';\n\nconst StateRouterComponent = () => (\n    <StateRouter context={ReactContext}>\n        <Step1 when=\"step1\" />\n        <Step2 when=\"step2\" />\n        <Step3 when=\"step3\" />\n    </StateRouter>\n);\n\nexport default StateRouterComponent;\n")),Object(o.a)("p",null,"The state router will now automatically display the component when the ",Object(o.a)("inlineCode",{parentName:"p"},"when")," attribute matches the xstate state."))}u.isMDXComponent=!0},91:function(e,t,r){"use strict";r.d(t,"a",(function(){return d}));var n=r(0),a=r.n(n);function o(e,t,r){return t in e?Object.defineProperty(e,t,{value:r,enumerable:!0,configurable:!0,writable:!0}):e[t]=r,e}function c(e,t){var r=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);t&&(n=n.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),r.push.apply(r,n)}return r}function i(e){for(var t=1;t<arguments.length;t++){var r=null!=arguments[t]?arguments[t]:{};t%2?c(Object(r),!0).forEach((function(t){o(e,t,r[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(r)):c(Object(r)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(r,t))}))}return e}function s(e,t){if(null==e)return{};var r,n,a=function(e,t){if(null==e)return{};var r,n,a={},o=Object.keys(e);for(n=0;n<o.length;n++)r=o[n],t.indexOf(r)>=0||(a[r]=e[r]);return a}(e,t);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);for(n=0;n<o.length;n++)r=o[n],t.indexOf(r)>=0||Object.prototype.propertyIsEnumerable.call(e,r)&&(a[r]=e[r])}return a}var p=a.a.createContext({}),u=function(e){var t=a.a.useContext(p),r=t;return e&&(r="function"==typeof e?e(t):i(i({},t),e)),r},l={inlineCode:"code",wrapper:function(e){var t=e.children;return a.a.createElement(a.a.Fragment,{},t)}},m=a.a.forwardRef((function(e,t){var r=e.components,n=e.mdxType,o=e.originalType,c=e.parentName,p=s(e,["components","mdxType","originalType","parentName"]),m=u(r),d=n,f=m["".concat(c,".").concat(d)]||m[d]||l[d]||o;return r?a.a.createElement(f,i(i({ref:t},p),{},{components:r})):a.a.createElement(f,i({ref:t},p))}));function d(e,t){var r=arguments,n=t&&t.mdxType;if("string"==typeof e||n){var o=r.length,c=new Array(o);c[0]=m;var i={};for(var s in t)hasOwnProperty.call(t,s)&&(i[s]=t[s]);i.originalType=e,i.mdxType="string"==typeof e?e:n,c[1]=i;for(var p=2;p<o;p++)c[p]=r[p];return a.a.createElement.apply(null,c)}return a.a.createElement.apply(null,r)}m.displayName="MDXCreateElement"}}]);