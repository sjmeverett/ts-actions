import * as snakeCase from 'lodash.snakecase';

/**
 * A map of action creators.
 */
export interface CreatorTemplate {
  [id: string]: Function;
};

/**
 * Computed action types for each name in `T`.
 */
export type ActionTypes<T> = {
  [P in keyof T]: string;
};

/**
 * A redux action, but with type optional, for convenience when defining creator templates.
 */
export interface Action {
  type?: string;
};

/**
 * A map of action creators, with a `types` field specifying generated action types.
 */
export type ActionCreators<T extends CreatorTemplate> = T & {types: ActionTypes<T>};

/**
 * Builds a creator with namespaced action types, that is types starting with `namespace + '/'`.
 * @param namespace the namespace to use for action types
 * @param template the template to build the creators from
 */
export function buildCreator<T extends CreatorTemplate>(namespace: string, template: T): ActionCreators<T>;
/**
 * Builds a creator.
 * @param template the template to build the creators from
 */
export function buildCreator<T extends CreatorTemplate>(template: T): ActionCreators<T>;
export function buildCreator<T extends CreatorTemplate>(namespaceOrObj: string | T, template?: T): ActionCreators<T> {
  let namespace: string;

  if (typeof namespaceOrObj === 'string') {
    namespace = namespaceOrObj + '/';

  } else {
    namespace = '';
    template = namespaceOrObj;
  }

  let creator: any = {types: {}};

  for (let k in template) {
    if (typeof template[k] !== 'function')
      continue;

    let type = namespace + 
      snakeCase(k).toUpperCase();

    creator[k] = (...args: Object[]) => {
      return {type, ...template[k](...args)}
    };

    creator.types[k] = type;
  }

  return creator;
};

/**
 * Returns a function which binds the specified dispatch function to action creators.  That is,
 * given a map of action creators, it will return a similar map, with the creators decorated to
 * call dispatch with the created action.  Note that it will ignore the `types` property.
 * @param dispatch the store dispatch function to bind to
 */
export function bindToDispatch(dispatch: <A>(action: A) => A): <T>(creator: T) => T;
/**
 * Binds the specified dispatch functon to the specified action creators.  That is,
 * given a map of action creators, it will return a similar map, with the creators decorated to
 * call dispatch with the created action.  Note that it will ignore the `types` property.
 * @param dispatch the store dispatch function to bind to
 * @param creator the creator to bind
 */
export function bindToDispatch<T>(dispatch: <A>(action: A) => A, creator: T): T;
export function bindToDispatch<T>(dispatch: <A>(action: A) => A, creator?: T): T {
  const bind = (creator: T) => {
    let connected: any = {};

    for (let k in creator) {
      let c: any = creator[k];

      if (typeof c === 'function') {
        connected[k] = (...args) => dispatch(c(...args));
      }
    }

    return connected;
  };

  return typeof creator !== 'undefined' ? bind(creator) : bind;
};
