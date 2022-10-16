<template>
    <!-- <button @click="check">登录</button> -->
    <button @click="getcode">点击获取二维码</button>
    <img
      :src="tupian"
      alt="二维码"
    >
</template>

<script setup>
import { computed, onMounted, reactive, ref, nextTick, watch } from 'vue';
import {useRouter, useRoute} from 'vue-router'
import request from "../api/index";
import qs from "qs"
import { fromJSON } from 'postcss';

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
            localStorage.userId = res.data.account.id
            router.push({path: '/'})
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

</style>