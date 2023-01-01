<template>
  <div
    class="container"
    :style='{backgroundColor: color_shower}'
  >
  </div>
  <div
    v-show="lyric_show"
    :class="[lyric_show ? 'up' : '']"
    style="position:absolute;top: 0;width: 100%;height: 100%;z-index: 4;
    background-color: gray;"
  >
    <div
      class="lyric"
      :style="{backgroundImage:`url(${picUrl})`}"
    ></div>
    <div class="lyric_show">
      <div style="display:flex">
        <el-button
          type="info"
          round
          @click="close"
          style="margin:20px 20px;position: absolute; right: 0;"
        >Close</el-button>
      </div>
      <!-- 专辑封面 -->
      <div :class="[onModel ? 'focusModel' : 'album']">

        <img
          :src="picUrl"
          :class="[albumRotate ? 'rotate' : 'pauserotate']"
          alt="专辑封面"
          :width="albumsize.width"
          :height="albumsize.height"
        >
      </div>
      <!-- 歌词 -->
      <div :class="[onModel ? 'onModelLyric' : 'Lyric']">
        <template
          v-for="(item,index) in init_lyric"
          :key="index"
        >
          <div
            :style="{color: `${store.state.misc.color}`}"
            class="lyric_shadow"
          >
            <p
              :style="{transform:`translateY(${ size + 'px'})`}"
              :class="[onModel ? 'changefont' : '',(index === nowindex) ? 'lyricstyle' : '']"
            >{{item.text}}</p>
          </div>
        </template>
      </div>
      <div
        class="comment"
        v-if="onModel"
      >
        <template
          v-for="(item,index) in comment"
          :key="index"
        >
          <p>{{item.content}}</p>
        </template>
      </div>
    </div>
  </div>
  <!-- 音频文件 -->
  <audio
    ref="music"
    :volume="volumecontrol"
    :loop="false"
  >
    <source :src="playingListUrl">
  </audio>
  <!--播放进度条-->
  <div :class="[onModel ? 'music-control-focus' : 'music-control']">
    <!-- 进度条 -->
    <div class="slider-demo-block">
      <!--左侧时间-->
      <p>{{ starttime }}</p>
      <el-slider
        style="touch-action: none;"
        v-model="timecontrol"
        :max="timemax"
        :show-tooltip="false"
        @change="settime"
      />
      <!--右侧时间-->
      <p>{{ endtime }}</p>
    </div>
    <!--控制播放按钮-->
    <div class="slider-demo-block">
      <!-- 音量 -->
      <el-icon
        @click="showVolume"
        :size="30"
      >
        <BellFilled />
      </el-icon>
      <!-- 单曲循环 -->
      <el-icon
        @click="single"
        :size="30"
      >
        <RefreshLeft />
      </el-icon>
      <!-- 上一首 -->
      <svg
        xmlns="http://www.w3.org/2000/svg"
        xmlns:xlink="http://www.w3.org/1999/xlink"
        aria-hidden="true"
        role="img"
        class="iconify iconify--bytesize"
        width="30"
        height="30"
        preserveAspectRatio="xMidYMid meet"
        viewBox="0 0 32 32"
        @click="preSong"
      >
        <path
          fill="none"
          stroke="currentColor"
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="m10 0 v32 m0 -16l22 -16v32z"
        ></path>
      </svg>
      <!-- 播放按钮 -->
      <el-icon
        @click="play"
        class="playpause"
        :size="30"
        v-show="!iconstatu"
      >
        <VideoPlay />
      </el-icon>
      <!-- 暂停按钮 -->
      <el-icon
        @click="pause"
        class="playpause"
        :size="30"
        v-show="iconstatu"
      >
        <VideoPause />
      </el-icon>
      <!-- 下一首 -->
      <svg
        width="30"
        height="30"
        preserveAspectRatio="xMidYMid meet"
        viewBox="0 0 32 32"
        @click="nextSong"
      >
        <path
          fill="none"
          stroke="currentcolor"
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="m16 2 l14 14 l-14 14 V 16 L2 30 V2 l14 14 Z"
        ></path>

      </svg>
      <!-- 本地歌单 -->
      <el-icon
        @click="showList"
        :size="30"
      >
        <DocumentCopy />
      </el-icon>
      <el-color-picker
        v-model="color_picker"
        show-alpha
        :active-change="Color(color_picker)"
      />
      <!-- <button
        v-show="onModel"
        @click="show"
      >左查看</button> -->
      <svg
        xmlns="http://www.w3.org/2000/svg"
        xmlns:xlink="http://www.w3.org/1999/xlink"
        aria-hidden="true"
        role="img"
        class="iconify iconify--bytesize"
        width="30"
        height="30"
        preserveAspectRatio="xMidYMid meet"
        viewBox="0 0 32 32"
        v-show="lyric_show"
        @click="exspandScreen"
      >
        <path
          fill="none"
          stroke="currentColor"
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M4 12V4h8m8 0h8v8M4 20v8h8m16-8v8h-8"
        ></path>
      </svg>
      <button @click="check">测试</button>
    </div>
    <!-- 音量键，初始值为50音量 -->
    <el-slider
      v-if="volumeShow"
      v-model="volumecontrol"
      :max="1"
      :step="0.01"
      :show-tooltip="false"
      vertical
      class="volume"
    />
    <el-drawer
      v-model="drawer"
      :show-close="false"
      :title="listtitle"
      direction="ltr"
    >
      <div v-if="showingList.length > 0">
        <template
          v-for="item in showingList"
          :key="item.id"
        >
          <div style="display:flex;align-items: center;justify-content: space-between;">

            <div>
              <p @click="changeSong(item)">{{item.name}}</p>
              <p>{{item.ar[0].name}}</p>
            </div>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              xmlns:xlink="http://www.w3.org/1999/xlink"
              aria-hidden="true"
              role="img"
              class="iconify iconify--bytesize"
              width="30"
              height="30"
              preserveAspectRatio="xMidYMid meet"
              viewBox="0 0 32 32"
              @click="unLike(item)"
              style="cursor: pointer;"
            >
              <path
                fill="rgba(216, 48, 18, 1)"
                stroke="currentColor"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="1"
                d="M4 16C1 12 2 6 7 4s8 2 9 4c1-2 5-6 10-4s5 8 2 12s-12 12-12 12s-9-8-12-12Z"
              ></path>
            </svg>
          </div>
        </template>
        <div style="position: relative;bottom: 0px;width: 322px;margin: 0px auto;">
          <el-pagination
            small
            background
            layout="prev, pager, next"
            :total="totalSong"
            v-model:current-page="page"
          />
        </div>
      </div>
      <div v-else>
        <p>请添加歌曲</p>
      </div>
    </el-drawer>
  </div>
