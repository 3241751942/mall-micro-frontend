<template>
  <div class="admin-category">
    <h2>分类管理</h2>
    <div class="toolbar">
      <el-button type="success" @click="openCreateDialog(0, 1)">新增根分类</el-button>
    </div>

    <el-tree
      :data="treeData"
      node-key="id"
      :props="defaultProps"
      default-expand-all
      :expand-on-click-node="false"
    >
      <template #default="{ node, data }">
        <div class="tree-node">
          <span>{{ node.label }}</span>
          <span class="actions">
            <el-button size="small" type="primary" @click="openEditDialog(data)">编辑</el-button>
            <el-button size="small" type="danger" @click="handleDelete(data)">删除</el-button>
            <el-button size="small" type="success" @click="openCreateDialog(data.id, data.level + 1)">
              添加子分类
            </el-button>
          </span>
        </div>
      </template>
    </el-tree>

    <el-dialog v-model="dialogVisible" :title="dialogTitle" width="500px">
      <el-form :model="form" label-width="100px">
        <el-form-item label="分类名称" required>
          <el-input v-model="form.name" />
        </el-form-item>
        <el-form-item label="层级" required>
          <el-select v-model="form.level" :disabled="!!parentId">
            <el-option :label="1" :value="1" />
            <el-option :label="2" :value="2" />
            <el-option :label="3" :value="3" />
          </el-select>
        </el-form-item>
        <el-form-item label="排序">
          <el-input-number v-model="form.sort" :min="0" />
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
import { getCategoryTree } from '@/api/product'
import { adminCreateCategory, adminUpdateCategory, adminDeleteCategory } from '@/api/admin/category'

const treeData = ref([])
const dialogVisible = ref(false)
const dialogTitle = ref('')
const form = ref({})
const submitting = ref(false)
const isEdit = ref(false)
const parentId = ref(null)

// 树形控件字段映射
const defaultProps = {
  label: 'name',
  children: 'children'
}

// 获取分类树
const fetchTree = async () => {
  try {
    const data = await getCategoryTree()
    treeData.value = data || []
  } catch (err) {
    ElMessage.error('获取分类树失败')
  }
}

// 打开新增对话框
const openCreateDialog = (pid, level) => {
  isEdit.value = false
  parentId.value = pid || null
  dialogTitle.value = pid === 0 ? '新增根分类' : '添加子分类'
  form.value = { name: '', level: level, sort: 0, parentId: pid }
  dialogVisible.value = true
}

// 打开编辑对话框
const openEditDialog = (row) => {
  isEdit.value = true
  parentId.value = row.parentId
  dialogTitle.value = '编辑分类'
  form.value = { ...row }
  dialogVisible.value = true
}

// 提交表单
const submitForm = async () => {
  submitting.value = true
  try {
    if (isEdit.value) {
      await adminUpdateCategory(form.value.id, { name: form.value.name, sort: form.value.sort })
      ElMessage.success('更新成功')
    } else {
      await adminCreateCategory({ ...form.value, parentId: parentId.value })
      ElMessage.success('创建成功')
    }
    dialogVisible.value = false
    await fetchTree()
  } catch (err) {
    ElMessage.error('操作失败')
  } finally {
    submitting.value = false
  }
}

// 删除分类
const handleDelete = async (row) => {
  await ElMessageBox.confirm(`确认删除分类“${row.name}”及其子分类吗？`, '提示', { type: 'warning' })
  try {
    await adminDeleteCategory(row.id)
    ElMessage.success('删除成功')
    await fetchTree()
  } catch (err) {
    ElMessage.error('删除失败，请确保没有子分类')
  }
}

onMounted(() => {
  fetchTree()
})
</script>

<style lang="scss" scoped>
.admin-category {
  padding: 20px;
  .toolbar {
    margin-bottom: 20px;
  }
  .tree-node {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    .actions {
      margin-left: 20px;
      .el-button {
        margin-left: 8px;
      }
    }
  }
}
</style>