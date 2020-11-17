<template>
  <div>
    <a-breadcrumb style="margin: 16px 0">
      <a-breadcrumb-item>Homw</a-breadcrumb-item>
      <a-breadcrumb-item>Welcome</a-breadcrumb-item>
    </a-breadcrumb>
    <div :style="{ padding: '24px', background: '#fff', minHeight: '360px' }">
      <a-form>
        <a-row>
          <a-col :span="12">
            <a-row :gutter="18">
              <a-col :span="16">
                <a-form-item :wrapperCol="{ span: 24 }">
                  <!-- 搜索框 -->
                  <a-input-search size="large" placeholder="请输入内容" />
                </a-form-item>
              </a-col>
              <!-- 添加有用户 -->
              <a-col :span="8">
                <a-button type="primary" size="large"> 添加用户 </a-button>
              </a-col>
            </a-row>
          </a-col>
        </a-row>
      </a-form>
    </div>
  </div>
</template>

<script>
export default {};
</script>

<style></style>
