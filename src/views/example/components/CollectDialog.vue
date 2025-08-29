<template>
  <el-dialog v-model="dialogVisible" title="数据采集终端 | DATA COLLECTION" width="600px" :close-on-click-modal="false">
    <el-form ref="formRef" :model="formData" :rules="formRules" label-position="top" class="collect-form">
      <el-form-item label="姓名 (NAME)" prop="name">
        <el-input v-model="formData.name" placeholder="输入目标姓名"></el-input>
      </el-form-item>
      <el-form-item label="年龄 (AGE)" prop="age">
        <el-input v-model.number="formData.age" type="number" placeholder="输入目标年龄"></el-input>
      </el-form-item>
      <el-form-item label="电话 (PHONE)" prop="phone">
        <el-input v-model="formData.phone" placeholder="输入目标电话"></el-input>
      </el-form-item>
       <el-form-item label="备注 (NOTES)" prop="notes">
        <el-input v-model="formData.notes" type="textarea" :rows="3" placeholder="输入备注信息..."></el-input>
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="dialogVisible = false">取消</el-button>
      <el-button type="primary" @click="submitForm" :loading="isFormSubmitting">确认提交</el-button>
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

watch(() => props.initialData, (newData) => {
  // 当对话框可见时才填充数据，避免在后台不可见时更新
  if (dialogVisible.value && newData) {
    Object.assign(formData, newData);
  } else {
    // 关闭或没有数据时，重置表单和校验状态
    formRef.value?.resetFields();
    formRef.value?.clearValidate();
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
        await new Promise(resolve => setTimeout(resolve, 1000));
        ElMessage.success('数据提交成功！');
        emit('submit-success');
        dialogVisible.value = false;
      } catch (error) {
        console.error("表单提交失败:", error);
        ElMessage.error('数据提交失败，请重试！');
      } finally {
        isFormSubmitting.value = false;
      }
    }
  });
};
</script>