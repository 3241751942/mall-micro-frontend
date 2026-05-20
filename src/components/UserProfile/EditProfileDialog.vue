<template>
  <el-dialog title="编辑资料" v-model="dialogVisible" width="500px" @close="resetForm">
    <el-form :model="form" :rules="rules" ref="formRef" label-width="80px">
      <el-form-item label="昵称" prop="nickname">
        <el-input v-model="form.nickname" />
      </el-form-item>
      <el-form-item label="手机号" prop="phone">
        <el-input v-model="form.phone" />
      </el-form-item>
      <el-form-item label="邮箱" prop="email">
        <el-input v-model="form.email" />
      </el-form-item>
      <el-form-item label="头像URL" prop="avatar">
        <el-input v-model="form.avatar" placeholder="请输入头像图片URL" />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="dialogVisible = false">取消</el-button>
      <el-button type="primary" @click="handleSave">保存</el-button>
    </template>
  </el-dialog>
</template>

<script setup>
import { ref, reactive, watch } from 'vue'
import { ElMessage } from 'element-plus'

const props = defineProps({
  visible: Boolean,
  userInfo: {
    type: Object,
    default: () => ({})
  }
})
const emit = defineEmits(['update:visible', 'save'])

const dialogVisible = ref(false)
const formRef = ref(null)
const form = reactive({
  nickname: '',
  phone: '',
  email: '',
  avatar: ''
})

const rules = {
  nickname: [{ required: true, message: '请输入昵称', trigger: 'blur' }],
  phone: [
    { required: true, message: '请输入手机号', trigger: 'blur' },
    { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号', trigger: 'blur' }
  ],
  email: [
    { required: true, message: '请输入邮箱', trigger: 'blur' },
    { type: 'email', message: '请输入正确的邮箱地址', trigger: 'blur' }
  ]
}

watch(() => props.visible, (val) => {
  dialogVisible.value = val
  if (val) {
    form.nickname = props.userInfo.nickname || ''
    form.phone = props.userInfo.phone || ''
    form.email = props.userInfo.email || ''
    form.avatar = props.userInfo.avatar || ''
  }
})

watch(dialogVisible, (val) => {
  emit('update:visible', val)
})

const resetForm = () => {
  formRef.value?.resetFields()
}

const handleSave = async () => {
  if (!formRef.value) return
  await formRef.value.validate()
  emit('save', { ...form })
  dialogVisible.value = false
}
</script>