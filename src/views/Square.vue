<template>
  <div class="page-container">
    <!-- 动态背景光晕 -->
    <div class="aura a1"></div>
    <div class="aura a2"></div>

    <!-- 灵动星光 -->
    <div class="sparkle s1">✨</div>
    <div class="sparkle s2">💖</div>
    <div class="sparkle s3">⚡</div>

    <div class="header-section">
      <!-- 动态氛围背景 -->
      <div class="header-banner" :style="{ backgroundImage: `url(${bossAvatarUrl})` }"></div>
      
      <div class="avatar-box">
        <el-avatar :size="72" :src="bossAvatarUrl" class="awang-avatar" />
        <div class="badge">🉐水的异想天开专场</div>
      </div>
      <h1 class="page-title">阿旺水族馆</h1>
      <p class="page-subtitle">用科技与爱，打理我们的精致生活</p>
    </div>

    <div class="aquarium-grid">
      <div v-for="service in services" :key="service.id" class="cyber-card">
        <div class="card-glow"></div>
        <div class="inner-content">
          <div class="icon-section">
            <div class="energy-ring"></div>
            <el-icon :size="30" class="service-icon"><component :is="service.icon || 'Star'" /></el-icon>
          </div>
          <div class="text-section">
            <h3 class="service-name">{{ service.name }}</h3>
            <p class="service-desc">{{ service.description }}</p>
            <div class="badge-row">
              <span class="cyber-badge" :style="{ background: service.color + '22', color: service.color }">
                # {{ getCategoryLabel(service.tags[0]) }}
              </span>
              <span class="love-hint">阿旺正在待命</span>
            </div>
          </div>
        </div>
        <div class="card-action">
          <el-button class="love-btn" :style="{ background: service.color }" @click="handleAwangCall(service)">
            呼叫阿旺服务
          </el-button>
        </div>
      </div>

      <el-empty v-if="services.length === 0" description="新功能正在加载中..." />
    </div>

    <!-- 终极瞬移面板：改用唯一变量名 showAwangSheet -->
    <teleport to="body">
      <transition name="sheet-fade">
        <div v-if="showAwangSheet" class="sheet-overlay" @click="showAwangSheet = false"></div>
      </transition>
      
      <transition name="sheet-slide">
        <div v-if="showAwangSheet" class="custom-sheet awang-sheet">
          <div class="sheet-indicator" @click="showAwangSheet = false"></div>
          <div class="sheet-content">
            <div class="sheet-header">
              <h2 class="sheet-title">下达任务：{{ activeService?.name }}</h2>
              <p class="sheet-desc">你好胖脆！请详细说明你的想法，阿旺技术中心将为您即刻启动。</p>
            </div>
            <el-form label-position="top">
              <el-form-item label="我的具体需求">
                <el-input 
                  v-model="callText" 
                  type="textarea" 
                  placeholder="在这里输入你想对阿旺下达的指令..." 
                  rows="5" 
                  class="custom-textarea"
                />
              </el-form-item>
              <div class="submit-row">
                <el-button type="primary" class="send-btn awang-gradient-btn" round @click="confirmCall">
                  下达任务指令 ⚡
                </el-button>
              </div>
            </el-form>
          </div>
        </div>
      </transition>
    </teleport>

    <!-- 右下角悬浮呼叫按钮 -->
    <el-button 
      type="primary" 
      size="large" 
      circle 
      class="fab-call-btn"
      icon="Plus"
      @click="handleGeneralCall"
    />
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { ElMessage } from 'element-plus'

const services = ref([
  {
    id: 1,
    name: '视觉全开：创意设计',
    description: '无论是我们的纪念册，还是你的工作 PPT，阿旺承包所有审美。',
    icon: 'Brush',
    color: '#00ccff',
    tags: ['design']
  },
  {
    id: 2,
    name: '全能管家：空间收纳',
    description: '让家里的每一个角落都井井有条，腾出更多空间来爱你。',
    icon: 'House',
    color: '#712eff',
    tags: ['storage']
  },
  {
    id: 3,
    name: '数字极客：技术支持',
    description: '解决所有数码难题，我是你专属的技术大拿与安全卫士。',
    icon: 'Monitor',
    color: '#f312cb',
    tags: ['doc']
  }
])

const customAvatar = ref('')
const showAwangSheet = ref(false)
const activeService = ref(null)
const callText = ref('')

