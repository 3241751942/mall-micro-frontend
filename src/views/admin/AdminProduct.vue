<template>
  <div class="admin-product">
    <h2>商品管理</h2>
    <div class="toolbar">
      <el-input v-model="keyword" placeholder="商品名称" style="width:200px" clearable @clear="fetchProducts" />
      <el-button type="primary" @click="fetchProducts">搜索</el-button>
      <el-button type="success" @click="openCreateDialog">新增商品</el-button>
    </div>

    <el-table :data="productList" border stripe v-loading="loading">
      <el-table-column prop="id" label="ID" width="80" />
      <el-table-column prop="name" label="商品名称" min-width="200" />
      <el-table-column prop="price" label="价格" width="100" />
      <el-table-column prop="sales" label="销量" width="80" />
      <el-table-column prop="status" label="状态" width="80">
        <template #default="{ row }">
          <el-tag :type="row.status === 1 ? 'success' : 'danger'">
            {{ row.status === 1 ? '上架' : '下架' }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="220" fixed="right">
        <template #default="{ row }">
          <el-button size="small" type="primary" @click="openEditDialog(row)">编辑</el-button>
          <el-button size="small" :type="row.status === 1 ? 'warning' : 'success'" @click="toggleStatus(row)">
            {{ row.status === 1 ? '下架' : '上架' }}
          </el-button>
          <el-button size="small" type="danger" @click="handleDelete(row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-pagination
      v-model:current-page="pageNum"
      v-model:page-size="pageSize"
      :total="total"
      layout="total, sizes, prev, pager, next"
      @current-change="fetchProducts"
      @size-change="fetchProducts"
    />

    <!-- 新增/编辑对话框 -->
    <el-dialog v-model="dialogVisible" :title="dialogTitle" width="600px">
      <el-form :model="form" label-width="100px">
        <el-form-item label="商品名称" required>
          <el-input v-model="form.name" />
        </el-form-item>
        <el-form-item label="价格" required>
          <el-input-number v-model="form.price" :precision="2" :min="0" />
        </el-form-item>
        <el-form-item label="分类ID" required>
          <el-input-number v-model="form.categoryId" :min="1" />
        </el-form-item>
        <el-form-item label="品牌ID">
          <el-input-number v-model="form.brandId" :min="1" />
        </el-form-item>
        <el-form-item label="描述">
          <el-input type="textarea" v-model="form.description" rows="3" />
        </el-form-item>
        <el-form-item label="图片">
          <el-input v-model="form.images" placeholder="图片URL，多个用逗号分隔" />
        </el-form-item>
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
import { getProductList } from '@/api/product'
import { adminCreateProduct, adminUpdateProduct, adminDeleteProduct, adminChangeProductStatus } from '@/api/admin/product'

const productList = ref([])
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

const fetchProducts = async () => {
  loading.value = true
  try {
    const res = await getProductList({ pageNum: pageNum.value, pageSize: pageSize.value, keyword: keyword.value })
    productList.value = res.records || []
    total.value = res.total || 0
  } catch (err) {
    ElMessage.error('获取商品列表失败')
  } finally {
    loading.value = false
  }
}

const openCreateDialog = () => {
  isEdit.value = false
  dialogTitle.value = '新增商品'
  form.value = { name: '', price: 0, categoryId: null, brandId: null, description: '', images: '' }
  dialogVisible.value = true
}

const openEditDialog = (row) => {
  isEdit.value = true
  dialogTitle.value = '编辑商品'
  form.value = { ...row }
  dialogVisible.value = true
}

const submitForm = async () => {
  submitting.value = true
  try {
    if (isEdit.value) {
      await adminUpdateProduct(form.value.id, form.value)
      ElMessage.success('更新成功')
    } else {
      await adminCreateProduct(form.value)
      ElMessage.success('创建成功')
    }
    dialogVisible.value = false
    fetchProducts()
  } catch (err) {
    ElMessage.error('操作失败')
  } finally {
    submitting.value = false
  }
}

const toggleStatus = async (row) => {
  const newStatus = row.status === 1 ? 0 : 1
  try {
    await adminChangeProductStatus(row.id, newStatus)
    ElMessage.success(`已${newStatus === 1 ? '上架' : '下架'}`)
    fetchProducts()
  } catch (err) {
    ElMessage.error('操作失败')
  }
}

const handleDelete = async (row) => {
  await ElMessageBox.confirm(`确认删除商品“${row.name}”吗？`, '提示', { type: 'warning' })
  try {
    await adminDeleteProduct(row.id)
    ElMessage.success('删除成功')
    fetchProducts()
  } catch (err) {
    ElMessage.error('删除失败')
  }
}

onMounted(() => fetchProducts())
</script>

<style lang="scss" scoped>
.admin-product { padding: 20px; .toolbar { margin-bottom: 20px; display: flex; gap: 10px; } }
</style>