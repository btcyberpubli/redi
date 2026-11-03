import test from "node:test";
import assert from "node:assert/strict";
import handler from "./news.js";

function createResponse() {
  return {
    statusCode: 200,
    headers: {},
    body: "",
    status(code) {
      this.statusCode = code;
      return this;
    },
    setHeader(name, value) {
      this.headers[name] = value;
      return this;
    },
    send(body) {
      this.body = body;
      return this;
    }
  };
}

test("rechaza métodos distintos de GET", async () => {
  const res = createResponse();
  await handler({ method: "POST", query: { category: "autos" } }, res);

  assert.equal(res.statusCode, 405);
  assert.equal(res.headers.Allow, "GET");
});

test("acepta únicamente categorías conocidas", async () => {
  const res = createResponse();
  await handler({ method: "GET", query: { category: "camiones" } }, res);

  assert.equal(res.statusCode, 400);
  assert.match(JSON.parse(res.body).error, /autos o motos/);
});

test("devuelve una respuesta vacía clara si no se configuraron fuentes", async () => {
  const res = createResponse();
  await handler({ method: "GET", query: { category: "autos" } }, res);

  assert.equal(res.statusCode, 200);
  assert.deepEqual(JSON.parse(res.body), {
    category: "autos",
    items: [],
    configured: false
  });
  assert.match(res.headers["Cache-Control"], /s-maxage=900/);
});