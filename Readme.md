# redux-action-creator

Wrap root component with state defined in modules

Feature: 
- Merges epics from redux-observables
- Merges reducers to one root reducer
- Supports initial state
- Uses seamless-immutable
- Supports persistent modules

## Install
```
yarn add @wayrunner/redux-modules
```

## Usage

### ```createActionCreator(type, argumentMapping?, reducer?)```

Modules should be structured as follows: 
```js

export default {
  NAME: "Module1",
  reducer: reducers,
  epic: epics,
  persist: true,
}
```

```js
import React from "react"
import ReactDOM from "react-dom"
import App from "./App"
import Module1 from "./state/Module1";
import Module2 from "./state/Module2";
import Immutable from "seamless-immutable";
import {withModules} from "@wayrunner/redux/modules";

const modules = [
  Module1,
  Module2,
]

const initialState = Immutable({
  [Module1.NAME]: {
    data: "Some data"
  },
})

ReactDOM.render(
  withModules(modules, {initialState})(App),
  document.getElementById("react-app")
)
```