<template>
  <el-row type="flex" justify="space-between" align="middle" style="height: 40px;width: 100%">
    <el-col>
      <!-- 名称应该变成 对应的节点中的name -->
      <span>{{ treeNode.name }}</span>
    </el-col>
    <el-col :span="4">
      <el-row type="flex" justify="end">
        <!-- 两个内容 -->
        <el-col>{{ treeNode.manager }}</el-col>
        <el-col>
          <!-- 下拉菜单 element -->
          <el-dropdown @command="operateDepts">
            <span>
              操作<i class="el-icon-arrow-down" />
            </span>
            <!-- 下拉菜单 -->
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="add">添加子部门</el-dropdown-item>
              <el-dropdown-item v-if="!isRoot" command="edit">编辑部门</el-dropdown-item>
              <el-dropdown-item v-if="!isRoot" command="del">删除部门</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </el-col>
      </el-row>
    </el-col>
  </el-row>
</template>

<script>
import { delDepartments } from '@/api/departments'
// 该组件需要对外开放属性 外部需要提供一个对象 对象里需要有 name manager
export default {
  // props 可以用数组来接收数据 也可以用对象来接收
  // props:{props属性:{ 配置选项 }}
  props: {
    // 定义一个传递的属性
    treeNode: {
      type: Object, // 对象类型
      required: true // 必传

    },
    isRoot: {
      type: Boolean,
      required: false
    }
  },
  methods: {
    // 点击 编辑 删除 新增时候触发
    operateDepts(type) {
      if (type === 'add') {
        // 添加子部门
        // 在当前点击的部门下 添加子部门 => this.treeNode就是当前点击的部门
        this.$emit('addDepts', this.treeNode) // 为何传出treeNode 是因为添加子部门 需要当前部门的数据
      } else if (type === 'edit') {
        // 编辑部门的操作
        this.$emit('editDepts', this.treeNode) // 触发自定义事件 点击谁 编辑谁
      } else {
        // 删除部门的操作
        this.$confirm('确定要删除该部门吗').then(() => {
          // 如果点击了确认就会进入then
          return delDepartments(this.treeNode.id) // 返回promise对象
        }).then(() => {
          // 如果删除成功了，就会进入这里
          // 只需要等到成功的时候 调用接口删除了 后端数据变化了 但是前端没有变 重新获取
          this.$emit('delDepts') // 触发自定义事件
          this.$message.success('删除部门成功')
        })
      }
    }
  }
}
</script>
