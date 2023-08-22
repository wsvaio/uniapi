<script setup lang="ts">
import { test } from "@/apis";

const handleClick = () =>
	test({ body: { a: 1 }, q: { id: 1 } });
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