onMounted(() => {
  const rawData = localStorage.getItem('aw_water_data')
  if (!rawData) {
    // 首次运行，持久化静态服务
    localStorage.setItem('aw_water_data', JSON.stringify(services.value))
  } else {
    services.value = JSON.parse(rawData).map(s => ({...s, color: s.color || '#00ccff'}))
  }
  customAvatar.value = localStorage.getItem('avatar_阿旺') || ''
})

const handleAwangCall = (service) => {
  activeService.value = service
  callText.value = ''
  showAwangSheet.value = true
}

const handleGeneralCall = () => {
  activeService.value = { name: '新任务' }
  callText.value = ''
  showAwangSheet.value = true
}

const confirmCall = () => {
  if (!callText.value) return ElMessage.warning('请描述一下你的具体需求')
  
  // 建立通知数据
  const newNotice = {
    id: Date.now(),
    from: '胖脆',
    to: '阿旺',
    type: 'service',
    title: `服务申请：${activeService.value.name}`,
    content: callText.value,
    time: new Date().toLocaleString()
  }

  // 存入全局通知列表
  const allNotices = JSON.parse(localStorage.getItem('app_notifications') || '[]')
  allNotices.unshift(newNotice)
  localStorage.setItem('app_notifications', JSON.stringify(allNotices))

  ElMessage.success('任务已由水族馆系统接收！')
  showAwangSheet.value = false
}

const bossAvatarUrl = computed(() => {
  if (customAvatar.value) return customAvatar.value
  return 'https://api.dicebear.com/7.x/avataaars/svg?seed=Awang'
})

const getCategoryLabel = (cat) => {
  const maps = {
    design: '视觉艺术',
    storage: '空间优化',
    doc: '技术助力'
  }
  return maps[cat] || cat
}
</script>

<style scoped>
.page-container {
  padding: 40px 20px 100px;
  min-height: 100vh;
  background: #ffffff;
  position: relative;
  overflow: hidden;
}

