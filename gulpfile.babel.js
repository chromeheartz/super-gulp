/*
    gulp는 항상 task와 함께 작동한다.

    task란?
    task는 모든 pug 파일을 가지고 이것들을 다른 폴더에 집어넣는것이 하나의 task가 될 수 있다.
    우선 html로 바꾸고.

    scss파일들을 가지고 css파일로 변환할 수도있고, 그 다음에 코드를 최소화시킨다 (min) 그 다음 css라는 폴더로 넣는다

    이런 task는 그룹으로 묶을 수 있다.
    예를들어 dev라는 하나의 task가 
    이미지 최적화하고, javascript를 압축하고 모든 파일들을 한 폴더에 집어넣고
    그 폴더를 브라우저에 출력시키는등 여러가지 task를 한번에 할 수있다.

    다양한 파트를 가질수있는것이다.
    pug,scss,js,img,폴더에 넣고, 브라우저에 열고 
    이런식. 

    우리는 여러가지 작은 task들을 만들어 그걸 하나의 명령어나 여러개의 명령어로 묶어서 사용할것이다.

    *
    첫번째 task를 만들어볼것이다.

    모든 pug파일을 html로 바꾸는 task !
    우리가 쓸것은 gulp pug라는 plugin이다.
    이것은 pug template를 컴파일 해주는것이다.

    task는 가끔씩 return해주어야할때가 있다. 
    gulp-pug를 보면 사용법이 나와있다.

    exports.views = () => {
        return src('./src/*.pug')
            .pipe(
            pug({
                // Your options in here.
            })
            )
            .pipe(dest('./dist'));
    };

    이부분은 gulp 가 어떻게 동작하는지를 알려준다
    gulp는 다양한 object를 가지는데 많지는 않은 API들이 있다
    src,dest,series,parallel .... 등

    여기서 중요한건 src, dest다.
    gulp.src라고 쓰고나서 하나의 패턴으로 모든 파일이랑 매치한다.
    routes 라는 오브젝트를 만들어서 적어주는것도 좋다.
    pug 의 src를 찾는다.
    src : "src/*.pug" 이런식으로 적어주게되면 주소를 찾아 조건에 맞는 파일을 컴파일해준다.

    주소를 만들었으면 그것을 pug function에 알려준다
    gulp.src(routes.pug.src) 같이

    ** gulp는 pipe랑 같이 쓰인다.
    pipe를 파이프라고 생각하면되는데
    내 파일들을 pipe에 넣고 gulp의 파일들이 물이라고 생각하고
    그 파이프에 집어넣으면 그 pipe가 변형시키는것이다

    src에 있는 파일들을 사용해서
    gulp는 일종의 파일의 흐름을 만든다
    우리는 거기다가 pipe로 연결하는것이다

    어떤 pipe는 코드를 컴파일 하거나 코드를 복사 코드를 최소화하는것이 될것이다

    export const pug = () => 
        gulp
            .src(routes.pug.src) 파일이 들어오면
            .pipe(pug())  무언가 처리를 하고, (pipe에 function을 넣는다.)
            .pipe(gulp.dest()); 그것을 어디에 두어야할까.

    dest(목적지)


    *** 우리가 컴파일을 하는데
    잘못되서 파일이 컴파일 되는경우가 있다.
    예를들어 경로를 잘못설정했다던지. 하게되면 실용적이지 못하게된다

    그러면 다시 빌드하자고 할 때가 있는데
    다시 build했을때 문제점은 기존에 있던 build와 충돌이 날 수 있다 
    그럴때를 위해서
    먼저 build를 청소한 이후에 build하는것을 말할것이다

    ** yarn add del 한 후에
    del을 import해준다

    그 후에
    export const clean = () => del(["build"]);
    함수를 만들어주어서
    task가 실행될때에 제일 첫번째로 clean을 실행하고 진행하게한다.

    ******* export
    export는 package.json에서 쓸 command만 해주면 된다.
    만약 clean을 export하지 않는다면 console이나 package.json에섯 사용하지 못한다.

    prepare과 assets를 만들어서
    export하는 부분에 넣어준다.

    export const dev = gulp.series([prepare, assets]);

    마지막으로 세번쨰 인자에 무언가를 넣을것이다.
    왜냐하면 이것이 dev이기 때문 그런데 또 build나 publish같은 과정이 있을수도있다.
    그런데 dev나 build같은 과정에 있는 어떤 것이든
    pug라는 task를 사용할것인데,

    그말인 즉 내가 두번써야 하거나 assets같은것을 만들어서 사용한다는 것을 의미한다.
*/

