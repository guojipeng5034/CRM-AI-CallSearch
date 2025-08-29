<template>
  <div class="login-container">
    <div class="login-form-wrapper">
      <div class="login-header">
        <h2>AI 通话分析系统</h2>
        <p>欢迎回来，请输入您的凭证</p>
      </div>
      <el-form
        ref="loginFormRef"
        :model="loginForm"
        :rules="loginRules"
        label-position="top"
        class="login-form"
        @keyup.enter="handleLogin"
      >
        <el-form-item label="用户名" prop="username">
          <el-input
            v-model="loginForm.username"
            placeholder="请输入用户名"
            size="large"
            :prefix-icon="User"
          />
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input
            v-model="loginForm.password"
            type="password"
            placeholder="请输入密码"
            size="large"
            show-password
            :prefix-icon="Lock"
          />
        </el-form-item>
        <el-form-item>
          <el-button
            type="primary"
            class="login-btn"
            size="large"
            :loading="loading"
            @click="handleLogin"
          >
            {{ loading ? '正在登录...' : '登 录' }}
          </el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue';
import { useRouter } from 'vue-router';
import { ElMessage, type FormInstance, type FormRules } from 'element-plus';
import { User, Lock } from '@element-plus/icons-vue';
import { useUserStore } from '@/store/user';

const router = useRouter();
const userStore = useUserStore();
const loginFormRef = ref<FormInstance>();
const loading = ref(false);

const loginForm = reactive({
  username: 'admin',      // 预填用户名
  password: '123456',   // 预填密码
});

const loginRules = reactive<FormRules>({
  username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
  password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
});

const handleLogin = async () => {
  if (!loginFormRef.value) return;
  await loginFormRef.value.validate(async (valid) => {
    if (valid) {
      loading.value = true;
      try {
        // 调用 store 中的 login action
        await userStore.login(loginForm);
        
        ElMessage.success('登录成功！即将进入仪表盘...');
        router.push('/call-search');

      } catch (error: any) {
        ElMessage.error(error.message || '登录失败，请重试！');
      } finally {
        loading.value = false;
      }
    }
  });
};
</script>

<style scoped>
.login-container {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100vw;
  height: 100vh;
  background: var(--primary-gradient);
  position: relative;
  overflow: hidden;
}

.login-container::before {
  content: '';
  position: absolute;
  width: 200%;
  height: 200%;
  top: -50%;
  left: -50%;
  background: 
    radial-gradient(circle at 20% 20%, rgba(102, 126, 234, 0.15) 0%, transparent 30%),
    radial-gradient(circle at 80% 70%, rgba(118, 75, 162, 0.15) 0%, transparent 30%);
  animation: rotate-background 40s linear infinite;
  z-index: 0;
}

@keyframes rotate-background {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.login-form-wrapper {
  width: 100%;
  max-width: 400px;
  margin: 20px;
  background-color: var(--surface-color);
  padding: 40px;
  border-radius: var(--main-border-radius);
  box-shadow: var(--main-box-shadow);
  animation: slide-down 0.5s ease-out;
  position: relative;
  z-index: 1;
}

@keyframes slide-down {
  from {
    opacity: 0;
    transform: translateY(-30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.login-header {
  text-align: center;
  margin-bottom: 30px;
}
.login-header h2 {
  font-size: 1.8rem;
  font-weight: 600;
  color: var(--text-color-primary);
}
.login-header p {
  color: var(--text-color-secondary);
  margin-top: 10px;
}

.login-form :deep(.el-form-item__label) {
  color: var(--text-color-secondary);
  font-weight: 500;
}

.login-btn {
  width: 100%;
  margin-top: 10px;
}
</style>