</template>

<script setup>
import { reactive, ref } from "@vue/reactivity";
import { computed, nextTick, onMounted, watch, onUnmounted, onUpdated, onBeforeUpdate, } from "@vue/runtime-core";
import { findLastKey, reduce } from "lodash";
import { useStore } from "vuex";
import request from "../api/index";
import qs from "qs"



//实例化store
const store = useStore()


//专辑大小的调整
const onModel = ref(false)
const albumsize = reactive({
  width: 400,
  height: 400
})


//歌词
const lyric = function (id) {
  request
    .getlyric({
      params: {
        id,
      },
    })
    .then((res) => {
      const mid_lyric = ref([]);
      mid_lyric.value = res.data.lrc.lyric.trim().split(/\n/);
      formatlyric(mid_lyric.value);
    });
};

//歌曲评论
const comment = ref([])
const getcomment = function (id) {
  request.getComment(qs.stringify({
    id: id,
    cookie: JSON.parse(localStorage.cookie),
    timestamp: new Date().getTime()
  })).then(res => {
    comment.value = res.data.hotComments
  })
}


//当前播放index
const init_num = ref(0)

//歌曲url和专辑url
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
//以防在dom更新时src未变化导致歌词未加载,以及在首次挂载前将歌词进行请求并挂载
// changeSong(JSON.parse(localStorage.lastSongDetail))


//dom获取audio Tag
const tag = document.getElementsByTagName("audio");

//播放暂停图标


const iconstatu = ref(false)
//COLOR
const color_picker = ref(localStorage.local_color)
const Color = (color_picker) => {
  localStorage.local_color = color_picker
  store.dispatch('misc/changecolor', color_picker)
}
const color_shower = ref(computed(() => store.state.misc.color))

//歌词显示
const Element = document.documentElement
const lyric_show = ref(false)
const check = () => {
  lyric_show.value = true
}
const buttonControl = ref(false)
const close = () => {
  if (buttonControl.value) {
    document.exitFullscreen()
    albumsize.width = 400
    albumsize.height = 400
    onModel.value = false
    size.value = 147.2 + nowindex.value * basicValue.value
    buttonControl.value = false
  }
  else {
    lyric_show.value = false
  }
}
const exspandScreen = () => {
  onModel.value = true
  albumsize.width = 500
  albumsize.height = 500
  size.value = 220.8 + nowindex.value * basicValue.value
  if (Element.requestFullscreen) {
    Element.requestFullscreen()
    buttonControl.value = true
  }
}

//定义音频的url
const playingListUrl = ref(computed(() => store.state.misc.musicUrl))
//观察url的改变,触发重新加载
watch(playingListUrl, () => {
  tag[0].load();
  lyric(store.state.misc.musicId)
  getcomment(store.state.misc.musicId)
  resetlyric()
  play()
})


