<script setup lang="ts">
import { test } from "@/apis";
const handleClick = () => {
  test({ config: true, body: { a: 1 } })({}).catch((err) => {
    console.log(err);
  });
};
</script>

<template>
  <view>
    <button @click="handleClick">
      发送请求
    </button>
  </view>
</template>

<style>

</style>