/*
    개발 워크플로우에 하고싶은 다음 일은
    개발 서버를 만드는 것이다
    localhost같은 서버

    그래서 다음에 할 것은 gulp webserver라는 플러그인을 사용할것이다.
    yarn add gulp-webserver 로 인스톨 한 후에
    import ws from "gulp-webserver";
    로 임포트해준다.

    gulp.task('webserver', function() {
    gulp.src('app')
        .pipe(webserver({
        livereload: true,
        directoryListing: true,
        open: true
        }));
    });

    처음에 src를 찾고 그 src는 서버에서 보여주고싶은 폴더일것이다.

    gulp.src("build")
        .pipe(ws({
            livereload : true,
            open : true
        }));

        우리가 보여주길 원하는 폴더는 build이고
        그 후에 pipe로 부른다.
        그다음 pipe에서 webserver를 실행하는데 옵션을 적어준다.

    현재 라이브 서버로 올리기는해도
    태그가 바뀌거나하면 그것을 보고있지는 않다.
    저절로 새로고침이 안됨.
    gulp가 우리 파일을 잊어버린것이다. 
    gulp는 우리 파일을 컴파일 했다
    우리는 dev라는 task를 실행했고 그 순간 끝나버린다.

    그래서 우리가 앞으로 gulp에게 계속 보고있으라고 지시해줄것이다.

    **** gulp watch

    watch는 기본적으로 몇개의 인자를 받는다. watch해야 하는 파일들
    그다음 function을 실행한다.

    그래서 얘는 지켜봐야 하는 파일이랑 몇 옵션을 인자로 받아서 task에 넣어주면 된다.

    **** 
    만약 내가 src의 index만을 본다고 해버리면 
    그건 즉 내가 templates안의 파일을 수정하면 그 파일들에서는 watch가 동작하지 않는것을 의미한다.
    만약 내가 partials 내부의 파일들을 수정하면 이것은 자동으로 컴파일 되지 않을것이다.
    내가 원하는것은 모든 pug파일이 수정되는것이다.

    예를들어 partials의 파일을 수정했을 때, index를 컴파일 하고 싶다는 뜻.

    routes에 watch라는 route를 하나 만들어
    모든 pug들을 볼 수 있도록 설정한다.이것이 뜻하는 것은 내가 모든 파일을 지켜보고 싶다는 것이다.
    만약 내가 src에 적힌 route만을 지켜본다고 설정하게 되면 
    src 폴더 안쪽 partials나 template가 바뀌었을때는 동작하지 않을것이다.

    const watch = () => {
        gulp.watch()
    }
    일단 여기서 gulp.watch에 어떤것을 보라고 설정을해주고, 그 다음에 어떤 task를 수행할 것인지 적어주어야한다.

    그 후에 watch를 postDev에 넣고
    이제 내가 gulp series를 실행할 때마다 얘는 prepare,assets,postDev를 실행할것이다.

    그 postDev는 웹서버를 실행하고 파일의 변동사항을 지켜볼것이다.

    만약 두가지 task가 동시에 실행되기를 원한다면
    const postDev = gulp.series([webserver, watch])
    이런식으로 일렬로 쓰면 안된다.
    그럴때에는 parallel을 써주면된다.

    **** parallel
    다른건 다 같은데 두가지 task를 병행하도록 할 수있다.


    **

    지금부터는 머리를 굴려야한다.
    지켜봐야 하는 파일이있고, 컴파일 해야하는 파일들이 있다
    예를들어 scss의 폴더에선
    밑의 모든 파일들을 지켜봐야 하지만 컴파일 해야 할 파일은
    styles 하나이다.

    *** gulp-image

    걸프 이미지를 사용하려면
    mac이라면 homebrew에서 다운 받아야할것들이있다.
    그리고 yarn add gulp-image

    routes에 이미지에 관한 src,dest를 만들고
    img에 관한 task를 만들것이다.

    const img = () => 
    gulp.src(routes.img.src)
        .pipe(image())
        .pipe(gulp.img.dest); 

    이런식으로 만들어주는데 여기서 한가지 중요한 점은
    이 img가 시간을 오래 잡아먹을 수 있다는것이다
    용량이 큰 jpg파일 같은것을 가지고 있다면 그것을 처리하는데 시간이 오래 걸릴것이다

    * 그래서 우리는 img를 세이브 할 떄마다 매번 돌리지 않게 할것이다.
    assets에 넣진 않을것이다.

    왜냐하면 dev상에서 실행시키고 싶지 않고, prepare에서 실행시키고싶다.

    const prepare = gulp.series([clean, img]);
    이제 이것은 dev에 준비과정에 벌어질것이다.
    이건 build하기 전 준비과정에서도 동작 할것이다.

    gulp-image는 많은 옵션이있다
    optipng (png 최적화)
    jpegRecompress (jpeg 재압축)
    ...

    적용하고 싶지 않은 옵션엔 false를 설정하면됨.

    현재는 아주 가벼운 이미지듦반 가지고있다.
    벡터랑 작은 이미지. 그래서 img를 실행할때마다
    바로바로 동작하고 있지만 
    최적화하는데 오래걸리는 엄청 큰 이미지들을 가지고 있게 된다면 시간이 오래 걸리게 될것이다.

    그래서 이미지들을 지켜보게하는건 내 자유고,
    어떤 경우는 img 명령을 따로 실행하기를 원할 수 있다.

    그것도 하나의 option이 될수 있다. img 커맨드를 독립적으로 사용하기를 원한다면.

    ***** gulp-sass

    기본적으로 gulp-sass가 node-sass로 sass파일을 전해주는것이다.

    우선 gulp-sass를 Import해야하고 그다음 gulp-sass를 컴파일러로 보낼것이다.
    gulp-sass5.0버전부터는 sass.compiler가 디폴트가 아니라서 
    import sass from "gulp-sass"라고 쓰게되면 작동을 안할 수가있어,
    const sass = require("gulp-sass")(require("node-sass"));
    이런식으로 구현한다

    일단 똑같이 routes에 경로를 만들어준다
    src는 compile할 주소가 될것이고
    dest는 compile완료된 파일이 들어가게 될 목적지

    상세하게 적는 이유는 단 하나만의 파일을 다루기 때문이다.

    style.scss
    에서 import해오는 파일들을 _ 밑줄을 걸어놓는 이유는
    자기들을 sass한테 자기들을 compile하지는 말고 
    사용만 하라고 알려주기 때문이다.


    ***** gulp-autoprefixer
    기본적으로 우리가 작업한 코드를 알아 듣지 못하는 구형 브라우저도 호환 가능하도록 만들어준다

    내가 정할 수 있는 다양한 옵션들이 있는데
    그 중에는 내 코드를 얼마나 호환 가능하게 만들지 정할 수 있다.
    브라우저들을 타겟으로 정할 수 있다.

    예) last 2 versions를 쓰면
    내 css의 호환성을 모든 브라우저들의 최대 2단계 아래버전까지 지원하겠다는 의미

    **** Minify

    코드가 길어질수록 낼 수 있는 만큼의 속도가 나오지 않는다.
    공백하나하나가 다 Byte용량이기 때문이다.

    gulp-csso를 써서 css파일을 최소화 시켜줄것이다.
    .pipe(csso())를 해주면되는데
    옵션도 적을 수 있다.

    **** javascript

    javascript를 다루기 위해서 해야할것은
    javascript를 babel에서 실행시켜주어야한다.
    그리고 Browserify에서도 실행

    *** Browserify
    개발자들이 브라우저에서 Node.js 스타일의 모듈을 사용하기 위한 오픈 소스 JS툴이다.
    기본적으로 브라우저는 import나 export같은것을 이해하지 못한다.
    Browserify는 이런것을 이해할 수 있도록 도와준다.

    기본적으로 동작하는 방식은 비슷하지만 우리는 이 js파일들을 변형해주어한다.
    우리는 browserify를 사용해야하지만 그와 동시에 babelify도 사용해야한다.
    그렇게해서 코드에 babel을 사용

    만약 react에서 이 보일러 플레이트를 사용하려면 여러가지 프리셋을 설치해야한다.
    이 프로젝트의 경우엔
    "presets" : ["@babel/preset-env"]
    이것밖에 없지만 react에서 쓸것이라면 react preset등을 설치해주어야한다.

*/

