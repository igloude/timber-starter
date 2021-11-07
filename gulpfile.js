"use strict";

const { watch, src, dest, series, parallel } = require("gulp");
const del = require("del");
const maps = require("gulp-sourcemaps");
const gulpSass = require("gulp-sass")(require("sass"));
const concat = require("gulp-concat");
const uglify = require("gulp-uglify");

// clean
function clean() {
	return del("dist");
}

// sass
function sass() {
	return src("./assets/styles/application.scss")
		.pipe(maps.init())
		.pipe(gulpSass().on("error", gulpSass.logError))
		.pipe(maps.write())
		.pipe(dest("./dist"));
}

function sassProduction() {
	return src("./assets/styles/application.scss")
		.pipe(
			gulpSass({ outputStyle: "compressed" }).on("error", gulpSass.logError)
		)
		.pipe(dest("./dist"));
}

// js
var appScripts = [
	"./assets/scripts/vendor/*.js",
	"./assets/scripts/modules/*.js",
];
function scripts() {
	return src(appScripts)
		.pipe(maps.init())
		.pipe(concat("application.js"))
		.pipe(maps.write())
		.pipe(dest("./dist/"));
}
function scriptsProduction() {
	return src(appScripts)
		.pipe(concat("application.js"))
		.pipe(uglify())
		.pipe(dest("./dist/"));
}

// watchers
function sassWatch() {
	watch("./assets/styles/**/*.scss", ["sass"]);
}

function scriptsWatch() {
	watch("./assets/scripts/**/*.js", ["scripts"]);
}

// aggregate tasks
exports.dev = series(
	clean,
	parallel(sass, scripts),
	parallel(sassWatch, scriptsWatch)
);
exports.prod = series(clean, parallel(sassProduction, scriptsProduction));
