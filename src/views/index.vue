<template>
  <p>{{ data.count }}</p>
  <el-button @click="dec">-</el-button>
  <el-button @click="inc">+</el-button>
</template>

<script setup>
import { computed, reactive } from 'vue'
import { useStore } from 'vuex'
import api from '@/api'

const store = useStore()

const data = reactive({
  count: computed(() => store.state.count.count),
})

const dec = () => {
  store.dispatch('count/decrement')
}

const inc = () => {
  store.dispatch('count/increment')
}

// const getCatList = () => {
//   api.catList().then(res => {
//     console.log(res)
//   })
// }

// getCatList()
</script>

<style></style>
