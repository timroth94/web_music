import { Store } from "vuex"

const state = {
  musicUrl: '',
  musicId: 0,
  picUrl: '',
  iconStatu: false,
  color: 'rgba(47, 141, 141, 1)',
  list: '',
}

const mutations = {

  changeUrl2(state, item) {
    state.musicId = item.id
    state.picUrl = item.al.picUrl
  },

  ChangeUrl(state, item) {
    state.musicUrl = item
  },

  changeColor(state, item) {
    state.color = item
  },

  changelist(state, item) {
    state.list = item
  }
  ,
  addSong(state, item) {
    if (state.playingList.indexOf(item) < 0) {
      state.playingList.push(item)
    }
  },

  deleteSong(state, item) {
    state.currentIndex = state.playingList.indexOf(item) - 1
    localStorage.init_index = state.currentIndex
    state.playingList.splice(state.playingList.indexOf(item), 1)
  },

  replaceList(state, item) {
    state.playingList = item
  },
}

const actions = {
  addSong: ({ commit }, item) => commit('addSong', item),
  changeUrl2: ({ commit }, item) => commit('changeUrl2', item),
  deleteSong: ({ commit }, item) => commit('deleteSong', item),
  replaceList: ({ commit }, item) => commit('replaceList', item),
  changecolor: ({ commit }, item) => commit('changeColor', item),
  ChangeUrl: ({ commit }, item) => commit('ChangeUrl', item),
  changelist: ({ commit }, item) => commit('changelist', item)
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}