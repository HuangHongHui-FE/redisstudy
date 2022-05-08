// 1. 大多数时候，事务命令 multi＆exec 与管道一起使用。因此，在调用 multi 时，
// 默认情况下会自动创建 Pipeline 实例，因此您可以像使用管道一样使用 multi：

redis
  .multi()
  .set("foo", "bar")
  .get("foo")
  .exec((err, results) => {
    // results === [[null, 'OK'], [null, 'bar']]
  });



// 2. 如果事务的命令链中存在语法错误（例如，错误的参数数量，错误的命令名称等），则不会执行任何命令，并返回错误：
redis
  .multi()
  .set("foo")
  .set("foo", "new value")
  .exec((err, results) => {
    // err:
    //  { [ReplyError: EXECABORT Transaction discarded because of previous errors.]
    //    name: 'ReplyError',
    //    message: 'EXECABORT Transaction discarded because of previous errors.',
    //    command: { name: 'exec', args: [] },
    //    previousErrors:
    //     [ { [ReplyError: ERR wrong number of arguments for 'set' command]
    //         name: 'ReplyError',
    //         message: 'ERR wrong number of arguments for \'set\' command',
    //         command: [Object] } ] }
  });



// 3. 就接口而言，multi 与管道的区别在于，当为每个链接的命令指定回调时，排队状态将传递给回调，而不是命令的结果：
redis
  .multi()
  .set("foo", "bar", (err, result) => {
    // result === 'QUEUED'
  })
  .exec(/* ... */);


// 4. 如果要使用不带管道的事务，请将 { pipeline: false } 传递给 multi，每个命令将立即发送到 Redis，
// 而无需等待 exec 调用：
redis.multi({ pipeline: false });
redis.set("foo", "bar");
redis.get("foo");
redis.exec((err, result) => {
  // result === [[null, 'OK'], [null, 'bar']]
});



// 5. multi 的构造函数还接受一批命令：

redis
  .multi([
    ["set", "foo", "bar"],
    ["get", "foo"],
  ])
  .exec(() => {
    /* ... */
  });


// 6. 管道支持内联事务，这意味着您可以将管道中的命令子集分组为一个事务：
redis
  .pipeline()
  .get("foo")
  .multi()
  .set("foo", "bar")
  .get("foo")
  .exec()
  .get("foo")
  .exec();