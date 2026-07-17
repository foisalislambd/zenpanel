<script setup lang="ts">
import { computed } from "vue";

const props = defineProps<{ content: string }>();

const parts = computed(() => props.content.split(/(\*\*[^*]+\*\*)/g));
</script>

<template>
  <div class="admin-chat-markdown text-sm leading-relaxed">
    <template v-for="(part, i) in parts" :key="i">
      <strong v-if="part.startsWith('**') && part.endsWith('**')" class="font-semibold">
        {{ part.slice(2, -2) }}
      </strong>
      <template v-else>
        <template v-for="(line, j) in part.split('\n')" :key="j">
          {{ line }}<br v-if="j < part.split('\n').length - 1" />
        </template>
      </template>
    </template>
  </div>
</template>
