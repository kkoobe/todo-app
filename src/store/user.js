const state={
  username:window.localStorage.getItem('username'),
  token:window.localStorage.getItem('token'),
  id:''
}
const mutations={
  SET_TOKEN(state,{token,username,id}){
    state.token=token
    state.username=username
    state.id=id
    window.localStorage.setItem('token',token)
    window.localStorage.setItem('username',username);
  },
  SET_INIT(state){
    state.username='',
    state.token='',
    state.id='',
    window.localStorage.setItem('username','');
    window.localStorage.setItem('token','');
  }
}
export default {
  state,
  mutations,
  namespaced:true
}
