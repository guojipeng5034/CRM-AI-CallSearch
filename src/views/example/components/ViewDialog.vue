<template>
  <el-dialog v-model="dialogVisible" title="通话详情" width="50%">
    <div class="chat-container">
      <div v-if="!chatHistory || chatHistory.length === 0" class="empty-chat">
        暂无通话记录
      </div>
      <div v-else v-for="(message, index) in chatHistory" :key="index" :class="['chat-message', message.speaker]">
        <span class="speaker-label">{{ message.speaker }}:</span>
        <p class="message-text">{{ message.text }}</p>
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
/* 样式与之前相同，这里省略以节省篇幅，你可以从之前的代码中复制过来 */
.chat-container { height: 400px; overflow-y: auto; border: 1px solid #e0e0e0; border-radius: 4px; padding: 10px; background-color: #f9f9f9; }
.empty-chat { text-align: center; color: #999; padding-top: 160px; }
.chat-message { margin-bottom: 15px; }
.chat-message .speaker-label { font-weight: bold; color: #333; }
.chat-message .message-text { background-color: #ffffff; border-radius: 5px; padding: 8px 12px; margin-top: 5px; display: inline-block; max-width: 80%; }
.chat-message.用户 { text-align: right; }
.chat-message.用户 .message-text { background-color: #a0e75a; }
</style>