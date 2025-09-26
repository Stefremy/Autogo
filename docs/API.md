# API Autogo — documentação rápida

Este documento descreve os endpoints públicos da API localizada em `pages/api/cars.ts`, como autenticar e exemplos de uso (curl / Make.com / ngrok).

> Nota: a API usa um token simples via `API_KEY` (variável de ambiente). Em produção configure `API_KEY` no ambiente (Vercel, etc.).

---

## Ambiente

- Local: crie um ficheiro `.env.local` na raiz com:

```
API_KEY=TEST_TOKEN_12345
```

Reinicie o servidor Next.js após qualquer alteração no `.env.local`.

- Produção: defina `API_KEY` nas Environment Variables do host (Vercel, Netlify, etc.) e redeploy.

- Para expor o servidor local ao Make.com (ou a terceiros) use `ngrok`:

  1. Inicie o Next.js numa porta (ex.: 3001):
     ```bash
     PORT=3001 npm run dev
     ```
  2. Inicie o ngrok:
     ```bash
     ngrok http 3001
     ```
  3. Use o URL HTTPS gerado (ex.: `https://abcd-12-34-56.ngrok.io`) no Make.

---

## Autenticação

A API aceita o token pelas seguintes formas (extração ordenada):

- Header `x-api-key: <TOKEN>`
- Header `Authorization: Bearer <TOKEN>`
- Query param `?token=<TOKEN>`

Se `API_KEY` estiver definido no servidor, as rotas `GET`, `POST` e `DELETE` exigem o token válido.

---

## Endpoints

### GET /api/cars

- Descrição: retorna dados de carros (lê `data/cars.json` por defeito).
- Query params:
  - `file` = `cars` (padrão) | `full` (lê `data/cars.full.json`)
  - `format` = `json` (padrão) | `csv`
  - `token` = token (alternativa ao header)
- Headers: `Authorization: Bearer <TOKEN>` ou `x-api-key: <TOKEN>`

Exemplo (JSON):

```bash
curl -H "Authorization: Bearer TEST_TOKEN_12345" "https://www.autogo.pt/api/cars?file=cars&format=json"
```

Exemplo (CSV):

```bash
curl -H "Authorization: Bearer TEST_TOKEN_12345" "https://www.autogo.pt/api/cars?file=cars&format=csv" -o cars.csv
```

Respostas:
- 200 JSON | CSV
- 401 Unauthorized (token inválido)
- 500 Internal Server Error (problemas a ler/parsear o ficheiro)


### POST /api/cars

- Descrição: adiciona um novo carro a `data/cars.json`. O endpoint garante `id` único e adiciona `status` se não existir.
- Requer: `Content-Type: application/json` e autenticação.
- Body: JSON com os campos do carro. Exemplo mínimo:

```json
{
  "make": "Fiat",
  "model": "500",
  "year": 2020
}
```

Exemplo curl:

```bash
curl -X POST "https://www.autogo.pt/api/cars" \
  -H "Authorization: Bearer TEST_TOKEN_12345" \
  -H "Content-Type: application/json" \
  -d '{"make":"Fiat","model":"500","year":2020}'
```

Respostas:
- 201 Created (retorna o novo objeto)
- 400 Bad Request (body inválido)
- 401 Unauthorized
- 500 Internal Server Error (escrita falhou)


### DELETE /api/cars

- Descrição: remove um carro por id. Aceita `id` via query (`?id=THE_ID`) ou via body JSON (`{ "id": "THE_ID" }`).
- Requer autenticação.

Exemplo (query):

```bash
curl -X DELETE "https://www.autogo.pt/api/cars?id=THE_ID" -H "Authorization: Bearer TEST_TOKEN_12345"
```

Exemplo (body):

```bash
curl -X DELETE "https://www.autogo.pt/api/cars" \
  -H "Authorization: Bearer TEST_TOKEN_12345" \
  -H "Content-Type: application/json" \
  -d '{"id":"THE_ID"}'
```

Respostas:
- 200 { success: true }
- 400 Missing car id
- 404 Car not found
- 401 Unauthorized
- 500 Internal Server Error

---

## Comportamento defensivo / backups

- `data/cars.full.json` é mantido como backup completo. A API tenta restaurar `data/cars.json` a partir de `data/cars.full.json` se o ficheiro principal estiver corrompido ou ilegível.
- Recomenda-se fazer commits regulares do backup e guardar cópias fora do servidor.

---

## Integração com Make.com (cenário rápido)

1) (Opcional) Se usares OAuth: primeiro obtém `access_token` do provedor e usa-o como `Authorization: Bearer <access_token>` no módulo HTTP do Make. A API atual compara o token com `API_KEY` — para autenticação OAuth propriamente dita, é preciso alterar a API para validar JWTs/introspecção (posso ajudar com isso).

2) Configurar módulo HTTP no Make:
- URL: `https://www.autogo.pt/api/cars` (ou `https://<NGROK_URL>/api/cars` durante desenvolvimento local)
- Method: GET / POST / DELETE
- Headers:
  - `Authorization: Bearer <TOKEN>` ou `x-api-key: <TOKEN>`
  - `Content-Type: application/json` (para POST/DELETE body)
- Body (POST): raw JSON com o carro a criar.

---

## Boas práticas

- Não partilhar `API_KEY` publicamente. Se o token foi exposto, gera um novo valor e atualiza a variável de ambiente em produção.
- Testar escritas (POST/DELETE) primeiro em ambiente local com ngrok e backups ativos.
- Em produção considerar a migração para validação JWT/JWKS ou introspecção de token.

---

## Contacto / manutenção

Para alterações na autenticação ou novos endpoints (filtros, paginação, PATCH, etc.) contacta o responsável técnico do projecto. Posso ajudar a criar patches para validação JWT, introspecção ou melhorar logging e mensagens de erro mais informativas.
