<template>
  <div class="app-container">
    <header class="header">
      <h1>AI 通话分析仪表盘</h1>
    </header>

    <section class="filter-section">
      <h3>筛选条件</h3>
      <div class="filter-grid">
        <div class="filter-group">
          <label>用户ID</label>
          <el-input v-model="searchParams.userId" placeholder="请输入用户ID" clearable />
        </div>
        <div class="filter-group">
          <label>查询密码</label>
          <el-input v-model="searchParams.password" type="password" placeholder="请输入密码" show-password clearable />
        </div>
        <div class="filter-group">
          <label>选择日期</label>
          <el-date-picker
            v-model="searchParams.date"
            type="date"
            placeholder="请选择日期"
            format="YYYY-MM-DD"
            value-format="YYYY-MM-DD"
            style="width: 100%;height: 34px;"
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
                <el-table-column prop="date" label="日期" width="180" />
                <el-table-column prop="status" label="完成状态" width="150">
                    <template #default="{ row }">
                        <el-tag :type="row.status === '已完成' ? 'success' : 'warning'">{{ row.status }}</el-tag>
                    </template>
                </el-table-column>
                <el-table-column label="操作" min-width="200">
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
import ViewDialog from './components/ViewDialog.vue';
import CollectDialog from './components/CollectDialog.vue';
import UploadDialog from './components/UploadDialog.vue';

// --- 类型定义 ---
interface TableRow {
  id: number;
  userId: string;
  date: string;
  status: '已完成' | '处理中';
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
const searchParams = reactive({
  userId: '',
  date: '',
  password: ''
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
    const params = {
      ...searchParams,
      page: pagination.page,
      pageSize: pagination.pageSize,
    };
    console.log('查询参数:', params);
    // **模拟API调用**
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // **恢复这里的模拟后端返回数据**
    const mockResponse = {
      total: 2, // 总共有2条数据
      records: [
        { id: 1, userId: 'User_7701', date: '2025-08-29', status: '已完成' },
        { id: 2, userId: 'User_9527', date: '2025-08-28', status: '处理中' },
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

// 页面加载时执行一次查询
onMounted(() => {
  handleQuery();
});

// 分页事件
const handleSizeChange = (val: number) => {
  pagination.pageSize = val;
  handleQuery();
};
const handleCurrentChange = (val: number) => {
  pagination.page = val;
  handleQuery();
};

// 操作按钮事件
const handleView = async (row: TableRow) => {
  try {
    // **恢复这里的对话详情数据**
    selectedChatHistory.value = [
      { speaker: '客服', text: '您好，这里是未来科技客服中心。' },
      { speaker: '用户', text: '你好，我的时空跃迁引擎好像出了点问题。' },
      { speaker: '客服', text: '请您提供一下引擎的序列号，我为您查询跃迁记录。'},
      { speaker: '用户', text: '序列号是 X-WING-8086。'},
    ];
    viewDialogVisible.value = true;
  } catch (error) {
    ElMessage.error('获取通话详情失败！');
  }
};

const handleCollect = async (row: TableRow) => {
  try {
    // **恢复这里的采集表单数据**
    selectedFormData.value = {
      id: row.id,
      name: '约翰·康纳',
      age: 30,
      phone: '13800138000',
      notes: '用户咨询关于天网的订单问题。怀疑产品有自我意识。'
    };
    collectDialogVisible.value = true;
  } catch(error) {
    ElMessage.error('获取表单数据失败！');
  }
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
.refresh-btn {
  background: rgba(255, 255, 255, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.3);
  color: white;
  padding: 10px 20px;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-weight: 500;
}
.refresh-btn:hover:not(:disabled) {
  background: rgba(255, 255, 255, 0.3);
  transform: translateY(-2px);
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
</style>