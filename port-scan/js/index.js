Vue.config.debug = true;
Vue.config.devtools = true;
var stopTiming = null;
$('.progress').progress({
    autoSuccess: false
});



var ps = new PortScan();
var eventCb = {
    onopen: function (task) {
        vm.open++;
        console.log('端口开放:' + task);
    },
    onscan: function (flag, task) {
        console.log(flag + ':' + task)
        vm.scanned++;
        $('.progress').progress('increment');
    },
    onfinish: function () {
        vm.running = false;
        vm.result.sort(vm.sortip);
        setTimeout(function () {
            $('.progress').removeClass('success teal').addClass('grey inverted');
        }, 2000);
        stopTiming();
        console.clear();
        vm.$log('result');
    }
}
ps.setEvents(eventCb);


var scan = function () {
    if (this.running) return;
    if (!~this.host.search(/:|\./)) {
        alert('host格式不正确');
        this.host = '';
    }
    ps.opentarget = this.result = [];
    this.open = 0;
    this.scanned = 0;
    this.running = true;

    stopTiming && stopTiming();
    stopTiming = this.timing(Date.now());
    $('.progress').progress({
        value: 0,
        total: this.total,
        autoSuccess: true
    }).addClass('teal').removeClass('grey inverted success');



    ps.portscan_concurrence = this.concurrence;
    ps.portscan_timeout = this.timeout;
    if (this.signle) {
        ps.scan(this.host, eventCb.onfinish);
    } else {
        ps.scan(this.host, this.start, this.end);
    }
}






// 计时
var timing = function (startTime) {
    var t = this;
    var exit = later(function () {
        t.time = ((Date.now() - startTime) / 1000).toFixed(1);
    }, 150);
    return exit;
}

// 按ip和端口排序
var sortip = function (a, b) {
    var parseIP = function (a) {
        return parseInt(a.split(':')[0].split('.').pop());
    }
    var parsePort = function (a) {
        return parseInt(a.split(':').pop() || 80);
    }
    return parseIP(a) > parseIP(b) || parsePort(a) > parsePort(b);
};

var update = function () {
    this.signle = !this.host.includes('*');
    if (this.start < 0) this.start = 0;
    if (this.start > 65535) this.start = 65535;
    if (this.end < this.start) this.end = this.start;
    this.total = this.signle ? 1 : this.end - this.start + 1;
    if (this.running) {
        ps.portscan_concurrence = this.concurrence;
        ps.portscan_timeout = this.timeout;
        ps.queue.concurrence = this.concurrence;
        ps.queue.timeout = this.timeout;
    }
}

var setTarget = function (i) {
    switch (i) {
    case 0:
        this.host = 'baidu.com'
        break;
    case 1:
        this.host = 'baidu.com:*'
        this.start = 1;
        this.end = 1024;
        break;
    case 2:
        this.host = '192.168.1.*:80';
        this.start = 1;
        this.end = 255;
        break;
    }
}

var scan_info = {
    host: 'baidu.com:*',
    start: 1,
    end: 1024,
    concurrence: 200,
    timeout: 5000,
    result: ps.opentarget,
    signle: false,
    open: 0,
    scanned: 0,
    total: 1024,
    running: false,
    time: '0.0'
}


var vm = new Vue({
    el: '#app',
    data: scan_info,
    methods: {
        scan: scan,
        timing: timing,
        sortip: sortip,
        setTarget: setTarget
    }
});

vm.$watch('host', update);
vm.$watch('start', update);
vm.$watch('end', update);
vm.$watch('concurrence', update);
vm.$watch('timeout', update);