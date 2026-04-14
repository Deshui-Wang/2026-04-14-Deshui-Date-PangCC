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
      <div class="avatar-box">
        <el-avatar :size="72" src="https://api.dicebear.com/7.x/avataaars/svg?seed=Awang" class="awang-avatar" />
        <div class="badge">男主人专场</div>
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
          <el-button class="love-btn" :style="{ background: service.color }">
            呼叫阿旺服务
          </el-button>
        </div>
      </div>

      <el-empty v-if="services.length === 0" description="新功能正在加载中..." />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

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

onMounted(() => {
  const savedData = JSON.parse(localStorage.getItem('aw_water_data') || '[]')
  // 合并数据并赋予颜色
  if (savedData.length > 0) {
    const updated = savedData.map(s => ({...s, color: '#00ccff'}))
    services.value = [...updated, ...services.value]
  }
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
  z-index: 0;
  opacity: 0.15;
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

.love-btn:hover {
  filter: brightness(1.1);
  transform: translateY(-2px);
}
</style>
