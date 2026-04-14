<template>
  <div class="page-container">
    <!-- 装饰性暖色流光 -->
    <div class="glow g1"></div>
    <div class="glow g2"></div>

    <!-- 浪漫飘花/心动 -->
    <div class="float-item f1">🍓</div>
    <div class="float-item f2">💕</div>
    <div class="float-item f3">🍰</div>
    <div class="float-item f4">💎</div>
    <div class="float-item f5">✨</div>
    <div class="float-item f6">🥐</div>
    <div class="float-item f7">🍦</div>

    <div class="header-section">
      <!-- 女主人氛围背景 -->
      <div class="header-banner" :style="{ backgroundImage: `url(${chefAvatarUrl})` }"></div>

      <div class="avatar-wrapper">
        <el-avatar :size="72" :src="chefAvatarUrl" class="chef-avatar" />
        <div class="chef-badge">女主人私厨</div>
      </div>
      <h1 class="page-title">胖脆厨房</h1>
      <p class="page-subtitle">每一道精致料理，都是写给你的情书</p>
    </div>

    <div class="category-scroll-wrapper">
      <div 
        v-for="cat in categories" 
        :key="cat.id" 
        class="cat-pill" 
        :class="{ active: activeTab === cat.id }"
        @click="activeTab = cat.id"
      >
        <span class="cat-emoji">{{ cat.emoji }}</span>
        <span class="cat-name">{{ cat.name }}</span>
      </div>
    </div>

    <div class="kitchen-grid">
      <div v-for="item in filteredMenus" :key="item.id" class="gourmet-card">
        <div class="image-box">
          <img :src="item.image" class="dish-image" />
          <div class="category-pill">{{ getCategoryLabel(item.category) }}</div>
        </div>
        <div class="dish-info">
          <h3 class="dish-name">{{ item.name }}</h3>
          <p class="dish-desc">{{ item.description }}</p>
          <div class="dish-footer">
            <el-button class="luxe-order-btn" round @click.stop="openOrderSheet(item)">
              <span>心动下单</span>
            </el-button>
          </div>
        </div>
      </div>

      <el-empty v-if="filteredMenus.length === 0" description="胖脆正在研发新菜谱..." />
    </div>

    <!-- 厨房点餐弹窗 - 采用 Teleport 瞬移技术确保 100% 可视 -->
    <teleport to="body">
      <transition name="sheet-fade">
        <div v-if="showOrder" class="sheet-overlay" @click="showOrder = false"></div>
      </transition>
      
      <transition name="sheet-slide">
        <div v-if="showOrder" class="custom-sheet kitchen-sheet">
          <div class="sheet-indicator" @click="showOrder = false"></div>
          <div class="sheet-content">
            <div class="sheet-header">
              <h2 class="sheet-title">心动下单：{{ selectedDish?.name }}</h2>
              <p class="sheet-desc">请输入您期待的就餐时间，胖脆将为您专属烹饪。</p>
            </div>
            <el-form label-position="top">
              <el-form-item label="期望就餐时间">
                <el-input 
                  v-model="orderTime" 
                  placeholder="例如：今晚 7:00 或是 周末晚宴..." 
                  class="custom-input"
                />
              </el-form-item>
              <el-form-item label="口味需求 (可选)">
                <el-input 
                  v-model="orderNote" 
                  type="textarea" 
                  placeholder="少盐、加辣或是想要个甜点..." 
                  rows="3"
                  class="custom-textarea"
                />
              </el-form-item>
              <div class="submit-row">
                <el-button type="danger" class="order-submit-btn" round @click="submitOrder">
                  确认下单 💖
                </el-button>
              </div>
            </el-form>
          </div>
        </div>
      </transition>
    </teleport>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { ElMessage } from 'element-plus'

const activeTab = ref('all')
const showOrder = ref(false)
const selectedDish = ref(null)
const orderTime = ref('')
const orderNote = ref('')

// ... (other variables)

