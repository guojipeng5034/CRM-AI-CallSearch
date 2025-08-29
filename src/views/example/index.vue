<template>
  <el-card class="page-container">
    <el-form :model="searchParams" inline>
      <el-form-item label="用户ID">
        <el-input v-model="searchParams.userId" placeholder="请输入用户ID" clearable></el-input>
      </el-form-item>
      <el-form-item label="选择日期">
        <el-date-picker v-model="searchParams.date" type="date" placeholder="请选择日期" format="YYYY-MM-DD"
          value-format="YYYY-MM-DD"></el-date-picker>
      </el-form-item>

      <el-form-item label="密码">
        <el-input v-model="searchParams.password" type="password" placeholder="请输入密码" show-password
          clearable></el-input>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" :loading="isTableLoading" @click="handleQuery">查询</el-button>
      </el-form-item>
    </el-form>

    <div class="action-bar">
      <el-button type="success" @click="uploadDialogVisible = true">批量上传音频</el-button>
    </div>

    <el-table :data="tableData" v-loading="isTableLoading" border stripe>
      <el-table-column prop="userId" label="用户ID" width="120"></el-table-column>
      <el-table-column prop="date" label="日期" width="150"></el-table-column>
      <el-table-column prop="status" label="完成状态" width="120">
        <template #default="{ row }">
          <el-tag :type="row.status === '已完成' ? 'success' : 'warning'">{{ row.status }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" min-width="180" fixed="right">
        <template #default="{ row }">
          <el-button type="primary" link @click="handleView(row)">查看</el-button>
          <el-button type="primary" link @click="handleCollect(row)">采集</el-button>
        </template>
      </el-table-column>
    </el-table>

    <div class="pagination-container">
      <el-pagination v-model:current-page="pagination.page" v-model:page-size="pagination.pageSize"
        :page-sizes="[10, 20, 50, 100]" layout="total, sizes, prev, pager, next, jumper" :total="totalItems"
        @size-change="handleSizeChange" @current-change="handleCurrentChange" />
    </div>
  </el-card>

  <ViewDialog v-model="viewDialogVisible" :chat-history="selectedChatHistory" />
  <CollectDialog v-model="collectDialogVisible" :initial-data="selectedFormData" @submit-success="handleQuery" />
  <UploadDialog v-model="uploadDialogVisible" @upload-success="handleQuery" />

</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue';
import { ElMessage } from 'element-plus';
import ViewDialog from './components/ViewDialog.vue';
import CollectDialog from './components/CollectDialog.vue';
import UploadDialog from './components/UploadDialog.vue';

// --- 类型定义 ---
// （可以考虑将这些类型移动到单独的 types.ts 文件中）
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
// 查询与表格
const searchParams = reactive({ userId: '', date: '' });
const isTableLoading = ref(false);
const tableData = ref<TableRow[]>([]);
const totalItems = ref(0);

// 分页
const pagination = reactive({
  page: 1,
  pageSize: 10,
});

// 对话框
const viewDialogVisible = ref(false);
const collectDialogVisible = ref(false);
const uploadDialogVisible = ref(false);

// 用于传递给子组件的数据
const selectedChatHistory = ref<ChatMessage[]>([]);
const selectedFormData = ref<FormData | null>(null);

// --- 核心方法 ---
// 查询表格数据
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
    // **TODO: 替换为真实的 axios API 请求**
    // const res = await yourApi.query(params);
    // 模拟后端返回的数据结构
    const mockResponse = {
      total: 2,
      records: [
        { id: 1, userId: 'User001', date: '2025-08-29', status: '已完成' },
        { id: 2, userId: 'User002', date: '2025-08-29', status: '处理中' },
      ]
    };
    tableData.value = mockResponse.records;
    totalItems.value = mockResponse.total;
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
    // **TODO: 替换为真实的 axios API 请求**
    // const res = await yourApi.getChatHistory(row.id);
    selectedChatHistory.value = [
      { speaker: '客服', text: '您好，这里是xx客服中心。' },
      { speaker: '用户', text: '你好，我想咨询一下。' },
    ];
    viewDialogVisible.value = true;
  } catch (error) {
    ElMessage.error('获取通话详情失败！');
  }
};

const handleCollect = async (row: TableRow) => {
  try {
    // **TODO: 替换为真实的 axios API 请求**
    // const res = await yourApi.getFormData(row.id);
    selectedFormData.value = {
      id: row.id,
      name: '张三', age: 30, phone: '13800138000', notes: '用户咨询订单物流状态。'
    };
    collectDialogVisible.value = true;
  } catch (error) {
    ElMessage.error('获取表单数据失败！');
  }
};
</script>

<style scoped>
.page-container {
  min-height: calc(100vh - 100px);
}

.action-bar {
  display: flex;
  justify-content: flex-start;
  margin-bottom: 16px;
}

.pagination-container {
  display: flex;
  justify-content: flex-end;
  margin-top: 16px;
}
</style>