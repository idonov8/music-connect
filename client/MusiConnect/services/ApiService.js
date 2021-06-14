import axios from 'axios';
import { SERVER_URL } from '../Consts';

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

const getLinks =  songUrl => axios.get(
    SERVER_URL,
    {params: {url: songUrl}}
  ).then(result => {
    const links = result.data.linksByPlatform
    return Object.keys(links).map(service => [ service, links[service].url ])
  }).catch(error => console.log(error))

export const apiService = {
    getLinks
}