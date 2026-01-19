import { createDbApi } from "../src";

const api = createDbApi(
  {
    supabaseUrl: "https://your-project.supabase.co",
    anonKey: "public-anon-key",
    appId: "my-app"
  },
  {
    diagnostics: { enabled: true, includeSamples: false }
  }
);

async function run() {
  const posts = await api.content.list({ table: "posts", select: "id,title" });
  console.log("posts", posts);
}

run().catch((error) => {
  console.error(error);
});
