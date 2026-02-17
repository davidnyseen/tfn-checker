# TFN Checker

Validates Australian Tax File Numbers using the official checksum algorithm. Enter a TFN and it tells you if it's valid or not, and keeps a history of recent checks.

**Live:** https://davidnyseen.github.io/tfn-checker/

## What it is

- Angular frontend hosted on GitHub Pages
- .NET 8 API hosted on Azure App Service (free tier)
- SQLite database for validation history

## Running locally

**API:**
```bash
cd api
dotnet run
```
Runs on http://localhost:5276

**Frontend:**
```bash
cd client
npm install
npx ng serve
```
Runs on http://localhost:4200

## Deploying

**Backend** (requires Azure CLI):
```powershell
./infra/deploy.ps1
```

**Frontend** — push to `master` and GitHub Actions handles it.

## Test TFNs

**Valid**
| TFN | |
|---|---|
| 123 456 782 | |
| 876 543 210 | |
| 246 813 575 | |

**Invalid**
| TFN | Reason |
|---|---|
| 123 456 789 | Fails checksum |
| 111 111 111 | Fails checksum |
| 123 456 78 | Too short |

## API

```
POST /api/tfn/validate   { "tfn": "123 456 782" }
GET  /api/tfn/history
DELETE /api/tfn/history
```
