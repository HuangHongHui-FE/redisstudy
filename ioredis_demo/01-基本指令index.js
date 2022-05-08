const Redis = require("ioredis");
const redis = new Redis({
    port: 6379,
    host: '....'
}); // uses defaults unless given configuration object


redis.set("foo", "bar");

// 1. 
redis.get("foo", function (err, result) {
  if (err) {
    console.error(err);
  } else {
    console.log(result); // Promise resolves to "bar"
  }
});

// 2.
redis.get("foo").then(function (result) {
  console.log(result); // Prints "bar"
});

// 3.
async function main(){
    try{
        const ret = await redis.get('foo')
        console.log(ret)
    }catch(err){
        console.log('操作失败', err)
    }
}
main()


redis.zadd("sortedSet", 1, "one", 2, "dos", 4, "quatro", 3, "three");

redis.zrange("sortedSet", 0, 2, "WITHSCORES").then((res) => console.log(res));


redis.set("key", 100, "EX", 10);