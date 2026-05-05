const http = require("http");
const https = require("https");
const fs = require("fs");
const path = require("path");
const { URL } = require("url");

const PORT = Number(process.env.PORT || 8080);
const HOST = process.env.HOST || "127.0.0.1";
const ROOT_DIR = __dirname;

loadDotEnv(path.join(ROOT_DIR, ".env"));

const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY || "";
const GOOGLE_CSE_CX = process.env.GOOGLE_CSE_CX || "947459253961049b1";

const MIME_TYPES = {
  ".html": "text/html; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon"
};

const server = http.createServer(async (req, res) => {
  try {
    const requestUrl = new URL(req.url, `http://${req.headers.host}`);

    if (requestUrl.pathname === "/api/search") {
      await handleSearch(requestUrl, res);
      return;
    }

    serveStatic(requestUrl.pathname, res);
  } catch (error) {
    json(res, 500, { error: "Erro interno no servidor" });
  }
});

server.listen(PORT, HOST, () => {
  console.log(`Aila Nav server online em http://${HOST}:${PORT}`);
});

async function handleSearch(requestUrl, res) {
  const query = (requestUrl.searchParams.get("q") || "").trim();
  if (!query) {
    json(res, 400, { error: "Parametro q obrigatorio" });
    return;
  }

  if (!GOOGLE_API_KEY || !GOOGLE_CSE_CX) {
    json(res, 500, {
      error: "Configure GOOGLE_API_KEY e GOOGLE_CSE_CX no .env do servidor"
    });
    return;
  }

  try {
    const endpoint = new URL("https://www.googleapis.com/customsearch/v1");
    endpoint.searchParams.set("key", GOOGLE_API_KEY);
    endpoint.searchParams.set("cx", GOOGLE_CSE_CX);
    endpoint.searchParams.set("q", query);
    endpoint.searchParams.set("num", "10");
    endpoint.searchParams.set("safe", "off");

    const payload = await getJson(endpoint.toString());
    const items = Array.isArray(payload.items)
      ? payload.items.map((item) => ({
          title: item.title || item.link || "Sem titulo",
          link: item.link || "",
          snippet: item.snippet || "",
          displayLink: item.displayLink || ""
        }))
      : [];

    json(res, 200, { items });
  } catch (error) {
    json(res, 502, {
      error: "Falha ao consultar busca Google no servidor"
    });
  }
}

function serveStatic(pathname, res) {
  let safePath = pathname === "/" ? "/AilaNavtest.html" : pathname;
  safePath = path.normalize(safePath).replace(/^([.][.][/\\])+/, "");
  const filePath = path.join(ROOT_DIR, safePath);

  if (!filePath.startsWith(ROOT_DIR)) {
    res.writeHead(403);
    res.end("Forbidden");
    return;
  }

  fs.readFile(filePath, (error, data) => {
    if (error) {
      if (error.code === "ENOENT") {
        res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
        res.end("Not Found");
        return;
      }
      res.writeHead(500, { "Content-Type": "text/plain; charset=utf-8" });
      res.end("Internal Server Error");
      return;
    }

    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || "application/octet-stream";
    res.writeHead(200, { "Content-Type": contentType });
    res.end(data);
  });
}

function json(res, statusCode, payload) {
  res.writeHead(statusCode, { "Content-Type": "application/json; charset=utf-8" });
  res.end(JSON.stringify(payload));
}

function getJson(url) {
  return new Promise((resolve, reject) => {
    https
      .get(url, (response) => {
        let body = "";
        response.on("data", (chunk) => {
          body += chunk;
        });
        response.on("end", () => {
          if (response.statusCode && response.statusCode >= 200 && response.statusCode < 300) {
            try {
              resolve(JSON.parse(body));
            } catch (error) {
              reject(new Error("JSON invalido da API"));
            }
            return;
          }

          reject(new Error(`Google API status ${response.statusCode}`));
        });
      })
      .on("error", reject);
  });
}

function loadDotEnv(dotEnvPath) {
  if (!fs.existsSync(dotEnvPath)) return;

  const lines = fs.readFileSync(dotEnvPath, "utf8").split(/\r?\n/);
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;

    const idx = trimmed.indexOf("=");
    if (idx === -1) continue;

    const key = trimmed.slice(0, idx).trim();
    const value = trimmed.slice(idx + 1).trim();

    if (key && process.env[key] === undefined) {
      process.env[key] = value;
    }
  }
}