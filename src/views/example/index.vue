<template>
  <div class="app-container">
    <header class="header">
      <h1>AI 通话分析仪表盘</h1>
      <div class="header-actions">
        <span class="username">欢迎您, {{ userStore.username }}</span>
        <button class="logout-btn" @click="handleLogout">
          安全登出
        </button>
      </div>
    </header>

    <section class="filter-section">
      <h3>筛选条件</h3>
      <div class="filter-grid">
        <div class="filter-group">
          <label>用户</label>
          <el-input v-model="searchParams.name" placeholder="请输入用户" clearable />
        </div>
        <div class="filter-group">
          <label>电话</label>
          <el-input v-model="searchParams.phone" placeholder="请输入电话" clearable />
        </div>
        <div class="filter-group">
          <label>状态</label>
          <el-select v-model="searchParams.status" placeholder="请选择状态" clearable style="width: 100%;">
            <el-option label="已完成" value="completed" />
            <el-option label="处理中" value="processing" />
          </el-select>
        </div>
        <div class="filter-group">
          <label>选择日期</label>
          <el-date-picker
            v-model="searchParams.date"
            type="date"
            placeholder="请选择日期"
            format="YYYY-MM-DD"
            value-format="YYYY-MM-DD"
            style="width: 100%;"
          />
        </div>
        <div class="filter-group">
          <label>&nbsp;</label>
          <el-button type="primary" :loading="isTableLoading" @click="handleQuery" :icon="Search">
            查询
          </el-button>
        </div>
      </div>
    </section>

    <section class="data-section">
        <div class="data-header">
            <h3>通话记录</h3>
            <el-button type="success" @click="uploadDialogVisible = true" :icon="Upload">
                批量上传
            </el-button>
        </div>
        <div class="table-container">
            <el-table :data="tableData" v-loading="isTableLoading" stripe>
                <el-table-column prop="userId" label="用户ID" width="150" />
                <el-table-column prop="phone" label="电话" width="180" />
                <el-table-column prop="date" label="上传时间" width="180" />
                <el-table-column label="录音回放" width="300">
                    <template #default="{ row }">
                        <audio controls class="audio-player" :src="row.recordingUrl">
                            您的浏览器不支持音频播放。
                        </audio>
                    </template>
                </el-table-column>
                <el-table-column prop="status" label="完成状态" width="150">
                    <template #default="{ row }">
                        <el-tag :type="row.status === '已完成' ? 'success' : 'warning'">{{ row.status }}</el-tag>
                    </template>
                </el-table-column>
                <el-table-column label="操作" min-width="200" fixed="right">
                    <template #default="{ row }">
                        <el-button type="primary" link @click="handleView(row)">查看对话</el-button>
                        <el-button type="primary" link @click="handleCollect(row)">采集数据</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>
         <div class="pagination-container">
          <el-pagination
            v-model:current-page="pagination.page"
            v-model:page-size="pagination.pageSize"
            :page-sizes="[10, 20, 50, 100]"
            layout="total, sizes, prev, pager, next, jumper"
            :total="totalItems"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
          />
        </div>
    </section>

    <ViewDialog v-model="viewDialogVisible" :chat-history="selectedChatHistory" />
    <CollectDialog v-model="collectDialogVisible" :initial-data="selectedFormData" @submit-success="handleQuery" />
    <UploadDialog v-model="uploadDialogVisible" @upload-success="handleQuery" />
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue';
import { ElMessage } from 'element-plus';
import { Search, Upload } from '@element-plus/icons-vue';
import { useUserStore } from '@/store/user';
import ViewDialog from './components/ViewDialog.vue';
import CollectDialog from './components/CollectDialog.vue';
import UploadDialog from './components/UploadDialog.vue';

// --- 类型定义 ---
interface TableRow {
  id: number;
  userId: string;
  date: string;
  status: '已完成' | '处理中';
  phone: string;
  recordingUrl: string;
}
interface ChatMessage {
  speaker: '客服' | '用户';
  text: string;
}
interface FormData {
  id: number | null;
  name: string;
  age: number | null;
  phone: string;
  notes: string;
}

// --- 响应式状态 ---
const userStore = useUserStore();
const searchParams = reactive({
  userId: '',
  date: '',
  password: '',
  name: '',
  phone: '',
  status: '',
});
const isTableLoading = ref(false);
const tableData = ref<TableRow[]>([]);
const totalItems = ref(0);
const pagination = reactive({
  page: 1,
  pageSize: 10,
});
const viewDialogVisible = ref(false);
const collectDialogVisible = ref(false);
const uploadDialogVisible = ref(false);
const selectedChatHistory = ref<ChatMessage[]>([]);
const selectedFormData = ref<FormData | null>(null);

