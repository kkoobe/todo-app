import axios from 'axios';
/**
 * @登录api
 * params传入参数
 * 返回值：data数据；
*/
export const requestLogin = params => {
  return axios.post(`/login`, params).then(res =>{
     return JSON.parse(res.data)});
};

export const getTodoList = params => {
  return axios.get(`/todo/list`, {
    params: params
  });
};

export const getTodo = params => {
  return axios.get(`/todo/listId`, {
    params: params
  });
};

export const addRecord = params => {
  return axios.post(`/todo/addRecord`, params).then(res => res.data);
};

export const editTodo = params => {
  return axios.post(`/todo/editTodo`, params).then(res => res.data);
};
export const editRecord = params => {
  return axios.post(`/todo/editRecord`, params).then(res => res.data);
};

export const addTodo = params => {
  return axios.post(`/todo/addTodo`, params).then(res => res.data);
};
export const reqLogin = params => {
  return axios.post(`/login`, params).then(res =>{
  return res.data });
};
export const reqRegister = params => {
  return axios.post(`/register`, params).then(res =>{
  return res.data });
};

// export const editUser = params => { return axios.get(`${base}/user/edit`, { params: params }); };

// export const addUser = params => { return axios.get(`${base}/user/add`, { params: params }); };
