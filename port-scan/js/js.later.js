/*
 * 封装setInterval，可以限制总的执行时间
 * 2016-05-02
 * vc1
 *
 */
function later(worker, interval, timeout, onTimeout) {
    // worker(exit, count, interval)

    interval = parseInt(interval) || 0;
    timeout = parseInt(timeout) || 0;
    var count = 0;
    var timer = null;
    var stoped = false;
    // 正常结束状态码
    var exitflag = 'ok';

    // 结束时钟循环，设置或获取exitcode
    var exitflag = function (flag) {
        if (stoped === false) {
            clearInterval(timer);
            stoped = true;
            exitflag = flag === undefined ? exitflag : flag;
        }
        return exitflag;
    }
    if (interval > 0) {
        timer = setInterval(function () {
            if (timeout > 0 && (count + 1) * interval > timeout) {
                exit('timeout');
                onTimeout && onTimeout(timeout, count, interval);
            }
            worker(exitflag, count, interval);
            count++;
        }, interval);
    }

    // 结束时钟循环，并设置结束flag，记录正常退出还是超时
    return exitflag;

    /*

    var exit = later(function(stop, count, interval) {
        console.log(count);
        if (count > 10) stop()
    }, 300, 2000, function(count) {
        alert(count)
    });

    */
}