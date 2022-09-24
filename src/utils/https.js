import axios from 'axios'

const baseURL = 'http://101.43.85.231:16300/'
const instance = axios.create({
  baseURL,
  timeout: 60000,
})

instance.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded'

export default instance