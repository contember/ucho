#!/bin/bash
set -e

log() {
  printf '[%s] %s\n' "$1" "$2"
}

log_info() {
  log INFO "$*"
}

log_error() {
  log ERROR "$*"
}

package_label=$(jq -r '.name // "unknown"' package.json 2>/dev/null)

if jq -e '.private == true' package.json >/dev/null 2>&1; then
  log_info "$package_label: package marked private, skipping"
  exit 0
fi

publish_tag="${NPM_TAG:-latest}"
log_info "$package_label: publishing with tag '$publish_tag'"

npm publish --tag "$publish_tag" --provenance --access public
log_info "$package_label: publish succeeded"
