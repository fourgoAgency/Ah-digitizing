// scripts/buildPortfolioIndex.mjs
console.log("Script started");
import { initializeApp, cert } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { getStorage } from "firebase-admin/storage";
import { createRequire } from "module";

const require = createRequire(import.meta.url);
const serviceAccount = require("./service-account.json");

initializeApp({
  credential: cert(serviceAccount),
  storageBucket: serviceAccount.project_id + ".firebasestorage.app",
});

const db     = getFirestore();
const bucket = getStorage().bucket();

const FOLDERS = ["embroidery", "vector"];

async function buildIndex() {
  for (const folder of FOLDERS) {
    console.log(`\nIndexing ${folder}...`);

    const [files] = await bucket.getFiles({ prefix: `${folder}/` });

    const urls = await Promise.all(
      files
        .filter((f) => !f.name.endsWith("/")) // skip folder placeholder
        .map(async (file) => {
          const [url] = await file.getSignedUrl({
            action: "read",
            expires: "01-01-2100", // effectively permanent
          });
          return url;
        })
    );

    // Store as a single doc — one read = all URLs
    await db.collection("portfolioIndex").doc(folder).set({
      urls,
      updatedAt: new Date(),
    });

    console.log(`  ✓ ${urls.length} URLs indexed for ${folder}`);
  }

  console.log("\n✅ Portfolio index built.");
}

buildIndex().catch((err) => {
  console.error("❌ Failed:", err);
  process.exit(1);
});