//歌单
const page = ref(1)
const playList = ref([])
const showingList = ref(computed(() => playList.value.slice((page.value - 1) * 10, page.value * 10)
))
const drawer = ref(false)


//初始化获取歌单
const totalSong = ref(0)
const list = ref(computed(() => store.state.misc.list))
const listtitle = ref(computed(() => store.state.misc.list.name))

watch(list, (newval) => {
  getlistdetail(newval.id)
  localStorage.list = JSON.stringify(store.state.misc.list)
})

const getlistdetail = function () {
  request.getlistdetail(qs.stringify({
    id: list.value.id,
    cookie: JSON.parse(localStorage.cookie),
    timestamp: new Date().getTime()
  })).then(res => {
    totalSong.value = res.data.songs.length
    playList.value = res.data.songs
  })
}

//定义专辑的url
const picUrl = ref(computed(() => store.state.misc.picUrl))
//控制音量大小
const volumecontrol = ref(0.5);
//播放/暂停键
const albumRotate = ref(false)
// const rotate = ref(0)
//播放歌曲
const play = () => {
  tag[0].play()
};
//暂停歌曲
const pause = () => {
  tag[0].pause();
}
//播放进度条
const timecontrol = ref(0);
const timemax = ref(0);
const starttime = ref("00:00");
const endtime = ref("00:00");
//设置歌曲跳转
const settime = (val) => {
  tag[0].currentTime = val
  for (let i = 0; i < init_lyric.value.length; i++) {
    if (val - init_lyric.value[i].time < 0) {
      nowindex.value = i - 1
      break;
    }
    else {
      nowindex.value = init_lyric.value.length - 1
    }
  }
}

//取消爱心歌曲
const unLike = (item) => {
  request.unLike(qs.stringify({
    id: item.id,
    like: false,
    cookie: JSON.parse(localStorage.cookie),
    timestamp: new Date().getTime()
  })).then(res => {
    if (res.data.code == 200) {
      playList.value.splice(playList.value.indexOf(item), 1)
    }
  })
}

//显示volume
const volumeShow = ref(false)
const showVolume = () => volumeShow.value = !volumeShow.value
const showList = () => {
  drawer.value = true
}
//定义歌词
const init_lyric = ref([])
//重置歌词
const resetlyric = function () {
  init_lyric.value = []
}
//格式化歌词的格式
const formatlyric = function (item) {
  for (let i of item) {
    const lyricobj = ref({ text: '', time: 0 });
    lyricobj.value.text = i.split(']')[1];
    if (lyricobj.value.text != "") {
      const tep_time = i.split(']')[0].split('[')[1]
      lyricobj.value.time = tep_time.split(':')[0] * 60 + tep_time.split(':')[1].split('.')[0] * 1
      init_lyric.value.push(lyricobj.value)
    }
  }
};
//格式化右侧时间
const formattime = (time) => {
  switch (true) {
    case time < 10:
      endtime.value = "00:0" + time;
      break;
    case time >= 10 && time < 60:
      endtime.value = "00:" + time;
      break;
    case time >= 60:
      endtime.value =
        "0" +
        parseInt(time / 60) +
        ":" +
        (time % 60 < 10 ? "0" + (time % 60) : time % 60);
      break;
  }
};
//格式化左侧时间
const formatTime = (time) => {
  switch (true) {
    case time < 10:
      starttime.value = "00:0" + time;
      break;
    case time >= 10 && time < 60:
      starttime.value = "00:" + time;
      break;
    case time >= 60:
      starttime.value =
        "0" +
        parseInt(time / 60) +
        ":" +
        (time % 60 < 10 ? "0" + (time % 60) : time % 60);
      break;
  }
};
//歌词滚动参数
const nowindex = ref(0)
const basicValue = ref(-36.8)
const size = ref(147.2)
watch(nowindex, () => {
  if (onModel.value) {
    size.value = 220.8 + nowindex.value * basicValue.value
  }
  else {
    size.value = 147.2 + nowindex.value * basicValue.value
  }
})



//挂载初始化
onMounted(() => {
  nextTick(() => {
    tag[0].ondurationchange = () => {
      timemax.value = parseInt(tag[0].duration.toFixed(0));
      formattime(timemax.value);
    };
    tag[0].ontimeupdate = () => {
      timecontrol.value = tag[0].currentTime;
      if (timecontrol.value == 0) {
        nowindex.value = 0
      }
      formatTime(parseInt(tag[0].currentTime.toFixed(0)));
      if (nowindex.value < init_lyric.value.length - 1) {
        if (timecontrol.value > init_lyric.value[nowindex.value + 1].time) {
          nowindex.value = nowindex.value + 1
        }
      }
      if (tag[0].ended) {
        nextSong()
      }
      if (tag[0].paused) {
        iconstatu.value = false
        albumRotate.value = false
      }
      else {
        iconstatu.value = true
        albumRotate.value = true
      }
    }
  });
});

