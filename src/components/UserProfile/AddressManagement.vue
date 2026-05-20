<template>
  <div>
    <div v-if="loading">加载中...</div>
    <div v-else>
      <div class="address-list">
        <div
          v-for="addr in addressList"
          :key="addr.id"
          class="address-item"
          :class="{ 'default-addr': addr.isDefault === 1 || addr.isDefault === true }"
        >
          <div><strong>{{ addr.receiverName }}</strong> {{ addr.phone }}</div>
          <div>{{ addr.province }} {{ addr.city }} {{ addr.district }} {{ addr.detail }}</div>
          <div class="address-actions">
            <el-button type="primary" link @click="editAddress(addr)">编辑</el-button>
            <el-button type="danger" link @click="deleteAddressHandler(addr.id)">删除</el-button>
            <el-button
              v-if="!(addr.isDefault === 1 || addr.isDefault === true)"
              type="info"
              link
              @click="setDefault(addr.id)"
            >设为默认</el-button>
            <span v-else class="default-badge">默认地址</span>
          </div>
        </div>
      </div>
      <el-button type="primary" @click="openAddAddressDialog">新增地址</el-button>
    </div>

    <!-- 地址对话框 -->
    <el-dialog :title="dialogTitle" v-model="dialogVisible" width="500px">
      <el-form :model="addressForm" :rules="addressRules" ref="addressFormRef" label-width="100px">
        <el-form-item label="收货人" prop="receiverName">
          <el-input v-model="addressForm.receiverName" />
        </el-form-item>
        <el-form-item label="手机号" prop="phone">
          <el-input v-model="addressForm.phone" />
        </el-form-item>
        <el-form-item label="省份" prop="province">
          <el-input v-model="addressForm.province" />
        </el-form-item>
        <el-form-item label="城市" prop="city">
          <el-input v-model="addressForm.city" />
        </el-form-item>
        <el-form-item label="区/县" prop="district">
          <el-input v-model="addressForm.district" />
        </el-form-item>
        <el-form-item label="详细地址" prop="detail">
          <el-input v-model="addressForm.detail" type="textarea" />
        </el-form-item>
        <el-form-item label="设为默认">
          <el-switch v-model="addressForm.isDefault" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="submitAddress">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import {
  getAddressList,
  addAddress,
  updateAddress,
  deleteAddress,
  setDefaultAddress
} from '@/api/user'

const addressList = ref([])
const loading = ref(false)
const dialogVisible = ref(false)
const dialogTitle = ref('新增地址')
const addressFormRef = ref(null)
const addressForm = reactive({
  id: null,
  receiverName: '',
  phone: '',
  province: '',
  city: '',
  district: '',
  detail: '',
  isDefault: false
})
const addressRules = {
  receiverName: [{ required: true, message: '请输入收货人', trigger: 'blur' }],
  phone: [
    { required: true, message: '请输入手机号', trigger: 'blur' },
    { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号', trigger: 'blur' }
  ],
  province: [{ required: true, message: '请输入省份', trigger: 'blur' }],
  city: [{ required: true, message: '请输入城市', trigger: 'blur' }],
  district: [{ required: true, message: '请输入区/县', trigger: 'blur' }],
  detail: [{ required: true, message: '请输入详细地址', trigger: 'blur' }]
}

const fetchAddresses = async () => {
  loading.value = true
  try {
    const res = await getAddressList()
    addressList.value = res || []
  } catch (error) {
    console.error('获取地址失败', error)
    ElMessage.error('获取地址失败')
  } finally {
    loading.value = false
  }
}

const deleteAddressHandler = async (id) => {
  try {
    await deleteAddress(id)
    ElMessage.success('删除成功')
    fetchAddresses()
  } catch (error) {
    ElMessage.error('删除失败')
  }
}

const setDefault = async (id) => {
  try {
    await setDefaultAddress(id)
    ElMessage.success('设置默认地址成功')
    fetchAddresses()
  } catch (error) {
    ElMessage.error('设置失败')
  }
}

const openAddAddressDialog = () => {
  dialogTitle.value = '新增地址'
  Object.assign(addressForm, {
    id: null,
    receiverName: '',
    phone: '',
    province: '',
    city: '',
    district: '',
    detail: '',
    isDefault: false
  })
  dialogVisible.value = true
}

const editAddress = (addr) => {
  dialogTitle.value = '编辑地址'
  Object.assign(addressForm, {
    id: addr.id,
    receiverName: addr.receiverName,
    phone: addr.phone,
    province: addr.province,
    city: addr.city,
    district: addr.district,
    detail: addr.detail,
    isDefault: addr.isDefault === 1 || addr.isDefault === true
  })
  dialogVisible.value = true
}

const submitAddress = async () => {
  if (!addressFormRef.value) return
  await addressFormRef.value.validate()
  const data = {
    receiverName: addressForm.receiverName,
    phone: addressForm.phone,
    province: addressForm.province,
    city: addressForm.city,
    district: addressForm.district,
    detail: addressForm.detail,
    isDefault: addressForm.isDefault ? 1 : 0
  }
  try {
    if (addressForm.id) {
      await updateAddress(addressForm.id, data)
      ElMessage.success('修改成功')
    } else {
      await addAddress(data)
      ElMessage.success('新增成功')
    }
    dialogVisible.value = false
    fetchAddresses()
  } catch (error) {
    const msg = error.response?.data?.message || error.message || '操作失败'
    ElMessage.error(msg)
  }
}

onMounted(() => {
  fetchAddresses()
})
</script>

<style scoped>
.address-list {
  margin-bottom: 16px;
}
.address-item {
  padding: 12px;
  border-bottom: 1px solid #eee;
  margin-bottom: 8px;
  border-radius: 8px;
  transition: all 0.2s;
}
.address-item.default-addr {
  background: #f0f9ff;
  border-left: 4px solid #ff6a00;
}
.default-badge {
  color: #ff6a00;
  font-size: 12px;
  margin-left: 10px;
}
.address-actions {
  margin-top: 8px;
}
</style>