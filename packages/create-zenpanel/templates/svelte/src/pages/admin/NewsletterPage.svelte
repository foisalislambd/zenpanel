<script lang="ts">
  import ResourcePage from "@/components/admin/shared/ResourcePage.svelte";
  import { adminNewsletter } from "@/lib/admin-data/resources";
</script>

<ResourcePage
  title="Newsletter"
  resourceLabel="subscriber"
  items={adminNewsletter}
  searchPlaceholder="Search email, source..."
  titleLabel="Email"
  metaLabel="Preferences"
  titleIsEmail
  statusLabels={{ published: "Subscribed", draft: "Pending", archived: "Unsubscribed" }}
/>
