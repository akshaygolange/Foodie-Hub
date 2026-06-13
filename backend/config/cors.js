const getAllowedOrigins = () => {
  const fallback = ["http://localhost:5173"];

  if (!process.env.CLIENT_URL) {
    return fallback;
  }

  const origins = process.env.CLIENT_URL
    .split(",")
    .map((url) => url.trim())
    .filter(Boolean);

  if (process.env.NODE_ENV !== "production" && !origins.includes("http://localhost:5173")) {
    origins.push("http://localhost:5173");
  }

  return origins.length ? origins : fallback;
};

module.exports = { getAllowedOrigins };
