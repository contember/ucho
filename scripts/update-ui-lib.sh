#!/usr/bin/env bash
set -euo pipefail

### Configuration ###
TEMPLATE_REPO_URL="git@github.com:contember/contember.git" # Template repository URL
TEMPLATE_DIR="packages/react-ui-lib/src"                  # Directory to filter from template repo
OLD_COMMIT="9fc76ce46eb9d9196a88eeb01c7305b182dde7dd"     # Base commit or tag
NEW_COMMIT="main"                                         # Branch or commit with latest changes
TARGET_DIR="admin/lib"                                    # Directory to map the filtered content into
CLONE_DIR=".tmp-ui-lib-update"                            # Temporary clone directory
REMOTE_NAME="ui-lib-update-temp"                          # Temporary remote name
COMMIT_FILE="$TARGET_DIR/COMMIT"                            # File to store the new commit hash
### End Configuration ###

# Ensure cleanup on exit
cleanup() {
    echo "Cleaning up temporary files..."
    rm -rf "$CLONE_DIR"
    git remote remove "$REMOTE_NAME" 2>/dev/null || true
}
trap cleanup EXIT

# Step 0: Load OLD_COMMIT from admin/lib/COMMIT, if available

if [ -f "$COMMIT_FILE" ]; then
    OLD_COMMIT=$(cat "$COMMIT_FILE")
    echo "Loaded OLD_COMMIT from $COMMIT_FILE: $OLD_COMMIT"
fi


# Step 1: Clone the template repository with sparse checkout
echo "Cloning the template repository into $CLONE_DIR..."
rm -rf "$CLONE_DIR"
mkdir -p "$CLONE_DIR"
cd "$CLONE_DIR"
git init --quiet
git remote add origin "$TEMPLATE_REPO_URL"

echo "Configuring sparse checkout for $TEMPLATE_DIR..."
git sparse-checkout init --cone
git sparse-checkout set "$TEMPLATE_DIR"

# Step 2: Fetch only the required commits and objects
echo "Fetching commits and blobs for $OLD_COMMIT to $NEW_COMMIT..."
git fetch origin "$OLD_COMMIT" "$NEW_COMMIT" --depth=1

# Step 3: Create a formatting commit for the old code base
echo "Checking out and formatting the old code base at $OLD_COMMIT..."
git checkout "$OLD_COMMIT"
biome check --write "$TEMPLATE_DIR" 2>/dev/null || true
git add "$TEMPLATE_DIR"
git commit -m "Format code base at $OLD_COMMIT"
FORMAT_COMMIT=$(git rev-parse HEAD)
echo "Formatting commit created: $FORMAT_COMMIT"

# Step 3: Checkout the new commit
echo "Checking out the sparse directory at $NEW_COMMIT..."
git checkout "$NEW_COMMIT"

# Step 4: Reset and stage only the sparse directory
echo "Resetting and staging only files from '$TEMPLATE_DIR'..."
git reset "$FORMAT_COMMIT" # Reset to OLD_COMMIT
biome check --write "$TEMPLATE_DIR" 2>/dev/null || true
git add "$TEMPLATE_DIR" # Stage only the files in the sparse directory

# Step 5: Create the squashed commit
echo "Creating a squashed commit with only relevant files..."
NEW_COMMIT_REF=$(git rev-parse "$NEW_COMMIT")
git commit -m "Update UI lib to $NEW_COMMIT_REF"

# Step 6: Move files to the new target directory with `--sparse`
echo "Moving files from '$TEMPLATE_DIR' to '$TARGET_DIR' in the temporary repository..."
mkdir -p "$(dirname "$TARGET_DIR")"
git mv --sparse "$TEMPLATE_DIR" "$TARGET_DIR"
git rm --sparse "$TARGET_DIR/index.ts" "$TARGET_DIR/tsconfig.json"
git commit --amend --no-edit

# Capture the squashed commit hash
SQUASHED_COMMIT=$(git rev-parse HEAD)
echo "Squashed commit created: $SQUASHED_COMMIT"

# Step 7: Add the temporary repository as a remote to the main repository
echo "Adding the temporary repository as a remote to the main repository..."
cd - # Return to the main repository
git remote remove "$REMOTE_NAME" 2>/dev/null || true
git remote add "$REMOTE_NAME" "file://$PWD/$CLONE_DIR"
git fetch "$REMOTE_NAME" "$SQUASHED_COMMIT"
# Step 7: Cherry-pick the squashed commit
echo "Cherry-picking the squashed commit into the current branch..."
if git cherry-pick "$SQUASHED_COMMIT" --no-commit; then
    echo "Cherry-pick completed successfully."
else
    echo "Cherry-pick encountered conflicts. Please resolve them and run:"
    echo "  git cherry-pick --continue"
fi

# Step 8: Write the new commit hash to admin/lib/COMMIT

echo "$NEW_COMMIT_REF" > "$COMMIT_FILE"

# Cleanup handled by trap
echo "Process completed successfully. Review the changes and resolve conflicts if any."
