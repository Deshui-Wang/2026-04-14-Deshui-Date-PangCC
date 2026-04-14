<template>
  <div class="page-container">
    <div class="profile-header" :class="identity">
      <div class="user-info">
        <div class="avatar-click-zone" @click="triggerAvatarUpload">
          <el-avatar :size="80" :src="avatarUrl" class="avatar" />
          <div class="avatar-edit-icon"><el-icon><Camera /></el-icon></div>
        </div>
        <input 
          type="file" 
          ref="avatarInput" 
          v-show="false" 
          accept="image/*" 
          @change="handleAvatarChange"
        />
        <div class="user-text">
          <h2 class="username">{{ identity }}</h2>
          <p class="bio">{{ bioText }}</p>
        </div>
      </div>
      <div class="stats-row">
        <div class="stat-item" @click="changeIdentity">
          <el-icon><Refresh /></el-icon>
          <span class="stat-label">切换身份</span>
        </div>
        <div class="stat-item">
          <span class="stat-value">{{ publishedItems.length }}</span>
          <span class="stat-label">我的发布</span>
        </div>
        <div class="stat-item">
          <span class="stat-value">520</span>
          <span class="stat-label">收到爱心</span>
        </div>
      </div>
    </div>

    <!-- 独自占据一行的发布大按钮 -->
    <div class="action-section">
      <div class="huge-publish-btn" :class="identity" @click="router.push('/publish')">
        <div class="btn-content">
          <el-icon :size="24"><Plus /></el-icon>
          <span>发布新的{{ identity === '胖脆' ? '爱心菜谱' : '灵动服务' }}</span>
        </div>
        <el-icon class="arrow-icon"><ArrowRight /></el-icon>
      </div>
    </div>

    <!-- 切换标签 -->
    <div class="profile-tabs">
      <div 
        class="tab-pill" 
        :class="{ active: activeTab === 'notices' }" 
        @click="activeTab = 'notices'"
      >
        <el-badge :is-dot="notices.length > 0" class="tab-badge-dot">
          <span>通知</span>
        </el-badge>
      </div>
      <div 
        class="tab-pill" 
        :class="{ active: activeTab === 'published' }" 
        @click="activeTab = 'published'"
      >
        <span>{{ identity === '胖脆' ? '菜谱库' : '服务中心' }}</span>
      </div>
    </div>

    <!-- 列表展示区 -->
    <div class="tab-list-container">
      <transition name="list-slide" mode="out-in">
        <!-- 通知子页面 -->
        <div v-if="activeTab === 'notices'" key="notices" class="tab-view">
          <div class="notice-list">
            <div v-for="notice in notices" :key="notice.id" class="notice-item">
              <div class="notice-meta">
                <span class="notice-from">{{ notice.from }}</span>
                <span class="notice-time">{{ notice.time }}</span>
              </div>
              <div class="notice-main">
                <p class="notice-title">{{ notice.title }}</p>
                <p class="notice-content">{{ notice.content }}</p>
              </div>
              <div class="notice-footer">
                <el-button link type="danger" size="small" @click="deleteNotice(notice.id)">不再提醒</el-button>
              </div>
            </div>
            <el-empty v-if="notices.length === 0" description="暂无新消息" />
          </div>
        </div>

        <!-- 已发布子页面 -->
        <div v-else key="published" class="tab-view">
          <div class="published-column">
            <div v-for="item in publishedItems" :key="item.id" class="item-mini-card">
              <el-icon class="mini-del-btn" color="#fab1a0" @click.stop="handleDelete(item.id)"><Delete /></el-icon>
              
              <img v-if="identity === '胖脆'" :src="item.image" class="mini-thumb" />
              <div v-else class="mini-icon-box"><el-icon><Star /></el-icon></div>
              
              <div class="mini-text">
                <span class="mini-name">{{ item.name }}</span>
              </div>
              
              <el-icon class="mini-edit-btn" @click.stop="handleEdit(item.id)"><Edit /></el-icon>
            </div>
            <el-empty v-if="publishedItems.length === 0" description="暂无发布内容" />
          </div>
        </div>
      </transition>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessageBox, ElMessage } from 'element-plus'

const router = useRouter()
const identity = ref('')
const activeTab = ref('published')
const publishedItems = ref([])
const avatarInput = ref(null)
const customAvatar = ref('')
const notices = ref([])

