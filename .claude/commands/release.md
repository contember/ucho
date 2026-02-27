Release a new version of the package.

## Instructions

Follow these steps exactly:

### 1. Determine the version bump

If the user provided arguments (e.g. `/release patch`, `/release 0.3.0`), use that. Otherwise, ask the user which version bump they want: patch, minor, major, or a specific version.

### 2. Preflight checks

- Verify you are on the `main` branch. If not, warn the user and ask for confirmation.
- Run `git status` to ensure the working tree is clean (no uncommitted changes). If dirty, stop and tell the user.
- Run `git pull --ff-only` to ensure the branch is up to date.

### 3. Read current version

Read `package.json` and note the current `version` field.

### 4. Generate release notes

Run `git tag -l 'v*' --sort=-v:refname` to find the latest existing tag. Then:
- If a previous tag exists: `git log <previous-tag>..HEAD --oneline --no-merges`
- If no tags exist: `git log --oneline --no-merges`

Group the commit messages into sections based on conventional commit prefixes:
- **Features** — `feat:` or `feat(...):` commits
- **Fixes** — `fix:` or `fix(...):` commits
- **Other Changes** — everything else (refactor, chore, style, docs, ci, etc.)

Omit empty sections. Format each entry as `- <commit message without prefix>`. Present the release notes to the user for review and allow them to edit.

### 5. Bump the version

Use the Edit tool to update the `version` field in `package.json` to the new version.

### 6. Commit, tag, and push

```bash
git add package.json
git commit -m "release: v<new-version>"
git tag -a "v<new-version>" -m "v<new-version>"
git push origin main --follow-tags
```

### 7. Create GitHub release

Use `gh release create` with the generated release notes:

```bash
gh release create "v<new-version>" --title "v<new-version>" --notes "<release-notes>"
```

### 8. Summary

Tell the user:
- The new version number
- Link to the GitHub release
- That the publish workflow will run automatically to publish to npm
