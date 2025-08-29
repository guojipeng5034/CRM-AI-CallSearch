<template>
  <div class="theme-switcher">
    <el-switch
      v-model="isCyberpunk"
      size="large"
      inline-prompt
      active-text="赛博朋克"
      inactive-text="专业模式"
      @change="toggleTheme"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

// 默认主题设置为 'theme-professional'
const currentTheme = ref(localStorage.getItem('theme') || 'theme-professional');
const isCyberpunk = ref(currentTheme.value === 'theme-cyberpunk');

// 初始化时应用主题
document.body.className = currentTheme.value;

const toggleTheme = (isCyber: boolean | string | number) => {
  const newTheme = isCyber ? 'theme-cyberpunk' : 'theme-professional';
  document.body.className = newTheme;
  localStorage.setItem('theme', newTheme);
};
</script>

<style scoped>
.theme-switcher {
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 9999;
}

/* 针对不同主题，调整切换器本身的颜色 */
:deep(.el-switch.is-checked .el-switch__core) {
  background-color: #00f6ff;
  border-color: #00f6ff;
}
</style>