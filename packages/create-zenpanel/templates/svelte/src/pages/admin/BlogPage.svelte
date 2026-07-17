<script lang="ts">
  import ResourcePage from "@/components/admin/shared/ResourcePage.svelte";
  import { adminBlogPosts } from "@/lib/admin-data/resources";
</script>

<ResourcePage title="Blog" resourceLabel="post" items={adminBlogPosts} />