const openOrderSheet = (dish) => {
  selectedDish.value = dish
  orderTime.value = ''
  orderNote.value = ''
  showOrder.value = true
}

const submitOrder = () => {
  if (!orderTime.value) return ElMessage.warning('请填写一下期望就餐时间哦~')
  
  // 建立订单通知
  const newNotice = {
    id: Date.now(),
    from: '阿旺',
    to: '胖脆',
    type: 'order',
    title: `下单：${selectedDish.value.name}`,
    content: `时间：${orderTime.value} | 备注：${orderNote.value || '无'}`,
    time: new Date().toLocaleString()
  }

  // 存入全局通知列表
  const allNotices = JSON.parse(localStorage.getItem('app_notifications') || '[]')
  allNotices.unshift(newNotice)
  localStorage.setItem('app_notifications', JSON.stringify(allNotices))

  // 提示下单成功
  ElMessage({
    message: `下单成功！胖脆已收到「${selectedDish.value.name}」的订单 😋`,
    type: 'success',
    duration: 3000
  })
  showOrder.value = false
}

const categories = [
  { id: 'all', name: '全部', emoji: '💖' },
  { id: 'big', name: '大餐', emoji: '🍳' },
  { id: 'stir', name: '小炒', emoji: '🔥' },
  { id: 'cold', name: '凉菜', emoji: '🥗' },
  { id: 'western', name: '西餐', emoji: '🥑' },
  { id: 'coffee', name: '饮品', emoji: '☕' }
]

const defaultMenus = [
  {
    id: 1,
    name: '特选意式浓缩',
    category: 'coffee',
    description: '采用埃塞欧比亚耶加雪菲豆，口感顺滑。',
    image: 'https://images.unsplash.com/photo-1541167760496-1628856ab772?q=80&w=500&auto=format&fit=crop'
  },
  {
    id: 2,
    name: '私房红烧肉',
    category: 'big',
    description: '秘制配方，肥而不腻，入口即化。',
    image: 'https://images.unsplash.com/photo-1541529086526-db283c563270?q=80&w=500&auto=format&fit=crop'
  },
  {
    id: 3,
    name: '法式煎羊排',
    category: 'western',
    description: '迷迭香与黄油的完美融合，肉质鲜美。',
    image: 'https://images.unsplash.com/photo-1600891964599-f61ba0e24092?q=80&w=500&auto=format&fit=crop'
  }
]

const menus = ref([...defaultMenus])
const customAvatar = ref('')

onMounted(() => {
  const rawData = localStorage.getItem('pc_kitchen_data')
  if (!rawData) {
    // 首次运行，将静态菜单种子持久化
    localStorage.setItem('pc_kitchen_data', JSON.stringify(defaultMenus))
    menus.value = [...defaultMenus]
  } else {
    menus.value = JSON.parse(rawData)
  }
  customAvatar.value = localStorage.getItem('avatar_胖脆') || ''
})

const chefAvatarUrl = computed(() => {
  if (customAvatar.value) return customAvatar.value
  return 'https://api.dicebear.com/7.x/avataaars/svg?seed=Pancui'
})

const filteredMenus = computed(() => {
  if (activeTab.value === 'all') return menus.value
  return menus.value.filter(item => item.category === activeTab.value)
})

const getCategoryLabel = (cat) => {
  const maps = {
    big: '中餐大餐',
    stir: '中餐小炒',
    cold: '中餐凉菜',
    soup: '中餐汤品',
    western: '西餐',
    coffee: '饮品 (咖啡)',
    sparkling: '饮品 (气泡特调)'
  }
  return maps[cat] || '美味佳肴'
}
</script>

<style scoped>
.page-container {
  padding: 40px 16px 100px;
  min-height: 100vh;
  background: #fffafa; /* 极轻奶油红 */
  position: relative;
  overflow: hidden;
}

