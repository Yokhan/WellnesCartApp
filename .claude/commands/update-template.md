You are updating this project from a newer version of the agent-project-template.

## Usage
`/update-template [path-to-template]`

If no path provided, ask the user for the template location.

## Process

### Step 1: Verify Template
- Check that the provided path contains a valid agent-project-template (has CLAUDE.md, .claude/ directory)
- Compare template version vs project version (from .template-manifest.json)
- If same version: report "Already up to date" and stop

### Alternative: Update from Git
If the project was created from a git-hosted template:
```bash
bash scripts/sync-template.sh --from-git --dry-run   # Preview
bash scripts/sync-template.sh --from-git              # Apply
```
The script fetches the latest template from the `template` remote and syncs.


### Step 2: Dry Run
```bash
bash scripts/sync-template.sh "$TEMPLATE_PATH" --dry-run
```
Show the sync plan to the user. Ask for confirmation to proceed.

### Step 3: Backup
- Ensure all changes are committed (or stashed)
- The sync script creates a backup git tag automatically

### Step 4: Execute Sync
```bash
bash scripts/sync-template.sh "$TEMPLATE_PATH"
```

### Step 5: Validate
- Run `bash scripts/check-drift.sh` — all checks should pass
- Verify `.template-manifest.json` is updated with new version
- Check that project-* files are untouched

### Step 6: Review & Commit
- Show summary of what changed
- Suggest commit message: `chore: sync template from vX.Y.Z to vA.B.C`
- List any project-* files that were preserved

## Important
- Template files (without project- prefix) are READ-ONLY baseline — sync overwrites them
- Project files (project-* prefix) are NEVER touched by sync
- CLAUDE.md is NEVER touched (it's project-specific configuration)
- If .template-manifest.json doesn't exist, run bootstrap first:
  ```bash
  bash scripts/sync-template.sh /path/to/template --bootstrap
  bash scripts/sync-template.sh /path/to/template
  ```