import gulp from "gulp";
import gpug from "gulp-pug"; 
import del from "del";
import ws from "gulp-webserver";
import image from "gulp-image";
const sass = require("gulp-sass")(require("node-sass"));
import autoprefixer from "gulp-autoprefixer";
import miniCSS from "gulp-csso";
import bro from "gulp-bro";
import babelify from "babelify";

sass.compiler = require("node-sass");

const routes = {
    pug : {
        watch : "src/**/*.pug",
        src : "src/*.pug", // 폴더안의 pug들을 제외한것 폴더안의 예를들어 header같이 포함하고 싶다면 src/**/*.pug
        dest : "build"
    },
    img : {
        src : "src/img/*",
        dest : "build/img"
    },
    scss : {
        watch : "src/scss/**/*.scss",
        src : "src/scss/style.scss",
        dest : "build/css"
    },
    js : {
        watch : "src/js/**/*.js",
        src : "src/js/main.js", //현재 import해오기때문에 한파일만 해도된다
        dest : "build/js"
    }
}

const pug = () => 
gulp
    .src(routes.pug.src)
    .pipe(gpug())
    .pipe(gulp.dest(routes.pug.dest));


const clean = () => del(["build"]);

const webserver = () => 
gulp.src("build")
    .pipe(ws({
        livereload : true,
        open : true
    }));

