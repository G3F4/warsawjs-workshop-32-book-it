import React, { useEffect, useReducer } from 'react';
import tinyParams from 'tiny-params';
import AccommodationDetails from './AccommodationDetails';

const API_HOST = 'https://warsawjs-workshop-32-book-it-m.herokuapp.com';

const detailsReducer = (state, action) => {
  switch (action.type) {
    case 'DETAILS_FETCH_INIT':
      return {
        ...state,
        fetching: true,
        errors: null
      };
    case 'DETAILS_FETCH_SUCCESS':
      return {
        ...state,
        fetching: false,
        errors: false,
        data: action.payload,
      };
    case 'DETAILS_FETCH_FAILURE':
      return {
        ...state,
        data: null,
        fetching: false,
        errors: action.payload,
      };
    default:
      throw new Error();
  }
};

const AccommodationDetailsConnect = (props) => {
  const [state, dispatch] = useReducer(detailsReducer, {
    data: null,
    fetching: true,
    errors: null,
  });
  const { id } = tinyParams(window.location.href);
  const params = `?id=${id}`;

  useEffect(() => {
    const fetchData = async () => {
      dispatch({ type: 'DETAILS_FETCH_INIT' });

      try {
        const result = await fetch(`${API_HOST}/details${params}`);
        const { data } = await result.json();

        dispatch({ type: 'DETAILS_FETCH_SUCCESS', payload: data });
      } catch (error) {
        dispatch({ type: 'DETAILS_FETCH_FAILURE', payload: error.message });
      }
    };

    fetchData();
  }, [params]);

  return (
    <AccommodationDetails {...state} {...props} />
  );
};

export default AccommodationDetailsConnect;
