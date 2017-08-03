
/*

    콜백헬 개선

*/

// 1. ################################################

// function printLater(number){
//     setTimeout(
//         function() {
//             console.log(number);
//         },
//         1000
//     );
// }

// printLater(1);

// 2. ################################################


// function printLater(number, fn) {
//     setTimeout(
//         function() { 
//             console.log(number); 
//             fn(); 
//         },
//         1000
//     );
// }

// printLater(1, function() {
//     printLater(2, function() {
//         printLater(3, function() {
//             printLater(4, function(){});
//         })
//     })
// })

// 3. ################################################

// function printLater(number) {
//     return new Promise( // new로 Promise 생성
//         resolve => {
//             setTimeout( // 1초뒤 실행하도록 설정
//                 () => {
//                     console.log(number);
//                     resolve(); // promise 종료
//                 },
//                 1000
//             )
//         }
//     )
// }


// printLater(1)
// .then(() => printLater(2)) // printLater(1)이 실행되고나면 printLater(2) 실행
// .then(() => printLater(3))
// .then(() => printLater(4))
// .then(() => printLater(5))
// .then(() => printLater(6))

// function(){return printLater(6)} // 같은 의미


// 4. ################################################
// 반복 가능한 함수

// yield를 만나면 출력을 하고 멈춘다

// -> 위와 같이 만든함수를
//    generator 라고 한다



function* iterFunc(){
    
    yield console.log("첫번째 출력");
    yield console.log("두번째 출력");
    yield console.log("세번째 출력");
    yield console.log("네번째 출력");

}

var iter = iterFunc();
iter.next();   // 첫번째 출력
iter.next();   // 두번째 출력


