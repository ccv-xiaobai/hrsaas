<template>
  <!-- 新增部门的弹层 -->
  <el-dialog title="新增部门" :visible="showDialog" @close="btnCancel">
    <!-- 表单组件  el-form   label-width设置label的宽度   -->
    <!-- 匿名插槽 -->
    <el-form ref="deptForm" :model="formDate" :rules="rules" label-width="120px">
      <el-form-item label="部门名称" prop="name">
        <el-input v-model="formDate.name" style="width:80%" placeholder="1-50个字符" />
      </el-form-item>

      <el-form-item label="部门编码" prop="code">
        <el-input v-model="formDate.code" style="width:80%" placeholder="1-50个字符" />
      </el-form-item>

      <el-form-item label="部门负责人" prop="manager">
        <el-select v-model="formDate.manager" style="width:80%" placeholder="请选择" @focus="getEmployeeSimple">
          <!-- 需要循环生成选项   这里做一下简单的处理 显示的是用户名 存的也是用户名-->
          <el-option v-for="item in peoples" :key="item.id" :label="item.username" :value="item.username" />
        </el-select>
      </el-form-item>

      <el-form-item label="部门介绍" prop="introduce">
        <el-input v-model="formDate.introduce" style="width:80%" placeholder="1-300个字符" type="textarea" :rows="3" />
      </el-form-item>
    </el-form>
    <!-- el-dialog有专门放置底部操作栏的 插槽  具名插槽 -->
    <el-row slot="footer" type="flex" justify="center">
      <!-- 列被分为24 -->
      <el-col :span="6">
        <el-button type="primary" size="small" @click="btnOK">确定</el-button>
        <el-button size="small" @click="btnCancel">取消</el-button>
      </el-col>
    </el-row>
  </el-dialog>
</template>

<script>
import { getDepartments, addDepartments } from '@/api/departments'
import { getEmployeeSimple } from '@/api/employees'
export default {
  props: {
    showDialog: {
      type: Boolean,
      default: false // 默认不显示
    },
    // 当前操作的节点
    treeNode: {
      type: Object,
      default: null
    }
  },
  data() {
    // 定义一个函数 去找 同级部门下是否有重复的部门名称
    const checkNameRepeat = async(rule, value, callback) => {
      // value 是部门名称 要去和同级部门下的部门去比较 有没有相同的 有相同的 不能过 / 不相同就可以
      // 先要获取最新的组织架构数据
      const { depts } = await getDepartments()
      // 去找同级部门下 有没有和value相同的数据
      // 找到同级部门所有的子部门
      const isRepeat = depts.filter(item => item.pid === this.treeNode.id).some(item => item.name === value)
      // 如果isRepeat 为true , 表示找到了一样的名字
      isRepeat ? callback(new Error(`同级部门下已经存在这个${value}部门！`)) : callback()
    }
    // 检查编码重复
    const checkCodeRepeat = async(rule, value, callback) => {
      const { depts } = await getDepartments()
      // 要求编码 和 所有的部门编码都不能重复 由于历史数据有可能没有code 所有这里加一个强制性条件 value值不为空
      const isRepeat = depts.some(item => item.code === value && value)
      isRepeat ? callback(new Error(`组织架构下已经存在这个${value}编码！`)) : callback()
    }

    return {
      // 定义表单的数据结构
      formDate: {
        name: '', // 部门名称
        code: '', // 部门编码
        manager: '', // 部门管理者
        introduce: '' // 部门介绍
      },
      // 定义校验规则
      rules: {
        name: [{ required: true, message: '部门名称不能为空', trigger: 'blur' },
          { min: 1, max: 50, message: ' 部门名称要求1-50个字符', trigger: 'blur' },
          { trigger: 'blur', validator: checkNameRepeat }],
        code: [{ required: true, message: '部门编码不能为空', trigger: 'blur' },
          { min: 1, max: 50, message: '部门编码要求1-50个字符', trigger: 'blur' },
          { trigger: 'blur', validator: checkCodeRepeat }],
        manager: [{ required: true, message: '部门负责人不能为空', trigger: 'blur' }],
        introduce: [{ required: true, message: '部门介绍不能为空', trigger: 'blur' },
          { min: 1, max: 300, message: ' 部门介绍要求1-300个字符', trigger: 'blur' }]
      },
      peoples: []
    }
  },
  methods: {
    // 获取员工简单类表数据
    async getEmployeeSimple() {
      this.peoples = await getEmployeeSimple()
      // console.log(res)
    },
    btnOK() {
      // 手动校验表单
      this.$refs.deptForm.validate(async isOK => {
        if (isOK) {
          // 表单校验通过
          // 调用新增接口 添加父部门的id
          await addDepartments({ ...this.formDate, pid: this.treeNode.id })
          // 告诉父组件，重新拉取数据
          this.$emit('addDepts') // 触发一个自定义事件
          // 此时应该去修改showDialog值
          this.$emit('update:showDialog1', false)
          // 关闭dialog的时候会 触发el-dialog的close事件
          // 所以这里不需要再单独重置数据了
        }
      })
    },
    btnCancel() {
      this.$refs.deptForm.resetFields() // 重置校验字段
      // 关闭弹层
      this.$emit('update:showDialog1', false)
    }
  }
}
</script>

<style>

</style>