onMounted(() => {
  identity.value = localStorage.getItem('user_identity') || '胖脆'
  customAvatar.value = localStorage.getItem(`avatar_${identity.value}`) || ''
  
  // 加载通知逻辑
  const loadNotices = () => {
    const allNotices = JSON.parse(localStorage.getItem('app_notifications') || '[]')
    // 过滤发给当前用户的通知
    notices.value = allNotices.filter(n => n.to === identity.value)
  }

  loadNotices()
  
  // 这里可以加一个简单的定时刷新
  setInterval(loadNotices, 5000)

  // 现有加载逻辑
  const storageKey = identity.value === '胖脆' ? 'pc_kitchen_data' : 'aw_water_data'
  publishedItems.value = JSON.parse(localStorage.getItem(storageKey) || '[]')
})

const deleteNotice = (id) => {
  const allNotices = JSON.parse(localStorage.getItem('app_notifications') || '[]')
  const updated = allNotices.filter(n => n.id !== id)
  localStorage.setItem('app_notifications', JSON.stringify(updated))
  notices.value = updated.filter(n => n.to === identity.value)
  ElMessage.success('通知已忽略')
}

const triggerAvatarUpload = () => {
  avatarInput.value.click()
}

const handleAvatarChange = (e) => {
  const file = e.target.files[0]
  if (file) {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => {
      // 创建图片的 Canvas 进行压缩
      const img = new Image()
      img.src = reader.result
      img.onload = () => {
        const canvas = document.createElement('canvas')
        const ctx = canvas.getContext('2d')
        // 头像统一压缩到 160x160
        const size = 160
        canvas.width = size
        canvas.height = size
        ctx.drawImage(img, 0, 0, size, size)
        
        // 转为高质量的 JPEG 格式，体积非常小
        const compressedBase64 = canvas.toDataURL('image/jpeg', 0.8)
        
        try {
          customAvatar.value = compressedBase64
          localStorage.setItem(`avatar_${identity.value}`, compressedBase64)
          ElMessage.success('头像更新并压缩完成')
        } catch (err) {
          console.error('存储失败:', err)
          ElMessage.error('图片依然太大，请更换一张或清理存储')
        }
      }
    }
  }
}

const loadPublishedItems = () => {
  const storageKey = identity.value === '胖脆' ? 'pc_kitchen_data' : 'aw_water_data'
  publishedItems.value = JSON.parse(localStorage.getItem(storageKey) || '[]')
}

const handleEdit = (id) => {
  router.push(`/publish/${id}`)
}

const handleDelete = (id) => {
  ElMessageBox.confirm('确定要删除这项内容吗？', '提示', { type: 'warning' }).then(() => {
    const storageKey = identity.value === '胖脆' ? 'pc_kitchen_data' : 'aw_water_data'
    const data = JSON.parse(localStorage.getItem(storageKey) || '[]')
    const filtered = data.filter(i => i.id !== id)
    localStorage.setItem(storageKey, JSON.stringify(filtered))
    loadPublishedItems()
    ElMessage.success('已删除')
  })
}

const avatarUrl = computed(() => {
  if (customAvatar.value) return customAvatar.value
  const seed = identity.value === '胖脆' ? 'Pancui' : 'Awang'
  return `https://api.dicebear.com/7.x/avataaars/svg?seed=${seed}`
})

const bioText = computed(() => {
  return identity.value === '胖脆' ? '厨艺巅峰研究员 | 咖啡成瘾' : '极简主义设计师 | 空间收纳专家'
})

const mockOrders = computed(() => {
  if (identity.value === '胖脆') return ['私房红烧肉', '特选意式浓缩']
  return ['全屋极简收纳', '视觉感官设计']
})

const changeIdentity = () => {
  localStorage.removeItem('user_identity')
  window.location.reload()
}
</script>

