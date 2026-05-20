// 通用工具函数（例如格式化日期）
export function formatDate(dateStr) {
  const date = new Date(dateStr)
  return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`
}