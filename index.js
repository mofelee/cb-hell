var fn1 = function(data, cb) {
    // some async operation.
    setTimeout(function() {
        var r1 = "result of fn1";
        cb(r1);
    }, 1000);
};

var fn2 = function(data, cb) {
    // some async operation.
    setTimeout(function() {
        var result = "result of fn2";
        cb(result);
    }, 1000);
};

var fn3 = function(data, cb) {
    // some async operation.
    cb("result of fn3");
};

var fn4 = function(data, cb) {
    // some async operation.
    cb("result of fn4");
};


// how to eliminate the nesting.
//fn1("begin", function(r1) {
//    fn2(r1, function(r2) {
//        fn3(r2, function(r3) {
//            fn4(r3, function(r4) {
//                console.log(r4);
//            });
//        });
//    });
//});

// var EventEmitter = require('events').EventEmitter;
// var events = new EventEmitter();


// 自己实现的事件管理
var myEventEmiter = function(){
  var myEvents = {};

  var service = {
    on: function(name, cb){
      myEvents[name] = cb;
    },
    emit: function(name, data){
      process.nextTick(function(){
        if(!myEvents[name]){
          throw '找不到事件' + name;
        }
        myEvents[name](data);
      });
    }
  };

  return service;
};

var events = myEventEmiter();

fn1('begin', function(data){
  events.emit('callFn2');
});

events.on('callFn2', function(data){
  fn2(data, function(data2){
    events.emit('callFn3', data2);
  });
});

events.on('callFn3', function(data){
  fn3(data, function(data3){
    events.emit('callFn4', data3);
  });
});

events.on('callFn4', function(data){
  fn4(data, function(data4){
    events.emit('callCb', data4);
  });
});

events.on('callCb', function(data){
  console.log(data);
});

// ///////
// function warp(fn1, data){
//   var warpedTasks = [fn1];
//
//   var service =  {
//     then: function(fn){
//       warpedTasks.push(fn);
//
//       return service;
//     }
//   };
//   //////////
//   var finished = function(data){
//     events.emit('finished', data);
//   };
//
//   events.on('finished', function(data){
//     var currentTask = warpedTasks.shift();
//
//     if(currentTask){
//         currentTask(data, finished);
//     }
//   });
//
//   events.emit('finished');
//
//   return service;
// }
//
// warp(fn1, 'begin')
//   .then(fn2)
//   .then(fn3)
//   .then(fn4)
//   .then(function(data){
//     console.log(data);
//   });

// var execSeries = function(){
//   var data = arguments[0];
//   var tasks = Array.prototype.slice.call(arguments, 1);
//
//   next(data);
//
//   function next(data, cb){
//
//     var currentTask = tasks.shift();
//
//     if(currentTask){
//       currentTask(data, next);
//     }
//   }
// };
//
// execSeries('begin', fn1, fn2, fn3, fn4, function(data){
//   console.log(data);
// });

//
// var tasks = [
//   fn1,
//   fn2,
//   fn3,
//   fn4
// ];
//
// function next(data, cb){
//
//   var currentTask = tasks.shift();
//
//   if(currentTask){
//     currentTask(data, next);
//   }
// }
//
// tasks.push(function(r4){
//   console.log(r4);
// });
//
// next('begin');
