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

    <!-- 左右分栏：通知列表 | 已发布内容 -->
    <div class="main-content-split">
      <!-- 左侧通知列 -->
      <div class="side-column notifications">
        <div class="column-header">
          <el-badge is-dot class="badge-dot">
            <el-icon><Bell /></el-icon>
          </el-badge>
          <span>通知</span>
        </div>
        <div class="scroll-list">
          <div v-for="(n, idx) in mockOrders" :key="idx" class="mini-notify-card">
            <p class="notify-msg">{{ identity === '胖脆' ? '阿旺点餐' : '胖脆呼叫' }}</p>
            <p class="notify-dish">「{{ n }}」</p>
            <span class="notify-time">刚刚</span>
          </div>
        </div>
      </div>

      <!-- 右侧作品列 -->
      <div class="main-column published">
        <div class="column-header">
          <el-icon><Collection /></el-icon>
          <span>已发布 ({{ publishedItems.length }})</span>
        </div>
        <div class="scroll-list">
          <div v-for="item in publishedItems" :key="item.id" class="item-mini-box">
            <!-- 删除放在最左侧，防误操作 -->
            <el-icon class="mini-del-btn" color="#fab1a0" @click.stop="handleDelete(item.id)"><Delete /></el-icon>
            
            <img v-if="identity === '胖脆'" :src="item.image" class="mini-thumb" />
            <div v-else class="mini-icon-box"><el-icon><Star /></el-icon></div>
            
            <div class="mini-text">
              <span class="mini-name">{{ item.name }}</span>
            </div>
            
            <!-- 编辑放在最右侧，方便操作 -->
            <el-icon class="mini-edit-btn" @click.stop="handleEdit(item.id)"><Edit /></el-icon>
          </div>
          <el-empty v-if="publishedItems.length === 0" :image-size="40" description="空空如也" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessageBox, ElMessage } from 'element-plus'

const router = useRouter()
const identity = ref('')
const publishedItems = ref([])
const avatarInput = ref(null)
const customAvatar = ref('')

onMounted(() => {
  identity.value = localStorage.getItem('user_identity') || '胖脆'
  customAvatar.value = localStorage.getItem(`avatar_${identity.value}`) || ''
  loadPublishedItems()
})

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

.main-content-split {
  display: flex;
  gap: 12px;
  padding: 0 20px;
  margin-top: 10px;
}

.column-header {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  font-weight: 800;
  color: #2d3436;
  margin-bottom: 12px;
}

.side-column { flex: 4; }
.main-column { flex: 6; }

.scroll-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.mini-notify-card {
  background: white;
  padding: 10px;
  border-radius: 14px;
  box-shadow: 0 4px 10px rgba(0,0,0,0.02);
}

.notify-msg { margin: 0; font-size: 11px; font-weight: bold; color: #2d3436; }
.notify-dish { margin: 2px 0; font-size: 10px; color: #ff758c; font-weight: bold; }
.notify-time { font-size: 9px; color: #b2bec3; }

.item-mini-box {
  background: white;
  padding: 10px;
  border-radius: 16px;
  display: flex;
  align-items: center;
  gap: 10px;
  box-shadow: 0 4px 10px rgba(0,0,0,0.02);
}

.mini-del-btn {
  font-size: 16px;
  cursor: pointer;
  padding: 4px;
}

.mini-thumb { width: 40px; height: 40px; border-radius: 10px; object-fit: cover; }
.mini-icon-box { 
  width: 40px; height: 40px; border-radius: 10px; 
  background: #f1f2f6; display: flex; align-items: center; justify-content: center;
  color: #712eff;
}

.mini-text { flex-grow: 1; min-width: 0; }
.mini-name { 
  font-size: 12px; font-weight: bold; color: #2d3436;
  white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
}

.mini-edit-btn {
  font-size: 18px;
  color: #74b9ff;
  cursor: pointer;
  padding: 4px;
}
</style>
