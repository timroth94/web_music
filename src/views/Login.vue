<template>
  <div :class="[tupian ? 'login_img ':'']">
    <img v-if="tupian" :src="tupian" alt="二维码" height="180" width="180">
  </div>
  <div class="login_button">
    <button @click="getcode">点击获取登陆二维码</button>
  </div>
  <svg height="1044" width="2048">
    <path d="M0 0 H 800 L 0 400 Z" fill="rgb(0,110,7)" fill-opacity="0.5"></path>
    <path d="M 800 0 L 2048 0 V 644 L 1248 1044 H -800 L 0 400" fill="rgb(174,20,20)" fill-opacity="0.5"></path>
    <path d="M2048 644 L 2048 1044 H 1248" fill="blue" fill-opacity="0.5"></path>
  </svg>
</template>

<script setup>
import { computed, onMounted, reactive, ref, nextTick, watch } from 'vue';
import { useRouter, useRoute } from 'vue-router'
import request from "../api/index";
import qs from "qs"

const router = useRouter()

const tupian = ref('')

//获取二维码并扫描登录
const getcode = function () {
  request.getunicode(qs.stringify({
    timestamp: new Date().getTime()
  })).then(res => {
    request.creatunicode(qs.stringify({
      key: res.data.data.unikey,
      qrimg: true,
      timestamp: new Date().getTime()
    })).then(res => {
      tupian.value = res.data.data.qrimg
    });
    const timer = setInterval(() => {
      request.qrcodestatu(qs.stringify({
        key: res.data.data.unikey,
        timestamp: new Date().getTime()
      })).then(res => {
        console.log(res);
        if (res.data.code == 803) {
          clearInterval(timer)
          localStorage.cookie = JSON.stringify(res.data.cookie)
          request.getaccountinfo(qs.stringify({
            cookie: JSON.parse(localStorage.cookie)
          })).then(res => {
            localStorage.userid = res.data.account.id
            router.push({ path: '/' })
          })
        }
      }
      )
    }, 10000)
  }
  )
}





</script>

<style lang="css" scoped>
.login_button {
  position: fixed;
  top: 55%;
  left: 48%;
}

.login_img {
  border: 2px solid grey;
  box-shadow: 2px 3px;
  position: fixed;
  top: 35%;
  left: 47%;
}
</style>