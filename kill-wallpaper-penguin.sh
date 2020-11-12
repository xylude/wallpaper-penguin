#!/usr/bin/env bash
kill $(ps aux | grep wallpaper-manager.gjs.js | awk '{print $2}')