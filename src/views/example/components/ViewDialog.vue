<template>
  <el-dialog v-model="dialogVisible" title="通话详情记录" width="700px" top="10vh">
    <div class="chat-log-container">
      <div v-if="!chatHistory || chatHistory.length === 0" class="no-messages">
        <p>暂无通话记录</p>
      </div>

      <div 
        v-for="(message, index) in chatHistory" 
        :key="index" 
        :class="['message-bubble-wrapper', message.speaker === '用户' ? 'is-user' : 'is-cs']"
      >
        <div class="message-bubble">
            <div class="message-header">
                <span class="sender-name">{{ message.speaker }}</span>
            </div>
            <div class="message-content">
                <p>{{ message.text }}</p>
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
/* 聊天记录容器 */
.chat-log-container {
  background-color: #f4f6f8;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  gap: 20px;
  max-height: 65vh;
  overflow-y: auto;
  padding: 20px;
}

/* 消息气泡的外部容器，用于对齐 */
.message-bubble-wrapper {
    display: flex;
}

/* 消息气泡 */
.message-bubble {
  border-radius: 18px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.07);
  line-height: 1.6;
  max-width: 85%;
  padding: 12px 18px;
  position: relative;
  border: 1px solid #e5e7eb;
}

/* 客服消息样式 (靠左) */
.message-bubble-wrapper.is-cs {
  justify-content: flex-start;
}
.is-cs .message-bubble {
  background-color: #ffffff;
  border-top-left-radius: 4px;
}

/* 用户消息样式 (靠右) */
.message-bubble-wrapper.is-user {
  justify-content: flex-end;
}
.is-user .message-bubble {
  background-color: #95ec69;
  border-top-right-radius: 4px;
  border-color: transparent;
  color: #333;
}

/* 消息头部 */
.message-header {
  color: #6b7280;
  font-size: 13px;
  font-weight: 600;
  margin-bottom: 8px;
}
.is-user .message-header {
  color: #555;
}

/* 消息内容 */
.message-content p {
  font-size: 14px;
  line-height: 1.6;
  margin: 0;
  white-space: pre-wrap;
  word-break: break-word;
}

/* 空状态 */
.no-messages {
  color: #9ca3af;
  font-style: italic;
  padding: 40px 20px;
  text-align: center;
}
.no-messages p {
  font-size: 16px;
  margin: 0;
}

/* 滚动条美化 */
.chat-log-container::-webkit-scrollbar { width: 6px; }
.chat-log-container::-webkit-scrollbar-track { background: #f1f1f1; border-radius: 3px; }
.chat-log-container::-webkit-scrollbar-thumb { background: #c1c1c1; border-radius: 3px; }
.chat-log-container::-webkit-scrollbar-thumb:hover { background: #a8a8a8; }
</style>