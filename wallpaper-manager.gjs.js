#!/usr/bin/gjs

/*
GJS example showing how to build Gtk borderless javascript 
applications
Run it with:
    gjs egAsset.js
*/

const Gio = imports.gi.Gio;
const GLib = imports.gi.GLib;
const Gtk = imports.gi.Gtk;
const Lang = imports.lang;
const Gdk = imports.gi.Gdk;
const WebKit2 = imports.gi.WebKit2;
const ByteArray = imports.byteArray;

// Get application folder and add it into the imports path
function getAppFileInfo() {
	let stack = new Error().stack,
		stackLine = stack.split('\n')[1],
		coincidence,
		path,
		file;

	if (!stackLine) throw new Error('Could not find current file (1)');

	coincidence = new RegExp('@(.+):\\d+').exec(stackLine);
	if (!coincidence) throw new Error('Could not find current file (2)');

	path = coincidence[1];
	file = Gio.File.new_for_path(path);
	return [file.get_path(), file.get_parent().get_path(), file.get_basename()];
}

const path = getAppFileInfo()[1];
imports.searchPath.push(path);

const App = function () {
	this.title = 'Desktop';
	GLib.set_prgname(this.title);

	this.wallpaperWindows = [];
};

App.prototype.run = function (ARGV) {
	this.application = new Gtk.Application();
	this.application.connect('activate', () => {
		this.onActivate();
	});
	this.application.connect('startup', () => {
		this.onStartup();
	});
	this.application.run([]);
};

App.prototype.onActivate = function () {
	this.wallpaperWindows.forEach(({ window }) => {
		window.show_all();
	});
};

App.prototype.onStartup = function () {
	const file = Gio.File.new_for_path(path + '/config.json');
	const [_, _contents] = file.load_contents(null);
	const contents = JSON.parse(ByteArray.toString(_contents));
	this.attachWallpapers(contents.monitors);
};

App.prototype.getSettings = function () {
	const settings = new WebKit2.Settings();

	// enable if you're making wallpapers and need console output and stuff:
	// settings.set_enable_developer_extras(true);

	return settings;
};

App.prototype.attachWallpapers = function (monitorConfigs) {
	const defaultScreen = Gdk.Screen.get_default();

	const display = defaultScreen.get_display();
	const monitors = display.get_n_monitors();
	for (let i = 0; i < monitors; i++) {
		const monitor = display.get_monitor(i);
		const { width, height, x, y } = monitor.get_geometry();

		const window = new Gtk.ApplicationWindow({
			application: this.application,
			title: this.title,
			default_height: 200,
			default_width: 200,
			window_position: Gtk.WindowPosition.CENTER,
		});

		window.set_type_hint(Gdk.WindowTypeHint.DESKTOP);
		window.set_keep_below(true);
		window.set_decorated(false);
		window.resize(width, height);
		window.move(x, y);
		window.set_position(Gtk.WindowPosition.CENTER);

		const webView = new WebKit2.WebView();
		webView.set_settings(this.getSettings());

		const wallpaperLocation = monitorConfigs[i] ? `file://${monitorConfigs[i]}/index.html` : `file://${path}/defaultWallpaper/index.html`

		webView.load_uri(
			wallpaperLocation
		);

		window.add(webView);

		this.wallpaperWindows.push({
			window,
			webView,
			monitorIndex: i,
		});
	}
};

//Run the application
let app = new App();
app.run(ARGV);
