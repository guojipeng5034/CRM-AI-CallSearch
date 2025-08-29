<template>
  <el-dialog v-model="dialogVisible" title="数据注入端口 | BATCH UPLOAD" width="70%" @close="handleClose">
    <el-upload
      ref="uploadRef"
      v-model:file-list="fileList"
      :http-request="handleCustomUpload"
      :auto-upload="false"
      :on-change="handleFileChange"
      :on-remove="handleFileRemove"
      multiple
      drag
      class="upload-area"
    >
      <el-icon class="el-icon--upload" :size="60"><UploadFilled /></el-icon>
      <div class="el-upload__text">
        拖拽文件至此 或 <em>点击选择</em>
      </div>
      <template #tip>
        <div class="el-upload__tip">
          SYSTEM READY | 支持 .mp3, .wav 格式音频数据流
        </div>
      </template>
    </el-upload>

    <div class="tech-divider">
      <span>上传队列</span>
    </div>

    <div class="table-container">
      <el-table :data="fileList" stripe border height="250px">
        <el-table-column prop="name" label="文件名" min-width="200" />
        <el-table-column label="大小" width="120">
          <template #default="{ row }">
            {{ (row.size / 1024 / 1024).toFixed(2) }} MB
          </template>
        </el-table-column>
        <el-table-column label="状态" width="120">
          <template #default="{ row }">
            <el-tag :type="getStatus(row.status).type" effect="dark" size="small">
              {{ getStatus(row.status).text }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="100">
            <template #default="{ row, $index }">
                <el-button type="danger" link @click="handleRemoveFromTable($index)">移除</el-button>
            </template>
        </el-table-column>
      </el-table>
    </div>

    <template #footer>
        <el-button @click="dialogVisible = false">中断连接</el-button>
        <el-button type="success" @click="startUpload" :loading="isUploading" :disabled="fileList.length === 0">
          {{ isUploading ? '正在注入...' : '开始注入' }}
        </el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { ElMessage, type UploadInstance, type UploadFile, type UploadRawFile, type UploadRequestOptions, type UploadUserFile } from 'element-plus';
import { UploadFilled } from '@element-plus/icons-vue'

// Emits 和 v-model
const emit = defineEmits(['upload-success']);
const dialogVisible = defineModel<boolean>();

const uploadRef = ref<UploadInstance>();
const fileList = ref<UploadUserFile[]>([]);
const isUploading = ref(false);

const handleFileChange = (uploadFile: UploadFile, uploadFiles: UploadUserFile[]) => {
  fileList.value = uploadFiles;
};

const handleFileRemove = (uploadFile: UploadFile, uploadFiles: UploadUserFile[]) => {
  fileList.value = uploadFiles;
}

const handleRemoveFromTable = (index: number) => {
    fileList.value.splice(index, 1);
}

const handleCustomUpload = async (options: UploadRequestOptions) => {
    const { file, onSuccess, onError } = options;
    const formData = new FormData();
    formData.append('file', file);
    formData.append('fileName', file.name);

    try {
        await new Promise(resolve => setTimeout(resolve, Math.random() * 2000 + 500));
        if (Math.random() > 0.3) {
            onSuccess({}); 
            ElMessage.success(`${file.name} 数据注入成功`);
        } else {
            throw new Error('模拟注入失败');
        }
    } catch (error) {
        console.error(`${file.name} 注入失败`, error);
        onError(error as Error);
        ElMessage.error(`${file.name} 注入失败`);
    }
};

const startUpload = async () => {
    if (!fileList.value.length) {
        ElMessage.warning('请选择数据文件！');
        return;
    }
    isUploading.value = true;
    uploadRef.value!.submit();

    const uploadPromises = fileList.value
      .filter(file => file.status === 'ready')
      .map(file => {
        return new Promise((resolve, reject) => {
          const originalOnSuccess = file.onSuccess;
          const originalOnError = file.onError;
          file.onSuccess = (response, uploadFile) => {
            originalOnSuccess?.(response, uploadFile);
            resolve(uploadFile);
          };
          file.onError = (error, uploadFile) => {
            originalOnError?.(error, uploadFile);
            reject(error);
          };
        });
      });

    try {
      await Promise.allSettled(uploadPromises);
      emit('upload-success');
    } finally {
      isUploading.value = false;
    }
};

const getStatus = (status: UploadFile['status']) => {
  switch (status) {
    case 'ready':
      return { text: '待命', type: 'info' };
    case 'uploading':
      return { text: '注入中...', type: '' };
    case 'success':
      return { text: '成功', type: 'success' };
    case 'fail':
      return { text: '失败', type: 'danger' };
    default:
      return { text: '待命', type: 'info' };
  }
};

const handleClose = () => {
    uploadRef.value!.clearFiles();
}
</script>