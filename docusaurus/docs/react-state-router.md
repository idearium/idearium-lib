---
id: react-state-router
title: '@idearium/react-state-router'
---

The Idearium React state router component for XState.

## Installation

```shell
$ yarn add @idearium/react-state-router
```

## Usage

To use this component, first create a [react context](https://beta.reactjs.org/blog/2018/03/29/react-v-16-3#official-context-api) and use the `service` created through xstate for the provider value.

```js
import ReactContext from 'context/reactContext';
import xstatemachine from 'machines/xstatemachine';
import { useInterpret } from '@xstate/react';

const Component = ({ children }) => {
    const service = useInterpret(xstatemachine);

    return (
        <ReactContext.Provider value={{ service }}>
            {children}
        </ReactContext.Provider>
    );
};
```

Then inside your component, import the state router component and context you created above.

```js
import StateRouter from '@idearium/react-state-router';
import ReactContext from 'context/reactContext';
import Step1 from 'steps/step1';
import Step2 from 'steps/step2';
import Step3 from 'steps/step3';

const StateRouterComponent = () => (
    <StateRouter context={ReactContext}>
        <Step1 when="step1" />
        <Step2 when="step2" />
        <Step3 when="step3" />
    </StateRouter>
);

export default StateRouterComponent;
```

The state router will now automatically display the component when the `when` attribute matches the xstate state.

### Multiple states

You can also pass an array of states to the `when` attribute to display the component when multiple states match.

```js
import StateRouter from '@idearium/react-state-router';
import ReactContext from 'context/reactContext';
import Step1 from 'steps/step1';
import Step2 from 'steps/step2';
import Step3 from 'steps/step3';

const StateRouterComponent = () => (
    <StateRouter context={ReactContext}>
        <Step1 when={['A', 'Z']} />
        <Step2 when="B" />
        <Step3 when="C" />
    </StateRouter>
);

export default StateRouterComponent;
```
