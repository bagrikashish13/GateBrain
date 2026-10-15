# GateBrain

GATE CS prep in one repo: the app and everything it knows.

- **Today**: the day's tasks, notes due for revision, the test you're in the middle of, days left to GATE.
- **Notes**: short notes by subject → syllabus section, written with Claude Code / Antigravity.
- **Revise**: spaced revision of every note (FSRS), weak topics from your mocks first.
- **Tests**: mock tests in a GATE-style exam screen (palette, Mark for Review, NAT keypad, virtual
  calculator, negative marking), then a full analysis. Each attempt is saved to `brain/results/`.
- Every change (a tick, a revision, a result) is a commit pushed to GitHub, so any device with a clone has
  the same state.

How the data is laid out and how agents should write notes, tests and analyses: [AGENTS.md](AGENTS.md).

## On a new device

Needs Node 24+ and git.

```sh
git clone https://github.com/bagrikashish13/GateBrain.git
cd GateBrain
npm install
cp .env.example .env     # then fill in PASSCODE and GITHUB_TOKEN (or copy your .env from another device)
npm run dev              # http://localhost:3000
```

`.env` never goes to GitHub. It holds:

| | |
|---|---|
| `PASSCODE` | the login passcode |
| `GITHUB_TOKEN` | a fine-grained token: repository **bagrikashish13/GateBrain** only, permission **Contents: Read and write**. The app pulls and pushes with it. Empty = use this machine's git login. |
| `TZ` | `Asia/Kolkata`: when a day starts and ends |

Make the token at GitHub → Settings → Developer settings → Fine-grained tokens.

## Writing tests and notes

Open the repo in Claude Code or Antigravity and ask, e.g. "make a 30-question mixed mock on OS deadlock,
DBMS normal forms and TOC regular languages". The agent follows [AGENTS.md](AGENTS.md), runs
`npm run check:tests`, commits and pushes. Sync in the app (or wait 3 minutes on the server) and it's in
**Tests**. After an attempt: "analyse my last mock, teach me what I got wrong and update my notes".

## On the VM (same one as secondBrain)

Once:

```sh
ssh 24vm
git clone https://github.com/bagrikashish13/GateBrain.git ~/GateBrain   # https, so GITHUB_TOKEN works
cd ~/GateBrain
cp .env.example .env    # PASSCODE, GITHUB_TOKEN, GATEBRAIN_PORT, PUBLIC_HOST,
                        # COMPOSE_PROFILES=vm, CLOUDFLARE_TUNNEL_TOKEN, HOST_UID/HOST_GID (id -u / id -g)
scripts/deploy.sh
```

The Cloudflare tunnel: in Cloudflare Zero Trust → Networks → Tunnels, create a tunnel (or reuse one) with a
public hostname (e.g. `gate.<your-domain>`) pointing to `http://app:3000`, and put its token in
`CLOUDFLARE_TUNNEL_TOKEN`. Set `PUBLIC_HOST` to that hostname.

To ship new app code: push to GitHub, then on the VM `~/GateBrain/scripts/deploy.sh`.

The container works on that clone directly: it reads `brain/`, commits what you do in the app and pushes it,
and pulls every 3 minutes, so notes and tests written on your laptop show up on their own.

## Development

```sh
npm run dev          # dev server
npm test             # unit tests
npm run lint
npm run typecheck
npm run build
npm run check:tests  # validate brain/tests/*.md
```

Next.js 16 · React 19 · Tailwind 4 · ts-fsrs. No database: the repo is the database.
