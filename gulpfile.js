"use strict";

const { task, src, dest, series } = require("gulp");
const del = require("del");
const maps = require("gulp-sourcemaps");
const gulpSass = require("gulp-sass")(require("sass"));
const concat = require("gulp-concat");
const uglify = require("gulp-uglify");

// clean
const clean = task("clean", function () {
	return del("dist");
});

// sass
const sass = task("sass", function () {
	return src("./assets/styles/application.scss")
		.pipe(maps.init())
		.pipe(gulpSass().on("error", gulpSass.logError))
		.pipe(maps.write())
		.pipe(dest("./dist"));
});
const sassProduction = task("sassProduction", function () {
	return src("./assets/styles/application.scss")
		.pipe(
			gulpSass({ outputStyle: "compressed" }).on("error", gulpSass.logError)
		)
		.pipe(dest("./dist"));
});

// js
var appScripts = [
	"./assets/scripts/vendor/*.js",
	"./assets/scripts/modules/*.js",
];
const scripts = task("scripts", function () {
	return src(appScripts)
		.pipe(maps.init())
		.pipe(concat("application.js"))
		.pipe(maps.write())
		.pipe(dest("./dist/"));
});
const scriptsProduction = task("scriptsProduction", function () {
	return src(appScripts)
		.pipe(concat("application.js"))
		.pipe(uglify())
		.pipe(dest("./dist/"));
});

// watchers
const sassWatch = task("sassWatch", function () {
	gulp.watch("./assets/styles/**/*.scss", ["sass"]);
});

const scriptsWatch = task("scriptsWatch", function () {
	gulp.watch("./assets/scripts/**/*.js", ["scripts"]);
});

// aggregate tasks
exports.default = series(clean, sass, scripts, sassWatch, scriptsWatch);
exports.production = series(clean, sassProduction, scriptsProduction);
