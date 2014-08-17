VLC = {};

VLC.proc = null;

VLC.play = function (url, onExit) {
    console.log("VLC.play");
    if (VLC.proc && VLC.proc.proc) {
        VLC.proc.proc.on('close', Meteor.bindEnvironment(function (out, err, code) {
            VLC.play(url, onExit);
        }));
        VLC.stop(VLC.play);
        return;
    }
    VLC.proc = Exec.spawn('cvlc',
                          [ url ],
                          {
                            log: true,
                            onExit: Meteor.bindEnvironment(function (out, err, code) {
                                console.log("VLC.play.Exec.spawn.onExit");
                                VLC.proc = null;
                                if (typeof onExit === "function") {
                                    onExit();
                                }
                                VLC.emit('stop', url);
                            })
                          }
    );
}

VLC.stop = function (onExit) {
    console.log("VLC.stop");
    if (VLC.proc && VLC.proc.proc) {
        console.log("killing process...");
        if (typeof onExit === "function") {
            VLC.proc.proc.on('close', Meteor.bindEnvironment(function (out, err, code) {
                onExit();
            }));
        }
        VLC.proc.proc.kill();
    } else {
        if (typeof onExit === "function") {
            onExit();
        }
    }
}

VLC._eventListeners = {};
VLC._eventOnceListeners = {};
VLC._eventMaxListeners = 10;

VLC.addListener = function (event, listener) {
    if (VLC._eventMaxListeners > 0 && VLC.listenerCount() >= VLC._eventMaxListeners) {
        console.log("max listener count reached; listener was not added");
        return;
    }
    if (!(VLC._eventListeners[event] instanceof Array)) {
        VLC._eventListeners[event] = new Array();
    }
    VLC._eventListeners[event].push(listener);
    VLC.emit('newListener', listener);
}

VLC.on = function (event, listener) {
    console.log("VLC.addListener.apply(null, arguments)");
    VLC.addListener.apply(null, arguments);
}

VLC.once = function (event, listener) {
    if (VLC._eventMaxListeners > 0 && VLC.listenerCount() >= VLC._eventMaxListeners) {
        console.log("max listener count reached; listener was not added");
        return;
    }
    if (!(VLC._eventOnceListeners[event] instanceof Array)) {
        VLC._eventOnceListeners[event] = new Array();
    }
    VLC._eventOnceListeners[event].push(listener);
    VLC.emit('newListener', listener);
}

VLC.removeListener = function (event, listener) {
    var fn;
    for (fn = 0; fn < VLC._eventListeners[event].length; fn++) {
        if (VLC._eventListeners[event][fn] === listener) {
            VLC._eventListeners[event].splice(fn,1);
            VLC.emit('removeListener', listener);
            return;
        }
    }
    for (fn = 0; fn < VLC._eventOnceListeners[event].length; fn++) {
        if (VLC._eventOnceListeners[event][fn] === listener) {
            VLC._eventOnceListeners[event].splice(fn,1);
            VLC.emit('removeListener', listener);
            return;
        }
    }
}

VLC.removeAllListeners = function (event) {
    var fn;
    if (event) {
        if (event in VLC._eventListeners) {
            for (fn = VLC._eventListeners.length-1; fn >= 0; fn--) {
                VLC.emit('removeListener', VLC._eventListeners[event][fn]);
                VLC._eventListeners[event].splice(fn,1);
            }
        }
        if (event in VLC._eventOnceListeners) {
            for (fn = VLC._eventOnceListeners.length-1; fn >= 0; fn--) {
                VLC.emit('removeListener', VLC._eventOnceListeners[event][fn]);
                VLC._eventOnceListeners[event].splice(fn,1);
            }
        }
    } else {
        for (event in VLC._eventListeners) {
            for (fn = VLC._eventListeners.length-1; fn >= 0; fn--) {
                VLC.emit('removeListener', VLC._eventListeners[event][fn]);
                VLC._eventListeners[event].splice(fn,1);
            }
        }
        for (event in VLC._eventOnceListeners) {
            for (fn = VLC._eventOnceListeners.length-1; fn >= 0; fn--) {
                VLC.emit('removeListener', VLC._eventOnceListeners[event][fn]);
                VLC._eventOnceListeners[event].splice(fn,1);
            }
        }
    }
}

VLC.setMaxListeners = function (n) {
    VLC._eventMaxListeners = Math.max([0,VLC._eventMaxListeners]);
}

VLC.listeners = function (event) {
    var listeners = [];
    if (event in VLC._eventListeners) {
        listeners = listeners.concat(VLC._eventListeners[event]);
    }
    if (event in VLC._eventOnceListeners) {
        listeners = listeners.concat(VLC._eventOnceListeners[event]);
    }
}

VLC.emit = function (event) { // event arguments as additional arguments; emit(event, arg1, arg2, ...)
    var fn, args;
    args = Array.prototype.slice.call(arguments, 1);
    if (event in VLC._eventListeners) {
        for (fn = 0; fn < VLC._eventListeners[event].length; fn++) {
            VLC._eventListeners[event][fn].apply(null, args);
        }
    }
    if (event in VLC._eventOnceListeners) {
        for (fn = 0; fn < VLC._eventOnceListeners[event].length; fn++) {
            VLC._eventOnceListeners[event][fn].apply(null, args);
            VLC._eventOnceListeners[event].splice(fn,1);
        }
    }
}

VLC.listenerCount = function (event) {
    var total = 0;
    if (event) {
        if (event in VLC._eventListeners) {
            total += VLC._eventListeners[event].length;
        }
        if (event in VLC._eventOnceListeners) {
            total += VLC._eventOnceListeners[event].length;
        }
    }
    else {
        for (event in VLC._eventListeners) {
            total += VLC._eventListeners[event].length;
        }
        for (event in VLC._eventOnceListeners) {
            total += VLC._eventOnceListeners[event].length;
        }
    }
}