<style scoped>
.page-container { padding-bottom: 100px; background: #f8f9fa; min-height: 100vh; }

.profile-header {
  padding: 40px 20px 30px;
  color: white;
  border-radius: 0 0 32px 32px;
}

.profile-header.胖脆 { background: linear-gradient(135deg, #ff758c 0%, #ff7eb3 100%); }
.profile-header.阿旺 { background: linear-gradient(135deg, #00ccff 0%, #712eff 100%); }

.user-info { display: flex; align-items: center; gap: 20px; margin-bottom: 30px; }

.avatar-click-zone {
  position: relative;
  cursor: pointer;
}

.avatar { border: 3px solid rgba(255,255,255,0.4); }

.avatar-edit-icon {
  position: absolute;
  bottom: 0;
  right: 0;
  background: white;
  color: #2d3436;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  box-shadow: 0 4px 10px rgba(0,0,0,0.1);
}
.username { margin: 0; font-size: 24px; font-weight: 800; }
.bio { margin: 4px 0 0 0; font-size: 13px; opacity: 0.9; }

.stats-row { display: flex; justify-content: space-around; text-align: center; }
.stat-item { cursor: pointer; display: flex; flex-direction: column; align-items: center; }
.stat-value { font-size: 18px; font-weight: 800; }
.stat-label { font-size: 11px; opacity: 0.8; margin-top: 4px; }

.action-section { padding: 20px; display: flex; }

.huge-publish-btn {
  flex: 1;
  height: 70px;
  border-radius: 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 24px;
  color: white;
  box-shadow: 0 10px 20px rgba(0,0,0,0.1);
  transition: all 0.3s;
  cursor: pointer;
}

.huge-publish-btn.胖脆 { background: linear-gradient(135deg, #FF9A8B 0%, #FF6A88 100%); }
.huge-publish-btn.阿旺 { background: linear-gradient(135deg, #00ccff 0%, #712eff 100%); }

.huge-publish-btn:active { transform: scale(0.97); }
.btn-content { display: flex; align-items: center; gap: 12px; font-weight: 800; font-size: 16px; }

/* --- 标签切换区域 --- */
.profile-tabs {
  display: flex;
  margin: 0 20px 20px;
  background: #eee;
  padding: 4px;
  border-radius: 16px;
  gap: 4px;
}

.tab-pill {
  flex: 1;
  text-align: center;
  padding: 10px 0;
  font-size: 14px;
  font-weight: 800;
  color: #636e72;
  border-radius: 12px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
}

.tab-pill.active {
  background: white;
  color: #2d3436;
  box-shadow: 0 4px 12px rgba(0,0,0,0.06);
}

.tab-badge-dot :deep(.el-badge__content.is-fixed.is-dot) {
  right: -8px;
  top: 4px;
  background-color: #ff758c;
}

/* --- 列表容器 --- */
.tab-list-container {
  padding: 0 20px;
}

.tab-view {
  min-height: 300px;
}

.notice-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.notice-item {
  background: white;
  padding: 16px;
  border-radius: 20px;
  box-shadow: 0 4px 16px rgba(0,0,0,0.04);
  border-left: 5px solid #ff758c;
}

.notice-meta {
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
}

.notice-from { font-weight: bold; font-size: 13px; color: #ff758c; }
.notice-time { font-size: 11px; color: #ced6e0; }
.notice-title { font-weight: 900; font-size: 15px; margin: 0 0 6px 0; color: #2d3436; }
.notice-content { font-size: 13px; color: #636e72; line-height: 1.5; margin: 0; }
.notice-footer { text-align: right; margin-top: 12px; }

/* --- 作品卡片列表 --- */
.published-column {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.item-mini-card {
  background: white;
  padding: 12px;
  border-radius: 20px;
  display: flex;
  align-items: center;
  gap: 12px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.03);
  position: relative;
}

.mini-thumb {
  width: 56px;
  height: 56px;
  border-radius: 12px;
  object-fit: cover;
}

.mini-icon-box {
  width: 56px;
  height: 56px;
  background: #f1f2f6;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #00ccff;
}

.mini-text { flex: 1; overflow: hidden; }
.mini-name { display: block; font-weight: 800; font-size: 15px; color: #2d3436; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }

.mini-del-btn, .mini-edit-btn {
  font-size: 18px;
  cursor: pointer;
  transition: transform 0.2s;
  padding: 4px;
}

.mini-del-btn:active, .mini-edit-btn:active { transform: scale(0.8); }

/* --- 过渡动画 --- */
.list-slide-enter-active, .list-slide-leave-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.list-slide-enter-from {
  opacity: 0;
  transform: translateX(10px);
}

.list-slide-leave-to {
  opacity: 0;
  transform: translateX(-10px);
}
</style>
