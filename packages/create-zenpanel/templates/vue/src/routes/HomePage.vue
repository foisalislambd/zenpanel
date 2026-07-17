<script setup lang="ts">
import { adminConfig } from "../lib/config";
import { navigate } from "../lib/router";

const { brand } = adminConfig;

function goLogin(e: MouseEvent) {
  e.preventDefault();
  navigate("/admin/login");
}
</script>

<template>
  <main class="home">
    <div class="home-inner">
      <span class="brand-mark">{{ brand.letter }}</span>
      <h1>{{ brand.name }}</h1>
      <p>Admin panel shell for Vue — Vite + Vue 3.</p>
      <a class="cta" href="/admin/login" @click="goLogin">Admin sign in</a>
    </div>
  </main>
</template>

<style scoped>
.home {
  display: flex;
  min-height: 100dvh;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4rem 1.5rem;
  font-family: "Geist", "Segoe UI", ui-sans-serif, system-ui, sans-serif;
  background: #f9fafb;
  color: #101828;
}
.home-inner {
  max-width: 32rem;
  text-align: center;
}
.brand-mark {
  display: inline-flex;
  height: 3.5rem;
  width: 3.5rem;
  align-items: center;
  justify-content: center;
  border-radius: 1rem;
  background: #465fff;
  font-size: 1.25rem;
  font-weight: 700;
  color: #fff;
}
h1 {
  margin: 1.5rem 0 0;
  font-size: 1.875rem;
  font-weight: 700;
  letter-spacing: -0.025em;
}
p {
  margin: 0.75rem 0 0;
  color: #475467;
}
.cta {
  margin-top: 2rem;
  display: inline-flex;
  height: 2.75rem;
  align-items: center;
  justify-content: center;
  border-radius: 0.5rem;
  background: #465fff;
  padding: 0 1.5rem;
  font-size: 0.875rem;
  font-weight: 600;
  color: #fff;
  text-decoration: none;
}
.cta:hover {
  background: #3641f5;
}
</style>
