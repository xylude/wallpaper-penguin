# Wallpaper Penguin

This app will allow you to create html live wallpapers for your Gnome desktop. I really enjoy using Wallpaper Engine on Windows and wanted to make something similar for Linux systems.

Currently, the application is very simple. I'd be interested in continuing work on it if it gets some usage (and if I could find someone to help me learn more about Gjs).

## Usage

**To start the live wallpapers**
```bash
./start-wallpaper-penguin.sh
```

**To stop the live wallpapers**
```bash
./kill-wallpaper-penguin.sh
```

## Changing Wallpapers

To change wallpapers, edit the config.json file. Each entry in the `monitors` array represents a monitor. Each entry has only one property: `wallpaperLocation`, and should point to a folder containing an index.html file.

**Example config.json**

If you have 2 monitors, you would have a config.json that looks something like this:

```json
{
  "monitors": [
	  { wallpaperLocation: "/home/user/live-wallpapers/mywallpaper" },
	  { wallpaperLocation: "/home/user/live-wallpapers/myotherwallpaper" }
  ]
}
```

Once you've updated your config.json file, you can restart the wallpaper script by running the kill and start scripts again.

> Written with [StackEdit](https://stackedit.io/).