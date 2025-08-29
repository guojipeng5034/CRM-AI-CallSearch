<template>
  <el-dialog v-model="dialogVisible" title="数据采集" width="50%" :close-on-click-modal="false">
    <el-form ref="formRef" :model="formData" :rules="formRules" label-width="80px">
      <el-form-item label="姓名" prop="name">
        <el-input v-model="formData.name" placeholder="请输入姓名"></el-input>
      </el-form-item>
      <el-form-item label="年龄" prop="age">
        <el-input v-model.number="formData.age" type="number" placeholder="请输入年龄"></el-input>
      </el-form-item>
      <el-form-item label="电话" prop="phone">
        <el-input v-model="formData.phone" placeholder="请输入电话号码"></el-input>
      </el-form-item>
       <el-form-item label="备注" prop="notes">
        <el-input v-model="formData.notes" type="textarea" placeholder="请输入备注"></el-input>
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="dialogVisible = false">取消</el-button>
      <el-button type="primary" @click="submitForm" :loading="isFormSubmitting">提交表单</el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, reactive, watch } from 'vue';
import { ElMessage, type FormInstance, type FormRules } from 'element-plus';

// 类型定义
interface FormData {
  id: number | null;
  name: string;
  age: number | null;
  phone: string;
  notes: string;
}

// Props 和 Emits
const props = defineProps<{
  initialData: FormData | null;
}>();

const emit = defineEmits(['submit-success']);

// v-model 控制
const dialogVisible = defineModel<boolean>();

// 表单逻辑
const formRef = ref<FormInstance>();
const isFormSubmitting = ref(false);
const formData = reactive<FormData>({
  id: null, name: '', age: null, phone: '', notes: '',
});

// 监听 props 变化，当对话框打开并传入新数据时，填充表单
watch(() => props.initialData, (newData) => {
  if (newData) {
    Object.assign(formData, newData);
  } else {
    // 如果没有传入数据，重置表单
    formRef.value?.resetFields();
  }
});

// 表单验证规则
const formRules = reactive<FormRules>({
  name: [{ required: true, message: '姓名不能为空', trigger: 'blur' }],
  age: [{ type: 'number', min: 1, message: '请输入有效的年龄', trigger: 'blur'}],
  phone: [
      { required: true, message: '电话不能为空', trigger: 'blur' },
      { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号码', trigger: 'blur'}
  ]
});

// 提交
const submitForm = async () => {
  if (!formRef.value) return;
  await formRef.value.validate(async (valid) => {
    if (valid) {
      isFormSubmitting.value = true;
      try {
        console.log('提交表单:', formData);
        // **模拟API调用**
        await new Promise(resolve => setTimeout(resolve, 1000));
        // **TODO: 替换为真实的 axios API 请求**
        // await yourApi.submitForm(formData);
        
        ElMessage.success('表单提交成功！');
        emit('submit-success'); // 通知父组件刷新列表
        dialogVisible.value = false; // 关闭对话框
      } catch (error) {
        console.error("表单提交失败:", error);
        ElMessage.error('表单提交失败，请重试！');
      } finally {
        isFormSubmitting.value = false;
      }
    }
  });
};
</script>