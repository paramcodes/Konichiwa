// Sync repos with topic "konichiwa" into the Konichiwa DB.
//
// 1. Search GitHub for repos with topic:konichiwa (paginated).
// 2. For each repo, fetch metadata: name, description, homepage, html_url.
// 3. POST each to the Konichiwa API endpoint.
// 4. Skip repos already in the DB (API dedups by githubUrl).

import axios from "axios";

const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const API_URL = process.env.CONICHIWA_URL || "https://konichiwa-five.vercel.app";

if (!GITHUB_TOKEN) {
  console.error("GITHUB_TOKEN is required");
  process.exit(1);
}

const headers = {
  Authorization: `token ${GITHUB_TOKEN}`,
  Accept: "application/vnd.github.v3+json",
  "User-Agent": "konichiwa-sync",
};

const gh = axios.create({ baseURL: "https://api.github.com", headers, timeout: 30000 });

async function searchRepos() {
  const repos = [];
  let page = 1;
  const perPage = 100;
  while (true) {
    const res = await gh.get("/search/repositories", {
      params: { q: "topic:konichiwa", sort: "updated", order: "desc", per_page: perPage, page },
    });
    const items = res.data.items || [];
    repos.push(...items);
    if (items.length < perPage) break;
    page += 1;
  }
  return repos;
}

async function main() {
  console.log(`Searching GitHub for repos with topic:konichiwa...`);
  const repos = await searchRepos();
  console.log(`Found ${repos.length} repos`);

  let created = 0;
  let updated = 0;
  let failed = 0;

  for (const repo of repos) {
    const name = repo.name;
    const description = repo.description || "";
    const githubUrl = repo.html_url;
    const projectUrl = repo.homepage || null;

    if (!name) continue;

    try {
      const res = await axios.post(`${API_URL}/api/projects`, {
        name,
        description,
        techStack: [],
        githubUrl,
        projectUrl,
      });

      if (res.data.created) created++;
      else if (res.data.updated) updated++;
      else console.log(`  - ${name}: ${JSON.stringify(res.data)}`);
    } catch (err) {
      failed++;
      const msg = err.response?.data?.details || err.message;
      console.error(`  - ${name}: failed (${msg})`);
    }
  }

  console.log(`Done. Created: ${created}, Updated: ${updated}, Failed: ${failed}`);
}

main().catch((err) => {
  console.error("Fatal error:", err.message);
  process.exit(1);
});