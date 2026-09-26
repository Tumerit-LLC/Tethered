#!/bin/bash
set -euo pipefail

if [[ $# -ne 2 ]]; then
  echo "Usage: $0 /path/to/Tethered-VERSION.Sparkle.zip /path/to/sign_update" >&2
  exit 2
fi

archive="$1"
sign_update="$2"
signature_file="${archive}.edSignature"

if [[ ! -f "$archive" || ! -x "$sign_update" ]]; then
  echo "The ZIP or Sparkle sign_update tool is missing" >&2
  exit 2
fi

if [[ ! "$(basename "$archive")" =~ ^Tethered-[0-9]+\.[0-9]+\.[0-9]+\.Sparkle\.zip$ ]]; then
  echo "Expected a versioned Tethered Sparkle ZIP" >&2
  exit 2
fi

umask 077
signature="$("$sign_update" -p "$archive")"
if [[ "$signature" =~ ^sparkle:edSignature=\"([A-Za-z0-9+/]{86}==)\"[[:space:]]length=\"([0-9]+)\"$ ]]; then
  [[ "${BASH_REMATCH[2]}" == "$(stat -f %z "$archive")" ]] || { echo "Sparkle returned the wrong archive length" >&2; exit 1; }
  signature="${BASH_REMATCH[1]}"
fi
if [[ ! "$signature" =~ ^[A-Za-z0-9+/]{86}==$ ]]; then
  echo "Sparkle returned an invalid signature" >&2
  exit 1
fi
printf '%s\n' "$signature" > "$signature_file"
echo "Created $signature_file"
