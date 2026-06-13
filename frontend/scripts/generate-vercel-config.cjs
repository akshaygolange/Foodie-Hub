const fs = require("fs");
const path = require("path");

const backendUrl = (process.env.VITE_API_URL || "").replace(/\/$/, "");
const vercelConfigPath = path.join(__dirname, "..", "vercel.json");

const rewrites = [];

if (backendUrl) {
  rewrites.push({
    source: "/api/:path*",
    destination: `${backendUrl}/api/:path*`,
  });
}

rewrites.push({
  source: "/(.*)",
  destination: "/index.html",
});

const config = { rewrites };

if (process.env.VERCEL === "1" && !backendUrl) {
  console.error(
    "\n[build error] VITE_API_URL is not set on Vercel.\n" +
      "Add it in Project Settings → Environment Variables\n" +
      "Example: https://your-app.onrender.com\n",
  );
  process.exit(1);
}

fs.writeFileSync(vercelConfigPath, `${JSON.stringify(config, null, 2)}\n`);
console.log(
  backendUrl
    ? `[vercel] API proxy → ${backendUrl}`
    : "[vercel] No VITE_API_URL — using local dev proxy only",
);
