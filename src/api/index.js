import axios from '@/utils/https'


const request = {

  //搜索歌曲
  search: (params) => axios.get('/cloudsearch', params),
  //获取banner
  getbanner: (params) => axios.get('/banner', params),
  //获取歌词
  getlyric: (params) => axios.get('/lyric', params),
  //获取所有排行榜
  getboard: () => axios.get('/toplist'),
  //获取排行榜详情
  getboarddetail: (params) => axios.get('/playlist/detail', params),
  //验证码
  Denglu: (data) => axios.post('/captcha/sent', data),
  //登录(手机号)
  getcode: (data) => axios.post('/captcha/verify', data),
  //登录状态
  checkstatu: (data) => axios.post('/login/status', data),
  //登录(二维码)
  getunicode: (data) => axios.post('/login/qr/key', data),
  //生成二维码
  creatunicode: (data) => axios.post('/login/qr/create', data),
  //检测二维码扫描状态
  qrcodestatu: (data) => axios.post('/login/qr/check', data),
  //获取账号信息
  getaccountinfo: (data) => axios.post('/user/account', data),
  //获取用户详情
  getuserinfo: (data) => axios.post('/user/detail', data),
  //获取用户歌单
  getuserlist: (data) => axios.post('/user/playlist', data),
  //获取歌单详情
  getlistdetail: (data) => axios.post('/playlist/track/all', data),
  //获取音乐Url
  geturl: (data) => axios.post('/song/url', data),
  //取消收藏
  unLike: (data) => axios.post('/like', data),
  //获取歌曲评论
  getComment: (data) => axios.post('/comment/music', data)
}
export default request