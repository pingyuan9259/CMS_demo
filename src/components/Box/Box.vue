<template>
  <div class="box">
    <div class="box-header">
      <slot name="box-header"></slot>
    </div>
    <div class="box-body">
      <slot name="box-body"></slot>
    </div>
  </div>
</template>
<script>

</script>

<style scoped>
  .box {
    border: 1px solid #bfcbd9;
    border-radius: 4px;
    margin-bottom: 44px;
    overflow: hidden;
  }
  .box-header {
    background-color: #eef1f6;
    border-bottom: 1px solid #bfcbd9;
    height: 44px;
    display: flex;
    align-items: center;
    padding-left: 4%;
    font-weight: 500;
  }
  .box-body {
    padding-top: 30px;
    padding-right: 5%;
    padding-left: 3%;
  }
</style>