const img = () => 
    gulp.src(routes.img.src)
        .pipe(image())
        .pipe(gulp.dest(routes.img.dest)); 


const styles = () => 
    gulp.src(routes.scss.src)
        .pipe(sass().on("error", sass.logError)) // 에러가 있다면 sass만의 에러를 출력할것이다
        // console을 죽이는 javascript 내에서의 에러가 아니라 css에선 못찾겠다 이런 것
        .pipe(
            autoprefixer({ // autoprefixer
                browsers : ["last 2 versions"]
            })
        ) 
        .pipe(miniCSS()) // css minify
        .pipe(gulp.dest(routes.scss.dest));

const js = () => 
    gulp.src(routes.js.src)
        .pipe(bro({
            transform : [
                babelify.configure({ presets : ['@babel/preset-env'] }), //우리가 원하는 프리셋 react로 작업한다면 react preset 넣어주면됨
                [ 'uglifyify', { global : true } ]
            ]
        }))
        .pipe(gulp.dest(routes.js.dest));

const watch = () => {
    gulp.watch(routes.pug.watch, pug);
    gulp.watch(routes.img.src, img); // routes.img.src를 지켜보게 만듬
    // img 파일에 변동을줄때마다 최적화하는 과정을 실행하겠다는 의미.
    gulp.watch(routes.scss.watch, styles);
    gulp.watch(routes.js.watch, js); // js의 경우엔 모든 파일을 지켜보아야한다. 해서 routes에 watch의 경로를 만들어준다.
}

const prepare = gulp.series([clean, img]);

/*
    dev는 series를 할것이다
    task들의 series

    첫번째 task는 pug가 될것이다
*/
// export const dev = () => gulp.series([pug]); 

const assets = gulp.series([pug, styles, js]);

const postDev = gulp.parallel([webserver, watch])

export const dev = gulp.series([prepare, assets, postDev]);  // function이면 안되고 constant여야한다.
