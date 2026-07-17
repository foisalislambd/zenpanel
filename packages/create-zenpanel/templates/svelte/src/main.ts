import { mount } from "svelte";
import "./admin.css";
import App from "./App.svelte";
import { initTheme } from "./lib/theme";

initTheme();

const app = mount(App, {
  target: document.getElementById("app")!,
});

export default app;
