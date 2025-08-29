<template>
  <el-dialog v-model="dialogVisible" title="通话详情" width="600px" top="10vh">
    <div class="chat-container">
      <div v-if="!chatHistory || chatHistory.length === 0" class="empty-chat">
        <el-empty description="暂无通话记录" />
      </div>

      <div v-else>
        <div 
          v-for="(message, index) in chatHistory" 
          :key="index" 
          :class="['message-row', message.speaker === '用户' ? 'is-user' : 'is-cs']"
        >
          <div class="avatar">
            {{ message.speaker.charAt(0) }}
          </div>
          
          <div class="message-content">
            <div class="speaker-label">{{ message.speaker }}</div>
            <div class="message-bubble">
              <p class="message-text">{{ message.text }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
    <template #footer>
      <el-button @click="dialogVisible = false">关闭</el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
// 类型定义
interface ChatMessage {
  speaker: '客服' | '用户';
  text: string;
}

// 接收父组件传递的 props
defineProps<{
  chatHistory: ChatMessage[];
}>();

// 使用 v-model 控制对话框的显示/隐藏
const dialogVisible = defineModel<boolean>();
</script>

<style scoped>
/* 整体聊天窗口 */
.chat-container {
  height: 60vh; /* 使用视口高度，更灵活 */
  background-color: #f5f7fa;
  border: 1px solid #e4e7ed;
  border-radius: 8px;
  padding: 20px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
}

/* 滚动条美化 (可选，但效果很好) */
.chat-container::-webkit-scrollbar {
  width: 6px;
}
.chat-container::-webkit-scrollbar-thumb {
  background: #dcdfe6;
  border-radius: 3px;
}
.chat-container::-webkit-scrollbar-track {
  background: transparent;
}

/* 空状态样式 */
.empty-chat {
  margin: auto;
}

/* 每一行消息 */
.message-row {
  display: flex;
  align-items: flex-start;
  margin-bottom: 20px;
  max-width: 80%;
}

/* 头像样式 */
.avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: #dcdfe6;
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-size: 18px;
  flex-shrink: 0; /* 防止头像被压缩 */
}

/* 消息内容容器 */
.message-content {
  display: flex;
  flex-direction: column;
}

/* 说话人标签 */
.speaker-label {
  font-size: 12px;
  color: #909399;
  margin-bottom: 4px;
}

/* 聊天气泡 */
.message-bubble {
  background-color: #ffffff;
  border-radius: 8px;
  padding: 10px 15px;
  position: relative;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
}

.message-text {
  margin: 0;
  line-height: 1.5;
  color: #303133;
  word-wrap: break-word; /* 文本自动换行 */
}

/* --- 客服侧样式 --- */
.message-row.is-cs .avatar {
  background-color: #409eff; /* 蓝色头像 */
  margin-right: 12px;
}
.message-row.is-cs .speaker-label {
  text-align: left;
}

/* --- 用户侧样式 (核心区别) --- */
.message-row.is-user {
  align-self: flex-end; /* 整行靠右 */
  flex-direction: row-reverse; /* 头像和内容反向排列 */
}

.message-row.is-user .avatar {
  background-color: #67c23a; /* 绿色头像 */
  margin-left: 12px;
}

.message-row.is-user .speaker-label {
  text-align: right; /* 标签靠右 */
}

.message-row.is-user .message-bubble {
  background-color: #e1ffc7; /* 类似微信的绿色气泡 */
}
</style>