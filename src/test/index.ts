import test from 'ava';
import { buildCreator, bindToDispatch, Action } from '../lib';

interface ActionOneAction extends Action {
  param: string;
}

interface ActionTwoAction extends Action {
  param: number;
}

test('buildCreator', (t) => {
  const actions = buildCreator({
    actionOne: (param: string): ActionOneAction => ({param}),
    actionTwo: (param: number): ActionTwoAction => ({param})
  });

  t.is(typeof actions.actionOne, 'function');
  t.is(typeof actions.actionTwo, 'function');

  t.deepEqual(actions.types, {
    actionOne: 'ACTION_ONE',
    actionTwo: 'ACTION_TWO'
  });

  t.deepEqual(actions.actionOne('hello'), {
    type: 'ACTION_ONE',
    param: 'hello'
  });

  t.deepEqual(actions.actionTwo(1), {
    type: 'ACTION_TWO',
    param: 1
  });
});

test('buildCreator', (t) => {
  const actions = buildCreator('myNamespace', {
    actionOne: (param: string): ActionOneAction => ({param}),
    actionTwo: (param: number): ActionTwoAction => ({param})
  });

  t.deepEqual(actions.types, {
    actionOne: 'myNamespace/ACTION_ONE',
    actionTwo: 'myNamespace/ACTION_TWO'
  });
});

test('bindToDispatch', (t) => {
  const actions = {
    actionOne: (param: string): ActionOneAction => ({type: 'ACTION_ONE', param}),
    types: {}
  };

  t.plan(1);

  const bound = bindToDispatch(
    (action) => t.deepEqual(action, {
      type: 'ACTION_ONE',
      param: 'hi'
    }),
    actions
  );

  bound.actionOne('hi');
});

test('bindToDispatch curried', (t) => {
  const actions = {
    actionOne: (param: string): ActionOneAction => ({type: 'ACTION_ONE', param}),
    types: {}
  };

  t.plan(1);

  const bind = bindToDispatch(
    (action) => t.deepEqual(action, {
      type: 'ACTION_ONE',
      param: 'hi'
    })
  );

  const bound = bind(actions);

  bound.actionOne('hi');
});
