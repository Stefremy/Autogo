Exporting the workspace

This repository includes a small helper script that creates a timestamped zip of the workspace root and excludes common large/generated folders (like `node_modules`, `.next`, etc.).

1) Create the zip file

From the workspace root run:

```bash
chmod +x ./scripts/export_workspace.sh
./scripts/export_workspace.sh
```

This will produce a file named similar to `autogo_export_20250917_143025.zip` in the workspace root.

2) Download the file to your local machine

- Option A — SCP (if you have SSH access to the machine hosting the workspace):

```bash
scp user@host:/path/to/workspaces/Autogo/autogo_export_20250917_143025.zip ./
```

- Option B — Temporary HTTP server (if you're running locally or can port-forward):

```bash
# Start a simple read-only server in the repo root
cd /workspaces/Autogo
python3 -m http.server 8000
```

Then open your browser at `http://localhost:8000` and click the zip file to download. If you're remote, forward the port or use `ssh -L 8000:localhost:8000 user@host`.

3) Cleanup

After you download, remove the zip when no longer needed:

```bash
rm autogo_export_*.zip
```

Notes

- The script excludes common large folders but may still include large media under `public/images` if present. Edit `scripts/export_workspace.sh` EXCLUDES array to add additional patterns.
- If `zip` is not installed, the script will fall back to Python's zipfile module (requires Python 3).