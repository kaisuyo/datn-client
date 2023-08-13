import axios from 'axios'
import toastr from 'toastr'

const API = axios.create({
  // baseURL: 'https://doan.serve.own.vn',
  // baseURL: 'http://localhost:5000',
  withCredentials: true
})

toastr.options.closeButton = true;

export default API