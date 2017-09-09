(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define("bobtail-rx", ["exports", "underscore"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require("underscore"));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global._);
    global.rx = mod.exports;
  }
})(this, function (exports, _underscore) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.transaction = exports.smartUidify = exports.uidify = exports.basicDiff = exports.cellToSet = exports.cellToMap = exports.cellToArray = exports.flatten = exports.cast = exports.set = exports.map = exports.array = exports.cell = exports.autoReactify = exports.reactify = exports.unlift = exports.lift = exports.liftSpec = exports.DepSet = exports.SrcSet = exports.ObsSet = exports.DepMap = exports.SrcMap = exports.ObsMap = exports.concat = exports.IndexedArray = exports.DepArray = exports.IndexedDepArray = exports.MappedDepArray = exports.SrcArray = exports.ObsArray = exports.DepCell = exports.SrcCell = exports.ObsCell = exports.ObsBase = exports.subOnce = exports.autoSub = exports.onDispose = exports.snap = exports.postLagBind = exports.lagBind = exports.bind = exports.promiseBind = exports.asyncBind = exports.hideMutationWarnings = exports._recorder = exports.types = exports.upstream = exports.skipFirst = exports.Ev = exports._depMgr = exports.DepMgr = undefined;
  exports.allDownstream = allDownstream;

  var _underscore2 = _interopRequireDefault(_underscore);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  function _possibleConstructorReturn(self, call) {
    if (!self) {
      throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
    }

    return call && (typeof call === "object" || typeof call === "function") ? call : self;
  }

  function _inherits(subClass, superClass) {
    if (typeof superClass !== "function" && superClass !== null) {
      throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
    }

    subClass.prototype = Object.create(superClass && superClass.prototype, {
      constructor: {
        value: subClass,
        enumerable: false,
        writable: true,
        configurable: true
      }
    });
    if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
  }

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  var _createClass = function () {
    function defineProperties(target, props) {
      for (var i = 0; i < props.length; i++) {
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || false;
        descriptor.configurable = true;
        if ("value" in descriptor) descriptor.writable = true;
        Object.defineProperty(target, descriptor.key, descriptor);
      }
    }

    return function (Constructor, protoProps, staticProps) {
      if (protoProps) defineProperties(Constructor.prototype, protoProps);
      if (staticProps) defineProperties(Constructor, staticProps);
      return Constructor;
    };
  }();

  var _slicedToArray = function () {
    function sliceIterator(arr, i) {
      var _arr = [];
      var _n = true;
      var _d = false;
      var _e = undefined;

      try {
        for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
          _arr.push(_s.value);

          if (i && _arr.length === i) break;
        }
      } catch (err) {
        _d = true;
        _e = err;
      } finally {
        try {
          if (!_n && _i["return"]) _i["return"]();
        } finally {
          if (_d) throw _e;
        }
      }

      return _arr;
    }

    return function (arr, i) {
      if (Array.isArray(arr)) {
        return arr;
      } else if (Symbol.iterator in Object(arr)) {
        return sliceIterator(arr, i);
      } else {
        throw new TypeError("Invalid attempt to destructure non-iterable instance");
      }
    };
  }();

  function _toConsumableArray(arr) {
    if (Array.isArray(arr)) {
      for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) {
        arr2[i] = arr[i];
      }

      return arr2;
    } else {
      return Array.from(arr);
    }
  }

  var nextUid = 0;
  var mkuid = function mkuid() {
    return nextUid += 1;
  };

  var _union = function _union(first, second) {
    return new Set([].concat(_toConsumableArray(Array.from(first)), _toConsumableArray(Array.from(second))));
  };
  var _intersection = function _intersection(first, second) {
    return new Set(Array.from(first).filter(function (item) {
      return second.has(item);
    }));
  };
  var _difference = function _difference(first, second) {
    return new Set(Array.from(first).filter(function (item) {
      return !second.has(item);
    }));
  };

  var popKey = function popKey(x, k) {
    if (!(k in x)) {
      throw new Error("object has no key " + k);
    }
    var v = x[k];
    delete x[k];
    return v;
  };

  function mapPop(x) {
    var k = x.keys().next().value;
    return [k, mapDel(x, k)];
  }

  var mapDel = function mapDel(x, k) {
    var v = x.get(k);
    x.delete(k);
    return v;
  };

  var mkMap = function mkMap(xs) {
    var k = void 0,
        v = void 0;
    if (xs == null) {
      xs = [];
    }
    var map = Object.create != null ? Object.create(null) : {};
    if (_underscore2.default.isArray(xs)) {
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = xs[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var _step$value = _slicedToArray(_step.value, 2);

          k = _step$value[0];
          v = _step$value[1];
          map[k] = v;
        }
      } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion && _iterator.return) {
            _iterator.return();
          }
        } finally {
          if (_didIteratorError) {
            throw _iteratorError;
          }
        }
      }
    } else {
      for (k in xs) {
        v = xs[k];map[k] = v;
      }
    }
    return map;
  };

  var sum = function sum(xs) {
    var n = 0;
    var _iteratorNormalCompletion2 = true;
    var _didIteratorError2 = false;
    var _iteratorError2 = undefined;

    try {
      for (var _iterator2 = xs[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
        var x = _step2.value;
        n += x;
      }
    } catch (err) {
      _didIteratorError2 = true;
      _iteratorError2 = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion2 && _iterator2.return) {
          _iterator2.return();
        }
      } finally {
        if (_didIteratorError2) {
          throw _iteratorError2;
        }
      }
    }

    return n;
  };

  //
  // Events and pub-sub dependency management
  //

  // Just a global mapping from subscription UIDs to source Evs; this essentially
  // enables us to follow subscription UIDs up the dependency graph (from
  // dependents)

  var DepMgr = exports.DepMgr = function () {
    function DepMgr() {
      _classCallCheck(this, DepMgr);

      this.buffering = 0;
      this.events = new Map();
    }
    // called by Ev.sub to register a new subscription


    _createClass(DepMgr, [{
      key: "transaction",
      value: function transaction(f) {
        var _this = this;

        var res = void 0;
        this.buffering += 1;
        try {
          res = f();
        } finally {
          this.buffering -= 1;
          if (this.buffering === 0 && this.events.size) {
            (function () {
              var oldDeps = new Set();
              var immediateDeps = new Set();
              var internalDeps = new Set();
              var refreshed = new Set();
              var allDeps = void 0;
              _this.buffering++;
              while (_this.events.size) {
                var _loop = function _loop() {
                  var _mapPop = mapPop(_this.events),
                      _mapPop2 = _slicedToArray(_mapPop, 2),
                      ev = _mapPop2[0],
                      pubs = _mapPop2[1];

                  ev.downstreamCells.forEach(function (c) {
                    if (oldDeps.has(c)) {
                      return;
                    }
                    c._shield = true;
                    /*
                    internal cells--those used by DepArrays/Sets/Maps--propagate changes to their containing
                    object imperatively, by calling an update method. That means there is no direct connection
                    in the DAG to their dependent objects; indeed there cannot be, as the point of these types
                    is that not all of their dependent objects will need to refresh for every change. As such,
                    to establish the dependencies that *do* need to be refreshed, we refresh the internal cell,
                    which will cause downstream cells to be added to the refresh list.
                    */

                    if (c.internal && !internalDeps.has(c)) {
                      internalDeps.add(c);
                      c.refresh();
                    } else {
                      immediateDeps.add(c);
                    }
                  });
                  if (ev.digest) {
                    ev._realPub.apply(ev, _toConsumableArray(ev.digest(pubs)));
                  } else {
                    pubs.forEach(function (data) {
                      return ev._realPub(data);
                    });
                  }
                };

                while (_this.events.size) {
                  _loop();
                }
                allDeps = allDownstream.apply(undefined, _toConsumableArray(Array.from(immediateDeps)));
                allDeps.forEach(function (c) {
                  c._shield = true;
                });
                allDeps.forEach(function (c) {
                  c.refresh();refreshed.add(c);
                });
                oldDeps = immediateDeps;
                immediateDeps = new Set();
              }
              refreshed.forEach(function (c) {
                c._shield = false;
              });
              _this.buffering--;
            })();
          }
        }
        return res;
      }
    }]);

    return DepMgr;
  }();

  var _depMgr = exports._depMgr = new DepMgr();
  var depMgr = _depMgr;

  var Ev = exports.Ev = function () {
    function Ev(init, observable, digest) {
      _classCallCheck(this, Ev);

      this.observable = observable;
      this.init = init;
      this.subs = mkMap();
      this.downstreamEvents = new Set();
      this.digest = digest;
    }

    _createClass(Ev, [{
      key: "sub",
      value: function sub(listener) {
        var uid = mkuid();
        if (this.init != null) {
          listener(this.init());
        }
        this.subs[uid] = listener;
        return uid;
      }
      // callable only by the src

    }, {
      key: "pub",
      value: function pub(data) {
        if (depMgr.buffering) {
          if (!depMgr.events.get(this)) {
            depMgr.events.set(this, []);
          }
          depMgr.events.get(this).push(data);
        } else {
          this._realPub(data);
        }
      }
    }, {
      key: "_realPub",
      value: function _realPub(data) {
        for (var uid in this.subs) {
          var listener = this.subs[uid];
          listener(data);
        }
      }
    }, {
      key: "unsub",
      value: function unsub(uid) {
        return popKey(this.subs, uid);
      }
      // listener is subscribed only for the duration of the context

    }, {
      key: "scoped",
      value: function scoped(listener, context) {
        var uid = this.sub(listener);
        try {
          return context();
        } finally {
          this.unsub(uid);
        }
      }
    }, {
      key: "downstreamCells",
      get: function get() {
        var cells = new Set();
        this.downstreamEvents.forEach(function (ev) {
          if (ev.observable instanceof ObsCell) {
            cells.add(ev.observable);
          }
        });
        return cells;
      }
    }]);

    return Ev;
  }();

  var skipFirst = exports.skipFirst = function skipFirst(f) {
    var first = true;
    return function () {
      if (first) {
        return first = false;
      } else {
        for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
          args[_key] = arguments[_key];
        }

        return f.apply(undefined, _toConsumableArray(args || []));
      }
    };
  };

  //
  // Reactivity
  //
  var upstream = exports.upstream = function upstream(cell) {
    var events = Array.from(cell.upstreamEvents);
    var depCells = events.map(function (ev) {
      return ev.observable;
    });
    return Array.from(new Set(depCells));
  };

  function allDownstreamHelper() {
    for (var _len2 = arguments.length, cells = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
      cells[_key2] = arguments[_key2];
    }

    if (cells.length) {
      var downstream = _underscore2.default.chain(cells).map(function (cell) {
        return Array.from(cell.onSet.downstreamCells);
      }).flatten().uniq().sortBy(function (c) {
        return !c.internal;
      }).value();
      return _underscore2.default.flatten([downstream, allDownstreamHelper.apply(undefined, _toConsumableArray(downstream))]);
    }
    return [];
  }

  function allDownstream() {
    var seen = new Set();
    var ret = [];
    var downstreams = void 0;

    for (var _len3 = arguments.length, cells = Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
      cells[_key3] = arguments[_key3];
    }

    var _iteratorNormalCompletion3 = true;
    var _didIteratorError3 = false;
    var _iteratorError3 = undefined;

    try {
      for (var _iterator3 = cells[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
        var _cell2 = _step3.value;

        if (!seen.has(_cell2)) {
          downstreams = allDownstreamHelper(_cell2);
          downstreams.forEach(function (d) {
            return seen.add(d);
          });
          ret = ret.concat([_cell2].concat(_toConsumableArray(downstreams)));
        }
      }
    } catch (err) {
      _didIteratorError3 = true;
      _iteratorError3 = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion3 && _iterator3.return) {
          _iterator3.return();
        }
      } finally {
        if (_didIteratorError3) {
          throw _iteratorError3;
        }
      }
    }

    return Array.from(new Set(ret.reverse())).reverse();
  }

  var Recorder = function () {
    function Recorder() {
      _classCallCheck(this, Recorder);

      this.stack = [];
      this.isMutating = false;
      this.isIgnoring = false;
      this.hidingMutationWarnings = false;
      this.onMutationWarning = new Ev(); // just fires null for now
    }
    // takes a dep cell and push it onto the stack as the current invalidation
    // listener, so that calls to .sub (e.g. by ObsCell.get) can establish a
    // dependency


    _createClass(Recorder, [{
      key: "record",
      value: function record(dep, f) {
        if (this.stack.length > 0 && !this.isMutating) {
          (0, _underscore2.default)(this.stack).last().addNestedBind(dep);
        }
        this.stack.push(dep);
        // reset isMutating
        var wasMutating = this.isMutating;
        this.isMutating = false;
        // reset isIgnoring
        var wasIgnoring = this.isIgnoring;
        this.isIgnoring = false;
        try {
          return f();
        } finally {
          this.isIgnoring = wasIgnoring;
          this.isMutating = wasMutating;
          this.stack.pop();
        }
      }
    }, {
      key: "sub",
      value: function sub(event, condFn) {
        if (condFn == null) {
          condFn = function condFn() {
            return true;
          };
        }
        if (this.stack.length > 0 && !this.isIgnoring) {
          var topCell = (0, _underscore2.default)(this.stack).last();
          topCell.upstreamEvents.add(event);
          event.downstreamEvents.add(topCell.onSet);
          return autoSub(event, function () {
            for (var _len4 = arguments.length, evData = Array(_len4), _key4 = 0; _key4 < _len4; _key4++) {
              evData[_key4] = arguments[_key4];
            }

            if (condFn.apply(undefined, _toConsumableArray(evData || [])) && !topCell._shield) {
              return topCell.refresh();
            }
          });
        }
      }
    }, {
      key: "addCleanup",
      value: function addCleanup(cleanup) {
        if (this.stack.length > 0) {
          return (0, _underscore2.default)(this.stack).last().addCleanup(cleanup);
        }
      }
    }, {
      key: "hideMutationWarnings",
      value: function hideMutationWarnings(f) {
        var wasHiding = this.hidingMutationWarnings;
        this.hidingMutationWarnings = true;
        try {
          return f();
        } finally {
          this.hidingMutationWarnings = wasHiding;
        }
      }
    }, {
      key: "fireMutationWarning",
      value: function fireMutationWarning() {
        /*eslint-disable*/
        console.warn("Mutation to observable detected during a bind context");
        /*eslint-enable*/
        return this.onMutationWarning.pub(null);
      }
    }, {
      key: "mutating",
      value: function mutating(f) {
        if (this.stack.length > 0 && !this.hidingMutationWarnings) {
          this.fireMutationWarning();
        }
        var wasMutating = this.isMutating;
        this.isMutating = true;
        try {
          return f();
        } finally {
          this.isMutating = wasMutating;
        }
      }
    }, {
      key: "ignoring",
      value: function ignoring(f) {
        var wasIgnoring = this.isIgnoring;
        this.isIgnoring = true;
        try {
          return f();
        } finally {
          this.isIgnoring = wasIgnoring;
        }
      }
    }]);

    return Recorder;
  }();

  var types = exports.types = { "cell": "cell", "array": "array", "map": "map", "set": "set" };

  var _recorder = exports._recorder = new Recorder();
  var recorder = _recorder;

  var hideMutationWarnings = exports.hideMutationWarnings = function hideMutationWarnings(f) {
    return recorder.hideMutationWarnings(f);
  };

  var asyncBind = exports.asyncBind = function asyncBind(init, f) {
    var dep = new DepCell(f, init);
    dep.refresh();
    return dep;
  };

  var promiseBind = exports.promiseBind = function promiseBind(init, f) {
    return asyncBind(init, function () {
      var _this2 = this;

      return this.record(f).done(function (res) {
        return _this2.done(res);
      });
    });
  };

  var bind = exports.bind = function bind(f) {
    return asyncBind(null, function () {
      return this.done(this.record(f));
    });
  };

  var lagBind = exports.lagBind = function lagBind(lag, init, f) {
    var timeout = null;
    return asyncBind(init, function () {
      var _this3 = this;

      if (timeout != null) {
        clearTimeout(timeout);
      }
      return timeout = setTimeout(function () {
        return _this3.done(_this3.record(f));
      }, lag);
    });
  };

  var postLagBind = exports.postLagBind = function postLagBind(init, f) {
    var timeout = null;
    return asyncBind(init, function () {
      var _this4 = this;

      var _record = this.record(f),
          val = _record.val,
          ms = _record.ms;

      if (timeout != null) {
        clearTimeout(timeout);
      }
      return timeout = setTimeout(function () {
        return _this4.done(val);
      }, ms);
    });
  };

  var snap = exports.snap = function snap(f) {
    return recorder.ignoring(f);
  };

  var onDispose = exports.onDispose = function onDispose(cleanup) {
    return recorder.addCleanup(cleanup);
  };

  var autoSub = exports.autoSub = function autoSub(ev, listener) {
    var subid = ev.sub(listener);
    onDispose(function () {
      return ev.unsub(subid);
    });
    return subid;
  };

  var subOnce = exports.subOnce = function subOnce(event, listener) {
    var uid = autoSub(event, skipFirst(function () {
      listener.apply(undefined, arguments);
      event.unsub(uid);
    }));
    return uid;
  };

  var ObsBase = function () {
    function ObsBase() {
      _classCallCheck(this, ObsBase);

      this.events = [];
      this._uid = mkuid();
    }

    _createClass(ObsBase, [{
      key: "flatten",
      value: function flatten() {
        return _flatten(this);
      }
    }, {
      key: "subAll",
      value: function subAll(condFn) {
        if (condFn == null) {
          condFn = function condFn() {
            return true;
          };
        }return this.events.forEach(function (ev) {
          return recorder.sub(ev, condFn);
        });
      }
    }, {
      key: "raw",
      value: function raw() {
        return this._base;
      }
    }, {
      key: "_mkEv",
      value: function _mkEv(f, digest) {
        var ev = new Ev(f, this, digest);
        this.events.push(ev);
        return ev;
      }
    }]);

    return ObsBase;
  }();

  ObsBase.prototype.to = {
    cell: function cell() {
      return _cell3.from(undefined);
    },
    array: function array() {
      return _array.from(undefined);
    },
    map: function map() {
      return _map.from(undefined);
    },
    set: function set() {
      return _set.from(undefined);
    }
  };

  exports.ObsBase = ObsBase;

  var ObsCell = exports.ObsCell = function (_ObsBase) {
    _inherits(ObsCell, _ObsBase);

    function ObsCell(_base) {
      _classCallCheck(this, ObsCell);

      var _this5 = _possibleConstructorReturn(this, (ObsCell.__proto__ || Object.getPrototypeOf(ObsCell)).call(this));

      _this5._base = _base != null ? _base : null;
      _this5.onSet = _this5._mkEv(function () {
        return [null, _this5._base];
      }, function (data) {
        return [[_underscore2.default.first(data)[0], _underscore2.default.last(data)[1]]];
      }); // [old, new]
      _this5._shield = false;
      var downstreamCells = function downstreamCells() {
        return _this5.onSet.downstreamCells;
      };
      _this5.refreshAll = function () {
        if (_this5.onSet.downstreamEvents.size && !_this5._shield) {
          _this5._shield = true;
          var _cells2 = allDownstream.apply(undefined, _toConsumableArray(Array.from(downstreamCells()) || []));
          _cells2.forEach(function (c) {
            return c._shield = true;
          });
          try {
            return _cells2.forEach(function (c) {
              return c.refresh();
            });
          } finally {
            _cells2.forEach(function (c) {
              return c._shield = false;
            });
            _this5._shield = false;
          }
        }
      };
      _this5.refreshSub = autoSub(_this5.onSet, _this5.refreshAll);
      return _this5;
    }

    _createClass(ObsCell, [{
      key: "all",
      value: function all() {
        this.subAll();
        return this._base;
      }
    }, {
      key: "get",
      value: function get() {
        return this.all();
      }
    }, {
      key: "readonly",
      value: function readonly() {
        var _this6 = this;

        return new DepCell(function () {
          return _this6.all();
        });
      }
    }]);

    return ObsCell;
  }(ObsBase);

  var SrcCell = exports.SrcCell = function (_ObsCell) {
    _inherits(SrcCell, _ObsCell);

    function SrcCell() {
      _classCallCheck(this, SrcCell);

      return _possibleConstructorReturn(this, (SrcCell.__proto__ || Object.getPrototypeOf(SrcCell)).apply(this, arguments));
    }

    _createClass(SrcCell, [{
      key: "set",
      value: function set(x) {
        var _this8 = this;

        return recorder.mutating(function () {
          if (_this8._base !== x) {
            var old = _this8._base;
            _this8._base = x;
            _this8.onSet.pub([old, x]);
            return old;
          }
        });
      }
    }]);

    return SrcCell;
  }(ObsCell);

  var DepCell = exports.DepCell = function (_ObsCell2) {
    _inherits(DepCell, _ObsCell2);

    function DepCell(body, init) {
      _classCallCheck(this, DepCell);

      var _this9 = _possibleConstructorReturn(this, (DepCell.__proto__ || Object.getPrototypeOf(DepCell)).call(this, init != null ? init : null));

      _this9.body = body != null ? body : null;
      _this9.refreshing = false;
      _this9.nestedBinds = [];
      _this9.cleanups = [];
      _this9.upstreamEvents = new Set();
      return _this9;
    }

    _createClass(DepCell, [{
      key: "refresh",
      value: function refresh() {
        var _this10 = this;

        var publish = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;

        if (!this.refreshing) {
          var old = this._base;
          // TODO we are immediately disconnecting; something that disconnects upon
          // completion may have better semantics for asynchronous operations:
          //
          // - enabling lagBind to defer evaluation so long as its current
          //   dependencies keep changing
          // - allowing nested binds to continue reacting during asynchronous
          //   operation
          //
          // But the implementation is more complex as it requires being able to
          // create and discard tentative recordings.  It's also unclear whether
          // such a lagBind is more desirable (in the face of changing dependencies)
          // and whether on-completion is what's most generalizable.
          var realDone = function realDone(_base) {
            _this10._base = _base;
            _this10.onSet.pub([old, _this10._base]);
          };
          var recorded = false;
          var syncResult = null;
          var isSynchronous = false;
          var env = {
            // next two are for tolerating env.done calls from within env.record
            record: function record(f) {
              // TODO document why @refreshing exists
              // guards against recursively evaluating this recorded
              // function (@body or an async body) when calling `.get()`
              if (!_this10.refreshing) {
                var res = void 0;
                _this10.disconnect();
                if (recorded) {
                  throw new Error("this refresh has already recorded its dependencies");
                }
                _this10.refreshing = true;
                recorded = true;
                try {
                  res = recorder.record(_this10, function () {
                    return f.call(env);
                  });
                } finally {
                  _this10.refreshing = false;
                }
                if (isSynchronous) {
                  realDone(syncResult);
                }
                return res;
              }
            },
            done: function done(x) {
              if (old !== x) {
                if (_this10.refreshing) {
                  isSynchronous = true;
                  return syncResult = x;
                } else {
                  realDone(x);
                }
              }
            }
          };
          return this.body.call(env);
        }
      }
      // unsubscribe from all dependencies and recursively have all nested binds
      // disconnect themselves as well

    }, {
      key: "disconnect",
      value: function disconnect() {
        var _this11 = this;

        // TODO ordering of cleanup vs unsubscribes may require revisiting
        var _iteratorNormalCompletion4 = true;
        var _didIteratorError4 = false;
        var _iteratorError4 = undefined;

        try {
          for (var _iterator4 = this.cleanups[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
            var cleanup = _step4.value;

            cleanup();
          }
        } catch (err) {
          _didIteratorError4 = true;
          _iteratorError4 = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion4 && _iterator4.return) {
              _iterator4.return();
            }
          } finally {
            if (_didIteratorError4) {
              throw _iteratorError4;
            }
          }
        }

        var _iteratorNormalCompletion5 = true;
        var _didIteratorError5 = false;
        var _iteratorError5 = undefined;

        try {
          for (var _iterator5 = this.nestedBinds[Symbol.iterator](), _step5; !(_iteratorNormalCompletion5 = (_step5 = _iterator5.next()).done); _iteratorNormalCompletion5 = true) {
            var nestedBind = _step5.value;

            nestedBind.disconnect();
          }
        } catch (err) {
          _didIteratorError5 = true;
          _iteratorError5 = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion5 && _iterator5.return) {
              _iterator5.return();
            }
          } finally {
            if (_didIteratorError5) {
              throw _iteratorError5;
            }
          }
        }

        this.nestedBinds = [];
        this.cleanups = [];
        this.upstreamEvents.forEach(function (ev) {
          return ev.downstreamEvents.delete(_this11.onSet);
        });
        return this.upstreamEvents.clear();
      }
      // called by recorder

    }, {
      key: "addNestedBind",
      value: function addNestedBind(nestedBind) {
        return this.nestedBinds.push(nestedBind);
      }
      // called by recorder

    }, {
      key: "addCleanup",
      value: function addCleanup(cleanup) {
        return this.cleanups.push(cleanup);
      }
    }]);

    return DepCell;
  }(ObsCell);

  var ObsArray = exports.ObsArray = function (_ObsBase2) {
    _inherits(ObsArray, _ObsBase2);

    function ObsArray(_cells, diff) {
      _classCallCheck(this, ObsArray);

      if (_cells == null) {
        _cells = [];
      }
      if (diff == null) {
        diff = basicDiff();
      }

      var _this12 = _possibleConstructorReturn(this, (ObsArray.__proto__ || Object.getPrototypeOf(ObsArray)).call(this));

      _this12._cells = _cells;
      _this12.diff = diff;

      _this12.onChange = _this12._mkEv(function () {
        return [0, [], _this12._cells.map(function (c) {
          return c.raw();
        })];
      }, // ...[index, removed, added] (supports batching)
      _underscore2.default.identity);
      _this12.onChangeCells = _this12._mkEv(function () {
        return [0, [], _this12._cells];
      }, // ...[index, removed, added] (supports batching)
      _underscore2.default.identity);
      _this12._indexed = null;
      return _this12;
    }

    _createClass(ObsArray, [{
      key: "all",
      value: function all() {
        recorder.sub(this.onChange);
        return this._cells.map(function (c) {
          return c.get();
        });
      }
    }, {
      key: "raw",
      value: function raw() {
        return this._cells.map(function (c) {
          return c.raw();
        });
      }
    }, {
      key: "readonly",
      value: function readonly() {
        var _this13 = this;

        return new DepArray(function () {
          return _this13.all();
        });
      }
    }, {
      key: "rawCells",
      value: function rawCells() {
        return this._cells;
      }
    }, {
      key: "at",
      value: function at(i) {
        recorder.sub(this.onChange, function () {
          for (var _len5 = arguments.length, splices = Array(_len5), _key5 = 0; _key5 < _len5; _key5++) {
            splices[_key5] = arguments[_key5];
          }

          var _iteratorNormalCompletion6 = true;
          var _didIteratorError6 = false;
          var _iteratorError6 = undefined;

          try {
            for (var _iterator6 = splices[Symbol.iterator](), _step6; !(_iteratorNormalCompletion6 = (_step6 = _iterator6.next()).done); _iteratorNormalCompletion6 = true) {
              var _step6$value = _slicedToArray(_step6.value, 3),
                  index = _step6$value[0],
                  removed = _step6$value[1],
                  added = _step6$value[2];

              // if elements were inserted or removed prior to this element
              if (index <= i && removed.length !== added.length) return true;
              // if this element is one of the elements changed
              if (removed.length === added.length && i <= index + removed.length) return true;
            }
          } catch (err) {
            _didIteratorError6 = true;
            _iteratorError6 = err;
          } finally {
            try {
              if (!_iteratorNormalCompletion6 && _iterator6.return) {
                _iterator6.return();
              }
            } finally {
              if (_didIteratorError6) {
                throw _iteratorError6;
              }
            }
          }

          return false;
        });
        return this._cells[i] != null ? this._cells[i].get() : undefined;
      }
    }, {
      key: "length",
      value: function length() {
        recorder.sub(this.onChangeCells, function () {
          for (var _len6 = arguments.length, splices = Array(_len6), _key6 = 0; _key6 < _len6; _key6++) {
            splices[_key6] = arguments[_key6];
          }

          var diff = 0;
          /*eslint-disable*/
          var _iteratorNormalCompletion7 = true;
          var _didIteratorError7 = false;
          var _iteratorError7 = undefined;

          try {
            for (var _iterator7 = splices[Symbol.iterator](), _step7; !(_iteratorNormalCompletion7 = (_step7 = _iterator7.next()).done); _iteratorNormalCompletion7 = true) {
              var _step7$value = _slicedToArray(_step7.value, 3),
                  index = _step7$value[0],
                  removed = _step7$value[1],
                  added = _step7$value[2];

              /*eslint-enable*/
              diff += added - removed;
            }
          } catch (err) {
            _didIteratorError7 = true;
            _iteratorError7 = err;
          } finally {
            try {
              if (!_iteratorNormalCompletion7 && _iterator7.return) {
                _iterator7.return();
              }
            } finally {
              if (_didIteratorError7) {
                throw _iteratorError7;
              }
            }
          }

          return !diff;
        });
        return this._cells.length;
      }
    }, {
      key: "size",
      value: function size() {
        return this.length();
      }
    }, {
      key: "map",
      value: function map(f) {
        var ys = new MappedDepArray();
        autoSub(this.onChangeCells, function () {
          for (var _len7 = arguments.length, splices = Array(_len7), _key7 = 0; _key7 < _len7; _key7++) {
            splices[_key7] = arguments[_key7];
          }

          var _iteratorNormalCompletion8 = true;
          var _didIteratorError8 = false;
          var _iteratorError8 = undefined;

          try {
            for (var _iterator8 = splices[Symbol.iterator](), _step8; !(_iteratorNormalCompletion8 = (_step8 = _iterator8.next()).done); _iteratorNormalCompletion8 = true) {
              var _step8$value = _slicedToArray(_step8.value, 3),
                  index = _step8$value[0],
                  removed = _step8$value[1],
                  added = _step8$value[2];

              var _iteratorNormalCompletion9 = true;
              var _didIteratorError9 = false;
              var _iteratorError9 = undefined;

              try {
                for (var _iterator9 = ys._cells.slice(index, index + removed.length)[Symbol.iterator](), _step9; !(_iteratorNormalCompletion9 = (_step9 = _iterator9.next()).done); _iteratorNormalCompletion9 = true) {
                  var cell = _step9.value;

                  cell.disconnect();
                }
              } catch (err) {
                _didIteratorError9 = true;
                _iteratorError9 = err;
              } finally {
                try {
                  if (!_iteratorNormalCompletion9 && _iterator9.return) {
                    _iterator9.return();
                  }
                } finally {
                  if (_didIteratorError9) {
                    throw _iteratorError9;
                  }
                }
              }

              var newCells = added.map(function (item) {
                return bind(function () {
                  return f(item.get());
                });
              });
              ys.realSpliceCells(index, removed.length, newCells);
            }
          } catch (err) {
            _didIteratorError8 = true;
            _iteratorError8 = err;
          } finally {
            try {
              if (!_iteratorNormalCompletion8 && _iterator8.return) {
                _iterator8.return();
              }
            } finally {
              if (_didIteratorError8) {
                throw _iteratorError8;
              }
            }
          }
        });
        return ys;
      }
    }, {
      key: "transform",
      value: function transform(f, diff) {
        var _this14 = this;

        return new DepArray(function () {
          return f(_this14.all());
        }, diff);
      }
    }, {
      key: "filter",
      value: function filter(f) {
        return this.transform(function (arr) {
          return arr.filter(f);
        });
      }
    }, {
      key: "slice",
      value: function slice(x, y) {
        return this.transform(function (arr) {
          return arr.slice(x, y);
        });
      }
    }, {
      key: "reduce",
      value: function reduce(f, init) {
        return this.all().reduce(f, init != null ? init : this.at(0));
      }
    }, {
      key: "reduceRight",
      value: function reduceRight(f, init) {
        return this.all().reduceRight(f, init != null ? init : this.at(0));
      }
    }, {
      key: "every",
      value: function every(f) {
        return this.all().every(f);
      }
    }, {
      key: "some",
      value: function some(f) {
        return this.all().some(f);
      }
    }, {
      key: "indexOf",
      value: function indexOf(val, from) {
        if (from == null) {
          from = 0;
        }return this.all().indexOf(val, from);
      }
    }, {
      key: "lastIndexOf",
      value: function lastIndexOf(val, from) {
        if (from == null) {
          from = this.length() - 1;
        }
        return this.all().lastIndexOf(val, from);
      }
    }, {
      key: "join",
      value: function join(separator) {
        if (separator == null) {
          separator = ",";
        }return this.all().join(separator);
      }
    }, {
      key: "first",
      value: function first() {
        return this.at(0);
      }
    }, {
      key: "last",
      value: function last() {
        return this.at(this.length() - 1);
      }
    }, {
      key: "indexed",
      value: function indexed() {
        var _this15 = this;

        if (this._indexed == null) {
          this._indexed = new IndexedDepArray();
          autoSub(this.onChangeCells, function () {
            for (var _len8 = arguments.length, splices = Array(_len8), _key8 = 0; _key8 < _len8; _key8++) {
              splices[_key8] = arguments[_key8];
            }

            var _iteratorNormalCompletion10 = true;
            var _didIteratorError10 = false;
            var _iteratorError10 = undefined;

            try {
              for (var _iterator10 = splices[Symbol.iterator](), _step10; !(_iteratorNormalCompletion10 = (_step10 = _iterator10.next()).done); _iteratorNormalCompletion10 = true) {
                var _step10$value = _slicedToArray(_step10.value, 3),
                    index = _step10$value[0],
                    removed = _step10$value[1],
                    added = _step10$value[2];

                _this15._indexed.realSpliceCells(index, removed.length, added);
              }
            } catch (err) {
              _didIteratorError10 = true;
              _iteratorError10 = err;
            } finally {
              try {
                if (!_iteratorNormalCompletion10 && _iterator10.return) {
                  _iterator10.return();
                }
              } finally {
                if (_didIteratorError10) {
                  throw _iteratorError10;
                }
              }
            }
          });
        }
        return this._indexed;
      }
    }, {
      key: "concat",
      value: function concat() {
        for (var _len9 = arguments.length, those = Array(_len9), _key9 = 0; _key9 < _len9; _key9++) {
          those[_key9] = arguments[_key9];
        }

        return _concat.apply(undefined, [this].concat(those));
      }
    }, {
      key: "realSpliceCells",
      value: function realSpliceCells(index, count, additions) {
        var _this16 = this;

        var removed = this._cells.splice.apply(this._cells, [index, count].concat(additions));
        var removedElems = snap(function () {
          return removed.map(function (x2) {
            return x2.get();
          });
        });
        var addedElems = snap(function () {
          return additions.map(function (x3) {
            return x3.get();
          });
        });
        return optTransact(function () {
          _this16.onChangeCells.pub([index, removed, additions]);
          return _this16.onChange.pub([index, removedElems, addedElems]);
        });
      }
    }, {
      key: "realSplice",
      value: function realSplice(index, count, additions) {
        return this.realSpliceCells(index, count, additions.map(_cell3));
      }
    }, {
      key: "_update",
      value: function _update(val, diff) {
        var _this17 = this;

        var left = void 0,
            splices = void 0;
        var old = snap(function () {
          return _this17._cells.map(function (x) {
            return x.get();
          });
        });
        var fullSplice = [0, old.length, val];
        if (diff == null) {
          diff = this.diff;
        }
        left = permToSplices(old.length, val, diff(old, val));
        splices = left != null ? left : [fullSplice];
        return splices.map(function (_ref) {
          var _ref2 = _slicedToArray(_ref, 3),
              index = _ref2[0],
              count = _ref2[1],
              additions = _ref2[2];

          return _this17.realSplice(index, count, additions);
        });
      }
    }]);

    return ObsArray;
  }(ObsBase);

  var SrcArray = exports.SrcArray = function (_ObsArray) {
    _inherits(SrcArray, _ObsArray);

    function SrcArray() {
      _classCallCheck(this, SrcArray);

      return _possibleConstructorReturn(this, (SrcArray.__proto__ || Object.getPrototypeOf(SrcArray)).apply(this, arguments));
    }

    _createClass(SrcArray, [{
      key: "spliceArray",
      value: function spliceArray(index, count, additions) {
        var _this19 = this;

        return recorder.mutating(function () {
          return _this19.realSplice(index, count, additions);
        });
      }
    }, {
      key: "splice",
      value: function splice(index, count) {
        for (var _len10 = arguments.length, additions = Array(_len10 > 2 ? _len10 - 2 : 0), _key10 = 2; _key10 < _len10; _key10++) {
          additions[_key10 - 2] = arguments[_key10];
        }

        return this.spliceArray(index, count, additions);
      }
    }, {
      key: "insert",
      value: function insert(x, index) {
        return this.splice(index, 0, x);
      }
    }, {
      key: "remove",
      value: function remove(x) {
        var i = (0, _underscore2.default)(this.raw()).indexOf(x);
        if (i >= 0) {
          return this.removeAt(i);
        }
      }
    }, {
      key: "removeAll",
      value: function removeAll(x) {
        var _this20 = this;

        return optTransact(function () {
          var i = (0, _underscore2.default)(snap(function () {
            return _this20.all();
          })).indexOf(x);
          while (i >= 0) {
            _this20.removeAt(i);
            i = snap(function () {
              return (0, _underscore2.default)(_this20.all().slice(i));
            }).indexOf(x);
          }
        });
      }
    }, {
      key: "removeAt",
      value: function removeAt(index) {
        var _this21 = this;

        var val = snap(function () {
          return _this21.at(index);
        });
        this.splice(index, 1);
        return val;
      }
    }, {
      key: "push",
      value: function push(x) {
        var _this22 = this;

        return this.splice(snap(function () {
          return _this22.length();
        }), 0, x);
      }
    }, {
      key: "pop",
      value: function pop() {
        var _this23 = this;

        return this.removeAt(snap(function () {
          return _this23.length() - 1;
        }));
      }
    }, {
      key: "put",
      value: function put(i, x) {
        return this.splice(i, 1, x);
      }
    }, {
      key: "replace",
      value: function replace(xs) {
        var _this24 = this;

        return this.spliceArray(0, snap(function () {
          return _this24.length();
        }), xs);
      }
    }, {
      key: "unshift",
      value: function unshift(x) {
        return this.insert(x, 0);
      }
    }, {
      key: "shift",
      value: function shift() {
        return this.removeAt(0);
      }
      // TODO: How is this different from replace? we should use one or the other.

    }, {
      key: "update",
      value: function update(xs) {
        var _this25 = this;

        return recorder.mutating(function () {
          return _this25._update(xs);
        });
      }
    }, {
      key: "move",
      value: function move(src, dest) {
        var _this26 = this;

        return optTransact(function () {
          // moves element at src to index before dest
          if (src === dest) {
            return;
          }

          var len = snap(function () {
            return _this26.length();
          });

          if (src < 0 || src > len - 1) {
            throw "Source " + src + " is outside of bounds of array of length " + len;
          }
          if (dest < 0 || dest > len) {
            throw "Destination " + dest + " is outside of bounds of array of length " + len;
          }

          var val = snap(function () {
            return _this26.all()[src];
          });

          if (src > dest) {
            _this26.removeAt(src);
            _this26.insert(val, dest);
          } else {
            _this26.insert(val, dest);
            _this26.removeAt(src);
          }
        });
      } // removeAt returns, but insert doesn't, so let's avoid inconsistency

    }, {
      key: "swap",
      value: function swap(i1, i2) {
        var _this27 = this;

        return optTransact(function () {
          var len = snap(function () {
            return _this27.length();
          });
          if (i1 < 0 || i1 > len - 1) {
            throw "i1 " + i1 + " is outside of bounds of array of length " + len;
          }
          if (i2 < 0 || i2 > len - 1) {
            throw "i2 " + i2 + " is outside of bounds of array of length " + len;
          }

          var first = Math.min(i1, i2);
          var second = Math.max(i1, i2);

          _this27.move(first, second);
          return _this27.move(second, first);
        });
      }
    }, {
      key: "reverse",
      value: function reverse() {
        var _this28 = this;

        // Javascript's Array.reverse both reverses the Array and returns its new value
        this.update(snap(function () {
          return _this28.all().reverse();
        }));
        return snap(function () {
          return _this28.all();
        });
      }
    }]);

    return SrcArray;
  }(ObsArray);

  var MappedDepArray = exports.MappedDepArray = function (_ObsArray2) {
    _inherits(MappedDepArray, _ObsArray2);

    function MappedDepArray() {
      _classCallCheck(this, MappedDepArray);

      return _possibleConstructorReturn(this, (MappedDepArray.__proto__ || Object.getPrototypeOf(MappedDepArray)).call(this));
    }

    return MappedDepArray;
  }(ObsArray);

  var IndexedDepArray = exports.IndexedDepArray = function (_ObsArray3) {
    _inherits(IndexedDepArray, _ObsArray3);

    function IndexedDepArray(xs, diff) {
      _classCallCheck(this, IndexedDepArray);

      if (xs == null) {
        xs = [];
      }

      var _this30 = _possibleConstructorReturn(this, (IndexedDepArray.__proto__ || Object.getPrototypeOf(IndexedDepArray)).call(this, xs, diff));

      _this30.is = _this30._cells.map(function (x, i) {
        return _cell3(i);
      });
      _this30.onChangeCells = _this30._mkEv(function () {
        return [0, [], _underscore2.default.zip(_this30._cells, _this30.is)];
      }, _underscore2.default.identity); // [index, removed, added]
      _this30.onChange = _this30._mkEv(function () {
        return [0, [], _underscore2.default.zip(_this30.is, snap(function () {
          return _this30.all();
        }))];
      }, _underscore2.default.identity);
      return _this30;
    }
    // TODO duplicate code with ObsArray


    _createClass(IndexedDepArray, [{
      key: "map",
      value: function map(f) {
        var ys = new MappedDepArray();
        autoSub(this.onChangeCells, function () {
          for (var _len11 = arguments.length, splices = Array(_len11), _key11 = 0; _key11 < _len11; _key11++) {
            splices[_key11] = arguments[_key11];
          }

          var _iteratorNormalCompletion11 = true;
          var _didIteratorError11 = false;
          var _iteratorError11 = undefined;

          try {
            for (var _iterator11 = splices[Symbol.iterator](), _step11; !(_iteratorNormalCompletion11 = (_step11 = _iterator11.next()).done); _iteratorNormalCompletion11 = true) {
              var _step11$value = _slicedToArray(_step11.value, 3),
                  index = _step11$value[0],
                  removed = _step11$value[1],
                  added = _step11$value[2];

              var _iteratorNormalCompletion12 = true;
              var _didIteratorError12 = false;
              var _iteratorError12 = undefined;

              try {
                for (var _iterator12 = ys._cells.slice(index, index + removed.length)[Symbol.iterator](), _step12; !(_iteratorNormalCompletion12 = (_step12 = _iterator12.next()).done); _iteratorNormalCompletion12 = true) {
                  var _cell = _step12.value;

                  _cell.disconnect();
                }
              } catch (err) {
                _didIteratorError12 = true;
                _iteratorError12 = err;
              } finally {
                try {
                  if (!_iteratorNormalCompletion12 && _iterator12.return) {
                    _iterator12.return();
                  }
                } finally {
                  if (_didIteratorError12) {
                    throw _iteratorError12;
                  }
                }
              }

              var newCells = added.map(function (_ref3) {
                var _ref4 = _slicedToArray(_ref3, 2),
                    item = _ref4[0],
                    icell = _ref4[1];

                return bind(function () {
                  return f(item.get(), icell);
                });
              });
              ys.realSpliceCells(index, removed.length, newCells);
            }
          } catch (err) {
            _didIteratorError11 = true;
            _iteratorError11 = err;
          } finally {
            try {
              if (!_iteratorNormalCompletion11 && _iterator11.return) {
                _iterator11.return();
              }
            } finally {
              if (_didIteratorError11) {
                throw _iteratorError11;
              }
            }
          }
        });
        return ys;
      }
    }, {
      key: "realSpliceCells",
      value: function realSpliceCells(index, count, additions) {
        var _is,
            _this31 = this;

        var i = void 0;
        var removed = this._cells.splice.apply(this._cells, [index, count].concat(additions));
        var removedElems = snap(function () {
          return removed.map(function (x2) {
            return x2.get();
          });
        });

        var iterable = this.is.slice(index + count);
        for (var offset = 0; offset < iterable.length; offset++) {
          i = iterable[offset];
          i.set(index + additions.length + offset);
        }
        var newIs = [];
        var end = additions.length;
        var asc = 0 <= end;
        for (i = 0; asc ? i < end : i > end; asc ? i++ : i--) {
          newIs.push(_cell3(index + i));
        }
        (_is = this.is).splice.apply(_is, [index, count].concat(newIs));

        var addedElems = snap(function () {
          return additions.map(function (x3) {
            return x3.get();
          });
        });
        return optTransact(function () {
          _this31.onChangeCells.pub([index, removed, _underscore2.default.zip(additions, newIs)]);
          return _this31.onChange.pub([index, removedElems, _underscore2.default.zip(addedElems, newIs)]);
        });
      }
    }]);

    return IndexedDepArray;
  }(ObsArray);

  var DepArray = exports.DepArray = function (_ObsArray4) {
    _inherits(DepArray, _ObsArray4);

    function DepArray(f, diff) {
      _classCallCheck(this, DepArray);

      var _this32 = _possibleConstructorReturn(this, (DepArray.__proto__ || Object.getPrototypeOf(DepArray)).call(this, [], diff));

      _this32.f = f;
      _this32.c = bind(_this32.f);
      _this32.c.internal = true;
      _this32.c.onSet.downstreamEvents.add(_this32.onChangeCells);
      _this32.c.onSet.downstreamEvents.add(_this32.onChange);
      autoSub(_this32.c.onSet, function (_ref5) {
        var _ref6 = _slicedToArray(_ref5, 2),
            old = _ref6[0],
            val = _ref6[1];

        return _this32._update(val);
      });
      return _this32;
    }

    return DepArray;
  }(ObsArray);

  var IndexedArray = exports.IndexedArray = function (_DepArray) {
    _inherits(IndexedArray, _DepArray);

    function IndexedArray(_cells) {
      _classCallCheck(this, IndexedArray);

      var _this33 = _possibleConstructorReturn(this, (IndexedArray.__proto__ || Object.getPrototypeOf(IndexedArray)).call(this));

      _this33._cells = _cells;
      return _this33;
    }

    _createClass(IndexedArray, [{
      key: "map",
      value: function map(f) {
        var ys = new MappedDepArray();
        autoSub(this._cells.onChange, function () {
          for (var _len12 = arguments.length, splices = Array(_len12), _key12 = 0; _key12 < _len12; _key12++) {
            splices[_key12] = arguments[_key12];
          }

          var _iteratorNormalCompletion13 = true;
          var _didIteratorError13 = false;
          var _iteratorError13 = undefined;

          try {
            for (var _iterator13 = splices[Symbol.iterator](), _step13; !(_iteratorNormalCompletion13 = (_step13 = _iterator13.next()).done); _iteratorNormalCompletion13 = true) {
              var _step13$value = _slicedToArray(_step13.value, 3),
                  index = _step13$value[0],
                  removed = _step13$value[1],
                  added = _step13$value[2];

              ys.realSplice(index, removed.length, added.map(f));
            }
          } catch (err) {
            _didIteratorError13 = true;
            _iteratorError13 = err;
          } finally {
            try {
              if (!_iteratorNormalCompletion13 && _iterator13.return) {
                _iterator13.return();
              }
            } finally {
              if (_didIteratorError13) {
                throw _iteratorError13;
              }
            }
          }
        });
        return ys;
      }
    }]);

    return IndexedArray;
  }(DepArray);

  var _concat = function _concat() {
    var ys = new MappedDepArray();

    for (var _len13 = arguments.length, xss = Array(_len13), _key13 = 0; _key13 < _len13; _key13++) {
      xss[_key13] = arguments[_key13];
    }

    var casted = xss.map(function (xs) {
      return cast(xs, "array");
    });
    var repLens = xss.map(function () {
      return 0;
    });

    casted.forEach(function (xs, i) {
      return autoSub(xs.onChange, function () {
        for (var _len14 = arguments.length, splices = Array(_len14), _key14 = 0; _key14 < _len14; _key14++) {
          splices[_key14] = arguments[_key14];
        }

        var _iteratorNormalCompletion14 = true;
        var _didIteratorError14 = false;
        var _iteratorError14 = undefined;

        try {
          for (var _iterator14 = splices[Symbol.iterator](), _step14; !(_iteratorNormalCompletion14 = (_step14 = _iterator14.next()).done); _iteratorNormalCompletion14 = true) {
            var _step14$value = _slicedToArray(_step14.value, 3),
                index = _step14$value[0],
                removed = _step14$value[1],
                added = _step14$value[2];

            var xsOffset = sum(repLens.slice(0, i));
            repLens[i] += added.length - removed.length;
            ys.realSplice(xsOffset + index, removed.length, added);
          }
        } catch (err) {
          _didIteratorError14 = true;
          _iteratorError14 = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion14 && _iterator14.return) {
              _iterator14.return();
            }
          } finally {
            if (_didIteratorError14) {
              throw _iteratorError14;
            }
          }
        }
      });
    });
    return ys;
  };

  exports.concat = _concat;
  var objToJSMap = function objToJSMap(obj) {
    if (obj instanceof Map) {
      return obj;
    } else if (_underscore2.default.isArray(obj)) {
      return new Map(obj);
    } else {
      return new Map(_underscore2.default.pairs(obj));
    }
  };

  var ObsMap = exports.ObsMap = function (_ObsBase3) {
    _inherits(ObsMap, _ObsBase3);

    function ObsMap(_base) {
      _classCallCheck(this, ObsMap);

      if (_base == null) {
        _base = new Map();
      }

      var _this34 = _possibleConstructorReturn(this, (ObsMap.__proto__ || Object.getPrototypeOf(ObsMap)).call(this));

      _this34._base = objToJSMap(_base);
      _this34.onAdd = _this34._mkEv(function () {
        return new Map(_this34._base);
      }); // {key: new...}
      _this34.onRemove = _this34._mkEv(function () {
        return new Map();
      }); // {key: old...}
      _this34.onChange = _this34._mkEv(function () {
        return new Map();
      }); // {key: [old, new]...}
      return _this34;
    }

    _createClass(ObsMap, [{
      key: "get",
      value: function get(key) {
        this.subAll(function (result) {
          return result.has(key);
        });
        return this._base.get(key);
      }
    }, {
      key: "has",
      value: function has(key) {
        recorder.sub(this.onAdd, function (additions) {
          return additions.has(key);
        });
        recorder.sub(this.onRemove, function (removals) {
          return removals.has(key);
        });
        return this._base.has(key);
      }
    }, {
      key: "all",
      value: function all() {
        this.subAll();
        return new Map(this._base);
      }
    }, {
      key: "readonly",
      value: function readonly() {
        var _this35 = this;

        return new DepMap(function () {
          return _this35.all();
        });
      }
    }, {
      key: "size",
      value: function size() {
        recorder.sub(this.onRemove);
        recorder.sub(this.onAdd);
        return this._base.size;
      }
    }, {
      key: "realPut",
      value: function realPut(key, val) {
        if (this._base.has(key)) {
          var old = this._base.get(key);
          if (old !== val) {
            this._base.set(key, val);
            this.onChange.pub(new Map([[key, [old, val]]]));
          }
          return old;
        } else {
          this._base.set(key, val);
          this.onAdd.pub(new Map([[key, val]]));
          return undefined;
        }
      }
    }, {
      key: "realRemove",
      value: function realRemove(key) {
        var val = mapDel(this._base, key);
        this.onRemove.pub(new Map([[key, val]]));
        return val;
      }
    }, {
      key: "_update",
      value: function _update(other) {
        var _this36 = this;

        var val = void 0;
        var otherMap = objToJSMap(other);
        var ret = new Map(this._base);
        var removals = _underscore2.default.chain(Array.from(this._base.keys())).difference(Array.from(otherMap.keys())).map(function (k) {
          return [k, mapDel(_this36._base, k)];
        }).value();

        var additions = _underscore2.default.chain(Array.from(otherMap.keys())).difference(Array.from(this._base.keys())).map(function (k) {
          val = otherMap.get(k);
          _this36._base.set(k, val);
          return [k, val];
        }).value();

        var changes = _underscore2.default.chain(Array.from(otherMap)).filter(function (_ref7) {
          var _ref8 = _slicedToArray(_ref7, 2),
              k = _ref8[0],
              val = _ref8[1];

          return _this36._base.has(k) && _this36._base.get(k) !== val;
        }).map(function (_ref9) {
          var _ref10 = _slicedToArray(_ref9, 2),
              k = _ref10[0],
              val = _ref10[1];

          var old = _this36._base.get(k);
          _this36._base.set(k, val);
          return [k, [old, val]];
        }).value();

        optTransact(function () {
          if (removals.length) {
            _this36.onRemove.pub(new Map(removals));
          }
          if (additions.length) {
            _this36.onAdd.pub(new Map(additions));
          }
          if (changes.length) {
            return _this36.onChange.pub(new Map(changes));
          }
        });

        return ret;
      }
    }]);

    return ObsMap;
  }(ObsBase);

  var SrcMap = exports.SrcMap = function (_ObsMap) {
    _inherits(SrcMap, _ObsMap);

    function SrcMap() {
      _classCallCheck(this, SrcMap);

      return _possibleConstructorReturn(this, (SrcMap.__proto__ || Object.getPrototypeOf(SrcMap)).apply(this, arguments));
    }

    _createClass(SrcMap, [{
      key: "put",
      value: function put(key, val) {
        var _this38 = this;

        return recorder.mutating(function () {
          return _this38.realPut(key, val);
        });
      }
    }, {
      key: "set",
      value: function set(key, val) {
        return this.put(key, val);
      }
    }, {
      key: "delete",
      value: function _delete(key) {
        var _this39 = this;

        return recorder.mutating(function () {
          var val = undefined;
          if (_this39._base.has(key)) {
            val = _this39.realRemove(key);
            _this39.onRemove.pub(new Map([[key, val]]));
          }
          return val;
        });
      }
    }, {
      key: "remove",
      value: function remove(key) {
        return this.delete(key);
      }
    }, {
      key: "clear",
      value: function clear() {
        var _this40 = this;

        return recorder.mutating(function () {
          var removals = new Map(_this40._base);
          _this40._base.clear();
          if (removals.size) {
            _this40.onRemove.pub(removals);
          }
          return removals;
        });
      }
    }, {
      key: "update",
      value: function update(x) {
        var _this41 = this;

        return recorder.mutating(function () {
          return _this41._update(x);
        });
      }
    }]);

    return SrcMap;
  }(ObsMap);

  var DepMap = exports.DepMap = function (_ObsMap2) {
    _inherits(DepMap, _ObsMap2);

    function DepMap(f) {
      _classCallCheck(this, DepMap);

      var _this42 = _possibleConstructorReturn(this, (DepMap.__proto__ || Object.getPrototypeOf(DepMap)).call(this));

      _this42.f = f;
      _this42.c = bind(_this42.f);
      _this42.c.internal = true;
      _this42.c.onSet.downstreamEvents.add(_this42.onAdd);
      _this42.c.onSet.downstreamEvents.add(_this42.onChange);
      _this42.c.onSet.downstreamEvents.add(_this42.onRemove);
      autoSub(_this42.c.onSet, function (_ref11) {
        var _ref12 = _slicedToArray(_ref11, 2),
            old = _ref12[0],
            val = _ref12[1];

        return _this42._update(val);
      });
      return _this42;
    }

    return DepMap;
  }(ObsMap);

  //
  // Converting POJO attributes to reactive ones.
  //

  var objToJSSet = function objToJSSet(obj) {
    if (obj instanceof Set) {
      return obj;
    } else {
      return new Set(obj);
    }
  };
  var _castOther = function _castOther(other) {
    if (other instanceof Set) {
      return other;
    } else if (other instanceof ObsSet) {
      return other.all();
    }

    if (other instanceof ObsArray) {
      other = other.all();
    }
    if (other instanceof ObsCell) {
      other = other.get();
    }
    return new Set(other);
  };

  var ObsSet = exports.ObsSet = function (_ObsBase4) {
    _inherits(ObsSet, _ObsBase4);

    function ObsSet(_base) {
      _classCallCheck(this, ObsSet);

      if (_base == null) {
        _base = new Set();
      }

      var _this43 = _possibleConstructorReturn(this, (ObsSet.__proto__ || Object.getPrototypeOf(ObsSet)).call(this));

      _this43._base = objToJSSet(_base);
      _this43.onChange = _this43._mkEv(function () {
        return [_this43._base, new Set()];
      }, // additions, removals
      function (changeSets) {
        var additions = new Set();
        var removals = new Set();
        var _iteratorNormalCompletion15 = true;
        var _didIteratorError15 = false;
        var _iteratorError15 = undefined;

        try {
          for (var _iterator15 = changeSets[Symbol.iterator](), _step15; !(_iteratorNormalCompletion15 = (_step15 = _iterator15.next()).done); _iteratorNormalCompletion15 = true) {
            var _step15$value = _slicedToArray(_step15.value, 2),
                curAdds = _step15$value[0],
                curRems = _step15$value[1];

            var _iteratorNormalCompletion16 = true;
            var _didIteratorError16 = false;
            var _iteratorError16 = undefined;

            try {
              for (var _iterator16 = curAdds[Symbol.iterator](), _step16; !(_iteratorNormalCompletion16 = (_step16 = _iterator16.next()).done); _iteratorNormalCompletion16 = true) {
                var cur = _step16.value;

                if (removals.has(cur)) {
                  removals.delete(cur);
                }
                additions.add(cur);
              }
            } catch (err) {
              _didIteratorError16 = true;
              _iteratorError16 = err;
            } finally {
              try {
                if (!_iteratorNormalCompletion16 && _iterator16.return) {
                  _iterator16.return();
                }
              } finally {
                if (_didIteratorError16) {
                  throw _iteratorError16;
                }
              }
            }

            var _iteratorNormalCompletion17 = true;
            var _didIteratorError17 = false;
            var _iteratorError17 = undefined;

            try {
              for (var _iterator17 = curRems[Symbol.iterator](), _step17; !(_iteratorNormalCompletion17 = (_step17 = _iterator17.next()).done); _iteratorNormalCompletion17 = true) {
                var _cur = _step17.value;

                if (additions.has(_cur)) {
                  additions.delete(_cur);
                }
                removals.add(_cur);
              }
            } catch (err) {
              _didIteratorError17 = true;
              _iteratorError17 = err;
            } finally {
              try {
                if (!_iteratorNormalCompletion17 && _iterator17.return) {
                  _iterator17.return();
                }
              } finally {
                if (_didIteratorError17) {
                  throw _iteratorError17;
                }
              }
            }
          }
        } catch (err) {
          _didIteratorError15 = true;
          _iteratorError15 = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion15 && _iterator15.return) {
              _iterator15.return();
            }
          } finally {
            if (_didIteratorError15) {
              throw _iteratorError15;
            }
          }
        }

        return [[additions, removals]];
      });
      return _this43;
    }

    _createClass(ObsSet, [{
      key: "has",
      value: function has(key) {
        this.subAll(function (_ref13) {
          var _ref14 = _slicedToArray(_ref13, 2),
              additions = _ref14[0],
              removals = _ref14[1];

          return additions.has(key) || removals.has(key);
        });
        return this._base.has(key);
      }
    }, {
      key: "all",
      value: function all() {
        this.subAll();
        return new Set(this._base);
      }
    }, {
      key: "readonly",
      value: function readonly() {
        var _this44 = this;

        return new DepSet(function () {
          return _this44.all();
        });
      }
    }, {
      key: "values",
      value: function values() {
        return this.all();
      }
    }, {
      key: "entries",
      value: function entries() {
        return this.all();
      }
    }, {
      key: "size",
      value: function size() {
        this.subAll(function (_ref15) {
          var _ref16 = _slicedToArray(_ref15, 2),
              additions = _ref16[0],
              removals = _ref16[1];

          return additions.size !== removals.size;
        });
        return this._base.size;
      }
    }, {
      key: "union",
      value: function union(other) {
        var _this45 = this;

        return new DepSet(function () {
          return _union(_this45.all(), _castOther(other));
        });
      }
    }, {
      key: "intersection",
      value: function intersection(other) {
        var _this46 = this;

        return new DepSet(function () {
          return _intersection(_this46.all(), _castOther(other));
        });
      }
    }, {
      key: "difference",
      value: function difference(other) {
        var _this47 = this;

        return new DepSet(function () {
          return _difference(_this47.all(), _castOther(other));
        });
      }
    }, {
      key: "symmetricDifference",
      value: function symmetricDifference(other) {
        var _this48 = this;

        return new DepSet(function () {
          return _difference(_this48.union(other).all(), _this48.intersection(other).all());
        });
      }
    }, {
      key: "_update",
      value: function _update(y) {
        var _this49 = this;

        return optTransact(function () {
          var old_ = new Set(_this49._base);
          var new_ = objToJSSet(y);

          var additions = new Set();
          var removals = new Set();

          // JS sets don't come with subtraction :(
          old_.forEach(function (item) {
            if (!new_.has(item)) {
              return removals.add(item);
            }
          });
          new_.forEach(function (item) {
            if (!old_.has(item)) {
              return additions.add(item);
            }
          });

          old_.forEach(function (item) {
            return _this49._base.delete(item);
          });
          new_.forEach(function (item) {
            return _this49._base.add(item);
          });

          _this49.onChange.pub([additions, removals]);
          return old_;
        });
      }
    }]);

    return ObsSet;
  }(ObsBase);

  var SrcSet = exports.SrcSet = function (_ObsSet) {
    _inherits(SrcSet, _ObsSet);

    function SrcSet() {
      _classCallCheck(this, SrcSet);

      return _possibleConstructorReturn(this, (SrcSet.__proto__ || Object.getPrototypeOf(SrcSet)).apply(this, arguments));
    }

    _createClass(SrcSet, [{
      key: "add",
      value: function add(item) {
        var _this51 = this;

        return recorder.mutating(function () {
          if (!_this51._base.has(item)) {
            _this51._base.add(item);
            _this51.onChange.pub([new Set([item]), new Set()]);
          }
          return item;
        });
      }
    }, {
      key: "put",
      value: function put(item) {
        return this.add(item);
      }
    }, {
      key: "delete",
      value: function _delete(item) {
        var _this52 = this;

        return recorder.mutating(function () {
          if (_this52._base.has(item)) {
            _this52._base.delete(item);
            _this52.onChange.pub([new Set(), new Set([item])]);
          }
          return item;
        });
      }
    }, {
      key: "remove",
      value: function remove(item) {
        return this.delete(item);
      }
    }, {
      key: "clear",
      value: function clear() {
        var _this53 = this;

        return recorder.mutating(function () {
          var removals = new Set(_this53._base);
          if (_this53._base.size) {
            _this53._base.clear();
            _this53.onChange.pub([new Set(), removals]);
          }
          return removals;
        });
      }
    }, {
      key: "update",
      value: function update(y) {
        var _this54 = this;

        return recorder.mutating(function () {
          return _this54._update(y);
        });
      }
    }]);

    return SrcSet;
  }(ObsSet);

  var DepSet = exports.DepSet = function (_ObsSet2) {
    _inherits(DepSet, _ObsSet2);

    function DepSet(f) {
      _classCallCheck(this, DepSet);

      var _this55 = _possibleConstructorReturn(this, (DepSet.__proto__ || Object.getPrototypeOf(DepSet)).call(this));

      _this55.f = f;
      _this55.c = bind(_this55.f);
      _this55.c.internal = true;
      _this55.c.onSet.downstreamEvents.add(_this55.onChange);
      autoSub(_this55.c.onSet, function (_ref17) {
        var _ref18 = _slicedToArray(_ref17, 2),
            old = _ref18[0],
            val = _ref18[1];

        return _this55._update(val);
      });
      return _this55;
    }

    return DepSet;
  }(ObsSet);

  var liftSpec = exports.liftSpec = function liftSpec(obj) {
    var result = [];
    var val = void 0,
        type = void 0;
    var _iteratorNormalCompletion18 = true;
    var _didIteratorError18 = false;
    var _iteratorError18 = undefined;

    try {
      for (var _iterator18 = Object.getOwnPropertyNames(obj)[Symbol.iterator](), _step18; !(_iteratorNormalCompletion18 = (_step18 = _iterator18.next()).done); _iteratorNormalCompletion18 = true) {
        var name = _step18.value;

        val = obj[name];
        if (val != null && [ObsMap, ObsCell, ObsArray, ObsSet].some(function (cls) {
          return val instanceof cls;
        })) {
          continue;
        } else if (_underscore2.default.isFunction(val)) {
          type = null;
        } else if (_underscore2.default.isArray(val)) {
          type = "array";
        } else if (val instanceof Set) {
          type = "set";
        } else if (val instanceof Map) {
          type = "map";
        } else {
          type = "cell";
        }
        result.push([name, { type: type, val: val }]);
      }
    } catch (err) {
      _didIteratorError18 = true;
      _iteratorError18 = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion18 && _iterator18.return) {
          _iterator18.return();
        }
      } finally {
        if (_didIteratorError18) {
          throw _iteratorError18;
        }
      }
    }

    return _underscore2.default.object(result);
  };

  var lift = exports.lift = function lift(x, fieldspec) {
    if (fieldspec == null) {
      fieldspec = liftSpec(x);
    }

    return _underscore2.default.mapObject(fieldspec, function (_ref19, name) {
      var type = _ref19.type;

      if (!(x[name] instanceof ObsBase) && type in types) {
        return rxTypes[type](x[name]);
      }
      return x[name];
    });
  };

  var unlift = exports.unlift = function unlift(x) {
    return _underscore2.default.mapObject(x, function (v) {
      if (v instanceof ObsBase) {
        return v.all();
      } else {
        return v;
      }
    });
  };

  //
  // Implicitly reactive objects
  //
  var reactify = exports.reactify = function reactify(obj, fieldspec) {
    var spec = void 0;
    if (_underscore2.default.isArray(obj)) {
      var arr = _array(_underscore2.default.clone(obj));
      Object.defineProperties(obj, _underscore2.default.object(Object.getOwnPropertyNames(SrcArray.prototype).concat(Object.getOwnPropertyNames(ObsArray.prototype)).concat(Object.getOwnPropertyNames(ObsBase.prototype)).filter(function (methName) {
        return methName !== "length";
      }).map(function (methName) {
        var meth = obj[methName];
        var newMeth = function newMeth() {
          var _arr$methName;

          var res = void 0;

          for (var _len15 = arguments.length, args = Array(_len15), _key15 = 0; _key15 < _len15; _key15++) {
            args[_key15] = arguments[_key15];
          }

          if (meth != null) {
            res = meth.call.apply(meth, [obj].concat(args));
          }
          (_arr$methName = arr[methName]).call.apply(_arr$methName, [arr].concat(args));
          return res;
        };
        spec = {
          configurable: true,
          enumerable: false,
          value: newMeth,
          writable: true
        };
        return [methName, spec];
      })));
      return obj;
    } else {
      return Object.defineProperties(obj, _underscore2.default.object(function () {
        var result = [];

        for (var name in fieldspec) {
          spec = fieldspec[name];
          result.push(function (name, spec) {
            var desc = null;
            switch (spec.type) {
              case "cell":
                {
                  var obs = _cell3(spec.val != null ? spec.val : null);
                  desc = {
                    configurable: true,
                    enumerable: true,
                    get: function get() {
                      return obs.get();
                    },
                    set: function set(x) {
                      return obs.set(x);
                    }
                  };
                  break;
                }
              case "array":
                {
                  var view = reactify(spec.val != null ? spec.val : []);
                  desc = {
                    configurable: true,
                    enumerable: true,
                    get: function get() {
                      view.all();
                      return view;
                    },
                    set: function set(x) {
                      view.splice.apply(view, [0, view.length].concat(_toConsumableArray(x)));
                      return view;
                    }
                  };
                  break;
                }
              default:
                throw new Error("Unknown observable type: " + spec.type);
            }
            return [name, desc];
          }(name, spec));
        }

        return result;
      }()));
    }
  };
  var autoReactify = exports.autoReactify = function autoReactify(obj) {
    var result = [];

    var _iteratorNormalCompletion19 = true;
    var _didIteratorError19 = false;
    var _iteratorError19 = undefined;

    try {
      for (var _iterator19 = Object.getOwnPropertyNames(obj)[Symbol.iterator](), _step19; !(_iteratorNormalCompletion19 = (_step19 = _iterator19.next()).done); _iteratorNormalCompletion19 = true) {
        var name = _step19.value;

        var val = obj[name];
        if (val instanceof ObsBase) {
          continue;
        }
        var type = _underscore2.default.isFunction(val) ? null : _underscore2.default.isArray(val) ? "array" : "cell";
        result.push([name, { type: type, val: val }]);
      }
    } catch (err) {
      _didIteratorError19 = true;
      _iteratorError19 = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion19 && _iterator19.return) {
          _iterator19.return();
        }
      } finally {
        if (_didIteratorError19) {
          throw _iteratorError19;
        }
      }
    }

    reactify(obj, _underscore2.default.object(result));
  };

  var _cell3 = function _cell3(value) {
    return new SrcCell(value);
  };
  exports.cell = _cell3;
  _cell3.from = function (value) {
    if (value instanceof ObsCell) {
      return value;
    } else if (value instanceof ObsBase) {
      return bind(function () {
        return value.all();
      });
    } else {
      return bind(function () {
        return value;
      });
    }
  };

  var _array = function _array(xs, diff) {
    return new SrcArray((xs != null ? xs : []).map(_cell3), diff);
  };
  exports.array = _array;
  _array.from = function (value, diff) {
    var f = void 0;
    if (value instanceof ObsArray) {
      return value;
    } else if (_underscore2.default.isArray(value)) {
      f = function f() {
        return value;
      };
    } else if (value instanceof ObsBase) {
      f = function f() {
        return value.all();
      };
    } else {
      throw new Error("Cannot cast " + value.constructor.name + " to array!");
    }

    return new DepArray(f, diff);
  };

  var _map = function _map(value) {
    return new SrcMap(value);
  };
  exports.map = _map;
  _map.from = function (value) {
    if (value instanceof ObsMap) {
      return value;
    } else if (value instanceof ObsBase) {
      return new DepMap(function () {
        return value.all();
      });
    } else {
      return new DepMap(function () {
        return value;
      });
    }
  };

  var _set = function _set(value) {
    return new SrcSet(value);
  };
  exports.set = _set;
  _set.from = function (value) {
    if (value instanceof ObsSet) {
      return value;
    } else if (value instanceof ObsBase) {
      return new DepSet(function () {
        return value.all();
      });
    } else {
      return new DepSet(function () {
        return value;
      });
    }
  };

  var rxTypes = { cell: _cell3, array: _array, map: _map, set: _set };

  var cast = exports.cast = function cast(value, type) {
    if (type == null) {
      type = "cell";
    }
    if ([ObsCell, ObsArray, ObsMap, ObsSet].includes(type)) {
      var realType = null;
      switch (type) {
        case ObsCell:
          realType = "cell";break;
        case ObsArray:
          realType = "array";break;
        case ObsMap:
          realType = "map";break;
        case ObsSet:
          realType = "set";break;
      }
      type = realType;
    }
    if (_underscore2.default.isString(type)) {
      if (type in types) {
        return rxTypes[type].from(value);
      } else {
        return value;
      }
    } else {
      var opts = value;
      var _types = type;
      return _underscore2.default.mapObject(opts, function (value, key) {
        if (_types[key]) {
          return cast(value, _types[key]);
        } else {
          return value;
        }
      });
    }
  };

  //
  // Reactive utilities
  //

  var _flatten = function _flatten(xs) {
    return new DepArray(function () {
      return _underscore2.default.chain(flattenHelper([xs])).flatten().filter(function (x) {
        return x != null;
      }).value();
    });
  };

  exports.flatten = _flatten;
  var flattenHelper = function flattenHelper(x) {
    if (x instanceof ObsArray) {
      return flattenHelper(x.all());
    } else if (x instanceof ObsSet) {
      return flattenHelper(Array.from(x.values()));
    } else if (x instanceof ObsCell) {
      return flattenHelper(x.get());
    } else if (x instanceof Set) {
      return flattenHelper(Array.from(x));
    } else if (_underscore2.default.isArray(x)) {
      return x.map(function (x_k) {
        return flattenHelper(x_k);
      });
    } else {
      return x;
    }
  };

  var cellToArray = exports.cellToArray = function cellToArray(cell, diff) {
    return new DepArray(function () {
      return cell.get();
    }, diff);
  };
  var cellToMap = exports.cellToMap = function cellToMap(cell) {
    return new DepMap(function () {
      return cell.get();
    });
  };
  var cellToSet = exports.cellToSet = function cellToSet(c) {
    return new DepSet(function () {
      return c.get();
    });
  };

  // O(n) using hash key
  var basicDiff = exports.basicDiff = function basicDiff(key) {
    if (key == null) {
      key = smartUidify;
    }
    return function (oldXs, newXs) {
      var oldKeys = mkMap(oldXs.map(function (x, i) {
        return [key(x), i];
      }));
      var left = void 0;
      return newXs.map(function (x) {
        left = oldKeys[key(x)];
        return left != null ? left : -1;
      });
    };
  };

  // This is invasive; WeakMaps can't come soon enough....
  var uidify = exports.uidify = function uidify(x) {
    return x.__rxUid != null ? x.__rxUid : Object.defineProperty(x, "__rxUid", {
      enumerable: false,
      value: mkuid()
    }).__rxUid;
  };

  // Need a "hash" that distinguishes different types and distinguishes object
  // UIDs from ints.
  var smartUidify = exports.smartUidify = function smartUidify(x) {
    if (_underscore2.default.isObject(x)) {
      return uidify(x);
    } else {
      return JSON.stringify(x);
    }
  };

  // Note: this gives up and returns null if there are reorderings or
  // duplications; only handles (multiple) simple insertions and removals
  // (batching them together into splices).
  var permToSplices = function permToSplices(oldLength, newXs, perm) {
    var i = void 0;
    if (!newXs.length) {
      return null; // just do a full splice if we're emptying the array
    }
    var refs = perm.filter(function (i) {
      return i >= 0;
    });
    var end = refs.length - 1;
    var asc = 0 <= end;
    var giveUp = [];
    for (i = 0; asc ? i < end : i > end; asc ? i++ : i--) {
      giveUp.push(refs[i + 1] - refs[i] <= 0);
    }
    if (giveUp.some(_underscore2.default.identity)) {
      return null;
    }

    var splices = [];
    var last = -1;
    i = 0;
    while (i < perm.length) {
      // skip over any good consecutive runs
      while (i < perm.length && perm[i] === last + 1) {
        last += 1;
        i += 1;
      }
      // lump any additions into this splice
      var splice = { index: i, count: 0, additions: [] };
      while (i < perm.length && perm[i] === -1) {
        splice.additions.push(newXs[i]);
        i += 1;
      }
      // Find the step difference to find how many from old were removed/skipped;
      // if no step (perm[i] == last + 1) then count should be 0.  If we see no
      // more references to old elements, then we need oldLength to determine how
      // many remaining old elements were logically removed.
      var cur = i === perm.length ? oldLength : perm[i];
      splice.count = cur - (last + 1);
      if (splice.count > 0 || splice.additions.length > 0) {
        splices.push([splice.index, splice.count, splice.additions]);
      }
      last = cur;
      i += 1;
    }
    return splices;
  };

  var transaction = exports.transaction = function transaction(f) {
    return depMgr.transaction(f);
  };
  var optTransact = function optTransact(f) {
    if (depMgr.buffering) {
      return f();
    } else {
      return transaction(f);
    }
  };
});

//# sourceMappingURL=main.js.map