//播放模式切换
const single = () => (tag[0].loop = !tag[0].loop);
//上一曲
const preSong = function () {
  init_num.value -= 1
  changeSong(playList.value[init_num.value])
}
//下一曲
const nextSong = function () {
  init_num.value += 1
  changeSong(playList.value[init_num.value])
}
//删除歌曲
const deletesong = (item) => {
  store.dispatch('misc/deleteSong', item)
  nextSong()
}
</script>

<style lang="css" scoped>
.music-control {
  width: 100%;
  height: auto;
  position: fixed;
  bottom: 0px;
  z-index: 5;
}


.music-control-focus {
  width: 100%;
  height: auto;
  position: fixed;
  bottom: -83px;
  z-index: 5;
}

.music-control-focus:hover{
  bottom: 0px;
}

.music-control-focus .slider-demo-block:nth-child(1) {
  justify-content: space-around;
  align-items: center;
  position: relative;
  bottom: 0px;
  width: 20%;
  margin: 0px 0 25px;
}

.music-control-focus .slider-demo-block:nth-child(1),
.volume {
  display: flex;
  left: 40%;
  right: 40%;
}

.music-control-focus .slider-demo-block:nth-child(2) {
  color: aliceblue;
  display: flex;
}

.music-control-focus .slider-demo-block:nth-child(2) {
  z-index: 3;
  position: relative;
  bottom: 0;
  width: 30%;
  margin: 0 auto;
  justify-content: space-around;
}


.music-control .slider-demo-block:nth-child(1) {
  justify-content: space-around;
  align-items: center;
  position: relative;
  bottom: 0px;
  width: 20%;
  margin: 0px 0 25px;
}

.music-control .slider-demo-block:nth-child(1),
.volume {
  display: flex;
  left: 40%;
  right: 40%;
}

.music-control .slider-demo-block:nth-child(2) {
  color: aliceblue;
  display: flex;
}

.music-control .slider-demo-block:nth-child(2) {
  z-index: 3;
  position: relative;
  bottom: 0;
  width: 30%;
  margin: 0 auto;
  justify-content: space-around;
}

.slider-demo-block p {
  margin: 0 15px;
}

.volume {
  height: 100px;
  left: 35%;
  width: 30px;
  position: fixed;
  bottom: 45px;
  flex-direction: column;
}

.album {
  margin: 50px auto 0px;
  width: 400px;
  height: 400px;
  border-radius: 200px;
  overflow: hidden;
}

.focusModel {
  position: absolute;
  top: 50%;
  left: 5%;
  width: 500px;
  height: 500px;
  overflow: hidden;
  border-radius: 250px;
}

.Lyric {
  margin-top: 30px;
  height: 394.4px;
  overflow: scroll;
  text-align: center;
}

.onModelLyric {
  position: relative;
  top: 250px;
  margin-top: 30px;
  height: 541.6px;
  width: auto;
  overflow: scroll;
  text-align: center;
}

.changefont {
  font-size: 20px;
}

.lyricstyle {
  font-size: 30px;
  color: rgb(235, 228, 228);
}

.playpause {
  margin: 0px 30px;
}

.rotate {
  align-self: center;
  transform: rotate(0deg);
  animation: getrotate 24s infinite linear;
  animation-play-state: running;
}
.resetR {
  animation: getrotate 24s infinite linear;
  animation-play-state: revert;
}
.pauserotate {
  animation: getrotate 24s infinite linear;
  animation-play-state: paused;
}

@keyframes getrotate {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.lyric {
  position: fixed;
  top: 0;
  width: 100%;
  height: 100%;
  z-index: 3;
  opacity: 0.5;
  filter: blur(30px);
  background-size: 100% 100%;
}

.lyric_show {
  position: relative;
  z-index: 5;
}

#image {
  width: 500px;
  height: 500px;
}

.container {
  width: 100%;
  height: 32px;
  position: fixed;
  bottom: 0;
  z-index: -10;
}
.lyric_shadow {
  text-shadow: 1px 1px 1px gray;
}
.up {
  animation: goup 0.3s linear;
}

@keyframes goup {
  from {
    transform: translateY(100%);
  }
  to {
    transform: translateY(0%);
  }
}

div :deep(.el-tooltip__trigger) {
  touch-action: none;
}
.comment {
  width: 500px;
  height: 500px;
  overflow: scroll;
  position: absolute;
  top: 300px;
  right: 100px;
}
.comment::-webkit-scrollbar {
  display: none;
}
.onModelLyric::-webkit-scrollbar {
  display: none;
}
.Lyric::-webkit-scrollbar {
  display: none;
}
</style>