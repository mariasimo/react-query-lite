import React from 'react';
import {
  DevtoolsContainer,
  Query,
  StatusFetching,
  StatusInactive,
  StatusSuccess,
} from '../styles';

const context = React.createContext();

export class QueryClient {
  constructor() {
    this.queries = [];
    this.subscribers = [];
  }
  getQuery = (options) => {
    const queryHash = JSON.stringify(options.queryKey);
    let query = this.queries.find((d) => d.queryHash === queryHash);

    if (!query) {
      query = createQuery(this, options);
      this.queries.push(query);
    }

    return query;
  };

  subscribe = (callback) => {
    this.subscribers.push(callback);

    return () => {
      this.subscribers = this.subscribers.filter((d) => d !== callback);
    };
  };

  notify = () => {
    this.subscribers.forEach((cb) => cb());
  };
}

export function QueryClientProvider({ children, client }) {
  React.useEffect(() => {
    const onFocus = () => {
      client.queries.forEach((query) => {
        query.subscribers.forEach((subscriber) => {
          subscriber.fetch();
        });
      });
    };

    window.addEventListener('visibilityChange', onFocus, false);
    window.addEventListener('focus', onFocus, false);

    return () => {
      window.removeEventListener('visibilityChange', onFocus, false);
      window.removeEventListener('focus', onFocus, false);
    };
  }, [client]);

  return <context.Provider value={client}>{children}</context.Provider>;
}

export function useQuery({ queryKey, queryFn, staleTime, cacheTime }) {
  const client = React.useContext(context);

  const [, rerender] = React.useReducer((i) => i + 1, 0);

  const observerRef = React.useRef();
  if (!observerRef.current) {
    observerRef.current = createQueryObserver(client, {
      queryKey,
      queryFn,
      staleTime,
      cacheTime,
    });
  }

  React.useEffect(() => {
    return observerRef.current.subscribe(rerender);
  }, []);

  return observerRef.current.getResult();
}

function createQuery(client, { queryKey, queryFn, cacheTime = 5 * 60 * 1000 }) {
  let query = {
    queryKey,
    queryHash: JSON.stringify(queryKey),
    promise: null,
    subscribers: [],
    gcTimeout: null,
    state: {
      status: 'loading',
      isFetching: true,
      error: undefined,
      data: undefined,
    },
    subscribe: (subscriber) => {
      query.subscribers.push(subscriber);
      query.unScheduleGC();

      return () => {
        query.subscribers = query.subscribers.filter((d) => d !== subscriber);

        if (!query.subscribers.length) {
          query.scheduleGC();
        }
      };
    },
    scheduleGC: () => {
      query.gcTimeout = setTimeout(() => {
        client.queries = client.queries.filter((d) => d !== query);
        client.notify();
      }, cacheTime);
    },
    unScheduleGC: () => clearTimeout(query.gcTimeout),
    setState: (updater) => {
      query.state = updater(query.state);
      query.subscribers.forEach((subscriber) => subscriber.notify());
      client.notify();
    },
    fetch: () => {
      if (!query.promise) {
        query.promise = (async () => {
          query.setState((old) => ({
            ...old,
            isFetching: true,
            error: undefined,
          }));
          try {
            const data = await queryFn();
            query.setState((old) => ({
              ...old,
              status: 'success',
              lastUpdated: Date.now(),
              data,
            }));
          } catch (error) {
            query.setState((old) => ({
              ...old,
              status: 'error',
              error,
            }));
          } finally {
            query.promise = null;
            query.setState((old) => ({
              ...old,
              isFetching: false,
            }));
          }
        })();
      }

      return query.promise;
    },
  };

  return query;
}

function createQueryObserver(
  client,
  { queryKey, queryFn, staleTime = 0, cacheTime }
) {
  const query = client.getQuery({ queryKey, queryFn, cacheTime });

  const observer = {
    notify: () => {},
    getResult: () => query.state,
    subscribe: (callback) => {
      observer.notify = callback;
      const unsubscribe = query.subscribe(observer);

      observer.fetch();

      return unsubscribe;
    },
    fetch: () => {
      if (
        !query.state.lastUpdated ||
        Date.now() - query.state.lastUpdated > staleTime
      ) {
        query.fetch();
      }
    },
  };

  return observer;
}

export function ReactQueryDevtools() {
  const client = React.useContext(context);
  const [, rerender] = React.useReducer((i) => i + 1, 0);

  React.useEffect(() => {
    return client.subscribe(rerender);
  }, []);

  return (
    <DevtoolsContainer>
      {[...client.queries]
        .sort((a, b) => (a.queryHast - b.queryHash ? -1 : 1))
        .map((query) => {
          return (
            <Query key={query.queryHash}>
              {JSON.stringify(query.queryKey, null, 2)} —{' '}
              <span>
                {query.state.isFetching ? (
                  <StatusFetching>Fetching</StatusFetching>
                ) : !query.subscribers?.length ? (
                  <StatusInactive>Inactive</StatusInactive>
                ) : query.state.status === 'success' ? (
                  <StatusSuccess>Success</StatusSuccess>
                ) : query.state.status === 'error' ? (
                  <StatusError>Error</StatusError>
                ) : null}
              </span>
            </Query>
          );
        })}
    </DevtoolsContainer>
  );
}
