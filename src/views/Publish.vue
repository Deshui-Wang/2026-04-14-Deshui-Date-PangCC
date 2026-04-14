<template>
  <div class="publish-page">
    <div class="publish-header">
      <el-button icon="ArrowLeft" circle @click="router.back()" />
      <span class="header-title">发布新{{ identity === '胖脆' ? '菜谱' : '服务' }}</span>
      <div style="width: 32px"></div> <!-- 占位 -->
    </div>

    <div class="form-container">
      <el-form :model="form" label-position="top">
        <el-form-item :label="identity === '胖脆' ? '菜品名称' : '服务名称'">
          <el-input 
            v-model="form.name" 
            :placeholder="'请输入' + (identity === '胖脆' ? '菜名...' : '服务内容...')"
            class="custom-input"
          />
        </el-form-item>

        <el-form-item label="类别选择">
          <el-select v-model="form.category" placeholder="请选择类别" class="custom-select" style="width: 100%">
            <template v-if="identity === '胖脆'">
              <el-option label="中餐大餐" value="big" />
              <el-option label="中餐小炒" value="stir" />
              <el-option label="中餐凉菜" value="cold" />
              <el-option label="中餐汤品" value="soup" />
              <el-option label="西餐" value="western" />
              <el-option label="饮品 (咖啡)" value="coffee" />
              <el-option label="饮品 (气泡特调)" value="sparkling" />
            </template>
            <template v-else>
              <el-option label="视觉设计" value="design" />
              <el-option label="空间收纳" value="storage" />
              <el-option label="PPT/文档" value="doc" />
            </template>
          </el-select>
        </el-form-item>

        <el-form-item v-if="identity === '胖脆'" label="菜品图片">
          <el-upload
            class="image-uploader"
            action="#"
            :auto-upload="false"
            :show-file-list="false"
            :on-change="handleImageChange"
          >
            <div v-if="form.image" class="image-preview">
              <img :src="form.image" alt="预览" />
              <div class="change-hint">点击更换照片</div>
            </div>
            <div v-else class="upload-placeholder">
              <el-icon :size="32"><Plus /></el-icon>
              <span>从相册选择</span>
            </div>
          </el-upload>
        </el-form-item>
        
        <el-form-item v-if="identity === '阿旺'" label="服务简介">
          <el-input v-model="form.description" type="textarea" placeholder="简单描述一下你的服务内容..." rows="4" />
        </el-form-item>
      </el-form>

      <div class="submit-box">
        <el-button type="primary" size="large" class="submit-btn" round @click="handlePublish">
          发布到{{ identity === '胖脆' ? '厨房' : '水馆' }}
        </el-button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ElMessage } from 'element-plus'

const router = useRouter()
const route = useRoute()
const identity = ref('')
const isEdit = ref(false)
const form = ref({
  name: '',
  category: '',
  image: '',
  description: ''
})

onMounted(() => {
  identity.value = localStorage.getItem('user_identity') || '胖脆'
  
  if (route.params.id) {
    isEdit.value = true
    const storageKey = identity.value === '胖脆' ? 'pc_kitchen_data' : 'aw_water_data'
    const data = JSON.parse(localStorage.getItem(storageKey) || '[]')
    const item = data.find(i => i.id === Number(route.params.id))
    if (item) {
      form.value = {
        name: item.name,
        category: item.category,
        image: item.image,
        description: item.description
      }
    }
  }
})

const handleImageChange = (file) => {
  const reader = new FileReader()
  reader.readAsDataURL(file.raw)
  reader.onload = () => {
    // 压缩大图：菜品图片压缩至 600 宽度，保持比例
    const img = new Image()
    img.src = reader.result
    img.onload = () => {
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')
      
      const maxWidth = 600
      let width = img.width
      let height = img.height
      
      if (width > maxWidth) {
        height = (maxWidth / width) * height
        width = maxWidth
      }
      
      canvas.width = width
      canvas.height = height
      ctx.drawImage(img, 0, 0, width, height)
      
      form.value.image = canvas.toDataURL('image/jpeg', 0.8)
    }
  }
}

const handlePublish = () => {
  if (!form.value.name || !form.value.category) {
    return ElMessage.warning('请填写完整信息')
  }

  const storageKey = identity.value === '胖脆' ? 'pc_kitchen_data' : 'aw_water_data'
  let existingData = JSON.parse(localStorage.getItem(storageKey) || '[]')
  
  if (isEdit.value) {
    const index = existingData.findIndex(i => i.id === Number(route.params.id))
    if (index !== -1) {
      existingData[index] = {
        ...existingData[index],
        name: form.value.name,
        category: form.value.category,
        image: form.value.image,
        description: form.value.description
      }
    }
  } else {
    const newItem = {
      id: Date.now(),
      name: form.value.name,
      category: form.value.category,
      difficulty: 3,
      description: form.value.description || (identity.value === '胖脆' ? '胖脆出品，必属精品' : ''),
      image: form.value.image || 'https://images.unsplash.com/photo-1495147466023-ac5c588e2e94?q=80&w=500&auto=format&fit=crop',
      tags: [form.value.category],
      author: identity.value
    }
    existingData.unshift(newItem)
  }

  localStorage.setItem(storageKey, JSON.stringify(existingData))

  ElMessage.success(isEdit.value ? '修改成功！' : '发布成功！')
  router.back()
}
</script>

<style scoped>
.publish-page {
  min-height: 100vh;
  background: white;
  padding: 0 20px 40px;
}

.publish-header {
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid #f1f2f6;
  margin-bottom: 20px;
}

.header-title {
  font-weight: bold;
  font-size: 16px;
}

.form-container {
  max-width: 400px;
  margin: 0 auto;
}

.custom-input :deep(.el-input__wrapper) {
  background: #f8f9fa;
  box-shadow: none;
  border-radius: 12px;
}

.image-uploader {
  width: 100%;
}

.upload-placeholder {
  width: 100%;
  height: 200px;
  background: #f8f9fa;
  border: 2px dashed #e1e2e6;
  border-radius: 16px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 10px;
  color: #95a5a6;
}

.image-preview {
  position: relative;
  width: 100%;
  height: 200px;
  border-radius: 16px;
  overflow: hidden;
}

.image-preview img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.change-hint {
  position: absolute;
  inset: 0;
  background: rgba(0,0,0,0.4);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  opacity: 0;
  transition: opacity 0.3s;
}

.image-preview:hover .change-hint {
  opacity: 1;
}

.submit-box {
  margin-top: 40px;
}

.submit-btn {
  width: 100%;
  height: 50px;
  font-weight: bold;
  font-size: 16px;
  background: linear-gradient(135deg, #764ba2, #667eea);
  border: none;
}

:deep(.el-form-item__label) {
  font-weight: bold;
  padding-bottom: 4px;
}
</style>
