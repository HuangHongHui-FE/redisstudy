// 1. Redis服务器返回的所有错误都是 ReplyError 的实例，可以通过 Redis 进行访问：

// const Redis = require("ioredis");
// const redis = new Redis();
// // This command causes a reply error since the SET command requires two arguments.
// redis.set("foo", (err) => {
//   err instanceof Redis.ReplyError;
// });




// 2. 这是 ReplyError 的错误堆栈：
// ReplyError: ERR wrong number of arguments for 'set' command
//     at ReplyParser._parseResult (/app/node_modules/ioredis/lib/parsers/javascript.js:60:14)
//     at ReplyParser.execute (/app/node_modules/ioredis/lib/parsers/javascript.js:178:20)
//     at Socket.<anonymous> (/app/node_modules/ioredis/lib/redis/event_handler.js:99:22)
//     at Socket.emit (events.js:97:17)
//     at readableAddChunk (_stream_readable.js:143:16)
//     at Socket.Readable.push (_stream_readable.js:106:10)
//     at TCP.onread (net.js:509:20)




// 3. 默认情况下，错误堆栈没有任何意义，因为整个堆栈都发生在 ioredis 模块本身而不是代码中。
// 因此，要找出错误在代码中的位置并不容易。 ioredis 提供了一个选项 showFriendlyErrorStack 来解决该问题。
// 启用 showFriendlyErrorStack 时，ioredis 将为您优化错误堆栈：

// const Redis = require("ioredis");
// const redis = new Redis({ showFriendlyErrorStack: true });
// redis.set("foo");

// 输出将是：
// ReplyError: ERR wrong number of arguments for 'set' command
//     at Object.<anonymous> (/app/index.js:3:7)
//     at Module._compile (module.js:446:26)
//     at Object.Module._extensions..js (module.js:464:10)
//     at Module.load (module.js:341:32)
//     at Function.Module._load (module.js:296:12)
//     at Function.Module.runMain (module.js:487:10)
//     at startup (node.js:111:16)
//     at node.js:799:3


// 这次，堆栈告诉您错误发生在代码的第三行。

// 太好了！但是，优化错误堆栈会大大降低性能。因此，默认情况下，此选项是禁用的，只能用于调试目的。不建议在生产环境中使用此功能。