// --- 核心方法 ---
const handleQuery = async () => {
  isTableLoading.value = true;
  try {
    const params = { ...searchParams, page: pagination.page, pageSize: pagination.pageSize };
    console.log('查询参数:', params);
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const mockResponse = {
      total: 2,
      records: [
        { 
          id: 1, 
          userId: 'User_7701', 
          phone: '138****8888',
          date: '2025-08-29 13:28:45', 
          status: '已完成',
          recordingUrl: 'https://apollo-pro1.iweisale.cn/ap/m/in/100585/chat/20250713/fd7fc0a1-823c-4ee3-af46-9e9e3f883f10.mp3',
        },
        { 
          id: 2, 
          userId: 'User_9527', 
          phone: '159****1234',
          date: '2025-08-28 18:22:23', 
          status: '处理中',
          recordingUrl: 'https://apollo-pro1.iweisale.cn/ap/m/in/100585/chat/20250713/fd7fc0a1-823c-4ee3-af46-9e9e3f883f10.mp3',
        },
      ]
    };

    tableData.value = mockResponse.records;
    totalItems.value = mockResponse.total;
    ElMessage.success('数据刷新成功！');
  } catch (error) {
    console.error("查询失败:", error);
    ElMessage.error('数据加载失败，请重试！');
  } finally {
    isTableLoading.value = false;
  }
};

onMounted(() => {
  handleQuery();
});

const handleSizeChange = (val: number) => {
  pagination.pageSize = val;
  handleQuery();
};
const handleCurrentChange = (val: number) => {
  pagination.page = val;
  handleQuery();
};

const handleView = async (row: TableRow) => {
  selectedChatHistory.value = [
    { speaker: '客服', text: '您好，这里是未来科技客服中心。' },
    { speaker: '用户', text: '你好，我的时空跃迁引擎好像出了点问题。' },
    { speaker: '客服', text: '请您提供一下引擎的序列号，我为您查询跃迁记录。'},
    { speaker: '用户', text: '序列号是 X-WING-8086。'},
  ];
  viewDialogVisible.value = true;
};

const handleCollect = async (row: TableRow) => {
  selectedFormData.value = {
    id: row.id,
    name: '约翰·康纳',
    age: 30,
    phone: '13800138000',
    notes: '用户咨询关于天网的订单问题。怀疑产品有自我意识。'
  };
  collectDialogVisible.value = true;
};

const handleLogout = () => {
  userStore.logout();
  ElMessage.success('您已成功登出！');
};
</script>

<style scoped>
.app-container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 30px 20px;
}

/* 页面头部 */
.header {
  background: var(--primary-gradient);
  padding: 20px 30px;
  border-radius: var(--main-border-radius);
  box-shadow: var(--main-box-shadow);
  color: var(--text-color-header);
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
}
.header h1 {
  font-size: 1.8rem;
  font-weight: 600;
  margin: 0;
}

/* 新增：头部右侧操作区 */
.header-actions {
  display: flex;
  align-items: center;
  gap: 20px; /* 元素之间的间距 */
}
.username {
  font-weight: 500;
  font-size: 14px;
}
.refresh-btn, .logout-btn {
  border: 1px solid rgba(255, 255, 255, 0.3);
  color: white;
  padding: 5px 15px;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-weight: 500;
}
.refresh-btn {
  background: rgba(255, 255, 255, 0.2);
}
.logout-btn {
  background: var(--danger-color);
}
.refresh-btn:hover:not(:disabled), .logout-btn:hover:not(:disabled) {
  background: rgba(255, 255, 255, 0.3);
  transform: translateY(-2px);
}
.logout-btn:hover:not(:disabled) {
    background: #c53030; /* 危险色的深色变体 */
}
.refresh-btn:disabled {
  cursor: not-allowed;
  opacity: 0.6;
}


/* 筛选和数据区域 */
.filter-section, .data-section {
  background: var(--surface-color);
  padding: 25px;
  border-radius: var(--main-border-radius);
  box-shadow: var(--main-box-shadow);
  margin-bottom: 30px;
}
.filter-section h3, .data-section h3 {
  font-size: 1.3rem;
  color: var(--text-color-secondary);
  margin: 0 0 20px 0;
}
.filter-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
  align-items: flex-end;
}
.filter-group label {
  display: block;
  font-weight: 500;
  margin-bottom: 8px;
  color: var(--text-color-secondary);
  font-size: 14px;
}

.data-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
}
.data-header h3 {
    margin-bottom: 0;
}

.table-container {
    border: 1px solid var(--border-color);
    border-radius: var(--main-border-radius);
    overflow: hidden;
}

.pagination-container {
    display: flex;
    justify-content: center;
    margin-top: 30px;
}

.audio-player {
  width: 100%;
  height: 40px;
}
</style>