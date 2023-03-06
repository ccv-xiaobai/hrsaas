<template>
  <div class="dashboard-container">
    <div class="app-container">
      <page-tools :show-before="true">
        <!-- 左侧显示总记录数 -->
        <!-- <span slot="before">共16条数据</span> -->
        <template v-slot:before>共{{ page.total }}条数据</template>
        <!-- 右侧显示三个按钮 excel导入 excel导出 新增员工 -->
        <template v-slot:after>
          <el-button size="small" type="success" @click="$router.push('/import')">excel导入</el-button>
          <el-button size="small" type="danger" @click="exportData">excel导出</el-button>
          <el-button icon="plus" size="small" type="primary" @click="showDialog = true">新增员工</el-button>
        </template>
      </page-tools>
      <!-- 表格组件 -->
      <el-card>
        <el-table v-loading="loading" border :data="list">
          <el-table-column label="序号" sortable="" type="index" />
          <el-table-column label="姓名" sortable="" prop="username" />
          <el-table-column label="工号" sortable="" prop="workNumber" />
          <el-table-column label="聘用形式" sortable="" :formatter="formatEmployment" prop="formOfEmployment" />
          <el-table-column label="部门" sortable="" prop="departmentName" />
          <!-- 作用域插槽 + 过滤器 -->
          <el-table-column label="入职时间" sortable="" prop="timeOfEntry" align="center">
            <!-- <template slot-scope="obj"></template> -->
            <template v-slot="{row}">
              {{ row.timeOfEntry | formatDate }}
            </template>
          </el-table-column>
          <el-table-column label="账户状态" sortable="" prop="enableState" align="center">
            <template v-slot="{row}">
              <el-switch :value="row.enableState === 1" />
            </template>
          </el-table-column>
          <el-table-column label="操作" sortable="" fixed="right" width="280">
            <template slot-scope="{row}">
              <el-button type="text" size="small" @click="$router.push(`/employees/detail/${row.id}`)">查看</el-button>
              <el-button type="text" size="small">转正</el-button>
              <el-button type="text" size="small">调岗</el-button>
              <el-button type="text" size="small">离职</el-button>
              <el-button type="text" size="small">角色</el-button>
              <el-button type="text" size="small" @click="deleteEmployee(row.id)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <!-- 放置分页组件 -->
        <el-row type="flex" justify="center" align="middle" style="height: 60px">
          <el-pagination
            layout="prev,pager,next"
            :page-size="page.size"
            :current-page="page.page"
            :total="page.total"
            @current-change="changePage"
          />
        </el-row>
      </el-card>
    </div>
    <!-- 放置组件弹层 -->
    <add-demployee :show-dialog.sync="showDialog" @getEmployeeList="getEmployeeList()" />
  </div>
</template>

<script>
import { delEmployee, getEmployeeList } from '@/api/employees'
import EmployeeEnum from '@/api/constant/employees' // 引入员工的枚举对象
import AddDemployee from '@/views/employees/components/add-employee.vue'
import { formatDate } from '@/filters'
export default {
  components: { AddDemployee },
  data() {
    return {
      list: [], // 接收数组
      page: {
        page: 1,
        size: 10,
        total: 0 // 分页总数
      },
      loading: false, // 显示遮罩层
      showDialog: false // 默认关闭的弹层
    }
  },
  created() {
    this.getEmployeeList()
  },
  methods: {
    async getEmployeeList() {
      this.loading = true
      const { total, rows } = await getEmployeeList(this.page)
      this.page.total = total
      this.list = rows
      this.loading = false
    },
    changePage(newPage) {
      // newPage最新的页码
      this.page.page = newPage // 赋值最新的页码
      this.getEmployeeList() // 重新拉取数据
    },
    // 格式化聘用形式
    formatEmployment(row, column, cellValue, index) {
      // console.log(1) // 有多少条数据就执行多少次1
      // row 当前行的数据
      // column 列的属性
      // cellValue 单元格的值 每一行里面聘用形式的值
      // 要去找1所对应的值

      // 要去找 1所对应的值
      const obj = EmployeeEnum.hireType.find(item => item.id === cellValue)
      return obj ? obj.value : '未知'
    },
    // 删除员工
    async deleteEmployee(id) {
      try {
        await this.$confirm('您确定要删除该员工吗')
        await delEmployee(id)
        this.getEmployeeList()
        this.$message.success('删除员工成功')
      } catch (error) {
        console.log(error)
      }
    }, // 导出excel
    exportData() {
      const headers = {
        '姓名': 'username',
        '手机号': 'mobile',
        '入职日期': 'timeOfEntry',
        '聘用形式': 'formOfEmployment',
        '转正日期': 'correctionTime',
        '工号': 'workNumber',
        '部门': 'departmentName'
      }
      // 懒加载
      import('@/vendor/Export2Excel').then(async excel => {
      // excel是引入文件的导出对象
      // 导出  header从哪里来 data从哪里来
      // 现在没有一个接口获取所有的数据
      // 获取员工的接口 页码 每页条数 100 1
        const { rows } = await getEmployeeList({ page: 1, size: this.page.total })
        const data = this.formatJson(headers, rows)
        const multiHeader = [['姓名', '主要信息', '', '', '', '', '部门']]
        const merges = ['A1:A2', 'B1:F1', 'G1:G2']
        excel.export_json_to_excel({
          header: Object.keys(headers), // ['姓名', '工资','入职日期']
          data,
          filename: '员工资料表',
          multiHeader, // 复杂表头
          merges // 合并选项
        })
        /*  excel.export_json_to_excel({
          header: ['姓名', '工资'],
          data: [['张三', 3000], ['李四', 5000]],
          filename: '员工信息表',
          bookType: 'xlsx'
        }) */
        // [{ username:'张三', mobile: 15265485654 }] => [[  ]]
        // 不但要转化数据结构 还要和表头的顺序对应上
        // 要求 转出的标题是中文
      })
    },

    // 将表头数据和导出数据对应
    // [{}] => [[]]
    formatJson(headers, rows) {
      return rows.map(item => {
        // item是一个对象 { username:'张三',  mobile:15245845685 }
        // ['姓名', '手机号','入职日期']
        return Object.keys(headers).map(key => { // key => 姓名
        // 需要判断 字段
          if (headers[key] === 'timeOfEntry' || headers[key] === 'correctionTime') {
          // 格式化日期  import { formatDate } from '@/filters'
            return formatDate(item[headers[key]])
          } else if (headers[key] === 'formOfEmployment') {
            // 1 2 import EmployeeEnum from '@/api/constant/employees' // 引入员工的枚举对象
            const obj = EmployeeEnum.hireType.find(obj => obj.id === item[headers[key]]) // 此处find里的变量名不能重复！！！
            return obj ? obj.value : '未知'
          }

          // headers[key]转为英文 姓名 => username
          // item[headers[key]]  => item.username => 张三
          return item[headers[key]] // 返回一个姓名 张三
        })
        // [ '张三' ,15223568545 ,  '2023-3-6' , '' ]
      })
    }
  }

}
</script>

<style>

</style>
