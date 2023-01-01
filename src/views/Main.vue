<template>
  <div class="outer">
    <template
      v-for="(item,index) in userList"
      :key="index"
    >
      <div class="list_item">
        <div>
          <p class="txt">{{item.name}}</p>
          <img
            class="img"
            :src="item.coverImgUrl"
            @click="changeList(item)"
            v-on:mousedown="listDown(index)"
            v-on:mouseup="listUp(index)"
          />
        </div>
      </div>
    </template>
  </div>

</template>

<script setup>
import { onMounted, reactive, ref } from 'vue';
import request from "../api/index";
import qs from 'qs'
import { useStore } from "vuex";

//初始化VUEX
const store = useStore()

//初始化歌单
const userList = ref([])

//获取用户歌单
const getuserlist = function () {
  request.getuserlist(qs.stringify({
    uid: localStorage.userid,
    cookie: JSON.parse(localStorage.cookie)
  })).then(res => {
    userList.value = res.data.playlist
  })
}
//歌单
const tag = document.getElementsByClassName('img')
const listUp = (index) => {
  tag[index].style.boxShadow = ''
  tag[index].style.transform = ''
}
const listDown = (index) => {
  tag[index].style.boxShadow = 'none'
  tag[index].style.transform = 'translateY(2px)'
}

const changeList = (item) => {
  store.dispatch('misc/changelist', item)
}

//挂载获取歌单
onMounted(() => {
  getuserlist()
})

</script>

<style lang="css" scoped>
.outer {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-around;
}

.txt {
  text-align: center;
}

.img {
  height: 300px;
  width: 300px;
  border-radius: 50%;
}

.img:hover {
  box-shadow: 3px 5px 5px gray;
}
</style>