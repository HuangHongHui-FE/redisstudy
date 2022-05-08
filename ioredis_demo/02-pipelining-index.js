// 发送一批命令，让命令流水线处理
// redis.pipeline()创建一个Pipeline实例，这些命令在内存中排队，并通过调用exec方法刷新到redis


const ioredis = require('ioredis')

const redis = new ioredis({
    port: 6379,
    host: '39.105.28.5'
})

// 1. 
// async function main(){
//     try{
//         const pipeline = redis.pipeline()
//         for(let i = 0; i < 100; i++){
//             pipeline.set(`${i}-foo`, i)
//         }
//         let res = await pipeline.exec()  // 这才开始执行
//         console.log(res)
//     }catch(err){
//         console.log('操作失败', err)
//     }
// }


// 2. 
const pipeline = redis.pipeline();
pipeline.set("foo", "bar");
pipeline.del("cc");
pipeline.exec((err, results) => {
  // `err` is always null, and `results` is an array of responses
  // corresponding to the sequence of queued commands.
  // Each response follows the format `[err, result]`.
});

// You can even chain the commands:
redis
  .pipeline()
  .set("foo", "bar")
  .del("cc")
  .exec((err, results) => {});

// `exec` also returns a Promise:
const promise = redis.pipeline().set("foo", "bar").get("foo").exec();
promise.then((result) => {
  // result === [[null, 'OK'], [null, 'bar']]
});



// 3. 每个链接的命令还可以具有一个回调，该回调将在命令得到答复时被调用：
redis
  .pipeline()
  .set("foo", "bar")
  .get("foo", (err, result) => {  //每一步都进行设置
    // result === 'bar'
  })
  .exec((err, result) => {
    // result[1][1] === 'bar'
  });




// 4. 还可以将命令和参数数组传递给构造函数：
redis
  .pipeline([
    ["set", "foo", "bar"],
    ["get", "foo"],
  ])
  .exec(() => {
    /* ... */
  });


// #length 属性显示管道中有多少个命令：
const length = redis.pipeline().set("foo", "bar").get("foo").length;
// length === 2


main()