# Cyber Members — Discord Member Growth & Injection Infrastructure

Official showcase and interactive documentation platform for **Cyber Members** (`https://discord.gg/VX4APpF`).

![Cyber Members Hero Preview](assets/hero.jpg)

## 🌐 Overview

**Cyber Members** is a high-velocity Discord member growth and automated OAuth2 token injection infrastructure. Built with zero privileged bot intents and calibrated anti-flood rate pacing, it empowers Discord community owners to scale server engagement seamlessly across tiered quotas.

- **Discord Server:** [https://discord.gg/VX4APpF](https://discord.gg/VX4APpF)
- **Guild ID:** `1560942690961723412`

---

## ⚡ Key Features

- **OAuth2 Token Pool Ingestion:** Fast, auto-refreshing member token registration pipeline (`!get_token`, `!auth`).
- **Zero Privileged Intents:** Operates on standard message events and non-privileged Discord gateway methods.
- **Adaptive Join Pacing:** Calibrated 1.0s – 2.5s join intervals to avoid Discord rate-limits and guild suspensions.
- **Hierarchical Role Quotas:** Real-time quota enforcement from Member (5) to Emerald (40) and Staff (100–200).
- **Interactive Simulator:** Built-in web terminal to test drive commands (`!djoin`, `!profile`, `!stock`, `!help`).

---

## 💎 Membership Tier Quota Matrix

| Tier Role | Injection Allowance | Role ID | Priority Level |
| :--- | :--- | :--- | :--- |
| **Emerald** | **40 Members** | `1560942690974302215` | Tier Apex (VIP) |
| **Diamond** | **30 Members** | `1560942690974302214` | High-Volume |
| **Premium** | **20 Members** | `1560942690974302213` | Priority Pool |
| **Booster** | **15 Members** | `1560942690974302213` | Booster Perk |
| **Gold** | **12 Members** | `1560942690974302212` | Enhanced Growth |
| **Silver** | **10 Members** | `1560942690974302211` | Community Standard |
| **Bronze** | **7 Members** | `1560942690974302210` | Early Supporter |
| **Member** | **5 Members** | `1560942690961723421` | Entry Level |

*Note: Head of Staff (100) and Admin/Owner (200) allocations are reserved for server leadership.*

---

## 🛠️ Bot Command Reference

- `!djoin <server_id>` — Ingests active quota batch into target guild.
- `!profile` (aliases: `!me`, `!tier`, `!myquota`) — Inspects auth state and remaining allowance.
- `!get_token` — Dispatches one-click OAuth2 authentication button.
- `!auth <code>` — Verifies OAuth callback code.
- `!stock` (alias: `!check_tokens`) — Queries active token pool capacity and health.
- `!servers` — Interactive paginated viewer of all connected Discord guilds.

---

## 🚀 Deployment & Local Preview

Clone the repository and launch any static web server:

```bash
# Python
python -m http.server 8080

# Node.js
npx serve .
```

Open [http://localhost:8080](http://localhost:8080) in your browser.

---

## 📜 License

Created for the Cyber Members community. All rights reserved.
