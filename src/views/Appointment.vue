<template>
  <div class="page-container">
    <div class="header-section">
      <h1 class="page-title">约你约你</h1>
      <p class="page-subtitle">不错过任何一个心动的瞬间</p>
    </div>

    <!-- 约会列表 -->
    <div class="appointment-section">
      <div v-for="app in appointments" :key="app.id" class="romantic-app-card">
        <div class="card-inner">
          <div class="app-header">
            <span class="app-tag">约会计划</span>
            <span class="app-timestamp">{{ formatTime(app.id) }}</span>
          </div>
          <h2 class="app-title">🌹 {{ app.title }}</h2>
          <p class="app-desc">{{ app.description }}</p>
          
          <!-- 备忘录/Todo -->
          <div class="memo-container">
            <div class="memo-header">
              <el-icon><EditPen /></el-icon>
              <span>心动备忘录</span>
            </div>
            <div v-for="(todo, index) in app.todos" :key="index" class="memo-item">
              <el-checkbox v-model="todo.done" class="memo-checkbox">
                {{ todo.text }}
              </el-checkbox>
            </div>
            
            <!-- 快速添加备忘 -->
            <div class="add-memo-action" @click="prepareAddMemo(app)">
              <el-icon><CirclePlus /></el-icon>
              <span>我要补充...</span>
            </div>
          </div>

        </div>
      </div>

      <el-empty v-if="appointments.length === 0" description="暂时还没有新的约会，要不你发起一个？" />
    </div>

    <!-- 发布约会 抽屉 -->
    <el-drawer
      v-model="showPublish"
      title="发起新约会"
      direction="btt"
      size="80%"
      class="romantic-drawer"
    >
      <div class="drawer-form">
        <el-form :model="form" label-position="top">
          <el-form-item label="浪漫主题">
            <el-input v-model="form.title" placeholder="我们要去干嘛？" />
          </el-form-item>
          <el-form-item label="详细介绍">
            <el-input v-model="form.description" type="textarea" placeholder="描述一下你期待的画面..." rows="3" />
          </el-form-item>
          <el-form-item label="初始备忘录">
            <div v-for="(t, i) in form.initialTodos" :key="i" class="todo-input-row">
              <el-input v-model="form.initialTodos[i]" placeholder="准备点什么..." />
            </div>
            <el-button link type="primary" icon="Plus" @click="form.initialTodos.push('')">添加更多备忘</el-button>
          </el-form-item>
          <el-button type="primary" class="publish-submit-btn" @click="handleCreate">
            开启浪漫之旅
          </el-button>
        </el-form>
      </div>
    </el-drawer>

    <!-- 补充备忘 弹窗 -->
    <el-dialog v-model="memoDialogVisible" title="我说两句" width="90%" class="mini-dialog" center>
      <el-input v-model="newMemoText" placeholder="你想添加什么备忘？" />
      <template #footer>
        <el-button type="primary" round style="width: 100%" @click="addMemoToApp">确定添加</el-button>
      </template>
    </el-dialog>

    <el-button 
      type="danger" 
      size="large" 
      circle 
      class="fab-add-btn"
      icon="Plus"
      @click="showPublish = true"
    />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { ElMessage } from 'element-plus'

const showPublish = ref(false)
const memoDialogVisible = ref(false)
const currentApp = ref(null)
const newMemoText = ref('')

const appointments = ref([])

const form = ref({
  title: '',
  description: '',
  initialTodos: ['']
})

onMounted(() => {
  loadApps()
})

const loadApps = () => {
  try {
    const rawData = localStorage.getItem('romantic_apps')
    const data = rawData ? JSON.parse(rawData) : []
    
    if (!Array.isArray(data) || data.length === 0) {
      // 初始示例数据
      const sample = [
        {
          id: Date.now(),
          title: '周末落日骑行',
          description: '想和你一起在江边看一场日落，吹吹晚风。',
          todos: [
            { text: '检查单车状况', done: true },
            { text: '买两瓶气泡水', done: false }
          ]
        }
      ]
      appointments.value = sample
      localStorage.setItem('romantic_apps', JSON.stringify(sample))
    } else {
      appointments.value = data
    }
  } catch (e) {
    console.error('数据加载失败，重置为默认值', e)
    appointments.value = []
    localStorage.removeItem('romantic_apps')
  }
}

