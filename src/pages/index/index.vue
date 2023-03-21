<script setup lang="ts">
import { test } from "@/apis";
</script>

<template>
  <view>
    <button @click="test({ config: true })({})">
      发送请求
    </button>
  </view>
</template>

<style>

</style>
