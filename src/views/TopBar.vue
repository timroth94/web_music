<template>
  <div
    class="info"
    v-show="showinfo"
  >
    <div
      class="info_back"
      @click="close"
    >
    </div>
    <div
      class="info_user"
      :style="{backgroundColor: color}"
    >
      <div class="info_top">
        <div class="info_top_back">
        </div>
        <div class="info_top_profile">
          <img
            class="avatar_info"
            :src="userinfo.Avatar"
            alt="头像"
          >
          <div>
            <p class="name">
              {{userinfo.Nickname}}
            </p>
            <div class="level">
              Lv {{userinfo.level}}
            </div>
          </div>
          {{userinfo.follow}} 关注 | {{userinfo.followed}} 粉丝
        </div>
      </div>
      <div class="info_main">
        <div class="info_main_back">

        </div>
      </div>

    </div>

  </div>
  <div
    class="top_bar"
    :style="{backgroundColor: color}"
  >
    <div class="top_serach">
      <el-input
        v-model="music.serachword"
        placeholder="搜索歌曲"
        @change="serachsong"
        clearable
        :prefix-icon="Search"
      />
      <div
        class="top_search_show"
        v-show="show_list"
      >
        <div class="serach">
          <template
            v-for="(item,index) in music.songlist"
            :key="index"
          >
            <div class="serach_list">
              <p @click="changesong(item)">{{item.name}}</p>
              <el-icon
                @click="add(item)"
                :size="20"
              >
                <CirclePlusFilled />
              </el-icon>
            </div>
            <div class="serach_list">
              <p style="font-size:10px">{{item.ar[0].name}}</p>
            </div>
          </template>
        </div>
      </div>

    </div>
    <button @click="clear">退出登录</button>
    <img
      class="avatar"
      @click="show"
      :src="userinfo.Avatar"
      alt="头像"
    >
  </div>

</template>

<script setup>
import { computed, onMounted, reactive, ref, nextTick, watch } from 'vue';
import request from "../api/index";
import qs from "qs"
import { List, Search } from '@element-plus/icons-vue'
import { useStore } from "vuex";
import { timestamp } from '@antfu/utils';
import { get } from 'lodash';
import {useRouter, useRoute} from 'vue-router'
const store = useStore()
const router = useRouter()

//初始化
const music = reactive({
  serachword: '',
  songlist: [],
})
const userinfo = reactive({
  Avatar: '',
  Nickname: '',
  level: 0,
  follow: 0,
  followed: 0,
})

const clear = () => {
  localStorage.cookie = '',
  localStorage.userId = '',
  router.push({path: '/Login'})
}



//测试
const showinfo = ref(false)
const close = () => {
  showinfo.value = false
}
const show = () => {
  showinfo.value = true
}


//color
const color = ref(computed(() => store.state.misc.color))

const tupian = ref('')
//获取用户信息
const getuserinfo = function () {
  request.getuserinfo(qs.stringify({
    uid: localStorage.userid,
    cookie: JSON.parse(localStorage.cookie)
  })).then(res => {
    userinfo.Nickname = res.data.profile.nickname
    userinfo.Avatar = res.data.profile.avatarUrl
    userinfo.level = res.data.level
    userinfo.follow = res.data.profile.follows
    userinfo.followed = res.data.profile.followeds
  })
}


onMounted(() => {
  getuserinfo()
});

//初始化搜索列表
const show_list = ref(false)
//定义搜方法
const serachsong = function () {
  if (music.serachword) {
    request
      .search({
        params: {
          keywords: music.serachword,
          limit: 10
        },
      })
      .then((res) => {
        music.songlist = res.data.result.songs;
        show_list.value = true
      });
  }
  else {
    show_list.value = false
  }
};


//点击替换当前歌曲
const changeSong = (item) => {
  localStorage.lastSongDetail = JSON.stringify(item)
  store.dispatch('misc/changeUrl2', item)
  request.geturl(qs.stringify({
    id: item.id,
    cookie: JSON.parse(localStorage.cookie),
    timestamp: new Date().getTime()
  })).then(res => {
    store.dispatch('misc/ChangeUrl', res.data.data[0].url)
  })
}
const add = item => {
  // store.dispatch('misc/addSong', item)
  // localStorage.List = JSON.stringify(store.state.misc.playingList)
}


</script>

<style lang="css" scoped>
.top_bar {
  position: relative;
  width: 100%;
  height: 4.375em;
}

.top_serach {
  position: relative;
  width: 31em;
  margin: 0px auto 0px;
  padding-top: 1.5em;
}

.serach {
  width: auto;
  height: auto;
  position: absolute;
  border-radius: 30px;
  z-index: 3;
}

.serach_list {
  color: aliceblue;
  width: 31em;
  background-color: rgba(76, 80, 108);
  opacity: 0.8;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.serach_list p {
  margin: 10px 10px;
}

.avatar {
  height: 50px;
  width: 50px;
  border-radius: 50%;
  position: absolute;
  top: 10px;
  right: 20px;
  z-index: 1;
  box-sizing: border-box;
}

.avatar:hover {
  cursor: pointer;
  border: 2px rgb(72, 158, 127) solid;
}

.info {
  position: fixed;
  height: 100%;
  width: 100%;
  z-index: 10;
}

.info_back {
  position: absolute;
  height: 100%;
  width: 100%;
  background-color: rgb(0, 0, 0);
  opacity: 0.6;
  z-index: 1;
}

.info_user {
  position: relative;
  box-shadow: 5px 5px 5px #888888;
  left: 25%;
  top: 15%;
  width: 50%;
  height: 70%;
  z-index: 2;
}
.name {
  display: inline-block;
  margin-right: 8px;
}
.avatar_info {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  margin-top: 10px;
}

.level {
  border-radius: 50%;
  background-color: silver;
  color: black;
  display: inline-block;
  font-size: 10px;
  padding: 2px;
  font-family: fantasy;
}
.info_top_back {
  position: absolute;
  left: 20%;
  top: 10px;
  width: 60%;
  height: 30%;
  border-radius: 10px;
  background-color: #888888;
}
.info_main_back {
  position: absolute;
  left: 10%;
  bottom: 10px;
  width: 80%;
  height: 65%;
  border-radius: 10px;
  background-color: #888888;
}

.info_top_profile {
  position: absolute;
  left: 45%;
  top: 10px;
}
</style>