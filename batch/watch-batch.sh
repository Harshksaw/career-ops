#!/usr/bin/env bash
# watch-batch.sh — polls batch-state.tsv until all offers are done (no processing/pending rows)
# Exits 0 when batch is complete or runner process is dead with all offers settled.

STATE="batch/batch-state.tsv"
POLL_INTERVAL=30  # seconds between checks
MAX_WAIT=43200     # 2 hours max

start=$(date +%s)

echo "=== Batch watcher started at $(date) ==="
echo "Polling every ${POLL_INTERVAL}s for up to $((MAX_WAIT/60)) minutes..."

while true; do
  now=$(date +%s)
  elapsed=$(( now - start ))

  if [ $elapsed -ge $MAX_WAIT ]; then
    echo "TIMEOUT: batch did not complete within $((MAX_WAIT/60)) minutes"
    exit 2
  fi

  if [ ! -f "$STATE" ]; then
    sleep $POLL_INTERVAL
    continue
  fi

  # True total is the number of offers in batch-input.tsv (skip header)
  expected=$(tail -n +2 batch/batch-input.tsv | wc -l | tr -d ' ')
  completed=$(tail -n +2 "$STATE" | grep -c "completed" || true)
  failed=$(tail -n +2 "$STATE" | grep -c "failed" || true)
  processing=$(tail -n +2 "$STATE" | grep -c "processing" || true)
  settled=$(( completed + failed ))

  echo "[$(date '+%H:%M:%S')] expected=$expected  completed=$completed  failed=$failed  processing=$processing  settled=$settled"

  # Check if any batch-runner process is alive
  runner_alive=0
  if pgrep -f "batch-runner.sh" > /dev/null 2>&1; then
    runner_alive=1
  fi

  if [ "$settled" -ge "$expected" ]; then
    echo "=== BATCH COMPLETE at $(date) ==="
    echo "Results: $completed completed, $failed failed out of $expected"
    exit 0
  fi

  if [ "$runner_alive" -eq 0 ] && [ "$settled" -lt "$expected" ]; then
    echo "=== RUNNER DIED with $settled/$expected settled ==="
    exit 3
  fi

  sleep $POLL_INTERVAL
done
