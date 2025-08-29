<template>
  <el-dialog v-model="dialogVisible" title="批量上传音频文件" width="60%" @close="handleClose">
    <el-upload
      ref="uploadRef"
      v-model:file-list="fileList"
      :http-request="handleCustomUpload"
      :auto-upload="false"
      multiple
      drag
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
    <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="success" @click="startUpload" :loading="isUploading">开始上传</el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { ElMessage, type UploadInstance, type UploadProps, type UploadRequestOptions, type UploadUserFile } from 'element-plus';
import { UploadFilled } from '@element-plus/icons-vue'

// Emits 和 v-model
const emit = defineEmits(['upload-success']);
const dialogVisible = defineModel<boolean>();

const uploadRef = ref<UploadInstance>();
const fileList = ref<UploadUserFile[]>([]);
const isUploading = ref(false);

// 自定义上传方法
const handleCustomUpload = async (options: UploadRequestOptions) => {
    const { file } = options;
    const formData = new FormData();
    formData.append('file', file);
    formData.append('fileName', file.name);

    console.log(`正在上传 ${file.name}...`);
    try {
        // **模拟API调用**
        // 这里模拟一个会随机成功或失败的上传过程
        await new Promise(resolve => setTimeout(resolve, Math.random() * 2000 + 500));
        if (Math.random() > 0.3) { // 70% 概率成功
             // **TODO: 替换为真实的 axios 上传请求**
            // await yourApi.uploadFile(formData);
            console.log(`${file.name} 上传成功`);
            // 返回一个 resolved Promise 表示成功
            return Promise.resolve();
        } else {
            // 抛出错误表示失败
            throw new Error('Simulated upload failure');
        }
    } catch (error) {
        console.error(`${file.name} 上传失败`, error);
        // 抛出错误，让 el-upload 的 on-error 钩子捕获
        return Promise.reject(error);
    }
};

// 点击“开始上传”按钮
const startUpload = () => {
    uploadRef.value!.submit();
    // submit() 方法会触发对列表中所有待上传文件的 http-request 调用
};

// 对话框关闭时清空文件列表
const handleClose = () => {
    uploadRef.value!.clearFiles();
}

</script>