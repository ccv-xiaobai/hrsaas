<template>
  <div class="dashboard-container">
    <div class="app-container">
      <!-- 组织结构内容 -->
      <el-card class="tree-card">
        <!-- 放置结构内容 -->
        <tree-tools :tree-node="company" :is-root="true" @addDepts="addDepts" />
        <!--放置一个属性   这里的props和我们之前学习的父传子 的props没关系-->
        <el-tree :data="departs" :props="defaultProps" :default-expand-all="true">
          <!-- 传入内容 插槽内容 会循环多次 有多少节点 就循环多少次-->
          <!-- 作用域插槽 slot-scope='obj' 接收传递给插槽的数据 data 就是每个节点的数据对象-->
          <tree-tools slot-scope="{data}" :tree-node="data" @delDepts="getDepartments" @addDepts="addDepts" />
        </el-tree>
      </el-card>
      <!-- 放置新增弹层组件 -->
      <add-dept :show-dialog1.sync="showDialog" :show-dialog="showDialog" :tree-node="node" @addDepts="getDepartments" />
    </div>
  </div>

</template>

<script>
import TreeTools from './components/tree-tooles.vue'
import { getDepartments } from '@/api/departments'
import { tranListToTreeData } from '@/utils/index'
import AddDept from './components/add-dept' // 引入新增部门组件
export default {
  components: {
    TreeTools,
    AddDept
  },
  data() {
    return {
      company: { },
      departs: [],
      defaultProps: {
        label: 'name' // 表示 从这个属性显示内容
      },
      showDialog: false, //  默认不显示弹窗
      node: null // 记录当前点击的node节点
    }
  },
  created() {
    this.getDepartments() // 调用自身的方法
  },
  methods: {

    async getDepartments() {
      const result = await getDepartments()
      this.company = { name: result.companyName, manager: '负责人', id: '' }
      this.departs = tranListToTreeData(result.depts, '') // 需要将其转化为树形结构
      console.log(result)
    },
    // 监听tree-tools中触发的点击添加子部门事件
    addDepts(node) {
      this.showDialog = true // 显示弹层
      // 因为node是当前的点击的部门， 此时这个部门应该记录下来,
      this.node = node
    }
  }

}
</script>

<style scoped>
.tree-card {
  padding: 30px  140px;
  font-size:14px;
}
</style>
