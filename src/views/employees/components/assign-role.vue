<template>
  <el-dialog title="分配角色" :visible="showRoleDialog" @close="btnCancel">
    <!-- el-checkbox-group选中的是 当前用户所拥有的角色  需要绑定 当前用户拥有的角色-->
    <el-checkbox-group v-model="roleIds">
      <!-- 选项 -->
      <!-- 要显示角色名称  存储角色id  label表示要存储的值 -->
      <el-checkbox v-for="item in list" :key="item.id" :label="item.id">{{ item.name }}</el-checkbox>
    </el-checkbox-group>
    <!-- 定义footer的插槽 -->
    <el-row slot="footer" type="flex" justify="center">
      <el-col :span="6">
        <el-button size="small" type="primary" @click="btnOK">确定</el-button>
        <el-button size="small" @click="btnCancel">取消</el-button>
      </el-col>
    </el-row>
  </el-dialog>
</template>

<script>
import { getRoleList } from '@/api/setting'
import { getUserDetailById } from '@/api/user'
import { assignRoles } from '@/api/employees'
export default {
  props: {
    showRoleDialog: {
      type: Boolean,
      default: false
    },
    // 用户的id 用来查询当前用户的角色信息
    userId: {
      type: String,
      default: null
    }
  },
  data() {
    return {
      roleIds: [], // 这个数组负责存储 当前用户所拥有的角色id
      list: [] // 角色列表 负责存储当前所有的角色id
    }
  },
  created() {
    this.getRoleList()
  },
  methods: {
    // 获取所有的角色
    async getRoleList() {
      const { rows } = await getRoleList({ page: 1, pagesize: 20 }) // 默认只取10条数据  角色数量 不会太多
      this.list = rows
    },
    // 这个方法是什么时候调用？ props传值是异步的 所有这里不能用 this.userId
    // 这个方法是给父组件调用的
    async getUserDetailById(id) {
      const { roleIds } = await getUserDetailById(id) // 将用户所以有的角色赋值给当前用户的对象
      this.roleIds = roleIds // 赋值本用户的角色
    },
    async btnOK() {
      await assignRoles({ id: this.userId, roleIds: this.roleIds })
      // 关闭窗口
      // this.$emit('update:showRoleDialog', false)
      this.$parent.showRoleDialog = false
    },
    btnCancel() {
      this.roleIds = [] // 重置数组 将他还原成一个空
      this.$emit('update:showRoleDialog', false)
    }
  }
}
</script>

<style>

</style>
