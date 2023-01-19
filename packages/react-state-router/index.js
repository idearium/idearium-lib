'use client';

import {
    cloneElement,
    isValidElement,
    useContext,
    useEffect,
    useMemo,
    useState,
} from 'react';

const StateRouter = ({ children, context }) => {
    const { service } = useContext(context);
    const [serviceState, setServiceState] = useState({});
    const kids = useMemo(
        () => (Array.isArray(children) ? children : [children]),
        [children]
    );

    useEffect(() => service.subscribe(setServiceState).unsubscribe, [service]);

    const views = useMemo(
        () =>
            serviceState && serviceState.matches
                ? kids
                      .filter((child) => isValidElement(child))
                      .filter((view) =>
                          view.props.when
                              ? serviceState.matches(view.props.when)
                              : true
                      )
                : [],
        [kids, serviceState]
    );

    return views.length
        ? views.map((view, index) => {
              if (view.props.when) {
                  return cloneElement(
                      view,
                      {
                          service,
                          context: serviceState.context,
                          key: index,
                          send: service.send,
                      },
                      null
                  );
              }

              return view;
          })
        : null;
};

export default StateRouter;
