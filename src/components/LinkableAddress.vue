<script setup lang="ts">
const props = defineProps({
  address: String,
});
</script>

<template>
  <span v-if="!props.address">❌</span>
  <a
    v-else
    target="_blank"
    :href="`https://cronoscan.com/address/${props.address}`"
    >{{ props.address }}</a
  >
</template>
