<template>
  <el-dialog v-model="dialogVisible" title="批量上传音频文件" width="70%" @close="handleClose">
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
      <el-icon class="el-icon--upload"><upload-filled /></el-icon>
      <div class="el-upload__text">
        将文件拖到此处，或<em>点击上传</em>
      </div>
      <template #tip>
        <div class="el-upload__tip">
          支持.mp3, .wav等音频格式文件，添加文件后请点击下方“开始上传”按钮
        </div>
      </template>
    </el-upload>

    <el-divider />

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
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="success" @click="startUpload" :loading="isUploading" :disabled="fileList.length === 0">
          {{ isUploading ? '正在上传...' : '开始上传' }}
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
const fileList = ref<UploadUserFile[]>([]); // 这个 fileList 会被 el-upload 和 el-table 共享
const isUploading = ref(false);

// 文件状态变化时的回调 (添加文件、上传成功、上传失败)
const handleFileChange = (uploadFile: UploadFile, uploadFiles: UploadUserFile[]) => {
  // el-upload 内部会自动更新 fileList，我们在这里可以做一些额外的逻辑，
  // 不过当前场景下，我们主要依赖它的自动管理
  console.log('文件列表变化:', uploadFile.name, uploadFile.status);
  fileList.value = uploadFiles;
};

const handleFileRemove = (uploadFile: UploadFile, uploadFiles: UploadUserFile[]) => {
  console.log('文件被移除:', uploadFile.name);
  fileList.value = uploadFiles;
}

// 在表格中点击移除按钮
const handleRemoveFromTable = (index: number) => {
    fileList.value.splice(index, 1);
}

// 自定义上传方法
// el-upload 会为每个待上传文件调用一次这个方法
const handleCustomUpload = async (options: UploadRequestOptions) => {
    const { file, onSuccess, onError } = options;

    const formData = new FormData();
    formData.append('file', file);
    formData.append('fileName', file.name);

    try {
        // **模拟API调用**
        await new Promise(resolve => setTimeout(resolve, Math.random() * 2000 + 500));
        if (Math.random() > 0.3) {
            // **TODO: 替换为真实的 axios 上传请求**
            // const response = await yourApi.uploadFile(formData);
            
            // 调用 onSuccess 会将文件状态标记为 'success'
            onSuccess({}); 
            ElMessage.success(`${file.name} 上传成功`);
        } else {
            throw new Error('模拟上传失败');
        }
    } catch (error) {
        console.error(`${file.name} 上传失败`, error);
        // 调用 onError 会将文件状态标记为 'fail'
        onError(error as Error);
        ElMessage.error(`${file.name} 上传失败`);
    }
};

// 点击“开始上传”按钮
const startUpload = async () => {
    if (!fileList.value.length) {
        ElMessage.warning('请先选择文件！');
        return;
    }
    
    isUploading.value = true;
    // uploadRef.value!.submit() 会触发所有状态为 'ready' 的文件的上传
    uploadRef.value!.submit();

    // 由于 submit() 是非阻塞的，我们需要一种方式来判断所有文件是否都已上传完毕
    // 我们可以通过监听 fileList 中所有文件的状态变化来实现
    // 简单的做法是轮询检查，但更优雅的方式是 Promise.all
    const uploadPromises = fileList.value
      .filter(file => file.status === 'ready') // 只处理待上传的文件
      .map(file => {
        // 为每个文件的上传结果创建一个 Promise
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
      await Promise.allSettled(uploadPromises); // 等待所有上传任务结束（无论成功或失败）
      console.log('所有文件上传任务已完成');
      emit('upload-success'); // 通知父组件刷新
    } finally {
      isUploading.value = false; // 所有上传结束后，取消加载状态
    }
};

// 根据文件状态返回不同的 Tag 类型和文本
const getStatus = (status: UploadFile['status']) => {
  switch (status) {
    case 'ready':
      return { text: '待上传', type: 'info' };
    case 'uploading':
      return { text: '上传中...', type: '' };
    case 'success':
      return { text: '已成功', type: 'success' };
    case 'fail':
      return { text: '失败', type: 'danger' };
    default:
      return { text: '待上传', type: 'info' };
  }
};


// 对话框关闭时清空文件列表
const handleClose = () => {
    uploadRef.value!.clearFiles();
}
</script>

<style scoped>
.upload-area {
  margin-bottom: 20px;
}
.table-container {
  margin-top: 20px;
}
</style>