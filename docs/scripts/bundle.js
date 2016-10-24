/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "/docs/";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(riot) {"use strict";
	
	// Observable
	
	window.obs = riot.observable();
	
	var router = __webpack_require__(3);
	router.start();
	
	var api = __webpack_require__(10);
	var d = new Date();
	obs.on('getMenu:req', function () {
		var year = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : d.getFullYear();
		var month = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : d.getMonth() + 1;
	
		api.get(2016, 10).then(function (data) {
			if (data.status === 'success') {
				obs.trigger('getMenu:res', data.items);
			} else {
				obs.trigger('getMenu:res', {
					status: 'notfound'
				});
			}
		});
	});
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(1)))

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_RESULT__;/* Riot v2.6.4, @license MIT */
	
	;(function(window, undefined) {
	  'use strict';
	var riot = { version: 'v2.6.4', settings: {} },
	  // be aware, internal usage
	  // ATTENTION: prefix the global dynamic variables with `__`
	
	  // counter to give a unique id to all the Tag instances
	  __uid = 0,
	  // tags instances cache
	  __virtualDom = [],
	  // tags implementation cache
	  __tagImpl = {},
	
	  /**
	   * Const
	   */
	  GLOBAL_MIXIN = '__global_mixin',
	
	  // riot specific prefixes
	  RIOT_PREFIX = 'riot-',
	  RIOT_TAG = RIOT_PREFIX + 'tag',
	  RIOT_TAG_IS = 'data-is',
	
	  // for typeof == '' comparisons
	  T_STRING = 'string',
	  T_OBJECT = 'object',
	  T_UNDEF  = 'undefined',
	  T_FUNCTION = 'function',
	  XLINK_NS = 'http://www.w3.org/1999/xlink',
	  XLINK_REGEX = /^xlink:(\w+)/,
	  // special native tags that cannot be treated like the others
	  SPECIAL_TAGS_REGEX = /^(?:t(?:body|head|foot|[rhd])|caption|col(?:group)?|opt(?:ion|group))$/,
	  RESERVED_WORDS_BLACKLIST = /^(?:_(?:item|id|parent)|update|root|(?:un)?mount|mixin|is(?:Mounted|Loop)|tags|parent|opts|trigger|o(?:n|ff|ne))$/,
	  // SVG tags list https://www.w3.org/TR/SVG/attindex.html#PresentationAttributes
	  SVG_TAGS_LIST = ['altGlyph', 'animate', 'animateColor', 'circle', 'clipPath', 'defs', 'ellipse', 'feBlend', 'feColorMatrix', 'feComponentTransfer', 'feComposite', 'feConvolveMatrix', 'feDiffuseLighting', 'feDisplacementMap', 'feFlood', 'feGaussianBlur', 'feImage', 'feMerge', 'feMorphology', 'feOffset', 'feSpecularLighting', 'feTile', 'feTurbulence', 'filter', 'font', 'foreignObject', 'g', 'glyph', 'glyphRef', 'image', 'line', 'linearGradient', 'marker', 'mask', 'missing-glyph', 'path', 'pattern', 'polygon', 'polyline', 'radialGradient', 'rect', 'stop', 'svg', 'switch', 'symbol', 'text', 'textPath', 'tref', 'tspan', 'use'],
	
	  // version# for IE 8-11, 0 for others
	  IE_VERSION = (window && window.document || {}).documentMode | 0,
	
	  // detect firefox to fix #1374
	  FIREFOX = window && !!window.InstallTrigger
	/* istanbul ignore next */
	riot.observable = function(el) {
	
	  /**
	   * Extend the original object or create a new empty one
	   * @type { Object }
	   */
	
	  el = el || {}
	
	  /**
	   * Private variables
	   */
	  var callbacks = {},
	    slice = Array.prototype.slice
	
	  /**
	   * Private Methods
	   */
	
	  /**
	   * Helper function needed to get and loop all the events in a string
	   * @param   { String }   e - event string
	   * @param   {Function}   fn - callback
	   */
	  function onEachEvent(e, fn) {
	    var es = e.split(' '), l = es.length, i = 0
	    for (; i < l; i++) {
	      var name = es[i]
	      if (name) fn(name, i)
	    }
	  }
	
	  /**
	   * Public Api
	   */
	
	  // extend the el object adding the observable methods
	  Object.defineProperties(el, {
	    /**
	     * Listen to the given space separated list of `events` and
	     * execute the `callback` each time an event is triggered.
	     * @param  { String } events - events ids
	     * @param  { Function } fn - callback function
	     * @returns { Object } el
	     */
	    on: {
	      value: function(events, fn) {
	        if (typeof fn != 'function')  return el
	
	        onEachEvent(events, function(name, pos) {
	          (callbacks[name] = callbacks[name] || []).push(fn)
	          fn.typed = pos > 0
	        })
	
	        return el
	      },
	      enumerable: false,
	      writable: false,
	      configurable: false
	    },
	
	    /**
	     * Removes the given space separated list of `events` listeners
	     * @param   { String } events - events ids
	     * @param   { Function } fn - callback function
	     * @returns { Object } el
	     */
	    off: {
	      value: function(events, fn) {
	        if (events == '*' && !fn) callbacks = {}
	        else {
	          onEachEvent(events, function(name, pos) {
	            if (fn) {
	              var arr = callbacks[name]
	              for (var i = 0, cb; cb = arr && arr[i]; ++i) {
	                if (cb == fn) arr.splice(i--, 1)
	              }
	            } else delete callbacks[name]
	          })
	        }
	        return el
	      },
	      enumerable: false,
	      writable: false,
	      configurable: false
	    },
	
	    /**
	     * Listen to the given space separated list of `events` and
	     * execute the `callback` at most once
	     * @param   { String } events - events ids
	     * @param   { Function } fn - callback function
	     * @returns { Object } el
	     */
	    one: {
	      value: function(events, fn) {
	        function on() {
	          el.off(events, on)
	          fn.apply(el, arguments)
	        }
	        return el.on(events, on)
	      },
	      enumerable: false,
	      writable: false,
	      configurable: false
	    },
	
	    /**
	     * Execute all callback functions that listen to
	     * the given space separated list of `events`
	     * @param   { String } events - events ids
	     * @returns { Object } el
	     */
	    trigger: {
	      value: function(events) {
	
	        // getting the arguments
	        var arglen = arguments.length - 1,
	          args = new Array(arglen),
	          fns
	
	        for (var i = 0; i < arglen; i++) {
	          args[i] = arguments[i + 1] // skip first argument
	        }
	
	        onEachEvent(events, function(name, pos) {
	
	          fns = slice.call(callbacks[name] || [], 0)
	
	          for (var i = 0, fn; fn = fns[i]; ++i) {
	            if (fn.busy) continue
	            fn.busy = 1
	            fn.apply(el, fn.typed ? [name].concat(args) : args)
	            if (fns[i] !== fn) { i-- }
	            fn.busy = 0
	          }
	
	          if (callbacks['*'] && name != '*')
	            el.trigger.apply(el, ['*', name].concat(args))
	
	        })
	
	        return el
	      },
	      enumerable: false,
	      writable: false,
	      configurable: false
	    }
	  })
	
	  return el
	
	}
	/* istanbul ignore next */
	;(function(riot) {
	
	/**
	 * Simple client-side router
	 * @module riot-route
	 */
	
	
	var RE_ORIGIN = /^.+?\/\/+[^\/]+/,
	  EVENT_LISTENER = 'EventListener',
	  REMOVE_EVENT_LISTENER = 'remove' + EVENT_LISTENER,
	  ADD_EVENT_LISTENER = 'add' + EVENT_LISTENER,
	  HAS_ATTRIBUTE = 'hasAttribute',
	  REPLACE = 'replace',
	  POPSTATE = 'popstate',
	  HASHCHANGE = 'hashchange',
	  TRIGGER = 'trigger',
	  MAX_EMIT_STACK_LEVEL = 3,
	  win = typeof window != 'undefined' && window,
	  doc = typeof document != 'undefined' && document,
	  hist = win && history,
	  loc = win && (hist.location || win.location), // see html5-history-api
	  prot = Router.prototype, // to minify more
	  clickEvent = doc && doc.ontouchstart ? 'touchstart' : 'click',
	  started = false,
	  central = riot.observable(),
	  routeFound = false,
	  debouncedEmit,
	  base, current, parser, secondParser, emitStack = [], emitStackLevel = 0
	
	/**
	 * Default parser. You can replace it via router.parser method.
	 * @param {string} path - current path (normalized)
	 * @returns {array} array
	 */
	function DEFAULT_PARSER(path) {
	  return path.split(/[/?#]/)
	}
	
	/**
	 * Default parser (second). You can replace it via router.parser method.
	 * @param {string} path - current path (normalized)
	 * @param {string} filter - filter string (normalized)
	 * @returns {array} array
	 */
	function DEFAULT_SECOND_PARSER(path, filter) {
	  var re = new RegExp('^' + filter[REPLACE](/\*/g, '([^/?#]+?)')[REPLACE](/\.\./, '.*') + '$'),
	    args = path.match(re)
	
	  if (args) return args.slice(1)
	}
	
	/**
	 * Simple/cheap debounce implementation
	 * @param   {function} fn - callback
	 * @param   {number} delay - delay in seconds
	 * @returns {function} debounced function
	 */
	function debounce(fn, delay) {
	  var t
	  return function () {
	    clearTimeout(t)
	    t = setTimeout(fn, delay)
	  }
	}
	
	/**
	 * Set the window listeners to trigger the routes
	 * @param {boolean} autoExec - see route.start
	 */
	function start(autoExec) {
	  debouncedEmit = debounce(emit, 1)
	  win[ADD_EVENT_LISTENER](POPSTATE, debouncedEmit)
	  win[ADD_EVENT_LISTENER](HASHCHANGE, debouncedEmit)
	  doc[ADD_EVENT_LISTENER](clickEvent, click)
	  if (autoExec) emit(true)
	}
	
	/**
	 * Router class
	 */
	function Router() {
	  this.$ = []
	  riot.observable(this) // make it observable
	  central.on('stop', this.s.bind(this))
	  central.on('emit', this.e.bind(this))
	}
	
	function normalize(path) {
	  return path[REPLACE](/^\/|\/$/, '')
	}
	
	function isString(str) {
	  return typeof str == 'string'
	}
	
	/**
	 * Get the part after domain name
	 * @param {string} href - fullpath
	 * @returns {string} path from root
	 */
	function getPathFromRoot(href) {
	  return (href || loc.href)[REPLACE](RE_ORIGIN, '')
	}
	
	/**
	 * Get the part after base
	 * @param {string} href - fullpath
	 * @returns {string} path from base
	 */
	function getPathFromBase(href) {
	  return base[0] == '#'
	    ? (href || loc.href || '').split(base)[1] || ''
	    : (loc ? getPathFromRoot(href) : href || '')[REPLACE](base, '')
	}
	
	function emit(force) {
	  // the stack is needed for redirections
	  var isRoot = emitStackLevel == 0, first
	  if (MAX_EMIT_STACK_LEVEL <= emitStackLevel) return
	
	  emitStackLevel++
	  emitStack.push(function() {
	    var path = getPathFromBase()
	    if (force || path != current) {
	      central[TRIGGER]('emit', path)
	      current = path
	    }
	  })
	  if (isRoot) {
	    while (first = emitStack.shift()) first() // stack increses within this call
	    emitStackLevel = 0
	  }
	}
	
	function click(e) {
	  if (
	    e.which != 1 // not left click
	    || e.metaKey || e.ctrlKey || e.shiftKey // or meta keys
	    || e.defaultPrevented // or default prevented
	  ) return
	
	  var el = e.target
	  while (el && el.nodeName != 'A') el = el.parentNode
	
	  if (
	    !el || el.nodeName != 'A' // not A tag
	    || el[HAS_ATTRIBUTE]('download') // has download attr
	    || !el[HAS_ATTRIBUTE]('href') // has no href attr
	    || el.target && el.target != '_self' // another window or frame
	    || el.href.indexOf(loc.href.match(RE_ORIGIN)[0]) == -1 // cross origin
	  ) return
	
	  if (el.href != loc.href
	    && (
	      el.href.split('#')[0] == loc.href.split('#')[0] // internal jump
	      || base[0] != '#' && getPathFromRoot(el.href).indexOf(base) !== 0 // outside of base
	      || base[0] == '#' && el.href.split(base)[0] != loc.href.split(base)[0] // outside of #base
	      || !go(getPathFromBase(el.href), el.title || doc.title) // route not found
	    )) return
	
	  e.preventDefault()
	}
	
	/**
	 * Go to the path
	 * @param {string} path - destination path
	 * @param {string} title - page title
	 * @param {boolean} shouldReplace - use replaceState or pushState
	 * @returns {boolean} - route not found flag
	 */
	function go(path, title, shouldReplace) {
	  // Server-side usage: directly execute handlers for the path
	  if (!hist) return central[TRIGGER]('emit', getPathFromBase(path))
	
	  path = base + normalize(path)
	  title = title || doc.title
	  // browsers ignores the second parameter `title`
	  shouldReplace
	    ? hist.replaceState(null, title, path)
	    : hist.pushState(null, title, path)
	  // so we need to set it manually
	  doc.title = title
	  routeFound = false
	  emit()
	  return routeFound
	}
	
	/**
	 * Go to path or set action
	 * a single string:                go there
	 * two strings:                    go there with setting a title
	 * two strings and boolean:        replace history with setting a title
	 * a single function:              set an action on the default route
	 * a string/RegExp and a function: set an action on the route
	 * @param {(string|function)} first - path / action / filter
	 * @param {(string|RegExp|function)} second - title / action
	 * @param {boolean} third - replace flag
	 */
	prot.m = function(first, second, third) {
	  if (isString(first) && (!second || isString(second))) go(first, second, third || false)
	  else if (second) this.r(first, second)
	  else this.r('@', first)
	}
	
	/**
	 * Stop routing
	 */
	prot.s = function() {
	  this.off('*')
	  this.$ = []
	}
	
	/**
	 * Emit
	 * @param {string} path - path
	 */
	prot.e = function(path) {
	  this.$.concat('@').some(function(filter) {
	    var args = (filter == '@' ? parser : secondParser)(normalize(path), normalize(filter))
	    if (typeof args != 'undefined') {
	      this[TRIGGER].apply(null, [filter].concat(args))
	      return routeFound = true // exit from loop
	    }
	  }, this)
	}
	
	/**
	 * Register route
	 * @param {string} filter - filter for matching to url
	 * @param {function} action - action to register
	 */
	prot.r = function(filter, action) {
	  if (filter != '@') {
	    filter = '/' + normalize(filter)
	    this.$.push(filter)
	  }
	  this.on(filter, action)
	}
	
	var mainRouter = new Router()
	var route = mainRouter.m.bind(mainRouter)
	
	/**
	 * Create a sub router
	 * @returns {function} the method of a new Router object
	 */
	route.create = function() {
	  var newSubRouter = new Router()
	  // assign sub-router's main method
	  var router = newSubRouter.m.bind(newSubRouter)
	  // stop only this sub-router
	  router.stop = newSubRouter.s.bind(newSubRouter)
	  return router
	}
	
	/**
	 * Set the base of url
	 * @param {(str|RegExp)} arg - a new base or '#' or '#!'
	 */
	route.base = function(arg) {
	  base = arg || '#'
	  current = getPathFromBase() // recalculate current path
	}
	
	/** Exec routing right now **/
	route.exec = function() {
	  emit(true)
	}
	
	/**
	 * Replace the default router to yours
	 * @param {function} fn - your parser function
	 * @param {function} fn2 - your secondParser function
	 */
	route.parser = function(fn, fn2) {
	  if (!fn && !fn2) {
	    // reset parser for testing...
	    parser = DEFAULT_PARSER
	    secondParser = DEFAULT_SECOND_PARSER
	  }
	  if (fn) parser = fn
	  if (fn2) secondParser = fn2
	}
	
	/**
	 * Helper function to get url query as an object
	 * @returns {object} parsed query
	 */
	route.query = function() {
	  var q = {}
	  var href = loc.href || current
	  href[REPLACE](/[?&](.+?)=([^&]*)/g, function(_, k, v) { q[k] = v })
	  return q
	}
	
	/** Stop routing **/
	route.stop = function () {
	  if (started) {
	    if (win) {
	      win[REMOVE_EVENT_LISTENER](POPSTATE, debouncedEmit)
	      win[REMOVE_EVENT_LISTENER](HASHCHANGE, debouncedEmit)
	      doc[REMOVE_EVENT_LISTENER](clickEvent, click)
	    }
	    central[TRIGGER]('stop')
	    started = false
	  }
	}
	
	/**
	 * Start routing
	 * @param {boolean} autoExec - automatically exec after starting if true
	 */
	route.start = function (autoExec) {
	  if (!started) {
	    if (win) {
	      if (document.readyState == 'complete') start(autoExec)
	      // the timeout is needed to solve
	      // a weird safari bug https://github.com/riot/route/issues/33
	      else win[ADD_EVENT_LISTENER]('load', function() {
	        setTimeout(function() { start(autoExec) }, 1)
	      })
	    }
	    started = true
	  }
	}
	
	/** Prepare the router **/
	route.base()
	route.parser()
	
	riot.route = route
	})(riot)
	/* istanbul ignore next */
	
	/**
	 * The riot template engine
	 * @version v2.4.2
	 */
	/**
	 * riot.util.brackets
	 *
	 * - `brackets    ` - Returns a string or regex based on its parameter
	 * - `brackets.set` - Change the current riot brackets
	 *
	 * @module
	 */
	
	var brackets = (function (UNDEF) {
	
	  var
	    REGLOB = 'g',
	
	    R_MLCOMMS = /\/\*[^*]*\*+(?:[^*\/][^*]*\*+)*\//g,
	
	    R_STRINGS = /"[^"\\]*(?:\\[\S\s][^"\\]*)*"|'[^'\\]*(?:\\[\S\s][^'\\]*)*'/g,
	
	    S_QBLOCKS = R_STRINGS.source + '|' +
	      /(?:\breturn\s+|(?:[$\w\)\]]|\+\+|--)\s*(\/)(?![*\/]))/.source + '|' +
	      /\/(?=[^*\/])[^[\/\\]*(?:(?:\[(?:\\.|[^\]\\]*)*\]|\\.)[^[\/\\]*)*?(\/)[gim]*/.source,
	
	    UNSUPPORTED = RegExp('[\\' + 'x00-\\x1F<>a-zA-Z0-9\'",;\\\\]'),
	
	    NEED_ESCAPE = /(?=[[\]()*+?.^$|])/g,
	
	    FINDBRACES = {
	      '(': RegExp('([()])|'   + S_QBLOCKS, REGLOB),
	      '[': RegExp('([[\\]])|' + S_QBLOCKS, REGLOB),
	      '{': RegExp('([{}])|'   + S_QBLOCKS, REGLOB)
	    },
	
	    DEFAULT = '{ }'
	
	  var _pairs = [
	    '{', '}',
	    '{', '}',
	    /{[^}]*}/,
	    /\\([{}])/g,
	    /\\({)|{/g,
	    RegExp('\\\\(})|([[({])|(})|' + S_QBLOCKS, REGLOB),
	    DEFAULT,
	    /^\s*{\^?\s*([$\w]+)(?:\s*,\s*(\S+))?\s+in\s+(\S.*)\s*}/,
	    /(^|[^\\]){=[\S\s]*?}/
	  ]
	
	  var
	    cachedBrackets = UNDEF,
	    _regex,
	    _cache = [],
	    _settings
	
	  function _loopback (re) { return re }
	
	  function _rewrite (re, bp) {
	    if (!bp) bp = _cache
	    return new RegExp(
	      re.source.replace(/{/g, bp[2]).replace(/}/g, bp[3]), re.global ? REGLOB : ''
	    )
	  }
	
	  function _create (pair) {
	    if (pair === DEFAULT) return _pairs
	
	    var arr = pair.split(' ')
	
	    if (arr.length !== 2 || UNSUPPORTED.test(pair)) {
	      throw new Error('Unsupported brackets "' + pair + '"')
	    }
	    arr = arr.concat(pair.replace(NEED_ESCAPE, '\\').split(' '))
	
	    arr[4] = _rewrite(arr[1].length > 1 ? /{[\S\s]*?}/ : _pairs[4], arr)
	    arr[5] = _rewrite(pair.length > 3 ? /\\({|})/g : _pairs[5], arr)
	    arr[6] = _rewrite(_pairs[6], arr)
	    arr[7] = RegExp('\\\\(' + arr[3] + ')|([[({])|(' + arr[3] + ')|' + S_QBLOCKS, REGLOB)
	    arr[8] = pair
	    return arr
	  }
	
	  function _brackets (reOrIdx) {
	    return reOrIdx instanceof RegExp ? _regex(reOrIdx) : _cache[reOrIdx]
	  }
	
	  _brackets.split = function split (str, tmpl, _bp) {
	    // istanbul ignore next: _bp is for the compiler
	    if (!_bp) _bp = _cache
	
	    var
	      parts = [],
	      match,
	      isexpr,
	      start,
	      pos,
	      re = _bp[6]
	
	    isexpr = start = re.lastIndex = 0
	
	    while ((match = re.exec(str))) {
	
	      pos = match.index
	
	      if (isexpr) {
	
	        if (match[2]) {
	          re.lastIndex = skipBraces(str, match[2], re.lastIndex)
	          continue
	        }
	        if (!match[3]) {
	          continue
	        }
	      }
	
	      if (!match[1]) {
	        unescapeStr(str.slice(start, pos))
	        start = re.lastIndex
	        re = _bp[6 + (isexpr ^= 1)]
	        re.lastIndex = start
	      }
	    }
	
	    if (str && start < str.length) {
	      unescapeStr(str.slice(start))
	    }
	
	    return parts
	
	    function unescapeStr (s) {
	      if (tmpl || isexpr) {
	        parts.push(s && s.replace(_bp[5], '$1'))
	      } else {
	        parts.push(s)
	      }
	    }
	
	    function skipBraces (s, ch, ix) {
	      var
	        match,
	        recch = FINDBRACES[ch]
	
	      recch.lastIndex = ix
	      ix = 1
	      while ((match = recch.exec(s))) {
	        if (match[1] &&
	          !(match[1] === ch ? ++ix : --ix)) break
	      }
	      return ix ? s.length : recch.lastIndex
	    }
	  }
	
	  _brackets.hasExpr = function hasExpr (str) {
	    return _cache[4].test(str)
	  }
	
	  _brackets.loopKeys = function loopKeys (expr) {
	    var m = expr.match(_cache[9])
	
	    return m
	      ? { key: m[1], pos: m[2], val: _cache[0] + m[3].trim() + _cache[1] }
	      : { val: expr.trim() }
	  }
	
	  _brackets.array = function array (pair) {
	    return pair ? _create(pair) : _cache
	  }
	
	  function _reset (pair) {
	    if ((pair || (pair = DEFAULT)) !== _cache[8]) {
	      _cache = _create(pair)
	      _regex = pair === DEFAULT ? _loopback : _rewrite
	      _cache[9] = _regex(_pairs[9])
	    }
	    cachedBrackets = pair
	  }
	
	  function _setSettings (o) {
	    var b
	
	    o = o || {}
	    b = o.brackets
	    Object.defineProperty(o, 'brackets', {
	      set: _reset,
	      get: function () { return cachedBrackets },
	      enumerable: true
	    })
	    _settings = o
	    _reset(b)
	  }
	
	  Object.defineProperty(_brackets, 'settings', {
	    set: _setSettings,
	    get: function () { return _settings }
	  })
	
	  /* istanbul ignore next: in the browser riot is always in the scope */
	  _brackets.settings = typeof riot !== 'undefined' && riot.settings || {}
	  _brackets.set = _reset
	
	  _brackets.R_STRINGS = R_STRINGS
	  _brackets.R_MLCOMMS = R_MLCOMMS
	  _brackets.S_QBLOCKS = S_QBLOCKS
	
	  return _brackets
	
	})()
	
	/**
	 * @module tmpl
	 *
	 * tmpl          - Root function, returns the template value, render with data
	 * tmpl.hasExpr  - Test the existence of a expression inside a string
	 * tmpl.loopKeys - Get the keys for an 'each' loop (used by `_each`)
	 */
	
	var tmpl = (function () {
	
	  var _cache = {}
	
	  function _tmpl (str, data) {
	    if (!str) return str
	
	    return (_cache[str] || (_cache[str] = _create(str))).call(data, _logErr)
	  }
	
	  _tmpl.haveRaw = brackets.hasRaw
	
	  _tmpl.hasExpr = brackets.hasExpr
	
	  _tmpl.loopKeys = brackets.loopKeys
	
	  // istanbul ignore next
	  _tmpl.clearCache = function () { _cache = {} }
	
	  _tmpl.errorHandler = null
	
	  function _logErr (err, ctx) {
	
	    if (_tmpl.errorHandler) {
	
	      err.riotData = {
	        tagName: ctx && ctx.root && ctx.root.tagName,
	        _riot_id: ctx && ctx._riot_id  //eslint-disable-line camelcase
	      }
	      _tmpl.errorHandler(err)
	    }
	  }
	
	  function _create (str) {
	    var expr = _getTmpl(str)
	
	    if (expr.slice(0, 11) !== 'try{return ') expr = 'return ' + expr
	
	    return new Function('E', expr + ';')    // eslint-disable-line no-new-func
	  }
	
	  var
	    CH_IDEXPR = String.fromCharCode(0x2057),
	    RE_CSNAME = /^(?:(-?[_A-Za-z\xA0-\xFF][-\w\xA0-\xFF]*)|\u2057(\d+)~):/,
	    RE_QBLOCK = RegExp(brackets.S_QBLOCKS, 'g'),
	    RE_DQUOTE = /\u2057/g,
	    RE_QBMARK = /\u2057(\d+)~/g
	
	  function _getTmpl (str) {
	    var
	      qstr = [],
	      expr,
	      parts = brackets.split(str.replace(RE_DQUOTE, '"'), 1)
	
	    if (parts.length > 2 || parts[0]) {
	      var i, j, list = []
	
	      for (i = j = 0; i < parts.length; ++i) {
	
	        expr = parts[i]
	
	        if (expr && (expr = i & 1
	
	            ? _parseExpr(expr, 1, qstr)
	
	            : '"' + expr
	                .replace(/\\/g, '\\\\')
	                .replace(/\r\n?|\n/g, '\\n')
	                .replace(/"/g, '\\"') +
	              '"'
	
	          )) list[j++] = expr
	
	      }
	
	      expr = j < 2 ? list[0]
	           : '[' + list.join(',') + '].join("")'
	
	    } else {
	
	      expr = _parseExpr(parts[1], 0, qstr)
	    }
	
	    if (qstr[0]) {
	      expr = expr.replace(RE_QBMARK, function (_, pos) {
	        return qstr[pos]
	          .replace(/\r/g, '\\r')
	          .replace(/\n/g, '\\n')
	      })
	    }
	    return expr
	  }
	
	  var
	    RE_BREND = {
	      '(': /[()]/g,
	      '[': /[[\]]/g,
	      '{': /[{}]/g
	    }
	
	  function _parseExpr (expr, asText, qstr) {
	
	    expr = expr
	          .replace(RE_QBLOCK, function (s, div) {
	            return s.length > 2 && !div ? CH_IDEXPR + (qstr.push(s) - 1) + '~' : s
	          })
	          .replace(/\s+/g, ' ').trim()
	          .replace(/\ ?([[\({},?\.:])\ ?/g, '$1')
	
	    if (expr) {
	      var
	        list = [],
	        cnt = 0,
	        match
	
	      while (expr &&
	            (match = expr.match(RE_CSNAME)) &&
	            !match.index
	        ) {
	        var
	          key,
	          jsb,
	          re = /,|([[{(])|$/g
	
	        expr = RegExp.rightContext
	        key  = match[2] ? qstr[match[2]].slice(1, -1).trim().replace(/\s+/g, ' ') : match[1]
	
	        while (jsb = (match = re.exec(expr))[1]) skipBraces(jsb, re)
	
	        jsb  = expr.slice(0, match.index)
	        expr = RegExp.rightContext
	
	        list[cnt++] = _wrapExpr(jsb, 1, key)
	      }
	
	      expr = !cnt ? _wrapExpr(expr, asText)
	           : cnt > 1 ? '[' + list.join(',') + '].join(" ").trim()' : list[0]
	    }
	    return expr
	
	    function skipBraces (ch, re) {
	      var
	        mm,
	        lv = 1,
	        ir = RE_BREND[ch]
	
	      ir.lastIndex = re.lastIndex
	      while (mm = ir.exec(expr)) {
	        if (mm[0] === ch) ++lv
	        else if (!--lv) break
	      }
	      re.lastIndex = lv ? expr.length : ir.lastIndex
	    }
	  }
	
	  // istanbul ignore next: not both
	  var // eslint-disable-next-line max-len
	    JS_CONTEXT = '"in this?this:' + (typeof window !== 'object' ? 'global' : 'window') + ').',
	    JS_VARNAME = /[,{][\$\w]+(?=:)|(^ *|[^$\w\.{])(?!(?:typeof|true|false|null|undefined|in|instanceof|is(?:Finite|NaN)|void|NaN|new|Date|RegExp|Math)(?![$\w]))([$_A-Za-z][$\w]*)/g,
	    JS_NOPROPS = /^(?=(\.[$\w]+))\1(?:[^.[(]|$)/
	
	  function _wrapExpr (expr, asText, key) {
	    var tb
	
	    expr = expr.replace(JS_VARNAME, function (match, p, mvar, pos, s) {
	      if (mvar) {
	        pos = tb ? 0 : pos + match.length
	
	        if (mvar !== 'this' && mvar !== 'global' && mvar !== 'window') {
	          match = p + '("' + mvar + JS_CONTEXT + mvar
	          if (pos) tb = (s = s[pos]) === '.' || s === '(' || s === '['
	        } else if (pos) {
	          tb = !JS_NOPROPS.test(s.slice(pos))
	        }
	      }
	      return match
	    })
	
	    if (tb) {
	      expr = 'try{return ' + expr + '}catch(e){E(e,this)}'
	    }
	
	    if (key) {
	
	      expr = (tb
	          ? 'function(){' + expr + '}.call(this)' : '(' + expr + ')'
	        ) + '?"' + key + '":""'
	
	    } else if (asText) {
	
	      expr = 'function(v){' + (tb
	          ? expr.replace('return ', 'v=') : 'v=(' + expr + ')'
	        ) + ';return v||v===0?v:""}.call(this)'
	    }
	
	    return expr
	  }
	
	  _tmpl.version = brackets.version = 'v2.4.2'
	
	  return _tmpl
	
	})()
	
	/*
	  lib/browser/tag/mkdom.js
	
	  Includes hacks needed for the Internet Explorer version 9 and below
	  See: http://kangax.github.io/compat-table/es5/#ie8
	       http://codeplanet.io/dropping-ie8/
	*/
	var mkdom = (function _mkdom() {
	  var
	    reHasYield  = /<yield\b/i,
	    reYieldAll  = /<yield\s*(?:\/>|>([\S\s]*?)<\/yield\s*>|>)/ig,
	    reYieldSrc  = /<yield\s+to=['"]([^'">]*)['"]\s*>([\S\s]*?)<\/yield\s*>/ig,
	    reYieldDest = /<yield\s+from=['"]?([-\w]+)['"]?\s*(?:\/>|>([\S\s]*?)<\/yield\s*>)/ig
	  var
	    rootEls = { tr: 'tbody', th: 'tr', td: 'tr', col: 'colgroup' },
	    tblTags = IE_VERSION && IE_VERSION < 10
	      ? SPECIAL_TAGS_REGEX : /^(?:t(?:body|head|foot|[rhd])|caption|col(?:group)?)$/
	
	  /**
	   * Creates a DOM element to wrap the given content. Normally an `DIV`, but can be
	   * also a `TABLE`, `SELECT`, `TBODY`, `TR`, or `COLGROUP` element.
	   *
	   * @param   {string} templ  - The template coming from the custom tag definition
	   * @param   {string} [html] - HTML content that comes from the DOM element where you
	   *           will mount the tag, mostly the original tag in the page
	   * @returns {HTMLElement} DOM element with _templ_ merged through `YIELD` with the _html_.
	   */
	  function _mkdom(templ, html) {
	    var
	      match   = templ && templ.match(/^\s*<([-\w]+)/),
	      tagName = match && match[1].toLowerCase(),
	      el = mkEl('div', isSVGTag(tagName))
	
	    // replace all the yield tags with the tag inner html
	    templ = replaceYield(templ, html)
	
	    /* istanbul ignore next */
	    if (tblTags.test(tagName))
	      el = specialTags(el, templ, tagName)
	    else
	      setInnerHTML(el, templ)
	
	    el.stub = true
	
	    return el
	  }
	
	  /*
	    Creates the root element for table or select child elements:
	    tr/th/td/thead/tfoot/tbody/caption/col/colgroup/option/optgroup
	  */
	  function specialTags(el, templ, tagName) {
	    var
	      select = tagName[0] === 'o',
	      parent = select ? 'select>' : 'table>'
	
	    // trim() is important here, this ensures we don't have artifacts,
	    // so we can check if we have only one element inside the parent
	    el.innerHTML = '<' + parent + templ.trim() + '</' + parent
	    parent = el.firstChild
	
	    // returns the immediate parent if tr/th/td/col is the only element, if not
	    // returns the whole tree, as this can include additional elements
	    if (select) {
	      parent.selectedIndex = -1  // for IE9, compatible w/current riot behavior
	    } else {
	      // avoids insertion of cointainer inside container (ex: tbody inside tbody)
	      var tname = rootEls[tagName]
	      if (tname && parent.childElementCount === 1) parent = $(tname, parent)
	    }
	    return parent
	  }
	
	  /*
	    Replace the yield tag from any tag template with the innerHTML of the
	    original tag in the page
	  */
	  function replaceYield(templ, html) {
	    // do nothing if no yield
	    if (!reHasYield.test(templ)) return templ
	
	    // be careful with #1343 - string on the source having `$1`
	    var src = {}
	
	    html = html && html.replace(reYieldSrc, function (_, ref, text) {
	      src[ref] = src[ref] || text   // preserve first definition
	      return ''
	    }).trim()
	
	    return templ
	      .replace(reYieldDest, function (_, ref, def) {  // yield with from - to attrs
	        return src[ref] || def || ''
	      })
	      .replace(reYieldAll, function (_, def) {        // yield without any "from"
	        return html || def || ''
	      })
	  }
	
	  return _mkdom
	
	})()
	
	/**
	 * Convert the item looped into an object used to extend the child tag properties
	 * @param   { Object } expr - object containing the keys used to extend the children tags
	 * @param   { * } key - value to assign to the new object returned
	 * @param   { * } val - value containing the position of the item in the array
	 * @returns { Object } - new object containing the values of the original item
	 *
	 * The variables 'key' and 'val' are arbitrary.
	 * They depend on the collection type looped (Array, Object)
	 * and on the expression used on the each tag
	 *
	 */
	function mkitem(expr, key, val) {
	  var item = {}
	  item[expr.key] = key
	  if (expr.pos) item[expr.pos] = val
	  return item
	}
	
	/**
	 * Unmount the redundant tags
	 * @param   { Array } items - array containing the current items to loop
	 * @param   { Array } tags - array containing all the children tags
	 */
	function unmountRedundant(items, tags) {
	
	  var i = tags.length,
	    j = items.length,
	    t
	
	  while (i > j) {
	    t = tags[--i]
	    tags.splice(i, 1)
	    t.unmount()
	  }
	}
	
	/**
	 * Move the nested custom tags in non custom loop tags
	 * @param   { Object } child - non custom loop tag
	 * @param   { Number } i - current position of the loop tag
	 */
	function moveNestedTags(child, i) {
	  Object.keys(child.tags).forEach(function(tagName) {
	    var tag = child.tags[tagName]
	    if (isArray(tag))
	      each(tag, function (t) {
	        moveChildTag(t, tagName, i)
	      })
	    else
	      moveChildTag(tag, tagName, i)
	  })
	}
	
	/**
	 * Adds the elements for a virtual tag
	 * @param { Tag } tag - the tag whose root's children will be inserted or appended
	 * @param { Node } src - the node that will do the inserting or appending
	 * @param { Tag } target - only if inserting, insert before this tag's first child
	 */
	function addVirtual(tag, src, target) {
	  var el = tag._root, sib
	  tag._virts = []
	  while (el) {
	    sib = el.nextSibling
	    if (target)
	      src.insertBefore(el, target._root)
	    else
	      src.appendChild(el)
	
	    tag._virts.push(el) // hold for unmounting
	    el = sib
	  }
	}
	
	/**
	 * Move virtual tag and all child nodes
	 * @param { Tag } tag - first child reference used to start move
	 * @param { Node } src  - the node that will do the inserting
	 * @param { Tag } target - insert before this tag's first child
	 * @param { Number } len - how many child nodes to move
	 */
	function moveVirtual(tag, src, target, len) {
	  var el = tag._root, sib, i = 0
	  for (; i < len; i++) {
	    sib = el.nextSibling
	    src.insertBefore(el, target._root)
	    el = sib
	  }
	}
	
	
	/**
	 * Manage tags having the 'each'
	 * @param   { Object } dom - DOM node we need to loop
	 * @param   { Tag } parent - parent tag instance where the dom node is contained
	 * @param   { String } expr - string contained in the 'each' attribute
	 */
	function _each(dom, parent, expr) {
	
	  // remove the each property from the original tag
	  remAttr(dom, 'each')
	
	  var mustReorder = typeof getAttr(dom, 'no-reorder') !== T_STRING || remAttr(dom, 'no-reorder'),
	    tagName = getTagName(dom),
	    impl = __tagImpl[tagName] || { tmpl: getOuterHTML(dom) },
	    useRoot = SPECIAL_TAGS_REGEX.test(tagName),
	    root = dom.parentNode,
	    ref = document.createTextNode(''),
	    child = getTag(dom),
	    isOption = tagName.toLowerCase() === 'option', // the option tags must be treated differently
	    tags = [],
	    oldItems = [],
	    hasKeys,
	    isVirtual = dom.tagName == 'VIRTUAL'
	
	  // parse the each expression
	  expr = tmpl.loopKeys(expr)
	
	  // insert a marked where the loop tags will be injected
	  root.insertBefore(ref, dom)
	
	  // clean template code
	  parent.one('before-mount', function () {
	
	    // remove the original DOM node
	    dom.parentNode.removeChild(dom)
	    if (root.stub) root = parent.root
	
	  }).on('update', function () {
	    // get the new items collection
	    var items = tmpl(expr.val, parent),
	      // create a fragment to hold the new DOM nodes to inject in the parent tag
	      frag = document.createDocumentFragment()
	
	    // object loop. any changes cause full redraw
	    if (!isArray(items)) {
	      hasKeys = items || false
	      items = hasKeys ?
	        Object.keys(items).map(function (key) {
	          return mkitem(expr, key, items[key])
	        }) : []
	    }
	
	    // loop all the new items
	    var i = 0,
	      itemsLength = items.length
	
	    for (; i < itemsLength; i++) {
	      // reorder only if the items are objects
	      var
	        item = items[i],
	        _mustReorder = mustReorder && typeof item == T_OBJECT && !hasKeys,
	        oldPos = oldItems.indexOf(item),
	        pos = ~oldPos && _mustReorder ? oldPos : i,
	        // does a tag exist in this position?
	        tag = tags[pos]
	
	      item = !hasKeys && expr.key ? mkitem(expr, item, i) : item
	
	      // new tag
	      if (
	        !_mustReorder && !tag // with no-reorder we just update the old tags
	        ||
	        _mustReorder && !~oldPos || !tag // by default we always try to reorder the DOM elements
	      ) {
	
	        tag = new Tag(impl, {
	          parent: parent,
	          isLoop: true,
	          hasImpl: !!__tagImpl[tagName],
	          root: useRoot ? root : dom.cloneNode(),
	          item: item
	        }, dom.innerHTML)
	
	        tag.mount()
	
	        if (isVirtual) tag._root = tag.root.firstChild // save reference for further moves or inserts
	        // this tag must be appended
	        if (i == tags.length || !tags[i]) { // fix 1581
	          if (isVirtual)
	            addVirtual(tag, frag)
	          else frag.appendChild(tag.root)
	        }
	        // this tag must be insert
	        else {
	          if (isVirtual)
	            addVirtual(tag, root, tags[i])
	          else root.insertBefore(tag.root, tags[i].root) // #1374 some browsers reset selected here
	          oldItems.splice(i, 0, item)
	        }
	
	        tags.splice(i, 0, tag)
	        pos = i // handled here so no move
	      } else tag.update(item, true)
	
	      // reorder the tag if it's not located in its previous position
	      if (
	        pos !== i && _mustReorder &&
	        tags[i] // fix 1581 unable to reproduce it in a test!
	      ) {
	        // update the DOM
	        if (isVirtual)
	          moveVirtual(tag, root, tags[i], dom.childNodes.length)
	        else if (tags[i].root.parentNode) root.insertBefore(tag.root, tags[i].root)
	        // update the position attribute if it exists
	        if (expr.pos)
	          tag[expr.pos] = i
	        // move the old tag instance
	        tags.splice(i, 0, tags.splice(pos, 1)[0])
	        // move the old item
	        oldItems.splice(i, 0, oldItems.splice(pos, 1)[0])
	        // if the loop tags are not custom
	        // we need to move all their custom tags into the right position
	        if (!child && tag.tags) moveNestedTags(tag, i)
	      }
	
	      // cache the original item to use it in the events bound to this node
	      // and its children
	      tag._item = item
	      // cache the real parent tag internally
	      defineProperty(tag, '_parent', parent)
	    }
	
	    // remove the redundant tags
	    unmountRedundant(items, tags)
	
	    // insert the new nodes
	    root.insertBefore(frag, ref)
	    if (isOption) {
	
	      // #1374 FireFox bug in <option selected={expression}>
	      if (FIREFOX && !root.multiple) {
	        for (var n = 0; n < root.length; n++) {
	          if (root[n].__riot1374) {
	            root.selectedIndex = n  // clear other options
	            delete root[n].__riot1374
	            break
	          }
	        }
	      }
	    }
	
	    // set the 'tags' property of the parent tag
	    // if child is 'undefined' it means that we don't need to set this property
	    // for example:
	    // we don't need store the `myTag.tags['div']` property if we are looping a div tag
	    // but we need to track the `myTag.tags['child']` property looping a custom child node named `child`
	    if (child) parent.tags[tagName] = tags
	
	    // clone the items array
	    oldItems = items.slice()
	
	  })
	
	}
	/**
	 * Object that will be used to inject and manage the css of every tag instance
	 */
	var styleManager = (function(_riot) {
	
	  if (!window) return { // skip injection on the server
	    add: function () {},
	    inject: function () {}
	  }
	
	  var styleNode = (function () {
	    // create a new style element with the correct type
	    var newNode = mkEl('style')
	    setAttr(newNode, 'type', 'text/css')
	
	    // replace any user node or insert the new one into the head
	    var userNode = $('style[type=riot]')
	    if (userNode) {
	      if (userNode.id) newNode.id = userNode.id
	      userNode.parentNode.replaceChild(newNode, userNode)
	    }
	    else document.getElementsByTagName('head')[0].appendChild(newNode)
	
	    return newNode
	  })()
	
	  // Create cache and shortcut to the correct property
	  var cssTextProp = styleNode.styleSheet,
	    stylesToInject = ''
	
	  // Expose the style node in a non-modificable property
	  Object.defineProperty(_riot, 'styleNode', {
	    value: styleNode,
	    writable: true
	  })
	
	  /**
	   * Public api
	   */
	  return {
	    /**
	     * Save a tag style to be later injected into DOM
	     * @param   { String } css [description]
	     */
	    add: function(css) {
	      stylesToInject += css
	    },
	    /**
	     * Inject all previously saved tag styles into DOM
	     * innerHTML seems slow: http://jsperf.com/riot-insert-style
	     */
	    inject: function() {
	      if (stylesToInject) {
	        if (cssTextProp) cssTextProp.cssText += stylesToInject
	        else styleNode.innerHTML += stylesToInject
	        stylesToInject = ''
	      }
	    }
	  }
	
	})(riot)
	
	
	function parseNamedElements(root, tag, childTags, forceParsingNamed) {
	
	  walk(root, function(dom) {
	    if (dom.nodeType == 1) {
	      dom.isLoop = dom.isLoop ||
	                  (dom.parentNode && dom.parentNode.isLoop || getAttr(dom, 'each'))
	                    ? 1 : 0
	
	      // custom child tag
	      if (childTags) {
	        var child = getTag(dom)
	
	        if (child && !dom.isLoop)
	          childTags.push(initChildTag(child, {root: dom, parent: tag}, dom.innerHTML, tag))
	      }
	
	      if (!dom.isLoop || forceParsingNamed)
	        setNamed(dom, tag, [])
	    }
	
	  })
	
	}
	
	function parseExpressions(root, tag, expressions) {
	
	  function addExpr(dom, val, extra) {
	    if (tmpl.hasExpr(val)) {
	      expressions.push(extend({ dom: dom, expr: val }, extra))
	    }
	  }
	
	  walk(root, function(dom) {
	    var type = dom.nodeType,
	      attr
	
	    // text node
	    if (type == 3 && dom.parentNode.tagName != 'STYLE') addExpr(dom, dom.nodeValue)
	    if (type != 1) return
	
	    /* element */
	
	    // loop
	    attr = getAttr(dom, 'each')
	
	    if (attr) { _each(dom, tag, attr); return false }
	
	    // attribute expressions
	    each(dom.attributes, function(attr) {
	      var name = attr.name,
	        bool = name.split('__')[1]
	
	      addExpr(dom, attr.value, { attr: bool || name, bool: bool })
	      if (bool) { remAttr(dom, name); return false }
	
	    })
	
	    // skip custom tags
	    if (getTag(dom)) return false
	
	  })
	
	}
	function Tag(impl, conf, innerHTML) {
	
	  var self = riot.observable(this),
	    opts = inherit(conf.opts) || {},
	    parent = conf.parent,
	    isLoop = conf.isLoop,
	    hasImpl = conf.hasImpl,
	    item = cleanUpData(conf.item),
	    expressions = [],
	    childTags = [],
	    root = conf.root,
	    tagName = root.tagName.toLowerCase(),
	    attr = {},
	    propsInSyncWithParent = [],
	    dom
	
	  // only call unmount if we have a valid __tagImpl (has name property)
	  if (impl.name && root._tag) root._tag.unmount(true)
	
	  // not yet mounted
	  this.isMounted = false
	  root.isLoop = isLoop
	
	  // keep a reference to the tag just created
	  // so we will be able to mount this tag multiple times
	  root._tag = this
	
	  // create a unique id to this tag
	  // it could be handy to use it also to improve the virtual dom rendering speed
	  defineProperty(this, '_riot_id', ++__uid) // base 1 allows test !t._riot_id
	
	  extend(this, { parent: parent, root: root, opts: opts}, item)
	  // protect the "tags" property from being overridden
	  defineProperty(this, 'tags', {})
	
	  // grab attributes
	  each(root.attributes, function(el) {
	    var val = el.value
	    // remember attributes with expressions only
	    if (tmpl.hasExpr(val)) attr[el.name] = val
	  })
	
	  dom = mkdom(impl.tmpl, innerHTML)
	
	  // options
	  function updateOpts() {
	    var ctx = hasImpl && isLoop ? self : parent || self
	
	    // update opts from current DOM attributes
	    each(root.attributes, function(el) {
	      var val = el.value
	      opts[toCamel(el.name)] = tmpl.hasExpr(val) ? tmpl(val, ctx) : val
	    })
	    // recover those with expressions
	    each(Object.keys(attr), function(name) {
	      opts[toCamel(name)] = tmpl(attr[name], ctx)
	    })
	  }
	
	  function normalizeData(data) {
	    for (var key in item) {
	      if (typeof self[key] !== T_UNDEF && isWritable(self, key))
	        self[key] = data[key]
	    }
	  }
	
	  function inheritFrom(target) {
	    each(Object.keys(target), function(k) {
	      // some properties must be always in sync with the parent tag
	      var mustSync = !RESERVED_WORDS_BLACKLIST.test(k) && contains(propsInSyncWithParent, k)
	
	      if (typeof self[k] === T_UNDEF || mustSync) {
	        // track the property to keep in sync
	        // so we can keep it updated
	        if (!mustSync) propsInSyncWithParent.push(k)
	        self[k] = target[k]
	      }
	    })
	  }
	
	  /**
	   * Update the tag expressions and options
	   * @param   { * }  data - data we want to use to extend the tag properties
	   * @param   { Boolean } isInherited - is this update coming from a parent tag?
	   * @returns { self }
	   */
	  defineProperty(this, 'update', function(data, isInherited) {
	
	    // make sure the data passed will not override
	    // the component core methods
	    data = cleanUpData(data)
	    // inherit properties from the parent in loop
	    if (isLoop) {
	      inheritFrom(self.parent)
	    }
	    // normalize the tag properties in case an item object was initially passed
	    if (data && isObject(item)) {
	      normalizeData(data)
	      item = data
	    }
	    extend(self, data)
	    updateOpts()
	    self.trigger('update', data)
	    update(expressions, self)
	
	    // the updated event will be triggered
	    // once the DOM will be ready and all the re-flows are completed
	    // this is useful if you want to get the "real" root properties
	    // 4 ex: root.offsetWidth ...
	    if (isInherited && self.parent)
	      // closes #1599
	      self.parent.one('updated', function() { self.trigger('updated') })
	    else rAF(function() { self.trigger('updated') })
	
	    return this
	  })
	
	  defineProperty(this, 'mixin', function() {
	    each(arguments, function(mix) {
	      var instance,
	        props = [],
	        obj
	
	      mix = typeof mix === T_STRING ? riot.mixin(mix) : mix
	
	      // check if the mixin is a function
	      if (isFunction(mix)) {
	        // create the new mixin instance
	        instance = new mix()
	      } else instance = mix
	
	      var proto = Object.getPrototypeOf(instance)
	
	      // build multilevel prototype inheritance chain property list
	      do props = props.concat(Object.getOwnPropertyNames(obj || instance))
	      while (obj = Object.getPrototypeOf(obj || instance))
	
	      // loop the keys in the function prototype or the all object keys
	      each(props, function(key) {
	        // bind methods to self
	        // allow mixins to override other properties/parent mixins
	        if (key != 'init') {
	          // check for getters/setters
	          var descriptor = Object.getOwnPropertyDescriptor(instance, key) || Object.getOwnPropertyDescriptor(proto, key)
	          var hasGetterSetter = descriptor && (descriptor.get || descriptor.set)
	
	          // apply method only if it does not already exist on the instance
	          if (!self.hasOwnProperty(key) && hasGetterSetter) {
	            Object.defineProperty(self, key, descriptor)
	          } else {
	            self[key] = isFunction(instance[key]) ?
	              instance[key].bind(self) :
	              instance[key]
	          }
	        }
	      })
	
	      // init method will be called automatically
	      if (instance.init) instance.init.bind(self)()
	    })
	    return this
	  })
	
	  defineProperty(this, 'mount', function() {
	
	    updateOpts()
	
	    // add global mixins
	    var globalMixin = riot.mixin(GLOBAL_MIXIN)
	
	    if (globalMixin)
	      for (var i in globalMixin)
	        if (globalMixin.hasOwnProperty(i))
	          self.mixin(globalMixin[i])
	
	    // children in loop should inherit from true parent
	    if (self._parent && self._parent.root.isLoop) {
	      inheritFrom(self._parent)
	    }
	
	    // initialiation
	    if (impl.fn) impl.fn.call(self, opts)
	
	    // parse layout after init. fn may calculate args for nested custom tags
	    parseExpressions(dom, self, expressions)
	
	    // mount the child tags
	    toggle(true)
	
	    // update the root adding custom attributes coming from the compiler
	    // it fixes also #1087
	    if (impl.attrs)
	      walkAttributes(impl.attrs, function (k, v) { setAttr(root, k, v) })
	    if (impl.attrs || hasImpl)
	      parseExpressions(self.root, self, expressions)
	
	    if (!self.parent || isLoop) self.update(item)
	
	    // internal use only, fixes #403
	    self.trigger('before-mount')
	
	    if (isLoop && !hasImpl) {
	      // update the root attribute for the looped elements
	      root = dom.firstChild
	    } else {
	      while (dom.firstChild) root.appendChild(dom.firstChild)
	      if (root.stub) root = parent.root
	    }
	
	    defineProperty(self, 'root', root)
	
	    // parse the named dom nodes in the looped child
	    // adding them to the parent as well
	    if (isLoop)
	      parseNamedElements(self.root, self.parent, null, true)
	
	    // if it's not a child tag we can trigger its mount event
	    if (!self.parent || self.parent.isMounted) {
	      self.isMounted = true
	      self.trigger('mount')
	    }
	    // otherwise we need to wait that the parent event gets triggered
	    else self.parent.one('mount', function() {
	      // avoid to trigger the `mount` event for the tags
	      // not visible included in an if statement
	      if (!isInStub(self.root)) {
	        self.parent.isMounted = self.isMounted = true
	        self.trigger('mount')
	      }
	    })
	  })
	
	
	  defineProperty(this, 'unmount', function(keepRootTag) {
	    var el = root,
	      p = el.parentNode,
	      ptag,
	      tagIndex = __virtualDom.indexOf(self)
	
	    self.trigger('before-unmount')
	
	    // remove this tag instance from the global virtualDom variable
	    if (~tagIndex)
	      __virtualDom.splice(tagIndex, 1)
	
	    if (p) {
	
	      if (parent) {
	        ptag = getImmediateCustomParentTag(parent)
	        // remove this tag from the parent tags object
	        // if there are multiple nested tags with same name..
	        // remove this element form the array
	        if (isArray(ptag.tags[tagName]))
	          each(ptag.tags[tagName], function(tag, i) {
	            if (tag._riot_id == self._riot_id)
	              ptag.tags[tagName].splice(i, 1)
	          })
	        else
	          // otherwise just delete the tag instance
	          ptag.tags[tagName] = undefined
	      }
	
	      else
	        while (el.firstChild) el.removeChild(el.firstChild)
	
	      if (!keepRootTag)
	        p.removeChild(el)
	      else {
	        // the riot-tag and the data-is attributes aren't needed anymore, remove them
	        remAttr(p, RIOT_TAG_IS)
	        remAttr(p, RIOT_TAG) // this will be removed in riot 3.0.0
	      }
	
	    }
	
	    if (this._virts) {
	      each(this._virts, function(v) {
	        if (v.parentNode) v.parentNode.removeChild(v)
	      })
	    }
	
	    self.trigger('unmount')
	    toggle()
	    self.off('*')
	    self.isMounted = false
	    delete root._tag
	
	  })
	
	  // proxy function to bind updates
	  // dispatched from a parent tag
	  function onChildUpdate(data) { self.update(data, true) }
	
	  function toggle(isMount) {
	
	    // mount/unmount children
	    each(childTags, function(child) { child[isMount ? 'mount' : 'unmount']() })
	
	    // listen/unlisten parent (events flow one way from parent to children)
	    if (!parent) return
	    var evt = isMount ? 'on' : 'off'
	
	    // the loop tags will be always in sync with the parent automatically
	    if (isLoop)
	      parent[evt]('unmount', self.unmount)
	    else {
	      parent[evt]('update', onChildUpdate)[evt]('unmount', self.unmount)
	    }
	  }
	
	
	  // named elements available for fn
	  parseNamedElements(dom, this, childTags)
	
	}
	/**
	 * Attach an event to a DOM node
	 * @param { String } name - event name
	 * @param { Function } handler - event callback
	 * @param { Object } dom - dom node
	 * @param { Tag } tag - tag instance
	 */
	function setEventHandler(name, handler, dom, tag) {
	
	  dom[name] = function(e) {
	
	    var ptag = tag._parent,
	      item = tag._item,
	      el
	
	    if (!item)
	      while (ptag && !item) {
	        item = ptag._item
	        ptag = ptag._parent
	      }
	
	    // cross browser event fix
	    e = e || window.event
	
	    // override the event properties
	    if (isWritable(e, 'currentTarget')) e.currentTarget = dom
	    if (isWritable(e, 'target')) e.target = e.srcElement
	    if (isWritable(e, 'which')) e.which = e.charCode || e.keyCode
	
	    e.item = item
	
	    // prevent default behaviour (by default)
	    if (handler.call(tag, e) !== true && !/radio|check/.test(dom.type)) {
	      if (e.preventDefault) e.preventDefault()
	      e.returnValue = false
	    }
	
	    if (!e.preventUpdate) {
	      el = item ? getImmediateCustomParentTag(ptag) : tag
	      el.update()
	    }
	
	  }
	
	}
	
	
	/**
	 * Insert a DOM node replacing another one (used by if- attribute)
	 * @param   { Object } root - parent node
	 * @param   { Object } node - node replaced
	 * @param   { Object } before - node added
	 */
	function insertTo(root, node, before) {
	  if (!root) return
	  root.insertBefore(before, node)
	  root.removeChild(node)
	}
	
	/**
	 * Update the expressions in a Tag instance
	 * @param   { Array } expressions - expression that must be re evaluated
	 * @param   { Tag } tag - tag instance
	 */
	function update(expressions, tag) {
	
	  each(expressions, function(expr, i) {
	
	    var dom = expr.dom,
	      attrName = expr.attr,
	      value = tmpl(expr.expr, tag),
	      parent = expr.parent || expr.dom.parentNode
	
	    if (expr.bool) {
	      value = !!value
	    } else if (value == null) {
	      value = ''
	    }
	
	    // #1638: regression of #1612, update the dom only if the value of the
	    // expression was changed
	    if (expr.value === value) {
	      return
	    }
	    expr.value = value
	
	    // textarea and text nodes has no attribute name
	    if (!attrName) {
	      // about #815 w/o replace: the browser converts the value to a string,
	      // the comparison by "==" does too, but not in the server
	      value += ''
	      // test for parent avoids error with invalid assignment to nodeValue
	      if (parent) {
	        // cache the parent node because somehow it will become null on IE
	        // on the next iteration
	        expr.parent = parent
	        if (parent.tagName === 'TEXTAREA') {
	          parent.value = value                    // #1113
	          if (!IE_VERSION) dom.nodeValue = value  // #1625 IE throws here, nodeValue
	        }                                         // will be available on 'updated'
	        else dom.nodeValue = value
	      }
	      return
	    }
	
	    // ~~#1612: look for changes in dom.value when updating the value~~
	    if (attrName === 'value') {
	      if (dom.value !== value) {
	        dom.value = value
	        setAttr(dom, attrName, value)
	      }
	      return
	    } else {
	      // remove original attribute
	      remAttr(dom, attrName)
	    }
	
	    // event handler
	    if (isFunction(value)) {
	      setEventHandler(attrName, value, dom, tag)
	
	    // if- conditional
	    } else if (attrName == 'if') {
	      var stub = expr.stub,
	        add = function() { insertTo(stub.parentNode, stub, dom) },
	        remove = function() { insertTo(dom.parentNode, dom, stub) }
	
	      // add to DOM
	      if (value) {
	        if (stub) {
	          add()
	          dom.inStub = false
	          // avoid to trigger the mount event if the tags is not visible yet
	          // maybe we can optimize this avoiding to mount the tag at all
	          if (!isInStub(dom)) {
	            walk(dom, function(el) {
	              if (el._tag && !el._tag.isMounted)
	                el._tag.isMounted = !!el._tag.trigger('mount')
	            })
	          }
	        }
	      // remove from DOM
	      } else {
	        stub = expr.stub = stub || document.createTextNode('')
	        // if the parentNode is defined we can easily replace the tag
	        if (dom.parentNode)
	          remove()
	        // otherwise we need to wait the updated event
	        else (tag.parent || tag).one('updated', remove)
	
	        dom.inStub = true
	      }
	    // show / hide
	    } else if (attrName === 'show') {
	      dom.style.display = value ? '' : 'none'
	
	    } else if (attrName === 'hide') {
	      dom.style.display = value ? 'none' : ''
	
	    } else if (expr.bool) {
	      dom[attrName] = value
	      if (value) setAttr(dom, attrName, attrName)
	      if (FIREFOX && attrName === 'selected' && dom.tagName === 'OPTION') {
	        dom.__riot1374 = value   // #1374
	      }
	
	    } else if (value === 0 || value && typeof value !== T_OBJECT) {
	      // <img src="{ expr }">
	      if (startsWith(attrName, RIOT_PREFIX) && attrName != RIOT_TAG) {
	        attrName = attrName.slice(RIOT_PREFIX.length)
	      }
	      setAttr(dom, attrName, value)
	    }
	
	  })
	
	}
	/**
	 * Specialized function for looping an array-like collection with `each={}`
	 * @param   { Array } els - collection of items
	 * @param   {Function} fn - callback function
	 * @returns { Array } the array looped
	 */
	function each(els, fn) {
	  var len = els ? els.length : 0
	
	  for (var i = 0, el; i < len; i++) {
	    el = els[i]
	    // return false -> current item was removed by fn during the loop
	    if (el != null && fn(el, i) === false) i--
	  }
	  return els
	}
	
	/**
	 * Detect if the argument passed is a function
	 * @param   { * } v - whatever you want to pass to this function
	 * @returns { Boolean } -
	 */
	function isFunction(v) {
	  return typeof v === T_FUNCTION || false   // avoid IE problems
	}
	
	/**
	 * Get the outer html of any DOM node SVGs included
	 * @param   { Object } el - DOM node to parse
	 * @returns { String } el.outerHTML
	 */
	function getOuterHTML(el) {
	  if (el.outerHTML) return el.outerHTML
	  // some browsers do not support outerHTML on the SVGs tags
	  else {
	    var container = mkEl('div')
	    container.appendChild(el.cloneNode(true))
	    return container.innerHTML
	  }
	}
	
	/**
	 * Set the inner html of any DOM node SVGs included
	 * @param { Object } container - DOM node where we will inject the new html
	 * @param { String } html - html to inject
	 */
	function setInnerHTML(container, html) {
	  if (typeof container.innerHTML != T_UNDEF) container.innerHTML = html
	  // some browsers do not support innerHTML on the SVGs tags
	  else {
	    var doc = new DOMParser().parseFromString(html, 'application/xml')
	    container.appendChild(
	      container.ownerDocument.importNode(doc.documentElement, true)
	    )
	  }
	}
	
	/**
	 * Checks wether a DOM node must be considered part of an svg document
	 * @param   { String }  name - tag name
	 * @returns { Boolean } -
	 */
	function isSVGTag(name) {
	  return ~SVG_TAGS_LIST.indexOf(name)
	}
	
	/**
	 * Detect if the argument passed is an object, exclude null.
	 * NOTE: Use isObject(x) && !isArray(x) to excludes arrays.
	 * @param   { * } v - whatever you want to pass to this function
	 * @returns { Boolean } -
	 */
	function isObject(v) {
	  return v && typeof v === T_OBJECT         // typeof null is 'object'
	}
	
	/**
	 * Remove any DOM attribute from a node
	 * @param   { Object } dom - DOM node we want to update
	 * @param   { String } name - name of the property we want to remove
	 */
	function remAttr(dom, name) {
	  dom.removeAttribute(name)
	}
	
	/**
	 * Convert a string containing dashes to camel case
	 * @param   { String } string - input string
	 * @returns { String } my-string -> myString
	 */
	function toCamel(string) {
	  return string.replace(/-(\w)/g, function(_, c) {
	    return c.toUpperCase()
	  })
	}
	
	/**
	 * Get the value of any DOM attribute on a node
	 * @param   { Object } dom - DOM node we want to parse
	 * @param   { String } name - name of the attribute we want to get
	 * @returns { String | undefined } name of the node attribute whether it exists
	 */
	function getAttr(dom, name) {
	  return dom.getAttribute(name)
	}
	
	/**
	 * Set any DOM/SVG attribute
	 * @param { Object } dom - DOM node we want to update
	 * @param { String } name - name of the property we want to set
	 * @param { String } val - value of the property we want to set
	 */
	function setAttr(dom, name, val) {
	  var xlink = XLINK_REGEX.exec(name)
	  if (xlink && xlink[1])
	    dom.setAttributeNS(XLINK_NS, xlink[1], val)
	  else
	    dom.setAttribute(name, val)
	}
	
	/**
	 * Detect the tag implementation by a DOM node
	 * @param   { Object } dom - DOM node we need to parse to get its tag implementation
	 * @returns { Object } it returns an object containing the implementation of a custom tag (template and boot function)
	 */
	function getTag(dom) {
	  return dom.tagName && __tagImpl[getAttr(dom, RIOT_TAG_IS) ||
	    getAttr(dom, RIOT_TAG) || dom.tagName.toLowerCase()]
	}
	/**
	 * Add a child tag to its parent into the `tags` object
	 * @param   { Object } tag - child tag instance
	 * @param   { String } tagName - key where the new tag will be stored
	 * @param   { Object } parent - tag instance where the new child tag will be included
	 */
	function addChildTag(tag, tagName, parent) {
	  var cachedTag = parent.tags[tagName]
	
	  // if there are multiple children tags having the same name
	  if (cachedTag) {
	    // if the parent tags property is not yet an array
	    // create it adding the first cached tag
	    if (!isArray(cachedTag))
	      // don't add the same tag twice
	      if (cachedTag !== tag)
	        parent.tags[tagName] = [cachedTag]
	    // add the new nested tag to the array
	    if (!contains(parent.tags[tagName], tag))
	      parent.tags[tagName].push(tag)
	  } else {
	    parent.tags[tagName] = tag
	  }
	}
	
	/**
	 * Move the position of a custom tag in its parent tag
	 * @param   { Object } tag - child tag instance
	 * @param   { String } tagName - key where the tag was stored
	 * @param   { Number } newPos - index where the new tag will be stored
	 */
	function moveChildTag(tag, tagName, newPos) {
	  var parent = tag.parent,
	    tags
	  // no parent no move
	  if (!parent) return
	
	  tags = parent.tags[tagName]
	
	  if (isArray(tags))
	    tags.splice(newPos, 0, tags.splice(tags.indexOf(tag), 1)[0])
	  else addChildTag(tag, tagName, parent)
	}
	
	/**
	 * Create a new child tag including it correctly into its parent
	 * @param   { Object } child - child tag implementation
	 * @param   { Object } opts - tag options containing the DOM node where the tag will be mounted
	 * @param   { String } innerHTML - inner html of the child node
	 * @param   { Object } parent - instance of the parent tag including the child custom tag
	 * @returns { Object } instance of the new child tag just created
	 */
	function initChildTag(child, opts, innerHTML, parent) {
	  var tag = new Tag(child, opts, innerHTML),
	    tagName = getTagName(opts.root),
	    ptag = getImmediateCustomParentTag(parent)
	  // fix for the parent attribute in the looped elements
	  tag.parent = ptag
	  // store the real parent tag
	  // in some cases this could be different from the custom parent tag
	  // for example in nested loops
	  tag._parent = parent
	
	  // add this tag to the custom parent tag
	  addChildTag(tag, tagName, ptag)
	  // and also to the real parent tag
	  if (ptag !== parent)
	    addChildTag(tag, tagName, parent)
	  // empty the child node once we got its template
	  // to avoid that its children get compiled multiple times
	  opts.root.innerHTML = ''
	
	  return tag
	}
	
	/**
	 * Loop backward all the parents tree to detect the first custom parent tag
	 * @param   { Object } tag - a Tag instance
	 * @returns { Object } the instance of the first custom parent tag found
	 */
	function getImmediateCustomParentTag(tag) {
	  var ptag = tag
	  while (!getTag(ptag.root)) {
	    if (!ptag.parent) break
	    ptag = ptag.parent
	  }
	  return ptag
	}
	
	/**
	 * Helper function to set an immutable property
	 * @param   { Object } el - object where the new property will be set
	 * @param   { String } key - object key where the new property will be stored
	 * @param   { * } value - value of the new property
	* @param   { Object } options - set the propery overriding the default options
	 * @returns { Object } - the initial object
	 */
	function defineProperty(el, key, value, options) {
	  Object.defineProperty(el, key, extend({
	    value: value,
	    enumerable: false,
	    writable: false,
	    configurable: true
	  }, options))
	  return el
	}
	
	/**
	 * Get the tag name of any DOM node
	 * @param   { Object } dom - DOM node we want to parse
	 * @returns { String } name to identify this dom node in riot
	 */
	function getTagName(dom) {
	  var child = getTag(dom),
	    namedTag = getAttr(dom, 'name'),
	    tagName = namedTag && !tmpl.hasExpr(namedTag) ?
	                namedTag :
	              child ? child.name : dom.tagName.toLowerCase()
	
	  return tagName
	}
	
	/**
	 * Extend any object with other properties
	 * @param   { Object } src - source object
	 * @returns { Object } the resulting extended object
	 *
	 * var obj = { foo: 'baz' }
	 * extend(obj, {bar: 'bar', foo: 'bar'})
	 * console.log(obj) => {bar: 'bar', foo: 'bar'}
	 *
	 */
	function extend(src) {
	  var obj, args = arguments
	  for (var i = 1; i < args.length; ++i) {
	    if (obj = args[i]) {
	      for (var key in obj) {
	        // check if this property of the source object could be overridden
	        if (isWritable(src, key))
	          src[key] = obj[key]
	      }
	    }
	  }
	  return src
	}
	
	/**
	 * Check whether an array contains an item
	 * @param   { Array } arr - target array
	 * @param   { * } item - item to test
	 * @returns { Boolean } Does 'arr' contain 'item'?
	 */
	function contains(arr, item) {
	  return ~arr.indexOf(item)
	}
	
	/**
	 * Check whether an object is a kind of array
	 * @param   { * } a - anything
	 * @returns {Boolean} is 'a' an array?
	 */
	function isArray(a) { return Array.isArray(a) || a instanceof Array }
	
	/**
	 * Detect whether a property of an object could be overridden
	 * @param   { Object }  obj - source object
	 * @param   { String }  key - object property
	 * @returns { Boolean } is this property writable?
	 */
	function isWritable(obj, key) {
	  var props = Object.getOwnPropertyDescriptor(obj, key)
	  return typeof obj[key] === T_UNDEF || props && props.writable
	}
	
	
	/**
	 * With this function we avoid that the internal Tag methods get overridden
	 * @param   { Object } data - options we want to use to extend the tag instance
	 * @returns { Object } clean object without containing the riot internal reserved words
	 */
	function cleanUpData(data) {
	  if (!(data instanceof Tag) && !(data && typeof data.trigger == T_FUNCTION))
	    return data
	
	  var o = {}
	  for (var key in data) {
	    if (!RESERVED_WORDS_BLACKLIST.test(key)) o[key] = data[key]
	  }
	  return o
	}
	
	/**
	 * Walk down recursively all the children tags starting dom node
	 * @param   { Object }   dom - starting node where we will start the recursion
	 * @param   { Function } fn - callback to transform the child node just found
	 */
	function walk(dom, fn) {
	  if (dom) {
	    // stop the recursion
	    if (fn(dom) === false) return
	    else {
	      dom = dom.firstChild
	
	      while (dom) {
	        walk(dom, fn)
	        dom = dom.nextSibling
	      }
	    }
	  }
	}
	
	/**
	 * Minimize risk: only zero or one _space_ between attr & value
	 * @param   { String }   html - html string we want to parse
	 * @param   { Function } fn - callback function to apply on any attribute found
	 */
	function walkAttributes(html, fn) {
	  var m,
	    re = /([-\w]+) ?= ?(?:"([^"]*)|'([^']*)|({[^}]*}))/g
	
	  while (m = re.exec(html)) {
	    fn(m[1].toLowerCase(), m[2] || m[3] || m[4])
	  }
	}
	
	/**
	 * Check whether a DOM node is in stub mode, useful for the riot 'if' directive
	 * @param   { Object }  dom - DOM node we want to parse
	 * @returns { Boolean } -
	 */
	function isInStub(dom) {
	  while (dom) {
	    if (dom.inStub) return true
	    dom = dom.parentNode
	  }
	  return false
	}
	
	/**
	 * Create a generic DOM node
	 * @param   { String } name - name of the DOM node we want to create
	 * @param   { Boolean } isSvg - should we use a SVG as parent node?
	 * @returns { Object } DOM node just created
	 */
	function mkEl(name, isSvg) {
	  return isSvg ?
	    document.createElementNS('http://www.w3.org/2000/svg', 'svg') :
	    document.createElement(name)
	}
	
	/**
	 * Shorter and fast way to select multiple nodes in the DOM
	 * @param   { String } selector - DOM selector
	 * @param   { Object } ctx - DOM node where the targets of our search will is located
	 * @returns { Object } dom nodes found
	 */
	function $$(selector, ctx) {
	  return (ctx || document).querySelectorAll(selector)
	}
	
	/**
	 * Shorter and fast way to select a single node in the DOM
	 * @param   { String } selector - unique dom selector
	 * @param   { Object } ctx - DOM node where the target of our search will is located
	 * @returns { Object } dom node found
	 */
	function $(selector, ctx) {
	  return (ctx || document).querySelector(selector)
	}
	
	/**
	 * Simple object prototypal inheritance
	 * @param   { Object } parent - parent object
	 * @returns { Object } child instance
	 */
	function inherit(parent) {
	  return Object.create(parent || null)
	}
	
	/**
	 * Get the name property needed to identify a DOM node in riot
	 * @param   { Object } dom - DOM node we need to parse
	 * @returns { String | undefined } give us back a string to identify this dom node
	 */
	function getNamedKey(dom) {
	  return getAttr(dom, 'id') || getAttr(dom, 'name')
	}
	
	/**
	 * Set the named properties of a tag element
	 * @param { Object } dom - DOM node we need to parse
	 * @param { Object } parent - tag instance where the named dom element will be eventually added
	 * @param { Array } keys - list of all the tag instance properties
	 */
	function setNamed(dom, parent, keys) {
	  // get the key value we want to add to the tag instance
	  var key = getNamedKey(dom),
	    isArr,
	    // add the node detected to a tag instance using the named property
	    add = function(value) {
	      // avoid to override the tag properties already set
	      if (contains(keys, key)) return
	      // check whether this value is an array
	      isArr = isArray(value)
	      // if the key was never set
	      if (!value)
	        // set it once on the tag instance
	        parent[key] = dom
	      // if it was an array and not yet set
	      else if (!isArr || isArr && !contains(value, dom)) {
	        // add the dom node into the array
	        if (isArr)
	          value.push(dom)
	        else
	          parent[key] = [value, dom]
	      }
	    }
	
	  // skip the elements with no named properties
	  if (!key) return
	
	  // check whether this key has been already evaluated
	  if (tmpl.hasExpr(key))
	    // wait the first updated event only once
	    parent.one('mount', function() {
	      key = getNamedKey(dom)
	      add(parent[key])
	    })
	  else
	    add(parent[key])
	
	}
	
	/**
	 * Faster String startsWith alternative
	 * @param   { String } src - source string
	 * @param   { String } str - test string
	 * @returns { Boolean } -
	 */
	function startsWith(src, str) {
	  return src.slice(0, str.length) === str
	}
	
	/**
	 * requestAnimationFrame function
	 * Adapted from https://gist.github.com/paulirish/1579671, license MIT
	 */
	var rAF = (function (w) {
	  var raf = w.requestAnimationFrame    ||
	            w.mozRequestAnimationFrame || w.webkitRequestAnimationFrame
	
	  if (!raf || /iP(ad|hone|od).*OS 6/.test(w.navigator.userAgent)) {  // buggy iOS6
	    var lastTime = 0
	
	    raf = function (cb) {
	      var nowtime = Date.now(), timeout = Math.max(16 - (nowtime - lastTime), 0)
	      setTimeout(function () { cb(lastTime = nowtime + timeout) }, timeout)
	    }
	  }
	  return raf
	
	})(window || {})
	
	/**
	 * Mount a tag creating new Tag instance
	 * @param   { Object } root - dom node where the tag will be mounted
	 * @param   { String } tagName - name of the riot tag we want to mount
	 * @param   { Object } opts - options to pass to the Tag instance
	 * @returns { Tag } a new Tag instance
	 */
	function mountTo(root, tagName, opts) {
	  var tag = __tagImpl[tagName],
	    // cache the inner HTML to fix #855
	    innerHTML = root._innerHTML = root._innerHTML || root.innerHTML
	
	  // clear the inner html
	  root.innerHTML = ''
	
	  if (tag && root) tag = new Tag(tag, { root: root, opts: opts }, innerHTML)
	
	  if (tag && tag.mount) {
	    tag.mount()
	    // add this tag to the virtualDom variable
	    if (!contains(__virtualDom, tag)) __virtualDom.push(tag)
	  }
	
	  return tag
	}
	/**
	 * Riot public api
	 */
	
	// share methods for other riot parts, e.g. compiler
	riot.util = { brackets: brackets, tmpl: tmpl }
	
	/**
	 * Create a mixin that could be globally shared across all the tags
	 */
	riot.mixin = (function() {
	  var mixins = {},
	    globals = mixins[GLOBAL_MIXIN] = {},
	    _id = 0
	
	  /**
	   * Create/Return a mixin by its name
	   * @param   { String }  name - mixin name (global mixin if object)
	   * @param   { Object }  mixin - mixin logic
	   * @param   { Boolean } g - is global?
	   * @returns { Object }  the mixin logic
	   */
	  return function(name, mixin, g) {
	    // Unnamed global
	    if (isObject(name)) {
	      riot.mixin('__unnamed_'+_id++, name, true)
	      return
	    }
	
	    var store = g ? globals : mixins
	
	    // Getter
	    if (!mixin) {
	      if (typeof store[name] === T_UNDEF) {
	        throw new Error('Unregistered mixin: ' + name)
	      }
	      return store[name]
	    }
	    // Setter
	    if (isFunction(mixin)) {
	      extend(mixin.prototype, store[name] || {})
	      store[name] = mixin
	    }
	    else {
	      store[name] = extend(store[name] || {}, mixin)
	    }
	  }
	
	})()
	
	/**
	 * Create a new riot tag implementation
	 * @param   { String }   name - name/id of the new riot tag
	 * @param   { String }   html - tag template
	 * @param   { String }   css - custom tag css
	 * @param   { String }   attrs - root tag attributes
	 * @param   { Function } fn - user function
	 * @returns { String } name/id of the tag just created
	 */
	riot.tag = function(name, html, css, attrs, fn) {
	  if (isFunction(attrs)) {
	    fn = attrs
	    if (/^[\w\-]+\s?=/.test(css)) {
	      attrs = css
	      css = ''
	    } else attrs = ''
	  }
	  if (css) {
	    if (isFunction(css)) fn = css
	    else styleManager.add(css)
	  }
	  name = name.toLowerCase()
	  __tagImpl[name] = { name: name, tmpl: html, attrs: attrs, fn: fn }
	  return name
	}
	
	/**
	 * Create a new riot tag implementation (for use by the compiler)
	 * @param   { String }   name - name/id of the new riot tag
	 * @param   { String }   html - tag template
	 * @param   { String }   css - custom tag css
	 * @param   { String }   attrs - root tag attributes
	 * @param   { Function } fn - user function
	 * @returns { String } name/id of the tag just created
	 */
	riot.tag2 = function(name, html, css, attrs, fn) {
	  if (css) styleManager.add(css)
	  //if (bpair) riot.settings.brackets = bpair
	  __tagImpl[name] = { name: name, tmpl: html, attrs: attrs, fn: fn }
	  return name
	}
	
	/**
	 * Mount a tag using a specific tag implementation
	 * @param   { String } selector - tag DOM selector
	 * @param   { String } tagName - tag implementation name
	 * @param   { Object } opts - tag logic
	 * @returns { Array } new tags instances
	 */
	riot.mount = function(selector, tagName, opts) {
	
	  var els,
	    allTags,
	    tags = []
	
	  // helper functions
	
	  function addRiotTags(arr) {
	    var list = ''
	    each(arr, function (e) {
	      if (!/[^-\w]/.test(e)) {
	        e = e.trim().toLowerCase()
	        list += ',[' + RIOT_TAG_IS + '="' + e + '"],[' + RIOT_TAG + '="' + e + '"]'
	      }
	    })
	    return list
	  }
	
	  function selectAllTags() {
	    var keys = Object.keys(__tagImpl)
	    return keys + addRiotTags(keys)
	  }
	
	  function pushTags(root) {
	    if (root.tagName) {
	      var riotTag = getAttr(root, RIOT_TAG_IS) || getAttr(root, RIOT_TAG)
	
	      // have tagName? force riot-tag to be the same
	      if (tagName && riotTag !== tagName) {
	        riotTag = tagName
	        setAttr(root, RIOT_TAG_IS, tagName)
	        setAttr(root, RIOT_TAG, tagName) // this will be removed in riot 3.0.0
	      }
	      var tag = mountTo(root, riotTag || root.tagName.toLowerCase(), opts)
	
	      if (tag) tags.push(tag)
	    } else if (root.length) {
	      each(root, pushTags)   // assume nodeList
	    }
	  }
	
	  // ----- mount code -----
	
	  // inject styles into DOM
	  styleManager.inject()
	
	  if (isObject(tagName)) {
	    opts = tagName
	    tagName = 0
	  }
	
	  // crawl the DOM to find the tag
	  if (typeof selector === T_STRING) {
	    if (selector === '*')
	      // select all the tags registered
	      // and also the tags found with the riot-tag attribute set
	      selector = allTags = selectAllTags()
	    else
	      // or just the ones named like the selector
	      selector += addRiotTags(selector.split(/, */))
	
	    // make sure to pass always a selector
	    // to the querySelectorAll function
	    els = selector ? $$(selector) : []
	  }
	  else
	    // probably you have passed already a tag or a NodeList
	    els = selector
	
	  // select all the registered and mount them inside their root elements
	  if (tagName === '*') {
	    // get all custom tags
	    tagName = allTags || selectAllTags()
	    // if the root els it's just a single tag
	    if (els.tagName)
	      els = $$(tagName, els)
	    else {
	      // select all the children for all the different root elements
	      var nodeList = []
	      each(els, function (_el) {
	        nodeList.push($$(tagName, _el))
	      })
	      els = nodeList
	    }
	    // get rid of the tagName
	    tagName = 0
	  }
	
	  pushTags(els)
	
	  return tags
	}
	
	/**
	 * Update all the tags instances created
	 * @returns { Array } all the tags instances
	 */
	riot.update = function() {
	  return each(__virtualDom, function(tag) {
	    tag.update()
	  })
	}
	
	/**
	 * Export the Virtual DOM
	 */
	riot.vdom = __virtualDom
	
	/**
	 * Export the Tag constructor
	 */
	riot.Tag = Tag
	  // support CommonJS, AMD & browser
	  /* istanbul ignore next */
	  if (typeof exports === T_OBJECT)
	    module.exports = riot
	  else if ("function" === T_FUNCTION && typeof __webpack_require__(2) !== T_UNDEF)
	    !(__WEBPACK_AMD_DEFINE_RESULT__ = function() { return riot }.call(exports, __webpack_require__, exports, module), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__))
	  else
	    window.riot = riot
	
	})(typeof window != 'undefined' ? window : void 0);


/***/ },
/* 2 */
/***/ function(module, exports) {

	/* WEBPACK VAR INJECTION */(function(__webpack_amd_options__) {module.exports = __webpack_amd_options__;
	
	/* WEBPACK VAR INJECTION */}.call(exports, {}))

/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(riot) {'use strict';
	
	__webpack_require__(4);
	__webpack_require__(5);
	__webpack_require__(6);
	__webpack_require__(7);
	__webpack_require__(8);
	
	riot.route('/', function () {
		__webpack_require__(9);
		__webpack_require__(16);
		riot.mount('route', 'home');
	});
	
	module.exports = {
		start: function start() {
			riot.route.start(true);
		}
	};
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(1)))

/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(riot) {'use strict';
	
	riot.tag2('home', '<navbar></navbar> <next></next> <btn-icon icons="{[\'fork\', \'knife\']}" text="今日の献立" scroller="{scrollerOpts}"></btn-icon> <menu-list year="{year}" month="{month}"></menu-list> <div style="height: 3000px; width: 10px; background: #fee"></div> <div id="today">Target</div> <div style="height: 3000px; width: 10px; background: #fee"></div> <credit></credit>', 'home .btn,[riot-tag="home"] .btn,[data-is="home"] .btn{ display: block; width: 98%; height: 40px; margin: 10px auto; position: relative; border: 1px solid #ccc; border-radius: 15px; background-image: -webkit-linear-gradient(#fdfdfd, #f1f1f1); background-image: -o-linear-gradient(#fdfdfd, #f1f1f1); background-image: linear-gradient(#fdfdfd, #f1f1f1); box-shadow: 0 2px 3px #ccc; line-height: 40px; color: #2e3436; text-decoration: none; text-align: center; font-weight: bold; font-size: 100%; outline: none; cursor: pointer; -webkit-tap-highlight-color: transparent !important; } home .btn:hover,[riot-tag="home"] .btn:hover,[data-is="home"] .btn:hover{ background-image: -webkit-linear-gradient(#f8f8f8, #e1e1e1); background-image: -o-linear-gradient(#f8f8f8, #e1e1e1); background-image: linear-gradient(#f8f8f8, #e1e1e1); } home .btn:active,[riot-tag="home"] .btn:active,[data-is="home"] .btn:active{ background-image: -webkit-linear-gradient(#d1d1d1, #dfdfdf); background-image: -o-linear-gradient(#d1d1d1, #dfdfdf); background-image: linear-gradient(#d1d1d1, #dfdfdf); } home .btn .icon,[riot-tag="home"] .btn .icon,[data-is="home"] .btn .icon{ position: absolute; top: 0; left: 5px; width: 40px; height: 40px; line-height: 40px; text-align: center; font-size: 25px; color: #939393; } home .btn .icon > span:nth-child(2),[riot-tag="home"] .btn .icon > span:nth-child(2),[data-is="home"] .btn .icon > span:nth-child(2){ margin-left: 5px; }', '', function (opts) {
	    var self = this;
	
	    var d = new Date();
	    self.year = d.getFullYear();
	    self.month = d.getMonth() + 1;
	
	    self.scrollerOpts = {
	        target: 'today',
	        duration: 1000,
	        offset: -300
	    };
	
	    obs.trigger('getMenu:req');
	    obs.on('getMenu:res', function (data) {
	        self.menu = data;
	    });
	});
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(1)))

/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(riot) {'use strict';
	
	riot.tag2('navbar', '<header class="navbar"> <div class="left"> <button type="button" class="navbar-btn-icon"><span class="ion-ios-calendar-outline"></span></button> </div> <h1>デジタル版 白鳥寮献立表</h1> </header>', 'navbar .navbar,[riot-tag="navbar"] .navbar,[data-is="navbar"] .navbar{ position: relative; width: 100%; height: 40px; border-bottom: 1px solid #b3b3b3; background-image: -webkit-linear-gradient(#f0f0f0, #ddd); background-image: -o-linear-gradient(#f0f0f0, #ddd); background-image: linear-gradient(#f0f0f0, #ddd); } navbar .navbar h1,[riot-tag="navbar"] .navbar h1,[data-is="navbar"] .navbar h1{ margin: 0 auto; font-size: 16px; text-shadow: 1px 1px 0 #fff; text-align: center; line-height: 40px; color: #3e3e3e; cursor: default; } navbar .navbar .left,[riot-tag="navbar"] .navbar .left,[data-is="navbar"] .navbar .left{ position: absolute; left: 0; top: 0; }', '', function (opts) {});
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(1)))

/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(riot) {'use strict';
	
	riot.tag2('credit', '<footer class="global-footer"> <p>このサイトは非公認で勝手に運営しています</p> </footer>', 'credit .global-footer,[riot-tag="credit"] .global-footer,[data-is="credit"] .global-footer{ width: 100%; height: 40px; border-top: 1px solid #b3b3b3; background-image: -webkit-linear-gradient(#ddd, #f0f0f0); background-image: -o-linear-gradient(#ddd, #f0f0f0); background-image: linear-gradient(#ddd, #f0f0f0); } credit .global-footer p,[riot-tag="credit"] .global-footer p,[data-is="credit"] .global-footer p{ text-align: center; text-shadow: 1px 1px 0 #fff; font-size: 14px; line-height: 40px; color: #3e3e3e; cursor: default; }', '', function (opts) {});
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(1)))

/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(riot) {'use strict';
	
	riot.tag2('btn-icon', '<button type="button" onclick="{onClick}" class="btn"><span class="icon"><span each="{icon in opts.icons}" class="ion-{icon}"></span></span>{opts.text}</button>', '', '', function (opts) {
	    this.onClick = function () {
	        // スムーススクロール
	        if (opts.scroller) {
	            if (!opts.scroller.target) return;
	            var target = opts.scroller.target;
	            var duration = opts.scroller.duration || 200;
	            var offset = opts.scroller.offset;
	            var callback = opts.scroller.callback;
	            var $target = document.getElementById(target);
	            if (!$target) return;
	            var pos = $target.getBoundingClientRect().top + offset;
	            var pageY = window.pageYOffset;
	            var pageX = window.pageXOffset;
	            // アニメーション
	            var start = new Date();
	            var step = function step() {
	                var progress = new Date() - start;
	                if (progress < duration) {
	                    requestAnimationFrame(step);
	                } else {
	                    if (progress != duration) {
	                        progress = duration;
	                    }
	                    if (typeof callback === 'function') {
	                        callback();
	                    }
	                }
	                window.scrollTo(pageX, pageY + pos * (progress / duration));
	            };
	            requestAnimationFrame(step);
	        }
	    };
	});
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(1)))

/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(riot) {'use strict';
	
	riot.tag2('menu-list', '', '', '', function (opts) {
	  var self = this;
	
	  self.year = opts.year;
	  self.month = opts.month;
	
	  obs.on('getMenu:res', function (data) {});
	});
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(1)))

/***/ },
/* 9 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(riot) {'use strict';
	
	riot.tag2('next', '<div class="next-menu"> <curfew></curfew> <div class="time">{time}<span class="small">の献立</span></div> <div if="{loading}" class="loader"></div> <div if="{!loading}"> <ol if="{menu.state == \'OK\'}" class="menu-list"> <li if="{timeId != 3}" class="main">{menu.main[0]}<span if="{menu.main[1]}"> / {menu.main[1]}</span></li> <li if="{timeId == 3}" class="main dinnerA">{menu.main[0]}</li> <li if="{timeId == 3}" class="main dinnerB">{menu.main[1]}</li> <li each="{item in menu.sides}" class="side">{item}</li> </ol> <div if="{menu.state == \'event\'}" class="event"> <p class="title">{menu.main[0]}</p> <p if="{menu.main[1]}" class="text">{menu.main[1]}</p> </div> <div if="{menu.state == \'notfound\' || !menu.state}" class="notfound"><i class="ion-coffee icon"></i> <p class="text">献立を取得できませんでした</p> </div> </div> </div>', 'next .next-menu,[riot-tag="next"] .next-menu,[data-is="next"] .next-menu{ position: relative; margin: 10px 3px 20px; border: 1px solid #aaa; background: #fff; box-shadow: 0 6px 3px -4px #bbb; box-sizing: border-box; text-align: center; } next .next-menu .time,[riot-tag="next"] .next-menu .time,[data-is="next"] .next-menu .time{ padding: 8px 0; border-bottom: 1px solid #ccc; background: #ddd; color: #252521; } next .next-menu .time .small,[riot-tag="next"] .next-menu .time .small,[data-is="next"] .next-menu .time .small{ margin-left: 5px; font-size: 16px; color: #454545; } next .next-menu .menu-list,[riot-tag="next"] .next-menu .menu-list,[data-is="next"] .next-menu .menu-list{ margin: 20px 12px; } next .next-menu .menu-list .main,[riot-tag="next"] .next-menu .menu-list .main,[data-is="next"] .next-menu .menu-list .main{ margin-bottom: 5px; font-size: 22px; } next .next-menu .menu-list .main.dinnerA::before,[riot-tag="next"] .next-menu .menu-list .main.dinnerA::before,[data-is="next"] .next-menu .menu-list .main.dinnerA::before,next .next-menu .menu-list .main.dinnerB::before,[riot-tag="next"] .next-menu .menu-list .main.dinnerB::before,[data-is="next"] .next-menu .menu-list .main.dinnerB::before{ position: relative; top: -2px; display: inline-block; width: 20px; height: 20px; margin-right: 5px; background: #222; line-height: 20px; text-align: center; font-size: 14px; color: #e9e9e9; } next .next-menu .menu-list .main.dinnerA::before,[riot-tag="next"] .next-menu .menu-list .main.dinnerA::before,[data-is="next"] .next-menu .menu-list .main.dinnerA::before{ content: "A"; } next .next-menu .menu-list .main.dinnerB::before,[riot-tag="next"] .next-menu .menu-list .main.dinnerB::before,[data-is="next"] .next-menu .menu-list .main.dinnerB::before{ content: "B"; } next .next-menu .menu-list .side,[riot-tag="next"] .next-menu .menu-list .side,[data-is="next"] .next-menu .menu-list .side{ margin-top: 8px; font-size: 16px; color: #444; } next .next-menu .event .title,[riot-tag="next"] .next-menu .event .title,[data-is="next"] .next-menu .event .title{ margin: 25px 0 30px; font-size: 50px; color: #222; } next .next-menu .event .text,[riot-tag="next"] .next-menu .event .text,[data-is="next"] .next-menu .event .text{ margin-bottom: 20px; font-size: 14px; letter-spacing: 0.18em; color: #555; } next .next-menu .notfound .icon,[riot-tag="next"] .next-menu .notfound .icon,[data-is="next"] .next-menu .notfound .icon{ display: block; margin: 25px 0 30px; font-size: 50px; color: #999; } next .next-menu .notfound .text,[riot-tag="next"] .next-menu .notfound .text,[data-is="next"] .next-menu .notfound .text{ margin-bottom: 20px; font-size: 13px; letter-spacing: 0.18em; color: #555; text-shadow: 1px 1px #bbb; }', '', function (opts) {
	    var self = this;
	
	    var d = new Date();
	    var hours = d.getHours();
	    var minutes = d.getMinutes();
	    var date = d.getDate();
	
	    var getToday = function getToday(data) {
	        for (var i = 0, len = data.length; i < len; i++) {
	            var item = data[i];
	            if (item.date % 100 === date) {
	                return item;
	            }
	        }
	        return 'notfound';
	    };
	
	    var getItem = function getItem(data, timeId) {
	        var today = getToday(data);
	        if (today === 'notfound') {
	            return today;
	        } else {
	            switch (timeId) {
	                // 朝の献立を返却
	                case 1:
	                    return {
	                        state: 'OK',
	                        main: today.m_main.split(','),
	                        sides: today.m_side.split(',')
	                    };
	                // 昼の献立を返却
	                case 2:
	                    return {
	                        state: 'OK',
	                        main: today.l_main.split(','),
	                        sides: today.l_side.split(',')
	                    };
	                // 夜の献立を返却
	                case 3:
	                    return {
	                        state: 'OK',
	                        main: today.d_main.split(','),
	                        sides: today.l_side.split(',')
	                    };
	            }
	        }
	    };
	
	    var getTime = function getTime(data) {
	        if (hours < 8 || hours == 8 && minutes <= 30) {
	            return { id: 1, label: '朝' };
	        } else if (hours < 12 || hours == 12 && minutes <= 50) {
	            return { id: 2, label: '昼' };
	        } else if (hours < 19 || hours == 19 && minutes <= 40) {
	            return { id: 3, label: '夜' };
	        } else {
	            return { id: 4, label: '明日 朝' };
	        }
	    };
	
	    var time = getTime();
	    self.time = time.label;
	    self.timeId = time.id;
	
	    self.loading = true;
	
	    obs.on('getMenu:res', function (data) {
	        if (data.status === 'notfound') {
	            self.menu = {
	                state: 'notfound'
	            };
	        } else {
	            self.menu = getItem(data, time.id);
	        }
	        self.loading = false;
	        riot.update();
	    });
	});
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(1)))

/***/ },
/* 10 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	
	var request = __webpack_require__(11);
	var d = new Date();
	var now = {
		year: d.getFullYear(),
		month: d.getMonth() + 1
	};
	
	module.exports = {
		get: function get(year, month) {
			year = year || now.year;
			month = month || now.month;
			return new Promise(function (resolve, reject) {
				request.get("http://163.44.175.114:4301/" + year + "/" + month).end(function (err, res) {
					if (err) {
						reject(err);
						return;
					}
					resolve(res.body);
				});
			});
		},
		search: function search(word, year, month) {
			year = year || now.year;
			month = month || now.month;
			return new Promise(function (resolve, reject) {
				request.get("http://163.44.175.114:4301/" + year + "/" + month + "/" + word).end(function (err, res) {
					if (err) {
						reject(err);
						return;
					}
					resolve(res.body);
				});
			});
		}
	};

/***/ },
/* 11 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Root reference for iframes.
	 */
	
	var root;
	if (typeof window !== 'undefined') { // Browser window
	  root = window;
	} else if (typeof self !== 'undefined') { // Web Worker
	  root = self;
	} else { // Other environments
	  console.warn("Using browser-only version of superagent in non-browser environment");
	  root = this;
	}
	
	var Emitter = __webpack_require__(12);
	var requestBase = __webpack_require__(13);
	var isObject = __webpack_require__(14);
	
	/**
	 * Noop.
	 */
	
	function noop(){};
	
	/**
	 * Expose `request`.
	 */
	
	var request = module.exports = __webpack_require__(15).bind(null, Request);
	
	/**
	 * Determine XHR.
	 */
	
	request.getXHR = function () {
	  if (root.XMLHttpRequest
	      && (!root.location || 'file:' != root.location.protocol
	          || !root.ActiveXObject)) {
	    return new XMLHttpRequest;
	  } else {
	    try { return new ActiveXObject('Microsoft.XMLHTTP'); } catch(e) {}
	    try { return new ActiveXObject('Msxml2.XMLHTTP.6.0'); } catch(e) {}
	    try { return new ActiveXObject('Msxml2.XMLHTTP.3.0'); } catch(e) {}
	    try { return new ActiveXObject('Msxml2.XMLHTTP'); } catch(e) {}
	  }
	  throw Error("Browser-only verison of superagent could not find XHR");
	};
	
	/**
	 * Removes leading and trailing whitespace, added to support IE.
	 *
	 * @param {String} s
	 * @return {String}
	 * @api private
	 */
	
	var trim = ''.trim
	  ? function(s) { return s.trim(); }
	  : function(s) { return s.replace(/(^\s*|\s*$)/g, ''); };
	
	/**
	 * Serialize the given `obj`.
	 *
	 * @param {Object} obj
	 * @return {String}
	 * @api private
	 */
	
	function serialize(obj) {
	  if (!isObject(obj)) return obj;
	  var pairs = [];
	  for (var key in obj) {
	    pushEncodedKeyValuePair(pairs, key, obj[key]);
	  }
	  return pairs.join('&');
	}
	
	/**
	 * Helps 'serialize' with serializing arrays.
	 * Mutates the pairs array.
	 *
	 * @param {Array} pairs
	 * @param {String} key
	 * @param {Mixed} val
	 */
	
	function pushEncodedKeyValuePair(pairs, key, val) {
	  if (val != null) {
	    if (Array.isArray(val)) {
	      val.forEach(function(v) {
	        pushEncodedKeyValuePair(pairs, key, v);
	      });
	    } else if (isObject(val)) {
	      for(var subkey in val) {
	        pushEncodedKeyValuePair(pairs, key + '[' + subkey + ']', val[subkey]);
	      }
	    } else {
	      pairs.push(encodeURIComponent(key)
	        + '=' + encodeURIComponent(val));
	    }
	  } else if (val === null) {
	    pairs.push(encodeURIComponent(key));
	  }
	}
	
	/**
	 * Expose serialization method.
	 */
	
	 request.serializeObject = serialize;
	
	 /**
	  * Parse the given x-www-form-urlencoded `str`.
	  *
	  * @param {String} str
	  * @return {Object}
	  * @api private
	  */
	
	function parseString(str) {
	  var obj = {};
	  var pairs = str.split('&');
	  var pair;
	  var pos;
	
	  for (var i = 0, len = pairs.length; i < len; ++i) {
	    pair = pairs[i];
	    pos = pair.indexOf('=');
	    if (pos == -1) {
	      obj[decodeURIComponent(pair)] = '';
	    } else {
	      obj[decodeURIComponent(pair.slice(0, pos))] =
	        decodeURIComponent(pair.slice(pos + 1));
	    }
	  }
	
	  return obj;
	}
	
	/**
	 * Expose parser.
	 */
	
	request.parseString = parseString;
	
	/**
	 * Default MIME type map.
	 *
	 *     superagent.types.xml = 'application/xml';
	 *
	 */
	
	request.types = {
	  html: 'text/html',
	  json: 'application/json',
	  xml: 'application/xml',
	  urlencoded: 'application/x-www-form-urlencoded',
	  'form': 'application/x-www-form-urlencoded',
	  'form-data': 'application/x-www-form-urlencoded'
	};
	
	/**
	 * Default serialization map.
	 *
	 *     superagent.serialize['application/xml'] = function(obj){
	 *       return 'generated xml here';
	 *     };
	 *
	 */
	
	 request.serialize = {
	   'application/x-www-form-urlencoded': serialize,
	   'application/json': JSON.stringify
	 };
	
	 /**
	  * Default parsers.
	  *
	  *     superagent.parse['application/xml'] = function(str){
	  *       return { object parsed from str };
	  *     };
	  *
	  */
	
	request.parse = {
	  'application/x-www-form-urlencoded': parseString,
	  'application/json': JSON.parse
	};
	
	/**
	 * Parse the given header `str` into
	 * an object containing the mapped fields.
	 *
	 * @param {String} str
	 * @return {Object}
	 * @api private
	 */
	
	function parseHeader(str) {
	  var lines = str.split(/\r?\n/);
	  var fields = {};
	  var index;
	  var line;
	  var field;
	  var val;
	
	  lines.pop(); // trailing CRLF
	
	  for (var i = 0, len = lines.length; i < len; ++i) {
	    line = lines[i];
	    index = line.indexOf(':');
	    field = line.slice(0, index).toLowerCase();
	    val = trim(line.slice(index + 1));
	    fields[field] = val;
	  }
	
	  return fields;
	}
	
	/**
	 * Check if `mime` is json or has +json structured syntax suffix.
	 *
	 * @param {String} mime
	 * @return {Boolean}
	 * @api private
	 */
	
	function isJSON(mime) {
	  return /[\/+]json\b/.test(mime);
	}
	
	/**
	 * Return the mime type for the given `str`.
	 *
	 * @param {String} str
	 * @return {String}
	 * @api private
	 */
	
	function type(str){
	  return str.split(/ *; */).shift();
	};
	
	/**
	 * Return header field parameters.
	 *
	 * @param {String} str
	 * @return {Object}
	 * @api private
	 */
	
	function params(str){
	  return str.split(/ *; */).reduce(function(obj, str){
	    var parts = str.split(/ *= */),
	        key = parts.shift(),
	        val = parts.shift();
	
	    if (key && val) obj[key] = val;
	    return obj;
	  }, {});
	};
	
	/**
	 * Initialize a new `Response` with the given `xhr`.
	 *
	 *  - set flags (.ok, .error, etc)
	 *  - parse header
	 *
	 * Examples:
	 *
	 *  Aliasing `superagent` as `request` is nice:
	 *
	 *      request = superagent;
	 *
	 *  We can use the promise-like API, or pass callbacks:
	 *
	 *      request.get('/').end(function(res){});
	 *      request.get('/', function(res){});
	 *
	 *  Sending data can be chained:
	 *
	 *      request
	 *        .post('/user')
	 *        .send({ name: 'tj' })
	 *        .end(function(res){});
	 *
	 *  Or passed to `.send()`:
	 *
	 *      request
	 *        .post('/user')
	 *        .send({ name: 'tj' }, function(res){});
	 *
	 *  Or passed to `.post()`:
	 *
	 *      request
	 *        .post('/user', { name: 'tj' })
	 *        .end(function(res){});
	 *
	 * Or further reduced to a single call for simple cases:
	 *
	 *      request
	 *        .post('/user', { name: 'tj' }, function(res){});
	 *
	 * @param {XMLHTTPRequest} xhr
	 * @param {Object} options
	 * @api private
	 */
	
	function Response(req, options) {
	  options = options || {};
	  this.req = req;
	  this.xhr = this.req.xhr;
	  // responseText is accessible only if responseType is '' or 'text' and on older browsers
	  this.text = ((this.req.method !='HEAD' && (this.xhr.responseType === '' || this.xhr.responseType === 'text')) || typeof this.xhr.responseType === 'undefined')
	     ? this.xhr.responseText
	     : null;
	  this.statusText = this.req.xhr.statusText;
	  this._setStatusProperties(this.xhr.status);
	  this.header = this.headers = parseHeader(this.xhr.getAllResponseHeaders());
	  // getAllResponseHeaders sometimes falsely returns "" for CORS requests, but
	  // getResponseHeader still works. so we get content-type even if getting
	  // other headers fails.
	  this.header['content-type'] = this.xhr.getResponseHeader('content-type');
	  this._setHeaderProperties(this.header);
	  this.body = this.req.method != 'HEAD'
	    ? this._parseBody(this.text ? this.text : this.xhr.response)
	    : null;
	}
	
	/**
	 * Get case-insensitive `field` value.
	 *
	 * @param {String} field
	 * @return {String}
	 * @api public
	 */
	
	Response.prototype.get = function(field){
	  return this.header[field.toLowerCase()];
	};
	
	/**
	 * Set header related properties:
	 *
	 *   - `.type` the content type without params
	 *
	 * A response of "Content-Type: text/plain; charset=utf-8"
	 * will provide you with a `.type` of "text/plain".
	 *
	 * @param {Object} header
	 * @api private
	 */
	
	Response.prototype._setHeaderProperties = function(header){
	  // content-type
	  var ct = this.header['content-type'] || '';
	  this.type = type(ct);
	
	  // params
	  var obj = params(ct);
	  for (var key in obj) this[key] = obj[key];
	};
	
	/**
	 * Parse the given body `str`.
	 *
	 * Used for auto-parsing of bodies. Parsers
	 * are defined on the `superagent.parse` object.
	 *
	 * @param {String} str
	 * @return {Mixed}
	 * @api private
	 */
	
	Response.prototype._parseBody = function(str){
	  var parse = request.parse[this.type];
	  if (!parse && isJSON(this.type)) {
	    parse = request.parse['application/json'];
	  }
	  return parse && str && (str.length || str instanceof Object)
	    ? parse(str)
	    : null;
	};
	
	/**
	 * Set flags such as `.ok` based on `status`.
	 *
	 * For example a 2xx response will give you a `.ok` of __true__
	 * whereas 5xx will be __false__ and `.error` will be __true__. The
	 * `.clientError` and `.serverError` are also available to be more
	 * specific, and `.statusType` is the class of error ranging from 1..5
	 * sometimes useful for mapping respond colors etc.
	 *
	 * "sugar" properties are also defined for common cases. Currently providing:
	 *
	 *   - .noContent
	 *   - .badRequest
	 *   - .unauthorized
	 *   - .notAcceptable
	 *   - .notFound
	 *
	 * @param {Number} status
	 * @api private
	 */
	
	Response.prototype._setStatusProperties = function(status){
	  // handle IE9 bug: http://stackoverflow.com/questions/10046972/msie-returns-status-code-of-1223-for-ajax-request
	  if (status === 1223) {
	    status = 204;
	  }
	
	  var type = status / 100 | 0;
	
	  // status / class
	  this.status = this.statusCode = status;
	  this.statusType = type;
	
	  // basics
	  this.info = 1 == type;
	  this.ok = 2 == type;
	  this.clientError = 4 == type;
	  this.serverError = 5 == type;
	  this.error = (4 == type || 5 == type)
	    ? this.toError()
	    : false;
	
	  // sugar
	  this.accepted = 202 == status;
	  this.noContent = 204 == status;
	  this.badRequest = 400 == status;
	  this.unauthorized = 401 == status;
	  this.notAcceptable = 406 == status;
	  this.notFound = 404 == status;
	  this.forbidden = 403 == status;
	};
	
	/**
	 * Return an `Error` representative of this response.
	 *
	 * @return {Error}
	 * @api public
	 */
	
	Response.prototype.toError = function(){
	  var req = this.req;
	  var method = req.method;
	  var url = req.url;
	
	  var msg = 'cannot ' + method + ' ' + url + ' (' + this.status + ')';
	  var err = new Error(msg);
	  err.status = this.status;
	  err.method = method;
	  err.url = url;
	
	  return err;
	};
	
	/**
	 * Expose `Response`.
	 */
	
	request.Response = Response;
	
	/**
	 * Initialize a new `Request` with the given `method` and `url`.
	 *
	 * @param {String} method
	 * @param {String} url
	 * @api public
	 */
	
	function Request(method, url) {
	  var self = this;
	  this._query = this._query || [];
	  this.method = method;
	  this.url = url;
	  this.header = {}; // preserves header name case
	  this._header = {}; // coerces header names to lowercase
	  this.on('end', function(){
	    var err = null;
	    var res = null;
	
	    try {
	      res = new Response(self);
	    } catch(e) {
	      err = new Error('Parser is unable to parse the response');
	      err.parse = true;
	      err.original = e;
	      // issue #675: return the raw response if the response parsing fails
	      err.rawResponse = self.xhr && self.xhr.responseText ? self.xhr.responseText : null;
	      // issue #876: return the http status code if the response parsing fails
	      err.statusCode = self.xhr && self.xhr.status ? self.xhr.status : null;
	      return self.callback(err);
	    }
	
	    self.emit('response', res);
	
	    var new_err;
	    try {
	      if (res.status < 200 || res.status >= 300) {
	        new_err = new Error(res.statusText || 'Unsuccessful HTTP response');
	        new_err.original = err;
	        new_err.response = res;
	        new_err.status = res.status;
	      }
	    } catch(e) {
	      new_err = e; // #985 touching res may cause INVALID_STATE_ERR on old Android
	    }
	
	    // #1000 don't catch errors from the callback to avoid double calling it
	    if (new_err) {
	      self.callback(new_err, res);
	    } else {
	      self.callback(null, res);
	    }
	  });
	}
	
	/**
	 * Mixin `Emitter` and `requestBase`.
	 */
	
	Emitter(Request.prototype);
	for (var key in requestBase) {
	  Request.prototype[key] = requestBase[key];
	}
	
	/**
	 * Set Content-Type to `type`, mapping values from `request.types`.
	 *
	 * Examples:
	 *
	 *      superagent.types.xml = 'application/xml';
	 *
	 *      request.post('/')
	 *        .type('xml')
	 *        .send(xmlstring)
	 *        .end(callback);
	 *
	 *      request.post('/')
	 *        .type('application/xml')
	 *        .send(xmlstring)
	 *        .end(callback);
	 *
	 * @param {String} type
	 * @return {Request} for chaining
	 * @api public
	 */
	
	Request.prototype.type = function(type){
	  this.set('Content-Type', request.types[type] || type);
	  return this;
	};
	
	/**
	 * Set responseType to `val`. Presently valid responseTypes are 'blob' and
	 * 'arraybuffer'.
	 *
	 * Examples:
	 *
	 *      req.get('/')
	 *        .responseType('blob')
	 *        .end(callback);
	 *
	 * @param {String} val
	 * @return {Request} for chaining
	 * @api public
	 */
	
	Request.prototype.responseType = function(val){
	  this._responseType = val;
	  return this;
	};
	
	/**
	 * Set Accept to `type`, mapping values from `request.types`.
	 *
	 * Examples:
	 *
	 *      superagent.types.json = 'application/json';
	 *
	 *      request.get('/agent')
	 *        .accept('json')
	 *        .end(callback);
	 *
	 *      request.get('/agent')
	 *        .accept('application/json')
	 *        .end(callback);
	 *
	 * @param {String} accept
	 * @return {Request} for chaining
	 * @api public
	 */
	
	Request.prototype.accept = function(type){
	  this.set('Accept', request.types[type] || type);
	  return this;
	};
	
	/**
	 * Set Authorization field value with `user` and `pass`.
	 *
	 * @param {String} user
	 * @param {String} pass
	 * @param {Object} options with 'type' property 'auto' or 'basic' (default 'basic')
	 * @return {Request} for chaining
	 * @api public
	 */
	
	Request.prototype.auth = function(user, pass, options){
	  if (!options) {
	    options = {
	      type: 'basic'
	    }
	  }
	
	  switch (options.type) {
	    case 'basic':
	      var str = btoa(user + ':' + pass);
	      this.set('Authorization', 'Basic ' + str);
	    break;
	
	    case 'auto':
	      this.username = user;
	      this.password = pass;
	    break;
	  }
	  return this;
	};
	
	/**
	* Add query-string `val`.
	*
	* Examples:
	*
	*   request.get('/shoes')
	*     .query('size=10')
	*     .query({ color: 'blue' })
	*
	* @param {Object|String} val
	* @return {Request} for chaining
	* @api public
	*/
	
	Request.prototype.query = function(val){
	  if ('string' != typeof val) val = serialize(val);
	  if (val) this._query.push(val);
	  return this;
	};
	
	/**
	 * Queue the given `file` as an attachment to the specified `field`,
	 * with optional `filename`.
	 *
	 * ``` js
	 * request.post('/upload')
	 *   .attach('content', new Blob(['<a id="a"><b id="b">hey!</b></a>'], { type: "text/html"}))
	 *   .end(callback);
	 * ```
	 *
	 * @param {String} field
	 * @param {Blob|File} file
	 * @param {String} filename
	 * @return {Request} for chaining
	 * @api public
	 */
	
	Request.prototype.attach = function(field, file, filename){
	  this._getFormData().append(field, file, filename || file.name);
	  return this;
	};
	
	Request.prototype._getFormData = function(){
	  if (!this._formData) {
	    this._formData = new root.FormData();
	  }
	  return this._formData;
	};
	
	/**
	 * Invoke the callback with `err` and `res`
	 * and handle arity check.
	 *
	 * @param {Error} err
	 * @param {Response} res
	 * @api private
	 */
	
	Request.prototype.callback = function(err, res){
	  var fn = this._callback;
	  this.clearTimeout();
	  fn(err, res);
	};
	
	/**
	 * Invoke callback with x-domain error.
	 *
	 * @api private
	 */
	
	Request.prototype.crossDomainError = function(){
	  var err = new Error('Request has been terminated\nPossible causes: the network is offline, Origin is not allowed by Access-Control-Allow-Origin, the page is being unloaded, etc.');
	  err.crossDomain = true;
	
	  err.status = this.status;
	  err.method = this.method;
	  err.url = this.url;
	
	  this.callback(err);
	};
	
	/**
	 * Invoke callback with timeout error.
	 *
	 * @api private
	 */
	
	Request.prototype._timeoutError = function(){
	  var timeout = this._timeout;
	  var err = new Error('timeout of ' + timeout + 'ms exceeded');
	  err.timeout = timeout;
	  this.callback(err);
	};
	
	/**
	 * Compose querystring to append to req.url
	 *
	 * @api private
	 */
	
	Request.prototype._appendQueryString = function(){
	  var query = this._query.join('&');
	  if (query) {
	    this.url += ~this.url.indexOf('?')
	      ? '&' + query
	      : '?' + query;
	  }
	};
	
	/**
	 * Initiate request, invoking callback `fn(res)`
	 * with an instanceof `Response`.
	 *
	 * @param {Function} fn
	 * @return {Request} for chaining
	 * @api public
	 */
	
	Request.prototype.end = function(fn){
	  var self = this;
	  var xhr = this.xhr = request.getXHR();
	  var timeout = this._timeout;
	  var data = this._formData || this._data;
	
	  // store callback
	  this._callback = fn || noop;
	
	  // state change
	  xhr.onreadystatechange = function(){
	    if (4 != xhr.readyState) return;
	
	    // In IE9, reads to any property (e.g. status) off of an aborted XHR will
	    // result in the error "Could not complete the operation due to error c00c023f"
	    var status;
	    try { status = xhr.status } catch(e) { status = 0; }
	
	    if (0 == status) {
	      if (self.timedout) return self._timeoutError();
	      if (self._aborted) return;
	      return self.crossDomainError();
	    }
	    self.emit('end');
	  };
	
	  // progress
	  var handleProgress = function(direction, e) {
	    if (e.total > 0) {
	      e.percent = e.loaded / e.total * 100;
	    }
	    e.direction = direction;
	    self.emit('progress', e);
	  }
	  if (this.hasListeners('progress')) {
	    try {
	      xhr.onprogress = handleProgress.bind(null, 'download');
	      if (xhr.upload) {
	        xhr.upload.onprogress = handleProgress.bind(null, 'upload');
	      }
	    } catch(e) {
	      // Accessing xhr.upload fails in IE from a web worker, so just pretend it doesn't exist.
	      // Reported here:
	      // https://connect.microsoft.com/IE/feedback/details/837245/xmlhttprequest-upload-throws-invalid-argument-when-used-from-web-worker-context
	    }
	  }
	
	  // timeout
	  if (timeout && !this._timer) {
	    this._timer = setTimeout(function(){
	      self.timedout = true;
	      self.abort();
	    }, timeout);
	  }
	
	  // querystring
	  this._appendQueryString();
	
	  // initiate request
	  if (this.username && this.password) {
	    xhr.open(this.method, this.url, true, this.username, this.password);
	  } else {
	    xhr.open(this.method, this.url, true);
	  }
	
	  // CORS
	  if (this._withCredentials) xhr.withCredentials = true;
	
	  // body
	  if ('GET' != this.method && 'HEAD' != this.method && 'string' != typeof data && !this._isHost(data)) {
	    // serialize stuff
	    var contentType = this._header['content-type'];
	    var serialize = this._serializer || request.serialize[contentType ? contentType.split(';')[0] : ''];
	    if (!serialize && isJSON(contentType)) serialize = request.serialize['application/json'];
	    if (serialize) data = serialize(data);
	  }
	
	  // set header fields
	  for (var field in this.header) {
	    if (null == this.header[field]) continue;
	    xhr.setRequestHeader(field, this.header[field]);
	  }
	
	  if (this._responseType) {
	    xhr.responseType = this._responseType;
	  }
	
	  // send stuff
	  this.emit('request', this);
	
	  // IE11 xhr.send(undefined) sends 'undefined' string as POST payload (instead of nothing)
	  // We need null here if data is undefined
	  xhr.send(typeof data !== 'undefined' ? data : null);
	  return this;
	};
	
	
	/**
	 * Expose `Request`.
	 */
	
	request.Request = Request;
	
	/**
	 * GET `url` with optional callback `fn(res)`.
	 *
	 * @param {String} url
	 * @param {Mixed|Function} [data] or fn
	 * @param {Function} [fn]
	 * @return {Request}
	 * @api public
	 */
	
	request.get = function(url, data, fn){
	  var req = request('GET', url);
	  if ('function' == typeof data) fn = data, data = null;
	  if (data) req.query(data);
	  if (fn) req.end(fn);
	  return req;
	};
	
	/**
	 * HEAD `url` with optional callback `fn(res)`.
	 *
	 * @param {String} url
	 * @param {Mixed|Function} [data] or fn
	 * @param {Function} [fn]
	 * @return {Request}
	 * @api public
	 */
	
	request.head = function(url, data, fn){
	  var req = request('HEAD', url);
	  if ('function' == typeof data) fn = data, data = null;
	  if (data) req.send(data);
	  if (fn) req.end(fn);
	  return req;
	};
	
	/**
	 * OPTIONS query to `url` with optional callback `fn(res)`.
	 *
	 * @param {String} url
	 * @param {Mixed|Function} [data] or fn
	 * @param {Function} [fn]
	 * @return {Request}
	 * @api public
	 */
	
	request.options = function(url, data, fn){
	  var req = request('OPTIONS', url);
	  if ('function' == typeof data) fn = data, data = null;
	  if (data) req.send(data);
	  if (fn) req.end(fn);
	  return req;
	};
	
	/**
	 * DELETE `url` with optional callback `fn(res)`.
	 *
	 * @param {String} url
	 * @param {Function} [fn]
	 * @return {Request}
	 * @api public
	 */
	
	function del(url, fn){
	  var req = request('DELETE', url);
	  if (fn) req.end(fn);
	  return req;
	};
	
	request['del'] = del;
	request['delete'] = del;
	
	/**
	 * PATCH `url` with optional `data` and callback `fn(res)`.
	 *
	 * @param {String} url
	 * @param {Mixed} [data]
	 * @param {Function} [fn]
	 * @return {Request}
	 * @api public
	 */
	
	request.patch = function(url, data, fn){
	  var req = request('PATCH', url);
	  if ('function' == typeof data) fn = data, data = null;
	  if (data) req.send(data);
	  if (fn) req.end(fn);
	  return req;
	};
	
	/**
	 * POST `url` with optional `data` and callback `fn(res)`.
	 *
	 * @param {String} url
	 * @param {Mixed} [data]
	 * @param {Function} [fn]
	 * @return {Request}
	 * @api public
	 */
	
	request.post = function(url, data, fn){
	  var req = request('POST', url);
	  if ('function' == typeof data) fn = data, data = null;
	  if (data) req.send(data);
	  if (fn) req.end(fn);
	  return req;
	};
	
	/**
	 * PUT `url` with optional `data` and callback `fn(res)`.
	 *
	 * @param {String} url
	 * @param {Mixed|Function} [data] or fn
	 * @param {Function} [fn]
	 * @return {Request}
	 * @api public
	 */
	
	request.put = function(url, data, fn){
	  var req = request('PUT', url);
	  if ('function' == typeof data) fn = data, data = null;
	  if (data) req.send(data);
	  if (fn) req.end(fn);
	  return req;
	};


/***/ },
/* 12 */
/***/ function(module, exports, __webpack_require__) {

	
	/**
	 * Expose `Emitter`.
	 */
	
	if (true) {
	  module.exports = Emitter;
	}
	
	/**
	 * Initialize a new `Emitter`.
	 *
	 * @api public
	 */
	
	function Emitter(obj) {
	  if (obj) return mixin(obj);
	};
	
	/**
	 * Mixin the emitter properties.
	 *
	 * @param {Object} obj
	 * @return {Object}
	 * @api private
	 */
	
	function mixin(obj) {
	  for (var key in Emitter.prototype) {
	    obj[key] = Emitter.prototype[key];
	  }
	  return obj;
	}
	
	/**
	 * Listen on the given `event` with `fn`.
	 *
	 * @param {String} event
	 * @param {Function} fn
	 * @return {Emitter}
	 * @api public
	 */
	
	Emitter.prototype.on =
	Emitter.prototype.addEventListener = function(event, fn){
	  this._callbacks = this._callbacks || {};
	  (this._callbacks['$' + event] = this._callbacks['$' + event] || [])
	    .push(fn);
	  return this;
	};
	
	/**
	 * Adds an `event` listener that will be invoked a single
	 * time then automatically removed.
	 *
	 * @param {String} event
	 * @param {Function} fn
	 * @return {Emitter}
	 * @api public
	 */
	
	Emitter.prototype.once = function(event, fn){
	  function on() {
	    this.off(event, on);
	    fn.apply(this, arguments);
	  }
	
	  on.fn = fn;
	  this.on(event, on);
	  return this;
	};
	
	/**
	 * Remove the given callback for `event` or all
	 * registered callbacks.
	 *
	 * @param {String} event
	 * @param {Function} fn
	 * @return {Emitter}
	 * @api public
	 */
	
	Emitter.prototype.off =
	Emitter.prototype.removeListener =
	Emitter.prototype.removeAllListeners =
	Emitter.prototype.removeEventListener = function(event, fn){
	  this._callbacks = this._callbacks || {};
	
	  // all
	  if (0 == arguments.length) {
	    this._callbacks = {};
	    return this;
	  }
	
	  // specific event
	  var callbacks = this._callbacks['$' + event];
	  if (!callbacks) return this;
	
	  // remove all handlers
	  if (1 == arguments.length) {
	    delete this._callbacks['$' + event];
	    return this;
	  }
	
	  // remove specific handler
	  var cb;
	  for (var i = 0; i < callbacks.length; i++) {
	    cb = callbacks[i];
	    if (cb === fn || cb.fn === fn) {
	      callbacks.splice(i, 1);
	      break;
	    }
	  }
	  return this;
	};
	
	/**
	 * Emit `event` with the given args.
	 *
	 * @param {String} event
	 * @param {Mixed} ...
	 * @return {Emitter}
	 */
	
	Emitter.prototype.emit = function(event){
	  this._callbacks = this._callbacks || {};
	  var args = [].slice.call(arguments, 1)
	    , callbacks = this._callbacks['$' + event];
	
	  if (callbacks) {
	    callbacks = callbacks.slice(0);
	    for (var i = 0, len = callbacks.length; i < len; ++i) {
	      callbacks[i].apply(this, args);
	    }
	  }
	
	  return this;
	};
	
	/**
	 * Return array of callbacks for `event`.
	 *
	 * @param {String} event
	 * @return {Array}
	 * @api public
	 */
	
	Emitter.prototype.listeners = function(event){
	  this._callbacks = this._callbacks || {};
	  return this._callbacks['$' + event] || [];
	};
	
	/**
	 * Check if this emitter has `event` handlers.
	 *
	 * @param {String} event
	 * @return {Boolean}
	 * @api public
	 */
	
	Emitter.prototype.hasListeners = function(event){
	  return !! this.listeners(event).length;
	};


/***/ },
/* 13 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Module of mixed-in functions shared between node and client code
	 */
	var isObject = __webpack_require__(14);
	
	/**
	 * Clear previous timeout.
	 *
	 * @return {Request} for chaining
	 * @api public
	 */
	
	exports.clearTimeout = function _clearTimeout(){
	  this._timeout = 0;
	  clearTimeout(this._timer);
	  return this;
	};
	
	/**
	 * Override default response body parser
	 *
	 * This function will be called to convert incoming data into request.body
	 *
	 * @param {Function}
	 * @api public
	 */
	
	exports.parse = function parse(fn){
	  this._parser = fn;
	  return this;
	};
	
	/**
	 * Override default request body serializer
	 *
	 * This function will be called to convert data set via .send or .attach into payload to send
	 *
	 * @param {Function}
	 * @api public
	 */
	
	exports.serialize = function serialize(fn){
	  this._serializer = fn;
	  return this;
	};
	
	/**
	 * Set timeout to `ms`.
	 *
	 * @param {Number} ms
	 * @return {Request} for chaining
	 * @api public
	 */
	
	exports.timeout = function timeout(ms){
	  this._timeout = ms;
	  return this;
	};
	
	/**
	 * Promise support
	 *
	 * @param {Function} resolve
	 * @param {Function} reject
	 * @return {Request}
	 */
	
	exports.then = function then(resolve, reject) {
	  if (!this._fullfilledPromise) {
	    var self = this;
	    this._fullfilledPromise = new Promise(function(innerResolve, innerReject){
	      self.end(function(err, res){
	        if (err) innerReject(err); else innerResolve(res);
	      });
	    });
	  }
	  return this._fullfilledPromise.then(resolve, reject);
	}
	
	exports.catch = function(cb) {
	  return this.then(undefined, cb);
	};
	
	/**
	 * Allow for extension
	 */
	
	exports.use = function use(fn) {
	  fn(this);
	  return this;
	}
	
	
	/**
	 * Get request header `field`.
	 * Case-insensitive.
	 *
	 * @param {String} field
	 * @return {String}
	 * @api public
	 */
	
	exports.get = function(field){
	  return this._header[field.toLowerCase()];
	};
	
	/**
	 * Get case-insensitive header `field` value.
	 * This is a deprecated internal API. Use `.get(field)` instead.
	 *
	 * (getHeader is no longer used internally by the superagent code base)
	 *
	 * @param {String} field
	 * @return {String}
	 * @api private
	 * @deprecated
	 */
	
	exports.getHeader = exports.get;
	
	/**
	 * Set header `field` to `val`, or multiple fields with one object.
	 * Case-insensitive.
	 *
	 * Examples:
	 *
	 *      req.get('/')
	 *        .set('Accept', 'application/json')
	 *        .set('X-API-Key', 'foobar')
	 *        .end(callback);
	 *
	 *      req.get('/')
	 *        .set({ Accept: 'application/json', 'X-API-Key': 'foobar' })
	 *        .end(callback);
	 *
	 * @param {String|Object} field
	 * @param {String} val
	 * @return {Request} for chaining
	 * @api public
	 */
	
	exports.set = function(field, val){
	  if (isObject(field)) {
	    for (var key in field) {
	      this.set(key, field[key]);
	    }
	    return this;
	  }
	  this._header[field.toLowerCase()] = val;
	  this.header[field] = val;
	  return this;
	};
	
	/**
	 * Remove header `field`.
	 * Case-insensitive.
	 *
	 * Example:
	 *
	 *      req.get('/')
	 *        .unset('User-Agent')
	 *        .end(callback);
	 *
	 * @param {String} field
	 */
	exports.unset = function(field){
	  delete this._header[field.toLowerCase()];
	  delete this.header[field];
	  return this;
	};
	
	/**
	 * Write the field `name` and `val`, or multiple fields with one object
	 * for "multipart/form-data" request bodies.
	 *
	 * ``` js
	 * request.post('/upload')
	 *   .field('foo', 'bar')
	 *   .end(callback);
	 *
	 * request.post('/upload')
	 *   .field({ foo: 'bar', baz: 'qux' })
	 *   .end(callback);
	 * ```
	 *
	 * @param {String|Object} name
	 * @param {String|Blob|File|Buffer|fs.ReadStream} val
	 * @return {Request} for chaining
	 * @api public
	 */
	exports.field = function(name, val) {
	
	  // name should be either a string or an object.
	  if (null === name ||  undefined === name) {
	    throw new Error('.field(name, val) name can not be empty');
	  }
	
	  if (isObject(name)) {
	    for (var key in name) {
	      this.field(key, name[key]);
	    }
	    return this;
	  }
	
	  // val should be defined now
	  if (null === val || undefined === val) {
	    throw new Error('.field(name, val) val can not be empty');
	  }
	  this._getFormData().append(name, val);
	  return this;
	};
	
	/**
	 * Abort the request, and clear potential timeout.
	 *
	 * @return {Request}
	 * @api public
	 */
	exports.abort = function(){
	  if (this._aborted) {
	    return this;
	  }
	  this._aborted = true;
	  this.xhr && this.xhr.abort(); // browser
	  this.req && this.req.abort(); // node
	  this.clearTimeout();
	  this.emit('abort');
	  return this;
	};
	
	/**
	 * Enable transmission of cookies with x-domain requests.
	 *
	 * Note that for this to work the origin must not be
	 * using "Access-Control-Allow-Origin" with a wildcard,
	 * and also must set "Access-Control-Allow-Credentials"
	 * to "true".
	 *
	 * @api public
	 */
	
	exports.withCredentials = function(){
	  // This is browser-only functionality. Node side is no-op.
	  this._withCredentials = true;
	  return this;
	};
	
	/**
	 * Set the max redirects to `n`. Does noting in browser XHR implementation.
	 *
	 * @param {Number} n
	 * @return {Request} for chaining
	 * @api public
	 */
	
	exports.redirects = function(n){
	  this._maxRedirects = n;
	  return this;
	};
	
	/**
	 * Convert to a plain javascript object (not JSON string) of scalar properties.
	 * Note as this method is designed to return a useful non-this value,
	 * it cannot be chained.
	 *
	 * @return {Object} describing method, url, and data of this request
	 * @api public
	 */
	
	exports.toJSON = function(){
	  return {
	    method: this.method,
	    url: this.url,
	    data: this._data,
	    headers: this._header
	  };
	};
	
	/**
	 * Check if `obj` is a host object,
	 * we don't want to serialize these :)
	 *
	 * TODO: future proof, move to compoent land
	 *
	 * @param {Object} obj
	 * @return {Boolean}
	 * @api private
	 */
	
	exports._isHost = function _isHost(obj) {
	  var str = {}.toString.call(obj);
	
	  switch (str) {
	    case '[object File]':
	    case '[object Blob]':
	    case '[object FormData]':
	      return true;
	    default:
	      return false;
	  }
	}
	
	/**
	 * Send `data` as the request body, defaulting the `.type()` to "json" when
	 * an object is given.
	 *
	 * Examples:
	 *
	 *       // manual json
	 *       request.post('/user')
	 *         .type('json')
	 *         .send('{"name":"tj"}')
	 *         .end(callback)
	 *
	 *       // auto json
	 *       request.post('/user')
	 *         .send({ name: 'tj' })
	 *         .end(callback)
	 *
	 *       // manual x-www-form-urlencoded
	 *       request.post('/user')
	 *         .type('form')
	 *         .send('name=tj')
	 *         .end(callback)
	 *
	 *       // auto x-www-form-urlencoded
	 *       request.post('/user')
	 *         .type('form')
	 *         .send({ name: 'tj' })
	 *         .end(callback)
	 *
	 *       // defaults to x-www-form-urlencoded
	 *      request.post('/user')
	 *        .send('name=tobi')
	 *        .send('species=ferret')
	 *        .end(callback)
	 *
	 * @param {String|Object} data
	 * @return {Request} for chaining
	 * @api public
	 */
	
	exports.send = function(data){
	  var obj = isObject(data);
	  var type = this._header['content-type'];
	
	  // merge
	  if (obj && isObject(this._data)) {
	    for (var key in data) {
	      this._data[key] = data[key];
	    }
	  } else if ('string' == typeof data) {
	    // default to x-www-form-urlencoded
	    if (!type) this.type('form');
	    type = this._header['content-type'];
	    if ('application/x-www-form-urlencoded' == type) {
	      this._data = this._data
	        ? this._data + '&' + data
	        : data;
	    } else {
	      this._data = (this._data || '') + data;
	    }
	  } else {
	    this._data = data;
	  }
	
	  if (!obj || this._isHost(data)) return this;
	
	  // default to json
	  if (!type) this.type('json');
	  return this;
	};


/***/ },
/* 14 */
/***/ function(module, exports) {

	/**
	 * Check if `obj` is an object.
	 *
	 * @param {Object} obj
	 * @return {Boolean}
	 * @api private
	 */
	
	function isObject(obj) {
	  return null !== obj && 'object' === typeof obj;
	}
	
	module.exports = isObject;


/***/ },
/* 15 */
/***/ function(module, exports) {

	// The node and browser modules expose versions of this with the
	// appropriate constructor function bound as first argument
	/**
	 * Issue a request:
	 *
	 * Examples:
	 *
	 *    request('GET', '/users').end(callback)
	 *    request('/users').end(callback)
	 *    request('/users', callback)
	 *
	 * @param {String} method
	 * @param {String|Function} url or callback
	 * @return {Request}
	 * @api public
	 */
	
	function request(RequestConstructor, method, url) {
	  // callback
	  if ('function' == typeof url) {
	    return new RequestConstructor('GET', method).end(url);
	  }
	
	  // url first
	  if (2 == arguments.length) {
	    return new RequestConstructor('GET', method);
	  }
	
	  return new RequestConstructor(method, url);
	}
	
	module.exports = request;


/***/ },
/* 16 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(riot) {'use strict';
	
	riot.tag2('curfew', '<div if="{isSP}" id="curfew" class="curfew">門限を確認しましたか？ <div class="header"> <div class="left"><span class="ion-ios-arrow-back icon"></span>左スワイプ：確認</div> <div class="right">右スワイプ：設定<span class="ion-ios-arrow-forward icon"></span></div> </div> <div class="footer"> <div class="center"><span class="ion-ios-circle-filled icon"></span>タップ：再表示</div> </div> </div>', 'curfew .curfew,[riot-tag="curfew"] .curfew,[data-is="curfew"] .curfew{ position: absolute; top: 0; left: 0; display: -webkit-inline-flex; display: -moz-inline-flex; display: -ms-inline-flex; display: -o-inline-flex; display: inline-flex; align-items: center; justify-content: center; width: 100%; height: 100%; background: #ad1514; color: #fff; font-size: 20px; text-align: center; z-index: 1; cursor: default; } curfew .curfew .header,[riot-tag="curfew"] .curfew .header,[data-is="curfew"] .curfew .header,curfew .curfew .footer,[riot-tag="curfew"] .curfew .footer,[data-is="curfew"] .curfew .footer{ position: absolute; left: 0; width: 100%; color: rgba(255, 255, 255, 0.7); font-size: 11px; } curfew .curfew .header .icon,[riot-tag="curfew"] .curfew .header .icon,[data-is="curfew"] .curfew .header .icon,curfew .curfew .footer .icon,[riot-tag="curfew"] .curfew .footer .icon,[data-is="curfew"] .curfew .footer .icon{ margin: 0 4px; } curfew .curfew .header,[riot-tag="curfew"] .curfew .header,[data-is="curfew"] .curfew .header{ top: 5px; } curfew .curfew .header .left,[riot-tag="curfew"] .curfew .header .left,[data-is="curfew"] .curfew .header .left{ position: absolute; left: 10px; } curfew .curfew .header .right,[riot-tag="curfew"] .curfew .header .right,[data-is="curfew"] .curfew .header .right{ position: absolute; right: 10px; } curfew .curfew .footer,[riot-tag="curfew"] .curfew .footer,[data-is="curfew"] .curfew .footer{ bottom: 5px; } curfew .curfew .footer .center,[riot-tag="curfew"] .curfew .footer .center,[data-is="curfew"] .curfew .footer .center{ margin: 0 auto; }', '', function (opts) {
	    var lockr = __webpack_require__(17);
	
	    if ('ontouchstart' in window) {
	        this.isSP = true;
	    } else {
	        this.isSP = false;
	    }
	
	    this.on('mount', function () {
	        if (this.isSP) {
	            var $elem = document.getElementById('curfew');
	            var startPos;
	            $elem.addEventListener('touchstart', function (e) {
	                var touchObj = e.changedTouches[0];
	                var pos = {
	                    x: touchObj.pageX,
	                    y: touchObj.pageY
	                };
	                startPos = pos;
	            });
	            $elem.addEventListener('touchmove', function (e) {
	                var touchObj = e.changedTouches[0];
	                var pos = {
	                    x: touchObj.pageX,
	                    y: touchObj.pageY
	                };
	            });
	            $elem.addEventListener('touchend', function (e) {});
	        }
	    });
	});
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(1)))

/***/ },
/* 17 */
/***/ function(module, exports, __webpack_require__) {

	(function(root, factory) {
	
	  if (true) {
	    if (typeof module !== 'undefined' && module.exports) {
	      exports = module.exports = factory(root, exports);
	    }
	  } else if (typeof define === 'function' && define.amd) {
	    define(['exports'], function(exports) {
	      root.Lockr = factory(root, exports);
	    });
	  } else {
	    root.Lockr = factory(root, {});
	  }
	
	}(this, function(root, Lockr) {
	  'use strict';
	
	  if (!Array.prototype.indexOf) {
	    Array.prototype.indexOf = function(elt /*, from*/)
	    {
	      var len = this.length >>> 0;
	
	      var from = Number(arguments[1]) || 0;
	      from = (from < 0)
	      ? Math.ceil(from)
	      : Math.floor(from);
	      if (from < 0)
	        from += len;
	
	      for (; from < len; from++)
	      {
	        if (from in this &&
	            this[from] === elt)
	          return from;
	      }
	      return -1;
	    };
	  }
	
	  Lockr.prefix = "";
	
	  Lockr._getPrefixedKey = function(key, options) {
	    options = options || {};
	
	    if (options.noPrefix) {
	      return key;
	    } else {
	      return this.prefix + key;
	    }
	
	  };
	
	  Lockr.set = function (key, value, options) {
	    var query_key = this._getPrefixedKey(key, options);
	
	    try {
	      localStorage.setItem(query_key, JSON.stringify({"data": value}));
	    } catch (e) {
	      if (console) console.warn("Lockr didn't successfully save the '{"+ key +": "+ value +"}' pair, because the localStorage is full.");
	    }
	  };
	
	  Lockr.get = function (key, missing, options) {
	    var query_key = this._getPrefixedKey(key, options),
	        value;
	
	    try {
	      value = JSON.parse(localStorage.getItem(query_key));
	    } catch (e) {
	        try {
	            if(localStorage[query_key]) {
	                value = JSON.parse('{"data":"' + localStorage.getItem(query_key) + '"}');
	            } else{
	                value = null;
	            }
	        } catch (e) {
	            if (console) console.warn("Lockr could not load the item with key " + key);
	        }
	    }
	    if(value === null) {
	      return missing;
	    } else if (typeof value.data !== 'undefined') {
	      return value.data;
	    } else {
	      return missing;
	    }
	  };
	
	  Lockr.sadd = function(key, value, options) {
	    var query_key = this._getPrefixedKey(key, options),
	        json;
	
	    var values = Lockr.smembers(key);
	
	    if (values.indexOf(value) > -1) {
	      return null;
	    }
	
	    try {
	      values.push(value);
	      json = JSON.stringify({"data": values});
	      localStorage.setItem(query_key, json);
	    } catch (e) {
	      console.log(e);
	      if (console) console.warn("Lockr didn't successfully add the "+ value +" to "+ key +" set, because the localStorage is full.");
	    }
	  };
	
	  Lockr.smembers = function(key, options) {
	    var query_key = this._getPrefixedKey(key, options),
	        value;
	
	    try {
	      value = JSON.parse(localStorage.getItem(query_key));
	    } catch (e) {
	      value = null;
	    }
	
	    if (value === null)
	      return [];
	    else
	      return (value.data || []);
	  };
	
	  Lockr.sismember = function(key, value, options) {
	    var query_key = this._getPrefixedKey(key, options);
	
	    return Lockr.smembers(key).indexOf(value) > -1;
	  };
	
	  Lockr.getAll = function () {
	    var keys = Object.keys(localStorage);
	
	    return keys.map(function (key) {
	      return Lockr.get(key);
	    });
	  };
	
	  Lockr.srem = function(key, value, options) {
	    var query_key = this._getPrefixedKey(key, options),
	        json,
	        index;
	
	    var values = Lockr.smembers(key, value);
	
	    index = values.indexOf(value);
	
	    if (index > -1)
	      values.splice(index, 1);
	
	    json = JSON.stringify({"data": values});
	
	    try {
	      localStorage.setItem(query_key, json);
	    } catch (e) {
	      if (console) console.warn("Lockr couldn't remove the "+ value +" from the set "+ key);
	    }
	  };
	
	  Lockr.rm =  function (key) {
	    localStorage.removeItem(key);
	  };
	
	  Lockr.flush = function () {
	    localStorage.clear();
	  };
	  return Lockr;
	
	}));


/***/ }
/******/ ]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAgZmZmYjU0NTAwNmIyZmY3ZWJkMTEiLCJ3ZWJwYWNrOi8vLy4vc3JjL3NjcmlwdHMvZW50cnkuanMiLCJ3ZWJwYWNrOi8vLy4vfi9yaW90L3Jpb3QuanMiLCJ3ZWJwYWNrOi8vLyh3ZWJwYWNrKS9idWlsZGluL2FtZC1vcHRpb25zLmpzIiwid2VicGFjazovLy8uL3NyYy9zY3JpcHRzL3JvdXRlci5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvc2NyaXB0cy90YWdzL2hvbWUudGFnIiwid2VicGFjazovLy8uL3NyYy9zY3JpcHRzL3RhZ3MvY29tbW9uL25hdmJhci50YWciLCJ3ZWJwYWNrOi8vLy4vc3JjL3NjcmlwdHMvdGFncy9jb21tb24vY3JlZGl0LnRhZyIsIndlYnBhY2s6Ly8vLi9zcmMvc2NyaXB0cy90YWdzL2NvbW1vbi91dGlscy50YWciLCJ3ZWJwYWNrOi8vLy4vc3JjL3NjcmlwdHMvdGFncy9tZW51LWxpc3QudGFnIiwid2VicGFjazovLy8uL3NyYy9zY3JpcHRzL3RhZ3MvbmV4dC50YWciLCJ3ZWJwYWNrOi8vLy4vc3JjL3NjcmlwdHMvYXBpLmpzIiwid2VicGFjazovLy8uL34vc3VwZXJhZ2VudC9saWIvY2xpZW50LmpzIiwid2VicGFjazovLy8uL34vY29tcG9uZW50LWVtaXR0ZXIvaW5kZXguanMiLCJ3ZWJwYWNrOi8vLy4vfi9zdXBlcmFnZW50L2xpYi9yZXF1ZXN0LWJhc2UuanMiLCJ3ZWJwYWNrOi8vLy4vfi9zdXBlcmFnZW50L2xpYi9pcy1vYmplY3QuanMiLCJ3ZWJwYWNrOi8vLy4vfi9zdXBlcmFnZW50L2xpYi9yZXF1ZXN0LmpzIiwid2VicGFjazovLy8uL3NyYy9zY3JpcHRzL3RhZ3MvY3VyZmV3LnRhZyIsIndlYnBhY2s6Ly8vLi9+L2xvY2tyL2xvY2tyLmpzIl0sIm5hbWVzIjpbIndpbmRvdyIsIm9icyIsInJpb3QiLCJvYnNlcnZhYmxlIiwicm91dGVyIiwicmVxdWlyZSIsInN0YXJ0IiwiYXBpIiwiZCIsIkRhdGUiLCJvbiIsInllYXIiLCJnZXRGdWxsWWVhciIsIm1vbnRoIiwiZ2V0TW9udGgiLCJnZXQiLCJ0aGVuIiwiZGF0YSIsInN0YXR1cyIsInRyaWdnZXIiLCJpdGVtcyIsInJvdXRlIiwibW91bnQiLCJtb2R1bGUiLCJleHBvcnRzIiwidGFnMiIsIm9wdHMiLCJzZWxmIiwic2Nyb2xsZXJPcHRzIiwidGFyZ2V0IiwiZHVyYXRpb24iLCJvZmZzZXQiLCJtZW51Iiwib25DbGljayIsInNjcm9sbGVyIiwiY2FsbGJhY2siLCIkdGFyZ2V0IiwiZG9jdW1lbnQiLCJnZXRFbGVtZW50QnlJZCIsInBvcyIsImdldEJvdW5kaW5nQ2xpZW50UmVjdCIsInRvcCIsInBhZ2VZIiwicGFnZVlPZmZzZXQiLCJwYWdlWCIsInBhZ2VYT2Zmc2V0Iiwic3RlcCIsInByb2dyZXNzIiwicmVxdWVzdEFuaW1hdGlvbkZyYW1lIiwic2Nyb2xsVG8iLCJob3VycyIsImdldEhvdXJzIiwibWludXRlcyIsImdldE1pbnV0ZXMiLCJkYXRlIiwiZ2V0RGF0ZSIsImdldFRvZGF5IiwiaSIsImxlbiIsImxlbmd0aCIsIml0ZW0iLCJnZXRJdGVtIiwidGltZUlkIiwidG9kYXkiLCJzdGF0ZSIsIm1haW4iLCJtX21haW4iLCJzcGxpdCIsInNpZGVzIiwibV9zaWRlIiwibF9tYWluIiwibF9zaWRlIiwiZF9tYWluIiwiZ2V0VGltZSIsImlkIiwibGFiZWwiLCJ0aW1lIiwibG9hZGluZyIsInVwZGF0ZSIsInJlcXVlc3QiLCJub3ciLCJQcm9taXNlIiwicmVzb2x2ZSIsInJlamVjdCIsImVuZCIsImVyciIsInJlcyIsImJvZHkiLCJzZWFyY2giLCJ3b3JkIiwibG9ja3IiLCJpc1NQIiwiJGVsZW0iLCJzdGFydFBvcyIsImFkZEV2ZW50TGlzdGVuZXIiLCJlIiwidG91Y2hPYmoiLCJjaGFuZ2VkVG91Y2hlcyIsIngiLCJ5Il0sIm1hcHBpbmdzIjoiO0FBQUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFD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QUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsWUFBVyxNQUFNO0FBQ2pCLFlBQVcsU0FBUztBQUNwQjtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsWUFBVyxTQUFTO0FBQ3BCLGFBQVksUUFBUTtBQUNwQjtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsVUFBUyxzQkFBc0IsV0FBVyxZQUFZOztBQUV0RDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQUs7QUFDTDs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLElBQUc7QUFDSDtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSw2RkFBNEY7QUFDNUY7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLFlBQVcsT0FBTztBQUNsQixZQUFXLGVBQWU7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QUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLDhCQUE2QixlQUFlO0FBQzVDO0FBQ0EsTUFBSztBQUNMO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsTUFBSztBQUNMO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsTUFBSztBQUNMOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBOztBQUVBO0FBQ0E7O0FBRUEsNEJBQTJCLGVBQWU7O0FBRTFDO0FBQ0E7QUFDQSxNQUFLO0FBQ0w7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQSxFQUFDIiwiZmlsZSI6ImJ1bmRsZS5qcyIsInNvdXJjZXNDb250ZW50IjpbIiBcdC8vIFRoZSBtb2R1bGUgY2FjaGVcbiBcdHZhciBpbnN0YWxsZWRNb2R1bGVzID0ge307XG5cbiBcdC8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG4gXHRmdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cbiBcdFx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG4gXHRcdGlmKGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdKVxuIFx0XHRcdHJldHVybiBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXS5leHBvcnRzO1xuXG4gXHRcdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG4gXHRcdHZhciBtb2R1bGUgPSBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSA9IHtcbiBcdFx0XHRleHBvcnRzOiB7fSxcbiBcdFx0XHRpZDogbW9kdWxlSWQsXG4gXHRcdFx0bG9hZGVkOiBmYWxzZVxuIFx0XHR9O1xuXG4gXHRcdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuIFx0XHRtb2R1bGVzW21vZHVsZUlkXS5jYWxsKG1vZHVsZS5leHBvcnRzLCBtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuIFx0XHQvLyBGbGFnIHRoZSBtb2R1bGUgYXMgbG9hZGVkXG4gXHRcdG1vZHVsZS5sb2FkZWQgPSB0cnVlO1xuXG4gXHRcdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG4gXHRcdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbiBcdH1cblxuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZXMgb2JqZWN0IChfX3dlYnBhY2tfbW9kdWxlc19fKVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5tID0gbW9kdWxlcztcblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGUgY2FjaGVcbiBcdF9fd2VicGFja19yZXF1aXJlX18uYyA9IGluc3RhbGxlZE1vZHVsZXM7XG5cbiBcdC8vIF9fd2VicGFja19wdWJsaWNfcGF0aF9fXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnAgPSBcIi9kb2NzL1wiO1xuXG4gXHQvLyBMb2FkIGVudHJ5IG1vZHVsZSBhbmQgcmV0dXJuIGV4cG9ydHNcbiBcdHJldHVybiBfX3dlYnBhY2tfcmVxdWlyZV9fKDApO1xuXG5cblxuLyoqIFdFQlBBQ0sgRk9PVEVSICoqXG4gKiogd2VicGFjay9ib290c3RyYXAgZmZmYjU0NTAwNmIyZmY3ZWJkMTFcbiAqKi8iLCJcInVzZSBzdHJpY3RcIlxuXG4vLyBPYnNlcnZhYmxlXG53aW5kb3cub2JzID0gcmlvdC5vYnNlcnZhYmxlKCk7XG5cbmNvbnN0IHJvdXRlciA9IHJlcXVpcmUoJy4vcm91dGVyJyk7XG5yb3V0ZXIuc3RhcnQoKTtcblxuY29uc3QgYXBpID0gcmVxdWlyZSgnLi9hcGknKTtcbmNvbnN0IGQgPSBuZXcgRGF0ZTtcbm9icy5vbignZ2V0TWVudTpyZXEnLCAoeWVhciA9IGQuZ2V0RnVsbFllYXIoKSwgbW9udGggPSBkLmdldE1vbnRoKCkgKyAxKSA9PiB7XG5cdGFwaS5nZXQoMjAxNiwgMTApLnRoZW4oKGRhdGEpID0+IHtcblx0XHRpZihkYXRhLnN0YXR1cyA9PT0gJ3N1Y2Nlc3MnKSB7XG5cdFx0XHRvYnMudHJpZ2dlcignZ2V0TWVudTpyZXMnLCBkYXRhLml0ZW1zKTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0b2JzLnRyaWdnZXIoJ2dldE1lbnU6cmVzJywge1xuXHRcdFx0XHRzdGF0dXM6ICdub3Rmb3VuZCdcblx0XHRcdH0pO1xuXHRcdH1cblx0fSk7XG59KTtcblxuXG4vKiogV0VCUEFDSyBGT09URVIgKipcbiAqKiAuL3NyYy9zY3JpcHRzL2VudHJ5LmpzXG4gKiovIiwiLyogUmlvdCB2Mi42LjQsIEBsaWNlbnNlIE1JVCAqL1xuXG47KGZ1bmN0aW9uKHdpbmRvdywgdW5kZWZpbmVkKSB7XG4gICd1c2Ugc3RyaWN0JztcbnZhciByaW90ID0geyB2ZXJzaW9uOiAndjIuNi40Jywgc2V0dGluZ3M6IHt9IH0sXG4gIC8vIGJlIGF3YXJlLCBpbnRlcm5hbCB1c2FnZVxuICAvLyBBVFRFTlRJT046IHByZWZpeCB0aGUgZ2xvYmFsIGR5bmFtaWMgdmFyaWFibGVzIHdpdGggYF9fYFxuXG4gIC8vIGNvdW50ZXIgdG8gZ2l2ZSBhIHVuaXF1ZSBpZCB0byBhbGwgdGhlIFRhZyBpbnN0YW5jZXNcbiAgX191aWQgPSAwLFxuICAvLyB0YWdzIGluc3RhbmNlcyBjYWNoZVxuICBfX3ZpcnR1YWxEb20gPSBbXSxcbiAgLy8gdGFncyBpbXBsZW1lbnRhdGlvbiBjYWNoZVxuICBfX3RhZ0ltcGwgPSB7fSxcblxuICAvKipcbiAgICogQ29uc3RcbiAgICovXG4gIEdMT0JBTF9NSVhJTiA9ICdfX2dsb2JhbF9taXhpbicsXG5cbiAgLy8gcmlvdCBzcGVjaWZpYyBwcmVmaXhlc1xuICBSSU9UX1BSRUZJWCA9ICdyaW90LScsXG4gIFJJT1RfVEFHID0gUklPVF9QUkVGSVggKyAndGFnJyxcbiAgUklPVF9UQUdfSVMgPSAnZGF0YS1pcycsXG5cbiAgLy8gZm9yIHR5cGVvZiA9PSAnJyBjb21wYXJpc29uc1xuICBUX1NUUklORyA9ICdzdHJpbmcnLFxuICBUX09CSkVDVCA9ICdvYmplY3QnLFxuICBUX1VOREVGICA9ICd1bmRlZmluZWQnLFxuICBUX0ZVTkNUSU9OID0gJ2Z1bmN0aW9uJyxcbiAgWExJTktfTlMgPSAnaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluaycsXG4gIFhMSU5LX1JFR0VYID0gL154bGluazooXFx3KykvLFxuICAvLyBzcGVjaWFsIG5hdGl2ZSB0YWdzIHRoYXQgY2Fubm90IGJlIHRyZWF0ZWQgbGlrZSB0aGUgb3RoZXJzXG4gIFNQRUNJQUxfVEFHU19SRUdFWCA9IC9eKD86dCg/OmJvZHl8aGVhZHxmb290fFtyaGRdKXxjYXB0aW9ufGNvbCg/Omdyb3VwKT98b3B0KD86aW9ufGdyb3VwKSkkLyxcbiAgUkVTRVJWRURfV09SRFNfQkxBQ0tMSVNUID0gL14oPzpfKD86aXRlbXxpZHxwYXJlbnQpfHVwZGF0ZXxyb290fCg/OnVuKT9tb3VudHxtaXhpbnxpcyg/Ok1vdW50ZWR8TG9vcCl8dGFnc3xwYXJlbnR8b3B0c3x0cmlnZ2VyfG8oPzpufGZmfG5lKSkkLyxcbiAgLy8gU1ZHIHRhZ3MgbGlzdCBodHRwczovL3d3dy53My5vcmcvVFIvU1ZHL2F0dGluZGV4Lmh0bWwjUHJlc2VudGF0aW9uQXR0cmlidXRlc1xuICBTVkdfVEFHU19MSVNUID0gWydhbHRHbHlwaCcsICdhbmltYXRlJywgJ2FuaW1hdGVDb2xvcicsICdjaXJjbGUnLCAnY2xpcFBhdGgnLCAnZGVmcycsICdlbGxpcHNlJywgJ2ZlQmxlbmQnLCAnZmVDb2xvck1hdHJpeCcsICdmZUNvbXBvbmVudFRyYW5zZmVyJywgJ2ZlQ29tcG9zaXRlJywgJ2ZlQ29udm9sdmVNYXRyaXgnLCAnZmVEaWZmdXNlTGlnaHRpbmcnLCAnZmVEaXNwbGFjZW1lbnRNYXAnLCAnZmVGbG9vZCcsICdmZUdhdXNzaWFuQmx1cicsICdmZUltYWdlJywgJ2ZlTWVyZ2UnLCAnZmVNb3JwaG9sb2d5JywgJ2ZlT2Zmc2V0JywgJ2ZlU3BlY3VsYXJMaWdodGluZycsICdmZVRpbGUnLCAnZmVUdXJidWxlbmNlJywgJ2ZpbHRlcicsICdmb250JywgJ2ZvcmVpZ25PYmplY3QnLCAnZycsICdnbHlwaCcsICdnbHlwaFJlZicsICdpbWFnZScsICdsaW5lJywgJ2xpbmVhckdyYWRpZW50JywgJ21hcmtlcicsICdtYXNrJywgJ21pc3NpbmctZ2x5cGgnLCAncGF0aCcsICdwYXR0ZXJuJywgJ3BvbHlnb24nLCAncG9seWxpbmUnLCAncmFkaWFsR3JhZGllbnQnLCAncmVjdCcsICdzdG9wJywgJ3N2ZycsICdzd2l0Y2gnLCAnc3ltYm9sJywgJ3RleHQnLCAndGV4dFBhdGgnLCAndHJlZicsICd0c3BhbicsICd1c2UnXSxcblxuICAvLyB2ZXJzaW9uIyBmb3IgSUUgOC0xMSwgMCBmb3Igb3RoZXJzXG4gIElFX1ZFUlNJT04gPSAod2luZG93ICYmIHdpbmRvdy5kb2N1bWVudCB8fCB7fSkuZG9jdW1lbnRNb2RlIHwgMCxcblxuICAvLyBkZXRlY3QgZmlyZWZveCB0byBmaXggIzEzNzRcbiAgRklSRUZPWCA9IHdpbmRvdyAmJiAhIXdpbmRvdy5JbnN0YWxsVHJpZ2dlclxuLyogaXN0YW5idWwgaWdub3JlIG5leHQgKi9cbnJpb3Qub2JzZXJ2YWJsZSA9IGZ1bmN0aW9uKGVsKSB7XG5cbiAgLyoqXG4gICAqIEV4dGVuZCB0aGUgb3JpZ2luYWwgb2JqZWN0IG9yIGNyZWF0ZSBhIG5ldyBlbXB0eSBvbmVcbiAgICogQHR5cGUgeyBPYmplY3QgfVxuICAgKi9cblxuICBlbCA9IGVsIHx8IHt9XG5cbiAgLyoqXG4gICAqIFByaXZhdGUgdmFyaWFibGVzXG4gICAqL1xuICB2YXIgY2FsbGJhY2tzID0ge30sXG4gICAgc2xpY2UgPSBBcnJheS5wcm90b3R5cGUuc2xpY2VcblxuICAvKipcbiAgICogUHJpdmF0ZSBNZXRob2RzXG4gICAqL1xuXG4gIC8qKlxuICAgKiBIZWxwZXIgZnVuY3Rpb24gbmVlZGVkIHRvIGdldCBhbmQgbG9vcCBhbGwgdGhlIGV2ZW50cyBpbiBhIHN0cmluZ1xuICAgKiBAcGFyYW0gICB7IFN0cmluZyB9ICAgZSAtIGV2ZW50IHN0cmluZ1xuICAgKiBAcGFyYW0gICB7RnVuY3Rpb259ICAgZm4gLSBjYWxsYmFja1xuICAgKi9cbiAgZnVuY3Rpb24gb25FYWNoRXZlbnQoZSwgZm4pIHtcbiAgICB2YXIgZXMgPSBlLnNwbGl0KCcgJyksIGwgPSBlcy5sZW5ndGgsIGkgPSAwXG4gICAgZm9yICg7IGkgPCBsOyBpKyspIHtcbiAgICAgIHZhciBuYW1lID0gZXNbaV1cbiAgICAgIGlmIChuYW1lKSBmbihuYW1lLCBpKVxuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBQdWJsaWMgQXBpXG4gICAqL1xuXG4gIC8vIGV4dGVuZCB0aGUgZWwgb2JqZWN0IGFkZGluZyB0aGUgb2JzZXJ2YWJsZSBtZXRob2RzXG4gIE9iamVjdC5kZWZpbmVQcm9wZXJ0aWVzKGVsLCB7XG4gICAgLyoqXG4gICAgICogTGlzdGVuIHRvIHRoZSBnaXZlbiBzcGFjZSBzZXBhcmF0ZWQgbGlzdCBvZiBgZXZlbnRzYCBhbmRcbiAgICAgKiBleGVjdXRlIHRoZSBgY2FsbGJhY2tgIGVhY2ggdGltZSBhbiBldmVudCBpcyB0cmlnZ2VyZWQuXG4gICAgICogQHBhcmFtICB7IFN0cmluZyB9IGV2ZW50cyAtIGV2ZW50cyBpZHNcbiAgICAgKiBAcGFyYW0gIHsgRnVuY3Rpb24gfSBmbiAtIGNhbGxiYWNrIGZ1bmN0aW9uXG4gICAgICogQHJldHVybnMgeyBPYmplY3QgfSBlbFxuICAgICAqL1xuICAgIG9uOiB7XG4gICAgICB2YWx1ZTogZnVuY3Rpb24oZXZlbnRzLCBmbikge1xuICAgICAgICBpZiAodHlwZW9mIGZuICE9ICdmdW5jdGlvbicpICByZXR1cm4gZWxcblxuICAgICAgICBvbkVhY2hFdmVudChldmVudHMsIGZ1bmN0aW9uKG5hbWUsIHBvcykge1xuICAgICAgICAgIChjYWxsYmFja3NbbmFtZV0gPSBjYWxsYmFja3NbbmFtZV0gfHwgW10pLnB1c2goZm4pXG4gICAgICAgICAgZm4udHlwZWQgPSBwb3MgPiAwXG4gICAgICAgIH0pXG5cbiAgICAgICAgcmV0dXJuIGVsXG4gICAgICB9LFxuICAgICAgZW51bWVyYWJsZTogZmFsc2UsXG4gICAgICB3cml0YWJsZTogZmFsc2UsXG4gICAgICBjb25maWd1cmFibGU6IGZhbHNlXG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIFJlbW92ZXMgdGhlIGdpdmVuIHNwYWNlIHNlcGFyYXRlZCBsaXN0IG9mIGBldmVudHNgIGxpc3RlbmVyc1xuICAgICAqIEBwYXJhbSAgIHsgU3RyaW5nIH0gZXZlbnRzIC0gZXZlbnRzIGlkc1xuICAgICAqIEBwYXJhbSAgIHsgRnVuY3Rpb24gfSBmbiAtIGNhbGxiYWNrIGZ1bmN0aW9uXG4gICAgICogQHJldHVybnMgeyBPYmplY3QgfSBlbFxuICAgICAqL1xuICAgIG9mZjoge1xuICAgICAgdmFsdWU6IGZ1bmN0aW9uKGV2ZW50cywgZm4pIHtcbiAgICAgICAgaWYgKGV2ZW50cyA9PSAnKicgJiYgIWZuKSBjYWxsYmFja3MgPSB7fVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICBvbkVhY2hFdmVudChldmVudHMsIGZ1bmN0aW9uKG5hbWUsIHBvcykge1xuICAgICAgICAgICAgaWYgKGZuKSB7XG4gICAgICAgICAgICAgIHZhciBhcnIgPSBjYWxsYmFja3NbbmFtZV1cbiAgICAgICAgICAgICAgZm9yICh2YXIgaSA9IDAsIGNiOyBjYiA9IGFyciAmJiBhcnJbaV07ICsraSkge1xuICAgICAgICAgICAgICAgIGlmIChjYiA9PSBmbikgYXJyLnNwbGljZShpLS0sIDEpXG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gZWxzZSBkZWxldGUgY2FsbGJhY2tzW25hbWVdXG4gICAgICAgICAgfSlcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gZWxcbiAgICAgIH0sXG4gICAgICBlbnVtZXJhYmxlOiBmYWxzZSxcbiAgICAgIHdyaXRhYmxlOiBmYWxzZSxcbiAgICAgIGNvbmZpZ3VyYWJsZTogZmFsc2VcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogTGlzdGVuIHRvIHRoZSBnaXZlbiBzcGFjZSBzZXBhcmF0ZWQgbGlzdCBvZiBgZXZlbnRzYCBhbmRcbiAgICAgKiBleGVjdXRlIHRoZSBgY2FsbGJhY2tgIGF0IG1vc3Qgb25jZVxuICAgICAqIEBwYXJhbSAgIHsgU3RyaW5nIH0gZXZlbnRzIC0gZXZlbnRzIGlkc1xuICAgICAqIEBwYXJhbSAgIHsgRnVuY3Rpb24gfSBmbiAtIGNhbGxiYWNrIGZ1bmN0aW9uXG4gICAgICogQHJldHVybnMgeyBPYmplY3QgfSBlbFxuICAgICAqL1xuICAgIG9uZToge1xuICAgICAgdmFsdWU6IGZ1bmN0aW9uKGV2ZW50cywgZm4pIHtcbiAgICAgICAgZnVuY3Rpb24gb24oKSB7XG4gICAgICAgICAgZWwub2ZmKGV2ZW50cywgb24pXG4gICAgICAgICAgZm4uYXBwbHkoZWwsIGFyZ3VtZW50cylcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gZWwub24oZXZlbnRzLCBvbilcbiAgICAgIH0sXG4gICAgICBlbnVtZXJhYmxlOiBmYWxzZSxcbiAgICAgIHdyaXRhYmxlOiBmYWxzZSxcbiAgICAgIGNvbmZpZ3VyYWJsZTogZmFsc2VcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogRXhlY3V0ZSBhbGwgY2FsbGJhY2sgZnVuY3Rpb25zIHRoYXQgbGlzdGVuIHRvXG4gICAgICogdGhlIGdpdmVuIHNwYWNlIHNlcGFyYXRlZCBsaXN0IG9mIGBldmVudHNgXG4gICAgICogQHBhcmFtICAgeyBTdHJpbmcgfSBldmVudHMgLSBldmVudHMgaWRzXG4gICAgICogQHJldHVybnMgeyBPYmplY3QgfSBlbFxuICAgICAqL1xuICAgIHRyaWdnZXI6IHtcbiAgICAgIHZhbHVlOiBmdW5jdGlvbihldmVudHMpIHtcblxuICAgICAgICAvLyBnZXR0aW5nIHRoZSBhcmd1bWVudHNcbiAgICAgICAgdmFyIGFyZ2xlbiA9IGFyZ3VtZW50cy5sZW5ndGggLSAxLFxuICAgICAgICAgIGFyZ3MgPSBuZXcgQXJyYXkoYXJnbGVuKSxcbiAgICAgICAgICBmbnNcblxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGFyZ2xlbjsgaSsrKSB7XG4gICAgICAgICAgYXJnc1tpXSA9IGFyZ3VtZW50c1tpICsgMV0gLy8gc2tpcCBmaXJzdCBhcmd1bWVudFxuICAgICAgICB9XG5cbiAgICAgICAgb25FYWNoRXZlbnQoZXZlbnRzLCBmdW5jdGlvbihuYW1lLCBwb3MpIHtcblxuICAgICAgICAgIGZucyA9IHNsaWNlLmNhbGwoY2FsbGJhY2tzW25hbWVdIHx8IFtdLCAwKVxuXG4gICAgICAgICAgZm9yICh2YXIgaSA9IDAsIGZuOyBmbiA9IGZuc1tpXTsgKytpKSB7XG4gICAgICAgICAgICBpZiAoZm4uYnVzeSkgY29udGludWVcbiAgICAgICAgICAgIGZuLmJ1c3kgPSAxXG4gICAgICAgICAgICBmbi5hcHBseShlbCwgZm4udHlwZWQgPyBbbmFtZV0uY29uY2F0KGFyZ3MpIDogYXJncylcbiAgICAgICAgICAgIGlmIChmbnNbaV0gIT09IGZuKSB7IGktLSB9XG4gICAgICAgICAgICBmbi5idXN5ID0gMFxuICAgICAgICAgIH1cblxuICAgICAgICAgIGlmIChjYWxsYmFja3NbJyonXSAmJiBuYW1lICE9ICcqJylcbiAgICAgICAgICAgIGVsLnRyaWdnZXIuYXBwbHkoZWwsIFsnKicsIG5hbWVdLmNvbmNhdChhcmdzKSlcblxuICAgICAgICB9KVxuXG4gICAgICAgIHJldHVybiBlbFxuICAgICAgfSxcbiAgICAgIGVudW1lcmFibGU6IGZhbHNlLFxuICAgICAgd3JpdGFibGU6IGZhbHNlLFxuICAgICAgY29uZmlndXJhYmxlOiBmYWxzZVxuICAgIH1cbiAgfSlcblxuICByZXR1cm4gZWxcblxufVxuLyogaXN0YW5idWwgaWdub3JlIG5leHQgKi9cbjsoZnVuY3Rpb24ocmlvdCkge1xuXG4vKipcbiAqIFNpbXBsZSBjbGllbnQtc2lkZSByb3V0ZXJcbiAqIEBtb2R1bGUgcmlvdC1yb3V0ZVxuICovXG5cblxudmFyIFJFX09SSUdJTiA9IC9eLis/XFwvXFwvK1teXFwvXSsvLFxuICBFVkVOVF9MSVNURU5FUiA9ICdFdmVudExpc3RlbmVyJyxcbiAgUkVNT1ZFX0VWRU5UX0xJU1RFTkVSID0gJ3JlbW92ZScgKyBFVkVOVF9MSVNURU5FUixcbiAgQUREX0VWRU5UX0xJU1RFTkVSID0gJ2FkZCcgKyBFVkVOVF9MSVNURU5FUixcbiAgSEFTX0FUVFJJQlVURSA9ICdoYXNBdHRyaWJ1dGUnLFxuICBSRVBMQUNFID0gJ3JlcGxhY2UnLFxuICBQT1BTVEFURSA9ICdwb3BzdGF0ZScsXG4gIEhBU0hDSEFOR0UgPSAnaGFzaGNoYW5nZScsXG4gIFRSSUdHRVIgPSAndHJpZ2dlcicsXG4gIE1BWF9FTUlUX1NUQUNLX0xFVkVMID0gMyxcbiAgd2luID0gdHlwZW9mIHdpbmRvdyAhPSAndW5kZWZpbmVkJyAmJiB3aW5kb3csXG4gIGRvYyA9IHR5cGVvZiBkb2N1bWVudCAhPSAndW5kZWZpbmVkJyAmJiBkb2N1bWVudCxcbiAgaGlzdCA9IHdpbiAmJiBoaXN0b3J5LFxuICBsb2MgPSB3aW4gJiYgKGhpc3QubG9jYXRpb24gfHwgd2luLmxvY2F0aW9uKSwgLy8gc2VlIGh0bWw1LWhpc3RvcnktYXBpXG4gIHByb3QgPSBSb3V0ZXIucHJvdG90eXBlLCAvLyB0byBtaW5pZnkgbW9yZVxuICBjbGlja0V2ZW50ID0gZG9jICYmIGRvYy5vbnRvdWNoc3RhcnQgPyAndG91Y2hzdGFydCcgOiAnY2xpY2snLFxuICBzdGFydGVkID0gZmFsc2UsXG4gIGNlbnRyYWwgPSByaW90Lm9ic2VydmFibGUoKSxcbiAgcm91dGVGb3VuZCA9IGZhbHNlLFxuICBkZWJvdW5jZWRFbWl0LFxuICBiYXNlLCBjdXJyZW50LCBwYXJzZXIsIHNlY29uZFBhcnNlciwgZW1pdFN0YWNrID0gW10sIGVtaXRTdGFja0xldmVsID0gMFxuXG4vKipcbiAqIERlZmF1bHQgcGFyc2VyLiBZb3UgY2FuIHJlcGxhY2UgaXQgdmlhIHJvdXRlci5wYXJzZXIgbWV0aG9kLlxuICogQHBhcmFtIHtzdHJpbmd9IHBhdGggLSBjdXJyZW50IHBhdGggKG5vcm1hbGl6ZWQpXG4gKiBAcmV0dXJucyB7YXJyYXl9IGFycmF5XG4gKi9cbmZ1bmN0aW9uIERFRkFVTFRfUEFSU0VSKHBhdGgpIHtcbiAgcmV0dXJuIHBhdGguc3BsaXQoL1svPyNdLylcbn1cblxuLyoqXG4gKiBEZWZhdWx0IHBhcnNlciAoc2Vjb25kKS4gWW91IGNhbiByZXBsYWNlIGl0IHZpYSByb3V0ZXIucGFyc2VyIG1ldGhvZC5cbiAqIEBwYXJhbSB7c3RyaW5nfSBwYXRoIC0gY3VycmVudCBwYXRoIChub3JtYWxpemVkKVxuICogQHBhcmFtIHtzdHJpbmd9IGZpbHRlciAtIGZpbHRlciBzdHJpbmcgKG5vcm1hbGl6ZWQpXG4gKiBAcmV0dXJucyB7YXJyYXl9IGFycmF5XG4gKi9cbmZ1bmN0aW9uIERFRkFVTFRfU0VDT05EX1BBUlNFUihwYXRoLCBmaWx0ZXIpIHtcbiAgdmFyIHJlID0gbmV3IFJlZ0V4cCgnXicgKyBmaWx0ZXJbUkVQTEFDRV0oL1xcKi9nLCAnKFteLz8jXSs/KScpW1JFUExBQ0VdKC9cXC5cXC4vLCAnLionKSArICckJyksXG4gICAgYXJncyA9IHBhdGgubWF0Y2gocmUpXG5cbiAgaWYgKGFyZ3MpIHJldHVybiBhcmdzLnNsaWNlKDEpXG59XG5cbi8qKlxuICogU2ltcGxlL2NoZWFwIGRlYm91bmNlIGltcGxlbWVudGF0aW9uXG4gKiBAcGFyYW0gICB7ZnVuY3Rpb259IGZuIC0gY2FsbGJhY2tcbiAqIEBwYXJhbSAgIHtudW1iZXJ9IGRlbGF5IC0gZGVsYXkgaW4gc2Vjb25kc1xuICogQHJldHVybnMge2Z1bmN0aW9ufSBkZWJvdW5jZWQgZnVuY3Rpb25cbiAqL1xuZnVuY3Rpb24gZGVib3VuY2UoZm4sIGRlbGF5KSB7XG4gIHZhciB0XG4gIHJldHVybiBmdW5jdGlvbiAoKSB7XG4gICAgY2xlYXJUaW1lb3V0KHQpXG4gICAgdCA9IHNldFRpbWVvdXQoZm4sIGRlbGF5KVxuICB9XG59XG5cbi8qKlxuICogU2V0IHRoZSB3aW5kb3cgbGlzdGVuZXJzIHRvIHRyaWdnZXIgdGhlIHJvdXRlc1xuICogQHBhcmFtIHtib29sZWFufSBhdXRvRXhlYyAtIHNlZSByb3V0ZS5zdGFydFxuICovXG5mdW5jdGlvbiBzdGFydChhdXRvRXhlYykge1xuICBkZWJvdW5jZWRFbWl0ID0gZGVib3VuY2UoZW1pdCwgMSlcbiAgd2luW0FERF9FVkVOVF9MSVNURU5FUl0oUE9QU1RBVEUsIGRlYm91bmNlZEVtaXQpXG4gIHdpbltBRERfRVZFTlRfTElTVEVORVJdKEhBU0hDSEFOR0UsIGRlYm91bmNlZEVtaXQpXG4gIGRvY1tBRERfRVZFTlRfTElTVEVORVJdKGNsaWNrRXZlbnQsIGNsaWNrKVxuICBpZiAoYXV0b0V4ZWMpIGVtaXQodHJ1ZSlcbn1cblxuLyoqXG4gKiBSb3V0ZXIgY2xhc3NcbiAqL1xuZnVuY3Rpb24gUm91dGVyKCkge1xuICB0aGlzLiQgPSBbXVxuICByaW90Lm9ic2VydmFibGUodGhpcykgLy8gbWFrZSBpdCBvYnNlcnZhYmxlXG4gIGNlbnRyYWwub24oJ3N0b3AnLCB0aGlzLnMuYmluZCh0aGlzKSlcbiAgY2VudHJhbC5vbignZW1pdCcsIHRoaXMuZS5iaW5kKHRoaXMpKVxufVxuXG5mdW5jdGlvbiBub3JtYWxpemUocGF0aCkge1xuICByZXR1cm4gcGF0aFtSRVBMQUNFXSgvXlxcL3xcXC8kLywgJycpXG59XG5cbmZ1bmN0aW9uIGlzU3RyaW5nKHN0cikge1xuICByZXR1cm4gdHlwZW9mIHN0ciA9PSAnc3RyaW5nJ1xufVxuXG4vKipcbiAqIEdldCB0aGUgcGFydCBhZnRlciBkb21haW4gbmFtZVxuICogQHBhcmFtIHtzdHJpbmd9IGhyZWYgLSBmdWxscGF0aFxuICogQHJldHVybnMge3N0cmluZ30gcGF0aCBmcm9tIHJvb3RcbiAqL1xuZnVuY3Rpb24gZ2V0UGF0aEZyb21Sb290KGhyZWYpIHtcbiAgcmV0dXJuIChocmVmIHx8IGxvYy5ocmVmKVtSRVBMQUNFXShSRV9PUklHSU4sICcnKVxufVxuXG4vKipcbiAqIEdldCB0aGUgcGFydCBhZnRlciBiYXNlXG4gKiBAcGFyYW0ge3N0cmluZ30gaHJlZiAtIGZ1bGxwYXRoXG4gKiBAcmV0dXJucyB7c3RyaW5nfSBwYXRoIGZyb20gYmFzZVxuICovXG5mdW5jdGlvbiBnZXRQYXRoRnJvbUJhc2UoaHJlZikge1xuICByZXR1cm4gYmFzZVswXSA9PSAnIydcbiAgICA/IChocmVmIHx8IGxvYy5ocmVmIHx8ICcnKS5zcGxpdChiYXNlKVsxXSB8fCAnJ1xuICAgIDogKGxvYyA/IGdldFBhdGhGcm9tUm9vdChocmVmKSA6IGhyZWYgfHwgJycpW1JFUExBQ0VdKGJhc2UsICcnKVxufVxuXG5mdW5jdGlvbiBlbWl0KGZvcmNlKSB7XG4gIC8vIHRoZSBzdGFjayBpcyBuZWVkZWQgZm9yIHJlZGlyZWN0aW9uc1xuICB2YXIgaXNSb290ID0gZW1pdFN0YWNrTGV2ZWwgPT0gMCwgZmlyc3RcbiAgaWYgKE1BWF9FTUlUX1NUQUNLX0xFVkVMIDw9IGVtaXRTdGFja0xldmVsKSByZXR1cm5cblxuICBlbWl0U3RhY2tMZXZlbCsrXG4gIGVtaXRTdGFjay5wdXNoKGZ1bmN0aW9uKCkge1xuICAgIHZhciBwYXRoID0gZ2V0UGF0aEZyb21CYXNlKClcbiAgICBpZiAoZm9yY2UgfHwgcGF0aCAhPSBjdXJyZW50KSB7XG4gICAgICBjZW50cmFsW1RSSUdHRVJdKCdlbWl0JywgcGF0aClcbiAgICAgIGN1cnJlbnQgPSBwYXRoXG4gICAgfVxuICB9KVxuICBpZiAoaXNSb290KSB7XG4gICAgd2hpbGUgKGZpcnN0ID0gZW1pdFN0YWNrLnNoaWZ0KCkpIGZpcnN0KCkgLy8gc3RhY2sgaW5jcmVzZXMgd2l0aGluIHRoaXMgY2FsbFxuICAgIGVtaXRTdGFja0xldmVsID0gMFxuICB9XG59XG5cbmZ1bmN0aW9uIGNsaWNrKGUpIHtcbiAgaWYgKFxuICAgIGUud2hpY2ggIT0gMSAvLyBub3QgbGVmdCBjbGlja1xuICAgIHx8IGUubWV0YUtleSB8fCBlLmN0cmxLZXkgfHwgZS5zaGlmdEtleSAvLyBvciBtZXRhIGtleXNcbiAgICB8fCBlLmRlZmF1bHRQcmV2ZW50ZWQgLy8gb3IgZGVmYXVsdCBwcmV2ZW50ZWRcbiAgKSByZXR1cm5cblxuICB2YXIgZWwgPSBlLnRhcmdldFxuICB3aGlsZSAoZWwgJiYgZWwubm9kZU5hbWUgIT0gJ0EnKSBlbCA9IGVsLnBhcmVudE5vZGVcblxuICBpZiAoXG4gICAgIWVsIHx8IGVsLm5vZGVOYW1lICE9ICdBJyAvLyBub3QgQSB0YWdcbiAgICB8fCBlbFtIQVNfQVRUUklCVVRFXSgnZG93bmxvYWQnKSAvLyBoYXMgZG93bmxvYWQgYXR0clxuICAgIHx8ICFlbFtIQVNfQVRUUklCVVRFXSgnaHJlZicpIC8vIGhhcyBubyBocmVmIGF0dHJcbiAgICB8fCBlbC50YXJnZXQgJiYgZWwudGFyZ2V0ICE9ICdfc2VsZicgLy8gYW5vdGhlciB3aW5kb3cgb3IgZnJhbWVcbiAgICB8fCBlbC5ocmVmLmluZGV4T2YobG9jLmhyZWYubWF0Y2goUkVfT1JJR0lOKVswXSkgPT0gLTEgLy8gY3Jvc3Mgb3JpZ2luXG4gICkgcmV0dXJuXG5cbiAgaWYgKGVsLmhyZWYgIT0gbG9jLmhyZWZcbiAgICAmJiAoXG4gICAgICBlbC5ocmVmLnNwbGl0KCcjJylbMF0gPT0gbG9jLmhyZWYuc3BsaXQoJyMnKVswXSAvLyBpbnRlcm5hbCBqdW1wXG4gICAgICB8fCBiYXNlWzBdICE9ICcjJyAmJiBnZXRQYXRoRnJvbVJvb3QoZWwuaHJlZikuaW5kZXhPZihiYXNlKSAhPT0gMCAvLyBvdXRzaWRlIG9mIGJhc2VcbiAgICAgIHx8IGJhc2VbMF0gPT0gJyMnICYmIGVsLmhyZWYuc3BsaXQoYmFzZSlbMF0gIT0gbG9jLmhyZWYuc3BsaXQoYmFzZSlbMF0gLy8gb3V0c2lkZSBvZiAjYmFzZVxuICAgICAgfHwgIWdvKGdldFBhdGhGcm9tQmFzZShlbC5ocmVmKSwgZWwudGl0bGUgfHwgZG9jLnRpdGxlKSAvLyByb3V0ZSBub3QgZm91bmRcbiAgICApKSByZXR1cm5cblxuICBlLnByZXZlbnREZWZhdWx0KClcbn1cblxuLyoqXG4gKiBHbyB0byB0aGUgcGF0aFxuICogQHBhcmFtIHtzdHJpbmd9IHBhdGggLSBkZXN0aW5hdGlvbiBwYXRoXG4gKiBAcGFyYW0ge3N0cmluZ30gdGl0bGUgLSBwYWdlIHRpdGxlXG4gKiBAcGFyYW0ge2Jvb2xlYW59IHNob3VsZFJlcGxhY2UgLSB1c2UgcmVwbGFjZVN0YXRlIG9yIHB1c2hTdGF0ZVxuICogQHJldHVybnMge2Jvb2xlYW59IC0gcm91dGUgbm90IGZvdW5kIGZsYWdcbiAqL1xuZnVuY3Rpb24gZ28ocGF0aCwgdGl0bGUsIHNob3VsZFJlcGxhY2UpIHtcbiAgLy8gU2VydmVyLXNpZGUgdXNhZ2U6IGRpcmVjdGx5IGV4ZWN1dGUgaGFuZGxlcnMgZm9yIHRoZSBwYXRoXG4gIGlmICghaGlzdCkgcmV0dXJuIGNlbnRyYWxbVFJJR0dFUl0oJ2VtaXQnLCBnZXRQYXRoRnJvbUJhc2UocGF0aCkpXG5cbiAgcGF0aCA9IGJhc2UgKyBub3JtYWxpemUocGF0aClcbiAgdGl0bGUgPSB0aXRsZSB8fCBkb2MudGl0bGVcbiAgLy8gYnJvd3NlcnMgaWdub3JlcyB0aGUgc2Vjb25kIHBhcmFtZXRlciBgdGl0bGVgXG4gIHNob3VsZFJlcGxhY2VcbiAgICA/IGhpc3QucmVwbGFjZVN0YXRlKG51bGwsIHRpdGxlLCBwYXRoKVxuICAgIDogaGlzdC5wdXNoU3RhdGUobnVsbCwgdGl0bGUsIHBhdGgpXG4gIC8vIHNvIHdlIG5lZWQgdG8gc2V0IGl0IG1hbnVhbGx5XG4gIGRvYy50aXRsZSA9IHRpdGxlXG4gIHJvdXRlRm91bmQgPSBmYWxzZVxuICBlbWl0KClcbiAgcmV0dXJuIHJvdXRlRm91bmRcbn1cblxuLyoqXG4gKiBHbyB0byBwYXRoIG9yIHNldCBhY3Rpb25cbiAqIGEgc2luZ2xlIHN0cmluZzogICAgICAgICAgICAgICAgZ28gdGhlcmVcbiAqIHR3byBzdHJpbmdzOiAgICAgICAgICAgICAgICAgICAgZ28gdGhlcmUgd2l0aCBzZXR0aW5nIGEgdGl0bGVcbiAqIHR3byBzdHJpbmdzIGFuZCBib29sZWFuOiAgICAgICAgcmVwbGFjZSBoaXN0b3J5IHdpdGggc2V0dGluZyBhIHRpdGxlXG4gKiBhIHNpbmdsZSBmdW5jdGlvbjogICAgICAgICAgICAgIHNldCBhbiBhY3Rpb24gb24gdGhlIGRlZmF1bHQgcm91dGVcbiAqIGEgc3RyaW5nL1JlZ0V4cCBhbmQgYSBmdW5jdGlvbjogc2V0IGFuIGFjdGlvbiBvbiB0aGUgcm91dGVcbiAqIEBwYXJhbSB7KHN0cmluZ3xmdW5jdGlvbil9IGZpcnN0IC0gcGF0aCAvIGFjdGlvbiAvIGZpbHRlclxuICogQHBhcmFtIHsoc3RyaW5nfFJlZ0V4cHxmdW5jdGlvbil9IHNlY29uZCAtIHRpdGxlIC8gYWN0aW9uXG4gKiBAcGFyYW0ge2Jvb2xlYW59IHRoaXJkIC0gcmVwbGFjZSBmbGFnXG4gKi9cbnByb3QubSA9IGZ1bmN0aW9uKGZpcnN0LCBzZWNvbmQsIHRoaXJkKSB7XG4gIGlmIChpc1N0cmluZyhmaXJzdCkgJiYgKCFzZWNvbmQgfHwgaXNTdHJpbmcoc2Vjb25kKSkpIGdvKGZpcnN0LCBzZWNvbmQsIHRoaXJkIHx8IGZhbHNlKVxuICBlbHNlIGlmIChzZWNvbmQpIHRoaXMucihmaXJzdCwgc2Vjb25kKVxuICBlbHNlIHRoaXMucignQCcsIGZpcnN0KVxufVxuXG4vKipcbiAqIFN0b3Agcm91dGluZ1xuICovXG5wcm90LnMgPSBmdW5jdGlvbigpIHtcbiAgdGhpcy5vZmYoJyonKVxuICB0aGlzLiQgPSBbXVxufVxuXG4vKipcbiAqIEVtaXRcbiAqIEBwYXJhbSB7c3RyaW5nfSBwYXRoIC0gcGF0aFxuICovXG5wcm90LmUgPSBmdW5jdGlvbihwYXRoKSB7XG4gIHRoaXMuJC5jb25jYXQoJ0AnKS5zb21lKGZ1bmN0aW9uKGZpbHRlcikge1xuICAgIHZhciBhcmdzID0gKGZpbHRlciA9PSAnQCcgPyBwYXJzZXIgOiBzZWNvbmRQYXJzZXIpKG5vcm1hbGl6ZShwYXRoKSwgbm9ybWFsaXplKGZpbHRlcikpXG4gICAgaWYgKHR5cGVvZiBhcmdzICE9ICd1bmRlZmluZWQnKSB7XG4gICAgICB0aGlzW1RSSUdHRVJdLmFwcGx5KG51bGwsIFtmaWx0ZXJdLmNvbmNhdChhcmdzKSlcbiAgICAgIHJldHVybiByb3V0ZUZvdW5kID0gdHJ1ZSAvLyBleGl0IGZyb20gbG9vcFxuICAgIH1cbiAgfSwgdGhpcylcbn1cblxuLyoqXG4gKiBSZWdpc3RlciByb3V0ZVxuICogQHBhcmFtIHtzdHJpbmd9IGZpbHRlciAtIGZpbHRlciBmb3IgbWF0Y2hpbmcgdG8gdXJsXG4gKiBAcGFyYW0ge2Z1bmN0aW9ufSBhY3Rpb24gLSBhY3Rpb24gdG8gcmVnaXN0ZXJcbiAqL1xucHJvdC5yID0gZnVuY3Rpb24oZmlsdGVyLCBhY3Rpb24pIHtcbiAgaWYgKGZpbHRlciAhPSAnQCcpIHtcbiAgICBmaWx0ZXIgPSAnLycgKyBub3JtYWxpemUoZmlsdGVyKVxuICAgIHRoaXMuJC5wdXNoKGZpbHRlcilcbiAgfVxuICB0aGlzLm9uKGZpbHRlciwgYWN0aW9uKVxufVxuXG52YXIgbWFpblJvdXRlciA9IG5ldyBSb3V0ZXIoKVxudmFyIHJvdXRlID0gbWFpblJvdXRlci5tLmJpbmQobWFpblJvdXRlcilcblxuLyoqXG4gKiBDcmVhdGUgYSBzdWIgcm91dGVyXG4gKiBAcmV0dXJucyB7ZnVuY3Rpb259IHRoZSBtZXRob2Qgb2YgYSBuZXcgUm91dGVyIG9iamVjdFxuICovXG5yb3V0ZS5jcmVhdGUgPSBmdW5jdGlvbigpIHtcbiAgdmFyIG5ld1N1YlJvdXRlciA9IG5ldyBSb3V0ZXIoKVxuICAvLyBhc3NpZ24gc3ViLXJvdXRlcidzIG1haW4gbWV0aG9kXG4gIHZhciByb3V0ZXIgPSBuZXdTdWJSb3V0ZXIubS5iaW5kKG5ld1N1YlJvdXRlcilcbiAgLy8gc3RvcCBvbmx5IHRoaXMgc3ViLXJvdXRlclxuICByb3V0ZXIuc3RvcCA9IG5ld1N1YlJvdXRlci5zLmJpbmQobmV3U3ViUm91dGVyKVxuICByZXR1cm4gcm91dGVyXG59XG5cbi8qKlxuICogU2V0IHRoZSBiYXNlIG9mIHVybFxuICogQHBhcmFtIHsoc3RyfFJlZ0V4cCl9IGFyZyAtIGEgbmV3IGJhc2Ugb3IgJyMnIG9yICcjISdcbiAqL1xucm91dGUuYmFzZSA9IGZ1bmN0aW9uKGFyZykge1xuICBiYXNlID0gYXJnIHx8ICcjJ1xuICBjdXJyZW50ID0gZ2V0UGF0aEZyb21CYXNlKCkgLy8gcmVjYWxjdWxhdGUgY3VycmVudCBwYXRoXG59XG5cbi8qKiBFeGVjIHJvdXRpbmcgcmlnaHQgbm93ICoqL1xucm91dGUuZXhlYyA9IGZ1bmN0aW9uKCkge1xuICBlbWl0KHRydWUpXG59XG5cbi8qKlxuICogUmVwbGFjZSB0aGUgZGVmYXVsdCByb3V0ZXIgdG8geW91cnNcbiAqIEBwYXJhbSB7ZnVuY3Rpb259IGZuIC0geW91ciBwYXJzZXIgZnVuY3Rpb25cbiAqIEBwYXJhbSB7ZnVuY3Rpb259IGZuMiAtIHlvdXIgc2Vjb25kUGFyc2VyIGZ1bmN0aW9uXG4gKi9cbnJvdXRlLnBhcnNlciA9IGZ1bmN0aW9uKGZuLCBmbjIpIHtcbiAgaWYgKCFmbiAmJiAhZm4yKSB7XG4gICAgLy8gcmVzZXQgcGFyc2VyIGZvciB0ZXN0aW5nLi4uXG4gICAgcGFyc2VyID0gREVGQVVMVF9QQVJTRVJcbiAgICBzZWNvbmRQYXJzZXIgPSBERUZBVUxUX1NFQ09ORF9QQVJTRVJcbiAgfVxuICBpZiAoZm4pIHBhcnNlciA9IGZuXG4gIGlmIChmbjIpIHNlY29uZFBhcnNlciA9IGZuMlxufVxuXG4vKipcbiAqIEhlbHBlciBmdW5jdGlvbiB0byBnZXQgdXJsIHF1ZXJ5IGFzIGFuIG9iamVjdFxuICogQHJldHVybnMge29iamVjdH0gcGFyc2VkIHF1ZXJ5XG4gKi9cbnJvdXRlLnF1ZXJ5ID0gZnVuY3Rpb24oKSB7XG4gIHZhciBxID0ge31cbiAgdmFyIGhyZWYgPSBsb2MuaHJlZiB8fCBjdXJyZW50XG4gIGhyZWZbUkVQTEFDRV0oL1s/Jl0oLis/KT0oW14mXSopL2csIGZ1bmN0aW9uKF8sIGssIHYpIHsgcVtrXSA9IHYgfSlcbiAgcmV0dXJuIHFcbn1cblxuLyoqIFN0b3Agcm91dGluZyAqKi9cbnJvdXRlLnN0b3AgPSBmdW5jdGlvbiAoKSB7XG4gIGlmIChzdGFydGVkKSB7XG4gICAgaWYgKHdpbikge1xuICAgICAgd2luW1JFTU9WRV9FVkVOVF9MSVNURU5FUl0oUE9QU1RBVEUsIGRlYm91bmNlZEVtaXQpXG4gICAgICB3aW5bUkVNT1ZFX0VWRU5UX0xJU1RFTkVSXShIQVNIQ0hBTkdFLCBkZWJvdW5jZWRFbWl0KVxuICAgICAgZG9jW1JFTU9WRV9FVkVOVF9MSVNURU5FUl0oY2xpY2tFdmVudCwgY2xpY2spXG4gICAgfVxuICAgIGNlbnRyYWxbVFJJR0dFUl0oJ3N0b3AnKVxuICAgIHN0YXJ0ZWQgPSBmYWxzZVxuICB9XG59XG5cbi8qKlxuICogU3RhcnQgcm91dGluZ1xuICogQHBhcmFtIHtib29sZWFufSBhdXRvRXhlYyAtIGF1dG9tYXRpY2FsbHkgZXhlYyBhZnRlciBzdGFydGluZyBpZiB0cnVlXG4gKi9cbnJvdXRlLnN0YXJ0ID0gZnVuY3Rpb24gKGF1dG9FeGVjKSB7XG4gIGlmICghc3RhcnRlZCkge1xuICAgIGlmICh3aW4pIHtcbiAgICAgIGlmIChkb2N1bWVudC5yZWFkeVN0YXRlID09ICdjb21wbGV0ZScpIHN0YXJ0KGF1dG9FeGVjKVxuICAgICAgLy8gdGhlIHRpbWVvdXQgaXMgbmVlZGVkIHRvIHNvbHZlXG4gICAgICAvLyBhIHdlaXJkIHNhZmFyaSBidWcgaHR0cHM6Ly9naXRodWIuY29tL3Jpb3Qvcm91dGUvaXNzdWVzLzMzXG4gICAgICBlbHNlIHdpbltBRERfRVZFTlRfTElTVEVORVJdKCdsb2FkJywgZnVuY3Rpb24oKSB7XG4gICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7IHN0YXJ0KGF1dG9FeGVjKSB9LCAxKVxuICAgICAgfSlcbiAgICB9XG4gICAgc3RhcnRlZCA9IHRydWVcbiAgfVxufVxuXG4vKiogUHJlcGFyZSB0aGUgcm91dGVyICoqL1xucm91dGUuYmFzZSgpXG5yb3V0ZS5wYXJzZXIoKVxuXG5yaW90LnJvdXRlID0gcm91dGVcbn0pKHJpb3QpXG4vKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAqL1xuXG4vKipcbiAqIFRoZSByaW90IHRlbXBsYXRlIGVuZ2luZVxuICogQHZlcnNpb24gdjIuNC4yXG4gKi9cbi8qKlxuICogcmlvdC51dGlsLmJyYWNrZXRzXG4gKlxuICogLSBgYnJhY2tldHMgICAgYCAtIFJldHVybnMgYSBzdHJpbmcgb3IgcmVnZXggYmFzZWQgb24gaXRzIHBhcmFtZXRlclxuICogLSBgYnJhY2tldHMuc2V0YCAtIENoYW5nZSB0aGUgY3VycmVudCByaW90IGJyYWNrZXRzXG4gKlxuICogQG1vZHVsZVxuICovXG5cbnZhciBicmFja2V0cyA9IChmdW5jdGlvbiAoVU5ERUYpIHtcblxuICB2YXJcbiAgICBSRUdMT0IgPSAnZycsXG5cbiAgICBSX01MQ09NTVMgPSAvXFwvXFwqW14qXSpcXCorKD86W14qXFwvXVteKl0qXFwqKykqXFwvL2csXG5cbiAgICBSX1NUUklOR1MgPSAvXCJbXlwiXFxcXF0qKD86XFxcXFtcXFNcXHNdW15cIlxcXFxdKikqXCJ8J1teJ1xcXFxdKig/OlxcXFxbXFxTXFxzXVteJ1xcXFxdKikqJy9nLFxuXG4gICAgU19RQkxPQ0tTID0gUl9TVFJJTkdTLnNvdXJjZSArICd8JyArXG4gICAgICAvKD86XFxicmV0dXJuXFxzK3woPzpbJFxcd1xcKVxcXV18XFwrXFwrfC0tKVxccyooXFwvKSg/IVsqXFwvXSkpLy5zb3VyY2UgKyAnfCcgK1xuICAgICAgL1xcLyg/PVteKlxcL10pW15bXFwvXFxcXF0qKD86KD86XFxbKD86XFxcXC58W15cXF1cXFxcXSopKlxcXXxcXFxcLilbXltcXC9cXFxcXSopKj8oXFwvKVtnaW1dKi8uc291cmNlLFxuXG4gICAgVU5TVVBQT1JURUQgPSBSZWdFeHAoJ1tcXFxcJyArICd4MDAtXFxcXHgxRjw+YS16QS1aMC05XFwnXCIsO1xcXFxcXFxcXScpLFxuXG4gICAgTkVFRF9FU0NBUEUgPSAvKD89W1tcXF0oKSorPy5eJHxdKS9nLFxuXG4gICAgRklOREJSQUNFUyA9IHtcbiAgICAgICcoJzogUmVnRXhwKCcoWygpXSl8JyAgICsgU19RQkxPQ0tTLCBSRUdMT0IpLFxuICAgICAgJ1snOiBSZWdFeHAoJyhbW1xcXFxdXSl8JyArIFNfUUJMT0NLUywgUkVHTE9CKSxcbiAgICAgICd7JzogUmVnRXhwKCcoW3t9XSl8JyAgICsgU19RQkxPQ0tTLCBSRUdMT0IpXG4gICAgfSxcblxuICAgIERFRkFVTFQgPSAneyB9J1xuXG4gIHZhciBfcGFpcnMgPSBbXG4gICAgJ3snLCAnfScsXG4gICAgJ3snLCAnfScsXG4gICAgL3tbXn1dKn0vLFxuICAgIC9cXFxcKFt7fV0pL2csXG4gICAgL1xcXFwoeyl8ey9nLFxuICAgIFJlZ0V4cCgnXFxcXFxcXFwofSl8KFtbKHtdKXwofSl8JyArIFNfUUJMT0NLUywgUkVHTE9CKSxcbiAgICBERUZBVUxULFxuICAgIC9eXFxzKntcXF4/XFxzKihbJFxcd10rKSg/OlxccyosXFxzKihcXFMrKSk/XFxzK2luXFxzKyhcXFMuKilcXHMqfS8sXG4gICAgLyhefFteXFxcXF0pez1bXFxTXFxzXSo/fS9cbiAgXVxuXG4gIHZhclxuICAgIGNhY2hlZEJyYWNrZXRzID0gVU5ERUYsXG4gICAgX3JlZ2V4LFxuICAgIF9jYWNoZSA9IFtdLFxuICAgIF9zZXR0aW5nc1xuXG4gIGZ1bmN0aW9uIF9sb29wYmFjayAocmUpIHsgcmV0dXJuIHJlIH1cblxuICBmdW5jdGlvbiBfcmV3cml0ZSAocmUsIGJwKSB7XG4gICAgaWYgKCFicCkgYnAgPSBfY2FjaGVcbiAgICByZXR1cm4gbmV3IFJlZ0V4cChcbiAgICAgIHJlLnNvdXJjZS5yZXBsYWNlKC97L2csIGJwWzJdKS5yZXBsYWNlKC99L2csIGJwWzNdKSwgcmUuZ2xvYmFsID8gUkVHTE9CIDogJydcbiAgICApXG4gIH1cblxuICBmdW5jdGlvbiBfY3JlYXRlIChwYWlyKSB7XG4gICAgaWYgKHBhaXIgPT09IERFRkFVTFQpIHJldHVybiBfcGFpcnNcblxuICAgIHZhciBhcnIgPSBwYWlyLnNwbGl0KCcgJylcblxuICAgIGlmIChhcnIubGVuZ3RoICE9PSAyIHx8IFVOU1VQUE9SVEVELnRlc3QocGFpcikpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignVW5zdXBwb3J0ZWQgYnJhY2tldHMgXCInICsgcGFpciArICdcIicpXG4gICAgfVxuICAgIGFyciA9IGFyci5jb25jYXQocGFpci5yZXBsYWNlKE5FRURfRVNDQVBFLCAnXFxcXCcpLnNwbGl0KCcgJykpXG5cbiAgICBhcnJbNF0gPSBfcmV3cml0ZShhcnJbMV0ubGVuZ3RoID4gMSA/IC97W1xcU1xcc10qP30vIDogX3BhaXJzWzRdLCBhcnIpXG4gICAgYXJyWzVdID0gX3Jld3JpdGUocGFpci5sZW5ndGggPiAzID8gL1xcXFwoe3x9KS9nIDogX3BhaXJzWzVdLCBhcnIpXG4gICAgYXJyWzZdID0gX3Jld3JpdGUoX3BhaXJzWzZdLCBhcnIpXG4gICAgYXJyWzddID0gUmVnRXhwKCdcXFxcXFxcXCgnICsgYXJyWzNdICsgJyl8KFtbKHtdKXwoJyArIGFyclszXSArICcpfCcgKyBTX1FCTE9DS1MsIFJFR0xPQilcbiAgICBhcnJbOF0gPSBwYWlyXG4gICAgcmV0dXJuIGFyclxuICB9XG5cbiAgZnVuY3Rpb24gX2JyYWNrZXRzIChyZU9ySWR4KSB7XG4gICAgcmV0dXJuIHJlT3JJZHggaW5zdGFuY2VvZiBSZWdFeHAgPyBfcmVnZXgocmVPcklkeCkgOiBfY2FjaGVbcmVPcklkeF1cbiAgfVxuXG4gIF9icmFja2V0cy5zcGxpdCA9IGZ1bmN0aW9uIHNwbGl0IChzdHIsIHRtcGwsIF9icCkge1xuICAgIC8vIGlzdGFuYnVsIGlnbm9yZSBuZXh0OiBfYnAgaXMgZm9yIHRoZSBjb21waWxlclxuICAgIGlmICghX2JwKSBfYnAgPSBfY2FjaGVcblxuICAgIHZhclxuICAgICAgcGFydHMgPSBbXSxcbiAgICAgIG1hdGNoLFxuICAgICAgaXNleHByLFxuICAgICAgc3RhcnQsXG4gICAgICBwb3MsXG4gICAgICByZSA9IF9icFs2XVxuXG4gICAgaXNleHByID0gc3RhcnQgPSByZS5sYXN0SW5kZXggPSAwXG5cbiAgICB3aGlsZSAoKG1hdGNoID0gcmUuZXhlYyhzdHIpKSkge1xuXG4gICAgICBwb3MgPSBtYXRjaC5pbmRleFxuXG4gICAgICBpZiAoaXNleHByKSB7XG5cbiAgICAgICAgaWYgKG1hdGNoWzJdKSB7XG4gICAgICAgICAgcmUubGFzdEluZGV4ID0gc2tpcEJyYWNlcyhzdHIsIG1hdGNoWzJdLCByZS5sYXN0SW5kZXgpXG4gICAgICAgICAgY29udGludWVcbiAgICAgICAgfVxuICAgICAgICBpZiAoIW1hdGNoWzNdKSB7XG4gICAgICAgICAgY29udGludWVcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBpZiAoIW1hdGNoWzFdKSB7XG4gICAgICAgIHVuZXNjYXBlU3RyKHN0ci5zbGljZShzdGFydCwgcG9zKSlcbiAgICAgICAgc3RhcnQgPSByZS5sYXN0SW5kZXhcbiAgICAgICAgcmUgPSBfYnBbNiArIChpc2V4cHIgXj0gMSldXG4gICAgICAgIHJlLmxhc3RJbmRleCA9IHN0YXJ0XG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKHN0ciAmJiBzdGFydCA8IHN0ci5sZW5ndGgpIHtcbiAgICAgIHVuZXNjYXBlU3RyKHN0ci5zbGljZShzdGFydCkpXG4gICAgfVxuXG4gICAgcmV0dXJuIHBhcnRzXG5cbiAgICBmdW5jdGlvbiB1bmVzY2FwZVN0ciAocykge1xuICAgICAgaWYgKHRtcGwgfHwgaXNleHByKSB7XG4gICAgICAgIHBhcnRzLnB1c2gocyAmJiBzLnJlcGxhY2UoX2JwWzVdLCAnJDEnKSlcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHBhcnRzLnB1c2gocylcbiAgICAgIH1cbiAgICB9XG5cbiAgICBmdW5jdGlvbiBza2lwQnJhY2VzIChzLCBjaCwgaXgpIHtcbiAgICAgIHZhclxuICAgICAgICBtYXRjaCxcbiAgICAgICAgcmVjY2ggPSBGSU5EQlJBQ0VTW2NoXVxuXG4gICAgICByZWNjaC5sYXN0SW5kZXggPSBpeFxuICAgICAgaXggPSAxXG4gICAgICB3aGlsZSAoKG1hdGNoID0gcmVjY2guZXhlYyhzKSkpIHtcbiAgICAgICAgaWYgKG1hdGNoWzFdICYmXG4gICAgICAgICAgIShtYXRjaFsxXSA9PT0gY2ggPyArK2l4IDogLS1peCkpIGJyZWFrXG4gICAgICB9XG4gICAgICByZXR1cm4gaXggPyBzLmxlbmd0aCA6IHJlY2NoLmxhc3RJbmRleFxuICAgIH1cbiAgfVxuXG4gIF9icmFja2V0cy5oYXNFeHByID0gZnVuY3Rpb24gaGFzRXhwciAoc3RyKSB7XG4gICAgcmV0dXJuIF9jYWNoZVs0XS50ZXN0KHN0cilcbiAgfVxuXG4gIF9icmFja2V0cy5sb29wS2V5cyA9IGZ1bmN0aW9uIGxvb3BLZXlzIChleHByKSB7XG4gICAgdmFyIG0gPSBleHByLm1hdGNoKF9jYWNoZVs5XSlcblxuICAgIHJldHVybiBtXG4gICAgICA/IHsga2V5OiBtWzFdLCBwb3M6IG1bMl0sIHZhbDogX2NhY2hlWzBdICsgbVszXS50cmltKCkgKyBfY2FjaGVbMV0gfVxuICAgICAgOiB7IHZhbDogZXhwci50cmltKCkgfVxuICB9XG5cbiAgX2JyYWNrZXRzLmFycmF5ID0gZnVuY3Rpb24gYXJyYXkgKHBhaXIpIHtcbiAgICByZXR1cm4gcGFpciA/IF9jcmVhdGUocGFpcikgOiBfY2FjaGVcbiAgfVxuXG4gIGZ1bmN0aW9uIF9yZXNldCAocGFpcikge1xuICAgIGlmICgocGFpciB8fCAocGFpciA9IERFRkFVTFQpKSAhPT0gX2NhY2hlWzhdKSB7XG4gICAgICBfY2FjaGUgPSBfY3JlYXRlKHBhaXIpXG4gICAgICBfcmVnZXggPSBwYWlyID09PSBERUZBVUxUID8gX2xvb3BiYWNrIDogX3Jld3JpdGVcbiAgICAgIF9jYWNoZVs5XSA9IF9yZWdleChfcGFpcnNbOV0pXG4gICAgfVxuICAgIGNhY2hlZEJyYWNrZXRzID0gcGFpclxuICB9XG5cbiAgZnVuY3Rpb24gX3NldFNldHRpbmdzIChvKSB7XG4gICAgdmFyIGJcblxuICAgIG8gPSBvIHx8IHt9XG4gICAgYiA9IG8uYnJhY2tldHNcbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkobywgJ2JyYWNrZXRzJywge1xuICAgICAgc2V0OiBfcmVzZXQsXG4gICAgICBnZXQ6IGZ1bmN0aW9uICgpIHsgcmV0dXJuIGNhY2hlZEJyYWNrZXRzIH0sXG4gICAgICBlbnVtZXJhYmxlOiB0cnVlXG4gICAgfSlcbiAgICBfc2V0dGluZ3MgPSBvXG4gICAgX3Jlc2V0KGIpXG4gIH1cblxuICBPYmplY3QuZGVmaW5lUHJvcGVydHkoX2JyYWNrZXRzLCAnc2V0dGluZ3MnLCB7XG4gICAgc2V0OiBfc2V0U2V0dGluZ3MsXG4gICAgZ2V0OiBmdW5jdGlvbiAoKSB7IHJldHVybiBfc2V0dGluZ3MgfVxuICB9KVxuXG4gIC8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0OiBpbiB0aGUgYnJvd3NlciByaW90IGlzIGFsd2F5cyBpbiB0aGUgc2NvcGUgKi9cbiAgX2JyYWNrZXRzLnNldHRpbmdzID0gdHlwZW9mIHJpb3QgIT09ICd1bmRlZmluZWQnICYmIHJpb3Quc2V0dGluZ3MgfHwge31cbiAgX2JyYWNrZXRzLnNldCA9IF9yZXNldFxuXG4gIF9icmFja2V0cy5SX1NUUklOR1MgPSBSX1NUUklOR1NcbiAgX2JyYWNrZXRzLlJfTUxDT01NUyA9IFJfTUxDT01NU1xuICBfYnJhY2tldHMuU19RQkxPQ0tTID0gU19RQkxPQ0tTXG5cbiAgcmV0dXJuIF9icmFja2V0c1xuXG59KSgpXG5cbi8qKlxuICogQG1vZHVsZSB0bXBsXG4gKlxuICogdG1wbCAgICAgICAgICAtIFJvb3QgZnVuY3Rpb24sIHJldHVybnMgdGhlIHRlbXBsYXRlIHZhbHVlLCByZW5kZXIgd2l0aCBkYXRhXG4gKiB0bXBsLmhhc0V4cHIgIC0gVGVzdCB0aGUgZXhpc3RlbmNlIG9mIGEgZXhwcmVzc2lvbiBpbnNpZGUgYSBzdHJpbmdcbiAqIHRtcGwubG9vcEtleXMgLSBHZXQgdGhlIGtleXMgZm9yIGFuICdlYWNoJyBsb29wICh1c2VkIGJ5IGBfZWFjaGApXG4gKi9cblxudmFyIHRtcGwgPSAoZnVuY3Rpb24gKCkge1xuXG4gIHZhciBfY2FjaGUgPSB7fVxuXG4gIGZ1bmN0aW9uIF90bXBsIChzdHIsIGRhdGEpIHtcbiAgICBpZiAoIXN0cikgcmV0dXJuIHN0clxuXG4gICAgcmV0dXJuIChfY2FjaGVbc3RyXSB8fCAoX2NhY2hlW3N0cl0gPSBfY3JlYXRlKHN0cikpKS5jYWxsKGRhdGEsIF9sb2dFcnIpXG4gIH1cblxuICBfdG1wbC5oYXZlUmF3ID0gYnJhY2tldHMuaGFzUmF3XG5cbiAgX3RtcGwuaGFzRXhwciA9IGJyYWNrZXRzLmhhc0V4cHJcblxuICBfdG1wbC5sb29wS2V5cyA9IGJyYWNrZXRzLmxvb3BLZXlzXG5cbiAgLy8gaXN0YW5idWwgaWdub3JlIG5leHRcbiAgX3RtcGwuY2xlYXJDYWNoZSA9IGZ1bmN0aW9uICgpIHsgX2NhY2hlID0ge30gfVxuXG4gIF90bXBsLmVycm9ySGFuZGxlciA9IG51bGxcblxuICBmdW5jdGlvbiBfbG9nRXJyIChlcnIsIGN0eCkge1xuXG4gICAgaWYgKF90bXBsLmVycm9ySGFuZGxlcikge1xuXG4gICAgICBlcnIucmlvdERhdGEgPSB7XG4gICAgICAgIHRhZ05hbWU6IGN0eCAmJiBjdHgucm9vdCAmJiBjdHgucm9vdC50YWdOYW1lLFxuICAgICAgICBfcmlvdF9pZDogY3R4ICYmIGN0eC5fcmlvdF9pZCAgLy9lc2xpbnQtZGlzYWJsZS1saW5lIGNhbWVsY2FzZVxuICAgICAgfVxuICAgICAgX3RtcGwuZXJyb3JIYW5kbGVyKGVycilcbiAgICB9XG4gIH1cblxuICBmdW5jdGlvbiBfY3JlYXRlIChzdHIpIHtcbiAgICB2YXIgZXhwciA9IF9nZXRUbXBsKHN0cilcblxuICAgIGlmIChleHByLnNsaWNlKDAsIDExKSAhPT0gJ3RyeXtyZXR1cm4gJykgZXhwciA9ICdyZXR1cm4gJyArIGV4cHJcblxuICAgIHJldHVybiBuZXcgRnVuY3Rpb24oJ0UnLCBleHByICsgJzsnKSAgICAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIG5vLW5ldy1mdW5jXG4gIH1cblxuICB2YXJcbiAgICBDSF9JREVYUFIgPSBTdHJpbmcuZnJvbUNoYXJDb2RlKDB4MjA1NyksXG4gICAgUkVfQ1NOQU1FID0gL14oPzooLT9bX0EtWmEtelxceEEwLVxceEZGXVstXFx3XFx4QTAtXFx4RkZdKil8XFx1MjA1NyhcXGQrKX4pOi8sXG4gICAgUkVfUUJMT0NLID0gUmVnRXhwKGJyYWNrZXRzLlNfUUJMT0NLUywgJ2cnKSxcbiAgICBSRV9EUVVPVEUgPSAvXFx1MjA1Ny9nLFxuICAgIFJFX1FCTUFSSyA9IC9cXHUyMDU3KFxcZCspfi9nXG5cbiAgZnVuY3Rpb24gX2dldFRtcGwgKHN0cikge1xuICAgIHZhclxuICAgICAgcXN0ciA9IFtdLFxuICAgICAgZXhwcixcbiAgICAgIHBhcnRzID0gYnJhY2tldHMuc3BsaXQoc3RyLnJlcGxhY2UoUkVfRFFVT1RFLCAnXCInKSwgMSlcblxuICAgIGlmIChwYXJ0cy5sZW5ndGggPiAyIHx8IHBhcnRzWzBdKSB7XG4gICAgICB2YXIgaSwgaiwgbGlzdCA9IFtdXG5cbiAgICAgIGZvciAoaSA9IGogPSAwOyBpIDwgcGFydHMubGVuZ3RoOyArK2kpIHtcblxuICAgICAgICBleHByID0gcGFydHNbaV1cblxuICAgICAgICBpZiAoZXhwciAmJiAoZXhwciA9IGkgJiAxXG5cbiAgICAgICAgICAgID8gX3BhcnNlRXhwcihleHByLCAxLCBxc3RyKVxuXG4gICAgICAgICAgICA6ICdcIicgKyBleHByXG4gICAgICAgICAgICAgICAgLnJlcGxhY2UoL1xcXFwvZywgJ1xcXFxcXFxcJylcbiAgICAgICAgICAgICAgICAucmVwbGFjZSgvXFxyXFxuP3xcXG4vZywgJ1xcXFxuJylcbiAgICAgICAgICAgICAgICAucmVwbGFjZSgvXCIvZywgJ1xcXFxcIicpICtcbiAgICAgICAgICAgICAgJ1wiJ1xuXG4gICAgICAgICAgKSkgbGlzdFtqKytdID0gZXhwclxuXG4gICAgICB9XG5cbiAgICAgIGV4cHIgPSBqIDwgMiA/IGxpc3RbMF1cbiAgICAgICAgICAgOiAnWycgKyBsaXN0LmpvaW4oJywnKSArICddLmpvaW4oXCJcIiknXG5cbiAgICB9IGVsc2Uge1xuXG4gICAgICBleHByID0gX3BhcnNlRXhwcihwYXJ0c1sxXSwgMCwgcXN0cilcbiAgICB9XG5cbiAgICBpZiAocXN0clswXSkge1xuICAgICAgZXhwciA9IGV4cHIucmVwbGFjZShSRV9RQk1BUkssIGZ1bmN0aW9uIChfLCBwb3MpIHtcbiAgICAgICAgcmV0dXJuIHFzdHJbcG9zXVxuICAgICAgICAgIC5yZXBsYWNlKC9cXHIvZywgJ1xcXFxyJylcbiAgICAgICAgICAucmVwbGFjZSgvXFxuL2csICdcXFxcbicpXG4gICAgICB9KVxuICAgIH1cbiAgICByZXR1cm4gZXhwclxuICB9XG5cbiAgdmFyXG4gICAgUkVfQlJFTkQgPSB7XG4gICAgICAnKCc6IC9bKCldL2csXG4gICAgICAnWyc6IC9bW1xcXV0vZyxcbiAgICAgICd7JzogL1t7fV0vZ1xuICAgIH1cblxuICBmdW5jdGlvbiBfcGFyc2VFeHByIChleHByLCBhc1RleHQsIHFzdHIpIHtcblxuICAgIGV4cHIgPSBleHByXG4gICAgICAgICAgLnJlcGxhY2UoUkVfUUJMT0NLLCBmdW5jdGlvbiAocywgZGl2KSB7XG4gICAgICAgICAgICByZXR1cm4gcy5sZW5ndGggPiAyICYmICFkaXYgPyBDSF9JREVYUFIgKyAocXN0ci5wdXNoKHMpIC0gMSkgKyAnficgOiBzXG4gICAgICAgICAgfSlcbiAgICAgICAgICAucmVwbGFjZSgvXFxzKy9nLCAnICcpLnRyaW0oKVxuICAgICAgICAgIC5yZXBsYWNlKC9cXCA/KFtbXFwoe30sP1xcLjpdKVxcID8vZywgJyQxJylcblxuICAgIGlmIChleHByKSB7XG4gICAgICB2YXJcbiAgICAgICAgbGlzdCA9IFtdLFxuICAgICAgICBjbnQgPSAwLFxuICAgICAgICBtYXRjaFxuXG4gICAgICB3aGlsZSAoZXhwciAmJlxuICAgICAgICAgICAgKG1hdGNoID0gZXhwci5tYXRjaChSRV9DU05BTUUpKSAmJlxuICAgICAgICAgICAgIW1hdGNoLmluZGV4XG4gICAgICAgICkge1xuICAgICAgICB2YXJcbiAgICAgICAgICBrZXksXG4gICAgICAgICAganNiLFxuICAgICAgICAgIHJlID0gLyx8KFtbeyhdKXwkL2dcblxuICAgICAgICBleHByID0gUmVnRXhwLnJpZ2h0Q29udGV4dFxuICAgICAgICBrZXkgID0gbWF0Y2hbMl0gPyBxc3RyW21hdGNoWzJdXS5zbGljZSgxLCAtMSkudHJpbSgpLnJlcGxhY2UoL1xccysvZywgJyAnKSA6IG1hdGNoWzFdXG5cbiAgICAgICAgd2hpbGUgKGpzYiA9IChtYXRjaCA9IHJlLmV4ZWMoZXhwcikpWzFdKSBza2lwQnJhY2VzKGpzYiwgcmUpXG5cbiAgICAgICAganNiICA9IGV4cHIuc2xpY2UoMCwgbWF0Y2guaW5kZXgpXG4gICAgICAgIGV4cHIgPSBSZWdFeHAucmlnaHRDb250ZXh0XG5cbiAgICAgICAgbGlzdFtjbnQrK10gPSBfd3JhcEV4cHIoanNiLCAxLCBrZXkpXG4gICAgICB9XG5cbiAgICAgIGV4cHIgPSAhY250ID8gX3dyYXBFeHByKGV4cHIsIGFzVGV4dClcbiAgICAgICAgICAgOiBjbnQgPiAxID8gJ1snICsgbGlzdC5qb2luKCcsJykgKyAnXS5qb2luKFwiIFwiKS50cmltKCknIDogbGlzdFswXVxuICAgIH1cbiAgICByZXR1cm4gZXhwclxuXG4gICAgZnVuY3Rpb24gc2tpcEJyYWNlcyAoY2gsIHJlKSB7XG4gICAgICB2YXJcbiAgICAgICAgbW0sXG4gICAgICAgIGx2ID0gMSxcbiAgICAgICAgaXIgPSBSRV9CUkVORFtjaF1cblxuICAgICAgaXIubGFzdEluZGV4ID0gcmUubGFzdEluZGV4XG4gICAgICB3aGlsZSAobW0gPSBpci5leGVjKGV4cHIpKSB7XG4gICAgICAgIGlmIChtbVswXSA9PT0gY2gpICsrbHZcbiAgICAgICAgZWxzZSBpZiAoIS0tbHYpIGJyZWFrXG4gICAgICB9XG4gICAgICByZS5sYXN0SW5kZXggPSBsdiA/IGV4cHIubGVuZ3RoIDogaXIubGFzdEluZGV4XG4gICAgfVxuICB9XG5cbiAgLy8gaXN0YW5idWwgaWdub3JlIG5leHQ6IG5vdCBib3RoXG4gIHZhciAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbWF4LWxlblxuICAgIEpTX0NPTlRFWFQgPSAnXCJpbiB0aGlzP3RoaXM6JyArICh0eXBlb2Ygd2luZG93ICE9PSAnb2JqZWN0JyA/ICdnbG9iYWwnIDogJ3dpbmRvdycpICsgJykuJyxcbiAgICBKU19WQVJOQU1FID0gL1sse11bXFwkXFx3XSsoPz06KXwoXiAqfFteJFxcd1xcLntdKSg/ISg/OnR5cGVvZnx0cnVlfGZhbHNlfG51bGx8dW5kZWZpbmVkfGlufGluc3RhbmNlb2Z8aXMoPzpGaW5pdGV8TmFOKXx2b2lkfE5hTnxuZXd8RGF0ZXxSZWdFeHB8TWF0aCkoPyFbJFxcd10pKShbJF9BLVphLXpdWyRcXHddKikvZyxcbiAgICBKU19OT1BST1BTID0gL14oPz0oXFwuWyRcXHddKykpXFwxKD86W14uWyhdfCQpL1xuXG4gIGZ1bmN0aW9uIF93cmFwRXhwciAoZXhwciwgYXNUZXh0LCBrZXkpIHtcbiAgICB2YXIgdGJcblxuICAgIGV4cHIgPSBleHByLnJlcGxhY2UoSlNfVkFSTkFNRSwgZnVuY3Rpb24gKG1hdGNoLCBwLCBtdmFyLCBwb3MsIHMpIHtcbiAgICAgIGlmIChtdmFyKSB7XG4gICAgICAgIHBvcyA9IHRiID8gMCA6IHBvcyArIG1hdGNoLmxlbmd0aFxuXG4gICAgICAgIGlmIChtdmFyICE9PSAndGhpcycgJiYgbXZhciAhPT0gJ2dsb2JhbCcgJiYgbXZhciAhPT0gJ3dpbmRvdycpIHtcbiAgICAgICAgICBtYXRjaCA9IHAgKyAnKFwiJyArIG12YXIgKyBKU19DT05URVhUICsgbXZhclxuICAgICAgICAgIGlmIChwb3MpIHRiID0gKHMgPSBzW3Bvc10pID09PSAnLicgfHwgcyA9PT0gJygnIHx8IHMgPT09ICdbJ1xuICAgICAgICB9IGVsc2UgaWYgKHBvcykge1xuICAgICAgICAgIHRiID0gIUpTX05PUFJPUFMudGVzdChzLnNsaWNlKHBvcykpXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHJldHVybiBtYXRjaFxuICAgIH0pXG5cbiAgICBpZiAodGIpIHtcbiAgICAgIGV4cHIgPSAndHJ5e3JldHVybiAnICsgZXhwciArICd9Y2F0Y2goZSl7RShlLHRoaXMpfSdcbiAgICB9XG5cbiAgICBpZiAoa2V5KSB7XG5cbiAgICAgIGV4cHIgPSAodGJcbiAgICAgICAgICA/ICdmdW5jdGlvbigpeycgKyBleHByICsgJ30uY2FsbCh0aGlzKScgOiAnKCcgKyBleHByICsgJyknXG4gICAgICAgICkgKyAnP1wiJyArIGtleSArICdcIjpcIlwiJ1xuXG4gICAgfSBlbHNlIGlmIChhc1RleHQpIHtcblxuICAgICAgZXhwciA9ICdmdW5jdGlvbih2KXsnICsgKHRiXG4gICAgICAgICAgPyBleHByLnJlcGxhY2UoJ3JldHVybiAnLCAndj0nKSA6ICd2PSgnICsgZXhwciArICcpJ1xuICAgICAgICApICsgJztyZXR1cm4gdnx8dj09PTA/djpcIlwifS5jYWxsKHRoaXMpJ1xuICAgIH1cblxuICAgIHJldHVybiBleHByXG4gIH1cblxuICBfdG1wbC52ZXJzaW9uID0gYnJhY2tldHMudmVyc2lvbiA9ICd2Mi40LjInXG5cbiAgcmV0dXJuIF90bXBsXG5cbn0pKClcblxuLypcbiAgbGliL2Jyb3dzZXIvdGFnL21rZG9tLmpzXG5cbiAgSW5jbHVkZXMgaGFja3MgbmVlZGVkIGZvciB0aGUgSW50ZXJuZXQgRXhwbG9yZXIgdmVyc2lvbiA5IGFuZCBiZWxvd1xuICBTZWU6IGh0dHA6Ly9rYW5nYXguZ2l0aHViLmlvL2NvbXBhdC10YWJsZS9lczUvI2llOFxuICAgICAgIGh0dHA6Ly9jb2RlcGxhbmV0LmlvL2Ryb3BwaW5nLWllOC9cbiovXG52YXIgbWtkb20gPSAoZnVuY3Rpb24gX21rZG9tKCkge1xuICB2YXJcbiAgICByZUhhc1lpZWxkICA9IC88eWllbGRcXGIvaSxcbiAgICByZVlpZWxkQWxsICA9IC88eWllbGRcXHMqKD86XFwvPnw+KFtcXFNcXHNdKj8pPFxcL3lpZWxkXFxzKj58PikvaWcsXG4gICAgcmVZaWVsZFNyYyAgPSAvPHlpZWxkXFxzK3RvPVsnXCJdKFteJ1wiPl0qKVsnXCJdXFxzKj4oW1xcU1xcc10qPyk8XFwveWllbGRcXHMqPi9pZyxcbiAgICByZVlpZWxkRGVzdCA9IC88eWllbGRcXHMrZnJvbT1bJ1wiXT8oWy1cXHddKylbJ1wiXT9cXHMqKD86XFwvPnw+KFtcXFNcXHNdKj8pPFxcL3lpZWxkXFxzKj4pL2lnXG4gIHZhclxuICAgIHJvb3RFbHMgPSB7IHRyOiAndGJvZHknLCB0aDogJ3RyJywgdGQ6ICd0cicsIGNvbDogJ2NvbGdyb3VwJyB9LFxuICAgIHRibFRhZ3MgPSBJRV9WRVJTSU9OICYmIElFX1ZFUlNJT04gPCAxMFxuICAgICAgPyBTUEVDSUFMX1RBR1NfUkVHRVggOiAvXig/OnQoPzpib2R5fGhlYWR8Zm9vdHxbcmhkXSl8Y2FwdGlvbnxjb2woPzpncm91cCk/KSQvXG5cbiAgLyoqXG4gICAqIENyZWF0ZXMgYSBET00gZWxlbWVudCB0byB3cmFwIHRoZSBnaXZlbiBjb250ZW50LiBOb3JtYWxseSBhbiBgRElWYCwgYnV0IGNhbiBiZVxuICAgKiBhbHNvIGEgYFRBQkxFYCwgYFNFTEVDVGAsIGBUQk9EWWAsIGBUUmAsIG9yIGBDT0xHUk9VUGAgZWxlbWVudC5cbiAgICpcbiAgICogQHBhcmFtICAge3N0cmluZ30gdGVtcGwgIC0gVGhlIHRlbXBsYXRlIGNvbWluZyBmcm9tIHRoZSBjdXN0b20gdGFnIGRlZmluaXRpb25cbiAgICogQHBhcmFtICAge3N0cmluZ30gW2h0bWxdIC0gSFRNTCBjb250ZW50IHRoYXQgY29tZXMgZnJvbSB0aGUgRE9NIGVsZW1lbnQgd2hlcmUgeW91XG4gICAqICAgICAgICAgICB3aWxsIG1vdW50IHRoZSB0YWcsIG1vc3RseSB0aGUgb3JpZ2luYWwgdGFnIGluIHRoZSBwYWdlXG4gICAqIEByZXR1cm5zIHtIVE1MRWxlbWVudH0gRE9NIGVsZW1lbnQgd2l0aCBfdGVtcGxfIG1lcmdlZCB0aHJvdWdoIGBZSUVMRGAgd2l0aCB0aGUgX2h0bWxfLlxuICAgKi9cbiAgZnVuY3Rpb24gX21rZG9tKHRlbXBsLCBodG1sKSB7XG4gICAgdmFyXG4gICAgICBtYXRjaCAgID0gdGVtcGwgJiYgdGVtcGwubWF0Y2goL15cXHMqPChbLVxcd10rKS8pLFxuICAgICAgdGFnTmFtZSA9IG1hdGNoICYmIG1hdGNoWzFdLnRvTG93ZXJDYXNlKCksXG4gICAgICBlbCA9IG1rRWwoJ2RpdicsIGlzU1ZHVGFnKHRhZ05hbWUpKVxuXG4gICAgLy8gcmVwbGFjZSBhbGwgdGhlIHlpZWxkIHRhZ3Mgd2l0aCB0aGUgdGFnIGlubmVyIGh0bWxcbiAgICB0ZW1wbCA9IHJlcGxhY2VZaWVsZCh0ZW1wbCwgaHRtbClcblxuICAgIC8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICovXG4gICAgaWYgKHRibFRhZ3MudGVzdCh0YWdOYW1lKSlcbiAgICAgIGVsID0gc3BlY2lhbFRhZ3MoZWwsIHRlbXBsLCB0YWdOYW1lKVxuICAgIGVsc2VcbiAgICAgIHNldElubmVySFRNTChlbCwgdGVtcGwpXG5cbiAgICBlbC5zdHViID0gdHJ1ZVxuXG4gICAgcmV0dXJuIGVsXG4gIH1cblxuICAvKlxuICAgIENyZWF0ZXMgdGhlIHJvb3QgZWxlbWVudCBmb3IgdGFibGUgb3Igc2VsZWN0IGNoaWxkIGVsZW1lbnRzOlxuICAgIHRyL3RoL3RkL3RoZWFkL3Rmb290L3Rib2R5L2NhcHRpb24vY29sL2NvbGdyb3VwL29wdGlvbi9vcHRncm91cFxuICAqL1xuICBmdW5jdGlvbiBzcGVjaWFsVGFncyhlbCwgdGVtcGwsIHRhZ05hbWUpIHtcbiAgICB2YXJcbiAgICAgIHNlbGVjdCA9IHRhZ05hbWVbMF0gPT09ICdvJyxcbiAgICAgIHBhcmVudCA9IHNlbGVjdCA/ICdzZWxlY3Q+JyA6ICd0YWJsZT4nXG5cbiAgICAvLyB0cmltKCkgaXMgaW1wb3J0YW50IGhlcmUsIHRoaXMgZW5zdXJlcyB3ZSBkb24ndCBoYXZlIGFydGlmYWN0cyxcbiAgICAvLyBzbyB3ZSBjYW4gY2hlY2sgaWYgd2UgaGF2ZSBvbmx5IG9uZSBlbGVtZW50IGluc2lkZSB0aGUgcGFyZW50XG4gICAgZWwuaW5uZXJIVE1MID0gJzwnICsgcGFyZW50ICsgdGVtcGwudHJpbSgpICsgJzwvJyArIHBhcmVudFxuICAgIHBhcmVudCA9IGVsLmZpcnN0Q2hpbGRcblxuICAgIC8vIHJldHVybnMgdGhlIGltbWVkaWF0ZSBwYXJlbnQgaWYgdHIvdGgvdGQvY29sIGlzIHRoZSBvbmx5IGVsZW1lbnQsIGlmIG5vdFxuICAgIC8vIHJldHVybnMgdGhlIHdob2xlIHRyZWUsIGFzIHRoaXMgY2FuIGluY2x1ZGUgYWRkaXRpb25hbCBlbGVtZW50c1xuICAgIGlmIChzZWxlY3QpIHtcbiAgICAgIHBhcmVudC5zZWxlY3RlZEluZGV4ID0gLTEgIC8vIGZvciBJRTksIGNvbXBhdGlibGUgdy9jdXJyZW50IHJpb3QgYmVoYXZpb3JcbiAgICB9IGVsc2Uge1xuICAgICAgLy8gYXZvaWRzIGluc2VydGlvbiBvZiBjb2ludGFpbmVyIGluc2lkZSBjb250YWluZXIgKGV4OiB0Ym9keSBpbnNpZGUgdGJvZHkpXG4gICAgICB2YXIgdG5hbWUgPSByb290RWxzW3RhZ05hbWVdXG4gICAgICBpZiAodG5hbWUgJiYgcGFyZW50LmNoaWxkRWxlbWVudENvdW50ID09PSAxKSBwYXJlbnQgPSAkKHRuYW1lLCBwYXJlbnQpXG4gICAgfVxuICAgIHJldHVybiBwYXJlbnRcbiAgfVxuXG4gIC8qXG4gICAgUmVwbGFjZSB0aGUgeWllbGQgdGFnIGZyb20gYW55IHRhZyB0ZW1wbGF0ZSB3aXRoIHRoZSBpbm5lckhUTUwgb2YgdGhlXG4gICAgb3JpZ2luYWwgdGFnIGluIHRoZSBwYWdlXG4gICovXG4gIGZ1bmN0aW9uIHJlcGxhY2VZaWVsZCh0ZW1wbCwgaHRtbCkge1xuICAgIC8vIGRvIG5vdGhpbmcgaWYgbm8geWllbGRcbiAgICBpZiAoIXJlSGFzWWllbGQudGVzdCh0ZW1wbCkpIHJldHVybiB0ZW1wbFxuXG4gICAgLy8gYmUgY2FyZWZ1bCB3aXRoICMxMzQzIC0gc3RyaW5nIG9uIHRoZSBzb3VyY2UgaGF2aW5nIGAkMWBcbiAgICB2YXIgc3JjID0ge31cblxuICAgIGh0bWwgPSBodG1sICYmIGh0bWwucmVwbGFjZShyZVlpZWxkU3JjLCBmdW5jdGlvbiAoXywgcmVmLCB0ZXh0KSB7XG4gICAgICBzcmNbcmVmXSA9IHNyY1tyZWZdIHx8IHRleHQgICAvLyBwcmVzZXJ2ZSBmaXJzdCBkZWZpbml0aW9uXG4gICAgICByZXR1cm4gJydcbiAgICB9KS50cmltKClcblxuICAgIHJldHVybiB0ZW1wbFxuICAgICAgLnJlcGxhY2UocmVZaWVsZERlc3QsIGZ1bmN0aW9uIChfLCByZWYsIGRlZikgeyAgLy8geWllbGQgd2l0aCBmcm9tIC0gdG8gYXR0cnNcbiAgICAgICAgcmV0dXJuIHNyY1tyZWZdIHx8IGRlZiB8fCAnJ1xuICAgICAgfSlcbiAgICAgIC5yZXBsYWNlKHJlWWllbGRBbGwsIGZ1bmN0aW9uIChfLCBkZWYpIHsgICAgICAgIC8vIHlpZWxkIHdpdGhvdXQgYW55IFwiZnJvbVwiXG4gICAgICAgIHJldHVybiBodG1sIHx8IGRlZiB8fCAnJ1xuICAgICAgfSlcbiAgfVxuXG4gIHJldHVybiBfbWtkb21cblxufSkoKVxuXG4vKipcbiAqIENvbnZlcnQgdGhlIGl0ZW0gbG9vcGVkIGludG8gYW4gb2JqZWN0IHVzZWQgdG8gZXh0ZW5kIHRoZSBjaGlsZCB0YWcgcHJvcGVydGllc1xuICogQHBhcmFtICAgeyBPYmplY3QgfSBleHByIC0gb2JqZWN0IGNvbnRhaW5pbmcgdGhlIGtleXMgdXNlZCB0byBleHRlbmQgdGhlIGNoaWxkcmVuIHRhZ3NcbiAqIEBwYXJhbSAgIHsgKiB9IGtleSAtIHZhbHVlIHRvIGFzc2lnbiB0byB0aGUgbmV3IG9iamVjdCByZXR1cm5lZFxuICogQHBhcmFtICAgeyAqIH0gdmFsIC0gdmFsdWUgY29udGFpbmluZyB0aGUgcG9zaXRpb24gb2YgdGhlIGl0ZW0gaW4gdGhlIGFycmF5XG4gKiBAcmV0dXJucyB7IE9iamVjdCB9IC0gbmV3IG9iamVjdCBjb250YWluaW5nIHRoZSB2YWx1ZXMgb2YgdGhlIG9yaWdpbmFsIGl0ZW1cbiAqXG4gKiBUaGUgdmFyaWFibGVzICdrZXknIGFuZCAndmFsJyBhcmUgYXJiaXRyYXJ5LlxuICogVGhleSBkZXBlbmQgb24gdGhlIGNvbGxlY3Rpb24gdHlwZSBsb29wZWQgKEFycmF5LCBPYmplY3QpXG4gKiBhbmQgb24gdGhlIGV4cHJlc3Npb24gdXNlZCBvbiB0aGUgZWFjaCB0YWdcbiAqXG4gKi9cbmZ1bmN0aW9uIG1raXRlbShleHByLCBrZXksIHZhbCkge1xuICB2YXIgaXRlbSA9IHt9XG4gIGl0ZW1bZXhwci5rZXldID0ga2V5XG4gIGlmIChleHByLnBvcykgaXRlbVtleHByLnBvc10gPSB2YWxcbiAgcmV0dXJuIGl0ZW1cbn1cblxuLyoqXG4gKiBVbm1vdW50IHRoZSByZWR1bmRhbnQgdGFnc1xuICogQHBhcmFtICAgeyBBcnJheSB9IGl0ZW1zIC0gYXJyYXkgY29udGFpbmluZyB0aGUgY3VycmVudCBpdGVtcyB0byBsb29wXG4gKiBAcGFyYW0gICB7IEFycmF5IH0gdGFncyAtIGFycmF5IGNvbnRhaW5pbmcgYWxsIHRoZSBjaGlsZHJlbiB0YWdzXG4gKi9cbmZ1bmN0aW9uIHVubW91bnRSZWR1bmRhbnQoaXRlbXMsIHRhZ3MpIHtcblxuICB2YXIgaSA9IHRhZ3MubGVuZ3RoLFxuICAgIGogPSBpdGVtcy5sZW5ndGgsXG4gICAgdFxuXG4gIHdoaWxlIChpID4gaikge1xuICAgIHQgPSB0YWdzWy0taV1cbiAgICB0YWdzLnNwbGljZShpLCAxKVxuICAgIHQudW5tb3VudCgpXG4gIH1cbn1cblxuLyoqXG4gKiBNb3ZlIHRoZSBuZXN0ZWQgY3VzdG9tIHRhZ3MgaW4gbm9uIGN1c3RvbSBsb29wIHRhZ3NcbiAqIEBwYXJhbSAgIHsgT2JqZWN0IH0gY2hpbGQgLSBub24gY3VzdG9tIGxvb3AgdGFnXG4gKiBAcGFyYW0gICB7IE51bWJlciB9IGkgLSBjdXJyZW50IHBvc2l0aW9uIG9mIHRoZSBsb29wIHRhZ1xuICovXG5mdW5jdGlvbiBtb3ZlTmVzdGVkVGFncyhjaGlsZCwgaSkge1xuICBPYmplY3Qua2V5cyhjaGlsZC50YWdzKS5mb3JFYWNoKGZ1bmN0aW9uKHRhZ05hbWUpIHtcbiAgICB2YXIgdGFnID0gY2hpbGQudGFnc1t0YWdOYW1lXVxuICAgIGlmIChpc0FycmF5KHRhZykpXG4gICAgICBlYWNoKHRhZywgZnVuY3Rpb24gKHQpIHtcbiAgICAgICAgbW92ZUNoaWxkVGFnKHQsIHRhZ05hbWUsIGkpXG4gICAgICB9KVxuICAgIGVsc2VcbiAgICAgIG1vdmVDaGlsZFRhZyh0YWcsIHRhZ05hbWUsIGkpXG4gIH0pXG59XG5cbi8qKlxuICogQWRkcyB0aGUgZWxlbWVudHMgZm9yIGEgdmlydHVhbCB0YWdcbiAqIEBwYXJhbSB7IFRhZyB9IHRhZyAtIHRoZSB0YWcgd2hvc2Ugcm9vdCdzIGNoaWxkcmVuIHdpbGwgYmUgaW5zZXJ0ZWQgb3IgYXBwZW5kZWRcbiAqIEBwYXJhbSB7IE5vZGUgfSBzcmMgLSB0aGUgbm9kZSB0aGF0IHdpbGwgZG8gdGhlIGluc2VydGluZyBvciBhcHBlbmRpbmdcbiAqIEBwYXJhbSB7IFRhZyB9IHRhcmdldCAtIG9ubHkgaWYgaW5zZXJ0aW5nLCBpbnNlcnQgYmVmb3JlIHRoaXMgdGFnJ3MgZmlyc3QgY2hpbGRcbiAqL1xuZnVuY3Rpb24gYWRkVmlydHVhbCh0YWcsIHNyYywgdGFyZ2V0KSB7XG4gIHZhciBlbCA9IHRhZy5fcm9vdCwgc2liXG4gIHRhZy5fdmlydHMgPSBbXVxuICB3aGlsZSAoZWwpIHtcbiAgICBzaWIgPSBlbC5uZXh0U2libGluZ1xuICAgIGlmICh0YXJnZXQpXG4gICAgICBzcmMuaW5zZXJ0QmVmb3JlKGVsLCB0YXJnZXQuX3Jvb3QpXG4gICAgZWxzZVxuICAgICAgc3JjLmFwcGVuZENoaWxkKGVsKVxuXG4gICAgdGFnLl92aXJ0cy5wdXNoKGVsKSAvLyBob2xkIGZvciB1bm1vdW50aW5nXG4gICAgZWwgPSBzaWJcbiAgfVxufVxuXG4vKipcbiAqIE1vdmUgdmlydHVhbCB0YWcgYW5kIGFsbCBjaGlsZCBub2Rlc1xuICogQHBhcmFtIHsgVGFnIH0gdGFnIC0gZmlyc3QgY2hpbGQgcmVmZXJlbmNlIHVzZWQgdG8gc3RhcnQgbW92ZVxuICogQHBhcmFtIHsgTm9kZSB9IHNyYyAgLSB0aGUgbm9kZSB0aGF0IHdpbGwgZG8gdGhlIGluc2VydGluZ1xuICogQHBhcmFtIHsgVGFnIH0gdGFyZ2V0IC0gaW5zZXJ0IGJlZm9yZSB0aGlzIHRhZydzIGZpcnN0IGNoaWxkXG4gKiBAcGFyYW0geyBOdW1iZXIgfSBsZW4gLSBob3cgbWFueSBjaGlsZCBub2RlcyB0byBtb3ZlXG4gKi9cbmZ1bmN0aW9uIG1vdmVWaXJ0dWFsKHRhZywgc3JjLCB0YXJnZXQsIGxlbikge1xuICB2YXIgZWwgPSB0YWcuX3Jvb3QsIHNpYiwgaSA9IDBcbiAgZm9yICg7IGkgPCBsZW47IGkrKykge1xuICAgIHNpYiA9IGVsLm5leHRTaWJsaW5nXG4gICAgc3JjLmluc2VydEJlZm9yZShlbCwgdGFyZ2V0Ll9yb290KVxuICAgIGVsID0gc2liXG4gIH1cbn1cblxuXG4vKipcbiAqIE1hbmFnZSB0YWdzIGhhdmluZyB0aGUgJ2VhY2gnXG4gKiBAcGFyYW0gICB7IE9iamVjdCB9IGRvbSAtIERPTSBub2RlIHdlIG5lZWQgdG8gbG9vcFxuICogQHBhcmFtICAgeyBUYWcgfSBwYXJlbnQgLSBwYXJlbnQgdGFnIGluc3RhbmNlIHdoZXJlIHRoZSBkb20gbm9kZSBpcyBjb250YWluZWRcbiAqIEBwYXJhbSAgIHsgU3RyaW5nIH0gZXhwciAtIHN0cmluZyBjb250YWluZWQgaW4gdGhlICdlYWNoJyBhdHRyaWJ1dGVcbiAqL1xuZnVuY3Rpb24gX2VhY2goZG9tLCBwYXJlbnQsIGV4cHIpIHtcblxuICAvLyByZW1vdmUgdGhlIGVhY2ggcHJvcGVydHkgZnJvbSB0aGUgb3JpZ2luYWwgdGFnXG4gIHJlbUF0dHIoZG9tLCAnZWFjaCcpXG5cbiAgdmFyIG11c3RSZW9yZGVyID0gdHlwZW9mIGdldEF0dHIoZG9tLCAnbm8tcmVvcmRlcicpICE9PSBUX1NUUklORyB8fCByZW1BdHRyKGRvbSwgJ25vLXJlb3JkZXInKSxcbiAgICB0YWdOYW1lID0gZ2V0VGFnTmFtZShkb20pLFxuICAgIGltcGwgPSBfX3RhZ0ltcGxbdGFnTmFtZV0gfHwgeyB0bXBsOiBnZXRPdXRlckhUTUwoZG9tKSB9LFxuICAgIHVzZVJvb3QgPSBTUEVDSUFMX1RBR1NfUkVHRVgudGVzdCh0YWdOYW1lKSxcbiAgICByb290ID0gZG9tLnBhcmVudE5vZGUsXG4gICAgcmVmID0gZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUoJycpLFxuICAgIGNoaWxkID0gZ2V0VGFnKGRvbSksXG4gICAgaXNPcHRpb24gPSB0YWdOYW1lLnRvTG93ZXJDYXNlKCkgPT09ICdvcHRpb24nLCAvLyB0aGUgb3B0aW9uIHRhZ3MgbXVzdCBiZSB0cmVhdGVkIGRpZmZlcmVudGx5XG4gICAgdGFncyA9IFtdLFxuICAgIG9sZEl0ZW1zID0gW10sXG4gICAgaGFzS2V5cyxcbiAgICBpc1ZpcnR1YWwgPSBkb20udGFnTmFtZSA9PSAnVklSVFVBTCdcblxuICAvLyBwYXJzZSB0aGUgZWFjaCBleHByZXNzaW9uXG4gIGV4cHIgPSB0bXBsLmxvb3BLZXlzKGV4cHIpXG5cbiAgLy8gaW5zZXJ0IGEgbWFya2VkIHdoZXJlIHRoZSBsb29wIHRhZ3Mgd2lsbCBiZSBpbmplY3RlZFxuICByb290Lmluc2VydEJlZm9yZShyZWYsIGRvbSlcblxuICAvLyBjbGVhbiB0ZW1wbGF0ZSBjb2RlXG4gIHBhcmVudC5vbmUoJ2JlZm9yZS1tb3VudCcsIGZ1bmN0aW9uICgpIHtcblxuICAgIC8vIHJlbW92ZSB0aGUgb3JpZ2luYWwgRE9NIG5vZGVcbiAgICBkb20ucGFyZW50Tm9kZS5yZW1vdmVDaGlsZChkb20pXG4gICAgaWYgKHJvb3Quc3R1Yikgcm9vdCA9IHBhcmVudC5yb290XG5cbiAgfSkub24oJ3VwZGF0ZScsIGZ1bmN0aW9uICgpIHtcbiAgICAvLyBnZXQgdGhlIG5ldyBpdGVtcyBjb2xsZWN0aW9uXG4gICAgdmFyIGl0ZW1zID0gdG1wbChleHByLnZhbCwgcGFyZW50KSxcbiAgICAgIC8vIGNyZWF0ZSBhIGZyYWdtZW50IHRvIGhvbGQgdGhlIG5ldyBET00gbm9kZXMgdG8gaW5qZWN0IGluIHRoZSBwYXJlbnQgdGFnXG4gICAgICBmcmFnID0gZG9jdW1lbnQuY3JlYXRlRG9jdW1lbnRGcmFnbWVudCgpXG5cbiAgICAvLyBvYmplY3QgbG9vcC4gYW55IGNoYW5nZXMgY2F1c2UgZnVsbCByZWRyYXdcbiAgICBpZiAoIWlzQXJyYXkoaXRlbXMpKSB7XG4gICAgICBoYXNLZXlzID0gaXRlbXMgfHwgZmFsc2VcbiAgICAgIGl0ZW1zID0gaGFzS2V5cyA/XG4gICAgICAgIE9iamVjdC5rZXlzKGl0ZW1zKS5tYXAoZnVuY3Rpb24gKGtleSkge1xuICAgICAgICAgIHJldHVybiBta2l0ZW0oZXhwciwga2V5LCBpdGVtc1trZXldKVxuICAgICAgICB9KSA6IFtdXG4gICAgfVxuXG4gICAgLy8gbG9vcCBhbGwgdGhlIG5ldyBpdGVtc1xuICAgIHZhciBpID0gMCxcbiAgICAgIGl0ZW1zTGVuZ3RoID0gaXRlbXMubGVuZ3RoXG5cbiAgICBmb3IgKDsgaSA8IGl0ZW1zTGVuZ3RoOyBpKyspIHtcbiAgICAgIC8vIHJlb3JkZXIgb25seSBpZiB0aGUgaXRlbXMgYXJlIG9iamVjdHNcbiAgICAgIHZhclxuICAgICAgICBpdGVtID0gaXRlbXNbaV0sXG4gICAgICAgIF9tdXN0UmVvcmRlciA9IG11c3RSZW9yZGVyICYmIHR5cGVvZiBpdGVtID09IFRfT0JKRUNUICYmICFoYXNLZXlzLFxuICAgICAgICBvbGRQb3MgPSBvbGRJdGVtcy5pbmRleE9mKGl0ZW0pLFxuICAgICAgICBwb3MgPSB+b2xkUG9zICYmIF9tdXN0UmVvcmRlciA/IG9sZFBvcyA6IGksXG4gICAgICAgIC8vIGRvZXMgYSB0YWcgZXhpc3QgaW4gdGhpcyBwb3NpdGlvbj9cbiAgICAgICAgdGFnID0gdGFnc1twb3NdXG5cbiAgICAgIGl0ZW0gPSAhaGFzS2V5cyAmJiBleHByLmtleSA/IG1raXRlbShleHByLCBpdGVtLCBpKSA6IGl0ZW1cblxuICAgICAgLy8gbmV3IHRhZ1xuICAgICAgaWYgKFxuICAgICAgICAhX211c3RSZW9yZGVyICYmICF0YWcgLy8gd2l0aCBuby1yZW9yZGVyIHdlIGp1c3QgdXBkYXRlIHRoZSBvbGQgdGFnc1xuICAgICAgICB8fFxuICAgICAgICBfbXVzdFJlb3JkZXIgJiYgIX5vbGRQb3MgfHwgIXRhZyAvLyBieSBkZWZhdWx0IHdlIGFsd2F5cyB0cnkgdG8gcmVvcmRlciB0aGUgRE9NIGVsZW1lbnRzXG4gICAgICApIHtcblxuICAgICAgICB0YWcgPSBuZXcgVGFnKGltcGwsIHtcbiAgICAgICAgICBwYXJlbnQ6IHBhcmVudCxcbiAgICAgICAgICBpc0xvb3A6IHRydWUsXG4gICAgICAgICAgaGFzSW1wbDogISFfX3RhZ0ltcGxbdGFnTmFtZV0sXG4gICAgICAgICAgcm9vdDogdXNlUm9vdCA/IHJvb3QgOiBkb20uY2xvbmVOb2RlKCksXG4gICAgICAgICAgaXRlbTogaXRlbVxuICAgICAgICB9LCBkb20uaW5uZXJIVE1MKVxuXG4gICAgICAgIHRhZy5tb3VudCgpXG5cbiAgICAgICAgaWYgKGlzVmlydHVhbCkgdGFnLl9yb290ID0gdGFnLnJvb3QuZmlyc3RDaGlsZCAvLyBzYXZlIHJlZmVyZW5jZSBmb3IgZnVydGhlciBtb3ZlcyBvciBpbnNlcnRzXG4gICAgICAgIC8vIHRoaXMgdGFnIG11c3QgYmUgYXBwZW5kZWRcbiAgICAgICAgaWYgKGkgPT0gdGFncy5sZW5ndGggfHwgIXRhZ3NbaV0pIHsgLy8gZml4IDE1ODFcbiAgICAgICAgICBpZiAoaXNWaXJ0dWFsKVxuICAgICAgICAgICAgYWRkVmlydHVhbCh0YWcsIGZyYWcpXG4gICAgICAgICAgZWxzZSBmcmFnLmFwcGVuZENoaWxkKHRhZy5yb290KVxuICAgICAgICB9XG4gICAgICAgIC8vIHRoaXMgdGFnIG11c3QgYmUgaW5zZXJ0XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgIGlmIChpc1ZpcnR1YWwpXG4gICAgICAgICAgICBhZGRWaXJ0dWFsKHRhZywgcm9vdCwgdGFnc1tpXSlcbiAgICAgICAgICBlbHNlIHJvb3QuaW5zZXJ0QmVmb3JlKHRhZy5yb290LCB0YWdzW2ldLnJvb3QpIC8vICMxMzc0IHNvbWUgYnJvd3NlcnMgcmVzZXQgc2VsZWN0ZWQgaGVyZVxuICAgICAgICAgIG9sZEl0ZW1zLnNwbGljZShpLCAwLCBpdGVtKVxuICAgICAgICB9XG5cbiAgICAgICAgdGFncy5zcGxpY2UoaSwgMCwgdGFnKVxuICAgICAgICBwb3MgPSBpIC8vIGhhbmRsZWQgaGVyZSBzbyBubyBtb3ZlXG4gICAgICB9IGVsc2UgdGFnLnVwZGF0ZShpdGVtLCB0cnVlKVxuXG4gICAgICAvLyByZW9yZGVyIHRoZSB0YWcgaWYgaXQncyBub3QgbG9jYXRlZCBpbiBpdHMgcHJldmlvdXMgcG9zaXRpb25cbiAgICAgIGlmIChcbiAgICAgICAgcG9zICE9PSBpICYmIF9tdXN0UmVvcmRlciAmJlxuICAgICAgICB0YWdzW2ldIC8vIGZpeCAxNTgxIHVuYWJsZSB0byByZXByb2R1Y2UgaXQgaW4gYSB0ZXN0IVxuICAgICAgKSB7XG4gICAgICAgIC8vIHVwZGF0ZSB0aGUgRE9NXG4gICAgICAgIGlmIChpc1ZpcnR1YWwpXG4gICAgICAgICAgbW92ZVZpcnR1YWwodGFnLCByb290LCB0YWdzW2ldLCBkb20uY2hpbGROb2Rlcy5sZW5ndGgpXG4gICAgICAgIGVsc2UgaWYgKHRhZ3NbaV0ucm9vdC5wYXJlbnROb2RlKSByb290Lmluc2VydEJlZm9yZSh0YWcucm9vdCwgdGFnc1tpXS5yb290KVxuICAgICAgICAvLyB1cGRhdGUgdGhlIHBvc2l0aW9uIGF0dHJpYnV0ZSBpZiBpdCBleGlzdHNcbiAgICAgICAgaWYgKGV4cHIucG9zKVxuICAgICAgICAgIHRhZ1tleHByLnBvc10gPSBpXG4gICAgICAgIC8vIG1vdmUgdGhlIG9sZCB0YWcgaW5zdGFuY2VcbiAgICAgICAgdGFncy5zcGxpY2UoaSwgMCwgdGFncy5zcGxpY2UocG9zLCAxKVswXSlcbiAgICAgICAgLy8gbW92ZSB0aGUgb2xkIGl0ZW1cbiAgICAgICAgb2xkSXRlbXMuc3BsaWNlKGksIDAsIG9sZEl0ZW1zLnNwbGljZShwb3MsIDEpWzBdKVxuICAgICAgICAvLyBpZiB0aGUgbG9vcCB0YWdzIGFyZSBub3QgY3VzdG9tXG4gICAgICAgIC8vIHdlIG5lZWQgdG8gbW92ZSBhbGwgdGhlaXIgY3VzdG9tIHRhZ3MgaW50byB0aGUgcmlnaHQgcG9zaXRpb25cbiAgICAgICAgaWYgKCFjaGlsZCAmJiB0YWcudGFncykgbW92ZU5lc3RlZFRhZ3ModGFnLCBpKVxuICAgICAgfVxuXG4gICAgICAvLyBjYWNoZSB0aGUgb3JpZ2luYWwgaXRlbSB0byB1c2UgaXQgaW4gdGhlIGV2ZW50cyBib3VuZCB0byB0aGlzIG5vZGVcbiAgICAgIC8vIGFuZCBpdHMgY2hpbGRyZW5cbiAgICAgIHRhZy5faXRlbSA9IGl0ZW1cbiAgICAgIC8vIGNhY2hlIHRoZSByZWFsIHBhcmVudCB0YWcgaW50ZXJuYWxseVxuICAgICAgZGVmaW5lUHJvcGVydHkodGFnLCAnX3BhcmVudCcsIHBhcmVudClcbiAgICB9XG5cbiAgICAvLyByZW1vdmUgdGhlIHJlZHVuZGFudCB0YWdzXG4gICAgdW5tb3VudFJlZHVuZGFudChpdGVtcywgdGFncylcblxuICAgIC8vIGluc2VydCB0aGUgbmV3IG5vZGVzXG4gICAgcm9vdC5pbnNlcnRCZWZvcmUoZnJhZywgcmVmKVxuICAgIGlmIChpc09wdGlvbikge1xuXG4gICAgICAvLyAjMTM3NCBGaXJlRm94IGJ1ZyBpbiA8b3B0aW9uIHNlbGVjdGVkPXtleHByZXNzaW9ufT5cbiAgICAgIGlmIChGSVJFRk9YICYmICFyb290Lm11bHRpcGxlKSB7XG4gICAgICAgIGZvciAodmFyIG4gPSAwOyBuIDwgcm9vdC5sZW5ndGg7IG4rKykge1xuICAgICAgICAgIGlmIChyb290W25dLl9fcmlvdDEzNzQpIHtcbiAgICAgICAgICAgIHJvb3Quc2VsZWN0ZWRJbmRleCA9IG4gIC8vIGNsZWFyIG90aGVyIG9wdGlvbnNcbiAgICAgICAgICAgIGRlbGV0ZSByb290W25dLl9fcmlvdDEzNzRcbiAgICAgICAgICAgIGJyZWFrXG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgLy8gc2V0IHRoZSAndGFncycgcHJvcGVydHkgb2YgdGhlIHBhcmVudCB0YWdcbiAgICAvLyBpZiBjaGlsZCBpcyAndW5kZWZpbmVkJyBpdCBtZWFucyB0aGF0IHdlIGRvbid0IG5lZWQgdG8gc2V0IHRoaXMgcHJvcGVydHlcbiAgICAvLyBmb3IgZXhhbXBsZTpcbiAgICAvLyB3ZSBkb24ndCBuZWVkIHN0b3JlIHRoZSBgbXlUYWcudGFnc1snZGl2J11gIHByb3BlcnR5IGlmIHdlIGFyZSBsb29waW5nIGEgZGl2IHRhZ1xuICAgIC8vIGJ1dCB3ZSBuZWVkIHRvIHRyYWNrIHRoZSBgbXlUYWcudGFnc1snY2hpbGQnXWAgcHJvcGVydHkgbG9vcGluZyBhIGN1c3RvbSBjaGlsZCBub2RlIG5hbWVkIGBjaGlsZGBcbiAgICBpZiAoY2hpbGQpIHBhcmVudC50YWdzW3RhZ05hbWVdID0gdGFnc1xuXG4gICAgLy8gY2xvbmUgdGhlIGl0ZW1zIGFycmF5XG4gICAgb2xkSXRlbXMgPSBpdGVtcy5zbGljZSgpXG5cbiAgfSlcblxufVxuLyoqXG4gKiBPYmplY3QgdGhhdCB3aWxsIGJlIHVzZWQgdG8gaW5qZWN0IGFuZCBtYW5hZ2UgdGhlIGNzcyBvZiBldmVyeSB0YWcgaW5zdGFuY2VcbiAqL1xudmFyIHN0eWxlTWFuYWdlciA9IChmdW5jdGlvbihfcmlvdCkge1xuXG4gIGlmICghd2luZG93KSByZXR1cm4geyAvLyBza2lwIGluamVjdGlvbiBvbiB0aGUgc2VydmVyXG4gICAgYWRkOiBmdW5jdGlvbiAoKSB7fSxcbiAgICBpbmplY3Q6IGZ1bmN0aW9uICgpIHt9XG4gIH1cblxuICB2YXIgc3R5bGVOb2RlID0gKGZ1bmN0aW9uICgpIHtcbiAgICAvLyBjcmVhdGUgYSBuZXcgc3R5bGUgZWxlbWVudCB3aXRoIHRoZSBjb3JyZWN0IHR5cGVcbiAgICB2YXIgbmV3Tm9kZSA9IG1rRWwoJ3N0eWxlJylcbiAgICBzZXRBdHRyKG5ld05vZGUsICd0eXBlJywgJ3RleHQvY3NzJylcblxuICAgIC8vIHJlcGxhY2UgYW55IHVzZXIgbm9kZSBvciBpbnNlcnQgdGhlIG5ldyBvbmUgaW50byB0aGUgaGVhZFxuICAgIHZhciB1c2VyTm9kZSA9ICQoJ3N0eWxlW3R5cGU9cmlvdF0nKVxuICAgIGlmICh1c2VyTm9kZSkge1xuICAgICAgaWYgKHVzZXJOb2RlLmlkKSBuZXdOb2RlLmlkID0gdXNlck5vZGUuaWRcbiAgICAgIHVzZXJOb2RlLnBhcmVudE5vZGUucmVwbGFjZUNoaWxkKG5ld05vZGUsIHVzZXJOb2RlKVxuICAgIH1cbiAgICBlbHNlIGRvY3VtZW50LmdldEVsZW1lbnRzQnlUYWdOYW1lKCdoZWFkJylbMF0uYXBwZW5kQ2hpbGQobmV3Tm9kZSlcblxuICAgIHJldHVybiBuZXdOb2RlXG4gIH0pKClcblxuICAvLyBDcmVhdGUgY2FjaGUgYW5kIHNob3J0Y3V0IHRvIHRoZSBjb3JyZWN0IHByb3BlcnR5XG4gIHZhciBjc3NUZXh0UHJvcCA9IHN0eWxlTm9kZS5zdHlsZVNoZWV0LFxuICAgIHN0eWxlc1RvSW5qZWN0ID0gJydcblxuICAvLyBFeHBvc2UgdGhlIHN0eWxlIG5vZGUgaW4gYSBub24tbW9kaWZpY2FibGUgcHJvcGVydHlcbiAgT2JqZWN0LmRlZmluZVByb3BlcnR5KF9yaW90LCAnc3R5bGVOb2RlJywge1xuICAgIHZhbHVlOiBzdHlsZU5vZGUsXG4gICAgd3JpdGFibGU6IHRydWVcbiAgfSlcblxuICAvKipcbiAgICogUHVibGljIGFwaVxuICAgKi9cbiAgcmV0dXJuIHtcbiAgICAvKipcbiAgICAgKiBTYXZlIGEgdGFnIHN0eWxlIHRvIGJlIGxhdGVyIGluamVjdGVkIGludG8gRE9NXG4gICAgICogQHBhcmFtICAgeyBTdHJpbmcgfSBjc3MgW2Rlc2NyaXB0aW9uXVxuICAgICAqL1xuICAgIGFkZDogZnVuY3Rpb24oY3NzKSB7XG4gICAgICBzdHlsZXNUb0luamVjdCArPSBjc3NcbiAgICB9LFxuICAgIC8qKlxuICAgICAqIEluamVjdCBhbGwgcHJldmlvdXNseSBzYXZlZCB0YWcgc3R5bGVzIGludG8gRE9NXG4gICAgICogaW5uZXJIVE1MIHNlZW1zIHNsb3c6IGh0dHA6Ly9qc3BlcmYuY29tL3Jpb3QtaW5zZXJ0LXN0eWxlXG4gICAgICovXG4gICAgaW5qZWN0OiBmdW5jdGlvbigpIHtcbiAgICAgIGlmIChzdHlsZXNUb0luamVjdCkge1xuICAgICAgICBpZiAoY3NzVGV4dFByb3ApIGNzc1RleHRQcm9wLmNzc1RleHQgKz0gc3R5bGVzVG9JbmplY3RcbiAgICAgICAgZWxzZSBzdHlsZU5vZGUuaW5uZXJIVE1MICs9IHN0eWxlc1RvSW5qZWN0XG4gICAgICAgIHN0eWxlc1RvSW5qZWN0ID0gJydcbiAgICAgIH1cbiAgICB9XG4gIH1cblxufSkocmlvdClcblxuXG5mdW5jdGlvbiBwYXJzZU5hbWVkRWxlbWVudHMocm9vdCwgdGFnLCBjaGlsZFRhZ3MsIGZvcmNlUGFyc2luZ05hbWVkKSB7XG5cbiAgd2Fsayhyb290LCBmdW5jdGlvbihkb20pIHtcbiAgICBpZiAoZG9tLm5vZGVUeXBlID09IDEpIHtcbiAgICAgIGRvbS5pc0xvb3AgPSBkb20uaXNMb29wIHx8XG4gICAgICAgICAgICAgICAgICAoZG9tLnBhcmVudE5vZGUgJiYgZG9tLnBhcmVudE5vZGUuaXNMb29wIHx8IGdldEF0dHIoZG9tLCAnZWFjaCcpKVxuICAgICAgICAgICAgICAgICAgICA/IDEgOiAwXG5cbiAgICAgIC8vIGN1c3RvbSBjaGlsZCB0YWdcbiAgICAgIGlmIChjaGlsZFRhZ3MpIHtcbiAgICAgICAgdmFyIGNoaWxkID0gZ2V0VGFnKGRvbSlcblxuICAgICAgICBpZiAoY2hpbGQgJiYgIWRvbS5pc0xvb3ApXG4gICAgICAgICAgY2hpbGRUYWdzLnB1c2goaW5pdENoaWxkVGFnKGNoaWxkLCB7cm9vdDogZG9tLCBwYXJlbnQ6IHRhZ30sIGRvbS5pbm5lckhUTUwsIHRhZykpXG4gICAgICB9XG5cbiAgICAgIGlmICghZG9tLmlzTG9vcCB8fCBmb3JjZVBhcnNpbmdOYW1lZClcbiAgICAgICAgc2V0TmFtZWQoZG9tLCB0YWcsIFtdKVxuICAgIH1cblxuICB9KVxuXG59XG5cbmZ1bmN0aW9uIHBhcnNlRXhwcmVzc2lvbnMocm9vdCwgdGFnLCBleHByZXNzaW9ucykge1xuXG4gIGZ1bmN0aW9uIGFkZEV4cHIoZG9tLCB2YWwsIGV4dHJhKSB7XG4gICAgaWYgKHRtcGwuaGFzRXhwcih2YWwpKSB7XG4gICAgICBleHByZXNzaW9ucy5wdXNoKGV4dGVuZCh7IGRvbTogZG9tLCBleHByOiB2YWwgfSwgZXh0cmEpKVxuICAgIH1cbiAgfVxuXG4gIHdhbGsocm9vdCwgZnVuY3Rpb24oZG9tKSB7XG4gICAgdmFyIHR5cGUgPSBkb20ubm9kZVR5cGUsXG4gICAgICBhdHRyXG5cbiAgICAvLyB0ZXh0IG5vZGVcbiAgICBpZiAodHlwZSA9PSAzICYmIGRvbS5wYXJlbnROb2RlLnRhZ05hbWUgIT0gJ1NUWUxFJykgYWRkRXhwcihkb20sIGRvbS5ub2RlVmFsdWUpXG4gICAgaWYgKHR5cGUgIT0gMSkgcmV0dXJuXG5cbiAgICAvKiBlbGVtZW50ICovXG5cbiAgICAvLyBsb29wXG4gICAgYXR0ciA9IGdldEF0dHIoZG9tLCAnZWFjaCcpXG5cbiAgICBpZiAoYXR0cikgeyBfZWFjaChkb20sIHRhZywgYXR0cik7IHJldHVybiBmYWxzZSB9XG5cbiAgICAvLyBhdHRyaWJ1dGUgZXhwcmVzc2lvbnNcbiAgICBlYWNoKGRvbS5hdHRyaWJ1dGVzLCBmdW5jdGlvbihhdHRyKSB7XG4gICAgICB2YXIgbmFtZSA9IGF0dHIubmFtZSxcbiAgICAgICAgYm9vbCA9IG5hbWUuc3BsaXQoJ19fJylbMV1cblxuICAgICAgYWRkRXhwcihkb20sIGF0dHIudmFsdWUsIHsgYXR0cjogYm9vbCB8fCBuYW1lLCBib29sOiBib29sIH0pXG4gICAgICBpZiAoYm9vbCkgeyByZW1BdHRyKGRvbSwgbmFtZSk7IHJldHVybiBmYWxzZSB9XG5cbiAgICB9KVxuXG4gICAgLy8gc2tpcCBjdXN0b20gdGFnc1xuICAgIGlmIChnZXRUYWcoZG9tKSkgcmV0dXJuIGZhbHNlXG5cbiAgfSlcblxufVxuZnVuY3Rpb24gVGFnKGltcGwsIGNvbmYsIGlubmVySFRNTCkge1xuXG4gIHZhciBzZWxmID0gcmlvdC5vYnNlcnZhYmxlKHRoaXMpLFxuICAgIG9wdHMgPSBpbmhlcml0KGNvbmYub3B0cykgfHwge30sXG4gICAgcGFyZW50ID0gY29uZi5wYXJlbnQsXG4gICAgaXNMb29wID0gY29uZi5pc0xvb3AsXG4gICAgaGFzSW1wbCA9IGNvbmYuaGFzSW1wbCxcbiAgICBpdGVtID0gY2xlYW5VcERhdGEoY29uZi5pdGVtKSxcbiAgICBleHByZXNzaW9ucyA9IFtdLFxuICAgIGNoaWxkVGFncyA9IFtdLFxuICAgIHJvb3QgPSBjb25mLnJvb3QsXG4gICAgdGFnTmFtZSA9IHJvb3QudGFnTmFtZS50b0xvd2VyQ2FzZSgpLFxuICAgIGF0dHIgPSB7fSxcbiAgICBwcm9wc0luU3luY1dpdGhQYXJlbnQgPSBbXSxcbiAgICBkb21cblxuICAvLyBvbmx5IGNhbGwgdW5tb3VudCBpZiB3ZSBoYXZlIGEgdmFsaWQgX190YWdJbXBsIChoYXMgbmFtZSBwcm9wZXJ0eSlcbiAgaWYgKGltcGwubmFtZSAmJiByb290Ll90YWcpIHJvb3QuX3RhZy51bm1vdW50KHRydWUpXG5cbiAgLy8gbm90IHlldCBtb3VudGVkXG4gIHRoaXMuaXNNb3VudGVkID0gZmFsc2VcbiAgcm9vdC5pc0xvb3AgPSBpc0xvb3BcblxuICAvLyBrZWVwIGEgcmVmZXJlbmNlIHRvIHRoZSB0YWcganVzdCBjcmVhdGVkXG4gIC8vIHNvIHdlIHdpbGwgYmUgYWJsZSB0byBtb3VudCB0aGlzIHRhZyBtdWx0aXBsZSB0aW1lc1xuICByb290Ll90YWcgPSB0aGlzXG5cbiAgLy8gY3JlYXRlIGEgdW5pcXVlIGlkIHRvIHRoaXMgdGFnXG4gIC8vIGl0IGNvdWxkIGJlIGhhbmR5IHRvIHVzZSBpdCBhbHNvIHRvIGltcHJvdmUgdGhlIHZpcnR1YWwgZG9tIHJlbmRlcmluZyBzcGVlZFxuICBkZWZpbmVQcm9wZXJ0eSh0aGlzLCAnX3Jpb3RfaWQnLCArK19fdWlkKSAvLyBiYXNlIDEgYWxsb3dzIHRlc3QgIXQuX3Jpb3RfaWRcblxuICBleHRlbmQodGhpcywgeyBwYXJlbnQ6IHBhcmVudCwgcm9vdDogcm9vdCwgb3B0czogb3B0c30sIGl0ZW0pXG4gIC8vIHByb3RlY3QgdGhlIFwidGFnc1wiIHByb3BlcnR5IGZyb20gYmVpbmcgb3ZlcnJpZGRlblxuICBkZWZpbmVQcm9wZXJ0eSh0aGlzLCAndGFncycsIHt9KVxuXG4gIC8vIGdyYWIgYXR0cmlidXRlc1xuICBlYWNoKHJvb3QuYXR0cmlidXRlcywgZnVuY3Rpb24oZWwpIHtcbiAgICB2YXIgdmFsID0gZWwudmFsdWVcbiAgICAvLyByZW1lbWJlciBhdHRyaWJ1dGVzIHdpdGggZXhwcmVzc2lvbnMgb25seVxuICAgIGlmICh0bXBsLmhhc0V4cHIodmFsKSkgYXR0cltlbC5uYW1lXSA9IHZhbFxuICB9KVxuXG4gIGRvbSA9IG1rZG9tKGltcGwudG1wbCwgaW5uZXJIVE1MKVxuXG4gIC8vIG9wdGlvbnNcbiAgZnVuY3Rpb24gdXBkYXRlT3B0cygpIHtcbiAgICB2YXIgY3R4ID0gaGFzSW1wbCAmJiBpc0xvb3AgPyBzZWxmIDogcGFyZW50IHx8IHNlbGZcblxuICAgIC8vIHVwZGF0ZSBvcHRzIGZyb20gY3VycmVudCBET00gYXR0cmlidXRlc1xuICAgIGVhY2gocm9vdC5hdHRyaWJ1dGVzLCBmdW5jdGlvbihlbCkge1xuICAgICAgdmFyIHZhbCA9IGVsLnZhbHVlXG4gICAgICBvcHRzW3RvQ2FtZWwoZWwubmFtZSldID0gdG1wbC5oYXNFeHByKHZhbCkgPyB0bXBsKHZhbCwgY3R4KSA6IHZhbFxuICAgIH0pXG4gICAgLy8gcmVjb3ZlciB0aG9zZSB3aXRoIGV4cHJlc3Npb25zXG4gICAgZWFjaChPYmplY3Qua2V5cyhhdHRyKSwgZnVuY3Rpb24obmFtZSkge1xuICAgICAgb3B0c1t0b0NhbWVsKG5hbWUpXSA9IHRtcGwoYXR0cltuYW1lXSwgY3R4KVxuICAgIH0pXG4gIH1cblxuICBmdW5jdGlvbiBub3JtYWxpemVEYXRhKGRhdGEpIHtcbiAgICBmb3IgKHZhciBrZXkgaW4gaXRlbSkge1xuICAgICAgaWYgKHR5cGVvZiBzZWxmW2tleV0gIT09IFRfVU5ERUYgJiYgaXNXcml0YWJsZShzZWxmLCBrZXkpKVxuICAgICAgICBzZWxmW2tleV0gPSBkYXRhW2tleV1cbiAgICB9XG4gIH1cblxuICBmdW5jdGlvbiBpbmhlcml0RnJvbSh0YXJnZXQpIHtcbiAgICBlYWNoKE9iamVjdC5rZXlzKHRhcmdldCksIGZ1bmN0aW9uKGspIHtcbiAgICAgIC8vIHNvbWUgcHJvcGVydGllcyBtdXN0IGJlIGFsd2F5cyBpbiBzeW5jIHdpdGggdGhlIHBhcmVudCB0YWdcbiAgICAgIHZhciBtdXN0U3luYyA9ICFSRVNFUlZFRF9XT1JEU19CTEFDS0xJU1QudGVzdChrKSAmJiBjb250YWlucyhwcm9wc0luU3luY1dpdGhQYXJlbnQsIGspXG5cbiAgICAgIGlmICh0eXBlb2Ygc2VsZltrXSA9PT0gVF9VTkRFRiB8fCBtdXN0U3luYykge1xuICAgICAgICAvLyB0cmFjayB0aGUgcHJvcGVydHkgdG8ga2VlcCBpbiBzeW5jXG4gICAgICAgIC8vIHNvIHdlIGNhbiBrZWVwIGl0IHVwZGF0ZWRcbiAgICAgICAgaWYgKCFtdXN0U3luYykgcHJvcHNJblN5bmNXaXRoUGFyZW50LnB1c2goaylcbiAgICAgICAgc2VsZltrXSA9IHRhcmdldFtrXVxuICAgICAgfVxuICAgIH0pXG4gIH1cblxuICAvKipcbiAgICogVXBkYXRlIHRoZSB0YWcgZXhwcmVzc2lvbnMgYW5kIG9wdGlvbnNcbiAgICogQHBhcmFtICAgeyAqIH0gIGRhdGEgLSBkYXRhIHdlIHdhbnQgdG8gdXNlIHRvIGV4dGVuZCB0aGUgdGFnIHByb3BlcnRpZXNcbiAgICogQHBhcmFtICAgeyBCb29sZWFuIH0gaXNJbmhlcml0ZWQgLSBpcyB0aGlzIHVwZGF0ZSBjb21pbmcgZnJvbSBhIHBhcmVudCB0YWc/XG4gICAqIEByZXR1cm5zIHsgc2VsZiB9XG4gICAqL1xuICBkZWZpbmVQcm9wZXJ0eSh0aGlzLCAndXBkYXRlJywgZnVuY3Rpb24oZGF0YSwgaXNJbmhlcml0ZWQpIHtcblxuICAgIC8vIG1ha2Ugc3VyZSB0aGUgZGF0YSBwYXNzZWQgd2lsbCBub3Qgb3ZlcnJpZGVcbiAgICAvLyB0aGUgY29tcG9uZW50IGNvcmUgbWV0aG9kc1xuICAgIGRhdGEgPSBjbGVhblVwRGF0YShkYXRhKVxuICAgIC8vIGluaGVyaXQgcHJvcGVydGllcyBmcm9tIHRoZSBwYXJlbnQgaW4gbG9vcFxuICAgIGlmIChpc0xvb3ApIHtcbiAgICAgIGluaGVyaXRGcm9tKHNlbGYucGFyZW50KVxuICAgIH1cbiAgICAvLyBub3JtYWxpemUgdGhlIHRhZyBwcm9wZXJ0aWVzIGluIGNhc2UgYW4gaXRlbSBvYmplY3Qgd2FzIGluaXRpYWxseSBwYXNzZWRcbiAgICBpZiAoZGF0YSAmJiBpc09iamVjdChpdGVtKSkge1xuICAgICAgbm9ybWFsaXplRGF0YShkYXRhKVxuICAgICAgaXRlbSA9IGRhdGFcbiAgICB9XG4gICAgZXh0ZW5kKHNlbGYsIGRhdGEpXG4gICAgdXBkYXRlT3B0cygpXG4gICAgc2VsZi50cmlnZ2VyKCd1cGRhdGUnLCBkYXRhKVxuICAgIHVwZGF0ZShleHByZXNzaW9ucywgc2VsZilcblxuICAgIC8vIHRoZSB1cGRhdGVkIGV2ZW50IHdpbGwgYmUgdHJpZ2dlcmVkXG4gICAgLy8gb25jZSB0aGUgRE9NIHdpbGwgYmUgcmVhZHkgYW5kIGFsbCB0aGUgcmUtZmxvd3MgYXJlIGNvbXBsZXRlZFxuICAgIC8vIHRoaXMgaXMgdXNlZnVsIGlmIHlvdSB3YW50IHRvIGdldCB0aGUgXCJyZWFsXCIgcm9vdCBwcm9wZXJ0aWVzXG4gICAgLy8gNCBleDogcm9vdC5vZmZzZXRXaWR0aCAuLi5cbiAgICBpZiAoaXNJbmhlcml0ZWQgJiYgc2VsZi5wYXJlbnQpXG4gICAgICAvLyBjbG9zZXMgIzE1OTlcbiAgICAgIHNlbGYucGFyZW50Lm9uZSgndXBkYXRlZCcsIGZ1bmN0aW9uKCkgeyBzZWxmLnRyaWdnZXIoJ3VwZGF0ZWQnKSB9KVxuICAgIGVsc2UgckFGKGZ1bmN0aW9uKCkgeyBzZWxmLnRyaWdnZXIoJ3VwZGF0ZWQnKSB9KVxuXG4gICAgcmV0dXJuIHRoaXNcbiAgfSlcblxuICBkZWZpbmVQcm9wZXJ0eSh0aGlzLCAnbWl4aW4nLCBmdW5jdGlvbigpIHtcbiAgICBlYWNoKGFyZ3VtZW50cywgZnVuY3Rpb24obWl4KSB7XG4gICAgICB2YXIgaW5zdGFuY2UsXG4gICAgICAgIHByb3BzID0gW10sXG4gICAgICAgIG9ialxuXG4gICAgICBtaXggPSB0eXBlb2YgbWl4ID09PSBUX1NUUklORyA/IHJpb3QubWl4aW4obWl4KSA6IG1peFxuXG4gICAgICAvLyBjaGVjayBpZiB0aGUgbWl4aW4gaXMgYSBmdW5jdGlvblxuICAgICAgaWYgKGlzRnVuY3Rpb24obWl4KSkge1xuICAgICAgICAvLyBjcmVhdGUgdGhlIG5ldyBtaXhpbiBpbnN0YW5jZVxuICAgICAgICBpbnN0YW5jZSA9IG5ldyBtaXgoKVxuICAgICAgfSBlbHNlIGluc3RhbmNlID0gbWl4XG5cbiAgICAgIHZhciBwcm90byA9IE9iamVjdC5nZXRQcm90b3R5cGVPZihpbnN0YW5jZSlcblxuICAgICAgLy8gYnVpbGQgbXVsdGlsZXZlbCBwcm90b3R5cGUgaW5oZXJpdGFuY2UgY2hhaW4gcHJvcGVydHkgbGlzdFxuICAgICAgZG8gcHJvcHMgPSBwcm9wcy5jb25jYXQoT2JqZWN0LmdldE93blByb3BlcnR5TmFtZXMob2JqIHx8IGluc3RhbmNlKSlcbiAgICAgIHdoaWxlIChvYmogPSBPYmplY3QuZ2V0UHJvdG90eXBlT2Yob2JqIHx8IGluc3RhbmNlKSlcblxuICAgICAgLy8gbG9vcCB0aGUga2V5cyBpbiB0aGUgZnVuY3Rpb24gcHJvdG90eXBlIG9yIHRoZSBhbGwgb2JqZWN0IGtleXNcbiAgICAgIGVhY2gocHJvcHMsIGZ1bmN0aW9uKGtleSkge1xuICAgICAgICAvLyBiaW5kIG1ldGhvZHMgdG8gc2VsZlxuICAgICAgICAvLyBhbGxvdyBtaXhpbnMgdG8gb3ZlcnJpZGUgb3RoZXIgcHJvcGVydGllcy9wYXJlbnQgbWl4aW5zXG4gICAgICAgIGlmIChrZXkgIT0gJ2luaXQnKSB7XG4gICAgICAgICAgLy8gY2hlY2sgZm9yIGdldHRlcnMvc2V0dGVyc1xuICAgICAgICAgIHZhciBkZXNjcmlwdG9yID0gT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcihpbnN0YW5jZSwga2V5KSB8fCBPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKHByb3RvLCBrZXkpXG4gICAgICAgICAgdmFyIGhhc0dldHRlclNldHRlciA9IGRlc2NyaXB0b3IgJiYgKGRlc2NyaXB0b3IuZ2V0IHx8IGRlc2NyaXB0b3Iuc2V0KVxuXG4gICAgICAgICAgLy8gYXBwbHkgbWV0aG9kIG9ubHkgaWYgaXQgZG9lcyBub3QgYWxyZWFkeSBleGlzdCBvbiB0aGUgaW5zdGFuY2VcbiAgICAgICAgICBpZiAoIXNlbGYuaGFzT3duUHJvcGVydHkoa2V5KSAmJiBoYXNHZXR0ZXJTZXR0ZXIpIHtcbiAgICAgICAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShzZWxmLCBrZXksIGRlc2NyaXB0b3IpXG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHNlbGZba2V5XSA9IGlzRnVuY3Rpb24oaW5zdGFuY2Vba2V5XSkgP1xuICAgICAgICAgICAgICBpbnN0YW5jZVtrZXldLmJpbmQoc2VsZikgOlxuICAgICAgICAgICAgICBpbnN0YW5jZVtrZXldXG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9KVxuXG4gICAgICAvLyBpbml0IG1ldGhvZCB3aWxsIGJlIGNhbGxlZCBhdXRvbWF0aWNhbGx5XG4gICAgICBpZiAoaW5zdGFuY2UuaW5pdCkgaW5zdGFuY2UuaW5pdC5iaW5kKHNlbGYpKClcbiAgICB9KVxuICAgIHJldHVybiB0aGlzXG4gIH0pXG5cbiAgZGVmaW5lUHJvcGVydHkodGhpcywgJ21vdW50JywgZnVuY3Rpb24oKSB7XG5cbiAgICB1cGRhdGVPcHRzKClcblxuICAgIC8vIGFkZCBnbG9iYWwgbWl4aW5zXG4gICAgdmFyIGdsb2JhbE1peGluID0gcmlvdC5taXhpbihHTE9CQUxfTUlYSU4pXG5cbiAgICBpZiAoZ2xvYmFsTWl4aW4pXG4gICAgICBmb3IgKHZhciBpIGluIGdsb2JhbE1peGluKVxuICAgICAgICBpZiAoZ2xvYmFsTWl4aW4uaGFzT3duUHJvcGVydHkoaSkpXG4gICAgICAgICAgc2VsZi5taXhpbihnbG9iYWxNaXhpbltpXSlcblxuICAgIC8vIGNoaWxkcmVuIGluIGxvb3Agc2hvdWxkIGluaGVyaXQgZnJvbSB0cnVlIHBhcmVudFxuICAgIGlmIChzZWxmLl9wYXJlbnQgJiYgc2VsZi5fcGFyZW50LnJvb3QuaXNMb29wKSB7XG4gICAgICBpbmhlcml0RnJvbShzZWxmLl9wYXJlbnQpXG4gICAgfVxuXG4gICAgLy8gaW5pdGlhbGlhdGlvblxuICAgIGlmIChpbXBsLmZuKSBpbXBsLmZuLmNhbGwoc2VsZiwgb3B0cylcblxuICAgIC8vIHBhcnNlIGxheW91dCBhZnRlciBpbml0LiBmbiBtYXkgY2FsY3VsYXRlIGFyZ3MgZm9yIG5lc3RlZCBjdXN0b20gdGFnc1xuICAgIHBhcnNlRXhwcmVzc2lvbnMoZG9tLCBzZWxmLCBleHByZXNzaW9ucylcblxuICAgIC8vIG1vdW50IHRoZSBjaGlsZCB0YWdzXG4gICAgdG9nZ2xlKHRydWUpXG5cbiAgICAvLyB1cGRhdGUgdGhlIHJvb3QgYWRkaW5nIGN1c3RvbSBhdHRyaWJ1dGVzIGNvbWluZyBmcm9tIHRoZSBjb21waWxlclxuICAgIC8vIGl0IGZpeGVzIGFsc28gIzEwODdcbiAgICBpZiAoaW1wbC5hdHRycylcbiAgICAgIHdhbGtBdHRyaWJ1dGVzKGltcGwuYXR0cnMsIGZ1bmN0aW9uIChrLCB2KSB7IHNldEF0dHIocm9vdCwgaywgdikgfSlcbiAgICBpZiAoaW1wbC5hdHRycyB8fCBoYXNJbXBsKVxuICAgICAgcGFyc2VFeHByZXNzaW9ucyhzZWxmLnJvb3QsIHNlbGYsIGV4cHJlc3Npb25zKVxuXG4gICAgaWYgKCFzZWxmLnBhcmVudCB8fCBpc0xvb3ApIHNlbGYudXBkYXRlKGl0ZW0pXG5cbiAgICAvLyBpbnRlcm5hbCB1c2Ugb25seSwgZml4ZXMgIzQwM1xuICAgIHNlbGYudHJpZ2dlcignYmVmb3JlLW1vdW50JylcblxuICAgIGlmIChpc0xvb3AgJiYgIWhhc0ltcGwpIHtcbiAgICAgIC8vIHVwZGF0ZSB0aGUgcm9vdCBhdHRyaWJ1dGUgZm9yIHRoZSBsb29wZWQgZWxlbWVudHNcbiAgICAgIHJvb3QgPSBkb20uZmlyc3RDaGlsZFxuICAgIH0gZWxzZSB7XG4gICAgICB3aGlsZSAoZG9tLmZpcnN0Q2hpbGQpIHJvb3QuYXBwZW5kQ2hpbGQoZG9tLmZpcnN0Q2hpbGQpXG4gICAgICBpZiAocm9vdC5zdHViKSByb290ID0gcGFyZW50LnJvb3RcbiAgICB9XG5cbiAgICBkZWZpbmVQcm9wZXJ0eShzZWxmLCAncm9vdCcsIHJvb3QpXG5cbiAgICAvLyBwYXJzZSB0aGUgbmFtZWQgZG9tIG5vZGVzIGluIHRoZSBsb29wZWQgY2hpbGRcbiAgICAvLyBhZGRpbmcgdGhlbSB0byB0aGUgcGFyZW50IGFzIHdlbGxcbiAgICBpZiAoaXNMb29wKVxuICAgICAgcGFyc2VOYW1lZEVsZW1lbnRzKHNlbGYucm9vdCwgc2VsZi5wYXJlbnQsIG51bGwsIHRydWUpXG5cbiAgICAvLyBpZiBpdCdzIG5vdCBhIGNoaWxkIHRhZyB3ZSBjYW4gdHJpZ2dlciBpdHMgbW91bnQgZXZlbnRcbiAgICBpZiAoIXNlbGYucGFyZW50IHx8IHNlbGYucGFyZW50LmlzTW91bnRlZCkge1xuICAgICAgc2VsZi5pc01vdW50ZWQgPSB0cnVlXG4gICAgICBzZWxmLnRyaWdnZXIoJ21vdW50JylcbiAgICB9XG4gICAgLy8gb3RoZXJ3aXNlIHdlIG5lZWQgdG8gd2FpdCB0aGF0IHRoZSBwYXJlbnQgZXZlbnQgZ2V0cyB0cmlnZ2VyZWRcbiAgICBlbHNlIHNlbGYucGFyZW50Lm9uZSgnbW91bnQnLCBmdW5jdGlvbigpIHtcbiAgICAgIC8vIGF2b2lkIHRvIHRyaWdnZXIgdGhlIGBtb3VudGAgZXZlbnQgZm9yIHRoZSB0YWdzXG4gICAgICAvLyBub3QgdmlzaWJsZSBpbmNsdWRlZCBpbiBhbiBpZiBzdGF0ZW1lbnRcbiAgICAgIGlmICghaXNJblN0dWIoc2VsZi5yb290KSkge1xuICAgICAgICBzZWxmLnBhcmVudC5pc01vdW50ZWQgPSBzZWxmLmlzTW91bnRlZCA9IHRydWVcbiAgICAgICAgc2VsZi50cmlnZ2VyKCdtb3VudCcpXG4gICAgICB9XG4gICAgfSlcbiAgfSlcblxuXG4gIGRlZmluZVByb3BlcnR5KHRoaXMsICd1bm1vdW50JywgZnVuY3Rpb24oa2VlcFJvb3RUYWcpIHtcbiAgICB2YXIgZWwgPSByb290LFxuICAgICAgcCA9IGVsLnBhcmVudE5vZGUsXG4gICAgICBwdGFnLFxuICAgICAgdGFnSW5kZXggPSBfX3ZpcnR1YWxEb20uaW5kZXhPZihzZWxmKVxuXG4gICAgc2VsZi50cmlnZ2VyKCdiZWZvcmUtdW5tb3VudCcpXG5cbiAgICAvLyByZW1vdmUgdGhpcyB0YWcgaW5zdGFuY2UgZnJvbSB0aGUgZ2xvYmFsIHZpcnR1YWxEb20gdmFyaWFibGVcbiAgICBpZiAofnRhZ0luZGV4KVxuICAgICAgX192aXJ0dWFsRG9tLnNwbGljZSh0YWdJbmRleCwgMSlcblxuICAgIGlmIChwKSB7XG5cbiAgICAgIGlmIChwYXJlbnQpIHtcbiAgICAgICAgcHRhZyA9IGdldEltbWVkaWF0ZUN1c3RvbVBhcmVudFRhZyhwYXJlbnQpXG4gICAgICAgIC8vIHJlbW92ZSB0aGlzIHRhZyBmcm9tIHRoZSBwYXJlbnQgdGFncyBvYmplY3RcbiAgICAgICAgLy8gaWYgdGhlcmUgYXJlIG11bHRpcGxlIG5lc3RlZCB0YWdzIHdpdGggc2FtZSBuYW1lLi5cbiAgICAgICAgLy8gcmVtb3ZlIHRoaXMgZWxlbWVudCBmb3JtIHRoZSBhcnJheVxuICAgICAgICBpZiAoaXNBcnJheShwdGFnLnRhZ3NbdGFnTmFtZV0pKVxuICAgICAgICAgIGVhY2gocHRhZy50YWdzW3RhZ05hbWVdLCBmdW5jdGlvbih0YWcsIGkpIHtcbiAgICAgICAgICAgIGlmICh0YWcuX3Jpb3RfaWQgPT0gc2VsZi5fcmlvdF9pZClcbiAgICAgICAgICAgICAgcHRhZy50YWdzW3RhZ05hbWVdLnNwbGljZShpLCAxKVxuICAgICAgICAgIH0pXG4gICAgICAgIGVsc2VcbiAgICAgICAgICAvLyBvdGhlcndpc2UganVzdCBkZWxldGUgdGhlIHRhZyBpbnN0YW5jZVxuICAgICAgICAgIHB0YWcudGFnc1t0YWdOYW1lXSA9IHVuZGVmaW5lZFxuICAgICAgfVxuXG4gICAgICBlbHNlXG4gICAgICAgIHdoaWxlIChlbC5maXJzdENoaWxkKSBlbC5yZW1vdmVDaGlsZChlbC5maXJzdENoaWxkKVxuXG4gICAgICBpZiAoIWtlZXBSb290VGFnKVxuICAgICAgICBwLnJlbW92ZUNoaWxkKGVsKVxuICAgICAgZWxzZSB7XG4gICAgICAgIC8vIHRoZSByaW90LXRhZyBhbmQgdGhlIGRhdGEtaXMgYXR0cmlidXRlcyBhcmVuJ3QgbmVlZGVkIGFueW1vcmUsIHJlbW92ZSB0aGVtXG4gICAgICAgIHJlbUF0dHIocCwgUklPVF9UQUdfSVMpXG4gICAgICAgIHJlbUF0dHIocCwgUklPVF9UQUcpIC8vIHRoaXMgd2lsbCBiZSByZW1vdmVkIGluIHJpb3QgMy4wLjBcbiAgICAgIH1cblxuICAgIH1cblxuICAgIGlmICh0aGlzLl92aXJ0cykge1xuICAgICAgZWFjaCh0aGlzLl92aXJ0cywgZnVuY3Rpb24odikge1xuICAgICAgICBpZiAodi5wYXJlbnROb2RlKSB2LnBhcmVudE5vZGUucmVtb3ZlQ2hpbGQodilcbiAgICAgIH0pXG4gICAgfVxuXG4gICAgc2VsZi50cmlnZ2VyKCd1bm1vdW50JylcbiAgICB0b2dnbGUoKVxuICAgIHNlbGYub2ZmKCcqJylcbiAgICBzZWxmLmlzTW91bnRlZCA9IGZhbHNlXG4gICAgZGVsZXRlIHJvb3QuX3RhZ1xuXG4gIH0pXG5cbiAgLy8gcHJveHkgZnVuY3Rpb24gdG8gYmluZCB1cGRhdGVzXG4gIC8vIGRpc3BhdGNoZWQgZnJvbSBhIHBhcmVudCB0YWdcbiAgZnVuY3Rpb24gb25DaGlsZFVwZGF0ZShkYXRhKSB7IHNlbGYudXBkYXRlKGRhdGEsIHRydWUpIH1cblxuICBmdW5jdGlvbiB0b2dnbGUoaXNNb3VudCkge1xuXG4gICAgLy8gbW91bnQvdW5tb3VudCBjaGlsZHJlblxuICAgIGVhY2goY2hpbGRUYWdzLCBmdW5jdGlvbihjaGlsZCkgeyBjaGlsZFtpc01vdW50ID8gJ21vdW50JyA6ICd1bm1vdW50J10oKSB9KVxuXG4gICAgLy8gbGlzdGVuL3VubGlzdGVuIHBhcmVudCAoZXZlbnRzIGZsb3cgb25lIHdheSBmcm9tIHBhcmVudCB0byBjaGlsZHJlbilcbiAgICBpZiAoIXBhcmVudCkgcmV0dXJuXG4gICAgdmFyIGV2dCA9IGlzTW91bnQgPyAnb24nIDogJ29mZidcblxuICAgIC8vIHRoZSBsb29wIHRhZ3Mgd2lsbCBiZSBhbHdheXMgaW4gc3luYyB3aXRoIHRoZSBwYXJlbnQgYXV0b21hdGljYWxseVxuICAgIGlmIChpc0xvb3ApXG4gICAgICBwYXJlbnRbZXZ0XSgndW5tb3VudCcsIHNlbGYudW5tb3VudClcbiAgICBlbHNlIHtcbiAgICAgIHBhcmVudFtldnRdKCd1cGRhdGUnLCBvbkNoaWxkVXBkYXRlKVtldnRdKCd1bm1vdW50Jywgc2VsZi51bm1vdW50KVxuICAgIH1cbiAgfVxuXG5cbiAgLy8gbmFtZWQgZWxlbWVudHMgYXZhaWxhYmxlIGZvciBmblxuICBwYXJzZU5hbWVkRWxlbWVudHMoZG9tLCB0aGlzLCBjaGlsZFRhZ3MpXG5cbn1cbi8qKlxuICogQXR0YWNoIGFuIGV2ZW50IHRvIGEgRE9NIG5vZGVcbiAqIEBwYXJhbSB7IFN0cmluZyB9IG5hbWUgLSBldmVudCBuYW1lXG4gKiBAcGFyYW0geyBGdW5jdGlvbiB9IGhhbmRsZXIgLSBldmVudCBjYWxsYmFja1xuICogQHBhcmFtIHsgT2JqZWN0IH0gZG9tIC0gZG9tIG5vZGVcbiAqIEBwYXJhbSB7IFRhZyB9IHRhZyAtIHRhZyBpbnN0YW5jZVxuICovXG5mdW5jdGlvbiBzZXRFdmVudEhhbmRsZXIobmFtZSwgaGFuZGxlciwgZG9tLCB0YWcpIHtcblxuICBkb21bbmFtZV0gPSBmdW5jdGlvbihlKSB7XG5cbiAgICB2YXIgcHRhZyA9IHRhZy5fcGFyZW50LFxuICAgICAgaXRlbSA9IHRhZy5faXRlbSxcbiAgICAgIGVsXG5cbiAgICBpZiAoIWl0ZW0pXG4gICAgICB3aGlsZSAocHRhZyAmJiAhaXRlbSkge1xuICAgICAgICBpdGVtID0gcHRhZy5faXRlbVxuICAgICAgICBwdGFnID0gcHRhZy5fcGFyZW50XG4gICAgICB9XG5cbiAgICAvLyBjcm9zcyBicm93c2VyIGV2ZW50IGZpeFxuICAgIGUgPSBlIHx8IHdpbmRvdy5ldmVudFxuXG4gICAgLy8gb3ZlcnJpZGUgdGhlIGV2ZW50IHByb3BlcnRpZXNcbiAgICBpZiAoaXNXcml0YWJsZShlLCAnY3VycmVudFRhcmdldCcpKSBlLmN1cnJlbnRUYXJnZXQgPSBkb21cbiAgICBpZiAoaXNXcml0YWJsZShlLCAndGFyZ2V0JykpIGUudGFyZ2V0ID0gZS5zcmNFbGVtZW50XG4gICAgaWYgKGlzV3JpdGFibGUoZSwgJ3doaWNoJykpIGUud2hpY2ggPSBlLmNoYXJDb2RlIHx8IGUua2V5Q29kZVxuXG4gICAgZS5pdGVtID0gaXRlbVxuXG4gICAgLy8gcHJldmVudCBkZWZhdWx0IGJlaGF2aW91ciAoYnkgZGVmYXVsdClcbiAgICBpZiAoaGFuZGxlci5jYWxsKHRhZywgZSkgIT09IHRydWUgJiYgIS9yYWRpb3xjaGVjay8udGVzdChkb20udHlwZSkpIHtcbiAgICAgIGlmIChlLnByZXZlbnREZWZhdWx0KSBlLnByZXZlbnREZWZhdWx0KClcbiAgICAgIGUucmV0dXJuVmFsdWUgPSBmYWxzZVxuICAgIH1cblxuICAgIGlmICghZS5wcmV2ZW50VXBkYXRlKSB7XG4gICAgICBlbCA9IGl0ZW0gPyBnZXRJbW1lZGlhdGVDdXN0b21QYXJlbnRUYWcocHRhZykgOiB0YWdcbiAgICAgIGVsLnVwZGF0ZSgpXG4gICAgfVxuXG4gIH1cblxufVxuXG5cbi8qKlxuICogSW5zZXJ0IGEgRE9NIG5vZGUgcmVwbGFjaW5nIGFub3RoZXIgb25lICh1c2VkIGJ5IGlmLSBhdHRyaWJ1dGUpXG4gKiBAcGFyYW0gICB7IE9iamVjdCB9IHJvb3QgLSBwYXJlbnQgbm9kZVxuICogQHBhcmFtICAgeyBPYmplY3QgfSBub2RlIC0gbm9kZSByZXBsYWNlZFxuICogQHBhcmFtICAgeyBPYmplY3QgfSBiZWZvcmUgLSBub2RlIGFkZGVkXG4gKi9cbmZ1bmN0aW9uIGluc2VydFRvKHJvb3QsIG5vZGUsIGJlZm9yZSkge1xuICBpZiAoIXJvb3QpIHJldHVyblxuICByb290Lmluc2VydEJlZm9yZShiZWZvcmUsIG5vZGUpXG4gIHJvb3QucmVtb3ZlQ2hpbGQobm9kZSlcbn1cblxuLyoqXG4gKiBVcGRhdGUgdGhlIGV4cHJlc3Npb25zIGluIGEgVGFnIGluc3RhbmNlXG4gKiBAcGFyYW0gICB7IEFycmF5IH0gZXhwcmVzc2lvbnMgLSBleHByZXNzaW9uIHRoYXQgbXVzdCBiZSByZSBldmFsdWF0ZWRcbiAqIEBwYXJhbSAgIHsgVGFnIH0gdGFnIC0gdGFnIGluc3RhbmNlXG4gKi9cbmZ1bmN0aW9uIHVwZGF0ZShleHByZXNzaW9ucywgdGFnKSB7XG5cbiAgZWFjaChleHByZXNzaW9ucywgZnVuY3Rpb24oZXhwciwgaSkge1xuXG4gICAgdmFyIGRvbSA9IGV4cHIuZG9tLFxuICAgICAgYXR0ck5hbWUgPSBleHByLmF0dHIsXG4gICAgICB2YWx1ZSA9IHRtcGwoZXhwci5leHByLCB0YWcpLFxuICAgICAgcGFyZW50ID0gZXhwci5wYXJlbnQgfHwgZXhwci5kb20ucGFyZW50Tm9kZVxuXG4gICAgaWYgKGV4cHIuYm9vbCkge1xuICAgICAgdmFsdWUgPSAhIXZhbHVlXG4gICAgfSBlbHNlIGlmICh2YWx1ZSA9PSBudWxsKSB7XG4gICAgICB2YWx1ZSA9ICcnXG4gICAgfVxuXG4gICAgLy8gIzE2Mzg6IHJlZ3Jlc3Npb24gb2YgIzE2MTIsIHVwZGF0ZSB0aGUgZG9tIG9ubHkgaWYgdGhlIHZhbHVlIG9mIHRoZVxuICAgIC8vIGV4cHJlc3Npb24gd2FzIGNoYW5nZWRcbiAgICBpZiAoZXhwci52YWx1ZSA9PT0gdmFsdWUpIHtcbiAgICAgIHJldHVyblxuICAgIH1cbiAgICBleHByLnZhbHVlID0gdmFsdWVcblxuICAgIC8vIHRleHRhcmVhIGFuZCB0ZXh0IG5vZGVzIGhhcyBubyBhdHRyaWJ1dGUgbmFtZVxuICAgIGlmICghYXR0ck5hbWUpIHtcbiAgICAgIC8vIGFib3V0ICM4MTUgdy9vIHJlcGxhY2U6IHRoZSBicm93c2VyIGNvbnZlcnRzIHRoZSB2YWx1ZSB0byBhIHN0cmluZyxcbiAgICAgIC8vIHRoZSBjb21wYXJpc29uIGJ5IFwiPT1cIiBkb2VzIHRvbywgYnV0IG5vdCBpbiB0aGUgc2VydmVyXG4gICAgICB2YWx1ZSArPSAnJ1xuICAgICAgLy8gdGVzdCBmb3IgcGFyZW50IGF2b2lkcyBlcnJvciB3aXRoIGludmFsaWQgYXNzaWdubWVudCB0byBub2RlVmFsdWVcbiAgICAgIGlmIChwYXJlbnQpIHtcbiAgICAgICAgLy8gY2FjaGUgdGhlIHBhcmVudCBub2RlIGJlY2F1c2Ugc29tZWhvdyBpdCB3aWxsIGJlY29tZSBudWxsIG9uIElFXG4gICAgICAgIC8vIG9uIHRoZSBuZXh0IGl0ZXJhdGlvblxuICAgICAgICBleHByLnBhcmVudCA9IHBhcmVudFxuICAgICAgICBpZiAocGFyZW50LnRhZ05hbWUgPT09ICdURVhUQVJFQScpIHtcbiAgICAgICAgICBwYXJlbnQudmFsdWUgPSB2YWx1ZSAgICAgICAgICAgICAgICAgICAgLy8gIzExMTNcbiAgICAgICAgICBpZiAoIUlFX1ZFUlNJT04pIGRvbS5ub2RlVmFsdWUgPSB2YWx1ZSAgLy8gIzE2MjUgSUUgdGhyb3dzIGhlcmUsIG5vZGVWYWx1ZVxuICAgICAgICB9ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyB3aWxsIGJlIGF2YWlsYWJsZSBvbiAndXBkYXRlZCdcbiAgICAgICAgZWxzZSBkb20ubm9kZVZhbHVlID0gdmFsdWVcbiAgICAgIH1cbiAgICAgIHJldHVyblxuICAgIH1cblxuICAgIC8vIH5+IzE2MTI6IGxvb2sgZm9yIGNoYW5nZXMgaW4gZG9tLnZhbHVlIHdoZW4gdXBkYXRpbmcgdGhlIHZhbHVlfn5cbiAgICBpZiAoYXR0ck5hbWUgPT09ICd2YWx1ZScpIHtcbiAgICAgIGlmIChkb20udmFsdWUgIT09IHZhbHVlKSB7XG4gICAgICAgIGRvbS52YWx1ZSA9IHZhbHVlXG4gICAgICAgIHNldEF0dHIoZG9tLCBhdHRyTmFtZSwgdmFsdWUpXG4gICAgICB9XG4gICAgICByZXR1cm5cbiAgICB9IGVsc2Uge1xuICAgICAgLy8gcmVtb3ZlIG9yaWdpbmFsIGF0dHJpYnV0ZVxuICAgICAgcmVtQXR0cihkb20sIGF0dHJOYW1lKVxuICAgIH1cblxuICAgIC8vIGV2ZW50IGhhbmRsZXJcbiAgICBpZiAoaXNGdW5jdGlvbih2YWx1ZSkpIHtcbiAgICAgIHNldEV2ZW50SGFuZGxlcihhdHRyTmFtZSwgdmFsdWUsIGRvbSwgdGFnKVxuXG4gICAgLy8gaWYtIGNvbmRpdGlvbmFsXG4gICAgfSBlbHNlIGlmIChhdHRyTmFtZSA9PSAnaWYnKSB7XG4gICAgICB2YXIgc3R1YiA9IGV4cHIuc3R1YixcbiAgICAgICAgYWRkID0gZnVuY3Rpb24oKSB7IGluc2VydFRvKHN0dWIucGFyZW50Tm9kZSwgc3R1YiwgZG9tKSB9LFxuICAgICAgICByZW1vdmUgPSBmdW5jdGlvbigpIHsgaW5zZXJ0VG8oZG9tLnBhcmVudE5vZGUsIGRvbSwgc3R1YikgfVxuXG4gICAgICAvLyBhZGQgdG8gRE9NXG4gICAgICBpZiAodmFsdWUpIHtcbiAgICAgICAgaWYgKHN0dWIpIHtcbiAgICAgICAgICBhZGQoKVxuICAgICAgICAgIGRvbS5pblN0dWIgPSBmYWxzZVxuICAgICAgICAgIC8vIGF2b2lkIHRvIHRyaWdnZXIgdGhlIG1vdW50IGV2ZW50IGlmIHRoZSB0YWdzIGlzIG5vdCB2aXNpYmxlIHlldFxuICAgICAgICAgIC8vIG1heWJlIHdlIGNhbiBvcHRpbWl6ZSB0aGlzIGF2b2lkaW5nIHRvIG1vdW50IHRoZSB0YWcgYXQgYWxsXG4gICAgICAgICAgaWYgKCFpc0luU3R1Yihkb20pKSB7XG4gICAgICAgICAgICB3YWxrKGRvbSwgZnVuY3Rpb24oZWwpIHtcbiAgICAgICAgICAgICAgaWYgKGVsLl90YWcgJiYgIWVsLl90YWcuaXNNb3VudGVkKVxuICAgICAgICAgICAgICAgIGVsLl90YWcuaXNNb3VudGVkID0gISFlbC5fdGFnLnRyaWdnZXIoJ21vdW50JylcbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAvLyByZW1vdmUgZnJvbSBET01cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHN0dWIgPSBleHByLnN0dWIgPSBzdHViIHx8IGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKCcnKVxuICAgICAgICAvLyBpZiB0aGUgcGFyZW50Tm9kZSBpcyBkZWZpbmVkIHdlIGNhbiBlYXNpbHkgcmVwbGFjZSB0aGUgdGFnXG4gICAgICAgIGlmIChkb20ucGFyZW50Tm9kZSlcbiAgICAgICAgICByZW1vdmUoKVxuICAgICAgICAvLyBvdGhlcndpc2Ugd2UgbmVlZCB0byB3YWl0IHRoZSB1cGRhdGVkIGV2ZW50XG4gICAgICAgIGVsc2UgKHRhZy5wYXJlbnQgfHwgdGFnKS5vbmUoJ3VwZGF0ZWQnLCByZW1vdmUpXG5cbiAgICAgICAgZG9tLmluU3R1YiA9IHRydWVcbiAgICAgIH1cbiAgICAvLyBzaG93IC8gaGlkZVxuICAgIH0gZWxzZSBpZiAoYXR0ck5hbWUgPT09ICdzaG93Jykge1xuICAgICAgZG9tLnN0eWxlLmRpc3BsYXkgPSB2YWx1ZSA/ICcnIDogJ25vbmUnXG5cbiAgICB9IGVsc2UgaWYgKGF0dHJOYW1lID09PSAnaGlkZScpIHtcbiAgICAgIGRvbS5zdHlsZS5kaXNwbGF5ID0gdmFsdWUgPyAnbm9uZScgOiAnJ1xuXG4gICAgfSBlbHNlIGlmIChleHByLmJvb2wpIHtcbiAgICAgIGRvbVthdHRyTmFtZV0gPSB2YWx1ZVxuICAgICAgaWYgKHZhbHVlKSBzZXRBdHRyKGRvbSwgYXR0ck5hbWUsIGF0dHJOYW1lKVxuICAgICAgaWYgKEZJUkVGT1ggJiYgYXR0ck5hbWUgPT09ICdzZWxlY3RlZCcgJiYgZG9tLnRhZ05hbWUgPT09ICdPUFRJT04nKSB7XG4gICAgICAgIGRvbS5fX3Jpb3QxMzc0ID0gdmFsdWUgICAvLyAjMTM3NFxuICAgICAgfVxuXG4gICAgfSBlbHNlIGlmICh2YWx1ZSA9PT0gMCB8fCB2YWx1ZSAmJiB0eXBlb2YgdmFsdWUgIT09IFRfT0JKRUNUKSB7XG4gICAgICAvLyA8aW1nIHNyYz1cInsgZXhwciB9XCI+XG4gICAgICBpZiAoc3RhcnRzV2l0aChhdHRyTmFtZSwgUklPVF9QUkVGSVgpICYmIGF0dHJOYW1lICE9IFJJT1RfVEFHKSB7XG4gICAgICAgIGF0dHJOYW1lID0gYXR0ck5hbWUuc2xpY2UoUklPVF9QUkVGSVgubGVuZ3RoKVxuICAgICAgfVxuICAgICAgc2V0QXR0cihkb20sIGF0dHJOYW1lLCB2YWx1ZSlcbiAgICB9XG5cbiAgfSlcblxufVxuLyoqXG4gKiBTcGVjaWFsaXplZCBmdW5jdGlvbiBmb3IgbG9vcGluZyBhbiBhcnJheS1saWtlIGNvbGxlY3Rpb24gd2l0aCBgZWFjaD17fWBcbiAqIEBwYXJhbSAgIHsgQXJyYXkgfSBlbHMgLSBjb2xsZWN0aW9uIG9mIGl0ZW1zXG4gKiBAcGFyYW0gICB7RnVuY3Rpb259IGZuIC0gY2FsbGJhY2sgZnVuY3Rpb25cbiAqIEByZXR1cm5zIHsgQXJyYXkgfSB0aGUgYXJyYXkgbG9vcGVkXG4gKi9cbmZ1bmN0aW9uIGVhY2goZWxzLCBmbikge1xuICB2YXIgbGVuID0gZWxzID8gZWxzLmxlbmd0aCA6IDBcblxuICBmb3IgKHZhciBpID0gMCwgZWw7IGkgPCBsZW47IGkrKykge1xuICAgIGVsID0gZWxzW2ldXG4gICAgLy8gcmV0dXJuIGZhbHNlIC0+IGN1cnJlbnQgaXRlbSB3YXMgcmVtb3ZlZCBieSBmbiBkdXJpbmcgdGhlIGxvb3BcbiAgICBpZiAoZWwgIT0gbnVsbCAmJiBmbihlbCwgaSkgPT09IGZhbHNlKSBpLS1cbiAgfVxuICByZXR1cm4gZWxzXG59XG5cbi8qKlxuICogRGV0ZWN0IGlmIHRoZSBhcmd1bWVudCBwYXNzZWQgaXMgYSBmdW5jdGlvblxuICogQHBhcmFtICAgeyAqIH0gdiAtIHdoYXRldmVyIHlvdSB3YW50IHRvIHBhc3MgdG8gdGhpcyBmdW5jdGlvblxuICogQHJldHVybnMgeyBCb29sZWFuIH0gLVxuICovXG5mdW5jdGlvbiBpc0Z1bmN0aW9uKHYpIHtcbiAgcmV0dXJuIHR5cGVvZiB2ID09PSBUX0ZVTkNUSU9OIHx8IGZhbHNlICAgLy8gYXZvaWQgSUUgcHJvYmxlbXNcbn1cblxuLyoqXG4gKiBHZXQgdGhlIG91dGVyIGh0bWwgb2YgYW55IERPTSBub2RlIFNWR3MgaW5jbHVkZWRcbiAqIEBwYXJhbSAgIHsgT2JqZWN0IH0gZWwgLSBET00gbm9kZSB0byBwYXJzZVxuICogQHJldHVybnMgeyBTdHJpbmcgfSBlbC5vdXRlckhUTUxcbiAqL1xuZnVuY3Rpb24gZ2V0T3V0ZXJIVE1MKGVsKSB7XG4gIGlmIChlbC5vdXRlckhUTUwpIHJldHVybiBlbC5vdXRlckhUTUxcbiAgLy8gc29tZSBicm93c2VycyBkbyBub3Qgc3VwcG9ydCBvdXRlckhUTUwgb24gdGhlIFNWR3MgdGFnc1xuICBlbHNlIHtcbiAgICB2YXIgY29udGFpbmVyID0gbWtFbCgnZGl2JylcbiAgICBjb250YWluZXIuYXBwZW5kQ2hpbGQoZWwuY2xvbmVOb2RlKHRydWUpKVxuICAgIHJldHVybiBjb250YWluZXIuaW5uZXJIVE1MXG4gIH1cbn1cblxuLyoqXG4gKiBTZXQgdGhlIGlubmVyIGh0bWwgb2YgYW55IERPTSBub2RlIFNWR3MgaW5jbHVkZWRcbiAqIEBwYXJhbSB7IE9iamVjdCB9IGNvbnRhaW5lciAtIERPTSBub2RlIHdoZXJlIHdlIHdpbGwgaW5qZWN0IHRoZSBuZXcgaHRtbFxuICogQHBhcmFtIHsgU3RyaW5nIH0gaHRtbCAtIGh0bWwgdG8gaW5qZWN0XG4gKi9cbmZ1bmN0aW9uIHNldElubmVySFRNTChjb250YWluZXIsIGh0bWwpIHtcbiAgaWYgKHR5cGVvZiBjb250YWluZXIuaW5uZXJIVE1MICE9IFRfVU5ERUYpIGNvbnRhaW5lci5pbm5lckhUTUwgPSBodG1sXG4gIC8vIHNvbWUgYnJvd3NlcnMgZG8gbm90IHN1cHBvcnQgaW5uZXJIVE1MIG9uIHRoZSBTVkdzIHRhZ3NcbiAgZWxzZSB7XG4gICAgdmFyIGRvYyA9IG5ldyBET01QYXJzZXIoKS5wYXJzZUZyb21TdHJpbmcoaHRtbCwgJ2FwcGxpY2F0aW9uL3htbCcpXG4gICAgY29udGFpbmVyLmFwcGVuZENoaWxkKFxuICAgICAgY29udGFpbmVyLm93bmVyRG9jdW1lbnQuaW1wb3J0Tm9kZShkb2MuZG9jdW1lbnRFbGVtZW50LCB0cnVlKVxuICAgIClcbiAgfVxufVxuXG4vKipcbiAqIENoZWNrcyB3ZXRoZXIgYSBET00gbm9kZSBtdXN0IGJlIGNvbnNpZGVyZWQgcGFydCBvZiBhbiBzdmcgZG9jdW1lbnRcbiAqIEBwYXJhbSAgIHsgU3RyaW5nIH0gIG5hbWUgLSB0YWcgbmFtZVxuICogQHJldHVybnMgeyBCb29sZWFuIH0gLVxuICovXG5mdW5jdGlvbiBpc1NWR1RhZyhuYW1lKSB7XG4gIHJldHVybiB+U1ZHX1RBR1NfTElTVC5pbmRleE9mKG5hbWUpXG59XG5cbi8qKlxuICogRGV0ZWN0IGlmIHRoZSBhcmd1bWVudCBwYXNzZWQgaXMgYW4gb2JqZWN0LCBleGNsdWRlIG51bGwuXG4gKiBOT1RFOiBVc2UgaXNPYmplY3QoeCkgJiYgIWlzQXJyYXkoeCkgdG8gZXhjbHVkZXMgYXJyYXlzLlxuICogQHBhcmFtICAgeyAqIH0gdiAtIHdoYXRldmVyIHlvdSB3YW50IHRvIHBhc3MgdG8gdGhpcyBmdW5jdGlvblxuICogQHJldHVybnMgeyBCb29sZWFuIH0gLVxuICovXG5mdW5jdGlvbiBpc09iamVjdCh2KSB7XG4gIHJldHVybiB2ICYmIHR5cGVvZiB2ID09PSBUX09CSkVDVCAgICAgICAgIC8vIHR5cGVvZiBudWxsIGlzICdvYmplY3QnXG59XG5cbi8qKlxuICogUmVtb3ZlIGFueSBET00gYXR0cmlidXRlIGZyb20gYSBub2RlXG4gKiBAcGFyYW0gICB7IE9iamVjdCB9IGRvbSAtIERPTSBub2RlIHdlIHdhbnQgdG8gdXBkYXRlXG4gKiBAcGFyYW0gICB7IFN0cmluZyB9IG5hbWUgLSBuYW1lIG9mIHRoZSBwcm9wZXJ0eSB3ZSB3YW50IHRvIHJlbW92ZVxuICovXG5mdW5jdGlvbiByZW1BdHRyKGRvbSwgbmFtZSkge1xuICBkb20ucmVtb3ZlQXR0cmlidXRlKG5hbWUpXG59XG5cbi8qKlxuICogQ29udmVydCBhIHN0cmluZyBjb250YWluaW5nIGRhc2hlcyB0byBjYW1lbCBjYXNlXG4gKiBAcGFyYW0gICB7IFN0cmluZyB9IHN0cmluZyAtIGlucHV0IHN0cmluZ1xuICogQHJldHVybnMgeyBTdHJpbmcgfSBteS1zdHJpbmcgLT4gbXlTdHJpbmdcbiAqL1xuZnVuY3Rpb24gdG9DYW1lbChzdHJpbmcpIHtcbiAgcmV0dXJuIHN0cmluZy5yZXBsYWNlKC8tKFxcdykvZywgZnVuY3Rpb24oXywgYykge1xuICAgIHJldHVybiBjLnRvVXBwZXJDYXNlKClcbiAgfSlcbn1cblxuLyoqXG4gKiBHZXQgdGhlIHZhbHVlIG9mIGFueSBET00gYXR0cmlidXRlIG9uIGEgbm9kZVxuICogQHBhcmFtICAgeyBPYmplY3QgfSBkb20gLSBET00gbm9kZSB3ZSB3YW50IHRvIHBhcnNlXG4gKiBAcGFyYW0gICB7IFN0cmluZyB9IG5hbWUgLSBuYW1lIG9mIHRoZSBhdHRyaWJ1dGUgd2Ugd2FudCB0byBnZXRcbiAqIEByZXR1cm5zIHsgU3RyaW5nIHwgdW5kZWZpbmVkIH0gbmFtZSBvZiB0aGUgbm9kZSBhdHRyaWJ1dGUgd2hldGhlciBpdCBleGlzdHNcbiAqL1xuZnVuY3Rpb24gZ2V0QXR0cihkb20sIG5hbWUpIHtcbiAgcmV0dXJuIGRvbS5nZXRBdHRyaWJ1dGUobmFtZSlcbn1cblxuLyoqXG4gKiBTZXQgYW55IERPTS9TVkcgYXR0cmlidXRlXG4gKiBAcGFyYW0geyBPYmplY3QgfSBkb20gLSBET00gbm9kZSB3ZSB3YW50IHRvIHVwZGF0ZVxuICogQHBhcmFtIHsgU3RyaW5nIH0gbmFtZSAtIG5hbWUgb2YgdGhlIHByb3BlcnR5IHdlIHdhbnQgdG8gc2V0XG4gKiBAcGFyYW0geyBTdHJpbmcgfSB2YWwgLSB2YWx1ZSBvZiB0aGUgcHJvcGVydHkgd2Ugd2FudCB0byBzZXRcbiAqL1xuZnVuY3Rpb24gc2V0QXR0cihkb20sIG5hbWUsIHZhbCkge1xuICB2YXIgeGxpbmsgPSBYTElOS19SRUdFWC5leGVjKG5hbWUpXG4gIGlmICh4bGluayAmJiB4bGlua1sxXSlcbiAgICBkb20uc2V0QXR0cmlidXRlTlMoWExJTktfTlMsIHhsaW5rWzFdLCB2YWwpXG4gIGVsc2VcbiAgICBkb20uc2V0QXR0cmlidXRlKG5hbWUsIHZhbClcbn1cblxuLyoqXG4gKiBEZXRlY3QgdGhlIHRhZyBpbXBsZW1lbnRhdGlvbiBieSBhIERPTSBub2RlXG4gKiBAcGFyYW0gICB7IE9iamVjdCB9IGRvbSAtIERPTSBub2RlIHdlIG5lZWQgdG8gcGFyc2UgdG8gZ2V0IGl0cyB0YWcgaW1wbGVtZW50YXRpb25cbiAqIEByZXR1cm5zIHsgT2JqZWN0IH0gaXQgcmV0dXJucyBhbiBvYmplY3QgY29udGFpbmluZyB0aGUgaW1wbGVtZW50YXRpb24gb2YgYSBjdXN0b20gdGFnICh0ZW1wbGF0ZSBhbmQgYm9vdCBmdW5jdGlvbilcbiAqL1xuZnVuY3Rpb24gZ2V0VGFnKGRvbSkge1xuICByZXR1cm4gZG9tLnRhZ05hbWUgJiYgX190YWdJbXBsW2dldEF0dHIoZG9tLCBSSU9UX1RBR19JUykgfHxcbiAgICBnZXRBdHRyKGRvbSwgUklPVF9UQUcpIHx8IGRvbS50YWdOYW1lLnRvTG93ZXJDYXNlKCldXG59XG4vKipcbiAqIEFkZCBhIGNoaWxkIHRhZyB0byBpdHMgcGFyZW50IGludG8gdGhlIGB0YWdzYCBvYmplY3RcbiAqIEBwYXJhbSAgIHsgT2JqZWN0IH0gdGFnIC0gY2hpbGQgdGFnIGluc3RhbmNlXG4gKiBAcGFyYW0gICB7IFN0cmluZyB9IHRhZ05hbWUgLSBrZXkgd2hlcmUgdGhlIG5ldyB0YWcgd2lsbCBiZSBzdG9yZWRcbiAqIEBwYXJhbSAgIHsgT2JqZWN0IH0gcGFyZW50IC0gdGFnIGluc3RhbmNlIHdoZXJlIHRoZSBuZXcgY2hpbGQgdGFnIHdpbGwgYmUgaW5jbHVkZWRcbiAqL1xuZnVuY3Rpb24gYWRkQ2hpbGRUYWcodGFnLCB0YWdOYW1lLCBwYXJlbnQpIHtcbiAgdmFyIGNhY2hlZFRhZyA9IHBhcmVudC50YWdzW3RhZ05hbWVdXG5cbiAgLy8gaWYgdGhlcmUgYXJlIG11bHRpcGxlIGNoaWxkcmVuIHRhZ3MgaGF2aW5nIHRoZSBzYW1lIG5hbWVcbiAgaWYgKGNhY2hlZFRhZykge1xuICAgIC8vIGlmIHRoZSBwYXJlbnQgdGFncyBwcm9wZXJ0eSBpcyBub3QgeWV0IGFuIGFycmF5XG4gICAgLy8gY3JlYXRlIGl0IGFkZGluZyB0aGUgZmlyc3QgY2FjaGVkIHRhZ1xuICAgIGlmICghaXNBcnJheShjYWNoZWRUYWcpKVxuICAgICAgLy8gZG9uJ3QgYWRkIHRoZSBzYW1lIHRhZyB0d2ljZVxuICAgICAgaWYgKGNhY2hlZFRhZyAhPT0gdGFnKVxuICAgICAgICBwYXJlbnQudGFnc1t0YWdOYW1lXSA9IFtjYWNoZWRUYWddXG4gICAgLy8gYWRkIHRoZSBuZXcgbmVzdGVkIHRhZyB0byB0aGUgYXJyYXlcbiAgICBpZiAoIWNvbnRhaW5zKHBhcmVudC50YWdzW3RhZ05hbWVdLCB0YWcpKVxuICAgICAgcGFyZW50LnRhZ3NbdGFnTmFtZV0ucHVzaCh0YWcpXG4gIH0gZWxzZSB7XG4gICAgcGFyZW50LnRhZ3NbdGFnTmFtZV0gPSB0YWdcbiAgfVxufVxuXG4vKipcbiAqIE1vdmUgdGhlIHBvc2l0aW9uIG9mIGEgY3VzdG9tIHRhZyBpbiBpdHMgcGFyZW50IHRhZ1xuICogQHBhcmFtICAgeyBPYmplY3QgfSB0YWcgLSBjaGlsZCB0YWcgaW5zdGFuY2VcbiAqIEBwYXJhbSAgIHsgU3RyaW5nIH0gdGFnTmFtZSAtIGtleSB3aGVyZSB0aGUgdGFnIHdhcyBzdG9yZWRcbiAqIEBwYXJhbSAgIHsgTnVtYmVyIH0gbmV3UG9zIC0gaW5kZXggd2hlcmUgdGhlIG5ldyB0YWcgd2lsbCBiZSBzdG9yZWRcbiAqL1xuZnVuY3Rpb24gbW92ZUNoaWxkVGFnKHRhZywgdGFnTmFtZSwgbmV3UG9zKSB7XG4gIHZhciBwYXJlbnQgPSB0YWcucGFyZW50LFxuICAgIHRhZ3NcbiAgLy8gbm8gcGFyZW50IG5vIG1vdmVcbiAgaWYgKCFwYXJlbnQpIHJldHVyblxuXG4gIHRhZ3MgPSBwYXJlbnQudGFnc1t0YWdOYW1lXVxuXG4gIGlmIChpc0FycmF5KHRhZ3MpKVxuICAgIHRhZ3Muc3BsaWNlKG5ld1BvcywgMCwgdGFncy5zcGxpY2UodGFncy5pbmRleE9mKHRhZyksIDEpWzBdKVxuICBlbHNlIGFkZENoaWxkVGFnKHRhZywgdGFnTmFtZSwgcGFyZW50KVxufVxuXG4vKipcbiAqIENyZWF0ZSBhIG5ldyBjaGlsZCB0YWcgaW5jbHVkaW5nIGl0IGNvcnJlY3RseSBpbnRvIGl0cyBwYXJlbnRcbiAqIEBwYXJhbSAgIHsgT2JqZWN0IH0gY2hpbGQgLSBjaGlsZCB0YWcgaW1wbGVtZW50YXRpb25cbiAqIEBwYXJhbSAgIHsgT2JqZWN0IH0gb3B0cyAtIHRhZyBvcHRpb25zIGNvbnRhaW5pbmcgdGhlIERPTSBub2RlIHdoZXJlIHRoZSB0YWcgd2lsbCBiZSBtb3VudGVkXG4gKiBAcGFyYW0gICB7IFN0cmluZyB9IGlubmVySFRNTCAtIGlubmVyIGh0bWwgb2YgdGhlIGNoaWxkIG5vZGVcbiAqIEBwYXJhbSAgIHsgT2JqZWN0IH0gcGFyZW50IC0gaW5zdGFuY2Ugb2YgdGhlIHBhcmVudCB0YWcgaW5jbHVkaW5nIHRoZSBjaGlsZCBjdXN0b20gdGFnXG4gKiBAcmV0dXJucyB7IE9iamVjdCB9IGluc3RhbmNlIG9mIHRoZSBuZXcgY2hpbGQgdGFnIGp1c3QgY3JlYXRlZFxuICovXG5mdW5jdGlvbiBpbml0Q2hpbGRUYWcoY2hpbGQsIG9wdHMsIGlubmVySFRNTCwgcGFyZW50KSB7XG4gIHZhciB0YWcgPSBuZXcgVGFnKGNoaWxkLCBvcHRzLCBpbm5lckhUTUwpLFxuICAgIHRhZ05hbWUgPSBnZXRUYWdOYW1lKG9wdHMucm9vdCksXG4gICAgcHRhZyA9IGdldEltbWVkaWF0ZUN1c3RvbVBhcmVudFRhZyhwYXJlbnQpXG4gIC8vIGZpeCBmb3IgdGhlIHBhcmVudCBhdHRyaWJ1dGUgaW4gdGhlIGxvb3BlZCBlbGVtZW50c1xuICB0YWcucGFyZW50ID0gcHRhZ1xuICAvLyBzdG9yZSB0aGUgcmVhbCBwYXJlbnQgdGFnXG4gIC8vIGluIHNvbWUgY2FzZXMgdGhpcyBjb3VsZCBiZSBkaWZmZXJlbnQgZnJvbSB0aGUgY3VzdG9tIHBhcmVudCB0YWdcbiAgLy8gZm9yIGV4YW1wbGUgaW4gbmVzdGVkIGxvb3BzXG4gIHRhZy5fcGFyZW50ID0gcGFyZW50XG5cbiAgLy8gYWRkIHRoaXMgdGFnIHRvIHRoZSBjdXN0b20gcGFyZW50IHRhZ1xuICBhZGRDaGlsZFRhZyh0YWcsIHRhZ05hbWUsIHB0YWcpXG4gIC8vIGFuZCBhbHNvIHRvIHRoZSByZWFsIHBhcmVudCB0YWdcbiAgaWYgKHB0YWcgIT09IHBhcmVudClcbiAgICBhZGRDaGlsZFRhZyh0YWcsIHRhZ05hbWUsIHBhcmVudClcbiAgLy8gZW1wdHkgdGhlIGNoaWxkIG5vZGUgb25jZSB3ZSBnb3QgaXRzIHRlbXBsYXRlXG4gIC8vIHRvIGF2b2lkIHRoYXQgaXRzIGNoaWxkcmVuIGdldCBjb21waWxlZCBtdWx0aXBsZSB0aW1lc1xuICBvcHRzLnJvb3QuaW5uZXJIVE1MID0gJydcblxuICByZXR1cm4gdGFnXG59XG5cbi8qKlxuICogTG9vcCBiYWNrd2FyZCBhbGwgdGhlIHBhcmVudHMgdHJlZSB0byBkZXRlY3QgdGhlIGZpcnN0IGN1c3RvbSBwYXJlbnQgdGFnXG4gKiBAcGFyYW0gICB7IE9iamVjdCB9IHRhZyAtIGEgVGFnIGluc3RhbmNlXG4gKiBAcmV0dXJucyB7IE9iamVjdCB9IHRoZSBpbnN0YW5jZSBvZiB0aGUgZmlyc3QgY3VzdG9tIHBhcmVudCB0YWcgZm91bmRcbiAqL1xuZnVuY3Rpb24gZ2V0SW1tZWRpYXRlQ3VzdG9tUGFyZW50VGFnKHRhZykge1xuICB2YXIgcHRhZyA9IHRhZ1xuICB3aGlsZSAoIWdldFRhZyhwdGFnLnJvb3QpKSB7XG4gICAgaWYgKCFwdGFnLnBhcmVudCkgYnJlYWtcbiAgICBwdGFnID0gcHRhZy5wYXJlbnRcbiAgfVxuICByZXR1cm4gcHRhZ1xufVxuXG4vKipcbiAqIEhlbHBlciBmdW5jdGlvbiB0byBzZXQgYW4gaW1tdXRhYmxlIHByb3BlcnR5XG4gKiBAcGFyYW0gICB7IE9iamVjdCB9IGVsIC0gb2JqZWN0IHdoZXJlIHRoZSBuZXcgcHJvcGVydHkgd2lsbCBiZSBzZXRcbiAqIEBwYXJhbSAgIHsgU3RyaW5nIH0ga2V5IC0gb2JqZWN0IGtleSB3aGVyZSB0aGUgbmV3IHByb3BlcnR5IHdpbGwgYmUgc3RvcmVkXG4gKiBAcGFyYW0gICB7ICogfSB2YWx1ZSAtIHZhbHVlIG9mIHRoZSBuZXcgcHJvcGVydHlcbiogQHBhcmFtICAgeyBPYmplY3QgfSBvcHRpb25zIC0gc2V0IHRoZSBwcm9wZXJ5IG92ZXJyaWRpbmcgdGhlIGRlZmF1bHQgb3B0aW9uc1xuICogQHJldHVybnMgeyBPYmplY3QgfSAtIHRoZSBpbml0aWFsIG9iamVjdFxuICovXG5mdW5jdGlvbiBkZWZpbmVQcm9wZXJ0eShlbCwga2V5LCB2YWx1ZSwgb3B0aW9ucykge1xuICBPYmplY3QuZGVmaW5lUHJvcGVydHkoZWwsIGtleSwgZXh0ZW5kKHtcbiAgICB2YWx1ZTogdmFsdWUsXG4gICAgZW51bWVyYWJsZTogZmFsc2UsXG4gICAgd3JpdGFibGU6IGZhbHNlLFxuICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZVxuICB9LCBvcHRpb25zKSlcbiAgcmV0dXJuIGVsXG59XG5cbi8qKlxuICogR2V0IHRoZSB0YWcgbmFtZSBvZiBhbnkgRE9NIG5vZGVcbiAqIEBwYXJhbSAgIHsgT2JqZWN0IH0gZG9tIC0gRE9NIG5vZGUgd2Ugd2FudCB0byBwYXJzZVxuICogQHJldHVybnMgeyBTdHJpbmcgfSBuYW1lIHRvIGlkZW50aWZ5IHRoaXMgZG9tIG5vZGUgaW4gcmlvdFxuICovXG5mdW5jdGlvbiBnZXRUYWdOYW1lKGRvbSkge1xuICB2YXIgY2hpbGQgPSBnZXRUYWcoZG9tKSxcbiAgICBuYW1lZFRhZyA9IGdldEF0dHIoZG9tLCAnbmFtZScpLFxuICAgIHRhZ05hbWUgPSBuYW1lZFRhZyAmJiAhdG1wbC5oYXNFeHByKG5hbWVkVGFnKSA/XG4gICAgICAgICAgICAgICAgbmFtZWRUYWcgOlxuICAgICAgICAgICAgICBjaGlsZCA/IGNoaWxkLm5hbWUgOiBkb20udGFnTmFtZS50b0xvd2VyQ2FzZSgpXG5cbiAgcmV0dXJuIHRhZ05hbWVcbn1cblxuLyoqXG4gKiBFeHRlbmQgYW55IG9iamVjdCB3aXRoIG90aGVyIHByb3BlcnRpZXNcbiAqIEBwYXJhbSAgIHsgT2JqZWN0IH0gc3JjIC0gc291cmNlIG9iamVjdFxuICogQHJldHVybnMgeyBPYmplY3QgfSB0aGUgcmVzdWx0aW5nIGV4dGVuZGVkIG9iamVjdFxuICpcbiAqIHZhciBvYmogPSB7IGZvbzogJ2JheicgfVxuICogZXh0ZW5kKG9iaiwge2JhcjogJ2JhcicsIGZvbzogJ2Jhcid9KVxuICogY29uc29sZS5sb2cob2JqKSA9PiB7YmFyOiAnYmFyJywgZm9vOiAnYmFyJ31cbiAqXG4gKi9cbmZ1bmN0aW9uIGV4dGVuZChzcmMpIHtcbiAgdmFyIG9iaiwgYXJncyA9IGFyZ3VtZW50c1xuICBmb3IgKHZhciBpID0gMTsgaSA8IGFyZ3MubGVuZ3RoOyArK2kpIHtcbiAgICBpZiAob2JqID0gYXJnc1tpXSkge1xuICAgICAgZm9yICh2YXIga2V5IGluIG9iaikge1xuICAgICAgICAvLyBjaGVjayBpZiB0aGlzIHByb3BlcnR5IG9mIHRoZSBzb3VyY2Ugb2JqZWN0IGNvdWxkIGJlIG92ZXJyaWRkZW5cbiAgICAgICAgaWYgKGlzV3JpdGFibGUoc3JjLCBrZXkpKVxuICAgICAgICAgIHNyY1trZXldID0gb2JqW2tleV1cbiAgICAgIH1cbiAgICB9XG4gIH1cbiAgcmV0dXJuIHNyY1xufVxuXG4vKipcbiAqIENoZWNrIHdoZXRoZXIgYW4gYXJyYXkgY29udGFpbnMgYW4gaXRlbVxuICogQHBhcmFtICAgeyBBcnJheSB9IGFyciAtIHRhcmdldCBhcnJheVxuICogQHBhcmFtICAgeyAqIH0gaXRlbSAtIGl0ZW0gdG8gdGVzdFxuICogQHJldHVybnMgeyBCb29sZWFuIH0gRG9lcyAnYXJyJyBjb250YWluICdpdGVtJz9cbiAqL1xuZnVuY3Rpb24gY29udGFpbnMoYXJyLCBpdGVtKSB7XG4gIHJldHVybiB+YXJyLmluZGV4T2YoaXRlbSlcbn1cblxuLyoqXG4gKiBDaGVjayB3aGV0aGVyIGFuIG9iamVjdCBpcyBhIGtpbmQgb2YgYXJyYXlcbiAqIEBwYXJhbSAgIHsgKiB9IGEgLSBhbnl0aGluZ1xuICogQHJldHVybnMge0Jvb2xlYW59IGlzICdhJyBhbiBhcnJheT9cbiAqL1xuZnVuY3Rpb24gaXNBcnJheShhKSB7IHJldHVybiBBcnJheS5pc0FycmF5KGEpIHx8IGEgaW5zdGFuY2VvZiBBcnJheSB9XG5cbi8qKlxuICogRGV0ZWN0IHdoZXRoZXIgYSBwcm9wZXJ0eSBvZiBhbiBvYmplY3QgY291bGQgYmUgb3ZlcnJpZGRlblxuICogQHBhcmFtICAgeyBPYmplY3QgfSAgb2JqIC0gc291cmNlIG9iamVjdFxuICogQHBhcmFtICAgeyBTdHJpbmcgfSAga2V5IC0gb2JqZWN0IHByb3BlcnR5XG4gKiBAcmV0dXJucyB7IEJvb2xlYW4gfSBpcyB0aGlzIHByb3BlcnR5IHdyaXRhYmxlP1xuICovXG5mdW5jdGlvbiBpc1dyaXRhYmxlKG9iaiwga2V5KSB7XG4gIHZhciBwcm9wcyA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3Iob2JqLCBrZXkpXG4gIHJldHVybiB0eXBlb2Ygb2JqW2tleV0gPT09IFRfVU5ERUYgfHwgcHJvcHMgJiYgcHJvcHMud3JpdGFibGVcbn1cblxuXG4vKipcbiAqIFdpdGggdGhpcyBmdW5jdGlvbiB3ZSBhdm9pZCB0aGF0IHRoZSBpbnRlcm5hbCBUYWcgbWV0aG9kcyBnZXQgb3ZlcnJpZGRlblxuICogQHBhcmFtICAgeyBPYmplY3QgfSBkYXRhIC0gb3B0aW9ucyB3ZSB3YW50IHRvIHVzZSB0byBleHRlbmQgdGhlIHRhZyBpbnN0YW5jZVxuICogQHJldHVybnMgeyBPYmplY3QgfSBjbGVhbiBvYmplY3Qgd2l0aG91dCBjb250YWluaW5nIHRoZSByaW90IGludGVybmFsIHJlc2VydmVkIHdvcmRzXG4gKi9cbmZ1bmN0aW9uIGNsZWFuVXBEYXRhKGRhdGEpIHtcbiAgaWYgKCEoZGF0YSBpbnN0YW5jZW9mIFRhZykgJiYgIShkYXRhICYmIHR5cGVvZiBkYXRhLnRyaWdnZXIgPT0gVF9GVU5DVElPTikpXG4gICAgcmV0dXJuIGRhdGFcblxuICB2YXIgbyA9IHt9XG4gIGZvciAodmFyIGtleSBpbiBkYXRhKSB7XG4gICAgaWYgKCFSRVNFUlZFRF9XT1JEU19CTEFDS0xJU1QudGVzdChrZXkpKSBvW2tleV0gPSBkYXRhW2tleV1cbiAgfVxuICByZXR1cm4gb1xufVxuXG4vKipcbiAqIFdhbGsgZG93biByZWN1cnNpdmVseSBhbGwgdGhlIGNoaWxkcmVuIHRhZ3Mgc3RhcnRpbmcgZG9tIG5vZGVcbiAqIEBwYXJhbSAgIHsgT2JqZWN0IH0gICBkb20gLSBzdGFydGluZyBub2RlIHdoZXJlIHdlIHdpbGwgc3RhcnQgdGhlIHJlY3Vyc2lvblxuICogQHBhcmFtICAgeyBGdW5jdGlvbiB9IGZuIC0gY2FsbGJhY2sgdG8gdHJhbnNmb3JtIHRoZSBjaGlsZCBub2RlIGp1c3QgZm91bmRcbiAqL1xuZnVuY3Rpb24gd2Fsayhkb20sIGZuKSB7XG4gIGlmIChkb20pIHtcbiAgICAvLyBzdG9wIHRoZSByZWN1cnNpb25cbiAgICBpZiAoZm4oZG9tKSA9PT0gZmFsc2UpIHJldHVyblxuICAgIGVsc2Uge1xuICAgICAgZG9tID0gZG9tLmZpcnN0Q2hpbGRcblxuICAgICAgd2hpbGUgKGRvbSkge1xuICAgICAgICB3YWxrKGRvbSwgZm4pXG4gICAgICAgIGRvbSA9IGRvbS5uZXh0U2libGluZ1xuICAgICAgfVxuICAgIH1cbiAgfVxufVxuXG4vKipcbiAqIE1pbmltaXplIHJpc2s6IG9ubHkgemVybyBvciBvbmUgX3NwYWNlXyBiZXR3ZWVuIGF0dHIgJiB2YWx1ZVxuICogQHBhcmFtICAgeyBTdHJpbmcgfSAgIGh0bWwgLSBodG1sIHN0cmluZyB3ZSB3YW50IHRvIHBhcnNlXG4gKiBAcGFyYW0gICB7IEZ1bmN0aW9uIH0gZm4gLSBjYWxsYmFjayBmdW5jdGlvbiB0byBhcHBseSBvbiBhbnkgYXR0cmlidXRlIGZvdW5kXG4gKi9cbmZ1bmN0aW9uIHdhbGtBdHRyaWJ1dGVzKGh0bWwsIGZuKSB7XG4gIHZhciBtLFxuICAgIHJlID0gLyhbLVxcd10rKSA/PSA/KD86XCIoW15cIl0qKXwnKFteJ10qKXwoe1tefV0qfSkpL2dcblxuICB3aGlsZSAobSA9IHJlLmV4ZWMoaHRtbCkpIHtcbiAgICBmbihtWzFdLnRvTG93ZXJDYXNlKCksIG1bMl0gfHwgbVszXSB8fCBtWzRdKVxuICB9XG59XG5cbi8qKlxuICogQ2hlY2sgd2hldGhlciBhIERPTSBub2RlIGlzIGluIHN0dWIgbW9kZSwgdXNlZnVsIGZvciB0aGUgcmlvdCAnaWYnIGRpcmVjdGl2ZVxuICogQHBhcmFtICAgeyBPYmplY3QgfSAgZG9tIC0gRE9NIG5vZGUgd2Ugd2FudCB0byBwYXJzZVxuICogQHJldHVybnMgeyBCb29sZWFuIH0gLVxuICovXG5mdW5jdGlvbiBpc0luU3R1Yihkb20pIHtcbiAgd2hpbGUgKGRvbSkge1xuICAgIGlmIChkb20uaW5TdHViKSByZXR1cm4gdHJ1ZVxuICAgIGRvbSA9IGRvbS5wYXJlbnROb2RlXG4gIH1cbiAgcmV0dXJuIGZhbHNlXG59XG5cbi8qKlxuICogQ3JlYXRlIGEgZ2VuZXJpYyBET00gbm9kZVxuICogQHBhcmFtICAgeyBTdHJpbmcgfSBuYW1lIC0gbmFtZSBvZiB0aGUgRE9NIG5vZGUgd2Ugd2FudCB0byBjcmVhdGVcbiAqIEBwYXJhbSAgIHsgQm9vbGVhbiB9IGlzU3ZnIC0gc2hvdWxkIHdlIHVzZSBhIFNWRyBhcyBwYXJlbnQgbm9kZT9cbiAqIEByZXR1cm5zIHsgT2JqZWN0IH0gRE9NIG5vZGUganVzdCBjcmVhdGVkXG4gKi9cbmZ1bmN0aW9uIG1rRWwobmFtZSwgaXNTdmcpIHtcbiAgcmV0dXJuIGlzU3ZnID9cbiAgICBkb2N1bWVudC5jcmVhdGVFbGVtZW50TlMoJ2h0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnJywgJ3N2ZycpIDpcbiAgICBkb2N1bWVudC5jcmVhdGVFbGVtZW50KG5hbWUpXG59XG5cbi8qKlxuICogU2hvcnRlciBhbmQgZmFzdCB3YXkgdG8gc2VsZWN0IG11bHRpcGxlIG5vZGVzIGluIHRoZSBET01cbiAqIEBwYXJhbSAgIHsgU3RyaW5nIH0gc2VsZWN0b3IgLSBET00gc2VsZWN0b3JcbiAqIEBwYXJhbSAgIHsgT2JqZWN0IH0gY3R4IC0gRE9NIG5vZGUgd2hlcmUgdGhlIHRhcmdldHMgb2Ygb3VyIHNlYXJjaCB3aWxsIGlzIGxvY2F0ZWRcbiAqIEByZXR1cm5zIHsgT2JqZWN0IH0gZG9tIG5vZGVzIGZvdW5kXG4gKi9cbmZ1bmN0aW9uICQkKHNlbGVjdG9yLCBjdHgpIHtcbiAgcmV0dXJuIChjdHggfHwgZG9jdW1lbnQpLnF1ZXJ5U2VsZWN0b3JBbGwoc2VsZWN0b3IpXG59XG5cbi8qKlxuICogU2hvcnRlciBhbmQgZmFzdCB3YXkgdG8gc2VsZWN0IGEgc2luZ2xlIG5vZGUgaW4gdGhlIERPTVxuICogQHBhcmFtICAgeyBTdHJpbmcgfSBzZWxlY3RvciAtIHVuaXF1ZSBkb20gc2VsZWN0b3JcbiAqIEBwYXJhbSAgIHsgT2JqZWN0IH0gY3R4IC0gRE9NIG5vZGUgd2hlcmUgdGhlIHRhcmdldCBvZiBvdXIgc2VhcmNoIHdpbGwgaXMgbG9jYXRlZFxuICogQHJldHVybnMgeyBPYmplY3QgfSBkb20gbm9kZSBmb3VuZFxuICovXG5mdW5jdGlvbiAkKHNlbGVjdG9yLCBjdHgpIHtcbiAgcmV0dXJuIChjdHggfHwgZG9jdW1lbnQpLnF1ZXJ5U2VsZWN0b3Ioc2VsZWN0b3IpXG59XG5cbi8qKlxuICogU2ltcGxlIG9iamVjdCBwcm90b3R5cGFsIGluaGVyaXRhbmNlXG4gKiBAcGFyYW0gICB7IE9iamVjdCB9IHBhcmVudCAtIHBhcmVudCBvYmplY3RcbiAqIEByZXR1cm5zIHsgT2JqZWN0IH0gY2hpbGQgaW5zdGFuY2VcbiAqL1xuZnVuY3Rpb24gaW5oZXJpdChwYXJlbnQpIHtcbiAgcmV0dXJuIE9iamVjdC5jcmVhdGUocGFyZW50IHx8IG51bGwpXG59XG5cbi8qKlxuICogR2V0IHRoZSBuYW1lIHByb3BlcnR5IG5lZWRlZCB0byBpZGVudGlmeSBhIERPTSBub2RlIGluIHJpb3RcbiAqIEBwYXJhbSAgIHsgT2JqZWN0IH0gZG9tIC0gRE9NIG5vZGUgd2UgbmVlZCB0byBwYXJzZVxuICogQHJldHVybnMgeyBTdHJpbmcgfCB1bmRlZmluZWQgfSBnaXZlIHVzIGJhY2sgYSBzdHJpbmcgdG8gaWRlbnRpZnkgdGhpcyBkb20gbm9kZVxuICovXG5mdW5jdGlvbiBnZXROYW1lZEtleShkb20pIHtcbiAgcmV0dXJuIGdldEF0dHIoZG9tLCAnaWQnKSB8fCBnZXRBdHRyKGRvbSwgJ25hbWUnKVxufVxuXG4vKipcbiAqIFNldCB0aGUgbmFtZWQgcHJvcGVydGllcyBvZiBhIHRhZyBlbGVtZW50XG4gKiBAcGFyYW0geyBPYmplY3QgfSBkb20gLSBET00gbm9kZSB3ZSBuZWVkIHRvIHBhcnNlXG4gKiBAcGFyYW0geyBPYmplY3QgfSBwYXJlbnQgLSB0YWcgaW5zdGFuY2Ugd2hlcmUgdGhlIG5hbWVkIGRvbSBlbGVtZW50IHdpbGwgYmUgZXZlbnR1YWxseSBhZGRlZFxuICogQHBhcmFtIHsgQXJyYXkgfSBrZXlzIC0gbGlzdCBvZiBhbGwgdGhlIHRhZyBpbnN0YW5jZSBwcm9wZXJ0aWVzXG4gKi9cbmZ1bmN0aW9uIHNldE5hbWVkKGRvbSwgcGFyZW50LCBrZXlzKSB7XG4gIC8vIGdldCB0aGUga2V5IHZhbHVlIHdlIHdhbnQgdG8gYWRkIHRvIHRoZSB0YWcgaW5zdGFuY2VcbiAgdmFyIGtleSA9IGdldE5hbWVkS2V5KGRvbSksXG4gICAgaXNBcnIsXG4gICAgLy8gYWRkIHRoZSBub2RlIGRldGVjdGVkIHRvIGEgdGFnIGluc3RhbmNlIHVzaW5nIHRoZSBuYW1lZCBwcm9wZXJ0eVxuICAgIGFkZCA9IGZ1bmN0aW9uKHZhbHVlKSB7XG4gICAgICAvLyBhdm9pZCB0byBvdmVycmlkZSB0aGUgdGFnIHByb3BlcnRpZXMgYWxyZWFkeSBzZXRcbiAgICAgIGlmIChjb250YWlucyhrZXlzLCBrZXkpKSByZXR1cm5cbiAgICAgIC8vIGNoZWNrIHdoZXRoZXIgdGhpcyB2YWx1ZSBpcyBhbiBhcnJheVxuICAgICAgaXNBcnIgPSBpc0FycmF5KHZhbHVlKVxuICAgICAgLy8gaWYgdGhlIGtleSB3YXMgbmV2ZXIgc2V0XG4gICAgICBpZiAoIXZhbHVlKVxuICAgICAgICAvLyBzZXQgaXQgb25jZSBvbiB0aGUgdGFnIGluc3RhbmNlXG4gICAgICAgIHBhcmVudFtrZXldID0gZG9tXG4gICAgICAvLyBpZiBpdCB3YXMgYW4gYXJyYXkgYW5kIG5vdCB5ZXQgc2V0XG4gICAgICBlbHNlIGlmICghaXNBcnIgfHwgaXNBcnIgJiYgIWNvbnRhaW5zKHZhbHVlLCBkb20pKSB7XG4gICAgICAgIC8vIGFkZCB0aGUgZG9tIG5vZGUgaW50byB0aGUgYXJyYXlcbiAgICAgICAgaWYgKGlzQXJyKVxuICAgICAgICAgIHZhbHVlLnB1c2goZG9tKVxuICAgICAgICBlbHNlXG4gICAgICAgICAgcGFyZW50W2tleV0gPSBbdmFsdWUsIGRvbV1cbiAgICAgIH1cbiAgICB9XG5cbiAgLy8gc2tpcCB0aGUgZWxlbWVudHMgd2l0aCBubyBuYW1lZCBwcm9wZXJ0aWVzXG4gIGlmICgha2V5KSByZXR1cm5cblxuICAvLyBjaGVjayB3aGV0aGVyIHRoaXMga2V5IGhhcyBiZWVuIGFscmVhZHkgZXZhbHVhdGVkXG4gIGlmICh0bXBsLmhhc0V4cHIoa2V5KSlcbiAgICAvLyB3YWl0IHRoZSBmaXJzdCB1cGRhdGVkIGV2ZW50IG9ubHkgb25jZVxuICAgIHBhcmVudC5vbmUoJ21vdW50JywgZnVuY3Rpb24oKSB7XG4gICAgICBrZXkgPSBnZXROYW1lZEtleShkb20pXG4gICAgICBhZGQocGFyZW50W2tleV0pXG4gICAgfSlcbiAgZWxzZVxuICAgIGFkZChwYXJlbnRba2V5XSlcblxufVxuXG4vKipcbiAqIEZhc3RlciBTdHJpbmcgc3RhcnRzV2l0aCBhbHRlcm5hdGl2ZVxuICogQHBhcmFtICAgeyBTdHJpbmcgfSBzcmMgLSBzb3VyY2Ugc3RyaW5nXG4gKiBAcGFyYW0gICB7IFN0cmluZyB9IHN0ciAtIHRlc3Qgc3RyaW5nXG4gKiBAcmV0dXJucyB7IEJvb2xlYW4gfSAtXG4gKi9cbmZ1bmN0aW9uIHN0YXJ0c1dpdGgoc3JjLCBzdHIpIHtcbiAgcmV0dXJuIHNyYy5zbGljZSgwLCBzdHIubGVuZ3RoKSA9PT0gc3RyXG59XG5cbi8qKlxuICogcmVxdWVzdEFuaW1hdGlvbkZyYW1lIGZ1bmN0aW9uXG4gKiBBZGFwdGVkIGZyb20gaHR0cHM6Ly9naXN0LmdpdGh1Yi5jb20vcGF1bGlyaXNoLzE1Nzk2NzEsIGxpY2Vuc2UgTUlUXG4gKi9cbnZhciByQUYgPSAoZnVuY3Rpb24gKHcpIHtcbiAgdmFyIHJhZiA9IHcucmVxdWVzdEFuaW1hdGlvbkZyYW1lICAgIHx8XG4gICAgICAgICAgICB3Lm1velJlcXVlc3RBbmltYXRpb25GcmFtZSB8fCB3LndlYmtpdFJlcXVlc3RBbmltYXRpb25GcmFtZVxuXG4gIGlmICghcmFmIHx8IC9pUChhZHxob25lfG9kKS4qT1MgNi8udGVzdCh3Lm5hdmlnYXRvci51c2VyQWdlbnQpKSB7ICAvLyBidWdneSBpT1M2XG4gICAgdmFyIGxhc3RUaW1lID0gMFxuXG4gICAgcmFmID0gZnVuY3Rpb24gKGNiKSB7XG4gICAgICB2YXIgbm93dGltZSA9IERhdGUubm93KCksIHRpbWVvdXQgPSBNYXRoLm1heCgxNiAtIChub3d0aW1lIC0gbGFzdFRpbWUpLCAwKVxuICAgICAgc2V0VGltZW91dChmdW5jdGlvbiAoKSB7IGNiKGxhc3RUaW1lID0gbm93dGltZSArIHRpbWVvdXQpIH0sIHRpbWVvdXQpXG4gICAgfVxuICB9XG4gIHJldHVybiByYWZcblxufSkod2luZG93IHx8IHt9KVxuXG4vKipcbiAqIE1vdW50IGEgdGFnIGNyZWF0aW5nIG5ldyBUYWcgaW5zdGFuY2VcbiAqIEBwYXJhbSAgIHsgT2JqZWN0IH0gcm9vdCAtIGRvbSBub2RlIHdoZXJlIHRoZSB0YWcgd2lsbCBiZSBtb3VudGVkXG4gKiBAcGFyYW0gICB7IFN0cmluZyB9IHRhZ05hbWUgLSBuYW1lIG9mIHRoZSByaW90IHRhZyB3ZSB3YW50IHRvIG1vdW50XG4gKiBAcGFyYW0gICB7IE9iamVjdCB9IG9wdHMgLSBvcHRpb25zIHRvIHBhc3MgdG8gdGhlIFRhZyBpbnN0YW5jZVxuICogQHJldHVybnMgeyBUYWcgfSBhIG5ldyBUYWcgaW5zdGFuY2VcbiAqL1xuZnVuY3Rpb24gbW91bnRUbyhyb290LCB0YWdOYW1lLCBvcHRzKSB7XG4gIHZhciB0YWcgPSBfX3RhZ0ltcGxbdGFnTmFtZV0sXG4gICAgLy8gY2FjaGUgdGhlIGlubmVyIEhUTUwgdG8gZml4ICM4NTVcbiAgICBpbm5lckhUTUwgPSByb290Ll9pbm5lckhUTUwgPSByb290Ll9pbm5lckhUTUwgfHwgcm9vdC5pbm5lckhUTUxcblxuICAvLyBjbGVhciB0aGUgaW5uZXIgaHRtbFxuICByb290LmlubmVySFRNTCA9ICcnXG5cbiAgaWYgKHRhZyAmJiByb290KSB0YWcgPSBuZXcgVGFnKHRhZywgeyByb290OiByb290LCBvcHRzOiBvcHRzIH0sIGlubmVySFRNTClcblxuICBpZiAodGFnICYmIHRhZy5tb3VudCkge1xuICAgIHRhZy5tb3VudCgpXG4gICAgLy8gYWRkIHRoaXMgdGFnIHRvIHRoZSB2aXJ0dWFsRG9tIHZhcmlhYmxlXG4gICAgaWYgKCFjb250YWlucyhfX3ZpcnR1YWxEb20sIHRhZykpIF9fdmlydHVhbERvbS5wdXNoKHRhZylcbiAgfVxuXG4gIHJldHVybiB0YWdcbn1cbi8qKlxuICogUmlvdCBwdWJsaWMgYXBpXG4gKi9cblxuLy8gc2hhcmUgbWV0aG9kcyBmb3Igb3RoZXIgcmlvdCBwYXJ0cywgZS5nLiBjb21waWxlclxucmlvdC51dGlsID0geyBicmFja2V0czogYnJhY2tldHMsIHRtcGw6IHRtcGwgfVxuXG4vKipcbiAqIENyZWF0ZSBhIG1peGluIHRoYXQgY291bGQgYmUgZ2xvYmFsbHkgc2hhcmVkIGFjcm9zcyBhbGwgdGhlIHRhZ3NcbiAqL1xucmlvdC5taXhpbiA9IChmdW5jdGlvbigpIHtcbiAgdmFyIG1peGlucyA9IHt9LFxuICAgIGdsb2JhbHMgPSBtaXhpbnNbR0xPQkFMX01JWElOXSA9IHt9LFxuICAgIF9pZCA9IDBcblxuICAvKipcbiAgICogQ3JlYXRlL1JldHVybiBhIG1peGluIGJ5IGl0cyBuYW1lXG4gICAqIEBwYXJhbSAgIHsgU3RyaW5nIH0gIG5hbWUgLSBtaXhpbiBuYW1lIChnbG9iYWwgbWl4aW4gaWYgb2JqZWN0KVxuICAgKiBAcGFyYW0gICB7IE9iamVjdCB9ICBtaXhpbiAtIG1peGluIGxvZ2ljXG4gICAqIEBwYXJhbSAgIHsgQm9vbGVhbiB9IGcgLSBpcyBnbG9iYWw/XG4gICAqIEByZXR1cm5zIHsgT2JqZWN0IH0gIHRoZSBtaXhpbiBsb2dpY1xuICAgKi9cbiAgcmV0dXJuIGZ1bmN0aW9uKG5hbWUsIG1peGluLCBnKSB7XG4gICAgLy8gVW5uYW1lZCBnbG9iYWxcbiAgICBpZiAoaXNPYmplY3QobmFtZSkpIHtcbiAgICAgIHJpb3QubWl4aW4oJ19fdW5uYW1lZF8nK19pZCsrLCBuYW1lLCB0cnVlKVxuICAgICAgcmV0dXJuXG4gICAgfVxuXG4gICAgdmFyIHN0b3JlID0gZyA/IGdsb2JhbHMgOiBtaXhpbnNcblxuICAgIC8vIEdldHRlclxuICAgIGlmICghbWl4aW4pIHtcbiAgICAgIGlmICh0eXBlb2Ygc3RvcmVbbmFtZV0gPT09IFRfVU5ERUYpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdVbnJlZ2lzdGVyZWQgbWl4aW46ICcgKyBuYW1lKVxuICAgICAgfVxuICAgICAgcmV0dXJuIHN0b3JlW25hbWVdXG4gICAgfVxuICAgIC8vIFNldHRlclxuICAgIGlmIChpc0Z1bmN0aW9uKG1peGluKSkge1xuICAgICAgZXh0ZW5kKG1peGluLnByb3RvdHlwZSwgc3RvcmVbbmFtZV0gfHwge30pXG4gICAgICBzdG9yZVtuYW1lXSA9IG1peGluXG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgc3RvcmVbbmFtZV0gPSBleHRlbmQoc3RvcmVbbmFtZV0gfHwge30sIG1peGluKVxuICAgIH1cbiAgfVxuXG59KSgpXG5cbi8qKlxuICogQ3JlYXRlIGEgbmV3IHJpb3QgdGFnIGltcGxlbWVudGF0aW9uXG4gKiBAcGFyYW0gICB7IFN0cmluZyB9ICAgbmFtZSAtIG5hbWUvaWQgb2YgdGhlIG5ldyByaW90IHRhZ1xuICogQHBhcmFtICAgeyBTdHJpbmcgfSAgIGh0bWwgLSB0YWcgdGVtcGxhdGVcbiAqIEBwYXJhbSAgIHsgU3RyaW5nIH0gICBjc3MgLSBjdXN0b20gdGFnIGNzc1xuICogQHBhcmFtICAgeyBTdHJpbmcgfSAgIGF0dHJzIC0gcm9vdCB0YWcgYXR0cmlidXRlc1xuICogQHBhcmFtICAgeyBGdW5jdGlvbiB9IGZuIC0gdXNlciBmdW5jdGlvblxuICogQHJldHVybnMgeyBTdHJpbmcgfSBuYW1lL2lkIG9mIHRoZSB0YWcganVzdCBjcmVhdGVkXG4gKi9cbnJpb3QudGFnID0gZnVuY3Rpb24obmFtZSwgaHRtbCwgY3NzLCBhdHRycywgZm4pIHtcbiAgaWYgKGlzRnVuY3Rpb24oYXR0cnMpKSB7XG4gICAgZm4gPSBhdHRyc1xuICAgIGlmICgvXltcXHdcXC1dK1xccz89Ly50ZXN0KGNzcykpIHtcbiAgICAgIGF0dHJzID0gY3NzXG4gICAgICBjc3MgPSAnJ1xuICAgIH0gZWxzZSBhdHRycyA9ICcnXG4gIH1cbiAgaWYgKGNzcykge1xuICAgIGlmIChpc0Z1bmN0aW9uKGNzcykpIGZuID0gY3NzXG4gICAgZWxzZSBzdHlsZU1hbmFnZXIuYWRkKGNzcylcbiAgfVxuICBuYW1lID0gbmFtZS50b0xvd2VyQ2FzZSgpXG4gIF9fdGFnSW1wbFtuYW1lXSA9IHsgbmFtZTogbmFtZSwgdG1wbDogaHRtbCwgYXR0cnM6IGF0dHJzLCBmbjogZm4gfVxuICByZXR1cm4gbmFtZVxufVxuXG4vKipcbiAqIENyZWF0ZSBhIG5ldyByaW90IHRhZyBpbXBsZW1lbnRhdGlvbiAoZm9yIHVzZSBieSB0aGUgY29tcGlsZXIpXG4gKiBAcGFyYW0gICB7IFN0cmluZyB9ICAgbmFtZSAtIG5hbWUvaWQgb2YgdGhlIG5ldyByaW90IHRhZ1xuICogQHBhcmFtICAgeyBTdHJpbmcgfSAgIGh0bWwgLSB0YWcgdGVtcGxhdGVcbiAqIEBwYXJhbSAgIHsgU3RyaW5nIH0gICBjc3MgLSBjdXN0b20gdGFnIGNzc1xuICogQHBhcmFtICAgeyBTdHJpbmcgfSAgIGF0dHJzIC0gcm9vdCB0YWcgYXR0cmlidXRlc1xuICogQHBhcmFtICAgeyBGdW5jdGlvbiB9IGZuIC0gdXNlciBmdW5jdGlvblxuICogQHJldHVybnMgeyBTdHJpbmcgfSBuYW1lL2lkIG9mIHRoZSB0YWcganVzdCBjcmVhdGVkXG4gKi9cbnJpb3QudGFnMiA9IGZ1bmN0aW9uKG5hbWUsIGh0bWwsIGNzcywgYXR0cnMsIGZuKSB7XG4gIGlmIChjc3MpIHN0eWxlTWFuYWdlci5hZGQoY3NzKVxuICAvL2lmIChicGFpcikgcmlvdC5zZXR0aW5ncy5icmFja2V0cyA9IGJwYWlyXG4gIF9fdGFnSW1wbFtuYW1lXSA9IHsgbmFtZTogbmFtZSwgdG1wbDogaHRtbCwgYXR0cnM6IGF0dHJzLCBmbjogZm4gfVxuICByZXR1cm4gbmFtZVxufVxuXG4vKipcbiAqIE1vdW50IGEgdGFnIHVzaW5nIGEgc3BlY2lmaWMgdGFnIGltcGxlbWVudGF0aW9uXG4gKiBAcGFyYW0gICB7IFN0cmluZyB9IHNlbGVjdG9yIC0gdGFnIERPTSBzZWxlY3RvclxuICogQHBhcmFtICAgeyBTdHJpbmcgfSB0YWdOYW1lIC0gdGFnIGltcGxlbWVudGF0aW9uIG5hbWVcbiAqIEBwYXJhbSAgIHsgT2JqZWN0IH0gb3B0cyAtIHRhZyBsb2dpY1xuICogQHJldHVybnMgeyBBcnJheSB9IG5ldyB0YWdzIGluc3RhbmNlc1xuICovXG5yaW90Lm1vdW50ID0gZnVuY3Rpb24oc2VsZWN0b3IsIHRhZ05hbWUsIG9wdHMpIHtcblxuICB2YXIgZWxzLFxuICAgIGFsbFRhZ3MsXG4gICAgdGFncyA9IFtdXG5cbiAgLy8gaGVscGVyIGZ1bmN0aW9uc1xuXG4gIGZ1bmN0aW9uIGFkZFJpb3RUYWdzKGFycikge1xuICAgIHZhciBsaXN0ID0gJydcbiAgICBlYWNoKGFyciwgZnVuY3Rpb24gKGUpIHtcbiAgICAgIGlmICghL1teLVxcd10vLnRlc3QoZSkpIHtcbiAgICAgICAgZSA9IGUudHJpbSgpLnRvTG93ZXJDYXNlKClcbiAgICAgICAgbGlzdCArPSAnLFsnICsgUklPVF9UQUdfSVMgKyAnPVwiJyArIGUgKyAnXCJdLFsnICsgUklPVF9UQUcgKyAnPVwiJyArIGUgKyAnXCJdJ1xuICAgICAgfVxuICAgIH0pXG4gICAgcmV0dXJuIGxpc3RcbiAgfVxuXG4gIGZ1bmN0aW9uIHNlbGVjdEFsbFRhZ3MoKSB7XG4gICAgdmFyIGtleXMgPSBPYmplY3Qua2V5cyhfX3RhZ0ltcGwpXG4gICAgcmV0dXJuIGtleXMgKyBhZGRSaW90VGFncyhrZXlzKVxuICB9XG5cbiAgZnVuY3Rpb24gcHVzaFRhZ3Mocm9vdCkge1xuICAgIGlmIChyb290LnRhZ05hbWUpIHtcbiAgICAgIHZhciByaW90VGFnID0gZ2V0QXR0cihyb290LCBSSU9UX1RBR19JUykgfHwgZ2V0QXR0cihyb290LCBSSU9UX1RBRylcblxuICAgICAgLy8gaGF2ZSB0YWdOYW1lPyBmb3JjZSByaW90LXRhZyB0byBiZSB0aGUgc2FtZVxuICAgICAgaWYgKHRhZ05hbWUgJiYgcmlvdFRhZyAhPT0gdGFnTmFtZSkge1xuICAgICAgICByaW90VGFnID0gdGFnTmFtZVxuICAgICAgICBzZXRBdHRyKHJvb3QsIFJJT1RfVEFHX0lTLCB0YWdOYW1lKVxuICAgICAgICBzZXRBdHRyKHJvb3QsIFJJT1RfVEFHLCB0YWdOYW1lKSAvLyB0aGlzIHdpbGwgYmUgcmVtb3ZlZCBpbiByaW90IDMuMC4wXG4gICAgICB9XG4gICAgICB2YXIgdGFnID0gbW91bnRUbyhyb290LCByaW90VGFnIHx8IHJvb3QudGFnTmFtZS50b0xvd2VyQ2FzZSgpLCBvcHRzKVxuXG4gICAgICBpZiAodGFnKSB0YWdzLnB1c2godGFnKVxuICAgIH0gZWxzZSBpZiAocm9vdC5sZW5ndGgpIHtcbiAgICAgIGVhY2gocm9vdCwgcHVzaFRhZ3MpICAgLy8gYXNzdW1lIG5vZGVMaXN0XG4gICAgfVxuICB9XG5cbiAgLy8gLS0tLS0gbW91bnQgY29kZSAtLS0tLVxuXG4gIC8vIGluamVjdCBzdHlsZXMgaW50byBET01cbiAgc3R5bGVNYW5hZ2VyLmluamVjdCgpXG5cbiAgaWYgKGlzT2JqZWN0KHRhZ05hbWUpKSB7XG4gICAgb3B0cyA9IHRhZ05hbWVcbiAgICB0YWdOYW1lID0gMFxuICB9XG5cbiAgLy8gY3Jhd2wgdGhlIERPTSB0byBmaW5kIHRoZSB0YWdcbiAgaWYgKHR5cGVvZiBzZWxlY3RvciA9PT0gVF9TVFJJTkcpIHtcbiAgICBpZiAoc2VsZWN0b3IgPT09ICcqJylcbiAgICAgIC8vIHNlbGVjdCBhbGwgdGhlIHRhZ3MgcmVnaXN0ZXJlZFxuICAgICAgLy8gYW5kIGFsc28gdGhlIHRhZ3MgZm91bmQgd2l0aCB0aGUgcmlvdC10YWcgYXR0cmlidXRlIHNldFxuICAgICAgc2VsZWN0b3IgPSBhbGxUYWdzID0gc2VsZWN0QWxsVGFncygpXG4gICAgZWxzZVxuICAgICAgLy8gb3IganVzdCB0aGUgb25lcyBuYW1lZCBsaWtlIHRoZSBzZWxlY3RvclxuICAgICAgc2VsZWN0b3IgKz0gYWRkUmlvdFRhZ3Moc2VsZWN0b3Iuc3BsaXQoLywgKi8pKVxuXG4gICAgLy8gbWFrZSBzdXJlIHRvIHBhc3MgYWx3YXlzIGEgc2VsZWN0b3JcbiAgICAvLyB0byB0aGUgcXVlcnlTZWxlY3RvckFsbCBmdW5jdGlvblxuICAgIGVscyA9IHNlbGVjdG9yID8gJCQoc2VsZWN0b3IpIDogW11cbiAgfVxuICBlbHNlXG4gICAgLy8gcHJvYmFibHkgeW91IGhhdmUgcGFzc2VkIGFscmVhZHkgYSB0YWcgb3IgYSBOb2RlTGlzdFxuICAgIGVscyA9IHNlbGVjdG9yXG5cbiAgLy8gc2VsZWN0IGFsbCB0aGUgcmVnaXN0ZXJlZCBhbmQgbW91bnQgdGhlbSBpbnNpZGUgdGhlaXIgcm9vdCBlbGVtZW50c1xuICBpZiAodGFnTmFtZSA9PT0gJyonKSB7XG4gICAgLy8gZ2V0IGFsbCBjdXN0b20gdGFnc1xuICAgIHRhZ05hbWUgPSBhbGxUYWdzIHx8IHNlbGVjdEFsbFRhZ3MoKVxuICAgIC8vIGlmIHRoZSByb290IGVscyBpdCdzIGp1c3QgYSBzaW5nbGUgdGFnXG4gICAgaWYgKGVscy50YWdOYW1lKVxuICAgICAgZWxzID0gJCQodGFnTmFtZSwgZWxzKVxuICAgIGVsc2Uge1xuICAgICAgLy8gc2VsZWN0IGFsbCB0aGUgY2hpbGRyZW4gZm9yIGFsbCB0aGUgZGlmZmVyZW50IHJvb3QgZWxlbWVudHNcbiAgICAgIHZhciBub2RlTGlzdCA9IFtdXG4gICAgICBlYWNoKGVscywgZnVuY3Rpb24gKF9lbCkge1xuICAgICAgICBub2RlTGlzdC5wdXNoKCQkKHRhZ05hbWUsIF9lbCkpXG4gICAgICB9KVxuICAgICAgZWxzID0gbm9kZUxpc3RcbiAgICB9XG4gICAgLy8gZ2V0IHJpZCBvZiB0aGUgdGFnTmFtZVxuICAgIHRhZ05hbWUgPSAwXG4gIH1cblxuICBwdXNoVGFncyhlbHMpXG5cbiAgcmV0dXJuIHRhZ3Ncbn1cblxuLyoqXG4gKiBVcGRhdGUgYWxsIHRoZSB0YWdzIGluc3RhbmNlcyBjcmVhdGVkXG4gKiBAcmV0dXJucyB7IEFycmF5IH0gYWxsIHRoZSB0YWdzIGluc3RhbmNlc1xuICovXG5yaW90LnVwZGF0ZSA9IGZ1bmN0aW9uKCkge1xuICByZXR1cm4gZWFjaChfX3ZpcnR1YWxEb20sIGZ1bmN0aW9uKHRhZykge1xuICAgIHRhZy51cGRhdGUoKVxuICB9KVxufVxuXG4vKipcbiAqIEV4cG9ydCB0aGUgVmlydHVhbCBET01cbiAqL1xucmlvdC52ZG9tID0gX192aXJ0dWFsRG9tXG5cbi8qKlxuICogRXhwb3J0IHRoZSBUYWcgY29uc3RydWN0b3JcbiAqL1xucmlvdC5UYWcgPSBUYWdcbiAgLy8gc3VwcG9ydCBDb21tb25KUywgQU1EICYgYnJvd3NlclxuICAvKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAqL1xuICBpZiAodHlwZW9mIGV4cG9ydHMgPT09IFRfT0JKRUNUKVxuICAgIG1vZHVsZS5leHBvcnRzID0gcmlvdFxuICBlbHNlIGlmICh0eXBlb2YgZGVmaW5lID09PSBUX0ZVTkNUSU9OICYmIHR5cGVvZiBkZWZpbmUuYW1kICE9PSBUX1VOREVGKVxuICAgIGRlZmluZShmdW5jdGlvbigpIHsgcmV0dXJuIHJpb3QgfSlcbiAgZWxzZVxuICAgIHdpbmRvdy5yaW90ID0gcmlvdFxuXG59KSh0eXBlb2Ygd2luZG93ICE9ICd1bmRlZmluZWQnID8gd2luZG93IDogdm9pZCAwKTtcblxuXG5cbi8qKioqKioqKioqKioqKioqKlxuICoqIFdFQlBBQ0sgRk9PVEVSXG4gKiogLi9+L3Jpb3QvcmlvdC5qc1xuICoqIG1vZHVsZSBpZCA9IDFcbiAqKiBtb2R1bGUgY2h1bmtzID0gMFxuICoqLyIsIm1vZHVsZS5leHBvcnRzID0gX193ZWJwYWNrX2FtZF9vcHRpb25zX187XHJcblxuXG5cbi8qKioqKioqKioqKioqKioqKlxuICoqIFdFQlBBQ0sgRk9PVEVSXG4gKiogKHdlYnBhY2spL2J1aWxkaW4vYW1kLW9wdGlvbnMuanNcbiAqKiBtb2R1bGUgaWQgPSAyXG4gKiogbW9kdWxlIGNodW5rcyA9IDBcbiAqKi8iLCJyZXF1aXJlKCcuL3RhZ3MvaG9tZScpO1xucmVxdWlyZSgnLi90YWdzL2NvbW1vbi9uYXZiYXInKTtcbnJlcXVpcmUoJy4vdGFncy9jb21tb24vY3JlZGl0Jyk7XG5yZXF1aXJlKCcuL3RhZ3MvY29tbW9uL3V0aWxzJyk7XG5yZXF1aXJlKCcuL3RhZ3MvbWVudS1saXN0Jyk7XG5cbnJpb3Qucm91dGUoJy8nLCAoKSA9PiB7XG5cdHJlcXVpcmUoJy4vdGFncy9uZXh0Jyk7XG5cdHJlcXVpcmUoJy4vdGFncy9jdXJmZXcnKTtcblx0cmlvdC5tb3VudCgncm91dGUnLCAnaG9tZScpO1xufSk7XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuXHRzdGFydDogZnVuY3Rpb24oKSB7XG5cdFx0cmlvdC5yb3V0ZS5zdGFydCh0cnVlKTtcblx0fVxufVxuXG5cblxuLyoqIFdFQlBBQ0sgRk9PVEVSICoqXG4gKiogLi9zcmMvc2NyaXB0cy9yb3V0ZXIuanNcbiAqKi8iLCJcbnJpb3QudGFnMignaG9tZScsICc8bmF2YmFyPjwvbmF2YmFyPiA8bmV4dD48L25leHQ+IDxidG4taWNvbiBpY29ucz1cIntbXFwnZm9ya1xcJywgXFwna25pZmVcXCddfVwiIHRleHQ9XCLku4rml6Xjga7njK7nq4tcIiBzY3JvbGxlcj1cIntzY3JvbGxlck9wdHN9XCI+PC9idG4taWNvbj4gPG1lbnUtbGlzdCB5ZWFyPVwie3llYXJ9XCIgbW9udGg9XCJ7bW9udGh9XCI+PC9tZW51LWxpc3Q+IDxkaXYgc3R5bGU9XCJoZWlnaHQ6IDMwMDBweDsgd2lkdGg6IDEwcHg7IGJhY2tncm91bmQ6ICNmZWVcIj48L2Rpdj4gPGRpdiBpZD1cInRvZGF5XCI+VGFyZ2V0PC9kaXY+IDxkaXYgc3R5bGU9XCJoZWlnaHQ6IDMwMDBweDsgd2lkdGg6IDEwcHg7IGJhY2tncm91bmQ6ICNmZWVcIj48L2Rpdj4gPGNyZWRpdD48L2NyZWRpdD4nLCAnaG9tZSAuYnRuLFtyaW90LXRhZz1cImhvbWVcIl0gLmJ0bixbZGF0YS1pcz1cImhvbWVcIl0gLmJ0bnsgZGlzcGxheTogYmxvY2s7IHdpZHRoOiA5OCU7IGhlaWdodDogNDBweDsgbWFyZ2luOiAxMHB4IGF1dG87IHBvc2l0aW9uOiByZWxhdGl2ZTsgYm9yZGVyOiAxcHggc29saWQgI2NjYzsgYm9yZGVyLXJhZGl1czogMTVweDsgYmFja2dyb3VuZC1pbWFnZTogLXdlYmtpdC1saW5lYXItZ3JhZGllbnQoI2ZkZmRmZCwgI2YxZjFmMSk7IGJhY2tncm91bmQtaW1hZ2U6IC1vLWxpbmVhci1ncmFkaWVudCgjZmRmZGZkLCAjZjFmMWYxKTsgYmFja2dyb3VuZC1pbWFnZTogbGluZWFyLWdyYWRpZW50KCNmZGZkZmQsICNmMWYxZjEpOyBib3gtc2hhZG93OiAwIDJweCAzcHggI2NjYzsgbGluZS1oZWlnaHQ6IDQwcHg7IGNvbG9yOiAjMmUzNDM2OyB0ZXh0LWRlY29yYXRpb246IG5vbmU7IHRleHQtYWxpZ246IGNlbnRlcjsgZm9udC13ZWlnaHQ6IGJvbGQ7IGZvbnQtc2l6ZTogMTAwJTsgb3V0bGluZTogbm9uZTsgY3Vyc29yOiBwb2ludGVyOyAtd2Via2l0LXRhcC1oaWdobGlnaHQtY29sb3I6IHRyYW5zcGFyZW50ICFpbXBvcnRhbnQ7IH0gaG9tZSAuYnRuOmhvdmVyLFtyaW90LXRhZz1cImhvbWVcIl0gLmJ0bjpob3ZlcixbZGF0YS1pcz1cImhvbWVcIl0gLmJ0bjpob3ZlcnsgYmFja2dyb3VuZC1pbWFnZTogLXdlYmtpdC1saW5lYXItZ3JhZGllbnQoI2Y4ZjhmOCwgI2UxZTFlMSk7IGJhY2tncm91bmQtaW1hZ2U6IC1vLWxpbmVhci1ncmFkaWVudCgjZjhmOGY4LCAjZTFlMWUxKTsgYmFja2dyb3VuZC1pbWFnZTogbGluZWFyLWdyYWRpZW50KCNmOGY4ZjgsICNlMWUxZTEpOyB9IGhvbWUgLmJ0bjphY3RpdmUsW3Jpb3QtdGFnPVwiaG9tZVwiXSAuYnRuOmFjdGl2ZSxbZGF0YS1pcz1cImhvbWVcIl0gLmJ0bjphY3RpdmV7IGJhY2tncm91bmQtaW1hZ2U6IC13ZWJraXQtbGluZWFyLWdyYWRpZW50KCNkMWQxZDEsICNkZmRmZGYpOyBiYWNrZ3JvdW5kLWltYWdlOiAtby1saW5lYXItZ3JhZGllbnQoI2QxZDFkMSwgI2RmZGZkZik7IGJhY2tncm91bmQtaW1hZ2U6IGxpbmVhci1ncmFkaWVudCgjZDFkMWQxLCAjZGZkZmRmKTsgfSBob21lIC5idG4gLmljb24sW3Jpb3QtdGFnPVwiaG9tZVwiXSAuYnRuIC5pY29uLFtkYXRhLWlzPVwiaG9tZVwiXSAuYnRuIC5pY29ueyBwb3NpdGlvbjogYWJzb2x1dGU7IHRvcDogMDsgbGVmdDogNXB4OyB3aWR0aDogNDBweDsgaGVpZ2h0OiA0MHB4OyBsaW5lLWhlaWdodDogNDBweDsgdGV4dC1hbGlnbjogY2VudGVyOyBmb250LXNpemU6IDI1cHg7IGNvbG9yOiAjOTM5MzkzOyB9IGhvbWUgLmJ0biAuaWNvbiA+IHNwYW46bnRoLWNoaWxkKDIpLFtyaW90LXRhZz1cImhvbWVcIl0gLmJ0biAuaWNvbiA+IHNwYW46bnRoLWNoaWxkKDIpLFtkYXRhLWlzPVwiaG9tZVwiXSAuYnRuIC5pY29uID4gc3BhbjpudGgtY2hpbGQoMil7IG1hcmdpbi1sZWZ0OiA1cHg7IH0nLCAnJywgZnVuY3Rpb24ob3B0cykge1xudmFyIHNlbGYgPSB0aGlzO1xuXG52YXIgZCA9IG5ldyBEYXRlKCk7XG5zZWxmLnllYXIgPSBkLmdldEZ1bGxZZWFyKCk7XG5zZWxmLm1vbnRoID0gZC5nZXRNb250aCgpICsgMTtcblxuc2VsZi5zY3JvbGxlck9wdHMgPSB7XG4gICAgdGFyZ2V0OiAndG9kYXknLFxuICAgIGR1cmF0aW9uOiAxMDAwLFxuICAgIG9mZnNldDogLTMwMFxufTtcblxub2JzLnRyaWdnZXIoJ2dldE1lbnU6cmVxJyk7XG5vYnMub24oJ2dldE1lbnU6cmVzJywgZnVuY3Rpb24gKGRhdGEpIHtcbiAgICBzZWxmLm1lbnUgPSBkYXRhO1xufSk7XG59KTtcblxuXG4vKiogV0VCUEFDSyBGT09URVIgKipcbiAqKiAuL3NyYy9zY3JpcHRzL3RhZ3MvaG9tZS50YWdcbiAqKi8iLCJcbnJpb3QudGFnMignbmF2YmFyJywgJzxoZWFkZXIgY2xhc3M9XCJuYXZiYXJcIj4gPGRpdiBjbGFzcz1cImxlZnRcIj4gPGJ1dHRvbiB0eXBlPVwiYnV0dG9uXCIgY2xhc3M9XCJuYXZiYXItYnRuLWljb25cIj48c3BhbiBjbGFzcz1cImlvbi1pb3MtY2FsZW5kYXItb3V0bGluZVwiPjwvc3Bhbj48L2J1dHRvbj4gPC9kaXY+IDxoMT7jg4fjgrjjgr/jg6vniYgg55m96bOl5a+u54yu56uL6KGoPC9oMT4gPC9oZWFkZXI+JywgJ25hdmJhciAubmF2YmFyLFtyaW90LXRhZz1cIm5hdmJhclwiXSAubmF2YmFyLFtkYXRhLWlzPVwibmF2YmFyXCJdIC5uYXZiYXJ7IHBvc2l0aW9uOiByZWxhdGl2ZTsgd2lkdGg6IDEwMCU7IGhlaWdodDogNDBweDsgYm9yZGVyLWJvdHRvbTogMXB4IHNvbGlkICNiM2IzYjM7IGJhY2tncm91bmQtaW1hZ2U6IC13ZWJraXQtbGluZWFyLWdyYWRpZW50KCNmMGYwZjAsICNkZGQpOyBiYWNrZ3JvdW5kLWltYWdlOiAtby1saW5lYXItZ3JhZGllbnQoI2YwZjBmMCwgI2RkZCk7IGJhY2tncm91bmQtaW1hZ2U6IGxpbmVhci1ncmFkaWVudCgjZjBmMGYwLCAjZGRkKTsgfSBuYXZiYXIgLm5hdmJhciBoMSxbcmlvdC10YWc9XCJuYXZiYXJcIl0gLm5hdmJhciBoMSxbZGF0YS1pcz1cIm5hdmJhclwiXSAubmF2YmFyIGgxeyBtYXJnaW46IDAgYXV0bzsgZm9udC1zaXplOiAxNnB4OyB0ZXh0LXNoYWRvdzogMXB4IDFweCAwICNmZmY7IHRleHQtYWxpZ246IGNlbnRlcjsgbGluZS1oZWlnaHQ6IDQwcHg7IGNvbG9yOiAjM2UzZTNlOyBjdXJzb3I6IGRlZmF1bHQ7IH0gbmF2YmFyIC5uYXZiYXIgLmxlZnQsW3Jpb3QtdGFnPVwibmF2YmFyXCJdIC5uYXZiYXIgLmxlZnQsW2RhdGEtaXM9XCJuYXZiYXJcIl0gLm5hdmJhciAubGVmdHsgcG9zaXRpb246IGFic29sdXRlOyBsZWZ0OiAwOyB0b3A6IDA7IH0nLCAnJywgZnVuY3Rpb24ob3B0cykge1xufSk7XG5cblxuLyoqIFdFQlBBQ0sgRk9PVEVSICoqXG4gKiogLi9zcmMvc2NyaXB0cy90YWdzL2NvbW1vbi9uYXZiYXIudGFnXG4gKiovIiwiXG5yaW90LnRhZzIoJ2NyZWRpdCcsICc8Zm9vdGVyIGNsYXNzPVwiZ2xvYmFsLWZvb3RlclwiPiA8cD7jgZPjga7jgrXjgqTjg4jjga/pnZ7lhazoqo3jgafli53miYvjgavpgYvllrbjgZfjgabjgYTjgb7jgZk8L3A+IDwvZm9vdGVyPicsICdjcmVkaXQgLmdsb2JhbC1mb290ZXIsW3Jpb3QtdGFnPVwiY3JlZGl0XCJdIC5nbG9iYWwtZm9vdGVyLFtkYXRhLWlzPVwiY3JlZGl0XCJdIC5nbG9iYWwtZm9vdGVyeyB3aWR0aDogMTAwJTsgaGVpZ2h0OiA0MHB4OyBib3JkZXItdG9wOiAxcHggc29saWQgI2IzYjNiMzsgYmFja2dyb3VuZC1pbWFnZTogLXdlYmtpdC1saW5lYXItZ3JhZGllbnQoI2RkZCwgI2YwZjBmMCk7IGJhY2tncm91bmQtaW1hZ2U6IC1vLWxpbmVhci1ncmFkaWVudCgjZGRkLCAjZjBmMGYwKTsgYmFja2dyb3VuZC1pbWFnZTogbGluZWFyLWdyYWRpZW50KCNkZGQsICNmMGYwZjApOyB9IGNyZWRpdCAuZ2xvYmFsLWZvb3RlciBwLFtyaW90LXRhZz1cImNyZWRpdFwiXSAuZ2xvYmFsLWZvb3RlciBwLFtkYXRhLWlzPVwiY3JlZGl0XCJdIC5nbG9iYWwtZm9vdGVyIHB7IHRleHQtYWxpZ246IGNlbnRlcjsgdGV4dC1zaGFkb3c6IDFweCAxcHggMCAjZmZmOyBmb250LXNpemU6IDE0cHg7IGxpbmUtaGVpZ2h0OiA0MHB4OyBjb2xvcjogIzNlM2UzZTsgY3Vyc29yOiBkZWZhdWx0OyB9JywgJycsIGZ1bmN0aW9uKG9wdHMpIHtcbn0pO1xuXG5cbi8qKiBXRUJQQUNLIEZPT1RFUiAqKlxuICoqIC4vc3JjL3NjcmlwdHMvdGFncy9jb21tb24vY3JlZGl0LnRhZ1xuICoqLyIsIlxucmlvdC50YWcyKCdidG4taWNvbicsICc8YnV0dG9uIHR5cGU9XCJidXR0b25cIiBvbmNsaWNrPVwie29uQ2xpY2t9XCIgY2xhc3M9XCJidG5cIj48c3BhbiBjbGFzcz1cImljb25cIj48c3BhbiBlYWNoPVwie2ljb24gaW4gb3B0cy5pY29uc31cIiBjbGFzcz1cImlvbi17aWNvbn1cIj48L3NwYW4+PC9zcGFuPntvcHRzLnRleHR9PC9idXR0b24+JywgJycsICcnLCBmdW5jdGlvbihvcHRzKSB7XG50aGlzLm9uQ2xpY2sgPSBmdW5jdGlvbiAoKSB7XG4gICAgLy8g44K544Og44O844K544K544Kv44Ot44O844OrXG4gICAgaWYgKG9wdHMuc2Nyb2xsZXIpIHtcbiAgICAgICAgaWYgKCFvcHRzLnNjcm9sbGVyLnRhcmdldCkgcmV0dXJuO1xuICAgICAgICB2YXIgdGFyZ2V0ID0gb3B0cy5zY3JvbGxlci50YXJnZXQ7XG4gICAgICAgIHZhciBkdXJhdGlvbiA9IG9wdHMuc2Nyb2xsZXIuZHVyYXRpb24gfHwgMjAwO1xuICAgICAgICB2YXIgb2Zmc2V0ID0gb3B0cy5zY3JvbGxlci5vZmZzZXQ7XG4gICAgICAgIHZhciBjYWxsYmFjayA9IG9wdHMuc2Nyb2xsZXIuY2FsbGJhY2s7XG4gICAgICAgIHZhciAkdGFyZ2V0ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQodGFyZ2V0KTtcbiAgICAgICAgaWYgKCEkdGFyZ2V0KSByZXR1cm47XG4gICAgICAgIHZhciBwb3MgPSAkdGFyZ2V0LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpLnRvcCArIG9mZnNldDtcbiAgICAgICAgdmFyIHBhZ2VZID0gd2luZG93LnBhZ2VZT2Zmc2V0O1xuICAgICAgICB2YXIgcGFnZVggPSB3aW5kb3cucGFnZVhPZmZzZXQ7XG4gICAgICAgIC8vIOOCouODi+ODoeODvOOCt+ODp+ODs1xuICAgICAgICB2YXIgc3RhcnQgPSBuZXcgRGF0ZSgpO1xuICAgICAgICB2YXIgc3RlcCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHZhciBwcm9ncmVzcyA9IG5ldyBEYXRlKCkgLSBzdGFydDtcbiAgICAgICAgICAgIGlmIChwcm9ncmVzcyA8IGR1cmF0aW9uKSB7XG4gICAgICAgICAgICAgICAgcmVxdWVzdEFuaW1hdGlvbkZyYW1lKHN0ZXApO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBpZiAocHJvZ3Jlc3MgIT0gZHVyYXRpb24pIHtcbiAgICAgICAgICAgICAgICAgICAgcHJvZ3Jlc3MgPSBkdXJhdGlvbjtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKHR5cGVvZiBjYWxsYmFjayA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgICAgICAgICAgICBjYWxsYmFjaygpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHdpbmRvdy5zY3JvbGxUbyhwYWdlWCwgcGFnZVkgKyBwb3MgKiAocHJvZ3Jlc3MgLyBkdXJhdGlvbikpO1xuICAgICAgICB9O1xuICAgICAgICByZXF1ZXN0QW5pbWF0aW9uRnJhbWUoc3RlcCk7XG4gICAgfVxufTtcbn0pO1xuXG5cbi8qKiBXRUJQQUNLIEZPT1RFUiAqKlxuICoqIC4vc3JjL3NjcmlwdHMvdGFncy9jb21tb24vdXRpbHMudGFnXG4gKiovIiwiXG5yaW90LnRhZzIoJ21lbnUtbGlzdCcsICcnLCAnJywgJycsIGZ1bmN0aW9uKG9wdHMpIHtcbnZhciBzZWxmID0gdGhpcztcblxuc2VsZi55ZWFyID0gb3B0cy55ZWFyO1xuc2VsZi5tb250aCA9IG9wdHMubW9udGg7XG5cbm9icy5vbignZ2V0TWVudTpyZXMnLCBmdW5jdGlvbiAoZGF0YSkge30pO1xufSk7XG5cblxuLyoqIFdFQlBBQ0sgRk9PVEVSICoqXG4gKiogLi9zcmMvc2NyaXB0cy90YWdzL21lbnUtbGlzdC50YWdcbiAqKi8iLCJcbnJpb3QudGFnMignbmV4dCcsICc8ZGl2IGNsYXNzPVwibmV4dC1tZW51XCI+IDxjdXJmZXc+PC9jdXJmZXc+IDxkaXYgY2xhc3M9XCJ0aW1lXCI+e3RpbWV9PHNwYW4gY2xhc3M9XCJzbWFsbFwiPuOBrueMruerizwvc3Bhbj48L2Rpdj4gPGRpdiBpZj1cIntsb2FkaW5nfVwiIGNsYXNzPVwibG9hZGVyXCI+PC9kaXY+IDxkaXYgaWY9XCJ7IWxvYWRpbmd9XCI+IDxvbCBpZj1cInttZW51LnN0YXRlID09IFxcJ09LXFwnfVwiIGNsYXNzPVwibWVudS1saXN0XCI+IDxsaSBpZj1cInt0aW1lSWQgIT0gM31cIiBjbGFzcz1cIm1haW5cIj57bWVudS5tYWluWzBdfTxzcGFuIGlmPVwie21lbnUubWFpblsxXX1cIj4gLyB7bWVudS5tYWluWzFdfTwvc3Bhbj48L2xpPiA8bGkgaWY9XCJ7dGltZUlkID09IDN9XCIgY2xhc3M9XCJtYWluIGRpbm5lckFcIj57bWVudS5tYWluWzBdfTwvbGk+IDxsaSBpZj1cInt0aW1lSWQgPT0gM31cIiBjbGFzcz1cIm1haW4gZGlubmVyQlwiPnttZW51Lm1haW5bMV19PC9saT4gPGxpIGVhY2g9XCJ7aXRlbSBpbiBtZW51LnNpZGVzfVwiIGNsYXNzPVwic2lkZVwiPntpdGVtfTwvbGk+IDwvb2w+IDxkaXYgaWY9XCJ7bWVudS5zdGF0ZSA9PSBcXCdldmVudFxcJ31cIiBjbGFzcz1cImV2ZW50XCI+IDxwIGNsYXNzPVwidGl0bGVcIj57bWVudS5tYWluWzBdfTwvcD4gPHAgaWY9XCJ7bWVudS5tYWluWzFdfVwiIGNsYXNzPVwidGV4dFwiPnttZW51Lm1haW5bMV19PC9wPiA8L2Rpdj4gPGRpdiBpZj1cInttZW51LnN0YXRlID09IFxcJ25vdGZvdW5kXFwnIHx8ICFtZW51LnN0YXRlfVwiIGNsYXNzPVwibm90Zm91bmRcIj48aSBjbGFzcz1cImlvbi1jb2ZmZWUgaWNvblwiPjwvaT4gPHAgY2xhc3M9XCJ0ZXh0XCI+54yu56uL44KS5Y+W5b6X44Gn44GN44G+44Gb44KT44Gn44GX44GfPC9wPiA8L2Rpdj4gPC9kaXY+IDwvZGl2PicsICduZXh0IC5uZXh0LW1lbnUsW3Jpb3QtdGFnPVwibmV4dFwiXSAubmV4dC1tZW51LFtkYXRhLWlzPVwibmV4dFwiXSAubmV4dC1tZW51eyBwb3NpdGlvbjogcmVsYXRpdmU7IG1hcmdpbjogMTBweCAzcHggMjBweDsgYm9yZGVyOiAxcHggc29saWQgI2FhYTsgYmFja2dyb3VuZDogI2ZmZjsgYm94LXNoYWRvdzogMCA2cHggM3B4IC00cHggI2JiYjsgYm94LXNpemluZzogYm9yZGVyLWJveDsgdGV4dC1hbGlnbjogY2VudGVyOyB9IG5leHQgLm5leHQtbWVudSAudGltZSxbcmlvdC10YWc9XCJuZXh0XCJdIC5uZXh0LW1lbnUgLnRpbWUsW2RhdGEtaXM9XCJuZXh0XCJdIC5uZXh0LW1lbnUgLnRpbWV7IHBhZGRpbmc6IDhweCAwOyBib3JkZXItYm90dG9tOiAxcHggc29saWQgI2NjYzsgYmFja2dyb3VuZDogI2RkZDsgY29sb3I6ICMyNTI1MjE7IH0gbmV4dCAubmV4dC1tZW51IC50aW1lIC5zbWFsbCxbcmlvdC10YWc9XCJuZXh0XCJdIC5uZXh0LW1lbnUgLnRpbWUgLnNtYWxsLFtkYXRhLWlzPVwibmV4dFwiXSAubmV4dC1tZW51IC50aW1lIC5zbWFsbHsgbWFyZ2luLWxlZnQ6IDVweDsgZm9udC1zaXplOiAxNnB4OyBjb2xvcjogIzQ1NDU0NTsgfSBuZXh0IC5uZXh0LW1lbnUgLm1lbnUtbGlzdCxbcmlvdC10YWc9XCJuZXh0XCJdIC5uZXh0LW1lbnUgLm1lbnUtbGlzdCxbZGF0YS1pcz1cIm5leHRcIl0gLm5leHQtbWVudSAubWVudS1saXN0eyBtYXJnaW46IDIwcHggMTJweDsgfSBuZXh0IC5uZXh0LW1lbnUgLm1lbnUtbGlzdCAubWFpbixbcmlvdC10YWc9XCJuZXh0XCJdIC5uZXh0LW1lbnUgLm1lbnUtbGlzdCAubWFpbixbZGF0YS1pcz1cIm5leHRcIl0gLm5leHQtbWVudSAubWVudS1saXN0IC5tYWlueyBtYXJnaW4tYm90dG9tOiA1cHg7IGZvbnQtc2l6ZTogMjJweDsgfSBuZXh0IC5uZXh0LW1lbnUgLm1lbnUtbGlzdCAubWFpbi5kaW5uZXJBOjpiZWZvcmUsW3Jpb3QtdGFnPVwibmV4dFwiXSAubmV4dC1tZW51IC5tZW51LWxpc3QgLm1haW4uZGlubmVyQTo6YmVmb3JlLFtkYXRhLWlzPVwibmV4dFwiXSAubmV4dC1tZW51IC5tZW51LWxpc3QgLm1haW4uZGlubmVyQTo6YmVmb3JlLG5leHQgLm5leHQtbWVudSAubWVudS1saXN0IC5tYWluLmRpbm5lckI6OmJlZm9yZSxbcmlvdC10YWc9XCJuZXh0XCJdIC5uZXh0LW1lbnUgLm1lbnUtbGlzdCAubWFpbi5kaW5uZXJCOjpiZWZvcmUsW2RhdGEtaXM9XCJuZXh0XCJdIC5uZXh0LW1lbnUgLm1lbnUtbGlzdCAubWFpbi5kaW5uZXJCOjpiZWZvcmV7IHBvc2l0aW9uOiByZWxhdGl2ZTsgdG9wOiAtMnB4OyBkaXNwbGF5OiBpbmxpbmUtYmxvY2s7IHdpZHRoOiAyMHB4OyBoZWlnaHQ6IDIwcHg7IG1hcmdpbi1yaWdodDogNXB4OyBiYWNrZ3JvdW5kOiAjMjIyOyBsaW5lLWhlaWdodDogMjBweDsgdGV4dC1hbGlnbjogY2VudGVyOyBmb250LXNpemU6IDE0cHg7IGNvbG9yOiAjZTllOWU5OyB9IG5leHQgLm5leHQtbWVudSAubWVudS1saXN0IC5tYWluLmRpbm5lckE6OmJlZm9yZSxbcmlvdC10YWc9XCJuZXh0XCJdIC5uZXh0LW1lbnUgLm1lbnUtbGlzdCAubWFpbi5kaW5uZXJBOjpiZWZvcmUsW2RhdGEtaXM9XCJuZXh0XCJdIC5uZXh0LW1lbnUgLm1lbnUtbGlzdCAubWFpbi5kaW5uZXJBOjpiZWZvcmV7IGNvbnRlbnQ6IFwiQVwiOyB9IG5leHQgLm5leHQtbWVudSAubWVudS1saXN0IC5tYWluLmRpbm5lckI6OmJlZm9yZSxbcmlvdC10YWc9XCJuZXh0XCJdIC5uZXh0LW1lbnUgLm1lbnUtbGlzdCAubWFpbi5kaW5uZXJCOjpiZWZvcmUsW2RhdGEtaXM9XCJuZXh0XCJdIC5uZXh0LW1lbnUgLm1lbnUtbGlzdCAubWFpbi5kaW5uZXJCOjpiZWZvcmV7IGNvbnRlbnQ6IFwiQlwiOyB9IG5leHQgLm5leHQtbWVudSAubWVudS1saXN0IC5zaWRlLFtyaW90LXRhZz1cIm5leHRcIl0gLm5leHQtbWVudSAubWVudS1saXN0IC5zaWRlLFtkYXRhLWlzPVwibmV4dFwiXSAubmV4dC1tZW51IC5tZW51LWxpc3QgLnNpZGV7IG1hcmdpbi10b3A6IDhweDsgZm9udC1zaXplOiAxNnB4OyBjb2xvcjogIzQ0NDsgfSBuZXh0IC5uZXh0LW1lbnUgLmV2ZW50IC50aXRsZSxbcmlvdC10YWc9XCJuZXh0XCJdIC5uZXh0LW1lbnUgLmV2ZW50IC50aXRsZSxbZGF0YS1pcz1cIm5leHRcIl0gLm5leHQtbWVudSAuZXZlbnQgLnRpdGxleyBtYXJnaW46IDI1cHggMCAzMHB4OyBmb250LXNpemU6IDUwcHg7IGNvbG9yOiAjMjIyOyB9IG5leHQgLm5leHQtbWVudSAuZXZlbnQgLnRleHQsW3Jpb3QtdGFnPVwibmV4dFwiXSAubmV4dC1tZW51IC5ldmVudCAudGV4dCxbZGF0YS1pcz1cIm5leHRcIl0gLm5leHQtbWVudSAuZXZlbnQgLnRleHR7IG1hcmdpbi1ib3R0b206IDIwcHg7IGZvbnQtc2l6ZTogMTRweDsgbGV0dGVyLXNwYWNpbmc6IDAuMThlbTsgY29sb3I6ICM1NTU7IH0gbmV4dCAubmV4dC1tZW51IC5ub3Rmb3VuZCAuaWNvbixbcmlvdC10YWc9XCJuZXh0XCJdIC5uZXh0LW1lbnUgLm5vdGZvdW5kIC5pY29uLFtkYXRhLWlzPVwibmV4dFwiXSAubmV4dC1tZW51IC5ub3Rmb3VuZCAuaWNvbnsgZGlzcGxheTogYmxvY2s7IG1hcmdpbjogMjVweCAwIDMwcHg7IGZvbnQtc2l6ZTogNTBweDsgY29sb3I6ICM5OTk7IH0gbmV4dCAubmV4dC1tZW51IC5ub3Rmb3VuZCAudGV4dCxbcmlvdC10YWc9XCJuZXh0XCJdIC5uZXh0LW1lbnUgLm5vdGZvdW5kIC50ZXh0LFtkYXRhLWlzPVwibmV4dFwiXSAubmV4dC1tZW51IC5ub3Rmb3VuZCAudGV4dHsgbWFyZ2luLWJvdHRvbTogMjBweDsgZm9udC1zaXplOiAxM3B4OyBsZXR0ZXItc3BhY2luZzogMC4xOGVtOyBjb2xvcjogIzU1NTsgdGV4dC1zaGFkb3c6IDFweCAxcHggI2JiYjsgfScsICcnLCBmdW5jdGlvbihvcHRzKSB7XG52YXIgc2VsZiA9IHRoaXM7XG5cbnZhciBkID0gbmV3IERhdGUoKTtcbnZhciBob3VycyA9IGQuZ2V0SG91cnMoKTtcbnZhciBtaW51dGVzID0gZC5nZXRNaW51dGVzKCk7XG52YXIgZGF0ZSA9IGQuZ2V0RGF0ZSgpO1xuXG52YXIgZ2V0VG9kYXkgPSBmdW5jdGlvbiAoZGF0YSkge1xuICAgIGZvciAodmFyIGkgPSAwLCBsZW4gPSBkYXRhLmxlbmd0aDsgaSA8IGxlbjsgaSsrKSB7XG4gICAgICAgIHZhciBpdGVtID0gZGF0YVtpXTtcbiAgICAgICAgaWYgKGl0ZW0uZGF0ZSAlIDEwMCA9PT0gZGF0ZSkge1xuICAgICAgICAgICAgcmV0dXJuIGl0ZW07XG4gICAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuICdub3Rmb3VuZCc7XG59O1xuXG52YXIgZ2V0SXRlbSA9IGZ1bmN0aW9uIChkYXRhLCB0aW1lSWQpIHtcbiAgICB2YXIgdG9kYXkgPSBnZXRUb2RheShkYXRhKTtcbiAgICBpZiAodG9kYXkgPT09ICdub3Rmb3VuZCcpIHtcbiAgICAgICAgcmV0dXJuIHRvZGF5O1xuICAgIH0gZWxzZSB7XG4gICAgICAgIHN3aXRjaCAodGltZUlkKSB7XG4gICAgICAgICAgICAvLyDmnJ3jga7njK7nq4vjgpLov5TljbRcbiAgICAgICAgICAgIGNhc2UgMTpcbiAgICAgICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgICAgICBzdGF0ZTogJ09LJyxcbiAgICAgICAgICAgICAgICAgICAgbWFpbjogdG9kYXkubV9tYWluLnNwbGl0KCcsJyksXG4gICAgICAgICAgICAgICAgICAgIHNpZGVzOiB0b2RheS5tX3NpZGUuc3BsaXQoJywnKVxuICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAvLyDmmLzjga7njK7nq4vjgpLov5TljbRcbiAgICAgICAgICAgIGNhc2UgMjpcbiAgICAgICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgICAgICBzdGF0ZTogJ09LJyxcbiAgICAgICAgICAgICAgICAgICAgbWFpbjogdG9kYXkubF9tYWluLnNwbGl0KCcsJyksXG4gICAgICAgICAgICAgICAgICAgIHNpZGVzOiB0b2RheS5sX3NpZGUuc3BsaXQoJywnKVxuICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAvLyDlpJzjga7njK7nq4vjgpLov5TljbRcbiAgICAgICAgICAgIGNhc2UgMzpcbiAgICAgICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgICAgICBzdGF0ZTogJ09LJyxcbiAgICAgICAgICAgICAgICAgICAgbWFpbjogdG9kYXkuZF9tYWluLnNwbGl0KCcsJyksXG4gICAgICAgICAgICAgICAgICAgIHNpZGVzOiB0b2RheS5sX3NpZGUuc3BsaXQoJywnKVxuICAgICAgICAgICAgICAgIH07XG4gICAgICAgIH1cbiAgICB9XG59O1xuXG52YXIgZ2V0VGltZSA9IGZ1bmN0aW9uIChkYXRhKSB7XG4gICAgaWYgKGhvdXJzIDwgOCB8fCBob3VycyA9PSA4ICYmIG1pbnV0ZXMgPD0gMzApIHtcbiAgICAgICAgcmV0dXJuIHsgaWQ6IDEsIGxhYmVsOiAn5pydJyB9O1xuICAgIH0gZWxzZSBpZiAoaG91cnMgPCAxMiB8fCBob3VycyA9PSAxMiAmJiBtaW51dGVzIDw9IDUwKSB7XG4gICAgICAgIHJldHVybiB7IGlkOiAyLCBsYWJlbDogJ+aYvCcgfTtcbiAgICB9IGVsc2UgaWYgKGhvdXJzIDwgMTkgfHwgaG91cnMgPT0gMTkgJiYgbWludXRlcyA8PSA0MCkge1xuICAgICAgICByZXR1cm4geyBpZDogMywgbGFiZWw6ICflpJwnIH07XG4gICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIHsgaWQ6IDQsIGxhYmVsOiAn5piO5pelIOacnScgfTtcbiAgICB9XG59O1xuXG52YXIgdGltZSA9IGdldFRpbWUoKTtcbnNlbGYudGltZSA9IHRpbWUubGFiZWw7XG5zZWxmLnRpbWVJZCA9IHRpbWUuaWQ7XG5cbnNlbGYubG9hZGluZyA9IHRydWU7XG5cbm9icy5vbignZ2V0TWVudTpyZXMnLCBmdW5jdGlvbiAoZGF0YSkge1xuICAgIGlmIChkYXRhLnN0YXR1cyA9PT0gJ25vdGZvdW5kJykge1xuICAgICAgICBzZWxmLm1lbnUgPSB7XG4gICAgICAgICAgICBzdGF0ZTogJ25vdGZvdW5kJ1xuICAgICAgICB9O1xuICAgIH0gZWxzZSB7XG4gICAgICAgIHNlbGYubWVudSA9IGdldEl0ZW0oZGF0YSwgdGltZS5pZCk7XG4gICAgfVxuICAgIHNlbGYubG9hZGluZyA9IGZhbHNlO1xuICAgIHJpb3QudXBkYXRlKCk7XG59KTtcbn0pO1xuXG5cbi8qKiBXRUJQQUNLIEZPT1RFUiAqKlxuICoqIC4vc3JjL3NjcmlwdHMvdGFncy9uZXh0LnRhZ1xuICoqLyIsIlwidXNlIHN0cmljdFwiXG5cbmNvbnN0IHJlcXVlc3QgPSByZXF1aXJlKCdzdXBlcmFnZW50Jyk7XG5jb25zdCBkID0gbmV3IERhdGU7XG5jb25zdCBub3cgPSB7XG5cdHllYXI6IGQuZ2V0RnVsbFllYXIoKSxcblx0bW9udGg6IGQuZ2V0TW9udGgoKSArIDFcbn1cblxubW9kdWxlLmV4cG9ydHMgPSB7XG5cdGdldDogZnVuY3Rpb24oeWVhciwgbW9udGgpIHtcblx0XHR5ZWFyID0geWVhciB8fCBub3cueWVhcjtcblx0XHRtb250aCA9IG1vbnRoIHx8IG5vdy5tb250aDtcblx0XHRyZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuXHRcdFx0cmVxdWVzdFxuXHRcdFx0XHQuZ2V0KGBodHRwOi8vMTYzLjQ0LjE3NS4xMTQ6NDMwMS8ke3llYXJ9LyR7bW9udGh9YClcblx0XHRcdFx0LmVuZCgoZXJyLCByZXMpID0+IHtcblx0XHRcdFx0XHRpZihlcnIpIHtcblx0XHRcdFx0XHRcdHJlamVjdChlcnIpO1xuXHRcdFx0XHRcdFx0cmV0dXJuXG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdHJlc29sdmUocmVzLmJvZHkpO1xuXHRcdFx0XHR9KTtcblx0XHR9KTtcblx0fSxcblx0c2VhcmNoOiBmdW5jdGlvbih3b3JkLCB5ZWFyLCBtb250aCkge1xuXHRcdHllYXIgPSB5ZWFyIHx8IG5vdy55ZWFyO1xuXHRcdG1vbnRoID0gbW9udGggfHwgbm93Lm1vbnRoO1xuXHRcdHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG5cdFx0XHRyZXF1ZXN0XG5cdFx0XHRcdC5nZXQoYGh0dHA6Ly8xNjMuNDQuMTc1LjExNDo0MzAxLyR7eWVhcn0vJHttb250aH0vJHt3b3JkfWApXG5cdFx0XHRcdC5lbmQoKGVyciwgcmVzKSA9PiB7XG5cdFx0XHRcdFx0aWYoZXJyKSB7XG5cdFx0XHRcdFx0XHRyZWplY3QoZXJyKTtcblx0XHRcdFx0XHRcdHJldHVybjtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0cmVzb2x2ZShyZXMuYm9keSk7XG5cdFx0XHRcdH0pO1xuXHRcdH0pO1xuXHR9XG59XG5cblxuLyoqIFdFQlBBQ0sgRk9PVEVSICoqXG4gKiogLi9zcmMvc2NyaXB0cy9hcGkuanNcbiAqKi8iLCIvKipcbiAqIFJvb3QgcmVmZXJlbmNlIGZvciBpZnJhbWVzLlxuICovXG5cbnZhciByb290O1xuaWYgKHR5cGVvZiB3aW5kb3cgIT09ICd1bmRlZmluZWQnKSB7IC8vIEJyb3dzZXIgd2luZG93XG4gIHJvb3QgPSB3aW5kb3c7XG59IGVsc2UgaWYgKHR5cGVvZiBzZWxmICE9PSAndW5kZWZpbmVkJykgeyAvLyBXZWIgV29ya2VyXG4gIHJvb3QgPSBzZWxmO1xufSBlbHNlIHsgLy8gT3RoZXIgZW52aXJvbm1lbnRzXG4gIGNvbnNvbGUud2FybihcIlVzaW5nIGJyb3dzZXItb25seSB2ZXJzaW9uIG9mIHN1cGVyYWdlbnQgaW4gbm9uLWJyb3dzZXIgZW52aXJvbm1lbnRcIik7XG4gIHJvb3QgPSB0aGlzO1xufVxuXG52YXIgRW1pdHRlciA9IHJlcXVpcmUoJ2VtaXR0ZXInKTtcbnZhciByZXF1ZXN0QmFzZSA9IHJlcXVpcmUoJy4vcmVxdWVzdC1iYXNlJyk7XG52YXIgaXNPYmplY3QgPSByZXF1aXJlKCcuL2lzLW9iamVjdCcpO1xuXG4vKipcbiAqIE5vb3AuXG4gKi9cblxuZnVuY3Rpb24gbm9vcCgpe307XG5cbi8qKlxuICogRXhwb3NlIGByZXF1ZXN0YC5cbiAqL1xuXG52YXIgcmVxdWVzdCA9IG1vZHVsZS5leHBvcnRzID0gcmVxdWlyZSgnLi9yZXF1ZXN0JykuYmluZChudWxsLCBSZXF1ZXN0KTtcblxuLyoqXG4gKiBEZXRlcm1pbmUgWEhSLlxuICovXG5cbnJlcXVlc3QuZ2V0WEhSID0gZnVuY3Rpb24gKCkge1xuICBpZiAocm9vdC5YTUxIdHRwUmVxdWVzdFxuICAgICAgJiYgKCFyb290LmxvY2F0aW9uIHx8ICdmaWxlOicgIT0gcm9vdC5sb2NhdGlvbi5wcm90b2NvbFxuICAgICAgICAgIHx8ICFyb290LkFjdGl2ZVhPYmplY3QpKSB7XG4gICAgcmV0dXJuIG5ldyBYTUxIdHRwUmVxdWVzdDtcbiAgfSBlbHNlIHtcbiAgICB0cnkgeyByZXR1cm4gbmV3IEFjdGl2ZVhPYmplY3QoJ01pY3Jvc29mdC5YTUxIVFRQJyk7IH0gY2F0Y2goZSkge31cbiAgICB0cnkgeyByZXR1cm4gbmV3IEFjdGl2ZVhPYmplY3QoJ01zeG1sMi5YTUxIVFRQLjYuMCcpOyB9IGNhdGNoKGUpIHt9XG4gICAgdHJ5IHsgcmV0dXJuIG5ldyBBY3RpdmVYT2JqZWN0KCdNc3htbDIuWE1MSFRUUC4zLjAnKTsgfSBjYXRjaChlKSB7fVxuICAgIHRyeSB7IHJldHVybiBuZXcgQWN0aXZlWE9iamVjdCgnTXN4bWwyLlhNTEhUVFAnKTsgfSBjYXRjaChlKSB7fVxuICB9XG4gIHRocm93IEVycm9yKFwiQnJvd3Nlci1vbmx5IHZlcmlzb24gb2Ygc3VwZXJhZ2VudCBjb3VsZCBub3QgZmluZCBYSFJcIik7XG59O1xuXG4vKipcbiAqIFJlbW92ZXMgbGVhZGluZyBhbmQgdHJhaWxpbmcgd2hpdGVzcGFjZSwgYWRkZWQgdG8gc3VwcG9ydCBJRS5cbiAqXG4gKiBAcGFyYW0ge1N0cmluZ30gc1xuICogQHJldHVybiB7U3RyaW5nfVxuICogQGFwaSBwcml2YXRlXG4gKi9cblxudmFyIHRyaW0gPSAnJy50cmltXG4gID8gZnVuY3Rpb24ocykgeyByZXR1cm4gcy50cmltKCk7IH1cbiAgOiBmdW5jdGlvbihzKSB7IHJldHVybiBzLnJlcGxhY2UoLyheXFxzKnxcXHMqJCkvZywgJycpOyB9O1xuXG4vKipcbiAqIFNlcmlhbGl6ZSB0aGUgZ2l2ZW4gYG9iamAuXG4gKlxuICogQHBhcmFtIHtPYmplY3R9IG9ialxuICogQHJldHVybiB7U3RyaW5nfVxuICogQGFwaSBwcml2YXRlXG4gKi9cblxuZnVuY3Rpb24gc2VyaWFsaXplKG9iaikge1xuICBpZiAoIWlzT2JqZWN0KG9iaikpIHJldHVybiBvYmo7XG4gIHZhciBwYWlycyA9IFtdO1xuICBmb3IgKHZhciBrZXkgaW4gb2JqKSB7XG4gICAgcHVzaEVuY29kZWRLZXlWYWx1ZVBhaXIocGFpcnMsIGtleSwgb2JqW2tleV0pO1xuICB9XG4gIHJldHVybiBwYWlycy5qb2luKCcmJyk7XG59XG5cbi8qKlxuICogSGVscHMgJ3NlcmlhbGl6ZScgd2l0aCBzZXJpYWxpemluZyBhcnJheXMuXG4gKiBNdXRhdGVzIHRoZSBwYWlycyBhcnJheS5cbiAqXG4gKiBAcGFyYW0ge0FycmF5fSBwYWlyc1xuICogQHBhcmFtIHtTdHJpbmd9IGtleVxuICogQHBhcmFtIHtNaXhlZH0gdmFsXG4gKi9cblxuZnVuY3Rpb24gcHVzaEVuY29kZWRLZXlWYWx1ZVBhaXIocGFpcnMsIGtleSwgdmFsKSB7XG4gIGlmICh2YWwgIT0gbnVsbCkge1xuICAgIGlmIChBcnJheS5pc0FycmF5KHZhbCkpIHtcbiAgICAgIHZhbC5mb3JFYWNoKGZ1bmN0aW9uKHYpIHtcbiAgICAgICAgcHVzaEVuY29kZWRLZXlWYWx1ZVBhaXIocGFpcnMsIGtleSwgdik7XG4gICAgICB9KTtcbiAgICB9IGVsc2UgaWYgKGlzT2JqZWN0KHZhbCkpIHtcbiAgICAgIGZvcih2YXIgc3Via2V5IGluIHZhbCkge1xuICAgICAgICBwdXNoRW5jb2RlZEtleVZhbHVlUGFpcihwYWlycywga2V5ICsgJ1snICsgc3Via2V5ICsgJ10nLCB2YWxbc3Via2V5XSk7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIHBhaXJzLnB1c2goZW5jb2RlVVJJQ29tcG9uZW50KGtleSlcbiAgICAgICAgKyAnPScgKyBlbmNvZGVVUklDb21wb25lbnQodmFsKSk7XG4gICAgfVxuICB9IGVsc2UgaWYgKHZhbCA9PT0gbnVsbCkge1xuICAgIHBhaXJzLnB1c2goZW5jb2RlVVJJQ29tcG9uZW50KGtleSkpO1xuICB9XG59XG5cbi8qKlxuICogRXhwb3NlIHNlcmlhbGl6YXRpb24gbWV0aG9kLlxuICovXG5cbiByZXF1ZXN0LnNlcmlhbGl6ZU9iamVjdCA9IHNlcmlhbGl6ZTtcblxuIC8qKlxuICAqIFBhcnNlIHRoZSBnaXZlbiB4LXd3dy1mb3JtLXVybGVuY29kZWQgYHN0cmAuXG4gICpcbiAgKiBAcGFyYW0ge1N0cmluZ30gc3RyXG4gICogQHJldHVybiB7T2JqZWN0fVxuICAqIEBhcGkgcHJpdmF0ZVxuICAqL1xuXG5mdW5jdGlvbiBwYXJzZVN0cmluZyhzdHIpIHtcbiAgdmFyIG9iaiA9IHt9O1xuICB2YXIgcGFpcnMgPSBzdHIuc3BsaXQoJyYnKTtcbiAgdmFyIHBhaXI7XG4gIHZhciBwb3M7XG5cbiAgZm9yICh2YXIgaSA9IDAsIGxlbiA9IHBhaXJzLmxlbmd0aDsgaSA8IGxlbjsgKytpKSB7XG4gICAgcGFpciA9IHBhaXJzW2ldO1xuICAgIHBvcyA9IHBhaXIuaW5kZXhPZignPScpO1xuICAgIGlmIChwb3MgPT0gLTEpIHtcbiAgICAgIG9ialtkZWNvZGVVUklDb21wb25lbnQocGFpcildID0gJyc7XG4gICAgfSBlbHNlIHtcbiAgICAgIG9ialtkZWNvZGVVUklDb21wb25lbnQocGFpci5zbGljZSgwLCBwb3MpKV0gPVxuICAgICAgICBkZWNvZGVVUklDb21wb25lbnQocGFpci5zbGljZShwb3MgKyAxKSk7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIG9iajtcbn1cblxuLyoqXG4gKiBFeHBvc2UgcGFyc2VyLlxuICovXG5cbnJlcXVlc3QucGFyc2VTdHJpbmcgPSBwYXJzZVN0cmluZztcblxuLyoqXG4gKiBEZWZhdWx0IE1JTUUgdHlwZSBtYXAuXG4gKlxuICogICAgIHN1cGVyYWdlbnQudHlwZXMueG1sID0gJ2FwcGxpY2F0aW9uL3htbCc7XG4gKlxuICovXG5cbnJlcXVlc3QudHlwZXMgPSB7XG4gIGh0bWw6ICd0ZXh0L2h0bWwnLFxuICBqc29uOiAnYXBwbGljYXRpb24vanNvbicsXG4gIHhtbDogJ2FwcGxpY2F0aW9uL3htbCcsXG4gIHVybGVuY29kZWQ6ICdhcHBsaWNhdGlvbi94LXd3dy1mb3JtLXVybGVuY29kZWQnLFxuICAnZm9ybSc6ICdhcHBsaWNhdGlvbi94LXd3dy1mb3JtLXVybGVuY29kZWQnLFxuICAnZm9ybS1kYXRhJzogJ2FwcGxpY2F0aW9uL3gtd3d3LWZvcm0tdXJsZW5jb2RlZCdcbn07XG5cbi8qKlxuICogRGVmYXVsdCBzZXJpYWxpemF0aW9uIG1hcC5cbiAqXG4gKiAgICAgc3VwZXJhZ2VudC5zZXJpYWxpemVbJ2FwcGxpY2F0aW9uL3htbCddID0gZnVuY3Rpb24ob2JqKXtcbiAqICAgICAgIHJldHVybiAnZ2VuZXJhdGVkIHhtbCBoZXJlJztcbiAqICAgICB9O1xuICpcbiAqL1xuXG4gcmVxdWVzdC5zZXJpYWxpemUgPSB7XG4gICAnYXBwbGljYXRpb24veC13d3ctZm9ybS11cmxlbmNvZGVkJzogc2VyaWFsaXplLFxuICAgJ2FwcGxpY2F0aW9uL2pzb24nOiBKU09OLnN0cmluZ2lmeVxuIH07XG5cbiAvKipcbiAgKiBEZWZhdWx0IHBhcnNlcnMuXG4gICpcbiAgKiAgICAgc3VwZXJhZ2VudC5wYXJzZVsnYXBwbGljYXRpb24veG1sJ10gPSBmdW5jdGlvbihzdHIpe1xuICAqICAgICAgIHJldHVybiB7IG9iamVjdCBwYXJzZWQgZnJvbSBzdHIgfTtcbiAgKiAgICAgfTtcbiAgKlxuICAqL1xuXG5yZXF1ZXN0LnBhcnNlID0ge1xuICAnYXBwbGljYXRpb24veC13d3ctZm9ybS11cmxlbmNvZGVkJzogcGFyc2VTdHJpbmcsXG4gICdhcHBsaWNhdGlvbi9qc29uJzogSlNPTi5wYXJzZVxufTtcblxuLyoqXG4gKiBQYXJzZSB0aGUgZ2l2ZW4gaGVhZGVyIGBzdHJgIGludG9cbiAqIGFuIG9iamVjdCBjb250YWluaW5nIHRoZSBtYXBwZWQgZmllbGRzLlxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfSBzdHJcbiAqIEByZXR1cm4ge09iamVjdH1cbiAqIEBhcGkgcHJpdmF0ZVxuICovXG5cbmZ1bmN0aW9uIHBhcnNlSGVhZGVyKHN0cikge1xuICB2YXIgbGluZXMgPSBzdHIuc3BsaXQoL1xccj9cXG4vKTtcbiAgdmFyIGZpZWxkcyA9IHt9O1xuICB2YXIgaW5kZXg7XG4gIHZhciBsaW5lO1xuICB2YXIgZmllbGQ7XG4gIHZhciB2YWw7XG5cbiAgbGluZXMucG9wKCk7IC8vIHRyYWlsaW5nIENSTEZcblxuICBmb3IgKHZhciBpID0gMCwgbGVuID0gbGluZXMubGVuZ3RoOyBpIDwgbGVuOyArK2kpIHtcbiAgICBsaW5lID0gbGluZXNbaV07XG4gICAgaW5kZXggPSBsaW5lLmluZGV4T2YoJzonKTtcbiAgICBmaWVsZCA9IGxpbmUuc2xpY2UoMCwgaW5kZXgpLnRvTG93ZXJDYXNlKCk7XG4gICAgdmFsID0gdHJpbShsaW5lLnNsaWNlKGluZGV4ICsgMSkpO1xuICAgIGZpZWxkc1tmaWVsZF0gPSB2YWw7XG4gIH1cblxuICByZXR1cm4gZmllbGRzO1xufVxuXG4vKipcbiAqIENoZWNrIGlmIGBtaW1lYCBpcyBqc29uIG9yIGhhcyAranNvbiBzdHJ1Y3R1cmVkIHN5bnRheCBzdWZmaXguXG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IG1pbWVcbiAqIEByZXR1cm4ge0Jvb2xlYW59XG4gKiBAYXBpIHByaXZhdGVcbiAqL1xuXG5mdW5jdGlvbiBpc0pTT04obWltZSkge1xuICByZXR1cm4gL1tcXC8rXWpzb25cXGIvLnRlc3QobWltZSk7XG59XG5cbi8qKlxuICogUmV0dXJuIHRoZSBtaW1lIHR5cGUgZm9yIHRoZSBnaXZlbiBgc3RyYC5cbiAqXG4gKiBAcGFyYW0ge1N0cmluZ30gc3RyXG4gKiBAcmV0dXJuIHtTdHJpbmd9XG4gKiBAYXBpIHByaXZhdGVcbiAqL1xuXG5mdW5jdGlvbiB0eXBlKHN0cil7XG4gIHJldHVybiBzdHIuc3BsaXQoLyAqOyAqLykuc2hpZnQoKTtcbn07XG5cbi8qKlxuICogUmV0dXJuIGhlYWRlciBmaWVsZCBwYXJhbWV0ZXJzLlxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfSBzdHJcbiAqIEByZXR1cm4ge09iamVjdH1cbiAqIEBhcGkgcHJpdmF0ZVxuICovXG5cbmZ1bmN0aW9uIHBhcmFtcyhzdHIpe1xuICByZXR1cm4gc3RyLnNwbGl0KC8gKjsgKi8pLnJlZHVjZShmdW5jdGlvbihvYmosIHN0cil7XG4gICAgdmFyIHBhcnRzID0gc3RyLnNwbGl0KC8gKj0gKi8pLFxuICAgICAgICBrZXkgPSBwYXJ0cy5zaGlmdCgpLFxuICAgICAgICB2YWwgPSBwYXJ0cy5zaGlmdCgpO1xuXG4gICAgaWYgKGtleSAmJiB2YWwpIG9ialtrZXldID0gdmFsO1xuICAgIHJldHVybiBvYmo7XG4gIH0sIHt9KTtcbn07XG5cbi8qKlxuICogSW5pdGlhbGl6ZSBhIG5ldyBgUmVzcG9uc2VgIHdpdGggdGhlIGdpdmVuIGB4aHJgLlxuICpcbiAqICAtIHNldCBmbGFncyAoLm9rLCAuZXJyb3IsIGV0YylcbiAqICAtIHBhcnNlIGhlYWRlclxuICpcbiAqIEV4YW1wbGVzOlxuICpcbiAqICBBbGlhc2luZyBgc3VwZXJhZ2VudGAgYXMgYHJlcXVlc3RgIGlzIG5pY2U6XG4gKlxuICogICAgICByZXF1ZXN0ID0gc3VwZXJhZ2VudDtcbiAqXG4gKiAgV2UgY2FuIHVzZSB0aGUgcHJvbWlzZS1saWtlIEFQSSwgb3IgcGFzcyBjYWxsYmFja3M6XG4gKlxuICogICAgICByZXF1ZXN0LmdldCgnLycpLmVuZChmdW5jdGlvbihyZXMpe30pO1xuICogICAgICByZXF1ZXN0LmdldCgnLycsIGZ1bmN0aW9uKHJlcyl7fSk7XG4gKlxuICogIFNlbmRpbmcgZGF0YSBjYW4gYmUgY2hhaW5lZDpcbiAqXG4gKiAgICAgIHJlcXVlc3RcbiAqICAgICAgICAucG9zdCgnL3VzZXInKVxuICogICAgICAgIC5zZW5kKHsgbmFtZTogJ3RqJyB9KVxuICogICAgICAgIC5lbmQoZnVuY3Rpb24ocmVzKXt9KTtcbiAqXG4gKiAgT3IgcGFzc2VkIHRvIGAuc2VuZCgpYDpcbiAqXG4gKiAgICAgIHJlcXVlc3RcbiAqICAgICAgICAucG9zdCgnL3VzZXInKVxuICogICAgICAgIC5zZW5kKHsgbmFtZTogJ3RqJyB9LCBmdW5jdGlvbihyZXMpe30pO1xuICpcbiAqICBPciBwYXNzZWQgdG8gYC5wb3N0KClgOlxuICpcbiAqICAgICAgcmVxdWVzdFxuICogICAgICAgIC5wb3N0KCcvdXNlcicsIHsgbmFtZTogJ3RqJyB9KVxuICogICAgICAgIC5lbmQoZnVuY3Rpb24ocmVzKXt9KTtcbiAqXG4gKiBPciBmdXJ0aGVyIHJlZHVjZWQgdG8gYSBzaW5nbGUgY2FsbCBmb3Igc2ltcGxlIGNhc2VzOlxuICpcbiAqICAgICAgcmVxdWVzdFxuICogICAgICAgIC5wb3N0KCcvdXNlcicsIHsgbmFtZTogJ3RqJyB9LCBmdW5jdGlvbihyZXMpe30pO1xuICpcbiAqIEBwYXJhbSB7WE1MSFRUUFJlcXVlc3R9IHhoclxuICogQHBhcmFtIHtPYmplY3R9IG9wdGlvbnNcbiAqIEBhcGkgcHJpdmF0ZVxuICovXG5cbmZ1bmN0aW9uIFJlc3BvbnNlKHJlcSwgb3B0aW9ucykge1xuICBvcHRpb25zID0gb3B0aW9ucyB8fCB7fTtcbiAgdGhpcy5yZXEgPSByZXE7XG4gIHRoaXMueGhyID0gdGhpcy5yZXEueGhyO1xuICAvLyByZXNwb25zZVRleHQgaXMgYWNjZXNzaWJsZSBvbmx5IGlmIHJlc3BvbnNlVHlwZSBpcyAnJyBvciAndGV4dCcgYW5kIG9uIG9sZGVyIGJyb3dzZXJzXG4gIHRoaXMudGV4dCA9ICgodGhpcy5yZXEubWV0aG9kICE9J0hFQUQnICYmICh0aGlzLnhoci5yZXNwb25zZVR5cGUgPT09ICcnIHx8IHRoaXMueGhyLnJlc3BvbnNlVHlwZSA9PT0gJ3RleHQnKSkgfHwgdHlwZW9mIHRoaXMueGhyLnJlc3BvbnNlVHlwZSA9PT0gJ3VuZGVmaW5lZCcpXG4gICAgID8gdGhpcy54aHIucmVzcG9uc2VUZXh0XG4gICAgIDogbnVsbDtcbiAgdGhpcy5zdGF0dXNUZXh0ID0gdGhpcy5yZXEueGhyLnN0YXR1c1RleHQ7XG4gIHRoaXMuX3NldFN0YXR1c1Byb3BlcnRpZXModGhpcy54aHIuc3RhdHVzKTtcbiAgdGhpcy5oZWFkZXIgPSB0aGlzLmhlYWRlcnMgPSBwYXJzZUhlYWRlcih0aGlzLnhoci5nZXRBbGxSZXNwb25zZUhlYWRlcnMoKSk7XG4gIC8vIGdldEFsbFJlc3BvbnNlSGVhZGVycyBzb21ldGltZXMgZmFsc2VseSByZXR1cm5zIFwiXCIgZm9yIENPUlMgcmVxdWVzdHMsIGJ1dFxuICAvLyBnZXRSZXNwb25zZUhlYWRlciBzdGlsbCB3b3Jrcy4gc28gd2UgZ2V0IGNvbnRlbnQtdHlwZSBldmVuIGlmIGdldHRpbmdcbiAgLy8gb3RoZXIgaGVhZGVycyBmYWlscy5cbiAgdGhpcy5oZWFkZXJbJ2NvbnRlbnQtdHlwZSddID0gdGhpcy54aHIuZ2V0UmVzcG9uc2VIZWFkZXIoJ2NvbnRlbnQtdHlwZScpO1xuICB0aGlzLl9zZXRIZWFkZXJQcm9wZXJ0aWVzKHRoaXMuaGVhZGVyKTtcbiAgdGhpcy5ib2R5ID0gdGhpcy5yZXEubWV0aG9kICE9ICdIRUFEJ1xuICAgID8gdGhpcy5fcGFyc2VCb2R5KHRoaXMudGV4dCA/IHRoaXMudGV4dCA6IHRoaXMueGhyLnJlc3BvbnNlKVxuICAgIDogbnVsbDtcbn1cblxuLyoqXG4gKiBHZXQgY2FzZS1pbnNlbnNpdGl2ZSBgZmllbGRgIHZhbHVlLlxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfSBmaWVsZFxuICogQHJldHVybiB7U3RyaW5nfVxuICogQGFwaSBwdWJsaWNcbiAqL1xuXG5SZXNwb25zZS5wcm90b3R5cGUuZ2V0ID0gZnVuY3Rpb24oZmllbGQpe1xuICByZXR1cm4gdGhpcy5oZWFkZXJbZmllbGQudG9Mb3dlckNhc2UoKV07XG59O1xuXG4vKipcbiAqIFNldCBoZWFkZXIgcmVsYXRlZCBwcm9wZXJ0aWVzOlxuICpcbiAqICAgLSBgLnR5cGVgIHRoZSBjb250ZW50IHR5cGUgd2l0aG91dCBwYXJhbXNcbiAqXG4gKiBBIHJlc3BvbnNlIG9mIFwiQ29udGVudC1UeXBlOiB0ZXh0L3BsYWluOyBjaGFyc2V0PXV0Zi04XCJcbiAqIHdpbGwgcHJvdmlkZSB5b3Ugd2l0aCBhIGAudHlwZWAgb2YgXCJ0ZXh0L3BsYWluXCIuXG4gKlxuICogQHBhcmFtIHtPYmplY3R9IGhlYWRlclxuICogQGFwaSBwcml2YXRlXG4gKi9cblxuUmVzcG9uc2UucHJvdG90eXBlLl9zZXRIZWFkZXJQcm9wZXJ0aWVzID0gZnVuY3Rpb24oaGVhZGVyKXtcbiAgLy8gY29udGVudC10eXBlXG4gIHZhciBjdCA9IHRoaXMuaGVhZGVyWydjb250ZW50LXR5cGUnXSB8fCAnJztcbiAgdGhpcy50eXBlID0gdHlwZShjdCk7XG5cbiAgLy8gcGFyYW1zXG4gIHZhciBvYmogPSBwYXJhbXMoY3QpO1xuICBmb3IgKHZhciBrZXkgaW4gb2JqKSB0aGlzW2tleV0gPSBvYmpba2V5XTtcbn07XG5cbi8qKlxuICogUGFyc2UgdGhlIGdpdmVuIGJvZHkgYHN0cmAuXG4gKlxuICogVXNlZCBmb3IgYXV0by1wYXJzaW5nIG9mIGJvZGllcy4gUGFyc2Vyc1xuICogYXJlIGRlZmluZWQgb24gdGhlIGBzdXBlcmFnZW50LnBhcnNlYCBvYmplY3QuXG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IHN0clxuICogQHJldHVybiB7TWl4ZWR9XG4gKiBAYXBpIHByaXZhdGVcbiAqL1xuXG5SZXNwb25zZS5wcm90b3R5cGUuX3BhcnNlQm9keSA9IGZ1bmN0aW9uKHN0cil7XG4gIHZhciBwYXJzZSA9IHJlcXVlc3QucGFyc2VbdGhpcy50eXBlXTtcbiAgaWYgKCFwYXJzZSAmJiBpc0pTT04odGhpcy50eXBlKSkge1xuICAgIHBhcnNlID0gcmVxdWVzdC5wYXJzZVsnYXBwbGljYXRpb24vanNvbiddO1xuICB9XG4gIHJldHVybiBwYXJzZSAmJiBzdHIgJiYgKHN0ci5sZW5ndGggfHwgc3RyIGluc3RhbmNlb2YgT2JqZWN0KVxuICAgID8gcGFyc2Uoc3RyKVxuICAgIDogbnVsbDtcbn07XG5cbi8qKlxuICogU2V0IGZsYWdzIHN1Y2ggYXMgYC5va2AgYmFzZWQgb24gYHN0YXR1c2AuXG4gKlxuICogRm9yIGV4YW1wbGUgYSAyeHggcmVzcG9uc2Ugd2lsbCBnaXZlIHlvdSBhIGAub2tgIG9mIF9fdHJ1ZV9fXG4gKiB3aGVyZWFzIDV4eCB3aWxsIGJlIF9fZmFsc2VfXyBhbmQgYC5lcnJvcmAgd2lsbCBiZSBfX3RydWVfXy4gVGhlXG4gKiBgLmNsaWVudEVycm9yYCBhbmQgYC5zZXJ2ZXJFcnJvcmAgYXJlIGFsc28gYXZhaWxhYmxlIHRvIGJlIG1vcmVcbiAqIHNwZWNpZmljLCBhbmQgYC5zdGF0dXNUeXBlYCBpcyB0aGUgY2xhc3Mgb2YgZXJyb3IgcmFuZ2luZyBmcm9tIDEuLjVcbiAqIHNvbWV0aW1lcyB1c2VmdWwgZm9yIG1hcHBpbmcgcmVzcG9uZCBjb2xvcnMgZXRjLlxuICpcbiAqIFwic3VnYXJcIiBwcm9wZXJ0aWVzIGFyZSBhbHNvIGRlZmluZWQgZm9yIGNvbW1vbiBjYXNlcy4gQ3VycmVudGx5IHByb3ZpZGluZzpcbiAqXG4gKiAgIC0gLm5vQ29udGVudFxuICogICAtIC5iYWRSZXF1ZXN0XG4gKiAgIC0gLnVuYXV0aG9yaXplZFxuICogICAtIC5ub3RBY2NlcHRhYmxlXG4gKiAgIC0gLm5vdEZvdW5kXG4gKlxuICogQHBhcmFtIHtOdW1iZXJ9IHN0YXR1c1xuICogQGFwaSBwcml2YXRlXG4gKi9cblxuUmVzcG9uc2UucHJvdG90eXBlLl9zZXRTdGF0dXNQcm9wZXJ0aWVzID0gZnVuY3Rpb24oc3RhdHVzKXtcbiAgLy8gaGFuZGxlIElFOSBidWc6IGh0dHA6Ly9zdGFja292ZXJmbG93LmNvbS9xdWVzdGlvbnMvMTAwNDY5NzIvbXNpZS1yZXR1cm5zLXN0YXR1cy1jb2RlLW9mLTEyMjMtZm9yLWFqYXgtcmVxdWVzdFxuICBpZiAoc3RhdHVzID09PSAxMjIzKSB7XG4gICAgc3RhdHVzID0gMjA0O1xuICB9XG5cbiAgdmFyIHR5cGUgPSBzdGF0dXMgLyAxMDAgfCAwO1xuXG4gIC8vIHN0YXR1cyAvIGNsYXNzXG4gIHRoaXMuc3RhdHVzID0gdGhpcy5zdGF0dXNDb2RlID0gc3RhdHVzO1xuICB0aGlzLnN0YXR1c1R5cGUgPSB0eXBlO1xuXG4gIC8vIGJhc2ljc1xuICB0aGlzLmluZm8gPSAxID09IHR5cGU7XG4gIHRoaXMub2sgPSAyID09IHR5cGU7XG4gIHRoaXMuY2xpZW50RXJyb3IgPSA0ID09IHR5cGU7XG4gIHRoaXMuc2VydmVyRXJyb3IgPSA1ID09IHR5cGU7XG4gIHRoaXMuZXJyb3IgPSAoNCA9PSB0eXBlIHx8IDUgPT0gdHlwZSlcbiAgICA/IHRoaXMudG9FcnJvcigpXG4gICAgOiBmYWxzZTtcblxuICAvLyBzdWdhclxuICB0aGlzLmFjY2VwdGVkID0gMjAyID09IHN0YXR1cztcbiAgdGhpcy5ub0NvbnRlbnQgPSAyMDQgPT0gc3RhdHVzO1xuICB0aGlzLmJhZFJlcXVlc3QgPSA0MDAgPT0gc3RhdHVzO1xuICB0aGlzLnVuYXV0aG9yaXplZCA9IDQwMSA9PSBzdGF0dXM7XG4gIHRoaXMubm90QWNjZXB0YWJsZSA9IDQwNiA9PSBzdGF0dXM7XG4gIHRoaXMubm90Rm91bmQgPSA0MDQgPT0gc3RhdHVzO1xuICB0aGlzLmZvcmJpZGRlbiA9IDQwMyA9PSBzdGF0dXM7XG59O1xuXG4vKipcbiAqIFJldHVybiBhbiBgRXJyb3JgIHJlcHJlc2VudGF0aXZlIG9mIHRoaXMgcmVzcG9uc2UuXG4gKlxuICogQHJldHVybiB7RXJyb3J9XG4gKiBAYXBpIHB1YmxpY1xuICovXG5cblJlc3BvbnNlLnByb3RvdHlwZS50b0Vycm9yID0gZnVuY3Rpb24oKXtcbiAgdmFyIHJlcSA9IHRoaXMucmVxO1xuICB2YXIgbWV0aG9kID0gcmVxLm1ldGhvZDtcbiAgdmFyIHVybCA9IHJlcS51cmw7XG5cbiAgdmFyIG1zZyA9ICdjYW5ub3QgJyArIG1ldGhvZCArICcgJyArIHVybCArICcgKCcgKyB0aGlzLnN0YXR1cyArICcpJztcbiAgdmFyIGVyciA9IG5ldyBFcnJvcihtc2cpO1xuICBlcnIuc3RhdHVzID0gdGhpcy5zdGF0dXM7XG4gIGVyci5tZXRob2QgPSBtZXRob2Q7XG4gIGVyci51cmwgPSB1cmw7XG5cbiAgcmV0dXJuIGVycjtcbn07XG5cbi8qKlxuICogRXhwb3NlIGBSZXNwb25zZWAuXG4gKi9cblxucmVxdWVzdC5SZXNwb25zZSA9IFJlc3BvbnNlO1xuXG4vKipcbiAqIEluaXRpYWxpemUgYSBuZXcgYFJlcXVlc3RgIHdpdGggdGhlIGdpdmVuIGBtZXRob2RgIGFuZCBgdXJsYC5cbiAqXG4gKiBAcGFyYW0ge1N0cmluZ30gbWV0aG9kXG4gKiBAcGFyYW0ge1N0cmluZ30gdXJsXG4gKiBAYXBpIHB1YmxpY1xuICovXG5cbmZ1bmN0aW9uIFJlcXVlc3QobWV0aG9kLCB1cmwpIHtcbiAgdmFyIHNlbGYgPSB0aGlzO1xuICB0aGlzLl9xdWVyeSA9IHRoaXMuX3F1ZXJ5IHx8IFtdO1xuICB0aGlzLm1ldGhvZCA9IG1ldGhvZDtcbiAgdGhpcy51cmwgPSB1cmw7XG4gIHRoaXMuaGVhZGVyID0ge307IC8vIHByZXNlcnZlcyBoZWFkZXIgbmFtZSBjYXNlXG4gIHRoaXMuX2hlYWRlciA9IHt9OyAvLyBjb2VyY2VzIGhlYWRlciBuYW1lcyB0byBsb3dlcmNhc2VcbiAgdGhpcy5vbignZW5kJywgZnVuY3Rpb24oKXtcbiAgICB2YXIgZXJyID0gbnVsbDtcbiAgICB2YXIgcmVzID0gbnVsbDtcblxuICAgIHRyeSB7XG4gICAgICByZXMgPSBuZXcgUmVzcG9uc2Uoc2VsZik7XG4gICAgfSBjYXRjaChlKSB7XG4gICAgICBlcnIgPSBuZXcgRXJyb3IoJ1BhcnNlciBpcyB1bmFibGUgdG8gcGFyc2UgdGhlIHJlc3BvbnNlJyk7XG4gICAgICBlcnIucGFyc2UgPSB0cnVlO1xuICAgICAgZXJyLm9yaWdpbmFsID0gZTtcbiAgICAgIC8vIGlzc3VlICM2NzU6IHJldHVybiB0aGUgcmF3IHJlc3BvbnNlIGlmIHRoZSByZXNwb25zZSBwYXJzaW5nIGZhaWxzXG4gICAgICBlcnIucmF3UmVzcG9uc2UgPSBzZWxmLnhociAmJiBzZWxmLnhoci5yZXNwb25zZVRleHQgPyBzZWxmLnhoci5yZXNwb25zZVRleHQgOiBudWxsO1xuICAgICAgLy8gaXNzdWUgIzg3NjogcmV0dXJuIHRoZSBodHRwIHN0YXR1cyBjb2RlIGlmIHRoZSByZXNwb25zZSBwYXJzaW5nIGZhaWxzXG4gICAgICBlcnIuc3RhdHVzQ29kZSA9IHNlbGYueGhyICYmIHNlbGYueGhyLnN0YXR1cyA/IHNlbGYueGhyLnN0YXR1cyA6IG51bGw7XG4gICAgICByZXR1cm4gc2VsZi5jYWxsYmFjayhlcnIpO1xuICAgIH1cblxuICAgIHNlbGYuZW1pdCgncmVzcG9uc2UnLCByZXMpO1xuXG4gICAgdmFyIG5ld19lcnI7XG4gICAgdHJ5IHtcbiAgICAgIGlmIChyZXMuc3RhdHVzIDwgMjAwIHx8IHJlcy5zdGF0dXMgPj0gMzAwKSB7XG4gICAgICAgIG5ld19lcnIgPSBuZXcgRXJyb3IocmVzLnN0YXR1c1RleHQgfHwgJ1Vuc3VjY2Vzc2Z1bCBIVFRQIHJlc3BvbnNlJyk7XG4gICAgICAgIG5ld19lcnIub3JpZ2luYWwgPSBlcnI7XG4gICAgICAgIG5ld19lcnIucmVzcG9uc2UgPSByZXM7XG4gICAgICAgIG5ld19lcnIuc3RhdHVzID0gcmVzLnN0YXR1cztcbiAgICAgIH1cbiAgICB9IGNhdGNoKGUpIHtcbiAgICAgIG5ld19lcnIgPSBlOyAvLyAjOTg1IHRvdWNoaW5nIHJlcyBtYXkgY2F1c2UgSU5WQUxJRF9TVEFURV9FUlIgb24gb2xkIEFuZHJvaWRcbiAgICB9XG5cbiAgICAvLyAjMTAwMCBkb24ndCBjYXRjaCBlcnJvcnMgZnJvbSB0aGUgY2FsbGJhY2sgdG8gYXZvaWQgZG91YmxlIGNhbGxpbmcgaXRcbiAgICBpZiAobmV3X2Vycikge1xuICAgICAgc2VsZi5jYWxsYmFjayhuZXdfZXJyLCByZXMpO1xuICAgIH0gZWxzZSB7XG4gICAgICBzZWxmLmNhbGxiYWNrKG51bGwsIHJlcyk7XG4gICAgfVxuICB9KTtcbn1cblxuLyoqXG4gKiBNaXhpbiBgRW1pdHRlcmAgYW5kIGByZXF1ZXN0QmFzZWAuXG4gKi9cblxuRW1pdHRlcihSZXF1ZXN0LnByb3RvdHlwZSk7XG5mb3IgKHZhciBrZXkgaW4gcmVxdWVzdEJhc2UpIHtcbiAgUmVxdWVzdC5wcm90b3R5cGVba2V5XSA9IHJlcXVlc3RCYXNlW2tleV07XG59XG5cbi8qKlxuICogU2V0IENvbnRlbnQtVHlwZSB0byBgdHlwZWAsIG1hcHBpbmcgdmFsdWVzIGZyb20gYHJlcXVlc3QudHlwZXNgLlxuICpcbiAqIEV4YW1wbGVzOlxuICpcbiAqICAgICAgc3VwZXJhZ2VudC50eXBlcy54bWwgPSAnYXBwbGljYXRpb24veG1sJztcbiAqXG4gKiAgICAgIHJlcXVlc3QucG9zdCgnLycpXG4gKiAgICAgICAgLnR5cGUoJ3htbCcpXG4gKiAgICAgICAgLnNlbmQoeG1sc3RyaW5nKVxuICogICAgICAgIC5lbmQoY2FsbGJhY2spO1xuICpcbiAqICAgICAgcmVxdWVzdC5wb3N0KCcvJylcbiAqICAgICAgICAudHlwZSgnYXBwbGljYXRpb24veG1sJylcbiAqICAgICAgICAuc2VuZCh4bWxzdHJpbmcpXG4gKiAgICAgICAgLmVuZChjYWxsYmFjayk7XG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IHR5cGVcbiAqIEByZXR1cm4ge1JlcXVlc3R9IGZvciBjaGFpbmluZ1xuICogQGFwaSBwdWJsaWNcbiAqL1xuXG5SZXF1ZXN0LnByb3RvdHlwZS50eXBlID0gZnVuY3Rpb24odHlwZSl7XG4gIHRoaXMuc2V0KCdDb250ZW50LVR5cGUnLCByZXF1ZXN0LnR5cGVzW3R5cGVdIHx8IHR5cGUpO1xuICByZXR1cm4gdGhpcztcbn07XG5cbi8qKlxuICogU2V0IHJlc3BvbnNlVHlwZSB0byBgdmFsYC4gUHJlc2VudGx5IHZhbGlkIHJlc3BvbnNlVHlwZXMgYXJlICdibG9iJyBhbmRcbiAqICdhcnJheWJ1ZmZlcicuXG4gKlxuICogRXhhbXBsZXM6XG4gKlxuICogICAgICByZXEuZ2V0KCcvJylcbiAqICAgICAgICAucmVzcG9uc2VUeXBlKCdibG9iJylcbiAqICAgICAgICAuZW5kKGNhbGxiYWNrKTtcbiAqXG4gKiBAcGFyYW0ge1N0cmluZ30gdmFsXG4gKiBAcmV0dXJuIHtSZXF1ZXN0fSBmb3IgY2hhaW5pbmdcbiAqIEBhcGkgcHVibGljXG4gKi9cblxuUmVxdWVzdC5wcm90b3R5cGUucmVzcG9uc2VUeXBlID0gZnVuY3Rpb24odmFsKXtcbiAgdGhpcy5fcmVzcG9uc2VUeXBlID0gdmFsO1xuICByZXR1cm4gdGhpcztcbn07XG5cbi8qKlxuICogU2V0IEFjY2VwdCB0byBgdHlwZWAsIG1hcHBpbmcgdmFsdWVzIGZyb20gYHJlcXVlc3QudHlwZXNgLlxuICpcbiAqIEV4YW1wbGVzOlxuICpcbiAqICAgICAgc3VwZXJhZ2VudC50eXBlcy5qc29uID0gJ2FwcGxpY2F0aW9uL2pzb24nO1xuICpcbiAqICAgICAgcmVxdWVzdC5nZXQoJy9hZ2VudCcpXG4gKiAgICAgICAgLmFjY2VwdCgnanNvbicpXG4gKiAgICAgICAgLmVuZChjYWxsYmFjayk7XG4gKlxuICogICAgICByZXF1ZXN0LmdldCgnL2FnZW50JylcbiAqICAgICAgICAuYWNjZXB0KCdhcHBsaWNhdGlvbi9qc29uJylcbiAqICAgICAgICAuZW5kKGNhbGxiYWNrKTtcbiAqXG4gKiBAcGFyYW0ge1N0cmluZ30gYWNjZXB0XG4gKiBAcmV0dXJuIHtSZXF1ZXN0fSBmb3IgY2hhaW5pbmdcbiAqIEBhcGkgcHVibGljXG4gKi9cblxuUmVxdWVzdC5wcm90b3R5cGUuYWNjZXB0ID0gZnVuY3Rpb24odHlwZSl7XG4gIHRoaXMuc2V0KCdBY2NlcHQnLCByZXF1ZXN0LnR5cGVzW3R5cGVdIHx8IHR5cGUpO1xuICByZXR1cm4gdGhpcztcbn07XG5cbi8qKlxuICogU2V0IEF1dGhvcml6YXRpb24gZmllbGQgdmFsdWUgd2l0aCBgdXNlcmAgYW5kIGBwYXNzYC5cbiAqXG4gKiBAcGFyYW0ge1N0cmluZ30gdXNlclxuICogQHBhcmFtIHtTdHJpbmd9IHBhc3NcbiAqIEBwYXJhbSB7T2JqZWN0fSBvcHRpb25zIHdpdGggJ3R5cGUnIHByb3BlcnR5ICdhdXRvJyBvciAnYmFzaWMnIChkZWZhdWx0ICdiYXNpYycpXG4gKiBAcmV0dXJuIHtSZXF1ZXN0fSBmb3IgY2hhaW5pbmdcbiAqIEBhcGkgcHVibGljXG4gKi9cblxuUmVxdWVzdC5wcm90b3R5cGUuYXV0aCA9IGZ1bmN0aW9uKHVzZXIsIHBhc3MsIG9wdGlvbnMpe1xuICBpZiAoIW9wdGlvbnMpIHtcbiAgICBvcHRpb25zID0ge1xuICAgICAgdHlwZTogJ2Jhc2ljJ1xuICAgIH1cbiAgfVxuXG4gIHN3aXRjaCAob3B0aW9ucy50eXBlKSB7XG4gICAgY2FzZSAnYmFzaWMnOlxuICAgICAgdmFyIHN0ciA9IGJ0b2EodXNlciArICc6JyArIHBhc3MpO1xuICAgICAgdGhpcy5zZXQoJ0F1dGhvcml6YXRpb24nLCAnQmFzaWMgJyArIHN0cik7XG4gICAgYnJlYWs7XG5cbiAgICBjYXNlICdhdXRvJzpcbiAgICAgIHRoaXMudXNlcm5hbWUgPSB1c2VyO1xuICAgICAgdGhpcy5wYXNzd29yZCA9IHBhc3M7XG4gICAgYnJlYWs7XG4gIH1cbiAgcmV0dXJuIHRoaXM7XG59O1xuXG4vKipcbiogQWRkIHF1ZXJ5LXN0cmluZyBgdmFsYC5cbipcbiogRXhhbXBsZXM6XG4qXG4qICAgcmVxdWVzdC5nZXQoJy9zaG9lcycpXG4qICAgICAucXVlcnkoJ3NpemU9MTAnKVxuKiAgICAgLnF1ZXJ5KHsgY29sb3I6ICdibHVlJyB9KVxuKlxuKiBAcGFyYW0ge09iamVjdHxTdHJpbmd9IHZhbFxuKiBAcmV0dXJuIHtSZXF1ZXN0fSBmb3IgY2hhaW5pbmdcbiogQGFwaSBwdWJsaWNcbiovXG5cblJlcXVlc3QucHJvdG90eXBlLnF1ZXJ5ID0gZnVuY3Rpb24odmFsKXtcbiAgaWYgKCdzdHJpbmcnICE9IHR5cGVvZiB2YWwpIHZhbCA9IHNlcmlhbGl6ZSh2YWwpO1xuICBpZiAodmFsKSB0aGlzLl9xdWVyeS5wdXNoKHZhbCk7XG4gIHJldHVybiB0aGlzO1xufTtcblxuLyoqXG4gKiBRdWV1ZSB0aGUgZ2l2ZW4gYGZpbGVgIGFzIGFuIGF0dGFjaG1lbnQgdG8gdGhlIHNwZWNpZmllZCBgZmllbGRgLFxuICogd2l0aCBvcHRpb25hbCBgZmlsZW5hbWVgLlxuICpcbiAqIGBgYCBqc1xuICogcmVxdWVzdC5wb3N0KCcvdXBsb2FkJylcbiAqICAgLmF0dGFjaCgnY29udGVudCcsIG5ldyBCbG9iKFsnPGEgaWQ9XCJhXCI+PGIgaWQ9XCJiXCI+aGV5ITwvYj48L2E+J10sIHsgdHlwZTogXCJ0ZXh0L2h0bWxcIn0pKVxuICogICAuZW5kKGNhbGxiYWNrKTtcbiAqIGBgYFxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfSBmaWVsZFxuICogQHBhcmFtIHtCbG9ifEZpbGV9IGZpbGVcbiAqIEBwYXJhbSB7U3RyaW5nfSBmaWxlbmFtZVxuICogQHJldHVybiB7UmVxdWVzdH0gZm9yIGNoYWluaW5nXG4gKiBAYXBpIHB1YmxpY1xuICovXG5cblJlcXVlc3QucHJvdG90eXBlLmF0dGFjaCA9IGZ1bmN0aW9uKGZpZWxkLCBmaWxlLCBmaWxlbmFtZSl7XG4gIHRoaXMuX2dldEZvcm1EYXRhKCkuYXBwZW5kKGZpZWxkLCBmaWxlLCBmaWxlbmFtZSB8fCBmaWxlLm5hbWUpO1xuICByZXR1cm4gdGhpcztcbn07XG5cblJlcXVlc3QucHJvdG90eXBlLl9nZXRGb3JtRGF0YSA9IGZ1bmN0aW9uKCl7XG4gIGlmICghdGhpcy5fZm9ybURhdGEpIHtcbiAgICB0aGlzLl9mb3JtRGF0YSA9IG5ldyByb290LkZvcm1EYXRhKCk7XG4gIH1cbiAgcmV0dXJuIHRoaXMuX2Zvcm1EYXRhO1xufTtcblxuLyoqXG4gKiBJbnZva2UgdGhlIGNhbGxiYWNrIHdpdGggYGVycmAgYW5kIGByZXNgXG4gKiBhbmQgaGFuZGxlIGFyaXR5IGNoZWNrLlxuICpcbiAqIEBwYXJhbSB7RXJyb3J9IGVyclxuICogQHBhcmFtIHtSZXNwb25zZX0gcmVzXG4gKiBAYXBpIHByaXZhdGVcbiAqL1xuXG5SZXF1ZXN0LnByb3RvdHlwZS5jYWxsYmFjayA9IGZ1bmN0aW9uKGVyciwgcmVzKXtcbiAgdmFyIGZuID0gdGhpcy5fY2FsbGJhY2s7XG4gIHRoaXMuY2xlYXJUaW1lb3V0KCk7XG4gIGZuKGVyciwgcmVzKTtcbn07XG5cbi8qKlxuICogSW52b2tlIGNhbGxiYWNrIHdpdGggeC1kb21haW4gZXJyb3IuXG4gKlxuICogQGFwaSBwcml2YXRlXG4gKi9cblxuUmVxdWVzdC5wcm90b3R5cGUuY3Jvc3NEb21haW5FcnJvciA9IGZ1bmN0aW9uKCl7XG4gIHZhciBlcnIgPSBuZXcgRXJyb3IoJ1JlcXVlc3QgaGFzIGJlZW4gdGVybWluYXRlZFxcblBvc3NpYmxlIGNhdXNlczogdGhlIG5ldHdvcmsgaXMgb2ZmbGluZSwgT3JpZ2luIGlzIG5vdCBhbGxvd2VkIGJ5IEFjY2Vzcy1Db250cm9sLUFsbG93LU9yaWdpbiwgdGhlIHBhZ2UgaXMgYmVpbmcgdW5sb2FkZWQsIGV0Yy4nKTtcbiAgZXJyLmNyb3NzRG9tYWluID0gdHJ1ZTtcblxuICBlcnIuc3RhdHVzID0gdGhpcy5zdGF0dXM7XG4gIGVyci5tZXRob2QgPSB0aGlzLm1ldGhvZDtcbiAgZXJyLnVybCA9IHRoaXMudXJsO1xuXG4gIHRoaXMuY2FsbGJhY2soZXJyKTtcbn07XG5cbi8qKlxuICogSW52b2tlIGNhbGxiYWNrIHdpdGggdGltZW91dCBlcnJvci5cbiAqXG4gKiBAYXBpIHByaXZhdGVcbiAqL1xuXG5SZXF1ZXN0LnByb3RvdHlwZS5fdGltZW91dEVycm9yID0gZnVuY3Rpb24oKXtcbiAgdmFyIHRpbWVvdXQgPSB0aGlzLl90aW1lb3V0O1xuICB2YXIgZXJyID0gbmV3IEVycm9yKCd0aW1lb3V0IG9mICcgKyB0aW1lb3V0ICsgJ21zIGV4Y2VlZGVkJyk7XG4gIGVyci50aW1lb3V0ID0gdGltZW91dDtcbiAgdGhpcy5jYWxsYmFjayhlcnIpO1xufTtcblxuLyoqXG4gKiBDb21wb3NlIHF1ZXJ5c3RyaW5nIHRvIGFwcGVuZCB0byByZXEudXJsXG4gKlxuICogQGFwaSBwcml2YXRlXG4gKi9cblxuUmVxdWVzdC5wcm90b3R5cGUuX2FwcGVuZFF1ZXJ5U3RyaW5nID0gZnVuY3Rpb24oKXtcbiAgdmFyIHF1ZXJ5ID0gdGhpcy5fcXVlcnkuam9pbignJicpO1xuICBpZiAocXVlcnkpIHtcbiAgICB0aGlzLnVybCArPSB+dGhpcy51cmwuaW5kZXhPZignPycpXG4gICAgICA/ICcmJyArIHF1ZXJ5XG4gICAgICA6ICc/JyArIHF1ZXJ5O1xuICB9XG59O1xuXG4vKipcbiAqIEluaXRpYXRlIHJlcXVlc3QsIGludm9raW5nIGNhbGxiYWNrIGBmbihyZXMpYFxuICogd2l0aCBhbiBpbnN0YW5jZW9mIGBSZXNwb25zZWAuXG4gKlxuICogQHBhcmFtIHtGdW5jdGlvbn0gZm5cbiAqIEByZXR1cm4ge1JlcXVlc3R9IGZvciBjaGFpbmluZ1xuICogQGFwaSBwdWJsaWNcbiAqL1xuXG5SZXF1ZXN0LnByb3RvdHlwZS5lbmQgPSBmdW5jdGlvbihmbil7XG4gIHZhciBzZWxmID0gdGhpcztcbiAgdmFyIHhociA9IHRoaXMueGhyID0gcmVxdWVzdC5nZXRYSFIoKTtcbiAgdmFyIHRpbWVvdXQgPSB0aGlzLl90aW1lb3V0O1xuICB2YXIgZGF0YSA9IHRoaXMuX2Zvcm1EYXRhIHx8IHRoaXMuX2RhdGE7XG5cbiAgLy8gc3RvcmUgY2FsbGJhY2tcbiAgdGhpcy5fY2FsbGJhY2sgPSBmbiB8fCBub29wO1xuXG4gIC8vIHN0YXRlIGNoYW5nZVxuICB4aHIub25yZWFkeXN0YXRlY2hhbmdlID0gZnVuY3Rpb24oKXtcbiAgICBpZiAoNCAhPSB4aHIucmVhZHlTdGF0ZSkgcmV0dXJuO1xuXG4gICAgLy8gSW4gSUU5LCByZWFkcyB0byBhbnkgcHJvcGVydHkgKGUuZy4gc3RhdHVzKSBvZmYgb2YgYW4gYWJvcnRlZCBYSFIgd2lsbFxuICAgIC8vIHJlc3VsdCBpbiB0aGUgZXJyb3IgXCJDb3VsZCBub3QgY29tcGxldGUgdGhlIG9wZXJhdGlvbiBkdWUgdG8gZXJyb3IgYzAwYzAyM2ZcIlxuICAgIHZhciBzdGF0dXM7XG4gICAgdHJ5IHsgc3RhdHVzID0geGhyLnN0YXR1cyB9IGNhdGNoKGUpIHsgc3RhdHVzID0gMDsgfVxuXG4gICAgaWYgKDAgPT0gc3RhdHVzKSB7XG4gICAgICBpZiAoc2VsZi50aW1lZG91dCkgcmV0dXJuIHNlbGYuX3RpbWVvdXRFcnJvcigpO1xuICAgICAgaWYgKHNlbGYuX2Fib3J0ZWQpIHJldHVybjtcbiAgICAgIHJldHVybiBzZWxmLmNyb3NzRG9tYWluRXJyb3IoKTtcbiAgICB9XG4gICAgc2VsZi5lbWl0KCdlbmQnKTtcbiAgfTtcblxuICAvLyBwcm9ncmVzc1xuICB2YXIgaGFuZGxlUHJvZ3Jlc3MgPSBmdW5jdGlvbihkaXJlY3Rpb24sIGUpIHtcbiAgICBpZiAoZS50b3RhbCA+IDApIHtcbiAgICAgIGUucGVyY2VudCA9IGUubG9hZGVkIC8gZS50b3RhbCAqIDEwMDtcbiAgICB9XG4gICAgZS5kaXJlY3Rpb24gPSBkaXJlY3Rpb247XG4gICAgc2VsZi5lbWl0KCdwcm9ncmVzcycsIGUpO1xuICB9XG4gIGlmICh0aGlzLmhhc0xpc3RlbmVycygncHJvZ3Jlc3MnKSkge1xuICAgIHRyeSB7XG4gICAgICB4aHIub25wcm9ncmVzcyA9IGhhbmRsZVByb2dyZXNzLmJpbmQobnVsbCwgJ2Rvd25sb2FkJyk7XG4gICAgICBpZiAoeGhyLnVwbG9hZCkge1xuICAgICAgICB4aHIudXBsb2FkLm9ucHJvZ3Jlc3MgPSBoYW5kbGVQcm9ncmVzcy5iaW5kKG51bGwsICd1cGxvYWQnKTtcbiAgICAgIH1cbiAgICB9IGNhdGNoKGUpIHtcbiAgICAgIC8vIEFjY2Vzc2luZyB4aHIudXBsb2FkIGZhaWxzIGluIElFIGZyb20gYSB3ZWIgd29ya2VyLCBzbyBqdXN0IHByZXRlbmQgaXQgZG9lc24ndCBleGlzdC5cbiAgICAgIC8vIFJlcG9ydGVkIGhlcmU6XG4gICAgICAvLyBodHRwczovL2Nvbm5lY3QubWljcm9zb2Z0LmNvbS9JRS9mZWVkYmFjay9kZXRhaWxzLzgzNzI0NS94bWxodHRwcmVxdWVzdC11cGxvYWQtdGhyb3dzLWludmFsaWQtYXJndW1lbnQtd2hlbi11c2VkLWZyb20td2ViLXdvcmtlci1jb250ZXh0XG4gICAgfVxuICB9XG5cbiAgLy8gdGltZW91dFxuICBpZiAodGltZW91dCAmJiAhdGhpcy5fdGltZXIpIHtcbiAgICB0aGlzLl90aW1lciA9IHNldFRpbWVvdXQoZnVuY3Rpb24oKXtcbiAgICAgIHNlbGYudGltZWRvdXQgPSB0cnVlO1xuICAgICAgc2VsZi5hYm9ydCgpO1xuICAgIH0sIHRpbWVvdXQpO1xuICB9XG5cbiAgLy8gcXVlcnlzdHJpbmdcbiAgdGhpcy5fYXBwZW5kUXVlcnlTdHJpbmcoKTtcblxuICAvLyBpbml0aWF0ZSByZXF1ZXN0XG4gIGlmICh0aGlzLnVzZXJuYW1lICYmIHRoaXMucGFzc3dvcmQpIHtcbiAgICB4aHIub3Blbih0aGlzLm1ldGhvZCwgdGhpcy51cmwsIHRydWUsIHRoaXMudXNlcm5hbWUsIHRoaXMucGFzc3dvcmQpO1xuICB9IGVsc2Uge1xuICAgIHhoci5vcGVuKHRoaXMubWV0aG9kLCB0aGlzLnVybCwgdHJ1ZSk7XG4gIH1cblxuICAvLyBDT1JTXG4gIGlmICh0aGlzLl93aXRoQ3JlZGVudGlhbHMpIHhoci53aXRoQ3JlZGVudGlhbHMgPSB0cnVlO1xuXG4gIC8vIGJvZHlcbiAgaWYgKCdHRVQnICE9IHRoaXMubWV0aG9kICYmICdIRUFEJyAhPSB0aGlzLm1ldGhvZCAmJiAnc3RyaW5nJyAhPSB0eXBlb2YgZGF0YSAmJiAhdGhpcy5faXNIb3N0KGRhdGEpKSB7XG4gICAgLy8gc2VyaWFsaXplIHN0dWZmXG4gICAgdmFyIGNvbnRlbnRUeXBlID0gdGhpcy5faGVhZGVyWydjb250ZW50LXR5cGUnXTtcbiAgICB2YXIgc2VyaWFsaXplID0gdGhpcy5fc2VyaWFsaXplciB8fCByZXF1ZXN0LnNlcmlhbGl6ZVtjb250ZW50VHlwZSA/IGNvbnRlbnRUeXBlLnNwbGl0KCc7JylbMF0gOiAnJ107XG4gICAgaWYgKCFzZXJpYWxpemUgJiYgaXNKU09OKGNvbnRlbnRUeXBlKSkgc2VyaWFsaXplID0gcmVxdWVzdC5zZXJpYWxpemVbJ2FwcGxpY2F0aW9uL2pzb24nXTtcbiAgICBpZiAoc2VyaWFsaXplKSBkYXRhID0gc2VyaWFsaXplKGRhdGEpO1xuICB9XG5cbiAgLy8gc2V0IGhlYWRlciBmaWVsZHNcbiAgZm9yICh2YXIgZmllbGQgaW4gdGhpcy5oZWFkZXIpIHtcbiAgICBpZiAobnVsbCA9PSB0aGlzLmhlYWRlcltmaWVsZF0pIGNvbnRpbnVlO1xuICAgIHhoci5zZXRSZXF1ZXN0SGVhZGVyKGZpZWxkLCB0aGlzLmhlYWRlcltmaWVsZF0pO1xuICB9XG5cbiAgaWYgKHRoaXMuX3Jlc3BvbnNlVHlwZSkge1xuICAgIHhoci5yZXNwb25zZVR5cGUgPSB0aGlzLl9yZXNwb25zZVR5cGU7XG4gIH1cblxuICAvLyBzZW5kIHN0dWZmXG4gIHRoaXMuZW1pdCgncmVxdWVzdCcsIHRoaXMpO1xuXG4gIC8vIElFMTEgeGhyLnNlbmQodW5kZWZpbmVkKSBzZW5kcyAndW5kZWZpbmVkJyBzdHJpbmcgYXMgUE9TVCBwYXlsb2FkIChpbnN0ZWFkIG9mIG5vdGhpbmcpXG4gIC8vIFdlIG5lZWQgbnVsbCBoZXJlIGlmIGRhdGEgaXMgdW5kZWZpbmVkXG4gIHhoci5zZW5kKHR5cGVvZiBkYXRhICE9PSAndW5kZWZpbmVkJyA/IGRhdGEgOiBudWxsKTtcbiAgcmV0dXJuIHRoaXM7XG59O1xuXG5cbi8qKlxuICogRXhwb3NlIGBSZXF1ZXN0YC5cbiAqL1xuXG5yZXF1ZXN0LlJlcXVlc3QgPSBSZXF1ZXN0O1xuXG4vKipcbiAqIEdFVCBgdXJsYCB3aXRoIG9wdGlvbmFsIGNhbGxiYWNrIGBmbihyZXMpYC5cbiAqXG4gKiBAcGFyYW0ge1N0cmluZ30gdXJsXG4gKiBAcGFyYW0ge01peGVkfEZ1bmN0aW9ufSBbZGF0YV0gb3IgZm5cbiAqIEBwYXJhbSB7RnVuY3Rpb259IFtmbl1cbiAqIEByZXR1cm4ge1JlcXVlc3R9XG4gKiBAYXBpIHB1YmxpY1xuICovXG5cbnJlcXVlc3QuZ2V0ID0gZnVuY3Rpb24odXJsLCBkYXRhLCBmbil7XG4gIHZhciByZXEgPSByZXF1ZXN0KCdHRVQnLCB1cmwpO1xuICBpZiAoJ2Z1bmN0aW9uJyA9PSB0eXBlb2YgZGF0YSkgZm4gPSBkYXRhLCBkYXRhID0gbnVsbDtcbiAgaWYgKGRhdGEpIHJlcS5xdWVyeShkYXRhKTtcbiAgaWYgKGZuKSByZXEuZW5kKGZuKTtcbiAgcmV0dXJuIHJlcTtcbn07XG5cbi8qKlxuICogSEVBRCBgdXJsYCB3aXRoIG9wdGlvbmFsIGNhbGxiYWNrIGBmbihyZXMpYC5cbiAqXG4gKiBAcGFyYW0ge1N0cmluZ30gdXJsXG4gKiBAcGFyYW0ge01peGVkfEZ1bmN0aW9ufSBbZGF0YV0gb3IgZm5cbiAqIEBwYXJhbSB7RnVuY3Rpb259IFtmbl1cbiAqIEByZXR1cm4ge1JlcXVlc3R9XG4gKiBAYXBpIHB1YmxpY1xuICovXG5cbnJlcXVlc3QuaGVhZCA9IGZ1bmN0aW9uKHVybCwgZGF0YSwgZm4pe1xuICB2YXIgcmVxID0gcmVxdWVzdCgnSEVBRCcsIHVybCk7XG4gIGlmICgnZnVuY3Rpb24nID09IHR5cGVvZiBkYXRhKSBmbiA9IGRhdGEsIGRhdGEgPSBudWxsO1xuICBpZiAoZGF0YSkgcmVxLnNlbmQoZGF0YSk7XG4gIGlmIChmbikgcmVxLmVuZChmbik7XG4gIHJldHVybiByZXE7XG59O1xuXG4vKipcbiAqIE9QVElPTlMgcXVlcnkgdG8gYHVybGAgd2l0aCBvcHRpb25hbCBjYWxsYmFjayBgZm4ocmVzKWAuXG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IHVybFxuICogQHBhcmFtIHtNaXhlZHxGdW5jdGlvbn0gW2RhdGFdIG9yIGZuXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBbZm5dXG4gKiBAcmV0dXJuIHtSZXF1ZXN0fVxuICogQGFwaSBwdWJsaWNcbiAqL1xuXG5yZXF1ZXN0Lm9wdGlvbnMgPSBmdW5jdGlvbih1cmwsIGRhdGEsIGZuKXtcbiAgdmFyIHJlcSA9IHJlcXVlc3QoJ09QVElPTlMnLCB1cmwpO1xuICBpZiAoJ2Z1bmN0aW9uJyA9PSB0eXBlb2YgZGF0YSkgZm4gPSBkYXRhLCBkYXRhID0gbnVsbDtcbiAgaWYgKGRhdGEpIHJlcS5zZW5kKGRhdGEpO1xuICBpZiAoZm4pIHJlcS5lbmQoZm4pO1xuICByZXR1cm4gcmVxO1xufTtcblxuLyoqXG4gKiBERUxFVEUgYHVybGAgd2l0aCBvcHRpb25hbCBjYWxsYmFjayBgZm4ocmVzKWAuXG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IHVybFxuICogQHBhcmFtIHtGdW5jdGlvbn0gW2ZuXVxuICogQHJldHVybiB7UmVxdWVzdH1cbiAqIEBhcGkgcHVibGljXG4gKi9cblxuZnVuY3Rpb24gZGVsKHVybCwgZm4pe1xuICB2YXIgcmVxID0gcmVxdWVzdCgnREVMRVRFJywgdXJsKTtcbiAgaWYgKGZuKSByZXEuZW5kKGZuKTtcbiAgcmV0dXJuIHJlcTtcbn07XG5cbnJlcXVlc3RbJ2RlbCddID0gZGVsO1xucmVxdWVzdFsnZGVsZXRlJ10gPSBkZWw7XG5cbi8qKlxuICogUEFUQ0ggYHVybGAgd2l0aCBvcHRpb25hbCBgZGF0YWAgYW5kIGNhbGxiYWNrIGBmbihyZXMpYC5cbiAqXG4gKiBAcGFyYW0ge1N0cmluZ30gdXJsXG4gKiBAcGFyYW0ge01peGVkfSBbZGF0YV1cbiAqIEBwYXJhbSB7RnVuY3Rpb259IFtmbl1cbiAqIEByZXR1cm4ge1JlcXVlc3R9XG4gKiBAYXBpIHB1YmxpY1xuICovXG5cbnJlcXVlc3QucGF0Y2ggPSBmdW5jdGlvbih1cmwsIGRhdGEsIGZuKXtcbiAgdmFyIHJlcSA9IHJlcXVlc3QoJ1BBVENIJywgdXJsKTtcbiAgaWYgKCdmdW5jdGlvbicgPT0gdHlwZW9mIGRhdGEpIGZuID0gZGF0YSwgZGF0YSA9IG51bGw7XG4gIGlmIChkYXRhKSByZXEuc2VuZChkYXRhKTtcbiAgaWYgKGZuKSByZXEuZW5kKGZuKTtcbiAgcmV0dXJuIHJlcTtcbn07XG5cbi8qKlxuICogUE9TVCBgdXJsYCB3aXRoIG9wdGlvbmFsIGBkYXRhYCBhbmQgY2FsbGJhY2sgYGZuKHJlcylgLlxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfSB1cmxcbiAqIEBwYXJhbSB7TWl4ZWR9IFtkYXRhXVxuICogQHBhcmFtIHtGdW5jdGlvbn0gW2ZuXVxuICogQHJldHVybiB7UmVxdWVzdH1cbiAqIEBhcGkgcHVibGljXG4gKi9cblxucmVxdWVzdC5wb3N0ID0gZnVuY3Rpb24odXJsLCBkYXRhLCBmbil7XG4gIHZhciByZXEgPSByZXF1ZXN0KCdQT1NUJywgdXJsKTtcbiAgaWYgKCdmdW5jdGlvbicgPT0gdHlwZW9mIGRhdGEpIGZuID0gZGF0YSwgZGF0YSA9IG51bGw7XG4gIGlmIChkYXRhKSByZXEuc2VuZChkYXRhKTtcbiAgaWYgKGZuKSByZXEuZW5kKGZuKTtcbiAgcmV0dXJuIHJlcTtcbn07XG5cbi8qKlxuICogUFVUIGB1cmxgIHdpdGggb3B0aW9uYWwgYGRhdGFgIGFuZCBjYWxsYmFjayBgZm4ocmVzKWAuXG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IHVybFxuICogQHBhcmFtIHtNaXhlZHxGdW5jdGlvbn0gW2RhdGFdIG9yIGZuXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBbZm5dXG4gKiBAcmV0dXJuIHtSZXF1ZXN0fVxuICogQGFwaSBwdWJsaWNcbiAqL1xuXG5yZXF1ZXN0LnB1dCA9IGZ1bmN0aW9uKHVybCwgZGF0YSwgZm4pe1xuICB2YXIgcmVxID0gcmVxdWVzdCgnUFVUJywgdXJsKTtcbiAgaWYgKCdmdW5jdGlvbicgPT0gdHlwZW9mIGRhdGEpIGZuID0gZGF0YSwgZGF0YSA9IG51bGw7XG4gIGlmIChkYXRhKSByZXEuc2VuZChkYXRhKTtcbiAgaWYgKGZuKSByZXEuZW5kKGZuKTtcbiAgcmV0dXJuIHJlcTtcbn07XG5cblxuXG4vKioqKioqKioqKioqKioqKipcbiAqKiBXRUJQQUNLIEZPT1RFUlxuICoqIC4vfi9zdXBlcmFnZW50L2xpYi9jbGllbnQuanNcbiAqKiBtb2R1bGUgaWQgPSAxMVxuICoqIG1vZHVsZSBjaHVua3MgPSAwXG4gKiovIiwiXHJcbi8qKlxyXG4gKiBFeHBvc2UgYEVtaXR0ZXJgLlxyXG4gKi9cclxuXHJcbmlmICh0eXBlb2YgbW9kdWxlICE9PSAndW5kZWZpbmVkJykge1xyXG4gIG1vZHVsZS5leHBvcnRzID0gRW1pdHRlcjtcclxufVxyXG5cclxuLyoqXHJcbiAqIEluaXRpYWxpemUgYSBuZXcgYEVtaXR0ZXJgLlxyXG4gKlxyXG4gKiBAYXBpIHB1YmxpY1xyXG4gKi9cclxuXHJcbmZ1bmN0aW9uIEVtaXR0ZXIob2JqKSB7XHJcbiAgaWYgKG9iaikgcmV0dXJuIG1peGluKG9iaik7XHJcbn07XHJcblxyXG4vKipcclxuICogTWl4aW4gdGhlIGVtaXR0ZXIgcHJvcGVydGllcy5cclxuICpcclxuICogQHBhcmFtIHtPYmplY3R9IG9ialxyXG4gKiBAcmV0dXJuIHtPYmplY3R9XHJcbiAqIEBhcGkgcHJpdmF0ZVxyXG4gKi9cclxuXHJcbmZ1bmN0aW9uIG1peGluKG9iaikge1xyXG4gIGZvciAodmFyIGtleSBpbiBFbWl0dGVyLnByb3RvdHlwZSkge1xyXG4gICAgb2JqW2tleV0gPSBFbWl0dGVyLnByb3RvdHlwZVtrZXldO1xyXG4gIH1cclxuICByZXR1cm4gb2JqO1xyXG59XHJcblxyXG4vKipcclxuICogTGlzdGVuIG9uIHRoZSBnaXZlbiBgZXZlbnRgIHdpdGggYGZuYC5cclxuICpcclxuICogQHBhcmFtIHtTdHJpbmd9IGV2ZW50XHJcbiAqIEBwYXJhbSB7RnVuY3Rpb259IGZuXHJcbiAqIEByZXR1cm4ge0VtaXR0ZXJ9XHJcbiAqIEBhcGkgcHVibGljXHJcbiAqL1xyXG5cclxuRW1pdHRlci5wcm90b3R5cGUub24gPVxyXG5FbWl0dGVyLnByb3RvdHlwZS5hZGRFdmVudExpc3RlbmVyID0gZnVuY3Rpb24oZXZlbnQsIGZuKXtcclxuICB0aGlzLl9jYWxsYmFja3MgPSB0aGlzLl9jYWxsYmFja3MgfHwge307XHJcbiAgKHRoaXMuX2NhbGxiYWNrc1snJCcgKyBldmVudF0gPSB0aGlzLl9jYWxsYmFja3NbJyQnICsgZXZlbnRdIHx8IFtdKVxyXG4gICAgLnB1c2goZm4pO1xyXG4gIHJldHVybiB0aGlzO1xyXG59O1xyXG5cclxuLyoqXHJcbiAqIEFkZHMgYW4gYGV2ZW50YCBsaXN0ZW5lciB0aGF0IHdpbGwgYmUgaW52b2tlZCBhIHNpbmdsZVxyXG4gKiB0aW1lIHRoZW4gYXV0b21hdGljYWxseSByZW1vdmVkLlxyXG4gKlxyXG4gKiBAcGFyYW0ge1N0cmluZ30gZXZlbnRcclxuICogQHBhcmFtIHtGdW5jdGlvbn0gZm5cclxuICogQHJldHVybiB7RW1pdHRlcn1cclxuICogQGFwaSBwdWJsaWNcclxuICovXHJcblxyXG5FbWl0dGVyLnByb3RvdHlwZS5vbmNlID0gZnVuY3Rpb24oZXZlbnQsIGZuKXtcclxuICBmdW5jdGlvbiBvbigpIHtcclxuICAgIHRoaXMub2ZmKGV2ZW50LCBvbik7XHJcbiAgICBmbi5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xyXG4gIH1cclxuXHJcbiAgb24uZm4gPSBmbjtcclxuICB0aGlzLm9uKGV2ZW50LCBvbik7XHJcbiAgcmV0dXJuIHRoaXM7XHJcbn07XHJcblxyXG4vKipcclxuICogUmVtb3ZlIHRoZSBnaXZlbiBjYWxsYmFjayBmb3IgYGV2ZW50YCBvciBhbGxcclxuICogcmVnaXN0ZXJlZCBjYWxsYmFja3MuXHJcbiAqXHJcbiAqIEBwYXJhbSB7U3RyaW5nfSBldmVudFxyXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBmblxyXG4gKiBAcmV0dXJuIHtFbWl0dGVyfVxyXG4gKiBAYXBpIHB1YmxpY1xyXG4gKi9cclxuXHJcbkVtaXR0ZXIucHJvdG90eXBlLm9mZiA9XHJcbkVtaXR0ZXIucHJvdG90eXBlLnJlbW92ZUxpc3RlbmVyID1cclxuRW1pdHRlci5wcm90b3R5cGUucmVtb3ZlQWxsTGlzdGVuZXJzID1cclxuRW1pdHRlci5wcm90b3R5cGUucmVtb3ZlRXZlbnRMaXN0ZW5lciA9IGZ1bmN0aW9uKGV2ZW50LCBmbil7XHJcbiAgdGhpcy5fY2FsbGJhY2tzID0gdGhpcy5fY2FsbGJhY2tzIHx8IHt9O1xyXG5cclxuICAvLyBhbGxcclxuICBpZiAoMCA9PSBhcmd1bWVudHMubGVuZ3RoKSB7XHJcbiAgICB0aGlzLl9jYWxsYmFja3MgPSB7fTtcclxuICAgIHJldHVybiB0aGlzO1xyXG4gIH1cclxuXHJcbiAgLy8gc3BlY2lmaWMgZXZlbnRcclxuICB2YXIgY2FsbGJhY2tzID0gdGhpcy5fY2FsbGJhY2tzWyckJyArIGV2ZW50XTtcclxuICBpZiAoIWNhbGxiYWNrcykgcmV0dXJuIHRoaXM7XHJcblxyXG4gIC8vIHJlbW92ZSBhbGwgaGFuZGxlcnNcclxuICBpZiAoMSA9PSBhcmd1bWVudHMubGVuZ3RoKSB7XHJcbiAgICBkZWxldGUgdGhpcy5fY2FsbGJhY2tzWyckJyArIGV2ZW50XTtcclxuICAgIHJldHVybiB0aGlzO1xyXG4gIH1cclxuXHJcbiAgLy8gcmVtb3ZlIHNwZWNpZmljIGhhbmRsZXJcclxuICB2YXIgY2I7XHJcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBjYWxsYmFja3MubGVuZ3RoOyBpKyspIHtcclxuICAgIGNiID0gY2FsbGJhY2tzW2ldO1xyXG4gICAgaWYgKGNiID09PSBmbiB8fCBjYi5mbiA9PT0gZm4pIHtcclxuICAgICAgY2FsbGJhY2tzLnNwbGljZShpLCAxKTtcclxuICAgICAgYnJlYWs7XHJcbiAgICB9XHJcbiAgfVxyXG4gIHJldHVybiB0aGlzO1xyXG59O1xyXG5cclxuLyoqXHJcbiAqIEVtaXQgYGV2ZW50YCB3aXRoIHRoZSBnaXZlbiBhcmdzLlxyXG4gKlxyXG4gKiBAcGFyYW0ge1N0cmluZ30gZXZlbnRcclxuICogQHBhcmFtIHtNaXhlZH0gLi4uXHJcbiAqIEByZXR1cm4ge0VtaXR0ZXJ9XHJcbiAqL1xyXG5cclxuRW1pdHRlci5wcm90b3R5cGUuZW1pdCA9IGZ1bmN0aW9uKGV2ZW50KXtcclxuICB0aGlzLl9jYWxsYmFja3MgPSB0aGlzLl9jYWxsYmFja3MgfHwge307XHJcbiAgdmFyIGFyZ3MgPSBbXS5zbGljZS5jYWxsKGFyZ3VtZW50cywgMSlcclxuICAgICwgY2FsbGJhY2tzID0gdGhpcy5fY2FsbGJhY2tzWyckJyArIGV2ZW50XTtcclxuXHJcbiAgaWYgKGNhbGxiYWNrcykge1xyXG4gICAgY2FsbGJhY2tzID0gY2FsbGJhY2tzLnNsaWNlKDApO1xyXG4gICAgZm9yICh2YXIgaSA9IDAsIGxlbiA9IGNhbGxiYWNrcy5sZW5ndGg7IGkgPCBsZW47ICsraSkge1xyXG4gICAgICBjYWxsYmFja3NbaV0uYXBwbHkodGhpcywgYXJncyk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICByZXR1cm4gdGhpcztcclxufTtcclxuXHJcbi8qKlxyXG4gKiBSZXR1cm4gYXJyYXkgb2YgY2FsbGJhY2tzIGZvciBgZXZlbnRgLlxyXG4gKlxyXG4gKiBAcGFyYW0ge1N0cmluZ30gZXZlbnRcclxuICogQHJldHVybiB7QXJyYXl9XHJcbiAqIEBhcGkgcHVibGljXHJcbiAqL1xyXG5cclxuRW1pdHRlci5wcm90b3R5cGUubGlzdGVuZXJzID0gZnVuY3Rpb24oZXZlbnQpe1xyXG4gIHRoaXMuX2NhbGxiYWNrcyA9IHRoaXMuX2NhbGxiYWNrcyB8fCB7fTtcclxuICByZXR1cm4gdGhpcy5fY2FsbGJhY2tzWyckJyArIGV2ZW50XSB8fCBbXTtcclxufTtcclxuXHJcbi8qKlxyXG4gKiBDaGVjayBpZiB0aGlzIGVtaXR0ZXIgaGFzIGBldmVudGAgaGFuZGxlcnMuXHJcbiAqXHJcbiAqIEBwYXJhbSB7U3RyaW5nfSBldmVudFxyXG4gKiBAcmV0dXJuIHtCb29sZWFufVxyXG4gKiBAYXBpIHB1YmxpY1xyXG4gKi9cclxuXHJcbkVtaXR0ZXIucHJvdG90eXBlLmhhc0xpc3RlbmVycyA9IGZ1bmN0aW9uKGV2ZW50KXtcclxuICByZXR1cm4gISEgdGhpcy5saXN0ZW5lcnMoZXZlbnQpLmxlbmd0aDtcclxufTtcclxuXG5cblxuLyoqKioqKioqKioqKioqKioqXG4gKiogV0VCUEFDSyBGT09URVJcbiAqKiAuL34vY29tcG9uZW50LWVtaXR0ZXIvaW5kZXguanNcbiAqKiBtb2R1bGUgaWQgPSAxMlxuICoqIG1vZHVsZSBjaHVua3MgPSAwXG4gKiovIiwiLyoqXG4gKiBNb2R1bGUgb2YgbWl4ZWQtaW4gZnVuY3Rpb25zIHNoYXJlZCBiZXR3ZWVuIG5vZGUgYW5kIGNsaWVudCBjb2RlXG4gKi9cbnZhciBpc09iamVjdCA9IHJlcXVpcmUoJy4vaXMtb2JqZWN0Jyk7XG5cbi8qKlxuICogQ2xlYXIgcHJldmlvdXMgdGltZW91dC5cbiAqXG4gKiBAcmV0dXJuIHtSZXF1ZXN0fSBmb3IgY2hhaW5pbmdcbiAqIEBhcGkgcHVibGljXG4gKi9cblxuZXhwb3J0cy5jbGVhclRpbWVvdXQgPSBmdW5jdGlvbiBfY2xlYXJUaW1lb3V0KCl7XG4gIHRoaXMuX3RpbWVvdXQgPSAwO1xuICBjbGVhclRpbWVvdXQodGhpcy5fdGltZXIpO1xuICByZXR1cm4gdGhpcztcbn07XG5cbi8qKlxuICogT3ZlcnJpZGUgZGVmYXVsdCByZXNwb25zZSBib2R5IHBhcnNlclxuICpcbiAqIFRoaXMgZnVuY3Rpb24gd2lsbCBiZSBjYWxsZWQgdG8gY29udmVydCBpbmNvbWluZyBkYXRhIGludG8gcmVxdWVzdC5ib2R5XG4gKlxuICogQHBhcmFtIHtGdW5jdGlvbn1cbiAqIEBhcGkgcHVibGljXG4gKi9cblxuZXhwb3J0cy5wYXJzZSA9IGZ1bmN0aW9uIHBhcnNlKGZuKXtcbiAgdGhpcy5fcGFyc2VyID0gZm47XG4gIHJldHVybiB0aGlzO1xufTtcblxuLyoqXG4gKiBPdmVycmlkZSBkZWZhdWx0IHJlcXVlc3QgYm9keSBzZXJpYWxpemVyXG4gKlxuICogVGhpcyBmdW5jdGlvbiB3aWxsIGJlIGNhbGxlZCB0byBjb252ZXJ0IGRhdGEgc2V0IHZpYSAuc2VuZCBvciAuYXR0YWNoIGludG8gcGF5bG9hZCB0byBzZW5kXG4gKlxuICogQHBhcmFtIHtGdW5jdGlvbn1cbiAqIEBhcGkgcHVibGljXG4gKi9cblxuZXhwb3J0cy5zZXJpYWxpemUgPSBmdW5jdGlvbiBzZXJpYWxpemUoZm4pe1xuICB0aGlzLl9zZXJpYWxpemVyID0gZm47XG4gIHJldHVybiB0aGlzO1xufTtcblxuLyoqXG4gKiBTZXQgdGltZW91dCB0byBgbXNgLlxuICpcbiAqIEBwYXJhbSB7TnVtYmVyfSBtc1xuICogQHJldHVybiB7UmVxdWVzdH0gZm9yIGNoYWluaW5nXG4gKiBAYXBpIHB1YmxpY1xuICovXG5cbmV4cG9ydHMudGltZW91dCA9IGZ1bmN0aW9uIHRpbWVvdXQobXMpe1xuICB0aGlzLl90aW1lb3V0ID0gbXM7XG4gIHJldHVybiB0aGlzO1xufTtcblxuLyoqXG4gKiBQcm9taXNlIHN1cHBvcnRcbiAqXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSByZXNvbHZlXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSByZWplY3RcbiAqIEByZXR1cm4ge1JlcXVlc3R9XG4gKi9cblxuZXhwb3J0cy50aGVuID0gZnVuY3Rpb24gdGhlbihyZXNvbHZlLCByZWplY3QpIHtcbiAgaWYgKCF0aGlzLl9mdWxsZmlsbGVkUHJvbWlzZSkge1xuICAgIHZhciBzZWxmID0gdGhpcztcbiAgICB0aGlzLl9mdWxsZmlsbGVkUHJvbWlzZSA9IG5ldyBQcm9taXNlKGZ1bmN0aW9uKGlubmVyUmVzb2x2ZSwgaW5uZXJSZWplY3Qpe1xuICAgICAgc2VsZi5lbmQoZnVuY3Rpb24oZXJyLCByZXMpe1xuICAgICAgICBpZiAoZXJyKSBpbm5lclJlamVjdChlcnIpOyBlbHNlIGlubmVyUmVzb2x2ZShyZXMpO1xuICAgICAgfSk7XG4gICAgfSk7XG4gIH1cbiAgcmV0dXJuIHRoaXMuX2Z1bGxmaWxsZWRQcm9taXNlLnRoZW4ocmVzb2x2ZSwgcmVqZWN0KTtcbn1cblxuZXhwb3J0cy5jYXRjaCA9IGZ1bmN0aW9uKGNiKSB7XG4gIHJldHVybiB0aGlzLnRoZW4odW5kZWZpbmVkLCBjYik7XG59O1xuXG4vKipcbiAqIEFsbG93IGZvciBleHRlbnNpb25cbiAqL1xuXG5leHBvcnRzLnVzZSA9IGZ1bmN0aW9uIHVzZShmbikge1xuICBmbih0aGlzKTtcbiAgcmV0dXJuIHRoaXM7XG59XG5cblxuLyoqXG4gKiBHZXQgcmVxdWVzdCBoZWFkZXIgYGZpZWxkYC5cbiAqIENhc2UtaW5zZW5zaXRpdmUuXG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IGZpZWxkXG4gKiBAcmV0dXJuIHtTdHJpbmd9XG4gKiBAYXBpIHB1YmxpY1xuICovXG5cbmV4cG9ydHMuZ2V0ID0gZnVuY3Rpb24oZmllbGQpe1xuICByZXR1cm4gdGhpcy5faGVhZGVyW2ZpZWxkLnRvTG93ZXJDYXNlKCldO1xufTtcblxuLyoqXG4gKiBHZXQgY2FzZS1pbnNlbnNpdGl2ZSBoZWFkZXIgYGZpZWxkYCB2YWx1ZS5cbiAqIFRoaXMgaXMgYSBkZXByZWNhdGVkIGludGVybmFsIEFQSS4gVXNlIGAuZ2V0KGZpZWxkKWAgaW5zdGVhZC5cbiAqXG4gKiAoZ2V0SGVhZGVyIGlzIG5vIGxvbmdlciB1c2VkIGludGVybmFsbHkgYnkgdGhlIHN1cGVyYWdlbnQgY29kZSBiYXNlKVxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfSBmaWVsZFxuICogQHJldHVybiB7U3RyaW5nfVxuICogQGFwaSBwcml2YXRlXG4gKiBAZGVwcmVjYXRlZFxuICovXG5cbmV4cG9ydHMuZ2V0SGVhZGVyID0gZXhwb3J0cy5nZXQ7XG5cbi8qKlxuICogU2V0IGhlYWRlciBgZmllbGRgIHRvIGB2YWxgLCBvciBtdWx0aXBsZSBmaWVsZHMgd2l0aCBvbmUgb2JqZWN0LlxuICogQ2FzZS1pbnNlbnNpdGl2ZS5cbiAqXG4gKiBFeGFtcGxlczpcbiAqXG4gKiAgICAgIHJlcS5nZXQoJy8nKVxuICogICAgICAgIC5zZXQoJ0FjY2VwdCcsICdhcHBsaWNhdGlvbi9qc29uJylcbiAqICAgICAgICAuc2V0KCdYLUFQSS1LZXknLCAnZm9vYmFyJylcbiAqICAgICAgICAuZW5kKGNhbGxiYWNrKTtcbiAqXG4gKiAgICAgIHJlcS5nZXQoJy8nKVxuICogICAgICAgIC5zZXQoeyBBY2NlcHQ6ICdhcHBsaWNhdGlvbi9qc29uJywgJ1gtQVBJLUtleSc6ICdmb29iYXInIH0pXG4gKiAgICAgICAgLmVuZChjYWxsYmFjayk7XG4gKlxuICogQHBhcmFtIHtTdHJpbmd8T2JqZWN0fSBmaWVsZFxuICogQHBhcmFtIHtTdHJpbmd9IHZhbFxuICogQHJldHVybiB7UmVxdWVzdH0gZm9yIGNoYWluaW5nXG4gKiBAYXBpIHB1YmxpY1xuICovXG5cbmV4cG9ydHMuc2V0ID0gZnVuY3Rpb24oZmllbGQsIHZhbCl7XG4gIGlmIChpc09iamVjdChmaWVsZCkpIHtcbiAgICBmb3IgKHZhciBrZXkgaW4gZmllbGQpIHtcbiAgICAgIHRoaXMuc2V0KGtleSwgZmllbGRba2V5XSk7XG4gICAgfVxuICAgIHJldHVybiB0aGlzO1xuICB9XG4gIHRoaXMuX2hlYWRlcltmaWVsZC50b0xvd2VyQ2FzZSgpXSA9IHZhbDtcbiAgdGhpcy5oZWFkZXJbZmllbGRdID0gdmFsO1xuICByZXR1cm4gdGhpcztcbn07XG5cbi8qKlxuICogUmVtb3ZlIGhlYWRlciBgZmllbGRgLlxuICogQ2FzZS1pbnNlbnNpdGl2ZS5cbiAqXG4gKiBFeGFtcGxlOlxuICpcbiAqICAgICAgcmVxLmdldCgnLycpXG4gKiAgICAgICAgLnVuc2V0KCdVc2VyLUFnZW50JylcbiAqICAgICAgICAuZW5kKGNhbGxiYWNrKTtcbiAqXG4gKiBAcGFyYW0ge1N0cmluZ30gZmllbGRcbiAqL1xuZXhwb3J0cy51bnNldCA9IGZ1bmN0aW9uKGZpZWxkKXtcbiAgZGVsZXRlIHRoaXMuX2hlYWRlcltmaWVsZC50b0xvd2VyQ2FzZSgpXTtcbiAgZGVsZXRlIHRoaXMuaGVhZGVyW2ZpZWxkXTtcbiAgcmV0dXJuIHRoaXM7XG59O1xuXG4vKipcbiAqIFdyaXRlIHRoZSBmaWVsZCBgbmFtZWAgYW5kIGB2YWxgLCBvciBtdWx0aXBsZSBmaWVsZHMgd2l0aCBvbmUgb2JqZWN0XG4gKiBmb3IgXCJtdWx0aXBhcnQvZm9ybS1kYXRhXCIgcmVxdWVzdCBib2RpZXMuXG4gKlxuICogYGBgIGpzXG4gKiByZXF1ZXN0LnBvc3QoJy91cGxvYWQnKVxuICogICAuZmllbGQoJ2ZvbycsICdiYXInKVxuICogICAuZW5kKGNhbGxiYWNrKTtcbiAqXG4gKiByZXF1ZXN0LnBvc3QoJy91cGxvYWQnKVxuICogICAuZmllbGQoeyBmb286ICdiYXInLCBiYXo6ICdxdXgnIH0pXG4gKiAgIC5lbmQoY2FsbGJhY2spO1xuICogYGBgXG4gKlxuICogQHBhcmFtIHtTdHJpbmd8T2JqZWN0fSBuYW1lXG4gKiBAcGFyYW0ge1N0cmluZ3xCbG9ifEZpbGV8QnVmZmVyfGZzLlJlYWRTdHJlYW19IHZhbFxuICogQHJldHVybiB7UmVxdWVzdH0gZm9yIGNoYWluaW5nXG4gKiBAYXBpIHB1YmxpY1xuICovXG5leHBvcnRzLmZpZWxkID0gZnVuY3Rpb24obmFtZSwgdmFsKSB7XG5cbiAgLy8gbmFtZSBzaG91bGQgYmUgZWl0aGVyIGEgc3RyaW5nIG9yIGFuIG9iamVjdC5cbiAgaWYgKG51bGwgPT09IG5hbWUgfHwgIHVuZGVmaW5lZCA9PT0gbmFtZSkge1xuICAgIHRocm93IG5ldyBFcnJvcignLmZpZWxkKG5hbWUsIHZhbCkgbmFtZSBjYW4gbm90IGJlIGVtcHR5Jyk7XG4gIH1cblxuICBpZiAoaXNPYmplY3QobmFtZSkpIHtcbiAgICBmb3IgKHZhciBrZXkgaW4gbmFtZSkge1xuICAgICAgdGhpcy5maWVsZChrZXksIG5hbWVba2V5XSk7XG4gICAgfVxuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgLy8gdmFsIHNob3VsZCBiZSBkZWZpbmVkIG5vd1xuICBpZiAobnVsbCA9PT0gdmFsIHx8IHVuZGVmaW5lZCA9PT0gdmFsKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCcuZmllbGQobmFtZSwgdmFsKSB2YWwgY2FuIG5vdCBiZSBlbXB0eScpO1xuICB9XG4gIHRoaXMuX2dldEZvcm1EYXRhKCkuYXBwZW5kKG5hbWUsIHZhbCk7XG4gIHJldHVybiB0aGlzO1xufTtcblxuLyoqXG4gKiBBYm9ydCB0aGUgcmVxdWVzdCwgYW5kIGNsZWFyIHBvdGVudGlhbCB0aW1lb3V0LlxuICpcbiAqIEByZXR1cm4ge1JlcXVlc3R9XG4gKiBAYXBpIHB1YmxpY1xuICovXG5leHBvcnRzLmFib3J0ID0gZnVuY3Rpb24oKXtcbiAgaWYgKHRoaXMuX2Fib3J0ZWQpIHtcbiAgICByZXR1cm4gdGhpcztcbiAgfVxuICB0aGlzLl9hYm9ydGVkID0gdHJ1ZTtcbiAgdGhpcy54aHIgJiYgdGhpcy54aHIuYWJvcnQoKTsgLy8gYnJvd3NlclxuICB0aGlzLnJlcSAmJiB0aGlzLnJlcS5hYm9ydCgpOyAvLyBub2RlXG4gIHRoaXMuY2xlYXJUaW1lb3V0KCk7XG4gIHRoaXMuZW1pdCgnYWJvcnQnKTtcbiAgcmV0dXJuIHRoaXM7XG59O1xuXG4vKipcbiAqIEVuYWJsZSB0cmFuc21pc3Npb24gb2YgY29va2llcyB3aXRoIHgtZG9tYWluIHJlcXVlc3RzLlxuICpcbiAqIE5vdGUgdGhhdCBmb3IgdGhpcyB0byB3b3JrIHRoZSBvcmlnaW4gbXVzdCBub3QgYmVcbiAqIHVzaW5nIFwiQWNjZXNzLUNvbnRyb2wtQWxsb3ctT3JpZ2luXCIgd2l0aCBhIHdpbGRjYXJkLFxuICogYW5kIGFsc28gbXVzdCBzZXQgXCJBY2Nlc3MtQ29udHJvbC1BbGxvdy1DcmVkZW50aWFsc1wiXG4gKiB0byBcInRydWVcIi5cbiAqXG4gKiBAYXBpIHB1YmxpY1xuICovXG5cbmV4cG9ydHMud2l0aENyZWRlbnRpYWxzID0gZnVuY3Rpb24oKXtcbiAgLy8gVGhpcyBpcyBicm93c2VyLW9ubHkgZnVuY3Rpb25hbGl0eS4gTm9kZSBzaWRlIGlzIG5vLW9wLlxuICB0aGlzLl93aXRoQ3JlZGVudGlhbHMgPSB0cnVlO1xuICByZXR1cm4gdGhpcztcbn07XG5cbi8qKlxuICogU2V0IHRoZSBtYXggcmVkaXJlY3RzIHRvIGBuYC4gRG9lcyBub3RpbmcgaW4gYnJvd3NlciBYSFIgaW1wbGVtZW50YXRpb24uXG4gKlxuICogQHBhcmFtIHtOdW1iZXJ9IG5cbiAqIEByZXR1cm4ge1JlcXVlc3R9IGZvciBjaGFpbmluZ1xuICogQGFwaSBwdWJsaWNcbiAqL1xuXG5leHBvcnRzLnJlZGlyZWN0cyA9IGZ1bmN0aW9uKG4pe1xuICB0aGlzLl9tYXhSZWRpcmVjdHMgPSBuO1xuICByZXR1cm4gdGhpcztcbn07XG5cbi8qKlxuICogQ29udmVydCB0byBhIHBsYWluIGphdmFzY3JpcHQgb2JqZWN0IChub3QgSlNPTiBzdHJpbmcpIG9mIHNjYWxhciBwcm9wZXJ0aWVzLlxuICogTm90ZSBhcyB0aGlzIG1ldGhvZCBpcyBkZXNpZ25lZCB0byByZXR1cm4gYSB1c2VmdWwgbm9uLXRoaXMgdmFsdWUsXG4gKiBpdCBjYW5ub3QgYmUgY2hhaW5lZC5cbiAqXG4gKiBAcmV0dXJuIHtPYmplY3R9IGRlc2NyaWJpbmcgbWV0aG9kLCB1cmwsIGFuZCBkYXRhIG9mIHRoaXMgcmVxdWVzdFxuICogQGFwaSBwdWJsaWNcbiAqL1xuXG5leHBvcnRzLnRvSlNPTiA9IGZ1bmN0aW9uKCl7XG4gIHJldHVybiB7XG4gICAgbWV0aG9kOiB0aGlzLm1ldGhvZCxcbiAgICB1cmw6IHRoaXMudXJsLFxuICAgIGRhdGE6IHRoaXMuX2RhdGEsXG4gICAgaGVhZGVyczogdGhpcy5faGVhZGVyXG4gIH07XG59O1xuXG4vKipcbiAqIENoZWNrIGlmIGBvYmpgIGlzIGEgaG9zdCBvYmplY3QsXG4gKiB3ZSBkb24ndCB3YW50IHRvIHNlcmlhbGl6ZSB0aGVzZSA6KVxuICpcbiAqIFRPRE86IGZ1dHVyZSBwcm9vZiwgbW92ZSB0byBjb21wb2VudCBsYW5kXG4gKlxuICogQHBhcmFtIHtPYmplY3R9IG9ialxuICogQHJldHVybiB7Qm9vbGVhbn1cbiAqIEBhcGkgcHJpdmF0ZVxuICovXG5cbmV4cG9ydHMuX2lzSG9zdCA9IGZ1bmN0aW9uIF9pc0hvc3Qob2JqKSB7XG4gIHZhciBzdHIgPSB7fS50b1N0cmluZy5jYWxsKG9iaik7XG5cbiAgc3dpdGNoIChzdHIpIHtcbiAgICBjYXNlICdbb2JqZWN0IEZpbGVdJzpcbiAgICBjYXNlICdbb2JqZWN0IEJsb2JdJzpcbiAgICBjYXNlICdbb2JqZWN0IEZvcm1EYXRhXSc6XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICBkZWZhdWx0OlxuICAgICAgcmV0dXJuIGZhbHNlO1xuICB9XG59XG5cbi8qKlxuICogU2VuZCBgZGF0YWAgYXMgdGhlIHJlcXVlc3QgYm9keSwgZGVmYXVsdGluZyB0aGUgYC50eXBlKClgIHRvIFwianNvblwiIHdoZW5cbiAqIGFuIG9iamVjdCBpcyBnaXZlbi5cbiAqXG4gKiBFeGFtcGxlczpcbiAqXG4gKiAgICAgICAvLyBtYW51YWwganNvblxuICogICAgICAgcmVxdWVzdC5wb3N0KCcvdXNlcicpXG4gKiAgICAgICAgIC50eXBlKCdqc29uJylcbiAqICAgICAgICAgLnNlbmQoJ3tcIm5hbWVcIjpcInRqXCJ9JylcbiAqICAgICAgICAgLmVuZChjYWxsYmFjaylcbiAqXG4gKiAgICAgICAvLyBhdXRvIGpzb25cbiAqICAgICAgIHJlcXVlc3QucG9zdCgnL3VzZXInKVxuICogICAgICAgICAuc2VuZCh7IG5hbWU6ICd0aicgfSlcbiAqICAgICAgICAgLmVuZChjYWxsYmFjaylcbiAqXG4gKiAgICAgICAvLyBtYW51YWwgeC13d3ctZm9ybS11cmxlbmNvZGVkXG4gKiAgICAgICByZXF1ZXN0LnBvc3QoJy91c2VyJylcbiAqICAgICAgICAgLnR5cGUoJ2Zvcm0nKVxuICogICAgICAgICAuc2VuZCgnbmFtZT10aicpXG4gKiAgICAgICAgIC5lbmQoY2FsbGJhY2spXG4gKlxuICogICAgICAgLy8gYXV0byB4LXd3dy1mb3JtLXVybGVuY29kZWRcbiAqICAgICAgIHJlcXVlc3QucG9zdCgnL3VzZXInKVxuICogICAgICAgICAudHlwZSgnZm9ybScpXG4gKiAgICAgICAgIC5zZW5kKHsgbmFtZTogJ3RqJyB9KVxuICogICAgICAgICAuZW5kKGNhbGxiYWNrKVxuICpcbiAqICAgICAgIC8vIGRlZmF1bHRzIHRvIHgtd3d3LWZvcm0tdXJsZW5jb2RlZFxuICogICAgICByZXF1ZXN0LnBvc3QoJy91c2VyJylcbiAqICAgICAgICAuc2VuZCgnbmFtZT10b2JpJylcbiAqICAgICAgICAuc2VuZCgnc3BlY2llcz1mZXJyZXQnKVxuICogICAgICAgIC5lbmQoY2FsbGJhY2spXG4gKlxuICogQHBhcmFtIHtTdHJpbmd8T2JqZWN0fSBkYXRhXG4gKiBAcmV0dXJuIHtSZXF1ZXN0fSBmb3IgY2hhaW5pbmdcbiAqIEBhcGkgcHVibGljXG4gKi9cblxuZXhwb3J0cy5zZW5kID0gZnVuY3Rpb24oZGF0YSl7XG4gIHZhciBvYmogPSBpc09iamVjdChkYXRhKTtcbiAgdmFyIHR5cGUgPSB0aGlzLl9oZWFkZXJbJ2NvbnRlbnQtdHlwZSddO1xuXG4gIC8vIG1lcmdlXG4gIGlmIChvYmogJiYgaXNPYmplY3QodGhpcy5fZGF0YSkpIHtcbiAgICBmb3IgKHZhciBrZXkgaW4gZGF0YSkge1xuICAgICAgdGhpcy5fZGF0YVtrZXldID0gZGF0YVtrZXldO1xuICAgIH1cbiAgfSBlbHNlIGlmICgnc3RyaW5nJyA9PSB0eXBlb2YgZGF0YSkge1xuICAgIC8vIGRlZmF1bHQgdG8geC13d3ctZm9ybS11cmxlbmNvZGVkXG4gICAgaWYgKCF0eXBlKSB0aGlzLnR5cGUoJ2Zvcm0nKTtcbiAgICB0eXBlID0gdGhpcy5faGVhZGVyWydjb250ZW50LXR5cGUnXTtcbiAgICBpZiAoJ2FwcGxpY2F0aW9uL3gtd3d3LWZvcm0tdXJsZW5jb2RlZCcgPT0gdHlwZSkge1xuICAgICAgdGhpcy5fZGF0YSA9IHRoaXMuX2RhdGFcbiAgICAgICAgPyB0aGlzLl9kYXRhICsgJyYnICsgZGF0YVxuICAgICAgICA6IGRhdGE7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuX2RhdGEgPSAodGhpcy5fZGF0YSB8fCAnJykgKyBkYXRhO1xuICAgIH1cbiAgfSBlbHNlIHtcbiAgICB0aGlzLl9kYXRhID0gZGF0YTtcbiAgfVxuXG4gIGlmICghb2JqIHx8IHRoaXMuX2lzSG9zdChkYXRhKSkgcmV0dXJuIHRoaXM7XG5cbiAgLy8gZGVmYXVsdCB0byBqc29uXG4gIGlmICghdHlwZSkgdGhpcy50eXBlKCdqc29uJyk7XG4gIHJldHVybiB0aGlzO1xufTtcblxuXG5cbi8qKioqKioqKioqKioqKioqKlxuICoqIFdFQlBBQ0sgRk9PVEVSXG4gKiogLi9+L3N1cGVyYWdlbnQvbGliL3JlcXVlc3QtYmFzZS5qc1xuICoqIG1vZHVsZSBpZCA9IDEzXG4gKiogbW9kdWxlIGNodW5rcyA9IDBcbiAqKi8iLCIvKipcbiAqIENoZWNrIGlmIGBvYmpgIGlzIGFuIG9iamVjdC5cbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gb2JqXG4gKiBAcmV0dXJuIHtCb29sZWFufVxuICogQGFwaSBwcml2YXRlXG4gKi9cblxuZnVuY3Rpb24gaXNPYmplY3Qob2JqKSB7XG4gIHJldHVybiBudWxsICE9PSBvYmogJiYgJ29iamVjdCcgPT09IHR5cGVvZiBvYmo7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gaXNPYmplY3Q7XG5cblxuXG4vKioqKioqKioqKioqKioqKipcbiAqKiBXRUJQQUNLIEZPT1RFUlxuICoqIC4vfi9zdXBlcmFnZW50L2xpYi9pcy1vYmplY3QuanNcbiAqKiBtb2R1bGUgaWQgPSAxNFxuICoqIG1vZHVsZSBjaHVua3MgPSAwXG4gKiovIiwiLy8gVGhlIG5vZGUgYW5kIGJyb3dzZXIgbW9kdWxlcyBleHBvc2UgdmVyc2lvbnMgb2YgdGhpcyB3aXRoIHRoZVxuLy8gYXBwcm9wcmlhdGUgY29uc3RydWN0b3IgZnVuY3Rpb24gYm91bmQgYXMgZmlyc3QgYXJndW1lbnRcbi8qKlxuICogSXNzdWUgYSByZXF1ZXN0OlxuICpcbiAqIEV4YW1wbGVzOlxuICpcbiAqICAgIHJlcXVlc3QoJ0dFVCcsICcvdXNlcnMnKS5lbmQoY2FsbGJhY2spXG4gKiAgICByZXF1ZXN0KCcvdXNlcnMnKS5lbmQoY2FsbGJhY2spXG4gKiAgICByZXF1ZXN0KCcvdXNlcnMnLCBjYWxsYmFjaylcbiAqXG4gKiBAcGFyYW0ge1N0cmluZ30gbWV0aG9kXG4gKiBAcGFyYW0ge1N0cmluZ3xGdW5jdGlvbn0gdXJsIG9yIGNhbGxiYWNrXG4gKiBAcmV0dXJuIHtSZXF1ZXN0fVxuICogQGFwaSBwdWJsaWNcbiAqL1xuXG5mdW5jdGlvbiByZXF1ZXN0KFJlcXVlc3RDb25zdHJ1Y3RvciwgbWV0aG9kLCB1cmwpIHtcbiAgLy8gY2FsbGJhY2tcbiAgaWYgKCdmdW5jdGlvbicgPT0gdHlwZW9mIHVybCkge1xuICAgIHJldHVybiBuZXcgUmVxdWVzdENvbnN0cnVjdG9yKCdHRVQnLCBtZXRob2QpLmVuZCh1cmwpO1xuICB9XG5cbiAgLy8gdXJsIGZpcnN0XG4gIGlmICgyID09IGFyZ3VtZW50cy5sZW5ndGgpIHtcbiAgICByZXR1cm4gbmV3IFJlcXVlc3RDb25zdHJ1Y3RvcignR0VUJywgbWV0aG9kKTtcbiAgfVxuXG4gIHJldHVybiBuZXcgUmVxdWVzdENvbnN0cnVjdG9yKG1ldGhvZCwgdXJsKTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSByZXF1ZXN0O1xuXG5cblxuLyoqKioqKioqKioqKioqKioqXG4gKiogV0VCUEFDSyBGT09URVJcbiAqKiAuL34vc3VwZXJhZ2VudC9saWIvcmVxdWVzdC5qc1xuICoqIG1vZHVsZSBpZCA9IDE1XG4gKiogbW9kdWxlIGNodW5rcyA9IDBcbiAqKi8iLCJcbnJpb3QudGFnMignY3VyZmV3JywgJzxkaXYgaWY9XCJ7aXNTUH1cIiBpZD1cImN1cmZld1wiIGNsYXNzPVwiY3VyZmV3XCI+6ZaA6ZmQ44KS56K66KqN44GX44G+44GX44Gf44GL77yfIDxkaXYgY2xhc3M9XCJoZWFkZXJcIj4gPGRpdiBjbGFzcz1cImxlZnRcIj48c3BhbiBjbGFzcz1cImlvbi1pb3MtYXJyb3ctYmFjayBpY29uXCI+PC9zcGFuPuW3puOCueODr+OCpOODl++8mueiuuiqjTwvZGl2PiA8ZGl2IGNsYXNzPVwicmlnaHRcIj7lj7Pjgrnjg6/jgqTjg5fvvJroqK3lrpo8c3BhbiBjbGFzcz1cImlvbi1pb3MtYXJyb3ctZm9yd2FyZCBpY29uXCI+PC9zcGFuPjwvZGl2PiA8L2Rpdj4gPGRpdiBjbGFzcz1cImZvb3RlclwiPiA8ZGl2IGNsYXNzPVwiY2VudGVyXCI+PHNwYW4gY2xhc3M9XCJpb24taW9zLWNpcmNsZS1maWxsZWQgaWNvblwiPjwvc3Bhbj7jgr/jg4Pjg5fvvJrlho3ooajnpLo8L2Rpdj4gPC9kaXY+IDwvZGl2PicsICdjdXJmZXcgLmN1cmZldyxbcmlvdC10YWc9XCJjdXJmZXdcIl0gLmN1cmZldyxbZGF0YS1pcz1cImN1cmZld1wiXSAuY3VyZmV3eyBwb3NpdGlvbjogYWJzb2x1dGU7IHRvcDogMDsgbGVmdDogMDsgZGlzcGxheTogLXdlYmtpdC1pbmxpbmUtZmxleDsgZGlzcGxheTogLW1vei1pbmxpbmUtZmxleDsgZGlzcGxheTogLW1zLWlubGluZS1mbGV4OyBkaXNwbGF5OiAtby1pbmxpbmUtZmxleDsgZGlzcGxheTogaW5saW5lLWZsZXg7IGFsaWduLWl0ZW1zOiBjZW50ZXI7IGp1c3RpZnktY29udGVudDogY2VudGVyOyB3aWR0aDogMTAwJTsgaGVpZ2h0OiAxMDAlOyBiYWNrZ3JvdW5kOiAjYWQxNTE0OyBjb2xvcjogI2ZmZjsgZm9udC1zaXplOiAyMHB4OyB0ZXh0LWFsaWduOiBjZW50ZXI7IHotaW5kZXg6IDE7IGN1cnNvcjogZGVmYXVsdDsgfSBjdXJmZXcgLmN1cmZldyAuaGVhZGVyLFtyaW90LXRhZz1cImN1cmZld1wiXSAuY3VyZmV3IC5oZWFkZXIsW2RhdGEtaXM9XCJjdXJmZXdcIl0gLmN1cmZldyAuaGVhZGVyLGN1cmZldyAuY3VyZmV3IC5mb290ZXIsW3Jpb3QtdGFnPVwiY3VyZmV3XCJdIC5jdXJmZXcgLmZvb3RlcixbZGF0YS1pcz1cImN1cmZld1wiXSAuY3VyZmV3IC5mb290ZXJ7IHBvc2l0aW9uOiBhYnNvbHV0ZTsgbGVmdDogMDsgd2lkdGg6IDEwMCU7IGNvbG9yOiByZ2JhKDI1NSwgMjU1LCAyNTUsIDAuNyk7IGZvbnQtc2l6ZTogMTFweDsgfSBjdXJmZXcgLmN1cmZldyAuaGVhZGVyIC5pY29uLFtyaW90LXRhZz1cImN1cmZld1wiXSAuY3VyZmV3IC5oZWFkZXIgLmljb24sW2RhdGEtaXM9XCJjdXJmZXdcIl0gLmN1cmZldyAuaGVhZGVyIC5pY29uLGN1cmZldyAuY3VyZmV3IC5mb290ZXIgLmljb24sW3Jpb3QtdGFnPVwiY3VyZmV3XCJdIC5jdXJmZXcgLmZvb3RlciAuaWNvbixbZGF0YS1pcz1cImN1cmZld1wiXSAuY3VyZmV3IC5mb290ZXIgLmljb257IG1hcmdpbjogMCA0cHg7IH0gY3VyZmV3IC5jdXJmZXcgLmhlYWRlcixbcmlvdC10YWc9XCJjdXJmZXdcIl0gLmN1cmZldyAuaGVhZGVyLFtkYXRhLWlzPVwiY3VyZmV3XCJdIC5jdXJmZXcgLmhlYWRlcnsgdG9wOiA1cHg7IH0gY3VyZmV3IC5jdXJmZXcgLmhlYWRlciAubGVmdCxbcmlvdC10YWc9XCJjdXJmZXdcIl0gLmN1cmZldyAuaGVhZGVyIC5sZWZ0LFtkYXRhLWlzPVwiY3VyZmV3XCJdIC5jdXJmZXcgLmhlYWRlciAubGVmdHsgcG9zaXRpb246IGFic29sdXRlOyBsZWZ0OiAxMHB4OyB9IGN1cmZldyAuY3VyZmV3IC5oZWFkZXIgLnJpZ2h0LFtyaW90LXRhZz1cImN1cmZld1wiXSAuY3VyZmV3IC5oZWFkZXIgLnJpZ2h0LFtkYXRhLWlzPVwiY3VyZmV3XCJdIC5jdXJmZXcgLmhlYWRlciAucmlnaHR7IHBvc2l0aW9uOiBhYnNvbHV0ZTsgcmlnaHQ6IDEwcHg7IH0gY3VyZmV3IC5jdXJmZXcgLmZvb3RlcixbcmlvdC10YWc9XCJjdXJmZXdcIl0gLmN1cmZldyAuZm9vdGVyLFtkYXRhLWlzPVwiY3VyZmV3XCJdIC5jdXJmZXcgLmZvb3RlcnsgYm90dG9tOiA1cHg7IH0gY3VyZmV3IC5jdXJmZXcgLmZvb3RlciAuY2VudGVyLFtyaW90LXRhZz1cImN1cmZld1wiXSAuY3VyZmV3IC5mb290ZXIgLmNlbnRlcixbZGF0YS1pcz1cImN1cmZld1wiXSAuY3VyZmV3IC5mb290ZXIgLmNlbnRlcnsgbWFyZ2luOiAwIGF1dG87IH0nLCAnJywgZnVuY3Rpb24ob3B0cykge1xudmFyIGxvY2tyID0gcmVxdWlyZSgnbG9ja3InKTtcblxuaWYgKCdvbnRvdWNoc3RhcnQnIGluIHdpbmRvdykge1xuICAgIHRoaXMuaXNTUCA9IHRydWU7XG59IGVsc2Uge1xuICAgIHRoaXMuaXNTUCA9IGZhbHNlO1xufVxuXG50aGlzLm9uKCdtb3VudCcsIGZ1bmN0aW9uICgpIHtcbiAgICBpZiAodGhpcy5pc1NQKSB7XG4gICAgICAgIHZhciAkZWxlbSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdjdXJmZXcnKTtcbiAgICAgICAgdmFyIHN0YXJ0UG9zO1xuICAgICAgICAkZWxlbS5hZGRFdmVudExpc3RlbmVyKCd0b3VjaHN0YXJ0JywgZnVuY3Rpb24gKGUpIHtcbiAgICAgICAgICAgIHZhciB0b3VjaE9iaiA9IGUuY2hhbmdlZFRvdWNoZXNbMF07XG4gICAgICAgICAgICB2YXIgcG9zID0ge1xuICAgICAgICAgICAgICAgIHg6IHRvdWNoT2JqLnBhZ2VYLFxuICAgICAgICAgICAgICAgIHk6IHRvdWNoT2JqLnBhZ2VZXG4gICAgICAgICAgICB9O1xuICAgICAgICAgICAgc3RhcnRQb3MgPSBwb3M7XG4gICAgICAgIH0pO1xuICAgICAgICAkZWxlbS5hZGRFdmVudExpc3RlbmVyKCd0b3VjaG1vdmUnLCBmdW5jdGlvbiAoZSkge1xuICAgICAgICAgICAgdmFyIHRvdWNoT2JqID0gZS5jaGFuZ2VkVG91Y2hlc1swXTtcbiAgICAgICAgICAgIHZhciBwb3MgPSB7XG4gICAgICAgICAgICAgICAgeDogdG91Y2hPYmoucGFnZVgsXG4gICAgICAgICAgICAgICAgeTogdG91Y2hPYmoucGFnZVlcbiAgICAgICAgICAgIH07XG4gICAgICAgIH0pO1xuICAgICAgICAkZWxlbS5hZGRFdmVudExpc3RlbmVyKCd0b3VjaGVuZCcsIGZ1bmN0aW9uIChlKSB7fSk7XG4gICAgfVxufSk7XG59KTtcblxuXG4vKiogV0VCUEFDSyBGT09URVIgKipcbiAqKiAuL3NyYy9zY3JpcHRzL3RhZ3MvY3VyZmV3LnRhZ1xuICoqLyIsIihmdW5jdGlvbihyb290LCBmYWN0b3J5KSB7XG5cbiAgaWYgKHR5cGVvZiBleHBvcnRzICE9PSAndW5kZWZpbmVkJykge1xuICAgIGlmICh0eXBlb2YgbW9kdWxlICE9PSAndW5kZWZpbmVkJyAmJiBtb2R1bGUuZXhwb3J0cykge1xuICAgICAgZXhwb3J0cyA9IG1vZHVsZS5leHBvcnRzID0gZmFjdG9yeShyb290LCBleHBvcnRzKTtcbiAgICB9XG4gIH0gZWxzZSBpZiAodHlwZW9mIGRlZmluZSA9PT0gJ2Z1bmN0aW9uJyAmJiBkZWZpbmUuYW1kKSB7XG4gICAgZGVmaW5lKFsnZXhwb3J0cyddLCBmdW5jdGlvbihleHBvcnRzKSB7XG4gICAgICByb290LkxvY2tyID0gZmFjdG9yeShyb290LCBleHBvcnRzKTtcbiAgICB9KTtcbiAgfSBlbHNlIHtcbiAgICByb290LkxvY2tyID0gZmFjdG9yeShyb290LCB7fSk7XG4gIH1cblxufSh0aGlzLCBmdW5jdGlvbihyb290LCBMb2Nrcikge1xuICAndXNlIHN0cmljdCc7XG5cbiAgaWYgKCFBcnJheS5wcm90b3R5cGUuaW5kZXhPZikge1xuICAgIEFycmF5LnByb3RvdHlwZS5pbmRleE9mID0gZnVuY3Rpb24oZWx0IC8qLCBmcm9tKi8pXG4gICAge1xuICAgICAgdmFyIGxlbiA9IHRoaXMubGVuZ3RoID4+PiAwO1xuXG4gICAgICB2YXIgZnJvbSA9IE51bWJlcihhcmd1bWVudHNbMV0pIHx8IDA7XG4gICAgICBmcm9tID0gKGZyb20gPCAwKVxuICAgICAgPyBNYXRoLmNlaWwoZnJvbSlcbiAgICAgIDogTWF0aC5mbG9vcihmcm9tKTtcbiAgICAgIGlmIChmcm9tIDwgMClcbiAgICAgICAgZnJvbSArPSBsZW47XG5cbiAgICAgIGZvciAoOyBmcm9tIDwgbGVuOyBmcm9tKyspXG4gICAgICB7XG4gICAgICAgIGlmIChmcm9tIGluIHRoaXMgJiZcbiAgICAgICAgICAgIHRoaXNbZnJvbV0gPT09IGVsdClcbiAgICAgICAgICByZXR1cm4gZnJvbTtcbiAgICAgIH1cbiAgICAgIHJldHVybiAtMTtcbiAgICB9O1xuICB9XG5cbiAgTG9ja3IucHJlZml4ID0gXCJcIjtcblxuICBMb2Nrci5fZ2V0UHJlZml4ZWRLZXkgPSBmdW5jdGlvbihrZXksIG9wdGlvbnMpIHtcbiAgICBvcHRpb25zID0gb3B0aW9ucyB8fCB7fTtcblxuICAgIGlmIChvcHRpb25zLm5vUHJlZml4KSB7XG4gICAgICByZXR1cm4ga2V5O1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gdGhpcy5wcmVmaXggKyBrZXk7XG4gICAgfVxuXG4gIH07XG5cbiAgTG9ja3Iuc2V0ID0gZnVuY3Rpb24gKGtleSwgdmFsdWUsIG9wdGlvbnMpIHtcbiAgICB2YXIgcXVlcnlfa2V5ID0gdGhpcy5fZ2V0UHJlZml4ZWRLZXkoa2V5LCBvcHRpb25zKTtcblxuICAgIHRyeSB7XG4gICAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbShxdWVyeV9rZXksIEpTT04uc3RyaW5naWZ5KHtcImRhdGFcIjogdmFsdWV9KSk7XG4gICAgfSBjYXRjaCAoZSkge1xuICAgICAgaWYgKGNvbnNvbGUpIGNvbnNvbGUud2FybihcIkxvY2tyIGRpZG4ndCBzdWNjZXNzZnVsbHkgc2F2ZSB0aGUgJ3tcIisga2V5ICtcIjogXCIrIHZhbHVlICtcIn0nIHBhaXIsIGJlY2F1c2UgdGhlIGxvY2FsU3RvcmFnZSBpcyBmdWxsLlwiKTtcbiAgICB9XG4gIH07XG5cbiAgTG9ja3IuZ2V0ID0gZnVuY3Rpb24gKGtleSwgbWlzc2luZywgb3B0aW9ucykge1xuICAgIHZhciBxdWVyeV9rZXkgPSB0aGlzLl9nZXRQcmVmaXhlZEtleShrZXksIG9wdGlvbnMpLFxuICAgICAgICB2YWx1ZTtcblxuICAgIHRyeSB7XG4gICAgICB2YWx1ZSA9IEpTT04ucGFyc2UobG9jYWxTdG9yYWdlLmdldEl0ZW0ocXVlcnlfa2V5KSk7XG4gICAgfSBjYXRjaCAoZSkge1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgaWYobG9jYWxTdG9yYWdlW3F1ZXJ5X2tleV0pIHtcbiAgICAgICAgICAgICAgICB2YWx1ZSA9IEpTT04ucGFyc2UoJ3tcImRhdGFcIjpcIicgKyBsb2NhbFN0b3JhZ2UuZ2V0SXRlbShxdWVyeV9rZXkpICsgJ1wifScpO1xuICAgICAgICAgICAgfSBlbHNle1xuICAgICAgICAgICAgICAgIHZhbHVlID0gbnVsbDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICAgICAgaWYgKGNvbnNvbGUpIGNvbnNvbGUud2FybihcIkxvY2tyIGNvdWxkIG5vdCBsb2FkIHRoZSBpdGVtIHdpdGgga2V5IFwiICsga2V5KTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBpZih2YWx1ZSA9PT0gbnVsbCkge1xuICAgICAgcmV0dXJuIG1pc3Npbmc7XG4gICAgfSBlbHNlIGlmICh0eXBlb2YgdmFsdWUuZGF0YSAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgIHJldHVybiB2YWx1ZS5kYXRhO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gbWlzc2luZztcbiAgICB9XG4gIH07XG5cbiAgTG9ja3Iuc2FkZCA9IGZ1bmN0aW9uKGtleSwgdmFsdWUsIG9wdGlvbnMpIHtcbiAgICB2YXIgcXVlcnlfa2V5ID0gdGhpcy5fZ2V0UHJlZml4ZWRLZXkoa2V5LCBvcHRpb25zKSxcbiAgICAgICAganNvbjtcblxuICAgIHZhciB2YWx1ZXMgPSBMb2Nrci5zbWVtYmVycyhrZXkpO1xuXG4gICAgaWYgKHZhbHVlcy5pbmRleE9mKHZhbHVlKSA+IC0xKSB7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG5cbiAgICB0cnkge1xuICAgICAgdmFsdWVzLnB1c2godmFsdWUpO1xuICAgICAganNvbiA9IEpTT04uc3RyaW5naWZ5KHtcImRhdGFcIjogdmFsdWVzfSk7XG4gICAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbShxdWVyeV9rZXksIGpzb24pO1xuICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgIGNvbnNvbGUubG9nKGUpO1xuICAgICAgaWYgKGNvbnNvbGUpIGNvbnNvbGUud2FybihcIkxvY2tyIGRpZG4ndCBzdWNjZXNzZnVsbHkgYWRkIHRoZSBcIisgdmFsdWUgK1wiIHRvIFwiKyBrZXkgK1wiIHNldCwgYmVjYXVzZSB0aGUgbG9jYWxTdG9yYWdlIGlzIGZ1bGwuXCIpO1xuICAgIH1cbiAgfTtcblxuICBMb2Nrci5zbWVtYmVycyA9IGZ1bmN0aW9uKGtleSwgb3B0aW9ucykge1xuICAgIHZhciBxdWVyeV9rZXkgPSB0aGlzLl9nZXRQcmVmaXhlZEtleShrZXksIG9wdGlvbnMpLFxuICAgICAgICB2YWx1ZTtcblxuICAgIHRyeSB7XG4gICAgICB2YWx1ZSA9IEpTT04ucGFyc2UobG9jYWxTdG9yYWdlLmdldEl0ZW0ocXVlcnlfa2V5KSk7XG4gICAgfSBjYXRjaCAoZSkge1xuICAgICAgdmFsdWUgPSBudWxsO1xuICAgIH1cblxuICAgIGlmICh2YWx1ZSA9PT0gbnVsbClcbiAgICAgIHJldHVybiBbXTtcbiAgICBlbHNlXG4gICAgICByZXR1cm4gKHZhbHVlLmRhdGEgfHwgW10pO1xuICB9O1xuXG4gIExvY2tyLnNpc21lbWJlciA9IGZ1bmN0aW9uKGtleSwgdmFsdWUsIG9wdGlvbnMpIHtcbiAgICB2YXIgcXVlcnlfa2V5ID0gdGhpcy5fZ2V0UHJlZml4ZWRLZXkoa2V5LCBvcHRpb25zKTtcblxuICAgIHJldHVybiBMb2Nrci5zbWVtYmVycyhrZXkpLmluZGV4T2YodmFsdWUpID4gLTE7XG4gIH07XG5cbiAgTG9ja3IuZ2V0QWxsID0gZnVuY3Rpb24gKCkge1xuICAgIHZhciBrZXlzID0gT2JqZWN0LmtleXMobG9jYWxTdG9yYWdlKTtcblxuICAgIHJldHVybiBrZXlzLm1hcChmdW5jdGlvbiAoa2V5KSB7XG4gICAgICByZXR1cm4gTG9ja3IuZ2V0KGtleSk7XG4gICAgfSk7XG4gIH07XG5cbiAgTG9ja3Iuc3JlbSA9IGZ1bmN0aW9uKGtleSwgdmFsdWUsIG9wdGlvbnMpIHtcbiAgICB2YXIgcXVlcnlfa2V5ID0gdGhpcy5fZ2V0UHJlZml4ZWRLZXkoa2V5LCBvcHRpb25zKSxcbiAgICAgICAganNvbixcbiAgICAgICAgaW5kZXg7XG5cbiAgICB2YXIgdmFsdWVzID0gTG9ja3Iuc21lbWJlcnMoa2V5LCB2YWx1ZSk7XG5cbiAgICBpbmRleCA9IHZhbHVlcy5pbmRleE9mKHZhbHVlKTtcblxuICAgIGlmIChpbmRleCA+IC0xKVxuICAgICAgdmFsdWVzLnNwbGljZShpbmRleCwgMSk7XG5cbiAgICBqc29uID0gSlNPTi5zdHJpbmdpZnkoe1wiZGF0YVwiOiB2YWx1ZXN9KTtcblxuICAgIHRyeSB7XG4gICAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbShxdWVyeV9rZXksIGpzb24pO1xuICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgIGlmIChjb25zb2xlKSBjb25zb2xlLndhcm4oXCJMb2NrciBjb3VsZG4ndCByZW1vdmUgdGhlIFwiKyB2YWx1ZSArXCIgZnJvbSB0aGUgc2V0IFwiKyBrZXkpO1xuICAgIH1cbiAgfTtcblxuICBMb2Nrci5ybSA9ICBmdW5jdGlvbiAoa2V5KSB7XG4gICAgbG9jYWxTdG9yYWdlLnJlbW92ZUl0ZW0oa2V5KTtcbiAgfTtcblxuICBMb2Nrci5mbHVzaCA9IGZ1bmN0aW9uICgpIHtcbiAgICBsb2NhbFN0b3JhZ2UuY2xlYXIoKTtcbiAgfTtcbiAgcmV0dXJuIExvY2tyO1xuXG59KSk7XG5cblxuXG4vKioqKioqKioqKioqKioqKipcbiAqKiBXRUJQQUNLIEZPT1RFUlxuICoqIC4vfi9sb2Nrci9sb2Nrci5qc1xuICoqIG1vZHVsZSBpZCA9IDE3XG4gKiogbW9kdWxlIGNodW5rcyA9IDBcbiAqKi8iXSwic291cmNlUm9vdCI6IiJ9