const { execSync } = require("child_process");
const fs = require("fs");
const path = require("path");

const rootDir = path.resolve(__dirname, "..");
const apiDir = path.join(rootDir, "src", "app", "api");
const backupDir = path.join(rootDir, "src", "app_api_temp");

console.log("[Build] 1. Generating Prisma client...");
execSync("npx prisma generate", { stdio: "inherit", cwd: rootDir });

console.log("[Build] 2. Exporting static catalog JSON...");
execSync("npx tsx scripts/export-static-data.ts", { stdio: "inherit", cwd: rootDir });

let apiMoved = false;
try {
  if (fs.existsSync(apiDir)) {
    console.log("[Build] 3. Temporarily moving API routes for static export...");
    fs.renameSync(apiDir, backupDir);
    apiMoved = true;
  }

  console.log("[Build] 4. Running Next.js static build...");
  execSync("npx next build", { stdio: "inherit", cwd: rootDir });
  console.log("[Build] Static build succeeded!");
} finally {
  if (apiMoved && fs.existsSync(backupDir)) {
    console.log("[Build] 5. Restoring API routes...");
    fs.renameSync(backupDir, apiDir);
  }
}
