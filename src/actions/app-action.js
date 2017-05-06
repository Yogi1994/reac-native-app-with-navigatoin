/**
 * @fileoverview Action creators for app.
 */

import axios from 'axios';
import * as types from '../constants/actionTypes';

const URL = 'https://jsonplaceholder.typicode.com';

export function retrieveImagesListSuccess(res) {
  return {
    type: types.RETRIEVE_IMAGE_LIST_SUCCESS,
    list: res.data
  };
}

export function retrieveImagesList(type, page) {
  return (dispatch) => {
    return axios.get(`${URL}/photos?_limit=20&_page=${page}`)
    .then(res => {
      dispatch(retrieveImagesListSuccess(res));
    })
    .catch(error => {
      console.log('Image List', error);
    });
  };
}
