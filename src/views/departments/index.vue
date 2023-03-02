<template>
  <div class="dashboard-container">
    <div class="app-container">
      <!-- 组织结构内容 -->
      <el-card class="tree-card">
        <!-- 放置结构内容 -->
        <el-row type="flex" justify="space-between" align="middle" style="height: 40px">
          <el-col>
            <!-- 左侧内容 -->
            <span>江苏传智播客教育科技股份有限公司</span>
          </el-col>
          <el-col :span="4">
            <!-- 右侧内容 -->
            <el-row type="flex" justify="end">
              <!-- 两个内容 -->
              <el-col>负责人</el-col>
              <el-col>
                <!-- 放置下拉菜单 -->
                <el-dropdown>
                  <!-- 内容 -->
                  <span>操作
                    <i class="el-icon-arrow-down" />
                  </span>
                  <!-- 具名插槽 -->
                  <el-dropdown-menu slot="dropdown">
                    <!-- 下拉选项 -->
                    <el-dropdown-item>添加子部门</el-dropdown-item>
                  </el-dropdown-menu>
                </el-dropdown>
              </el-col>
            </el-row>

          </el-col>

        </el-row>
        <!--放置一个属性   这里的props和我们之前学习的父传子 的props没关系-->
        <el-tree :data="list" :props="defaultProps" />
      </el-card>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      defaultProps: {
        label: 'name'
      },
      list: [
        {
          name: '总裁办',
          children: [{ name: '董事会' }]
        },
        { name: '行政部' },
        { name: '人事部' }
      ]
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
