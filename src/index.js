import {combineEpics, createEpicMiddleware} from 'redux-observable'
import {applyMiddleware, combineReducers, compose, createStore} from 'redux'
import storage from "redux-persist/es/storage";
import {persistReducer} from "redux-persist";
import {seamlessImmutableTransformCreator} from "redux-persist-seamless-immutable";
import React from "react"
import Immutable from "seamless-immutable";
import {Provider} from 'react-redux'

const buildReducers = (components) => {
  const reducers = {}
  components.filter((component) => component.reducer)
    .forEach((component) => reducers[component.constants.NAME] = component.reducer)
  const whitelist = components.filter(comp => comp.persist).map(comp => comp.constants.NAME)
  const transformerConfig = {
    whitelistPerReducer: whitelist
  }
  return persistReducer({
    key: 'qmee',
    storage,
    whitelist,
    transforms: [seamlessImmutableTransformCreator(transformerConfig)]
  }, combineReducers(reducers))
}

const buildEpic = (components) => {
  return components.map((component) => component.epics).filter((epic) => epic)
}

export const buildModules = modules => ({
  reducers: buildReducers(modules),
  epics: combineEpics(...buildEpic(modules))
})

export const withModules = (modules, config = {}) => Component => {
  const {epics, reducers} = buildModules(modules)

  const {initialState, routerEnhancement, middlewares} = config

  const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
  const epicMiddleware = createEpicMiddleware();
  const store = createStore(
    routerEnhancement ? routerEnhancement(reducers) : reducers,
    initialState || Immutable({}),
    composeEnhancers(
      applyMiddleware(
        epicMiddleware,
        ...(middlewares || [])
      )
    )
  )
  epicMiddleware.run(epics)
  return props => React.createElement(Provider, {store: store},
    React.createElement(Component, props, null)
  )
}
