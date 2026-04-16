<template>
  <div class="shake-container">
    <div class="header">
      <h1>万能摇</h1>
      <p>纠结的时候，让命运来决定吧</p>
    </div>

    <div class="shake-grid">
      <!-- 今天吃什么 -->
      <div 
        class="shake-card food" 
        :class="{ 'is-shaking': isShakingFood }"
        @click="shake('food')"
      >
        <div class="card-icon">
          <el-icon><Food /></el-icon>
        </div>
        <div class="card-title">今天吃什么？</div>
        <div class="result-display">
          <transition name="scale" mode="out-in">
            <span :key="foodResult" class="result-text">{{ foodResult || '点击起摇' }}</span>
          </transition>
        </div>
        <div class="card-footer">
          <span>共 {{ foodList.length }} 种选择</span>
        </div>
      </div>

      <!-- 今天玩什么 -->
      <div 
        class="shake-card play" 
        :class="{ 'is-shaking': isShakingPlay }"
        @click="shake('play')"
      >
        <div class="card-icon">
          <el-icon><Bicycle /></el-icon>
        </div>
        <div class="card-title">今天玩什么？</div>
        <div class="result-display">
          <transition name="scale" mode="out-in">
            <span :key="playResult" class="result-text">{{ playResult || '点击起摇' }}</span>
          </transition>
        </div>
        <div class="card-footer">
          <span>共 {{ playList.length }} 处去向</span>
        </div>
      </div>

      <!-- 今天看什么 -->
      <div 
        class="shake-card movie" 
        :class="{ 'is-shaking': isShakingMovie }"
        @click="shake('movie')"
      >
        <div class="card-icon">
          <el-icon><VideoCamera /></el-icon>
        </div>
        <div class="card-title">今天看什么？</div>
        <div class="result-display">
          <transition name="scale" mode="out-in">
            <div :key="movieResult" class="movie-result">
              <span class="result-text">{{ movieResult.name || '点击起摇' }}</span>
              <span v-if="movieResult.score" class="movie-score">⭐ {{ movieResult.score }}</span>
            </div>
          </transition>
        </div>
        <div class="card-footer">
          <span>精选豆瓣高分榜单</span>
        </div>
      </div>
    </div>

    <div class="hint-text">
      <el-icon><InfoFilled /></el-icon>
      点击上方卡片开始随机抽取
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { Food, Bicycle, InfoFilled, VideoCamera } from '@element-plus/icons-vue'

const foodList = [
  '麻辣烫', '螺狮粉', '米线', '烤串', '炸串', '饺子', 
  '火锅', '烤肉', '胜博殿', '牛汤哥', '羊肉粉', '小吊梨汤', 
  '三泉冷面', '方砖厂炸酱面', '火烧云', '烤鱼'
]

const playList = [
  '逛公园', '富力城', '合生汇', '钻胡同', '找个咖啡', '做个手工', '看个展'
]

const movieList = [
  { name: '肖申克的救赎', score: '9.7' },
  { name: '霸王别姬', score: '9.6' },
  { name: '阿甘正传', score: '9.5' },
  { name: '这个杀手不太冷', score: '9.4' },
  { name: '泰坦尼克号', score: '9.5' },
  { name: '千与千寻', score: '9.4' },
  { name: '辛德勒的名单', score: '9.6' },
  { name: '盗梦空间', score: '9.4' },
  { name: '忠犬八公的故事', score: '9.4' },
  { name: '星际穿越', score: '9.4' },
  { name: '楚门的世界', score: '9.4' },
  { name: '海上钢琴师', score: '9.3' },
  { name: '三傻大闹宝莱坞', score: '9.3' },
  { name: '放牛班的春天', score: '9.3' },
  { name: '机器人总动员', score: '9.3' },
  { name: '大话西游之大圣娶亲', score: '9.2' },
  { name: '疯狂动物城', score: '9.2' },
  { name: '触不可及', score: '9.3' },
  { name: '怦然心动', score: '9.1' }
]

const foodResult = ref('')
const playResult = ref('')
const movieResult = ref({ name: '', score: '' })

const isShakingFood = ref(false)
const isShakingPlay = ref(false)
const isShakingMovie = ref(false)

