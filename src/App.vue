<template>
  <div class="mobile-wrapper">
    <!-- 身份选择遮罩 -->
    <div v-if="!currentUser" class="identity-overlay">
      <div class="identity-card">
        <h2>你是谁？</h2>
        <p>请选择你的身份以开启个性化体验</p>
        <div class="identity-options">
          <div class="option-btn pc" @click="selectUser('胖脆')">
            <el-avatar :size="64" src="https://api.dicebear.com/7.x/avataaars/svg?seed=Pancui" />
            <span>胖脆</span>
          </div>
          <div class="option-btn aw" @click="selectUser('阿旺')">
            <el-avatar :size="64" src="https://api.dicebear.com/7.x/avataaars/svg?seed=Awang" />
            <span>阿旺</span>
          </div>
        </div>
      </div>
    </div>
    
    <!-- 内容区 -->
    <main class="main-body" v-else>
      <router-view v-slot="{ Component }">
        <transition name="fade" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </main>

    <!-- 底部 Tab Bar -->
    <nav class="bottom-nav" v-if="currentUser">
      <router-link to="/" class="nav-item" active-class="active">
        <el-icon :size="20"><Food /></el-icon>
        <span>胖脆厨房</span>
      </router-link>
      <router-link to="/square" class="nav-item" active-class="active">
        <el-icon :size="20"><Compass /></el-icon>
        <span>阿旺水馆</span>
      </router-link>
      <router-link to="/appointment" class="nav-item" active-class="active">
        <el-icon :size="20"><Calendar /></el-icon>
        <span>约定</span>
      </router-link>
      <router-link to="/shake" class="nav-item" active-class="active">
        <el-icon :size="20"><MagicStick /></el-icon>
        <span>万能摇</span>
      </router-link>
      <router-link to="/profile" class="nav-item" active-class="active">
        <el-icon :size="20"><User /></el-icon>
        <span>我的</span>
      </router-link>
    </nav>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const currentUser = ref(null)

onMounted(() => {
  const savedUser = localStorage.getItem('user_identity')
  if (savedUser) {
    currentUser.value = savedUser
  }
})

const selectUser = (user) => {
  currentUser.value = user
  localStorage.setItem('user_identity', user)
}
</script>

<style>
:root {
  --primary-color: #764ba2;
  --bg-color: #f8f9fa;
  --tab-height: 70px;
}

body {
  margin: 0;
  padding: 0;
  background-color: var(--bg-color);
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
  -webkit-tap-highlight-color: transparent;
}

.mobile-wrapper {
  max-width: 500px;
  margin: 0 auto;
  min-height: 100vh;
  background: white;
  position: relative;
  box-shadow: 0 0 20px rgba(0,0,0,0.05);
}

/* 身份选择样式 */
.identity-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.8);
  backdrop-filter: blur(10px);
  z-index: 2000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
}

.identity-card {
  background: white;
  width: 100%;
  max-width: 320px;
  border-radius: 30px;
  padding: 40px 20px;
  text-align: center;
}

.identity-card h2 { margin-bottom: 8px; color: #2d3436; }
.identity-card p { color: #636e72; font-size: 14px; margin-bottom: 30px; }

.identity-options {
  display: flex;
  justify-content: space-around;
  gap: 20px;
}

.option-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  cursor: pointer;
  transition: transform 0.2s;
}

.option-btn:active { transform: scale(0.9); }
.option-btn span { font-weight: bold; color: #2d3436; }

.main-body {
  padding-bottom: var(--tab-height);
}

.bottom-nav {
  position: fixed;
  bottom: 0;
  width: 100%;
  max-width: 500px;
  height: var(--tab-height);
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(20px);
  display: flex;
  justify-content: space-around;
  align-items: center;
  border-top: 1px solid #eee;
  z-index: 1000;
  padding-bottom: env(safe-area-inset-bottom);
}

.nav-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  color: #95a5a6;
  text-decoration: none;
  font-size: 10px; /* 字体缩小以适应长名称 */
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  flex: 1;
}

.nav-item.active {
  color: var(--primary-color);
  transform: translateY(-2px);
}

.nav-item .el-icon {
  font-size: 22px;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
