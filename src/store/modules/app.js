import Cookies from 'js-cookie';

const app = {
  state: {
    sidebar: {
      opened: !+Cookies.get('sidebarStatus')
    },
    theme: 'default',
    livenewsChannels: Cookies.get('livenewsChannels') || '[]',
    feedbackFaqs: [],
    choose: {}
  },
  mutations: {
    TOGGLE_SIDEBAR: state => {
      if (state.sidebar.opened) {
        Cookies.set('sidebarStatus', 1);
      } else {
        Cookies.set('sidebarStatus', 0);
      }
      state.sidebar.opened = !state.sidebar.opened;
    },
    GET_FEEDBACK_FAQS: (state, result) => {
      state.feedbackFaqs = result
    },
    CHOOSE_RESULT: (state, result) => {
      state.choose = result
    }
  },
  actions: {
    ToggleSideBar: ({ commit }) => {
      commit('TOGGLE_SIDEBAR')
    },
    setTheme: ({ commit }, bool) => {
      Cookies.set('theme', bool)
      document.body.className = bool ? '' : 'custom-theme'
    },
    getFeedbackFaqs: ({ commit }, result) => {
      commit('GET_FEEDBACK_FAQS', result)
    },
    chooseResult: ({ commit }, result) => { // 组件选择结果
      commit('CHOOSE_RESULT', result)
    }
  }
};

export default app;
