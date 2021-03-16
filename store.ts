import {AnyAction, createStore} from 'redux';
import {Context, createWrapper, HYDRATE, MakeStore} from 'next-redux-wrapper';

export interface State {
  tick: string;
  count: number;
}

const rootReducer = (state: State = {tick: 'init', count: 0}, action: AnyAction) => {
  switch (action.type) {
    case 'ADD':
      return {
        ...state,
        count: state.count + 1
      }
    case 'TICK':
      return {...state, tick: action.payload};
    default:
      return state;
  }
};


// create your reducer
const reducer = (state: State = {tick: 'init', count: 0}, action: AnyAction) => {
  console.log("new reducer old state:", state, "action:", action);
  if (action.type === HYDRATE) {
    return {
      ...state, // use previous state
      ...action.payload // apply delta from hydration
    };
  }

  return rootReducer(state, action);
};

// create a makeStore function
const makeStore: MakeStore<State> = (context: Context) => {
  const isServer = typeof window === 'undefined';
  if (isServer) {
    // If it's on server side, create a store
    return createStore(rootReducer);
  }
  return createStore(reducer)
};

// export an assembled wrapper
export const stateWrapper = createWrapper<State>(makeStore, {debug: true});
