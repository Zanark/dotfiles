#!/usr/bin/env bash

# Terminate already running bar instances
killall -q polybar

# Wait until the processes have been shut down
while pgrep -u $UID -x polybar >/dev/null; do sleep 1; done

# Launch bars
polybar top --config=/home/zanark/.config/polybar/top-config.ini &
#polybar top2 --config=/home/zanark/.config/polybar/config.ini &
#polybar bottom &

echo "bars launched with no errors/warnings"
