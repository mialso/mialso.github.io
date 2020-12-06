import {
    compose, createStore, combineReducers, applyMiddleware,
} from '../../../node_modules/redux/es/redux.mjs'
import { inputReducer } from './inputReducer.mjs'
import { historyReducer } from '../history/historyReducer.mjs'
import { historyController } from '../history/historyController.mjs'
import { spotlightLogger } from './spotlightLogger.mjs'

const composeWithDevTools = (
    // eslint-disable-next-line
    typeof window !== 'undefined' && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
        // eslint-disable-next-line
        ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
        : function reduxDevToolsCompose(...args) {
            if (args.length === 0) return undefined;
            if (typeof args[0] === 'object') return compose;
            return compose(...args);
        }
)

export function createSpotlightStore() {
    const store = createStore(
        combineReducers({
            input: inputReducer,
            history: historyReducer,
        }),
        {},
        composeWithDevTools(applyMiddleware(spotlightLogger, historyController)),
    )
    return store
}
