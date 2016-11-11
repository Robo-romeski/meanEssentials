


/*=========================================================
						CONFIG
=========================================================*/


//path
var path = require('path');



//gulp
var gulp = require('gulp');
var inject = require('gulp-inject');
var sourcemaps = require('gulp-sourcemaps');
var uglify = require('gulp-uglify');
var concat = require('gulp-concat');
var sass = require('gulp-sass');
var nodemon = require('gulp-nodemon');

var angularTemplateCache = require('gulp-angular-templatecache');
var mainBowerFiles = require('gulp-main-bower-files');
var filter = require('gulp-filter');
var saveLicense = require('uglify-save-license');




/*=========================================================
					DEVELOPMENT TASKS
=========================================================*/

//paths
var jsPaths = ['src/app/**/*.module.js','src/app/**/*.js'];
var sassPaths  = ['src/app/**/*.scss'];
var htmlTemplatePaths  = ['src/app/**/*.html'];





/*------------BUILDERS------------*/

gulp.task('buildScripts', function() {
//outputs main.js to src folder

	 gulp.src(jsPaths)
		.pipe(sourcemaps.init())
		.pipe(concat('src/main.js'))
		.pipe(uglify())
		.pipe(sourcemaps.write('./'))
		.pipe(gulp.dest('./'));
	
});

gulp.task('buildStyles', function() {
//outputs main.css to src folder

	gulp.src(sassPaths)
    .pipe(sourcemaps.init())
    .pipe(sass().on('error', sass.logError))
    .pipe(concat('src/main.css'))
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest('./'));
	
});





/*------------INJECTORS------------*/

gulp.task('injectScripts', function() {
//injects main.js into index.html

	gulp.src('./src/index.html')
 	.pipe(inject(gulp.src(['./src/main.js','./src/main.css']),{relative: true}))	
 	.pipe(gulp.dest('./src'));
	
});


gulp.task('injectStyles', function() {
//injects main.css into index.html

	gulp.src('./src/index.html')
 	.pipe(inject(gulp.src(['./src/main.js','./src/main.css']),{relative: true}))	
 	.pipe(gulp.dest('./src'));
	
});





/*------------WATCHERS------------*/

gulp.task('watchScripts', function() {
	gulp.watch(jsPaths,['buildScripts','injectScripts'])
});

gulp.task('watchStyles', function() {
	gulp.watch(sassPaths,['buildStyles','injectStyles'])
});




/*------------DOERS------------*/

gulp.task('serve',['buildScripts','buildStyles','injectScripts','injectStyles','watchScripts','watchStyles'], function() {
// starts server, runs tasks
	
	//wiredep injects bower components
	var wiredep = require('wiredep')({src: 'src/index.html',  ignorePath: '/bower_components'});

	nodemon({
		script: 'index.js'
	})


});




/*=========================================================
					PRODUCTION TASKS
=========================================================*/

gulp.task('build',function(){



	//declare paths
	var jsPaths = ['src/app/**/*.module.js', '.temp/templates.js', 'src/app/**/*.js'];
	var sassPaths  = ['src/app/**/*.scss'];
	var htmlTemplatePaths  = ['src/app/**/*.html'];

	//INDEX CLONE
	//first copy index file to dist folder
	gulp.src('./src/index.html')
	.pipe(gulp.dest('./dist'));

	//TEMPLATE CACHE
	//build template cache and convert to angular script
	//put in temp folder to later reference in js build
	gulp.src(htmlTemplatePaths)
	.pipe(angularTemplateCache({standAlone: false}))
	.pipe(gulp.dest('./.temp'));

/*------------BUILDERS------------*/

	//VENDOR SCRIPTS BUILD
	//builds bower componenets js files
	//ends in dist folder
	var filterJS = filter('**/*.js', { restore: true });
	gulp.src('./bower.json')
    .pipe(mainBowerFiles('**/*.js'))
    .pipe(filterJS)
    .pipe(concat('vendorScripts.js'))
    .pipe(uglify({output: {comments: saveLicense}}))
    .pipe(filterJS.restore)
    .pipe(gulp.dest('./dist'));


    //VENDOR STYLES BUILD
	//builds bower componenets css files
	//ends in dist folder
	gulp.src(['./bower_components/**/*.min.css'])
    .pipe(concat('./dist/vendorStyles.min.css'))
    .pipe(gulp.dest('./'))




	//JS BUILD
	//ends in dist folder
	gulp.src(jsPaths)
	.pipe(concat('./dist/main.js'))
	.pipe(uglify())
	.pipe(gulp.dest('./'));


	//STYLES BUILD
	//ends in dist folder
	gulp.src(sassPaths)
    .pipe(sass().on('error', sass.logError))
    .pipe(concat('./dist/main.css'))
    .pipe(gulp.dest('./'));



/*------------INJECTORS------------*/



    //INJECT SCRIPTS
    gulp.src('./dist/index.html')
 	.pipe(inject(gulp.src(['./dist/vendorScripts.js', './dist/main.js','./dist/main.css']),{relative: true}))	
 	.pipe(gulp.dest('./dist'));

 	//INJECT STYLES
 	gulp.src('./dist/index.html')
 	.pipe(inject(gulp.src(['./dist/main.js','./dist/main.css','./dist/vendorStyles.min.css']),{relative: true}))	
 	.pipe(gulp.dest('./dist'));


});








// gulp.task('restoreTest', function(){

// 	// var filterJS = filter('**/*.js', { restore: true });

// 	gulp.src('./restoreTest/*.js')
//     // .pipe(filterJS)
//     .pipe(concat('vendor.js'))
//     .pipe(uglify()).on('error', function(error){
//     	console.log("error");
//     	console.log(error);
//     })
//     // .pipe(filterJS.restore)
//     .pipe(gulp.dest('./restoreDest'));
// })












































