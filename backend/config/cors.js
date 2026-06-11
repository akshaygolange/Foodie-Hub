const getAllowedOrigins = () => {
  if (process.env.CLIENT_URL) {
    return process.env.CLIENT_URL.split(",").map((url) => url.trim());
  }
  return ["http://localhost:5173"];
};

module.exports = { getAllowedOrigins };
