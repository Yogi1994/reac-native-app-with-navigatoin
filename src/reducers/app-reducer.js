/**
 * @fileoverview The reducer for the app.
 */

const initialState = {};

import * as types from '../constants/actionTypes';

export const appReducer = (state = initialState, action) => {
  console.log(action);
  switch (action.type) {
    case types.RETRIEVE_IMAGE_LIST_SUCCESS:
      return {
        ...state,
        list: action.list
      };
    default:
      return state;
  }
};