/* 动态背景光晕 - 体现未来感与温馨 */
.aura {
  position: absolute;
  width: 300px;
  height: 300px;
  filter: blur(80px);
  border-radius: 50%;
  z-index: -1; /* 强制降到最低层 */
  opacity: 0.15;
  pointer-events: none; /* 绝对禁止拦截点击 */
}
.a1 { top: -50px; left: -50px; background: #00ccff; animation: pulse 8s infinite alternate; }
.a2 { bottom: 100px; right: -50px; background: #f312cb; animation: pulse 6s infinite alternate-reverse; }

@keyframes pulse {
  from { transform: scale(1); opacity: 0.1; }
  to { transform: scale(1.3); opacity: 0.2; }
}

/* 灵动星光 */
.sparkle {
  position: absolute;
  font-size: 20px;
  z-index: 0;
  pointer-events: none;
}
.s1 { top: 15%; right: 10%; animation: float 4s infinite; }
.s2 { top: 45%; left: 5%; animation: float 5s infinite 1s; }
.s3 { bottom: 20%; right: 15%; animation: float 6s infinite 0.5s; }

@keyframes float {
  0%, 100% { transform: translateY(0) rotate(0); }
  50% { transform: translateY(-15px) rotate(10deg); }
}

.header-section {
  position: relative;
  z-index: 1;
  text-align: center;
  margin-bottom: 40px;
  padding-top: 20px;
}

.header-banner {
  position: absolute;
  top: -40px;
  left: -20px;
  right: -20px;
  height: 260px;
  background-size: cover;
  background-position: center;
  opacity: 0.15;
  mask-image: linear-gradient(to bottom, rgba(0,0,0,1) 30%, rgba(0,0,0,0) 100%);
  -webkit-mask-image: linear-gradient(to bottom, rgba(0,0,0,1) 30%, rgba(0,0,0,0) 100%);
  z-index: -1;
  filter: blur(2px);
  pointer-events: none;
}

.avatar-box {
  position: relative;
  display: inline-block;
  margin-bottom: 16px;
}

.awang-avatar {
  border: 3px solid #fff;
  box-shadow: 0 8px 24px rgba(0, 75, 150, 0.15);
}

.badge {
  position: absolute;
  bottom: -5px;
  left: 50%;
  transform: translateX(-50%);
  background: #2d3436;
  color: #fff;
  font-size: 10px;
  padding: 2px 8px;
  border-radius: 20px;
  white-space: nowrap;
}

.page-title {
  font-size: 32px;
  font-weight: 900;
  margin: 0;
  background: linear-gradient(135deg, #00ccff 0%, #712eff 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.page-subtitle {
  color: #636e72;
  font-size: 14px;
  margin-top: 6px;
}

.aquarium-grid {
  display: flex;
  flex-direction: column;
  gap: 20px;
  position: relative;
  z-index: 1;
}

.cyber-card {
  background: rgba(255, 255, 255, 0.85);
  backdrop-filter: blur(15px);
  border-radius: 28px;
  border: 1px solid rgba(255, 255, 255, 0.5);
  box-shadow: 0 10px 25px rgba(0,0,0,0.03);
  padding: 24px;
  position: relative;
  overflow: hidden;
  transition: all 0.3s;
}

.cyber-card:active { transform: scale(0.97); }

.card-glow {
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: radial-gradient(circle, rgba(255,255,255,0.8) 0%, transparent 70%);
  opacity: 0;
  transition: opacity 0.5s;
  pointer-events: none; /* 彻底解决：禁止拦截点击事件 */
  z-index: 0;
}

.cyber-card:hover .card-glow { opacity: 0.3; }

.inner-content {
  display: flex;
  gap: 16px;
  margin-bottom: 15px;
}

.icon-section {
  position: relative;
  width: 50px;
  height: 50px;
  flex-shrink: 0;
}

.energy-ring {
  position: absolute;
  inset: -4px;
  border: 2px solid #00ccff;
  border-radius: 50%;
  opacity: 0.2;
}

.service-icon {
  background: #f8f9fa;
  width: 100%;
  height: 100%;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #2d3436;
}

.service-name {
  margin: 0 0 6px 0;
  font-size: 18px;
  font-weight: 800;
  color: #2d3436;
}

.service-desc {
  font-size: 13px;
  color: #636e72;
  margin: 0 0 12px 0;
}

.badge-row {
  display: flex;
  align-items: center;
  gap: 10px;
}

.cyber-badge {
  padding: 4px 10px;
  border-radius: 10px;
  font-size: 11px;
  font-weight: bold;
}

.love-hint {
  font-size: 11px;
  color: #95a5a6;
  font-style: italic;
}

.card-action {
  margin-top: 10px;
}

.love-btn {
  width: 100%;
  height: 44px;
  border: none;
  color: white;
  border-radius: 14px;
  font-weight: 800;
  font-size: 14px;
  box-shadow: 0 4px 15px rgba(0,0,0,0.1);
  transition: all 0.3s;
}

.love-btn:active {
  transform: scale(0.96);
}

/* 高度可靠的自定义面板样式 */
.sheet-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(4px);
  z-index: 2000;
}

.custom-sheet {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: white;
  border-radius: 32px 32px 0 0;
  z-index: 2001;
  padding: 12px 20px 40px;
  box-shadow: 0 -10px 40px rgba(0, 75, 150, 0.1);
}

.sheet-indicator {
  width: 40px;
  height: 5px;
  background: #e1e2e6;
  border-radius: 10px;
  margin: 0 auto 24px;
}

.sheet-title {
  font-size: 20px;
  font-weight: 800;
  color: #2c3e50;
  margin: 0 0 10px 0;
}

.sheet-desc {
  font-size: 14px;
  color: #636e72;
  margin-bottom: 24px;
  line-height: 1.6;
}

.custom-textarea :deep(.el-textarea__inner) {
  border-radius: 16px;
  background: #f8f9fa;
  border: none;
  padding: 16px;
  font-size: 15px;
  box-shadow: none;
}

.submit-row {
  margin-top: 30px;
}

.send-btn {
  width: 100%;
  height: 54px;
  font-size: 16px;
  font-weight: 800;
  background: linear-gradient(135deg, #00ccff 0%, #712eff 100%);
  border: none;
  box-shadow: 0 10px 20px rgba(113, 46, 255, 0.2);
}

/* 动画效果 */
.sheet-fade-enter-active, .sheet-fade-leave-active { transition: opacity 0.3s; }
.sheet-fade-enter-from, .sheet-fade-leave-to { opacity: 0; }

.sheet-slide-enter-active, .sheet-slide-leave-active { transition: transform 0.4s cubic-bezier(0.2, 1, 0.2, 1); }
.sheet-slide-enter-from, .sheet-slide-leave-to { transform: translateY(100%); }

.fab-call-btn {
  position: fixed;
  right: 20px;
  bottom: 100px; /* 避开底部 Tab */
  width: 60px;
  height: 60px;
  background: linear-gradient(135deg, #00ccff, #712eff);
  border: none;
  font-size: 24px;
  box-shadow: 0 10px 30px rgba(113, 46, 255, 0.4);
  transition: all 0.3s;
}

.fab-call-btn:active {
  transform: scale(0.9);
}
</style>