/* 装饰性光晕 - 体现温暖与食欲 */
.glow {
  position: absolute;
  width: 350px;
  height: 350px;
  filter: blur(100px);
  border-radius: 50%;
  z-index: 0;
  opacity: 0.2;
}
.g1 { top: -100px; right: -100px; background: #ff9a9e; animation: rotate 10s infinite linear; }
.g2 { bottom: 50px; left: -100px; background: #fad0c4; animation: rotate 8s infinite linear reverse; }

@keyframes rotate {
  from { transform: rotate(0deg) scale(1); }
  to { transform: rotate(360deg) scale(1.1); }
}

/* 飘动物体 */
.float-item {
  position: absolute;
  font-size: 22px;
  z-index: 0;
  pointer-events: none;
}
.f1 { top: 12%; left: 8%; animation: hover 4s infinite ease-in-out; }
.f2 { top: 35%; right: 8%; animation: hover 6s infinite ease-in-out 1s; }
.f3 { bottom: 20%; left: 15%; animation: hover 5s infinite ease-in-out 0.5s; }
.f4 { top: 8%; right: 15%; animation: hover 7s infinite ease-in-out 0.2s; font-size: 26px; }
.f5 { top: 25%; left: 24%; animation: sparkle 3s infinite alternate; }
.f6 { top: 5%; left: 45%; animation: hover 8s infinite ease-in-out 1.5s; }
.f7 { top: 45%; left: 12%; animation: hover 9s infinite ease-in-out; }

@keyframes hover {
  0%, 100% { transform: translateY(0) rotate(0deg) scale(1); }
  50% { transform: translateY(-30px) rotate(15deg) scale(1.1); }
}

@keyframes sparkle {
  0% { transform: scale(1); opacity: 0.5; }
  100% { transform: scale(1.3); opacity: 1; }
}

.header-section {
  position: relative;
  z-index: 1;
  text-align: center;
  margin-bottom: 30px;
  padding-top: 20px;
}

.header-banner {
  position: absolute;
  top: -40px;
  left: -16px;
  right: -16px;
  height: 280px;
  background-size: cover;
  background-position: center;
  opacity: 0.15;
  mask-image: linear-gradient(to bottom, rgba(0,0,0,1) 40%, rgba(0,0,0,0) 100%);
  -webkit-mask-image: linear-gradient(to bottom, rgba(0,0,0,1) 40%, rgba(0,0,0,0) 100%);
  z-index: -1;
  filter: blur(2px);
  pointer-events: none;
}

.avatar-wrapper {
  position: relative;
  display: inline-block;
  margin-bottom: 16px;
}

.chef-avatar {
  border: 4px solid #fff;
  box-shadow: 0 10px 25px rgba(255, 107, 107, 0.2);
}

.chef-badge {
  position: absolute;
  bottom: -6px;
  left: 50%;
  transform: translateX(-50%);
  background: linear-gradient(135deg, #ff6b6b, #ff8e8e);
  color: #fff;
  font-size: 10px;
  font-weight: bold;
  padding: 2px 10px;
  border-radius: 20px;
  white-space: nowrap;
}

.page-title {
  font-size: 32px;
  font-weight: 900;
  margin: 0;
  background: linear-gradient(135deg, #ff758c 0%, #ff7eb3 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.page-subtitle {
  color: #636e72;
  font-size: 14px;
  margin-top: 6px;
}

.category-scroll-wrapper {
  display: flex;
  gap: 12px;
  overflow-x: auto;
  padding: 10px 4px 20px;
  margin: 0 -16px; /* 抵消父级 padding 达到全屏滑动感 */
  padding-left: 16px;
  padding-right: 16px;
  -ms-overflow-style: none; /* IE or Edge */
  scrollbar-width: none; /* Firefox */
}

.category-scroll-wrapper::-webkit-scrollbar {
  display: none; /* Chrome, Safari, Opera */
}

.cat-pill {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  background: white;
  border-radius: 99px;
  border: 1px solid rgba(255, 117, 140, 0.1);
  box-shadow: 0 4px 10px rgba(0,0,0,0.03);
  transition: all 0.3s;
  cursor: pointer;
}

.cat-pill.active {
  background: linear-gradient(135deg, #ff758c 0%, #ff7eb3 100%);
  color: white;
  border: none;
  box-shadow: 0 6px 15px rgba(255, 117, 140, 0.3);
  transform: translateY(-2px);
}

.cat-pill.active .cat-name {
  color: white;
}

.cat-name {
  font-size: 13px;
  font-weight: bold;
  color: #95a5a6;
}

.kitchen-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  position: relative;
  z-index: 1;
  margin-top: 20px;
}

.gourmet-card {
  background: white;
  border-radius: 24px;
  overflow: hidden;
  box-shadow: 0 12px 30px rgba(0,0,0,0.04);
  display: flex;
  flex-direction: column;
  transition: all 0.3s;
  border: 1px solid rgba(255, 117, 140, 0.05);
}

.gourmet-card:active { transform: scale(0.97); }

.image-box {
  position: relative;
  height: 140px;
}

.dish-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.category-pill {
  position: absolute;
  top: 10px;
  left: 10px;
  background: rgba(255, 255, 255, 0.85);
  backdrop-filter: blur(4px);
  color: #ff758c;
  font-size: 9px;
  font-weight: bold;
  padding: 3px 10px;
  border-radius: 10px;
}

.dish-info {
  padding: 12px;
  display: flex;
  flex-direction: column;
  flex-grow: 1;
}

.dish-name {
  font-size: 15px;
  font-weight: 800;
  color: #2d3436;
  margin: 0 0 4px 0;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.dish-desc {
  font-size: 11px;
  color: #95a5a6;
  line-height: 1.4;
  height: 32px;
  margin-bottom: 12px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.dish-footer {
  margin-top: auto;
}

.luxe-order-btn {
  width: 100%;
  height: 36px;
  background: linear-gradient(135deg, #ff758c 0%, #ff7eb3 100%);
  border: none;
  color: white;
  font-weight: 800;
  font-size: 13px;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(255, 117, 140, 0.3);
}

.luxe-order-btn:active {
  transform: scale(0.96);
}

/* --- 强力自定义下单面板样式 --- */
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
  box-shadow: 0 -10px 40px rgba(255, 117, 140, 0.15);
}

.kitchen-sheet { border-top: 4px solid #ff758c; }

.sheet-indicator {
  width: 40px;
  height: 5px;
  background: #f1f2f6;
  border-radius: 10px;
  margin: 0 auto 24px;
}

.sheet-title {
  font-size: 20px;
  font-weight: 800;
  color: #ff758c;
  margin: 0 0 10px 0;
}

.sheet-desc { font-size: 14px; color: #636e72; margin-bottom: 24px; }

.custom-textarea :deep(.el-textarea__inner),
.custom-input :deep(.el-input__wrapper) {
  border-radius: 16px;
  background: #fffafa;
  border: 1px solid #ffe4e6;
  padding: 12px 16px;
  box-shadow: none !important;
}

.submit-row { margin-top: 30px; }

.order-submit-btn {
  width: 100%;
  height: 54px;
  font-size: 16px;
  font-weight: 800;
  background: linear-gradient(135deg, #ff758c 0%, #ff7eb3 100%);
  border: none;
  box-shadow: 0 10px 20px rgba(255, 117, 140, 0.2);
}

/* 动画效果 */
.sheet-fade-enter-active, .sheet-fade-leave-active { transition: opacity 0.3s; }
.sheet-fade-enter-from, .sheet-fade-leave-to { opacity: 0; }

.sheet-slide-enter-active, .sheet-slide-leave-active { transition: transform 0.4s cubic-bezier(0.2, 1, 0.2, 1); }
.sheet-slide-enter-from, .sheet-slide-leave-to { transform: translateY(100%); }
</style>
