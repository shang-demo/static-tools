/*
 * 并发任务队列
 * 2016-05-02
 * vc1
 *
 */
function Queue(worker, concurrence) {
    // exit = worker(task, next)

    this.worker = worker;
    this.timeout = 0; // 大于0为每个任务设置超时时间，继续下次执行
    this.onTimeout = null;
    this.onfinish = null;

    // 限制同时运行的并发数量
    this.concurrence = parseInt(concurrence) > 1 ? parseInt(concurrence) : 1;
    this.runningCount = 0;

    this.tasks = [];
    this.original_tasks = this.tasks;
    this.unfinished = 0;

    this.running = false;
}

Queue.prototype.work = function () {
    var _this = this;
    this.running = true;

    if (this.tasks.length === 0) {
        this.runningCount--;
        return
    }

    var task = this.tasks.shift();

    var timer = {
        timeout: false,
        id: -1,
        workerkiller: null //worker返回的结束函数，执行超时后执行此函数结束任务
    }

    if (this.timeout > 0) {
        timer.id = setTimeout(function () {
            //任务执行超时后
            timer.timeout = true;
            typeof timer.workerkiller === 'function' && timer.workerkiller('worker_timeout', task);
            _this.onTimeout && _this.onTimeout(task);
            _this.next();
        }, this.timeout)
    }

    setTimeout(function () {
        timer.workerkiller = _this.worker(task, function () {
            // if (task == 'baidu.com:80' || task == 'baidu.com:443') debugger
            clearTimeout(timer.id);
            _this.next();
        }, timer);
    }, 0);
}

Queue.prototype.next = function () {
    this.unfinished--;

    if (this.tasks.length === 0 && this.unfinished === 0) {
        // 任务全部完成
        this.onfinish && this.onfinish(this);
        this.running = false;
        this.runningCount--;
        return;
    }

    // 动态调整并发数量

    if (this.runningCount - this.concurrence > 0) {
        this.runningCount--;
        return;
    }

    do {
        this.work();
    } while (this.concurrence - this.runningCount > 0 && this.tasks.length && ++this.runningCount);

}

Queue.prototype.push = function (task, autoStart) {
    this.tasks.push(task);
    this.unfinished++;
    //autoStart为true，push之后启动队列
    if (autoStart && !this.running) {
        this.start();
    }
}

Queue.prototype.start = function () {
    this.unfinished = this.tasks.length;
    var new_worker = this.concurrence - this.runningCount;
    this.original_tasks = this.tasks.slice();
    for (var i = 0; i < new_worker; i++) {
        this.work();
        this.runningCount++;
    }
    return new_worker;
}


/*

var q = new Queue(function(task, next, timer) {
    //模拟延迟任务
    $.get('https://httpbin.org/delay/' + Math.ceil(Math.random() * 10 % 3), function() {
        if(timer.timeout) return;
        console.log(task);
        next();
    });

}, 2);
for (var i = 0; i < 50; i++) {
    q.push(i);
}
q.timeout = 5000;
q.onTimeout = function(task) {
    console.warn(task + ' : timeout')
}
q.onfinish = function() {
    console.info('队列执行完毕');
}
q.start();
setTimeout(function() {
    console.log('runningCount:' + q.runningCount);
}, 1000);
setTimeout(function() {
    console.debug('加速');
    q.concurrence = 10;
    setTimeout(function() {
        console.log('runningCount:' + q.runningCount);
    }, 5000);
}, 10000);

*/