import Axios from 'axios';
import { SERVER_URL, API_TIMEOUT } from '../Consts';

const METHODS = {
  POST: 'POST',
  GET: 'GET',
  DELETE: 'DELETE',
  PUT: 'PUT'
};

const apiCall = (method, url, data=undefined, config={}) => Axios({
  method,
  url,
  data,
  ...config
})

const getLinks = (songUrl) => apiCall(
    METHODS.GET,
    SERVER_URL,
    {url: songUrl}
)

export const apiService = {
    getLinks
}