const handleCreate = () => {
  if (!form.value.title) return ElMessage.warning('主题不能为空哦')
  
  const newApp = {
    id: Date.now(),
    title: form.value.title,
    description: form.value.description,
    todos: form.value.initialTodos.filter(t => t).map(t => ({ text: t, done: false }))
  }

  appointments.value.unshift(newApp)
  localStorage.setItem('romantic_apps', JSON.stringify(appointments.value))
  
  showPublish.value = false
  form.value = { title: '', description: '', initialTodos: [''] }
  ElMessage.success('发布成功！')
}

const prepareAddMemo = (app) => {
  currentApp.value = app
  newMemoText.value = ''
  memoDialogVisible.value = true
}

const addMemoToApp = () => {
  if (!newMemoText.value) return
  
  const app = appointments.value.find(i => i.id === currentApp.value.id)
  if (app) {
    app.todos.push({ text: newMemoText.value, done: false })
    localStorage.setItem('romantic_apps', JSON.stringify(appointments.value))
    ElMessage.success('已补充备忘')
  }
  memoDialogVisible.value = false
}

const formatTime = (id) => {
  const date = new Date(id)
  return `${date.getMonth() + 1}/${date.getDate()} ${date.getHours()}:${date.getMinutes()}`
}
</script>

<style scoped>
.page-container {
  padding: 30px 20px 100px;
  min-height: 100vh;
  background: #fdf6f6; /* 温馨浅底色 */
}

.header-section { margin-bottom: 30px; }

.page-title {
  font-size: 30px;
  font-weight: 900;
  background: linear-gradient(135deg, #ff758c 0%, #ff7eb3 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.page-subtitle { color: #8e8e93; font-size: 14px; margin-top: 6px; }

.romantic-app-card {
  margin-bottom: 24px;
  background: white;
  border-radius: 28px;
  box-shadow: 0 10px 30px rgba(255, 117, 140, 0.1);
  overflow: hidden;
  border: 1px solid rgba(255, 117, 140, 0.05);
}

.card-inner { padding: 24px; }

.app-header { display: flex; justify-content: space-between; margin-bottom: 15px; }
.app-tag { 
  background: #fff0f3; color: #ff758c; padding: 4px 12px; border-radius: 10px; 
  font-size: 11px; font-weight: bold; 
}
.app-timestamp { font-size: 11px; color: #ced6e0; }

.app-title { font-size: 20px; font-weight: 800; color: #2d3436; margin: 0 0 10px 0; }
.app-desc { font-size: 14px; color: #636e72; line-height: 1.6; margin-bottom: 24px; }

.memo-container {
  background: #fdfdfd;
  border: 1px dashed #ffd1dc;
  border-radius: 18px;
  padding: 16px;
  margin-bottom: 20px;
}

.memo-header {
  display: flex; align-items: center; gap: 8px; font-size: 13px; font-weight: bold;
  color: #ff758c; margin-bottom: 12px;
}

.memo-item { margin-bottom: 8px; }
.memo-checkbox :deep(.el-checkbox__label) { font-size: 13px; color: #5d6d7e; }
.memo-checkbox.is-checked :deep(.el-checkbox__label) { text-decoration: line-through; opacity: 0.5; }

.add-memo-action {
  display: flex; align-items: center; gap: 6px; font-size: 12px; color: #fb8c00;
  margin-top: 15px; cursor: pointer; opacity: 0.8;
}

.talk-btn {
  width: 100%; height: 46px; 
  background: linear-gradient(135deg, #ff758c 0%, #ff7eb3 100%);
  color: white; border: none; font-weight: 800; font-size: 15px;
  box-shadow: 0 6px 15px rgba(255, 117, 140, 0.3);
}

.fab-add-btn {
  position: fixed; right: 20px; bottom: 100px; width: 60px; height: 60px;
  background: linear-gradient(135deg, #ff758c, #ff4d4d);
  border: none; box-shadow: 0 8px 25px rgba(255, 77, 77, 0.4);
}

.drawer-form { padding: 20px; }
.publish-submit-btn { width: 100%; height: 50px; font-weight: bold; font-size: 16px; border-radius: 15px; }
.todo-input-row { margin-bottom: 10px; }
</style>
