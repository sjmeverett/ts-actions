# ts-actions

Typescript-friendly action creators.

## Usage

Install:

    $ npm install --save ts-actions

Import, then define your action types:

```js
import { buildCreator, Action } from 'ts-actions';

const actions = buildCreator({
  addTodo: (text: string): AddTodoAction => ({text}),
  removeTodo: (id: number): RemoveTodoAction => ({id})
});

interface AddTodoAction extends Action {
  text: string;
}

interface RemoveTodoAction extends Action {
  id: number;
}
```

The `actions` constant will then contain the hash passed to `buildCreator`, decorated as below,
plus an extra `types` field.

The action creator functions are decorated to add a `type` field to the returned action, the value
of which is calculated by snake-casing the creator function name.

These computed types, mapped to the creator names, are accessible via the `types` field.

Thus:

```js
console.log(actions.addTodo('learn portuguese'));
// {type: 'ADD_TODO', text: 'learn portuguese'}

console.log(actions.types);
// {addTodo: 'ADD_TODO', removeTodo: 'REMOVE_TODO'}
```

This means you will have a value to compare the action type against:

```js
function reducer(state, action) {
  if (action.type === actions.types.addTodo) {
    // ....
  } else {
    return state;
  }
}
```

Or even better, with [handler-builder](https://www.npmjs.com/package/handler-builder):

```js
import HandlerBuilder from 'handler-builder';

const reducerBuilder = new HandlerBuilder<string>(
  // descriminant selector
  (state, action) => action.type,
  // default case
  (state, action) => state
);

const todoReducer = reducerBuilder.build({
  [actions.types.addTodo](state, action: AddTodoAction) {
    // ...
  },

  [actions.types.removeTodo](state, action: RemoveTodoAction) {
    // ...
  }
})
```

The package also defines a function called `bindToDispatch`, which is like the `bindActionCreators`
method in [redux](https://www.npmjs.com/package/redux), only it ignores non-function fields (such as the `type` field
from above) without complaining, it has the parameters the sensible way round, and it is curried:

```js
import { bindToDispatch } from '@stugotech/ts-action-creator';

const store = createStore(...);

const doActions = bindToDispatch((action) => store.dispatch(action), actions);

// or, alternatively...

const binder = bindToDispatch((action) => store.dispatch(action));
const doActions = binder(actions);
```

Then, `doActions` will look like `actions` from above, only decorated to actually dispatch the action:

```js
doActions.addTodo('learn Portuguese');
// the dispatch happens automatically
```
