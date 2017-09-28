import Cookies from 'js-cookie';
import Request from 'utils/request';
import AdminRequest from 'utils/AdminRequest'
import CMSRequest from 'utils/CMSRequest'
import { APP_TOKEN_KEY } from 'config/app'
import MD5 from 'utils/md5'
 
const user = {
  state: {
    user: '',
    uid: undefined,
    user_level: '',
    token: Cookies.get('Admin-Token'),
    name: '',
    roles: []
  },

  mutations: {
    SET_USER_LEVEL: (state, level) => {
      state.user_level = level;
    },
    SET_TOKEN: (state, token) => {
      state.token = token;
    },
    SET_UID: (state, uid) => {
      state.uid = uid;
    },
    SET_NAME: (state, name) => {
      state.name = name;
    },
    SET_ROLES: (state, roles) => {
      state.roles = roles;
    },
    LOGIN_SUCCESS: () => {
      console.log('login success')
    },
    LOGOUT_USER: state => {
      state.user = '';
    }
  },

  actions: {
    // 邮箱登录
    async LoginByEmail({ commit }, userInfo) {
      let _event = {
        methods: 'sign',
        class: 'user',
        comment: '用户' + userInfo.email + '登录'
      }
      const email = userInfo.email;
      let password = MD5(userInfo.password)
      try {
        let params = {
          url: '/admin/sign-in',
          data: {
            username: userInfo.email,
            pass: password
          }
        }
        let data = await AdminRequest.post(params, _event)
        
        Cookies.set(APP_TOKEN_KEY, data.token);
        commit('SET_TOKEN', data.token);
        commit('SET_USER_LEVEL', data.level);
        commit('SET_NAME', data.name);
        commit('SET_UID', data.id);
        Cookies.set('_cms_uid', data.id);
        return Promise.resolve(data)
      } catch (err) {
        return Promise.reject(err)
      }
    },


    // 获取用户信息
    async GetInfo({ commit, state }) {
      let _event = {
          methods: 'pull',
          class: 'checkUser',
          comment: '拉取当前登录用户信息'
        }
      try {
        let params = {
          url: '/admin/admin-info',
          data: {
            id: Cookies.get('_cms_uid')
          }
        }
        let data = await CMSRequest.get(params, _event)
        switch (data.level) {
          case 1:
            commit('SET_ROLES', ['super_admin']);
            break;
          case 2:
            commit('SET_ROLES', ['admin']);
            break;
          case 3:
            commit('SET_ROLES', ['operations']);
            break;
        } 
        commit('SET_NAME', data.name);
        
        return Promise.resolve(data)
      } catch (err) {
        return Promise.reject(err)
      }
    },

    // 登出
    LogOut({ commit, state }) {
      return new Promise(resolve => {
        commit('SET_TOKEN', '');
        commit('SET_ROLES', []);
        Cookies.remove(APP_TOKEN_KEY);
        resolve();
      });
    },

    // 前端 登出
    FedLogOut({ commit }) {
      return new Promise(resolve => {
        commit('SET_TOKEN', '');
        Cookies.remove(APP_TOKEN_KEY);
        resolve();
      });
    }
  }
};

export default user;
