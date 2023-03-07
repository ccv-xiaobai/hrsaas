<template>
  <div>
    <!-- 给action 一个#号 就不会报错了 -->
    <!-- file-List是上传的文件列表 可以绑定到上传组件上能让上传组件来显示 -->
    <!-- upload组件显示的是 file-list -->
    <el-upload
      list-type="picture-card"
      :limit="1"
      action="#"
      :on-preview="preview"
      :on-remove="handleRemove"
      :on-change="changeFile"
      :file-list="fileList"
      :class="{disabled: fileComputed }"
      :before-upload="beforeUpload"
      :http-request="upload"
    >
      <i class="el-icon-plus" />
    </el-upload>
    <el-dialog :visible.sync="showDialog" title="图片预览">
      <img src="imgUrl" alt="" width="100%">
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      fileList: [{ url: '"C:\Users\ASUS\Pictures\微信图片_20210825161010.jpg"' }],
      showDialog: false,
      imgUrl: ''
    }
  },
  computed: {
    fileComputed() {
      // 如果它为true 表示就不显示 +号上传了
      return this.fileList.length === 1
    }
  },
  methods: {
    // 点击预览事件
    preview(file) {
      console.log(file.url)
      this.imgUrl = file.url
      this.showDialog = true
    },
    handleRemove(file, fileList) {
      // console.log(file) file是要删除的文件
      // console.log(fileList) fileList是删过之后的文件
      this.fileList = this.fileList.filter(item => item.uid !== file.uid) // 将当前的删除文件排除在外
    },

    // 不能用push，因为这个钩子会执行很多次
    changeFile(file, fileList) {
    // file是当前文件 fileList是当前的最新数组
      console.log(fileList)
      this.fileList = fileList.map(item => item)
    },
    beforeUpload(file) {
      const types = ['image/jpeg', 'image/gif', 'image/bmp', 'image/png']
      if (!types.includes(file.type)) {
        this.$message.error('上传图片只能是 JPG、GIF、BMP、PNG 格式!')
        return false
      }
      //  检查大小
      const maxSize = 5 * 1024 * 1024
      if (maxSize < file.size) {
        this.$message.error('图片大小最大不能超过5M')
        return false
      }
      return true
    },
    upload(params) {
      console.log(params.file)
    }
  }
}
</script>

<style>
.disabled .el-upload--picture-card {
  display: none
}
</style>
