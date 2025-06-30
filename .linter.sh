#!/bin/bash
cd /home/kavia/workspace/code-generation/notevault-api-95746-23909741/notes_api_backend
npm run lint
LINT_EXIT_CODE=$?
if [ $LINT_EXIT_CODE -ne 0 ]; then
  exit 1
fi

