
/*jshint esversion: 6 */

//instanciando os módulos

const gulp = require('gulp'),
//    gutil = require('gulp-util'),
    jshint = require('gulp-jshint'),
    uglify = require('gulp-uglify'),
    notify = require('gulp-notify'),
    clean = require('gulp-clean'),
    watch = require('gulp-watch'),
    replace = require('gulp-replace'),
    path  = require('path'),
    clear  = require('clear'),
    concat = require('gulp-concat'),
    cssmin = require('gulp-cssmin'),
    stripCssComments = require('gulp-strip-css-comments'),
    pathBuild = 'public/build', //pasta que ficará os arquivos CSS, JS depois do build
    pathReference = 'views'; //pasta aonde contém a referência para os arquivos CSS e JS



/*
TAREFA PARA LIMPAR A PASTA DE BUILD
*/

gulp.task('clear', function () {
	return gulp.src(pathBuild+'/**/*', {read: false})
		.pipe(clean());
});

/*FIM::: TAREFA PARA LIMPAR A PASTA DE BUILD*/

/*
TAREFAS PARA MINIFICAR ARQUIVOS JS, CSS
  - minifica todos os arquivos JS's e CSS's seja internos e externos
*/

const filesJS = 'public/js/**/*.js', //pasta que contém os arquivos JS que escrevemos
      filesJSVendors = 'public/vendors/**/*.js', //pasta que contém os arquivos JS externos
      filesCSS = 'public/css/**/*.css', //pasta que contém os arquivos CSS que escrevemos
      filesVendorsCSS = 'public/vendors/**/*.css'; //pasta que contém os arquivos CSS externos



gulp.task('minify', ['minify-js', 'minify-vendors-js', 'minify-css', 'minify-vendors-css']);

gulp.task('minify-js', function(){
  return gulp
          .src(filesJS)
          .pipe(uglify())
          .pipe(gulp.dest(pathBuild+'/js'));
});

gulp.task('minify-vendors-js', function(){
  return gulp
          .src(filesJSVendors)
          .pipe(uglify())
          .pipe(gulp.dest(pathBuild+'/vendors'));
});

gulp.task('minify-css', function(){
  return gulp
          .src(filesCSS)
          .pipe(stripCssComments({all: true}))
          .pipe(cssmin())
          .pipe(gulp.dest(pathBuild+'/css'));
});

gulp.task('minify-vendors-css', function(){
  return gulp
          .src(filesVendorsCSS)
          .pipe(stripCssComments({all: true}))
          .pipe(cssmin())
          .pipe(gulp.dest(pathBuild+'/vendors'));
});

/*FIM::: TAREFAS PARA MINIFICAR ARQUIVOS JS, CSS */

/*
TAREFAS DE RENOMEAR ARQUIVOS
  - renomea as chamadas dos arquivos JS para a pasta de build e
  ao contrário também, conforme o tipo de build
*/

const pathOriginJS = '../js/', //caminho físico nas páginas que fazem referência ao JS
      pathDestJS = '../build/js/', //novo caminho físico nas páginas que fazem referência ao JS após o build
      pathOriginCSS = '../css/', //caminho físico nas páginas que fazem referência ao CSS
      pathDestCSS = '../build/css/', //novo caminho físico nas páginas que fazem referência ao CSS após o build
      pathOriginVendors = '../vendors/', //caminho físico nas páginas que fazem referência ao CSS, JS externos
      pathDestVendors = '../build/vendors/';//novo caminho físico nas páginas que fazem referência ao CSS, JS externos após o build

gulp.task('replace-prod', function(){
  return gulp
          .src(pathReference+'/**')
          .pipe(replace(pathOriginJS, pathDestJS))
          .pipe(replace(pathOriginCSS, pathDestCSS))
          .pipe(replace(pathOriginVendors, pathDestVendors))
          .pipe(gulp.dest(pathReference));
});

gulp.task('replace-dev', function(){
  return gulp
          .src(pathReference+'/**')
          .pipe(replace(pathDestJS, pathOriginJS))
          .pipe(replace(pathDestCSS, pathOriginCSS))
          .pipe(replace(pathDestVendors, pathOriginVendors))
          .pipe(gulp.dest(pathReference));
});

/* FIM::: TAREFAS DE RENOMEAR ARQUIVOS*/

/*
TAREFAS PARA VALIDAR JS ESCRITO
*/

var contErr = 0, error_all = "";
gulp.task('lintVerify', function() {
  return gulp
          .src(filesJS)
          .pipe(jshint())
          // Use gulp-notify as jshint reporter
          .pipe(notify(function (file) {
            if (file.jshint.success) {
              // Don't show something if success
              //return false;
              /*if(contErr > 0)
                return false;

              return {
                sound: 'Frong',
                icon: path.join(__dirname, '/public/build/build-success.jpg'),
                title:'BUILD JS!',
                message: 'Chuck Norris Approves!'
              };*/
              return false;
            }

            var errors = file.jshint.results.map(function (data) {
              if (data.error) {
                contErr++;
                return "Line (" + data.error.line + ':' + data.error.character + ') ' + data.error.reason;
              }
            }).join("\n");

            error_all = error_all + file.relative + " (" + file.jshint.results.length + " errors)\n" + errors;
            error_all = error_all + "\n\n";
            return false;
            /*return {
              sound: 'Frong',
              icon: path.join(__dirname, '/public/build/build-fail.jpg'),
              title:'YOU BROKE THE BUILD!',
              message: file.relative + " (" + file.jshint.results.length + " errors)\n" + errors
            };*/
          }));
});

gulp.task('lint', ['lintVerify'], function(){
  clear();
  if(contErr === 0){
     return gulp.src('views/index.ejs').pipe(notify(function(){
      return {
        sound: 'Frong',
        icon: path.join(__dirname, '/public/img/build-success.jpg'),
        title:'BUILD JS!',
        message: 'Chuck Norris Approves!'
      };
    }));
  }else{
    contErr = 0;
    return gulp.src('views/index.ejs').pipe(notify(function(){
      return{
        sound: 'Frong',
        icon: path.join(__dirname, '/public/img/build-fail.jpg'),
        title:'YOU BROKE THE BUILD!',
        message: error_all
      };
    }));
  }
});

gulp.task('lintDev', ['lintVerify'], function(){
  if(contErr > 0){
    contErr = 0;
    var erro_show = error_all;
    console.error(erro_show);
    error_all = '';
    return gulp.src('views/index.ejs').pipe(notify(function(){
      return{
        sound: 'Frong',
        icon: path.join(__dirname, '/public/img/build-fail.jpg'),
        title:'YOU BROKE THE BUILD!',
        message: 'Verifique os erros em seu console.'
      };
    }));
  }
});

/*FIM::: TAREFAS PARA VALIDAR JS ESCRITO*/

gulp.task('development', function() {
    // corpo da tarefa
    gulp.watch(filesJS, ['lintDev']);
});

//TAREFAS PRINCIPAIS

gulp.task('prod', ['minify', 'replace-prod', 'lint']);

gulp.task('dev', ['replace-dev', 'development']);


//https://www.turbosite.com.br/blog/tutorial-otimizar-css-com-gulp-agrupar-minificar/
//http://blog.caelum.com.br/bye-bye-grunt-js-hello-gulp-js/
