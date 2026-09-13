<template>
  <div class="admin-brand">
    <h2>品牌管理</h2>
    <div class="toolbar">
      <el-input v-model="keyword" placeholder="品牌名称" style="width:200px" clearable @clear="fetchBrands" />
      <el-button type="primary" @click="fetchBrands">搜索</el-button>
      <el-button type="success" @click="openCreateDialog">新增品牌</el-button>
    </div>

    <el-table :data="brandList" border stripe v-loading="loading">
      <el-table-column prop="id" label="ID" width="80" />
      <el-table-column prop="name" label="品牌名称" />
      <el-table-column prop="logo" label="Logo" min-width="200" />
      <el-table-column prop="sort" label="排序" width="80" />
      <el-table-column label="操作" width="150">
        <template #default="{ row }">
          <el-button size="small" type="primary" @click="openEditDialog(row)">编辑</el-button>
          <el-button size="small" type="danger" @click="handleDelete(row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-pagination v-model:current-page="pageNum" v-model:page-size="pageSize" :total="total"
      layout="total, sizes, prev, pager, next" @current-change="fetchBrands" @size-change="fetchBrands" />

    <el-dialog v-model="dialogVisible" :title="dialogTitle" width="500px">
      <el-form :model="form" label-width="80px">
        <el-form-item label="品牌名称" required><el-input v-model="form.name" /></el-form-item>
        <el-form-item label="Logo URL"><el-input v-model="form.logo" /></el-form-item>
        <el-form-item label="排序"><el-input-number v-model="form.sort" :min="0" /></el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" :loading="submitting" @click="submitForm">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { adminGetBrandPage, adminCreateBrand, adminUpdateBrand, adminDeleteBrand } from '@/api/admin/brand'

const brandList = ref([])
const loading = ref(false)
const pageNum = ref(1)
const pageSize = ref(10)
const total = ref(0)
const keyword = ref('')
const dialogVisible = ref(false)
const dialogTitle = ref('')
const form = ref({})
const submitting = ref(false)
const isEdit = ref(false)

const fetchBrands = async () => {
  loading.value = true
  try {
    const res = await adminGetBrandPage({ pageNum: pageNum.value, pageSize: pageSize.value, name: keyword.value })
    brandList.value = res.records || []
    total.value = res.total || 0
  } catch (err) { ElMessage.error('获取品牌列表失败') } finally { loading.value = false }
}

const openCreateDialog = () => { isEdit.value = false; dialogTitle.value = '新增品牌'; form.value = { name: '', logo: '', sort: 0 }; dialogVisible.value = true }
const openEditDialog = (row) => { isEdit.value = true; dialogTitle.value = '编辑品牌'; form.value = { ...row }; dialogVisible.value = true }

const submitForm = async () => {
  submitting.value = true
  try {
    if (isEdit.value) await adminUpdateBrand(form.value.id, form.value)
    else await adminCreateBrand(form.value)
    ElMessage.success(isEdit.value ? '更新成功' : '创建成功')
    dialogVisible.value = false
    fetchBrands()
  } catch (err) { ElMessage.error('操作失败') } finally { submitting.value = false }
}

const handleDelete = async (row) => {
  await ElMessageBox.confirm(`确认删除品牌“${row.name}”吗？`, '提示', { type: 'warning' })
  try {
    await adminDeleteBrand(row.id)
    ElMessage.success('删除成功')
    fetchBrands()
  } catch (err) { ElMessage.error('删除失败') }
}

onMounted(() => fetchBrands())
</script>

<style lang="scss" scoped>
.admin-brand { padding: 20px; .toolbar { margin-bottom: 20px; display: flex; gap: 10px; } }
</style>