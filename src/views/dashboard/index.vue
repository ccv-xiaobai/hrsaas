<template>
  <div class="dashboard-container">
    <div class="dashboard-text">name: {{ name }}</div>
    <page-tools :show-before="true">
      <!-- 插槽除了 slot="name" v-slot -->
      <!-- slot="名称" v-slot:名称 -->
      <template v-slot:before>
        <span>我想你们</span>
      </template>
      <template>
        <button slot="after" type="primary">导出excel</button>
      </template>
    </page-tools>
    <upload-excel />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'Dashboard',

  computed: {
    ...mapGetters([
      'name'
    ])
  }
}
</script>

<style lang="scss" scoped>
.dashboard {
  &-container {
    margin: 30px;
  }
  &-text {
    font-size: 30px;
    line-height: 46px;
  }
}
</style>
