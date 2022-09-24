<template>
  <div class="banner">
    <!-- 
      在carousel组件里面添加v-if是为了让其不在初始化还未将banner赋值时进行渲染
      (此行为会导致渲染一次carousel组件，因为此时banner为空，所以并不会显示内容，所以initial-index无论何值都不会起作用，
      因为dom会更新banner，但banner不会影响到carousel，只会影响到carousel-item)，
    虽然异步更新后banner的值进行了更新，并且虚拟dom也将banner渲染出来，因为虚拟dom没有认为carou组件进行了更新，所以空白的渲染还存在。
    空白部分仍需等到下次interval的时候才能让其不再次渲染出来
    -->
    <el-carousel
      v-if="banner[0]"
      :interval="5000"
      type="card"
      height="200px"
      :initial-index="0"
    >
      <el-carousel-item
        v-for="(item,index) in banner"
        :key="index"
      >
        <img
          :src="item.imageUrl"
          :alt="item.typeTitle"
          height="200"
          width="540"
        >
      </el-carousel-item>
    </el-carousel>
  </div>

</template>

<script setup>

import { nextTick, onMounted } from "@vue/runtime-core";
import request from "../api/index";
import { ref } from "vue";

const banner = ref([]);

onMounted(() => {
  request.getbanner({ params: { type: 0 } }).then((res) => {
    banner.value = res.data.banners
  })
})
</script>

<style lang="css" scoped>
.banner {
  position: relative;
  width: 1080px;
  margin: 10px auto 0;
}
</style>