const shake = (type) => {
  if (type === 'food') {
    if (isShakingFood.value) return
    isShakingFood.value = true
    let count = 0
    const interval = setInterval(() => {
      foodResult.value = foodList[Math.floor(Math.random() * foodList.length)]
      count++
      if (count > 15) {
        clearInterval(interval)
        isShakingFood.value = false
      }
    }, 80)
  } else if (type === 'play') {
    if (isShakingPlay.value) return
    isShakingPlay.value = true
    let count = 0
    const interval = setInterval(() => {
      playResult.value = playList[Math.floor(Math.random() * playList.length)]
      count++
      if (count > 15) {
        clearInterval(interval)
        isShakingPlay.value = false
      }
    }, 80)
  } else {
    if (isShakingMovie.value) return
    isShakingMovie.value = true
    let count = 0
    const interval = setInterval(() => {
      movieResult.value = movieList[Math.floor(Math.random() * movieList.length)]
      count++
      if (count > 15) {
        clearInterval(interval)
        isShakingMovie.value = false
      }
    }, 80)
  }
}
</script>

<style scoped>
.shake-container {
  padding: 20px;
  min-height: calc(100vh - 70px);
  background: linear-gradient(135deg, #fdfbfb 0%, #ebedee 100%);
}

.header {
  margin-bottom: 30px;
  text-align: center;
}

.header h1 {
  font-size: 28px;
  color: #2d3436;
  margin-bottom: 8px;
  background: linear-gradient(45deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.header p {
  color: #636e72;
  font-size: 14px;
}

.shake-grid {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.shake-card {
  background: white;
  border-radius: 24px;
  padding: 30px 20px;
  box-shadow: 0 10px 30px rgba(0,0,0,0.05);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 15px;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  border: 1px solid rgba(255,255,255,0.8);
  position: relative;
  overflow: hidden;
}

.shake-card:active {
  transform: scale(0.98);
}

.shake-card.food {
  background: linear-gradient(to bottom right, #ffffff, #fff5f5);
}

.shake-card.play {
  background: linear-gradient(to bottom right, #ffffff, #f0f7ff);
}

.card-icon {
  width: 60px;
  height: 60px;
  border-radius: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 30px;
  margin-bottom: 5px;
}

.food .card-icon {
  background: #fff0f0;
  color: #ff7675;
}

.play .card-icon {
  background: #eef2ff;
  color: #6c5ce7;
}

.movie .card-icon {
  background: #fff9db;
  color: #fab005;
}

.card-title {
  font-size: 18px;
  font-weight: 600;
  color: #2d3436;
}

.result-display {
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
}

.movie-result {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
}

.movie-score {
  font-size: 14px;
  color: #fab005;
  font-weight: bold;
}

.result-text {
  font-size: 26px;
  font-weight: 800;
  color: #2d3436;
  text-align: center;
}

.card-footer {
  font-size: 12px;
  color: #b2bec3;
  margin-top: 10px;
}

/* 摇晃动画 */
.is-shaking {
  animation: shake-anim 0.1s infinite;
}

@keyframes shake-anim {
  0% { transform: translate(1px, 1px) rotate(0deg); }
  10% { transform: translate(-1px, -2px) rotate(-1deg); }
  20% { transform: translate(-3px, 0px) rotate(1deg); }
  30% { transform: translate(3px, 2px) rotate(0deg); }
  40% { transform: translate(1px, -1px) rotate(1deg); }
  50% { transform: translate(-1px, 2px) rotate(-1deg); }
  60% { transform: translate(-3px, 1px) rotate(0deg); }
  70% { transform: translate(3px, 1px) rotate(-1deg); }
  80% { transform: translate(-1px, -1px) rotate(1deg); }
  90% { transform: translate(1px, 2px) rotate(0deg); }
  100% { transform: translate(1px, -2px) rotate(-1deg); }
}

/* 结果切换动画 */
.scale-enter-active,
.scale-leave-active {
  transition: all 0.2s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.scale-enter-from {
  opacity: 0;
  transform: scale(0.5);
}

.scale-leave-to {
  opacity: 0;
  transform: scale(1.5);
}

.hint-text {
  margin-top: 40px;
  text-align: center;
  color: #b2bec3;
  font-size: 13px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
}
</style>
