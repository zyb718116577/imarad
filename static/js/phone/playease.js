﻿playease = function() {
	if (playease.api) {
		return playease.api.getInstance.apply(this, arguments);
	}
};

playease.version = '1.0.83';

(function(playease) {
	var utils = playease.utils = {};
	
	utils.exists = function(item) {
		switch (utils.typeOf(item)) {
			case 'string':
				return (item.length > 0);
			case 'object':
				return (item !== null);
			case 'null':
				return false;
		}
		return true;
	};
	
	utils.extend = function() {
		var args = Array.prototype.slice.call(arguments, 0),
			obj = args[0];
		if (args.length > 1) {
			for (var i = 1; i < args.length; i++) {
				utils.foreach(args[i], function(key, val) {
					if (val !== undefined && val !== null) {
						obj[key] = val;
					}
				});
			}
		}
		return obj;
	};
	
	utils.foreach = function(data, fn) {
		for (var key in data) {
			if (data.hasOwnProperty && utils.typeOf(data.hasOwnProperty) === 'function') {
				if (data.hasOwnProperty(key)) {
					fn(key, data[key]);
				}
			} else {
				// IE8 has a problem looping through XML nodes
				fn(key, data[key]);
			}
		}
	};
	
	utils.getCookie = function(key) {
		var arr, reg=new RegExp('(^| )' + key + '=([^;]*)(;|$)');
		if (arr = document.cookie.match(reg))
			return unescape(arr[2]);
		return null;
	};
	
	utils.formatTime = function(date) {
		var hours = date.getHours() + 1;
		var minutes = date.getMinutes();
		var seconds = date.getSeconds();
		return date.toLocaleDateString() + ' ' + utils.pad(hours, 2) + ':' + utils.pad(minutes, 2) + ':' + utils.pad(seconds, 2);
	};
	
	utils.pad = function(val, len) {
		var str = val + '';
		while (str.length < len) {
			str = '0' + str;
		}
		
		return str;
	};
	
	utils.typeOf = function(value) {
		if (value === null || value === undefined) {
			return 'null';
		}
		
		var typeofString = typeof value;
		if (typeofString === 'object') {
			try {
				var str = Object.prototype.toString.call(value);
				var arr = str.match(/^\[object ([a-z]+)\]$/i);
				if (arr && arr.length > 1 && arr[1]) {
					return arr[1].toLowerCase();
				}
			} catch (err) {
				/* void */
			}
		}
		
		return typeofString;
	};
	
	utils.isInt = function(value) {
		return parseFloat(value) % 1 === 0;
	};
	
	utils.trim = function(inputString) {
		return inputString.replace(/^\s+|\s+$/g, '');
	};
	
	utils.indexOf = function(array, item) {
		if (array == null) {
			return -1;
		}
		
		for (var i = 0; i < array.length; i++) {
			if (array[i] === item) {
				return i;
			}
		}
		
		return -1;
	};
	
	
	/* DOM */
	utils.createElement = function(elem, className) {
		var newElement = document.createElement(elem);
		if (className) {
			newElement.className = className;
		}
		return newElement;
	};
	
	utils.addClass = function(element, classes) {
		var originalClasses = utils.typeOf(element.className) === 'string' ? element.className.split(' ') : [];
		var addClasses = utils.typeOf(classes) === 'array' ? classes : classes.split(' ');
		
		utils.foreach(addClasses, function(n, c) {
			if (utils.indexOf(originalClasses, c) === -1) {
				originalClasses.push(c);
			}
		});
		
		element.className = utils.trim(originalClasses.join(' '));
	};
	
	utils.removeClass = function(element, c) {
		var originalClasses = utils.typeOf(element.className) === 'string' ? element.className.split(' ') : [];
		var removeClasses = utils.typeOf(c) === 'array' ? c : c.split(' ');
		
		utils.foreach(removeClasses, function(n, c) {
			var index = utils.indexOf(originalClasses, c);
			if (index >= 0) {
				originalClasses.splice(index, 1);
			}
		});
		
		element.className = utils.trim(originalClasses.join(' '));
	};
	
	utils.emptyElement = function(element) {
		while (element.firstChild) {
			element.removeChild(element.firstChild);
		}
	};
	
	
	/* Browser */
	utils.isMSIE = function(version) {
		version = version || '';
		return _userAgentMatch(new RegExp('msie\\s*' + version, 'i'));
	};
	
	utils.isIETrident = function() {
		return _userAgentMatch(/trident\/.+rv:\s*11/i);
	};
	
	utils.isEdge = function(version) {
		version = version || '';
		return _userAgentMatch(new RegExp('\\sedge\\/' + version, 'i'));
	};
	
	utils.isSafari = function(version) {
		version = version || '';
		return _userAgentMatch(new RegExp('\\ssafari\\/' + version, 'i'))
				&& !_userAgentMatch(/chrome/i) && !_userAgentMatch(/chromium/i) && !_userAgentMatch(/android/i);
	};
	
	utils.isIOS = function(version) {
		version = version || '';
		return _userAgentMatch(new RegExp('iP(hone|ad|od).+\\sOS\\s' + version, 'i'));
	};
	
	utils.isAndroid = function(version, excludeChrome) {
		//Android Browser appears to include a user-agent string for Chrome/18
		if (excludeChrome && _userAgentMatch(/chrome\/[123456789]/i) && !_userAgentMatch(/chrome\/18/)) {
			return false;
		}
		
		version = version || '';
		return _userAgentMatch(new RegExp('Android\\s*' + version, 'i'));
	};
	
	utils.isMobile = function() {
		return utils.isIOS() || utils.isAndroid();
	};
	
	utils.isChrome = function(version) {
		version = version || '';
		return _userAgentMatch(new RegExp('\\s(?:Chrome|CriOS)\\/' + version, 'i')) && !utils.isEdge();
	};
	
	utils.isFirefox = function(version) {
		version = version || '';
		return _userAgentMatch(new RegExp('firefox\\/' + version, 'i'));
	};
	
	function _userAgentMatch(regex) {
		var agent = navigator.userAgent.toLowerCase();
		return (agent.match(regex) !== null);
	};
	
	utils.isHorizontal = function() {
		if (window.orientation != undefined) {
			return (window.orientation == 90 || window.orientation == -90);
		} else {
			return window.innerWidth > window.innerHeight;
		}
	};
	
	utils.getFlashVersion = function() {
		if (utils.isAndroid()) {
			return 0;
		}
		
		var plugins = navigator.plugins, flash;
		if (plugins) {
			flash = plugins['Shockwave Flash'];
			if (flash && flash.description) {
				var version = flash.description.replace(/\D+(\d+\.?\d*).*/, '$1');
				return parseFloat(version);
			}
		}
		
		if (typeof window.ActiveXObject !== 'undefined') {
			try {
				flash = new window.ActiveXObject('ShockwaveFlash.ShockwaveFlash');
				if (flash) {
					var version = flash.GetVariable('$version').split(' ')[1].replace(/\s*,\s*/, '.')
					return parseFloat(version);
				}
			} catch (err) {
				return 0;
			}
			
			return flash;
		}
		
		return 0;
	};
	
	
	/* protocol & extension */
	utils.getProtocol = function(url) {
		var protocol = 'http';
		
		var arr = url.match(/^([a-z]+)\:\/\//i);
		if (arr && arr.length > 1) {
			protocol = arr[1];
		}
		
		return protocol;
	};
	
	utils.getOrigin = function(file) {
		var origin = '';
		
		var arr = file.match(/^[a-z]+\:\/\/([a-z0-9.:])\//i);
		if (arr && arr.length > 1) {
			origin = arr[1];
		}
		
		return origin;
	};
	
	utils.getFileName = function(file) {
		var name = '';
		
		var arr = file.match(/\/([a-z0-9\(\)\[\]\{\}\s\-_%]*(\.[a-z0-9]+)?)$/i);
		if (arr && arr.length > 1) {
			name = arr[1];
		}
		
		return name;
	};
	
	utils.getExtension = function(file) {
		var extension = '';
		
		var arr = file.match(/\/?([a-z0-9\(\)\[\]\{\}\s\-_%]*(\.([a-z0-9]+))*)\??([a-z0-9\-_%&=]*)$/i);
		if (arr && arr.length > 3) {
			extension = arr[3];
		}
		
		return extension;
	};
	
	
	/* Logger */
	var console = window.console = window.console || {
		log: function() {}
	};
	
	utils.log = function() {
		var args = Array.prototype.slice.call(arguments, 0);
		if (utils.typeOf(console.log) === 'object') {
			console.log(args);
		} else {
			console.log.apply(console, args);
		}
	};
})(playease);

(function(playease) {
	var utils = playease.utils;
	
	var crypt = utils.crypt = {};
	
	/**
	 * Turns a string into an array of bytes; a "byte" being a JS number in the
	 * range 0-255.
	 * @param {string} str String value to arrify.
	 * @return {!Array<number>} Array of numbers corresponding to the
	 *     UCS character codes of each character in str.
	 */
	crypt.stringToByteArray = function(str) {
		var output = [], p = 0;
		for (var i = 0; i < str.length; i++) {
			var c = str.charCodeAt(i);
			while (c > 0xff) {
				output[p++] = c & 0xff;
				c >>= 8;
			}
			output[p++] = c;
		}
		
		return output;
	};
	
	/**
	 * Turns an array of numbers into the string given by the concatenation of the
	 * characters to which the numbers correspond.
	 * @param {!Uint8Array|!Array<number>} bytes Array of numbers representing characters.
	 * @return {string} Stringification of the array.
	 */
	crypt.byteArrayToString = function(bytes) {
		var CHUNK_SIZE = 8192;
		
		// Special-case the simple case for speed's sake.
		if (bytes.length <= CHUNK_SIZE) {
			return String.fromCharCode.apply(null, bytes);
		}
		
		// The remaining logic splits conversion by chunks since
		// Function#apply() has a maximum parameter count.
		// See discussion: http://goo.gl/LrWmZ9
		
		var str = '';
		for (var i = 0; i < bytes.length; i += CHUNK_SIZE) {
			var chunk = Array.slice(bytes, i, i + CHUNK_SIZE);
			str += String.fromCharCode.apply(null, chunk);
		}
		
		return str;
	};
	
	/**
	 * Turns an array of numbers into the hex string given by the concatenation of
	 * the hex values to which the numbers correspond.
	 * @param {Uint8Array|Array<number>} array Array of numbers representing characters.
	 * @return {string} Hex string.
	 */
	crypt.byteArrayToHex = function(array) {
		return Array.map(array, function(numByte) {
			var hexByte = numByte.toString(16);
			return hexByte.length > 1 ? hexByte : '0' + hexByte;
		}).join('');
	};
	
	/**
	 * Converts a hex string into an integer array.
	 * @param {string} hexString Hex string of 16-bit integers (two characters per integer).
	 * @return {!Array<number>} Array of {0,255} integers for the given string.
	 */
	crypt.hexToByteArray = function(hexString) {
		if (hexString.length % 2 !== 0) {
			utils.log('Key string length must be multiple of 2.');
			return null;
		}
		
		var arr = [];
		for (var i = 0; i < hexString.length; i += 2) {
			arr.push(parseInt(hexString.substring(i, i + 2), 16));
		}
		
		return arr;
	};
	
	/**
	 * Converts a JS string to a UTF-8 "byte" array.
	 * @param {string} str 16-bit unicode string.
	 * @return {!Array<number>} UTF-8 byte array.
	 */
	crypt.stringToUTF8ByteArray = function(str) {
		// TODO(user): Use native implementations if/when available
		var out = [], p = 0;
		for (var i = 0; i < str.length; i++) {
			var c = str.charCodeAt(i);
			if (c < 128) {
				out[p++] = c;
			} else if (c < 2048) {
				out[p++] = (c >> 6) | 192;
				out[p++] = (c & 63) | 128;
			} else if (((c & 0xFC00) == 0xD800) && (i + 1) < str.length && ((str.charCodeAt(i + 1) & 0xFC00) == 0xDC00)) {
				// Surrogate Pair
				c = 0x10000 + ((c & 0x03FF) << 10) + (str.charCodeAt(++i) & 0x03FF);
				out[p++] = (c >> 18) | 240;
				out[p++] = ((c >> 12) & 63) | 128;
				out[p++] = ((c >> 6) & 63) | 128;
				out[p++] = (c & 63) | 128;
			} else {
				out[p++] = (c >> 12) | 224;
				out[p++] = ((c >> 6) & 63) | 128;
				out[p++] = (c & 63) | 128;
			}
		}
		
		return out;
	};
	
	/**
	 * Converts a UTF-8 byte array to JavaScript's 16-bit Unicode.
	 * @param {Uint8Array|Array<number>} bytes UTF-8 byte array.
	 * @return {string} 16-bit Unicode string.
	 */
	crypt.UTF8ByteArrayToString = function(bytes) {
		// TODO(user): Use native implementations if/when available
		var out = [], pos = 0, c = 0;
		while (pos < bytes.length) {
			var c1 = bytes[pos++];
			if (c1 < 128) {
				out[c++] = String.fromCharCode(c1);
			} else if (c1 > 191 && c1 < 224) {
				var c2 = bytes[pos++];
				out[c++] = String.fromCharCode((c1 & 31) << 6 | c2 & 63);
			} else if (c1 > 239 && c1 < 365) {
				// Surrogate Pair
				var c2 = bytes[pos++];
				var c3 = bytes[pos++];
				var c4 = bytes[pos++];
				var u = ((c1 & 7) << 18 | (c2 & 63) << 12 | (c3 & 63) << 6 | c4 & 63) - 0x10000;
				out[c++] = String.fromCharCode(0xD800 + (u >> 10));
				out[c++] = String.fromCharCode(0xDC00 + (u & 1023));
			} else {
				var c2 = bytes[pos++];
				var c3 = bytes[pos++];
				out[c++] = String.fromCharCode((c1 & 15) << 12 | (c2 & 63) << 6 | c3 & 63);
			}
		}
		
		return out.join('');
	};
	
	/**
	 * XOR two byte arrays.
	 * @param {!Uint8Array|!Int8Array|!Array<number>} bytes1 Byte array 1.
	 * @param {!Uint8Array|!Int8Array|!Array<number>} bytes2 Byte array 2.
	 * @return {!Array<number>} Resulting XOR of the two byte arrays.
	 */
	crypt.XORByteArray = function(bytes1, bytes2) {
		if (bytes1.length !== bytes2.length) {
			utils.log('XOR array lengths must match.');
			return 
		}
		
		var result = [];
		for (var i = 0; i < bytes1.length; i++) {
			result.push(bytes1[i] ^ bytes2[i]);
		}
		
		return result;
	};
})(playease);

(function(playease) {
	var utils = playease.utils;
	
	utils.littleEndian = (function() {
		var buffer, array;
		
		try {
			buffer = new ArrayBuffer(2);
			new DataView(buffer).setInt16(0, 256, true);
			
			array = new Int16Array(buffer);
		} catch(err) {
			/* void */
		}
		
		return array && array[0] === 256;
	})();
	
	utils.getUint32 = function(uint8, byteOffset, littleEndian) {
		if (byteOffset == undefined) {
			byteOffset = 0;
		}
		
		if (!littleEndian) {
			return (
				uint8[byteOffset + 0] << 24 |
				uint8[byteOffset + 1] << 16 |
				uint8[byteOffset + 2] <<  8 |
				uint8[byteOffset + 3]
			);
		}
		
		return (
			uint8[byteOffset + 0] |
			uint8[byteOffset + 1] >>>  8 |
			uint8[byteOffset + 2] >>> 16 |
			uint8[byteOffset + 3] >>> 24
		);
	};
})(playease);

(function(playease) {
	var utils = playease.utils,
		sheet;
	
	function createStylesheet() {
		var styleSheet = document.createElement('style');
		styleSheet.type = 'text/css';
		document.getElementsByTagName('head')[0].appendChild(styleSheet);
		return styleSheet.sheet || styleSheet.styleSheet;
	}
	
	var css = utils.css = function(selector, styles) {
		if (!sheet) {
			sheet = createStylesheet();
		}
		
		var _styles = '';
		utils.foreach(styles, function(style, value) {
			_styles += style + ': ' + value + '; ';
		});
		
		try {
			if (sheet.insertRule) 
				sheet.insertRule(selector + ' { ' + _styles + '}', sheet.cssRules.length);
			else 
				sheet.addRule(selector, _styles, sheet.rules.length);
		} catch (e) {
			utils.log('Failed to insert css rule: ' + selector);
		}
	};
	
	css.style = function(elements, styles, immediate) {
		if (elements === undefined || elements === null) {
			return;
		}
		if (elements.length === undefined) {
			elements = [elements];
		}
		
		var rules = utils.extend({}, styles);
		for (var i = 0; i < elements.length; i++) {
			var element = elements[i];
			if (element === undefined || element === null) {
				continue;
			}
			
			utils.foreach(rules, function(style, value) {
				var name = _getStyleName(style);
				if (element.style[name] !== value) {
					element.style[name] = value;
				}
			});
		}
	};
	
	function _getStyleName(name) {
		name = name.split('-');
		for (var i = 1; i < name.length; i++) {
			name[i] = name[i].charAt(0).toUpperCase() + name[i].slice(1);
		}
		return name.join('');
	}
})(playease);

(function(playease) {
	playease.events = {
		// General Events
		ERROR: 'error',
		
		// API Events
		PLAYEASE_READY: 'playeaseReady',
		PLAYEASE_SETUP_ERROR: 'playeaseSetupError',
		PLAYEASE_RENDER_ERROR: 'playeaseRenderError',
		PLAYEASE_SECURITY_ERROR: 'playeaseSecurityError',
		PLAYEASE_IO_ERROR: 'playeaseIOError',
		
		PLAYEASE_STATE: 'playeaseState',
		PLAYEASE_PROPERTY: 'playeaseProperty',
		PLAYEASE_METADATA: 'playeaseMetaData',
		PLAYEASE_DURATION: 'playeaseDuration',
		
		PLAYEASE_BUFFERING: 'playeaseBuffering',
		PLAYEASE_PLAYING: 'playeasePlaying',
		PLAYEASE_PAUSED: 'playeasePaused',
		PLAYEASE_RELOADING: 'playeaseReloading',
		PLAYEASE_SEEKING: 'playeaseSeeking',
		PLAYEASE_STOPPED: 'playeaseStopped',
		PLAYEASE_REPORT: 'playeaseReport',
		PLAYEASE_MUTE: 'playeaseMute',
		PLAYEASE_VOLUME: 'playeaseVolume',
		PLAYEASE_VIDEOOFF: 'playeaseVideoOff',
		PLAYEASE_HD: 'playeaseHD',
		PLAYEASE_BULLET: 'playeaseBullet',
		PLAYEASE_FULLPAGE: 'playeaseFullpage',
		PLAYEASE_FULLSCREEN: 'playeaseFullscreen',
		
		// View Events
		PLAYEASE_VIEW_PLAY: 'playeaseViewPlay',
		PLAYEASE_VIEW_PAUSE: 'playeaseViewPause',
		PLAYEASE_VIEW_RELOAD: 'playeaseViewReload',
		PLAYEASE_VIEW_SEEK: 'playeaseViewSeek',
		PLAYEASE_VIEW_STOP: 'playeaseViewStop',
		PLAYEASE_VIEW_REPORT: 'playeaseViewReport',
		PLAYEASE_VIEW_MUTE: 'playeaseViewMute',
		PLAYEASE_VIEW_VOLUME: 'playeaseViewVolume',
		PLAYEASE_VIEW_VIDEOOFF: 'playeaseViewVideoOff',
		PLAYEASE_VIEW_HD: 'playeaseViewHD',
		PLAYEASE_VIEW_BULLET: 'playeaseViewBullet',
		PLAYEASE_VIEW_FULLPAGE: 'playeaseViewFullpage',
		PLAYEASE_VIEW_FULLSCREEN: 'playeaseViewFullscreen',
		
		PLAYEASE_SLIDER_CHANGE: 'playeaseSliderChange',
		
		// Loader Events
		PLAYEASE_CONTENT_LENGTH: 'playeaseContentLength',
		PLAYEASE_PROGRESS: 'playeaseProgress',
		PLAYEASE_COMPLETE: 'playeaseComplete',
		
		// Muxer Events
		PLAYEASE_MEDIA_INFO: 'playeaseMediaInfo',
		
		PLAYEASE_FLV_TAG: 'playeaseFlvTag',
		PLAYEASE_AVC_CONFIG_RECORD: 'playeaseAVCConfigRecord',
		PLAYEASE_AVC_SAMPLE: 'playeaseAVCSample',
		PLAYEASE_AAC_SPECIFIC_CONFIG: 'playeaseAACSpecificConfig',
		PLAYEASE_AAC_SAMPLE: 'playeaseAACSample',
		
		PLAYEASE_MP4_INIT_SEGMENT: 'playeaseMp4InitSegment',
		PLAYEASE_MP4_SEGMENT: 'playeaseMp4Segment',
		
		PLAYEASE_END_OF_STREAM: 'playeaseEndOfStream',
		
		// Net Status Events
		PLAYEASE_NET_STATUS: 'playeaseNetStatus',
		
		// Timer Events
		PLAYEASE_TIMER: 'playeaseTimer',
		PLAYEASE_TIMER_COMPLETE: 'playeaseTimerComplete'
	};
})(playease);

(function(playease) {
	var utils = playease.utils,
		events = playease.events;
	
	events.eventdispatcher = function(id) {
		var _id = id,
			_listeners = {},
			_globallisteners = [];
		
		this.addEventListener = function(type, listener, count) {
			try {
				if (!utils.exists(_listeners[type])) {
					_listeners[type] = [];
				}
				
				if (utils.typeOf(listener) === 'string') {
					listener = (new Function('return ' + listener))();
				}
				_listeners[type].push({
					listener: listener,
					count: count || null
				});
			} catch (err) {
				utils.log('error', err);
			}
			return false;
		};
		
		this.removeEventListener = function(type, listener) {
			if (!_listeners[type]) {
				return;
			}
			try {
				if (listener === undefined) {
					_listeners[type] = [];
					return;
				}
				var i;
				for (i = 0; i < _listeners[type].length; i++) {
					if (_listeners[type][i].listener.toString() === listener.toString()) {
						_listeners[type].splice(i, 1);
						break;
					}
				}
			} catch (err) {
				utils.log('error', err);
			}
			return false;
		};
		
		this.addGlobalListener = function(listener, count) {
			try {
 				if (utils.typeOf(listener) === 'string') {
					listener = (new Function('return ' + listener))();
				}
				_globallisteners.push({
					listener: listener,
					count: count || null
				});
			} catch (err) {
				utils.log('error', err);
			}
			return false;
		};
		
		this.removeGlobalListener = function(listener) {
			if (!listener) {
				return;
			}
			try {
				var i;
				for (i = _globallisteners.length - 1; i >= 0; i--) {
					if (_globallisteners[i].listener.toString() === listener.toString()) {
						_globallisteners.splice(i, 1);
					}
				}
			} catch (err) {
				utils.log('error', err);
			}
			return false;
		};
		
		
		this.dispatchEvent = function(type, data) {
			if (!data) {
				data = {};
			}
			utils.extend(data, {
				id: _id,
				type: type,
				target: this,
				version: playease.version
			});
			if (playease.debug) {
				utils.log(type, data);
			}
			_dispatchEvent(_listeners[type], data, type);
			_dispatchEvent(_globallisteners, data, type);
		};
		
		function _dispatchEvent(listeners, data, type) {
			if (!listeners) {
				return;
			}
			for (var index = 0; index < listeners.length; index++) {
				var listener = listeners[index];
				if (listener) {
					if (listener.count !== null && --listener.count === 0) {
						delete listeners[index];
					}
					try {
						listener.listener(data);
					} catch (err) {
						utils.log('Error handling "' + type +
							'" event listener [' + index + ']: ' + err.toString(), listener.listener, data);
					}
				}
			}
		}
	};
})(playease);

(function(playease) {
	var utils = playease.utils;
	
	utils.filekeeper = function(config) {
		var _this = this,
			_defaults = {
				filename: 'sample.fragmented.mp4',
				type: 'video/mpeg'
			},
			_array,
			_blob,
			_url,
			_event,
			_link;
		
		function _init() {
			_this.config = utils.extend({}, _defaults, config);
			
			_array = [];
		}
		
		_this.append = function(typedArray) {
			_array.push(typedArray);
		};
		
		_this.save = function(filename) {
			if (!filename) {
				filename = _this.config.filename;
			}
			
			_blob = new Blob(_array, { type: _this.config.type });
			_url = URL.createObjectURL(_blob);
			
			_event = document.createEvent('MouseEvents');
			_event.initMouseEvent('click', true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
			
			_link = document.createElementNS('http://www.w3.org/1999/xhtml', 'a');
			_link.href = _url;
			_link.download = filename;
			_link.dispatchEvent(_event);
			
			_array = [];
			
			URL.revokeObjectURL(_url);
		};
		
		_init();
	};
})(playease);

(function(playease) {
	var utils = playease.utils,
		events = playease.events;
	
	utils.timer = function(delay, repeatCount) {
		var _this = utils.extend(this, new events.eventdispatcher('utils.timer')),
			_intervalId,
			_currentCount = 0,
			_running = false;
		
		function _init() {
			_this.delay = delay || 50;
			_this.repeatCount = repeatCount || 0;
		}
		
		_this.start = function() {
			if (_running === false) {
				_intervalId = setInterval(_onTimer, _this.delay);
				_running = true;
			}
		};
		
		function _onTimer() {
			_currentCount++;
			_this.dispatchEvent(events.PLAYEASE_TIMER);
			
			if (_this.repeatCount > 0 && _currentCount >= _this.repeatCount) {
				_this.stop();
				_this.dispatchEvent(events.PLAYEASE_TIMER_COMPLETE);
			}
		}
		
		_this.stop = function() {
			if (_running) {
				clearInterval(_intervalId);
				_intervalId = 0;
				_running = false;
			}
		};
		
		_this.reset = function() {
			_this.stop();
			_currentCount = 0;
		};
		
		_this.currentCount = function() {
			return _currentCount;
		};
		
		_this.running = function() {
			return _running;
		};
		
		_init();
	};
})(playease);

(function(playease) {
	var utils = playease.utils,
		events = playease.events,
		
		types = {
			ELEMENT_NODE:       1,
			TEXT_NODE:          3,
			CDATA_SECTION_NODE: 4,
			COMMENT_NODE:       8,
			DOCUMENT_NODE:      9
		};
	
	utils.xml2json = function(config) {
		var _this = utils.extend(this, new events.eventdispatcher('utils.xml2json')),
			_defaults = {
				ignoreRoot: true,
				trimWhitespaces: false,
				attributePrefix: '@',
				matchers: []
			};
		
		function _init() {
			_this.config = utils.extend({}, _defaults, config);
		}
		
		_this.parse = function(str) {
			var xml = null;
			
			if (window.DOMParser) {
				var parser = new DOMParser();
				
				try {
					xml = parser.parseFromString(str, 'text/xml');
				} catch (err) {
					utils.log('Failed to parse XML structure.');
					return null;
				}
			} else {
				if(str.indexOf('<?') == 0) {
					str = str.substr(str.indexOf('?>') + 2);
				}
				
				xml = new ActiveXObject('Microsoft.XMLDOM');
				xml.async = 'false';
				xml.loadXML(str);
			}
			
			return _parseNode(xml);
		};
		
		function _parseNode(node, path) {
			var data = {};
			
			if (node.nodeType == types.DOCUMENT_NODE) {
				for (var i = 0; i < node.childNodes.length; i++) {
					var child = node.childNodes[i];
					var name = _getNodeName(child);
					
					if (child.nodeType == types.ELEMENT_NODE) {
						element = _parseNode(child);
						element.parent = data;
						
						if (_this.config.ignoreRoot) {
							delete element.parent;
							data = element;
						} else {
							data[name] = element;
						}
					}
				}
				
				return data;
			}
			
			if (node.nodeType == types.ELEMENT_NODE) {
				for (var i = 0; i < node.childNodes.length; i++) {
					var child = node.childNodes[i];
					var name = _getNodeName(child);
					
					if (child.nodeType == types.COMMENT_NODE) {
						continue;
					}
					
					var childPath = path + '.' + name;
					var element = _parseNode(child, childPath);
					element.parent = data;
					
					if (data.hasOwnProperty(name)) {
						if (utils.typeOf(data[name]) != 'array') {
							data[name] = [data[name]];
						}
						
						data[name].push(element);
					} else {
						if (name != '#text' || /[^\s]/.test(element)) { // Don't add white-space text nodes
							data[name] = element;
						}
					}
				}
				
				// Attributes
				var name = _getNodeName(node);
				
				// Node namespace prefix
				if (node.prefix != null && node.prefix != '') {
					name = node.prefix + ':' + name;
				}
				
				for (var i = 0; i < node.attributes.length; i++) {
					var attr = node.attributes[i];
					var value = attr.value;
					
					for (var j = 0; j < _this.config.matchers.length; j++) {
						var matcher = _this.config.matchers[j];
						if (matcher.test(attr, name)) {
							value = matcher.exec(attr.value);
						}
						
						data[_this.config.attributePrefix + attr.name] = value;
					}
				}
				
				if (data['#text'] != null) {
					if (_this.config.trimWhitespaces) {
						data['#text'] = data['#text'].trim();
					}
				}
				
				if (data['#cdata-section'] != null) {
					
				}
				
				data.toString = function() {
					return (this['#text'] == null ? '' : this['#text']) + (this['#cdata-section'] == null ? '' : this['#cdata-section']);
				};
				
				return data;
			}
			
			if (node.nodeType == types.TEXT_NODE || node.nodeType == types.CDATA_SECTION_NODE) {
				return node.nodeValue;
			}
		}
		
		function _getNodeName(node) {
			return node.localName || node.baseName || node.nodeName;
    }
		
		_init();
	};
})(playease);

(function(playease) {
	var utils = playease.utils;
	
	utils.manifest = function(url) {
		var _this = this,
			_url,
			_mpd,
			_location,
			_baseURL;
		
		function _init() {
			_url = url || '';
		}
		
		_this.update = function(mpd) {
			// Location
			_location = mpd.Location['#text'] || _url;
			
			// BaseURL
			_baseURL = mpd.BaseURL || _location.substring(0, _location.lastIndexOf('/') + 1);
			
			if (mpd['@type'] == 'dynamic') {
				_updatePeriod(mpd, _mpd);
			}
			
			_mpd = mpd;
		};
		
		function _updatePeriod(newMpd, oldMpd) {
			var start = 0;
			var duration = NaN;
			
			if (utils.typeOf(newMpd.Period) != 'array') {
				newMpd.Period = [newMpd.Period];
			}
			
			for (var i = 0; i < newMpd.Period.length; i++) {
				var newPeriod = newMpd.Period[i];
				
				if (newPeriod.hasOwnProperty('@start')) {
					start = newPeriod['@start'];
				} else if (!isNaN(duration)) {
					start += duration;
				} else if (i == 0) {
					if (newMpd['@type'] == 'dynamic') {
						// TODO: Early Available Period
					} else { // default: static
						start = 0;
					}
				}
				
				if (newPeriod.hasOwnProperty('@duration')) {
					duration = newPeriod['@duration'];
				}
				
				newPeriod['@start'] = start;
				newPeriod['@duration'] = duration;
				
				var oldPeriod = _getPeriod(oldMpd, newPeriod);
				_updateAdaptationSet(newPeriod, oldPeriod);
			}
		}
		
		function _updateAdaptationSet(newPeriod, oldPeriod) {
			for (var i = 0; i < newPeriod.AdaptationSet.length; i++) {
				var newAdaptationSet = newPeriod.AdaptationSet[i];
				var oldAdaptationSet = _getAdaptationSet(oldPeriod, newAdaptationSet);
				_updateSegments(newAdaptationSet, oldAdaptationSet);
			}
		}
		
		function _updateSegments(newAdaptationSet, oldAdaptationSet) {
			var oldT = 0;
			var newT = 0;
			var newS = [];
			
			if (newAdaptationSet.SegmentTemplate.hasOwnProperty('SegmentTimeline') == false) {
				return;
			}
			
			if (oldAdaptationSet) {
				var oldSegmentTimeline = oldAdaptationSet.SegmentTemplate.SegmentTimeline;
				if (utils.typeOf(oldSegmentTimeline.S) != 'array') {
					oldSegmentTimeline.S = [oldSegmentTimeline.S];
				}
				
				for (var i = 0; i < oldSegmentTimeline.S.length; i++) {
					var s = oldSegmentTimeline.S[i];
					
					if (i == 0 && s.hasOwnProperty('@t')) {
						oldT = s['@t'];
					}
					
					oldT += s['@d'];
					if (s['@r']) {
						oldT += s['@d'] * s['@r'];
					}
					
					newS.push(utils.extend({}, s));
				}
			}
			
			var newSegmentTimeline = newAdaptationSet.SegmentTemplate.SegmentTimeline;
			if (utils.typeOf(newSegmentTimeline.S) != 'array') {
				newSegmentTimeline.S = [newSegmentTimeline.S];
			}
			
			for (var i = 0; i < newSegmentTimeline.S.length; i++) {
				var s = newSegmentTimeline.S[i];
			
				if (i == 0 && s.hasOwnProperty('@t')) {
					newT = s['@t'];
				}
				
				if (newT >= oldT) {
					newS.push(s);
				}
				
				newT += s['@d'];
				if (s['@r']) {
					newT += s['@d'] * s['@r'];
				}
			}
		}
		
		function _getPeriod(mpd, reference) {
			if (!mpd) {
				return undefined;
			}
			
			for (var i = 0; i < mpd.Period.length; i++) {
				var period = mpd.Period[i];
				
				if (period.hasOwnProperty('@id')) {
					if (period['@id'] === reference['@id']) {
						return period;
					}
				} else if (period.hasOwnProperty('@start')) {
					if (period['@start'] === reference['@start']) {
						return period;
					}
				} else {
					return period; // Just return the first one.
				}
			}
			
			return undefined;
		}
		
		function _getAdaptationSet(period, reference) {
			if (!period) {
				return undefined;
			}
			
			for (var i = 0; i < period.AdaptationSet.length; i++) {
				var adaptationSet = period.AdaptationSet[i];
				
				if (adaptationSet.hasOwnProperty('@id')) {
					if (adaptationSet['@id'] === reference['@id']) {
						return adaptationSet;
					}
				} else if (adaptationSet.hasOwnProperty('@contentType')) {
					if (adaptationSet['@contentType'] === reference['@contentType']) {
						return adaptationSet;
					}
				} else if (adaptationSet.hasOwnProperty('@mimeType')) {
					if (adaptationSet['@mimeType'] === reference['@mimeType']) {
						return adaptationSet;
					}
				} else if (adaptationSet.hasOwnProperty('@codecs')) {
					if (adaptationSet['@codecs'] === reference['@codecs']) {
						return adaptationSet;
					}
				} else {
					// Can't get content type straightly.
					// TODO: Recognize @width, @height, @sar, @frameRate, etc. as video AdaptationSet.
					break;
				}
			}
			
			return undefined;
		}
		
		_this.getSegmentInfo = function(time, type, isInitSegment, start, index, bandwidth) {
			var period = _getPeriodByTime(time);
			var adaptationSet = _getAdaptationSetByType(period, type);
			if (!adaptationSet) {
				return undefined;
			}
			
			var representation = _getRepresentationByBandwidth(adaptationSet, bandwidth);
			if (!representation) {
				return undefined;
			}
			
			var segmentTemplate = adaptationSet.SegmentTemplate;
			
			var url = segmentTemplate[isInitSegment ? '@initialization' : '@media'];
			var timescale = segmentTemplate['@timescale'] || 1;
			var duration = segmentTemplate['@duration'] || 0;
			
			url = url.replace(/\$RepresentationID\$/, representation['@id']);
			
			if (segmentTemplate['@media'].search(/\$Time\$/)) {
				var s, segmentTimeline = segmentTemplate.SegmentTimeline;
				if (isInitSegment) {
					if (start > 0 || start == 0 && _mpd.hasOwnProperty('@suggestedPresentationDelay') == false) {
						start = segmentTimeline.S[0]['@t'];
					} else {
						var delay = Math.abs(delay) || _mpd['@suggestedPresentationDelay'];
						s = _getSegmentByDelay(segmentTimeline, delay * timescale);
						if (s) {
							start = s['@t'];
							duration = s['@d'];
						} else {
							start = segmentTimeline.S[0]['@t'];
						}
					}
				} else {
					s = _getSegmentByTime(segmentTimeline, start);
					if (s === undefined) {
						return undefined;
					}
					
					start = s['@t'];
					duration = s['@d'];
					
					url = url.replace(/\$Time\$/, start);
				}
			}
			
			if (segmentTemplate['@media'].search(/\$Number\$/)) {
				if (isInitSegment) {
					index = segmentTemplate['@startNumber'];
				} else {
					url = url.replace(/\$Number\$/, index);
				}
			}
			
			var baseURL = representation.baseURL || adaptationSet.baseURL || period.baseURL;
			url = (baseURL ? baseURL['#text'] : _baseURL) + url;
			
			return {
				mimeType: representation['@mimeType'] || adaptationSet['@mimeType'],
				codecs: representation['@codecs'] || adaptationSet['@codecs'],
				index: index,
				start: start,
				duration: duration,
				timescale: timescale,
				url: url
			};
		};
		
		function _getPeriodByTime(time) {
			var element = _mpd.Period[0];
			
			for (var i = 0; i < _mpd.Period.length; i++) {
				var period = _mpd.Period[i];
				
				if (period.hasOwnProperty('@start')) {
					if (period['@start'] > element['@start'] && period['@start'] <= time) {
						element = period;
					}
				} else {
					break; // Just return the first one.
				}
			}
			
			return element;
		}
		
		function _getAdaptationSetByType(period, type) {
			for (var i = 0; i < period.AdaptationSet.length; i++) {
				var adaptationSet = period.AdaptationSet[i];
				
				if (adaptationSet.hasOwnProperty('@contentType')) {
					if (adaptationSet['@contentType'] == type) {
						return adaptationSet;
					}
				} else if (adaptationSet.hasOwnProperty('@mimeType')) {
					var arr = adaptationSet['@mimeType'].match(/^([a-z]+)\/[a-z0-9]+/i);
					if (arr && arr.length > 1 && arr[1] == type) {
						return adaptationSet;
					}
				}
			}
			
			return undefined;
		}
		
		function _getRepresentationByBandwidth(adaptationSet, bandwidth) {
			if (utils.typeOf(adaptationSet.Representation) != 'array') {
				adaptationSet.Representation = [adaptationSet.Representation];
			}
			
			var element = adaptationSet.Representation[0];
			
			for (var i = 0; i < adaptationSet.Representation.length; i++) {
				var representation = adaptationSet.Representation[i];
				if (representation['@bandwidth'] > element['@bandwidth'] && (!bandwidth || representation['@bandwidth'] <= bandwidth)) {
					element = representation;
				}
			}
			
			return element;
		}
		
		function _getSegmentByDelay(segmentTimeline, delay) {
			for (var i = segmentTimeline.S.length - 1; i >= 0; i--) {
				var s = segmentTimeline.S[i];
				
				delay -= s['@d'] * (s['@r'] || 1);
				if (delay <= 0) {
					var t = segmentTimeline.S[0]['@t'];
					
					for (var j = 0; j < i; j++) {
						t += segmentTimeline.S[j]['@d'];
						if (s['@r']) {
							t += s['@d'] * s['@r'];
						}
					}
					
					s['@t'] = t;
					
					return s;
				}
			}
			
			return segmentTimeline.S[0];
		}
		
		function _getSegmentByTime(segmentTimeline, start) {
			var t = NaN;
			
			for ( ; segmentTimeline.S.length; ) {
				var s = segmentTimeline.S.shift();
				
				if (isNaN(t)) {
					t = s['@t'];
				}
				
				if (t + s['@d'] * (s['@r'] || 0) >= start) {
					s['@t'] = t;
					
					if (segmentTimeline.S.length) {
						segmentTimeline.S[0]['@t'] = s['@t'] + s['@d'];
					}
					
					return s;
				}
				
				t += s['@d'];
				if (s['@r']) {
					t += s['@d'] * s['@r'];
				}
			}
			
			return undefined;
		}
		
		_this.getLocation = function() {
			return _location;
		};
		
		_init();
	};
})(playease);

(function(playease) {
	playease.utils.matchers = {};
})(playease);

(function(playease) {
	var utils = playease.utils,
		matchers = utils.matchers,
		
		datetimeRegex = /^([0-9]{4})-([0-9]{2})-([0-9]{2})T([0-9]{2}):([0-9]{2})(?::([0-9]*)(\.[0-9]*)?)?(?:([+-])([0-9]{2})(?::?)([0-9]{2}))?/,
		
		MINUTES_IN_HOUR = 60,
		SECONDS_IN_MINUTE = 60,
		MILLISECONDS_IN_SECOND = 1000;
	
	matchers.datetime = function() {
		var _this = this;
		
		function _init() {
			
		}
		
		_this.test = function(attr) {
			return datetimeRegex.test(attr.value);
		};
		
		_this.exec = function(str) {
			var match = datetimeRegex.exec(str);
			var utcDate;
			
			// If the string does not contain a timezone offset, different browsers can interpret it either as UTC or as a local time,
			// so we have to parse the string manually to normalize the given date value for all browsers.
			utcDate = Date.UTC(
				parseInt(match[1], 10),
				parseInt(match[2], 10) - 1, // months start from zero
				parseInt(match[3], 10),
				parseInt(match[4], 10),
				parseInt(match[5], 10),
				(match[6] && parseInt(match[6], 10) || 0),
				(match[7] && parseFloat(match[7]) * MILLISECONDS_IN_SECOND) || 0
			);
			
			// If the date has timezone offset take it into account as well
			if (match[9] && match[10]) {
				var timezoneOffset = parseInt(match[9], 10) * MINUTES_IN_HOUR + parseInt(match[10], 10);
				utcDate += (match[8] === '+' ? -1 : +1) * timezoneOffset * SECONDS_IN_MINUTE * MILLISECONDS_IN_SECOND;
			}
			
			return new Date(utcDate);
		};
		
		_init();
	};
})(playease);

(function(playease) {
	var utils = playease.utils,
		matchers = utils.matchers,
		
		durationRegex = /^([-])?P(([\d.]*)Y)?(([\d.]*)M)?(([\d.]*)D)?T?(([\d.]*)H)?(([\d.]*)M)?(([\d.]*)S)?/,
		
		SECONDS_IN_YEAR  = 365 * 24 * 60 * 60,
		SECONDS_IN_MONTH =  30 * 24 * 60 * 60,
		SECONDS_IN_DAY   =       24 * 60 * 60,
		SECONDS_IN_HOUR  =            60 * 60,
		SECONDS_IN_MIN   =                 60,
		
		attributes = [
			'minBufferTime', 'mediaPresentationDuration',
			'minimumUpdatePeriod', 'timeShiftBufferDepth', 'maxSegmentDuration',
			'maxSubsegmentDuration', 'suggestedPresentationDelay', 'start',
			'starttime', 'duration'
		];
	
	matchers.duration = function() {
		var _this = this;
		
		function _init() {
			
		}
		
		_this.test = function(attr) {
			for (var i = 0; i < attributes.length; i++) {
				if (_getNodeName(attr) === attributes[i]) {
					return durationRegex.test(attr.value);
				}
			}
			
			return false;
		};
		
		_this.exec = function(str) { // str = "P10Y10M10DT10H10M10.1S";
			var match = durationRegex.exec(str);
			var value = parseFloat(match[2] || 0) * SECONDS_IN_YEAR + parseFloat(match[4] || 0) * SECONDS_IN_MONTH + parseFloat(match[6] || 0) * SECONDS_IN_DAY +
					parseFloat(match[8] || 0) * SECONDS_IN_HOUR + parseFloat(match[10] || 0) * SECONDS_IN_MIN + parseFloat(match[12] || 0);
			
			if (match[1] !== undefined) {
				value *= -1;
			}
			
			return value;
		};
		
		function _getNodeName(node) {
			return node.localName || node.baseName || node.nodeName;
    }
		
		_init();
	};
})(playease);

(function(playease) {
	var utils = playease.utils,
		matchers = utils.matchers,
		
		numericRegex = /^[-+]?[0-9]+[.]?[0-9]*([eE][-+]?[0-9]+)?$/;
	
	matchers.numeric = function() {
		var _this = this;
		
		function _init() {
			
		}
		
		_this.test = function(attr) {
			return numericRegex.test(attr.value);
		};
		
		_this.exec = function(str) {
			return parseFloat(str);
		};
		
		_init();
	};
})(playease);

(function(playease) {
	var utils = playease.utils,
		matchers = utils.matchers,
		
		attributes = {
			'MPD':                        [ 'id', 'profiles' ],
			'Period':                     [ 'id' ],
			'BaseURL':                    [ 'serviceLocation', 'byteRange' ],
			'SegmentBase':                [ 'indexRange' ],
			'Initialization':             [ 'range' ],
			'RepresentationIndex':        [ 'range' ],
			'SegmentList':                [ 'indexRange' ],
			'BitstreamSwitching':         [ 'range' ],
			'SegmentURL':                 [ 'mediaRange', 'indexRange' ],
			'SegmentTemplate':            [ 'indexRange', 'media', 'index', 'initialization', 'bitstreamSwitching' ],
			'AssetIdentifier':            [ 'value', 'id' ],
			'EventStream':                [ 'value' ],
			'AdaptationSet':              [ 'profiles', 'mimeType', 'segmentProfiles', 'codecs', 'contentType' ],
			'FramePacking':               [ 'value', 'id' ],
			'AudioChannelConfiguration':  [ 'value', 'id' ],
			'ContentProtection':          [ 'value', 'id' ],
			'EssentialProperty':          [ 'value', 'id' ],
			'SupplementalProperty':       [ 'value', 'id' ],
			'InbandEventStream':          [ 'value', 'id' ],
			'Accessibility':              [ 'value', 'id' ],
			'Role':                       [ 'value', 'id' ],
			'Rating':                     [ 'value', 'id' ],
			'Viewpoint':                  [ 'value', 'id' ],
			'ContentComponent':           [ 'contentType' ],
			'Representation':             [ 'id', 'dependencyId', 'mediaStreamStructureId' ],
			'Subset':                     [ 'id' ],
			'Metrics':                    [ 'metrics' ],
			'Reporting':                  [ 'value', 'id' ]
		};
	
	matchers.string = function() {
		var _this = this;
		
		function _init() {
			
		}
		
		_this.test = function(attr, name) {
			if (attributes.hasOwnProperty(name)) {
				var attrNames = attributes[name];
				if (attrNames !== undefined) {
					return attrNames.indexOf(attr.name) >= 0;
				} else {
					return false;
				}
			}
			
			return false;
		};
		
		_this.exec = function(str) {
			return String(str);
		};
		
		_init();
	};
})(playease);

(function(playease) {
	var utils = playease.utils,
		events = playease.events;
	
	var _insts = {},
		_eventMapping = {
			onError: events.ERROR,
			onReady: events.PLAYEASE_READY,
			onMetaData: events.PLAYEASE_METADATA,
			onBuffering: events.PLAYEASE_BUFFERING,
			onPlaying: events.PLAYEASE_PLAYING,
			onPaused: events.PLAYEASE_PAUSED,
			onReloading: events.PLAYEASE_RELOADING,
			onSeeking: events.PLAYEASE_SEEKING,
			onStopped: events.PLAYEASE_STOPPED,
			onReport: events.PLAYEASE_REPORT,
			onMute: events.PLAYEASE_MUTE,
			onVolume: events.PLAYEASE_VOLUME,
			onVideoOff: events.PLAYEASE_VIDEOOFF,
			onHD: events.PLAYEASE_HD,
			onBullet: events.PLAYEASE_BULLET,
			onFullpage: events.PLAYEASE_FULLPAGE,
			onFullscreen: events.PLAYEASE_FULLSCREEN
		};
	
	playease.api = function(container) {
		var _this = utils.extend(this, new events.eventdispatcher('api')),
			_entity;
		
		_this.container = container;
		_this.id = container.id;
		
		function _init() {
			utils.foreach(_eventMapping, function(name, type) {
				_this[name] = function(callback) {
					_this.addEventListener(type, callback);
				};
			});
		}
		
		_this.setup = function(options) {
			utils.emptyElement(_this.container);
			
			playease.debug = !!options.debug;
			
			_this.config = options;
			_this.config.id = _this.id;
			
			_this.embedder = new playease.embed(_this);
			_this.embedder.addGlobalListener(_onEvent);
			_this.embedder.embed();
			
			return _this;
		};
		
		_this.setEntity = function(entity) {
			_entity = entity;
			
			_this.onSWFLoaded = _entity.setup;
			_this.onSWFState = _entity.onSWFState;
			
			_this.play = _entity.play;
			_this.pause = _entity.pause;
			_this.reload = _entity.reload;
			_this.seek = _entity.seek;
			_this.stop = _entity.stop;
			_this.report = _entity.report;
			_this.mute = _entity.mute;
			_this.volume = _entity.volume;
			_this.hd = _entity.hd;
			_this.bullet = _entity.bullet;
			_this.fullpage = _entity.fullpage;
			_this.fullscreen = _entity.fullscreen;
			
			_this.shoot = _entity.shoot;
			_this.resize = _entity.resize;
		};
		
		function _onEvent(e) {
			_forward(e);
		}
		
		function _forward(e) {
			_this.dispatchEvent(e.type, e);
		}
		
		_init();
	};
	
	playease.api.getInstance = function(identifier) {
		var _container;
		
		if (identifier == null) {
			identifier = 0;
		} else if (identifier.nodeType) {
			_container = identifier;
		} else if (utils.typeOf(identifier) === 'string') {
			_container = document.getElementById(identifier);
		}
		
		if (_container) {
			var inst = _insts[_container.id];
			if (!inst) {
				_insts[identifier] = inst = new playease.api(_container);
			}
			return inst;
		} else if (utils.typeOf(identifier) === 'number') {
			return _insts[identifier];
		}
		
		return null;
	};
	
	playease.api.displayError = function(message, config) {
		var displayLayer = document.getElementById(config.id + '-display');
		if (displayLayer && message !== undefined) {
			(displayLayer.lastChild || displayLayer).innerText = message;
		}
	};
})(playease);

(function(playease) {
	var io = playease.io = {};
	
	io.modes = {
		CORS:        'cors',
		NO_CORS:     'no-cors',
		SAME_ORIGIN: 'same-origin'
	},
	io.credentials = {
		OMIT:        'omit',
		INCLUDE:     'include',
		SAME_ORIGIN: 'same-origin'
	},
	io.caches = {
		DEFAULT:        'default',
		NO_STAORE:      'no-store',
		RELOAD:         'reload',
		NO_CACHE:       'no-cache',
		FORCE_CACHE:    'force-cache',
		ONLY_IF_CACHED: 'only-if-cached'
	},
	io.redirects = {
		FOLLOW: 'follow',
		MANUAL: 'manual',
		ERROR:  'error'
	},
	io.readystates = {
		UNINITIALIZED: 0,
		OPEN:          1,
		SENT:          2,
		LOADING:       3,
		DONE:          4
	},
	
	io.types = {
		FETCH_STREAM_LOADER:   'fetch-stream-loader',
		XHR_MS_STREAM_LOADER:  'xhr-ms-stream-loader',
		XHR_MOZ_STREAM_LOADER: 'xhr-moz-stream-loader',
		XHR_CHUNKED_LOADER:    'xhr-chunked-loader',
		WEBSOCKET_LOADER:      'websocket-loader'
	},
	
	io.priority = [
		io.types.FETCH_STREAM_LOADER,
		io.types.XHR_MS_STREAM_LOADER,
		io.types.XHR_MOZ_STREAM_LOADER,
		io.types.XHR_CHUNKED_LOADER,
		io.types.WEBSOCKET_LOADER
	];
})(playease);

(function(playease) {
	var utils = playease.utils,
		events = playease.events,
		io = playease.io,
		modes = io.modes,
		credentials = io.credentials,
		caches = io.caches,
		redirects = io.redirects,
		readystates = io.readystates;
	
	io['fetch-stream-loader'] = function(config) {
		var _this = utils.extend(this, new events.eventdispatcher('utils.fetch-stream-loader')),
			_defaults = {
				method: 'GET',
				headers: {},
				mode: modes.CORS,
				credentials: credentials.OMIT,
				cache: caches.DEFAULT,
				redirect: redirects.FOLLOW
			},
			_state,
			_url,
			_abort;
		
		function _init() {
			_this.name = io.types.FETCH_STREAM_LOADER;
			
			_this.config = utils.extend({}, _defaults, config);
			
			_state = readystates.UNINITIALIZED;
			_abort = undefined;
		}
		
		_this.load = function(url, start, end) {
			_url = url;
			
			if (!io[_this.name].isSupported(url)) {
				_this.dispatchEvent(events.ERROR, { message: 'Loader error: fetch-stream-loader is not supported.' });
				return;
			}
			
			_state = readystates.OPEN;
			
			if (start || end) {
				utils.extend(_this.config.headers, {
					Range: 'bytes=' + start + '-' + end
				});
			}
			
			var options = utils.extend({}, _this.config, {
				headers: new Headers(_this.config.headers)
			});
			
			Promise.race([
				new Promise(function(resolve, reject) {
					_abort = function() {
						reject(new Error('Loader aborted.'));
					};
				})
				['catch'](function(e) {
					utils.log(e.message);
				}),
				
				fetch(_url, options)
				['then'](function(res) {
					if (_state == readystates.UNINITIALIZED) {
						return Promise.reject(new Error('Promise rejected.'));
					}
					
					if (res.ok && res.status >= 200 && res.status <= 299) {
						var len = res.headers.get('Content-Length');
						if (len) {
							len = parseInt(len);
						}
						
						if (res.status == 206) {
							var range = res.headers.get('Content-Range');
							if (range) {
								var arr = range.match(/bytes (\d*)\-(\d*)\/(\d+)/i);
								if (arr && arr.length > 3) {
									len = parseInt(arr[3]);
								}
							}
						}
						
						_this.dispatchEvent(events.PLAYEASE_CONTENT_LENGTH, { length: len || 0 });
						
						return _pump(res.body.getReader());
					} else {
						_this.dispatchEvent(events.ERROR, { message: 'Loader error: Invalid http status(' + res.status + ' ' + res.statusText + ').' });
						return Promise.reject(new Error('Promise rejected.'));
					}
				})
				['catch'](function(e) {
					_this.dispatchEvent(events.ERROR, { message: 'Loader error: ' + e.message });
				})
			]);
		};
		
		function _pump(reader) {
			return reader.read()
				['then'](function(res) {
					if (res.done) {
						_state = readystates.DONE;
						_this.dispatchEvent(events.PLAYEASE_COMPLETE);
						return Promise.resolve('Loader completed.');
					}
					
					if (_state == readystates.UNINITIALIZED) {
						return reader.cancel();
					}
					
					_state = readystates.LOADING;
					_this.dispatchEvent(events.PLAYEASE_PROGRESS, { data: res.value.buffer });
					
					return _pump(reader);
				})
				['catch'](function(e) {
					_this.dispatchEvent(events.ERROR, { message: 'Loader error: Failed to read response data.' });
				});
		}
		
		_this.abort = function() {
			_state = readystates.UNINITIALIZED;
			
			if (_abort) {
				_abort.apply(null);
			}
		};
		
		_this.state = function() {
			return _state;
		};
		
		_init();
	};
	
	io['fetch-stream-loader'].isSupported = function(file) {
		var protocol = utils.getProtocol(file);
		if (protocol != 'http' && protocol != 'https') {
			return false;
		}
		
		if (!utils.isChrome() || !fetch) {
			return false;
		}
		
		return true;
	};
})(playease);

(function(playease) {
	var utils = playease.utils,
		events = playease.events,
		io = playease.io,
		modes = io.modes,
		credentials = io.credentials,
		caches = io.caches,
		redirects = io.redirects,
		readystates = io.readystates;
	
	io['xhr-ms-stream-loader'] = function(config) {
		var _this = utils.extend(this, new events.eventdispatcher('utils.xhr-ms-stream-loader')),
			_defaults = {
				method: 'GET',
				headers: {},
				mode: modes.CORS,
				credentials: credentials.OMIT,
				cache: caches.DEFAULT,
				redirect: redirects.FOLLOW
			},
			_state,
			_url,
			_reader,
			_xhr;
		
		function _init() {
			_this.name = io.types.XHR_MS_STREAM_LOADER;
			
			_this.config = utils.extend({}, _defaults, config);
			
			_state = readystates.UNINITIALIZED;
		}
		
		_this.load = function(url, start, end) {
			_url = url;
			
			if (!io[_this.name].isSupported(url)) {
				_this.dispatchEvent(events.ERROR, { message: 'Loader error: ' + _this.name + ' is not supported.' });
				return;
			}
			
			_reader = new MSStreamReader();
			_reader.position = 0;
			_reader.onprogress = _onMSRProgress;
			_reader.onload = _onMSRLoad;
			_reader.onerror = _onMSRError;
			
			_xhr = new XMLHttpRequest();
			_xhr.open(_this.config.method, _url, true);
			_xhr.responseType = 'ms-stream';
			_xhr.onreadystatechange = _onXHRReadyStateChange;
			_xhr.onerror = _onXHRError;
			
			if (start || end) {
				utils.extend(_this.config.headers, {
					Range: 'bytes=' + start + '-' + end
				});
			}
			
			utils.foreach(_this.config.headers, function(key, value) {
				_xhr.setRequestHeader(key, value);
			});
			
			switch (_this.config.credentials) {
				case credentials.INCLUDE:
					_xhr.withCredentials = true;
					break;
				case credentials.SAME_ORIGIN:
					_xhr.withCredentials = window.location.host == utils.getOrigin(_url);
					break;
				default:
					_xhr.withCredentials = false;
			}
			
			_xhr.send();
		};
		
		function _onXHRReadyStateChange(e) {
			_state = _xhr.readyState;
			
			if (_xhr.readyState == readystates.SENT) {
				if (_xhr.status >= 200 && _xhr.status <= 299) {
					var len = _xhr.getResponseHeader('Content-Length');
					if (len) {
						len = parseInt(len);
					}
					
					if (_xhr.status == 206) {
						var range = _xhr.getResponseHeader('Content-Range');
						if (range) {
							var arr = range.match(/bytes (\d*)\-(\d*)\/(\d+)/i);
							if (arr && arr.length > 3) {
								len = parseInt(arr[3]);
							}
						}
					}
					
					_this.dispatchEvent(events.PLAYEASE_CONTENT_LENGTH, { length: len || 0 });
				} else {
					_this.dispatchEvent(events.ERROR, { message: 'Loader error: Invalid http status(' + _xhr.status + ' ' + _xhr.statusText + ').' });
				}
			} else if (_xhr.readyState == readystates.LOADING) {
				if (_xhr.status >= 200 && _xhr.status <= 299) {
					var mss = _xhr.response;
					_reader.readAsArrayBuffer(mss);
				} else {
					_this.dispatchEvent(events.ERROR, { message: 'Loader error: Invalid http status(' + _xhr.status + ' ' + _xhr.statusText + ').' });
				}
			}
		}
		
		function _onXHRError(e) {
			_this.dispatchEvent(events.ERROR, { message: 'Loader error: ' + e.message });
		}
		
		function _onMSRProgress(e) {
			var data = _reader.result;
			if (data == null) {
				utils.log('Something went wrong???');
				return;
			}
			
			var pos = _reader.position;
			_reader.position = data.byteLength;
			
			var chunk = new Uint8Array(data.slice(pos));
			_this.dispatchEvent(events.PLAYEASE_PROGRESS, { data: chunk.buffer });
		}
		
		function _onMSRLoad(e) {
			_this.dispatchEvent(events.PLAYEASE_COMPLETE);
		}
		
		function _onMSRError(e) {
			_this.dispatchEvent(events.ERROR, { message: 'Loader error: ' + e.message });
		}
		
		_this.abort = function() {
			_state = readystates.UNINITIALIZED;
			
			if (_xhr) {
				_xhr.abort();
			}
		};
		
		_this.state = function() {
			return _state;
		};
		
		_init();
	};
	
	io['xhr-ms-stream-loader'].isSupported = function(file) {
		var protocol = utils.getProtocol(file);
		if (protocol != 'http' && protocol != 'https') {
			return false;
		}
		
		if (utils.isMSIE(10) || utils.isIETrident() || utils.isEdge()) {
			return true;
		}
		
		return false;
	};
})(playease);

(function(playease) {
	var utils = playease.utils,
		events = playease.events,
		io = playease.io,
		modes = io.modes,
		credentials = io.credentials,
		caches = io.caches,
		redirects = io.redirects,
		readystates = io.readystates;
	
	io['xhr-moz-stream-loader'] = function(config) {
		var _this = utils.extend(this, new events.eventdispatcher('utils.xhr-moz-stream-loader')),
			_defaults = {
				method: 'GET',
				headers: {},
				mode: modes.CORS,
				credentials: credentials.OMIT,
				cache: caches.DEFAULT,
				redirect: redirects.FOLLOW
			},
			_state,
			_url,
			_xhr;
		
		function _init() {
			_this.name = io.types.XHR_MOZ_STREAM_LOADER;
			
			_this.config = utils.extend({}, _defaults, config);
			
			_state = readystates.UNINITIALIZED;
		}
		
		_this.load = function(url, start, end) {
			_url = url;
			
			if (!io[_this.name].isSupported(url)) {
				_this.dispatchEvent(events.ERROR, { message: 'Loader error: ' + _this.name + ' is not supported.' });
				return;
			}
			
			_xhr = new XMLHttpRequest();
			_xhr.open(_this.config.method, _url, true);
			_xhr.responseType = 'moz-chunked-arraybuffer';
			_xhr.onreadystatechange = _onXHRReadyStateChange;
			_xhr.onprogress = _onXHRProgress;
			_xhr.onloadend = _onXHRLoadend;
			_xhr.onerror = _onXHRError;
			
			if (start || end) {
				utils.extend(_this.config.headers, {
					Range: 'bytes=' + start + '-' + end
				});
			}
			
			utils.foreach(_this.config.headers, function(key, value) {
				_xhr.setRequestHeader(key, value);
			});
			
			switch (_this.config.credentials) {
				case credentials.INCLUDE:
					_xhr.withCredentials = true;
					break;
				case credentials.SAME_ORIGIN:
					_xhr.withCredentials = window.location.host == utils.getOrigin(_url);
					break;
				default:
					_xhr.withCredentials = false;
			}
			
			_xhr.send();
		};
		
		function _onXHRReadyStateChange(e) {
			_state = _xhr.readyState;
			
			if (_xhr.readyState == readystates.SENT) {
				if (_xhr.status >= 200 && _xhr.status <= 299) {
					var len = _xhr.getResponseHeader('Content-Length');
					if (len) {
						len = parseInt(len);
					}
					
					if (_xhr.status == 206) {
						var range = _xhr.getResponseHeader('Content-Range');
						if (range) {
							var arr = range.match(/bytes (\d*)\-(\d*)\/(\d+)/i);
							if (arr && arr.length > 3) {
								len = parseInt(arr[3]);
							}
						}
					}
					
					_this.dispatchEvent(events.PLAYEASE_CONTENT_LENGTH, { length: len || 0 });
				} else {
					_this.dispatchEvent(events.ERROR, { message: 'Loader error: Invalid http status(' + _xhr.status + ' ' + _xhr.statusText + ').' });
				}
			}
		}
		
		function _onXHRProgress(e) {
			var data = new Uint8Array(_xhr.response);
			_this.dispatchEvent(events.PLAYEASE_PROGRESS, { data: data.buffer });
		}
		
		function _onXHRLoadend(e) {
			_this.dispatchEvent(events.PLAYEASE_COMPLETE);
		}
		
		function _onXHRError(e) {
			_this.dispatchEvent(events.ERROR, { message: 'Loader error: ' + e.message });
		}
		
		_this.abort = function() {
			_state = readystates.UNINITIALIZED;
			
			if (_xhr) {
				_xhr.abort();
			}
		};
		
		_this.state = function() {
			return _state;
		};
		
		_init();
	};
	
	io['xhr-moz-stream-loader'].isSupported = function(file) {
		var protocol = utils.getProtocol(file);
		if (protocol != 'http' && protocol != 'https') {
			return false;
		}
		
		return utils.isFirefox();
	};
})(playease);

(function(playease) {
	var utils = playease.utils,
		events = playease.events,
		io = playease.io,
		modes = io.modes,
		credentials = io.credentials,
		caches = io.caches,
		redirects = io.redirects,
		readystates = io.readystates,
		
		responseTypes = {
			ARRAYBUFFER: 'arraybuffer',
			BLOB:        'blob',
			DOCUMENT:    'document',
			JSON:        'json',
			TEXT:        'text'
		};
	
	io['xhr-chunked-loader'] = function(config) {
		var _this = utils.extend(this, new events.eventdispatcher('utils.xhr-chunked-loader')),
			_defaults = {
				method: 'GET',
				headers: {},
				mode: modes.CORS,
				credentials: credentials.OMIT,
				cache: caches.DEFAULT,
				redirect: redirects.FOLLOW,
				chunkSize: 0,
				responseType: responseTypes.TEXT
			},
			_state,
			_url,
			_xhr,
			_range,
			_filesize;
		
		function _init() {
			_this.name = io.types.XHR_CHUNKED_LOADER;
			
			_this.config = utils.extend({}, _defaults, config);
			
			_state = readystates.UNINITIALIZED;
			_range = { start: 0, end: '', position: 0 };
			_filesize = Number.MAX_VALUE;
		}
		
		_this.load = function(url, start, end) {
			_url = url;
			
			if (!io[_this.name].isSupported(url)) {
				_this.dispatchEvent(events.ERROR, { message: 'Loader error: ' + _this.name + ' is not supported.' });
				return;
			}
			
			_xhr = new XMLHttpRequest();
			_xhr.open(_this.config.method, _url, true);
			_xhr.responseType = _this.config.responseType;
			_xhr.onreadystatechange = _onXHRReadyStateChange;
			_xhr.onprogress = _onXHRProgress;
			_xhr.onload = _onXHRLoad;
			_xhr.onerror = _onXHRError;
			
			if (start || end) {
				_range.start = start;
				_range.end = end;
			}
			if (_range.start || _range.end || _this.config.chunkSize) {
				utils.extend(_this.config.headers, {
					Range: 'bytes=' + _range.position + '-' + (Math.min(_filesize, _range.position + _this.config.chunkSize) - 1)
				});
			}
			
			utils.foreach(_this.config.headers, function(key, value) {
				_xhr.setRequestHeader(key, value);
			});
			
			switch (_this.config.credentials) {
				case credentials.INCLUDE:
					_xhr.withCredentials = true;
					break;
				case credentials.SAME_ORIGIN:
					_xhr.withCredentials = window.location.host == utils.getOrigin(_url);
					break;
				default:
					_xhr.withCredentials = false;
			}
			
			_xhr.send();
		};
		
		function _onXHRReadyStateChange(e) {
			_state = _xhr.readyState;
			
			if (_xhr.readyState == readystates.SENT) {
				if (_xhr.status >= 200 && _xhr.status <= 299) {
					
				} else {
					_this.dispatchEvent(events.ERROR, { message: 'Loader error: Invalid http status(' + _xhr.status + ' ' + _xhr.statusText + ').' });
				}
			}
		}
		
		function _onXHRProgress(e) {
			/* void */
		}
		
		function _onXHRLoad(e) {
			var data, len;
			
			switch (_xhr.responseType) {
				case responseTypes.ARRAYBUFFER:
					var arr = new Uint8Array(_xhr.response);
					data = arr.buffer;
					len = data.byteLength;
					break;
					
				case responseTypes.BLOB:
					// TODO: read blob.
					break;
					
				default:
					data = _xhr.response;
					len = data.length;
					break;
			}
			
			_range.position = len;
			_filesize = len;
			_this.dispatchEvent(events.PLAYEASE_CONTENT_LENGTH, { length: len });
			
			_this.dispatchEvent(events.PLAYEASE_PROGRESS, { data: data });
			
			var end = _range.end ? Math.min(_range.end, _filesize - 1) : _filesize - 1;
			if (_range.position > end) {
				_this.dispatchEvent(events.PLAYEASE_COMPLETE);
				return;
			}
			
			utils.extend(_this.config.headers, {
				Range: 'bytes=' + _range.position + '-' + (Math.min(_filesize, _range.position + _this.config.chunkSize) - 1)
			});
			
			_xhr.open(_this.config.method, _url, true);
			_xhr.setRequestHeader('Range', _this.config.headers.Range);
			_xhr.send();
		}
		
		function _onXHRError(e) {
			_this.dispatchEvent(events.ERROR, { message: 'Loader error: ' + e.message });
		}
		
		_this.abort = function() {
			_state = readystates.UNINITIALIZED;
			
			if (_xhr) {
				_xhr.abort();
			}
		};
		
		_this.state = function() {
			return _state;
		};
		
		_init();
	};
	
	io['xhr-chunked-loader'].isSupported = function(file) {
		var protocol = utils.getProtocol(file);
		if (protocol != 'http' && protocol != 'https') {
			return false;
		}
		
		return true;
	};
})(playease);

(function(playease) {
	var utils = playease.utils,
		events = playease.events,
		io = playease.io,
		modes = io.modes,
		credentials = io.credentials,
		caches = io.caches,
		redirects = io.redirects,
		readystates = io.readystates;
	
	io['websocket-loader'] = function(config) {
		var _this = utils.extend(this, new events.eventdispatcher('utils.websocket-loader')),
			_defaults = {
				method: 'GET',
				headers: {},
				mode: modes.CORS,
				credentials: credentials.OMIT,
				cache: caches.DEFAULT,
				redirect: redirects.FOLLOW
			},
			_state,
			_url,
			_websocket;
		
		function _init() {
			_this.name = io.types.WEBSOCKET_LOADER;
			
			_this.config = utils.extend({}, _defaults, config);
			
			_state = readystates.UNINITIALIZED;
		}
		
		_this.load = function(url, start, end) {
			_url = url;
			
			if (!io[_this.name].isSupported(url)) {
				_this.dispatchEvent(events.ERROR, { message: 'Loader error: ' + _this.name + ' is not supported.' });
				return;
			}
			
			window.WebSocket = window.WebSocket || window.MozWebSocket;
			if (window.WebSocket) {
				_websocket = new WebSocket(_url);
				_websocket.binaryType = 'arraybuffer';
				
				_websocket.onopen = _onOpen;
				_websocket.onmessage = _onMessage;
				_websocket.onerror = _onError;
				_websocket.onclose = _onClose;
			}
			
			if (!_websocket) {
				_this.dispatchEvent(events.ERROR, { message: 'Loader error: Failed to initialize websocket.' });
				return;
			}
			
			//_websocket.send();
		};
		
		function _onOpen(e) {
			_state = readystates.SENT;
		}
		
		function _onMessage(e) {
			var data = new Uint8Array(e.data);
			_this.dispatchEvent(events.PLAYEASE_PROGRESS, { data: data.buffer });
		}
		
		function _onError(e) {
			_state = readystates.UNINITIALIZED;
			
			// No event dispatching
			//_this.dispatchEvent(events.ERROR, { message: 'Loader error: ' + e.message });
		}
		
		function _onClose(e) {
			_state = readystates.UNINITIALIZED;
			_this.dispatchEvent(events.ERROR, { message: 'Loader error: ' + e.code + (e.reason ? ' - ' + e.reason : '') });
		}
		
		_this.abort = function() {
			_state = readystates.UNINITIALIZED;
			
			if (_websocket && (_websocket.readyState == WebSocket.CONNECTING || _websocket.readyState == WebSocket.OPEN)) {
				_websocket.close();
			}
		};
		
		_this.state = function() {
			return _state;
		};
		
		_init();
	};
	
	io['websocket-loader'].isSupported = function(file) {
		var protocol = utils.getProtocol(file);
		if (protocol != 'ws' && protocol != 'wss') {
			return false;
		}
		
		if (utils.isMSIE('(8|9)')) {
			return false;
		}
		
		return true;
	};
})(playease);

(function(playease) {
	playease.muxer = {};
})(playease);

(function(playease) {
	var utils = playease.utils,
		events = playease.events,
		muxer = playease.muxer;
	
	var AMF = muxer.AMF = {};
	var types = AMF.types = {
		DOUBLE:        0x00,
		BOOLEAN:       0x01,
		STRING:        0x02,
		OBJECT:        0x03,
		MOVIE_CLIP:    0x04, // Not available in Remoting
		NULL:          0x05,
		UNDEFINED:     0x06,
		REFERENCE:     0x07,
		MIXED_ARRAY:   0x08,
		END_OF_OBJECT: 0x09,
		ARRAY:         0x0A,
		DATE:          0x0B,
		LONG_STRING:   0x0C,
		UNSUPPORTED:   0x0D,
		RECORD_SET:    0x0E, // Remoting, server-to-client only
		XML:           0x0F,
		TYPED_OBJECT:  0x10, // Class instance
		AMF3_DATA:     0x11  // Sent by Flash player 9+
	};
	
	AMF.parse = function(arrayBuffer, dataOffset, dataSize) {
		var data = {};
		
		try {
			var key = AMF.parseValue(arrayBuffer, dataOffset, dataSize);
			var value = AMF.parseValue(arrayBuffer, dataOffset + key.size, dataSize - key.size);
			
			data.key = key.data;
			data.value = value.data;
		} catch(e) {
			utils.log('AMF.parse() failed. Error: ' + e);
		}
		
		return data;
	};
	
	AMF.parseObject = function(arrayBuffer, dataOffset, dataSize) {
		if (dataSize < 3) {
			throw 'Data not enough while parsing AMF object.';
		}
		
		var obj = {};
		var pos = 0;
		
		var key, value = { ended: false };
		
		while (!value.ended && pos < dataSize) {
			key = AMF.parseString(arrayBuffer, dataOffset + pos, dataSize - pos);
			pos += key.size;
			
			value = AMF.parseValue(arrayBuffer, dataOffset + pos, dataSize - pos);
			pos += value.size;
			
			if (key.data && value.data) {
				obj[key.data] = value.data;
			}
		}
		
		return {
			data: obj,
			size: pos,
			ended: value.ended
		};
	};
	
	AMF.parseString = function(arrayBuffer, dataOffset, dataSize) {
		if (dataSize < 2) {
			throw 'Data not enough while parsing AMF string.';
		}
		
		var v = new DataView(arrayBuffer, dataOffset, dataSize);
		
		var pos = 0;
		var length = v.getUint16(pos);
		
		pos += 2;
		
		var str = void 0;
		if (length > 0) {
			str = String.fromCharCode.apply(String, new Uint8Array(arrayBuffer, dataOffset + pos, length));
		} else {
			str = '';
		}
		
		pos += length;
		
		return {
			data: str,
			size: pos
		};
	};
	
	AMF.parseLongString = function(arrayBuffer, dataOffset, dataSize) {
		if (dataSize < 4) {
			throw 'Data not enough while parsing AMF long string.';
		}
		
		var v = new DataView(arrayBuffer, dataOffset, dataSize);
		
		var pos = 0;
		var length = v.getUint32(pos);
		
		pos += 4;
		
		var str = void 0;
		if (length > 0) {
			str = String.fromCharCode.apply(String, new Uint8Array(arrayBuffer, dataOffset + pos, length));
		} else {
			str = '';
		}
		
		pos += length;
		
		return {
			data: str,
			size: pos
		};
	};
	
	AMF.parseDate = function(arrayBuffer, dataOffset, dataSize) {
		if (dataSize < 10) {
			throw 'Data not enough while parsing AMF date.';
		}
		
		var v = new DataView(arrayBuffer, dataOffset, dataSize);
		
		var pos = 0;
		var timestamp = v.getFloat64(pos);
		
		pos += 8;
		
		var timeoffset = v.getInt16(pos);
		timestamp += timeoffset * 60 * 1000;
		
		pos += 2;
		
		return {
			data: new Date(timestamp),
			size: pos
		};
	};
	
	AMF.parseValue = function(arrayBuffer, dataOffset, dataSize) {
		if (dataSize < 1) {
			throw 'Data not enough while parsing AMF value.';
		}
		
		var v = new DataView(arrayBuffer, dataOffset, dataSize);
		
		var pos = 0;
		var type = v.getUint8(pos);
		
		pos += 1;
		
		var value = void 0;
		var ended = false;
		
		try {
			switch (type) {
				case types.DOUBLE:
					value = v.getFloat64(pos);
					pos += 8;
					break;
				case types.BOOLEAN:
					var b = v.getUint8(pos);
					value = b ? true : false;
					pos += 1;
					break;
				case types.STRING:
					var str = AMF.parseString(arrayBuffer, dataOffset + pos, dataSize - pos);
					value = str.data;
					pos += str.size;
					break;
				case types.OBJECT:
					var obj = AMF.parseObject(arrayBuffer, dataOffset + pos, dataSize - pos);
					value = obj.data;
					pos += obj.size;
					break;
				case types.MIXED_ARRAY:
					var length = v.getUint32(pos);
					pos += 4;
					
					var arr = AMF.parseObject(arrayBuffer, dataOffset + pos, dataSize - pos);
					value = arr.data;
					pos += arr.size;
					break;
				case types.END_OF_OBJECT:
					value = undefined;
					ended = true;
					break;
				case types.ARRAY:
					var length = v.getUint32(pos);
					pos += 4;
					
					value = [];
					for (var i = 0; i < length; i++) {
						var val = AMF.parseValue(arrayBuffer, dataOffset + pos, dataSize - pos);
						value.push(val.data);
						pos += val.size;
					}
					break;
				case types.DATE:
					var date = AMF.parseDate(arrayBuffer, dataOffset + pos, dataSize - pos);
					value = date.data;
					pos += date.size;
					break;
				case types.LONG_STRING:
					var longstr = AMF.parseString(arrayBuffer, dataOffset + pos, dataSize - pos);
					value = longstr.data;
					pos += longstr.size;
					break;
				default:
					utils.log('Skipping unsupported AMF value type(' + type + ').');
					pos += dataSize;
			}
		} catch(e) {
			utils.log('AMF.parseValue() failed. Error: ' + e);
		}
		
		return {
			data: value,
			size: pos,
			ended: ended
		};
	};
})(playease);

(function(playease) {
	var utils = playease.utils,
		events = playease.events,
		muxer = playease.muxer;
	
	var SPS = muxer.SPS = {};
	
	var ExpGolomb = function(bytes) {
		var _this = this,
			_buffer,
			_bufferIndex,
			_totalBytes,
			_totalBits,
			_currentWord,
			_currentWordBitsLeft;
		
		function _init() {
			_buffer = bytes;
			_bufferIndex = 0;
			_totalBytes = bytes.byteLength;
			_totalBits = bytes.byteLength * 8;
			_currentWord = 0;
			_currentWordBitsLeft = 0;
		}
		
		_this.readBits = function(bits) {
			if (bits > 32) {
				throw 'Data not enough while reading bits of ExpGolomb.';
			}
			
			if (bits <= _currentWordBitsLeft) {
				var res = _currentWord >>> (32 - bits);
				_currentWord <<= bits;
				_currentWordBitsLeft -= bits;
				
				return res;
			}
			
			var res = _currentWordBitsLeft ? _currentWord : 0;
			res = res >>> (32 - _currentWordBitsLeft);
			
			var neededBitsLeft = bits - _currentWordBitsLeft;
			_fillCurrentWord();
			
			var nextBits = Math.min(neededBitsLeft, _currentWordBitsLeft);
			var res2 = _currentWord >>> (32 - nextBits);
			_currentWord <<= nextBits;
			_currentWordBitsLeft -= nextBits;
			
			res = (res << nextBits) | res2;
			
			return res;
		};
		
		_this.readBool = function() {
			return _this.readBits(1) === 1;
		};
		
		_this.readByte = function() {
			return _this.readBits(8);
		};
		
		_this.readUEG = function() { // unsigned exponential golomb
			var leadingZeros = _skipLeadingZero();
			
			return _this.readBits(leadingZeros + 1) - 1;
		};
		
		_this.readSEG = function() { // signed exponential golomb
			var value = _this.readUEG();
			if (value & 0x01) {
				return (value + 1) >>> 1;
			}
			
			return -1 * (value >>> 1);
		};
		
		function _fillCurrentWord() {
			var bytesLeft = _totalBytes - _bufferIndex;
			if (bytesLeft <= 0) {
				throw 'Data not enough while filling current word.';
			}
			
			var readingBytes = Math.min(4, bytesLeft);
			var word = new Uint8Array(4);
			word.set(_buffer.subarray(_bufferIndex, _bufferIndex + readingBytes));
			_currentWord = new DataView(word.buffer).getUint32(0, false);
			
			_bufferIndex += readingBytes;
			_currentWordBitsLeft = readingBytes * 8;
		}
		
		function _skipLeadingZero() {
			var zeroCount;
			for (zeroCount = 0; zeroCount < _currentWordBitsLeft; zeroCount++) {
				if ((_currentWord & (0x80000000 >>> zeroCount)) !== 0) {
					_currentWord <<= zeroCount;
					_currentWordBitsLeft -= zeroCount;
					
					return zeroCount;
				}
			}
			
			_fillCurrentWord();
			
			return zeroCount + _skipLeadingZero();
		}
		
		_this.destroy = function() {
			_buffer = null;
		};
		
		_init();
	};
	
	
	SPS.parse = function(bytes) {
		var rbsp = _ebsp2rbsp(bytes);
		var gb = new ExpGolomb(rbsp);
		gb.readByte();
		
		var profile_idc = gb.readByte(); // profile_idc
		gb.readByte();                   // constraint_set_flags[5] + reserved_zero[3]
		
		var level_idc = gb.readByte();   // level_idc
		gb.readUEG();                    // seq_parameter_set_id
		
		var profile_string = _getProfileString(profile_idc);
		var level_string = _getLevelString(level_idc);
		var chroma_format_idc = 1;
		var chroma_format = 420;
		var chroma_format_table = [0, 420, 422, 444];
		var bit_depth = 8;
		
		if (profile_idc === 100 || profile_idc === 110 || profile_idc === 122 || profile_idc === 244
				|| profile_idc === 44 || profile_idc === 83 || profile_idc === 86 || profile_idc === 118
				|| profile_idc === 128 || profile_idc === 138 || profile_idc === 144) {
			chroma_format_idc = gb.readUEG();
			if (chroma_format_idc === 3) {
				gb.readBits(1);             // separate_colour_plane_flag
			}
			if (chroma_format_idc <= 3) {
				chroma_format = chroma_format_table[chroma_format_idc];
			}
			
			bit_depth = gb.readUEG() + 8; // bit_depth_luma_minus8
			gb.readUEG();                 // bit_depth_chroma_minus8
			gb.readBits(1);               // qpprime_y_zero_transform_bypass_flag
			if (gb.readBool()) {          // seq_scaling_matrix_present_flag
				var scaling_list_count = chroma_format_idc !== 3 ? 8 : 12;
				for (var i = 0; i < scaling_list_count; i++) {
					if (gb.readBool()) {      // seq_scaling_list_present_flag
						_skipScalingList(gb, i < 6 ? 16 : 64);
					}
				}
			}
		}
		
		gb.readUEG();     // log2_max_frame_num_minus4
		
		var pic_order_cnt_type = gb.readUEG();
		if (pic_order_cnt_type === 0) {
			gb.readUEG();   // log2_max_pic_order_cnt_lsb_minus_4
		} else if (pic_order_cnt_type === 1) {
			gb.readBits(1); // delta_pic_order_always_zero_flag
			gb.readSEG();   // offset_for_non_ref_pic
			gb.readSEG();   // offset_for_top_to_bottom_field
			
			var num_ref_frames_in_pic_order_cnt_cycle = gb.readUEG();
			for (var _i = 0; _i < num_ref_frames_in_pic_order_cnt_cycle; _i++) {
				gb.readSEG(); // offset_for_ref_frame
			}
		}
		
		gb.readUEG();     // max_num_ref_frames
		gb.readBits(1);   // gaps_in_frame_num_value_allowed_flag
		
		var pic_width_in_mbs_minus1 = gb.readUEG();
		var pic_height_in_map_units_minus1 = gb.readUEG();
		
		var frame_mbs_only_flag = gb.readBits(1);
		if (frame_mbs_only_flag === 0) {
			gb.readBits(1); // mb_adaptive_frame_field_flag
		}
		
		gb.readBits(1);   // direct_8x8_inference_flag
		
		var frame_crop_left_offset = 0;
		var frame_crop_right_offset = 0;
		var frame_crop_top_offset = 0;
		var frame_crop_bottom_offset = 0;
		
		var frame_cropping_flag = gb.readBool();
		if (frame_cropping_flag) {
			frame_crop_left_offset = gb.readUEG();
			frame_crop_right_offset = gb.readUEG();
			frame_crop_top_offset = gb.readUEG();
			frame_crop_bottom_offset = gb.readUEG();
		}
		
		var sar_width = 1,
			sar_height = 1;
		var fps = 0,
			fps_fixed = true,
			fps_num = 0,
			fps_den = 0;
		
		var vui_parameters_present_flag = gb.readBool();
		if (vui_parameters_present_flag) {
			if (gb.readBool()) {   // aspect_ratio_info_present_flag
				var aspect_ratio_idc = gb.readByte();
				var sar_w_table = [1, 12, 10, 16, 40, 24, 20, 32, 80, 18, 15, 64, 160, 4, 3, 2];
				var sar_h_table = [1, 11, 11, 11, 33, 11, 11, 11, 33, 11, 11, 33, 99, 3, 2, 1];
				
				if (aspect_ratio_idc > 0 && aspect_ratio_idc < 16) {
					sar_width = sar_w_table[aspect_ratio_idc - 1];
					sar_height = sar_h_table[aspect_ratio_idc - 1];
				} else if (aspect_ratio_idc === 255) {
					sar_width = gb.readByte() << 8 | gb.readByte();
					sar_height = gb.readByte() << 8 | gb.readByte();
				}
			}
			
			if (gb.readBool()) {   // overscan_info_present_flag
				gb.readBool();       // overscan_appropriate_flag
			}
			if (gb.readBool()) {   // video_signal_type_present_flag
				gb.readBits(4);      // video_format & video_full_range_flag
				if (gb.readBool()) { // colour_description_present_flag
					gb.readBits(24);   // colour_primaries & transfer_characteristics & matrix_coefficients
				}
			}
			if (gb.readBool()) {   // chroma_loc_info_present_flag
				gb.readUEG();        // chroma_sample_loc_type_top_field
				gb.readUEG();        // chroma_sample_loc_type_bottom_field
			}
			if (gb.readBool()) {   // timing_info_present_flag
				var num_units_in_tick = gb.readBits(32);
				var time_scale = gb.readBits(32);
				
				fps_fixed = gb.readBool(); // fixed_frame_rate_flag
				fps_num = time_scale;
				fps_den = num_units_in_tick * 2;
				fps = fps_num / fps_den;
			}
		}
		
		var sarScale = 1;
		if (sar_width !== 1 || sar_height !== 1) {
			sarScale = sar_width / sar_height;
		}
		
		var crop_unit_x = 0,
			crop_unit_y = 0;
		if (chroma_format_idc === 0) {
			crop_unit_x = 1;
			crop_unit_y = 2 - frame_mbs_only_flag;
		} else {
			var sub_wc = chroma_format_idc === 3 ? 1 : 2;
			var sub_hc = chroma_format_idc === 1 ? 2 : 1;
			crop_unit_x = sub_wc;
			crop_unit_y = sub_hc * (2 - frame_mbs_only_flag);
		}
		
		var codec_width = (pic_width_in_mbs_minus1 + 1) * 16;
		var codec_height = (2 - frame_mbs_only_flag) * ((pic_height_in_map_units_minus1 + 1) * 16);
		
		codec_width -= (frame_crop_left_offset + frame_crop_right_offset) * crop_unit_x;
		codec_height -= (frame_crop_top_offset + frame_crop_bottom_offset) * crop_unit_y;
		
		var present_width = Math.ceil(codec_width * sarScale);
		
		gb.destroy();
		gb = null;
		
		return {
			profile_string: profile_string, // baseline, high, high10, ...
			level_string: level_string,     // 3, 3.1, 4, 4.1, 5, 5.1, ...
			bit_depth: bit_depth,           // 8bit, 10bit, ...
			chroma_format: chroma_format,   // 4:2:0, 4:2:2, ...
			chroma_format_string: _getChromaFormatString(chroma_format),
			frame_rate: {
				fixed: fps_fixed,
				fps: fps,
				fps_den: fps_den,
				fps_num: fps_num
			},
			sar_ratio: {
				width: sar_width,
				height: sar_height
			},
			codec_size: {
				width: codec_width,
				height: codec_height
			},
			present_size: {
				width: present_width,
				height: codec_height
			}
		};
	};
	
	function _ebsp2rbsp(bytes) {
		var len = bytes.byteLength;
		var dst = new Uint8Array(len);
		var index = 0;
		
		for (var i = 0; i < len; i++) {
			if (i >= 2) {
				if (bytes[i] === 0x03 && bytes[i - 1] === 0x00 && bytes[i - 2] === 0x00) { // Unescape: Skip 0x03 after 00 00
					continue;
				}
			}
			
			dst[index] = bytes[i];
			index++;
		}
		
		return new Uint8Array(dst.buffer, 0, index);
	}
	
	function _skipScalingList(gb, count) {
		var last_scale = 8,
			next_scale = 8,
			delta_scale = 0;
		
		for (var i = 0; i < count; i++) {
			if (next_scale !== 0) {
				delta_scale = gb.readSEG();
				next_scale = (last_scale + delta_scale + 256) % 256;
			}
			
			last_scale = next_scale === 0 ? last_scale : next_scale;
		}
	}
	
	function _getProfileString(profile_idc) {
		var str;
		
		switch (profile_idc) {
			case 66:
				str = 'Baseline';
				break;
			case 77:
				str = 'Main';
				break;
			case 88:
				str = 'Extended';
				break;
			case 100:
				str = 'High';
				break;
			case 110:
				str = 'High10';
				break;
			case 122:
				str = 'High422';
				break;
			case 244:
				str = 'High444';
				break;
			default:
				str = 'Unknown';
		}
		
		return str;
	}
	
	function _getLevelString(level_idc) {
		return (level_idc / 10).toFixed(1);
	}
	
	function _getChromaFormatString(chroma) {
		var str;
		
		switch (chroma) {
			case 420:
				str = '4:2:0';
				break;
			case 422:
				str = '4:2:2';
				break;
			case 444:
				str = '4:4:4';
				break;
			default:
				str = 'Unknown';
		}
		
		return str;
	}
})(playease);

(function(playease) {
	var utils = playease.utils,
		events = playease.events,
		muxer = playease.muxer,
		SPS = muxer.SPS,
		
		TAG = {
			AUDIO:  0x08,
			VIDEO:  0x09,
			SCRIPT: 0x12
		},
		FORMATS = {
			LINEAR_PCM_PLATFORM_ENDIAN:   0x0,
			ADPCM:                        0x1,
			MP3:                          0x2,
			LINEAR_PCM_LITTLE_ENDIAN:     0x3,
			NELLYMOSER_16_kHz_MONO:       0x4,
			NELLYMOSER_8_kHz_MONO:        0x5,
			NELLYMOSER:                   0x6,
			G_711_A_LAW_LOGARITHMIC_PCM:  0x7,
			G_711_MU_LAW_LOGARITHMIC_PCM: 0x8,
			RESERVED:                     0x9,
			AAC:                          0xA,
			SPEEX:                        0xB,
			MP3_8_kHz:                    0xE,
			DEVICE_SPECIFIC_SOUND:        0xF
		},
		FRAMES = {
			KEYFRAME:               0x1,
			INTER_FRAME:            0x2,
			DISPOSABLE_INTER_FRAME: 0x3,
			GENERATED_KEYFRAME:     0x4,
			INFO_OR_COMMAND_FRAME:  0x5
		},
		CODECS = {
			JPEG:           0x1,
			H263:           0x2,
			SCREEN_VIDEO:   0x3,
			VP6:            0x4,
			VP6_ALPHA:      0x5,
			SCREEN_VIDEO_2: 0x6,
			AVC:            0x7
		},
		AVC = {
			types: {
				SEQUENCE_HEADER: 0x00,
				NALU:            0x01,
				END_OF_SEQUENCE: 0x02
			}
		},
		AAC = {
			types: {
				SPECIFIC_CONFIG: 0x00,
				RAW_FRAME_DATA:  0x01
			},
			audioObjectTypes: {
				NULL:          0x00,
				AAC_MAIN:      0x01,
				AAC_LC:        0x02,
				AAC_SSR:       0x03, // Scalable Sample Rate
				AAC_LTP:       0x04, // Long Term Prediction
				AAC_HE_OR_SBR: 0x05, // Spectral Band Replication
				AAC_SCALABLE:  0x06
			},
			samplingRates: [96000, 88200, 64000, 48000, 44100, 32000, 24000, 22050, 16000, 12000, 11025, 8000, 7350]
		},
		rates = [5500, 11025, 22050, 44100],
		states = {
			START:  1, // just enum values
			HEADER: 2,
			DATA:   3,
			SIZE:   4
		};
	
	var mediainfo = function() {
		var _this = this,
			_defaults = {};
		
		function _init() {
			_this.mimeType = null;
			_this.duration = null;
			
			_this.hasAudio = null;
			_this.hasVideo = null;
			_this.audioCodec = null;
			_this.videoCodec = null;
			_this.audioDataRate = null;
			_this.videoDataRate = null;
			
			_this.audioSampleRate = null;
			_this.audioChannelCount = null;
			
			_this.width = null;
			_this.height = null;
			_this.fps = null;
			_this.profile = null;
			_this.level = null;
			_this.chromaFormat = null;
			_this.sarNum = null;
			_this.sarDen = null;
			
			_this.metadata = null;
			_this.segments = null;  // MediaInfo[]
			_this.segmentCount = null;
			_this.hasKeyframesIndex = null;
			_this.keyframesIndex = null;
		}
		
		_this.isComplete = function() {
			var audioInfoComplete = (_this.hasAudio === false)
					|| (_this.hasAudio === true && _this.audioCodec != null && _this.audioSampleRate != null && _this.audioChannelCount != null);
			
			var videoInfoComplete = (_this.hasVideo === false)
					|| (_this.hasVideo === true && _this.videoCodec != null && _this.width != null && _this.height != null && _this.fps != null
					&& _this.profile != null && _this.level != null && _this.chromaFormat != null && _this.sarNum != null && _this.sarDen != null);
			
			// keyframesIndex may not be present
			return _this.mimeType != null && _this.duration != null && _this.metadata != null && _this.hasKeyframesIndex != null
					&& audioInfoComplete && videoInfoComplete;
		};
		
		_this.isSeekable = function() {
			return _this.hasKeyframesIndex === true;
		};
		
		_this.getNearestKeyframe = function(milliseconds) {
			if (_this.keyframesIndex == null) {
				return null;
			}
			
			var table = _this.keyframesIndex;
			var keyframeIndex = _search(table.times, milliseconds);
			
			return {
				index: keyframeIndex,
				milliseconds: table.times[keyframeIndex],
				fileposition: table.filepositions[keyframeIndex]
			};
		};
		
		function _search(list, value) {
			var index = 0;
			var last = list.length - 1;
			var mid = 0;
			var lbound = 0;
			var ubound = last;
			
			if (value < list[0]) {
				index = 0;
				lbound = ubound + 1;  // skip search
			}
			
			while (lbound <= ubound) {
				mid = lbound + Math.floor((ubound - lbound) / 2);
				if (mid === last || (value >= list[mid] && value < list[mid + 1])) {
					index = mid;
					break;
				} else if (list[mid] < value) {
					lbound = mid + 1;
				} else {
					ubound = mid - 1;
				}
			}
			
			return index;
		}
	};
	
	
	muxer.flv = function(config) {
		var _this = utils.extend(this, new events.eventdispatcher('muxer.flv')),
			_defaults = {},
			_offset,
			_length,
			_state,
			_hasAudio,
			_hasVideo,
			_header,
			_tagsize,
			_hv,
			_sv,
			_lacking,
			_cachedchunks,
			
			_mediainfo,
			_metadata,
			_referenceFrameRate,
			_videoTrack,
			_audioTrack,
			_lengthSizeMinusOne,
			_timestampBase;
		
		function _init() {
			_this.config = utils.extend({}, _defaults, config);
			
			_offset = 0;
			_length = 0;
			
			_state = states.START;
			
			_header = new ArrayBuffer(11);
			_header.position = 0;
			_hv = new Uint8Array(_header);
			
			_tagsize = new ArrayBuffer(4);
			_tagsize.position = 0;
			_sv = new Uint8Array(_tagsize);
			
			_lacking = 0;
			_cachedchunks = [];
			
			_mediainfo = new mediainfo();
			
			_referenceFrameRate = {
				fixed: true,
				fps: 23.976,
				fps_num: 23976,
				fps_den: 1000
			};
			
			_videoTrack = { type: 'video', id: 1, sequenceNumber: 0, samples: [], length: 0 };
			_audioTrack = { type: 'audio', id: 2, sequenceNumber: 0, samples: [], length: 0 };
			
			_lengthSizeMinusOne = 0;
			_timestampBase = 0;
		}
		
		_this.reset = function() {
			_offset = 0;
			_length = 0;
			
			_state = states.START;
			
			_header.position = 0;
			_cachedchunks = [];
			
			_mediainfo = new mediainfo();
			
			_videoTrack = { type: 'video', id: 1, sequenceNumber: 0, samples: [], length: 0 };
			_audioTrack = { type: 'audio', id: 2, sequenceNumber: 0, samples: [], length: 0 };
			
			_lengthSizeMinusOne = 0;
			_timestampBase = 0;
		};
		
		_this.parse = function(chunk) {
			var dv = new Uint8Array(chunk);
			var pos = 0;
			
			if (_state == states.START) {
				if (chunk.byteLength < 13) {
					return 0;
				}
				
				pos = _this.probe(chunk);
				_state = states.SIZE;
				
				var firstTagSize = utils.getUint32(dv, pos);
				if (firstTagSize) {
					utils.log('First tag size ' + firstTagSize);
				}
				
				pos += 4;
				_state = states.HEADER;
			}
			
			for ( ; pos < chunk.byteLength; ) {
				switch (_state) {
					case states.HEADER:
						_hv[_header.position++] = dv[pos++];
						if (_header.position == 11) {
							_lacking = _hv[1] << 16 | _hv[2] << 8 | _hv[3];
							_state = states.DATA;
						}
						break;
					case states.DATA:
						var tagtype = _hv[0];
						var datasize = _hv[1] << 16 | _hv[2] << 8 | _hv[3];
						var timestamp = _hv[4] << 16 | _hv[5] << 8 | _hv[6] | _hv[7] << 24;
						var streamid = _hv[8] << 16 | _hv[9] << 8 | _hv[10];
						if (streamid != 0) {
							utils.log('Unknown stream ID ' + streamid);
						}
						
						var data = {
							tag: tagtype,
							data: chunk,
							offset: pos,
							size: datasize
						};
						
						switch (tagtype) {
							case TAG.AUDIO:
								data.timestamp = timestamp;
								if (_lacking == datasize) {
									data.format = dv[pos] >>> 4;
									data.rate = rates[(dv[pos] & 0x0C) >>> 2];
									data.samplesize = (dv[pos] & 0x02) >>> 1;
									data.sampletype = dv[pos] & 0x01;
								}
								break;
							case TAG.VIDEO:
								data.timestamp = timestamp;
								if (_lacking == datasize) {
									data.frametype = dv[pos] >>> 4;
									data.codec = dv[pos] & 0x0F;
								}
								break;
							case TAG.SCRIPT:
								data.hasAudio = _hasAudio;
								data.hasVideo = _hasVideo;
								break;
							default:
								// no addition, still dispatch
						}
						
						var actual = Math.min(chunk.byteLength - pos, _lacking);
						_lacking -= actual;
						
						pos += actual;
						
						if (_lacking) {
							_cachedchunks.push(data);
							break;
						}
						
						if (_cachedchunks.length) {
							data = _cachedchunks[0];
							
							var buf = new Uint8Array(datasize);
							buf.position = 0;
							
							var subarr;
							while (_cachedchunks.length) {
								var chk = _cachedchunks.shift();
								subarr = new Uint8Array(chk.data.slice(chk.offset));
								buf.set(subarr, buf.position);
								buf.position += chk.data.byteLength - chk.offset;
							}
							subarr = new Uint8Array(chunk.slice(0, pos));
							buf.set(subarr, buf.position);
							
							data.data = buf.buffer;
							data.offset = 0;
						}
						
						_state = states.SIZE;
						_tagsize.position = 0;
						
						_this.dispatchEvent(events.PLAYEASE_FLV_TAG, data);
						break;
					case states.SIZE:
						_sv[_tagsize.position++] = dv[pos++];
						if (_tagsize.position == 4) {
							var datasize = _hv[1] << 16 | _hv[2] << 8 | _hv[3];
							var prevTagSize = utils.getUint32(_sv);
							if (prevTagSize != 11 + datasize) {
								utils.log('prevTagSize(' + prevTagSize + ') is not equals to ' + (11 + datasize) + '.');
							}
							
							_state = states.HEADER;
							_header.position = 0;
						}
						break;
					default:
						utils.log('Unknown parsing state ' + _state);
						return;
				}
			}
		};
		
		_this.parseAVCVideoPacket = function(arrayBuffer, dataOffset, dataSize, timestamp, frameType) {
			if (dataSize < 5) {
				_this.dispatchEvent(events.ERROR, { message: 'Data not enough while parsing AVC video packet.' });
				return;
			}
			
			var v = new DataView(arrayBuffer, dataOffset, dataSize);
			
			var pos = 1; // skip frametype & codec
			var type = v.getUint8(pos++);
			var cts = v.getUint8(pos++) << 16 | v.getUint8(pos++) << 8 | v.getUint8(pos++); // CompositionTime
			
			switch (type) {
				case AVC.types.SEQUENCE_HEADER:
					_parseAVCDecoderConfigurationRecord(arrayBuffer, dataOffset + pos, dataSize - pos);
					break;
				case AVC.types.NALU:
					_parseAVCVideoData(arrayBuffer, dataOffset + pos, dataSize - pos, timestamp, frameType, cts);
					break;
				case AVC.types.END_OF_SEQUENCE:
					_this.dispatchEvent(events.PLAYEASE_END_OF_STREAM);
					break;
				default:
					_this.dispatchEvent(events.ERROR, { message: 'Unknown AVC video packet type ' + type + '.' });
			}
		};
		
		function _parseAVCDecoderConfigurationRecord(arrayBuffer, dataOffset, dataSize) {
			if (dataSize < 7) {
				_this.dispatchEvent(events.ERROR, { message: 'Data not enough while parsing AVC decoder configuration record.' });
				return;
			}
			
			var track = _videoTrack;
			var videometa = {
				type: track.type,
				id: track.id,
				timescale: 1000,
				duration: _metadata.duration * 1000 || 0
			};
			
			var v = new DataView(arrayBuffer, dataOffset, dataSize);
			
			var pos = 0;
			var configurationVersion = v.getUint8(pos++);
			var AVCProfileIndication = v.getUint8(pos++);
			var profileCompatibility = v.getUint8(pos++);
			var AVCLevelIndication = v.getUint8(pos++);
			
			if (configurationVersion != 1 || AVCProfileIndication == 0) {
				_this.dispatchEvent(events.ERROR, { message: 'Invalid AVCDecoderConfigurationRecord.' });
				return;
			}
			
			_lengthSizeMinusOne = 1 + (v.getUint8(pos++) & 0x03);
			if (_lengthSizeMinusOne != 3 && _lengthSizeMinusOne != 4) {
				_this.dispatchEvent(events.ERROR, { message: 'Invalid lengthSizeMinusOne ' + _lengthSizeMinusOne + '.' });
				return;
			}
			
			var numOfSequenceParameterSets = v.getUint8(pos++) & 0x1F;
			for (var i = 0; i < numOfSequenceParameterSets; i++) {
				var sequenceParameterSetLength = v.getUint16(pos);
				pos += 2;
				
				if (sequenceParameterSetLength == 0) {
					continue;
				}
				
				var sps = new Uint8Array(arrayBuffer, dataOffset + pos, sequenceParameterSetLength);
				pos += sequenceParameterSetLength;
				
				var spsinfo = SPS.parse(sps);
				_copySPSInfo(videometa, spsinfo, sps);
				_copyVideoInfo(videometa, spsinfo);
			}
			
			var numOfPictureParameterSets = v.getUint8(pos++);
			for (var i = 0; i < numOfPictureParameterSets; i++) {
				var pictureParameterSetLength = v.getUint16(pos);
				pos += 2;
				
				if (pictureParameterSetLength == 0) {
					continue;
				}
				
				var pps = new Uint8Array(arrayBuffer, dataOffset + pos, pictureParameterSetLength);
				pos += pictureParameterSetLength;
			}
			
			videometa.avcc = new Uint8Array(dataSize);
			videometa.avcc.set(new Uint8Array(arrayBuffer, dataOffset, dataSize), 0);
			
			_this.dispatchEvent(events.PLAYEASE_AVC_CONFIG_RECORD, { data: videometa });
		}
		
		function _copySPSInfo(videometa, info, sps) {
			videometa.codecWidth = info.codec_size.width;
			videometa.codecHeight = info.codec_size.height;
			videometa.presentWidth = info.present_size.width;
			videometa.presentHeight = info.present_size.height;
			
			videometa.profile = info.profile_string;
			videometa.level = info.level_string;
			videometa.bitDepth = info.bit_depth;
			videometa.chromaFormat = info.chroma_format;
			videometa.sarRatio = info.sar_ratio;
			videometa.frameRate = info.frame_rate;
			
			if (info.frame_rate.fixed === false || info.frame_rate.fps_num === 0 || info.frame_rate.fps_den === 0) {
				videometa.frameRate = _referenceFrameRate;
			}
			
			var fps_den = videometa.frameRate.fps_den;
			var fps_num = videometa.frameRate.fps_num;
			videometa.refSampleDuration = Math.floor(videometa.timescale * (fps_den / fps_num));
			
			var codecArray = sps.subarray(1, 4);
			var codecString = 'avc1.';
			for (var j = 0; j < 3; j++) {
				var h = codecArray[j].toString(16);
				if (h.length < 2) {
					h = '0' + h;
				}
				
				codecString += h;
			}
			
			videometa.codec = codecString;
		}
		
		function _copyVideoInfo(metadata, info) {
			_mediainfo.hasAudio = _hasAudio;
			_mediainfo.hasVideo = _hasVideo;
			_mediainfo.duration = _metadata.duration * 1000;
			_mediainfo.metadata = _metadata;
			
			_mediainfo.width = metadata.codecWidth;
			_mediainfo.height = metadata.codecHeight;
			_mediainfo.fps = metadata.frameRate.fps;
			_mediainfo.profile = metadata.profile;
			_mediainfo.level = metadata.level;
			_mediainfo.chromaFormat = info.chroma_format_string;
			_mediainfo.sarNum = metadata.sarRatio.width;
			_mediainfo.sarDen = metadata.sarRatio.height;
			_mediainfo.videoCodec = metadata.codec;
			
			_mediainfo.mimeType = 'video/mp4; codecs="' + _mediainfo.videoCodec
					+ (_mediainfo.hasAudio && _mediainfo.audioCodec ? ',' + _mediainfo.audioCodec : '') + '"';
			
			if (_mediainfo.isComplete()) {
				_this.dispatchEvent(events.PLAYEASE_MEDIA_INFO, { info: _mediainfo });
			}
		}
		
		function _parseAVCVideoData(arrayBuffer, dataOffset, dataSize, timestamp, frameType, cts) {
			var v = new DataView(arrayBuffer, dataOffset, dataSize);
			
			var units = [];
			var dts = _timestampBase + timestamp;
			var keyframe = frameType == FRAMES.KEYFRAME;
			
			var pos = 0, length = 0;
			while (pos < dataSize) {
				if (pos + 4 >= dataSize) {
					_this.dispatchEvent(events.ERROR, { message: 'Data not enough for next NALU.' });
					return;
				}
				
				var nalusize = v.getUint32(pos);
				if (nalusize == 3) {
					nalusize >>>= 8;
				}
				
				if (nalusize > dataSize - _lengthSizeMinusOne) {
					utils.log('Malformed Nalus near timestamp ' + dts + '.');
					return;
				}
				
				var unitType = v.getUint8(pos + _lengthSizeMinusOne) & 0x1F;
				if (unitType == FRAMES.INFO_OR_COMMAND_FRAME) {
					keyframe = true;
				}
				
				var data = new Uint8Array(arrayBuffer, dataOffset + pos, _lengthSizeMinusOne + nalusize);
				length += data.byteLength;
				
				var unit = { type: unitType, data: data };
				units.push(unit);
				
				pos += _lengthSizeMinusOne + nalusize;
			}
			
			if (units.length == 0) {
				return;
			}
			
			var avcsample = {
				units: units,
				length: length,
				isKeyframe: keyframe,
				cts: cts,
				dts: dts,
				pts: cts + dts
			};
			if (keyframe) {
				//avcsample.fileposition = 
			}
			
			_videoTrack.samples.push(avcsample);
			_videoTrack.length += length;
			
			_this.dispatchEvent(events.PLAYEASE_AVC_SAMPLE, { data: _videoTrack });
		}
		
		
		_this.parseAACAudioPacket = function(arrayBuffer, dataOffset, dataSize, timestamp, rate, samplesize, sampletype) {
			if (dataSize < 2) {
				_this.dispatchEvent(events.ERROR, { message: 'Data not enough while parsing AAC audio packet.' });
				return;
			}
			
			var v = new DataView(arrayBuffer, dataOffset, dataSize);
			
			var pos = 1; // skip format & rate & samplesize & sampletype
			var type = v.getUint8(pos++);
			
			switch (type) {
				case AAC.types.SPECIFIC_CONFIG:
					_parseAACAudioSpecificConfig(arrayBuffer, dataOffset + pos, dataSize - pos, rate, sampletype);
					break;
				case AAC.types.RAW_FRAME_DATA:
					_parseAACAudioData(arrayBuffer, dataOffset + pos, dataSize - pos, timestamp);
					break;
				default:
					_this.dispatchEvent(events.ERROR, { message: 'Unknown AAC audio packet type ' + type + '.' });
			}
		};
		
		function _parseAACAudioSpecificConfig(arrayBuffer, dataOffset, dataSize, rate, sampletype) {
			if (dataSize < 2) {
				_this.dispatchEvent(events.ERROR, { message: 'Data not enough while parsing AAC audio specific config.' });
				return;
			}
			
			var v = new DataView(arrayBuffer, dataOffset, dataSize);
			var pos = 0;
			
			var audioObjectType = v.getUint8(pos) >>> 3;                                 // 5 bits
			var samplingIndex = (v.getUint8(pos++) & 0x07) << 1 | v.getUint8(pos) >>> 7; // 4 bits
			if (samplingIndex < 0 || samplingIndex >= AAC.samplingRates.length) {
				_this.dispatchEvent(events.ERROR, { message: 'Invalid AAC sampling frequency index.', index: samplingIndex });
				return;
			}
			
			var track = _audioTrack;
			var audiometa = {
				type: track.type,
				id: track.id,
				timescale: 1000,
				duration: _metadata.duration * 1000 || 0
			};
			
			audiometa.audioSampleRate = AAC.samplingRates[samplingIndex];
			audiometa.refSampleDuration = Math.floor(1024 / audiometa.audioSampleRate * audiometa.timescale);
			
			var channelConfig = (v.getUint8(pos) & 0x78) >>> 3; // 4 bits
			if (channelConfig < 0 || channelConfig >= 8) {
				_this.dispatchEvent(events.ERROR, { message: 'Invalid AAC channel configuration.', config: channelConfig });
				return;
			}
			
			var extensionSamplingIndex, audioExtensionObjectType;
			if (audioObjectType === AAC.audioObjectTypes.AAC_HE_OR_SBR) {
				if (dataSize < 3) {
					_this.dispatchEvent(events.ERROR, { message: 'Data not enough while parsing AAC_HE_OR_SBR audio specific config.' });
					return;
				}
				
				extensionSamplingIndex = (v.getUint8(pos++) & 0x07) << 1 | v.getUint8(pos) >>> 7; // 4 bits
				audioExtensionObjectType = (v.getUint8(pos) & 0x7C) >>> 2;                        // 5 bits
			}
			
			var config;
			var userAgent = self.navigator.userAgent.toLowerCase();
			if (userAgent.indexOf('firefox') !== -1) {        // firefox: use SBR (HE-AAC) if freq less than 24kHz
				if (samplingIndex >= AAC.audioObjectTypes.AAC_SCALABLE) {
					audioObjectType = AAC.audioObjectTypes.AAC_HE_OR_SBR;
					extensionSamplingIndex = samplingIndex - 3;
					config = new Array(4);
				} else { // use LC-AAC
					audioObjectType = AAC.audioObjectTypes.AAC_LC;
					extensionSamplingIndex = samplingIndex;
					config = new Array(2);
				}
			} else if (userAgent.indexOf('android') !== -1) { // android: always use LC-AAC
				audioObjectType = AAC.audioObjectTypes.AAC_LC;
				extensionSamplingIndex = samplingIndex;
				config = new Array(2);
			} else {                                          // for other browsers,  use HE-AAC to make it easier to switch aac codec profile
				audioObjectType = AAC.audioObjectTypes.AAC_HE_OR_SBR;
				extensionSamplingIndex = samplingIndex;
				config = new Array(4);
				
				if (samplingIndex >= AAC.audioObjectTypes.AAC_SCALABLE) {
					extensionSamplingIndex = samplingIndex - 3;
				} else if (channelConfig === 1) { // Mono channel
					audioObjectType = AAC.audioObjectTypes.AAC_LC;
					extensionSamplingIndex = samplingIndex;
					config = new Array(2);
				}
			}
			
			config[0] = audioObjectType << 3;
			config[0] |= (samplingIndex & 0x0F) >>> 1;
			config[1] = (samplingIndex & 0x0F) << 7;
			config[1] |= (channelConfig & 0x0F) << 3;
			
			if (audioObjectType === AAC.audioObjectTypes.AAC_HE_OR_SBR) {
				config[1] |= (extensionSamplingIndex & 0x0F) >>> 1;
				config[2] = (extensionSamplingIndex & 0x01) << 7;
				// extended audio object type: force to 2 (LC-AAC)
				config[2] |= 2 << 2;
				config[3] = 0;
			}
			
			audiometa.channelCount = channelConfig;
			audiometa.codec = 'mp4a.40.' + audioObjectType;
			audiometa.config = config;
			
			_copyAudioInfo(audiometa);
			
			_this.dispatchEvent(events.PLAYEASE_AAC_SPECIFIC_CONFIG, { data: audiometa });
		}
		
		function _copyAudioInfo(audiometa) {
			_mediainfo.audioCodec = audiometa.codec;
			_mediainfo.audioSampleRate = audiometa.audioSampleRate;
			_mediainfo.audioChannelCount = audiometa.channelCount;
			
			_mediainfo.mimeType = 'video/mp4; codecs="' + _mediainfo.videoCodec
					+ (_mediainfo.hasAudio && _mediainfo.audioCodec ? ',' + _mediainfo.audioCodec : '') + '"';
			
			if (_mediainfo.isComplete()) {
				_this.dispatchEvent(events.PLAYEASE_MEDIA_INFO, { info: _mediainfo });
			}
		}
		
		function _parseAACAudioData(arrayBuffer, dataOffset, dataSize, timestamp) {
			var unit = new Uint8Array(arrayBuffer, dataOffset, dataSize);
			var dts = _timestampBase + timestamp;
			
			var aacsample = {
				unit: unit,
				dts: dts,
				pts: dts
			};
			
			_audioTrack.samples.push(aacsample);
			_audioTrack.length += unit.length;
			
			_this.dispatchEvent(events.PLAYEASE_AAC_SAMPLE, { data: _audioTrack });
		}
		
		
		_this.probe = function(buffer) {
			var data = new Uint8Array(buffer);
			if (data[0] !== 0x46 || data[1] !== 0x4C || data[2] !== 0x56 || data[3] !== 0x01) {
				return 0;
			}
			
			_hasAudio = (data[4] & 4) >>> 2 !== 0;
			_hasVideo = (data[4] & 1) !== 0;
			if (!_hasAudio && !_hasVideo) {
				// Not strict, don't return 0.
			}
			
			var offset = utils.getUint32(data, 5);
			if (offset < 9) {
				return 0;
			}
			
			return offset;
		};
		
		_this.setMetaData = function(metadata) {
			_metadata = metadata;
			
			if (typeof _metadata.audiodatarate === 'number') {
				_mediainfo.audioDataRate = _metadata.audiodatarate;
			}
			if (typeof _metadata.videodatarate === 'number') {
				_mediainfo.videoDataRate = _metadata.videodatarate;
			}
			if (typeof _metadata.framerate === 'number') {
				var fps_num = Math.floor(_metadata.framerate * 1000);
				if (fps_num > 0) {
					var fps = fps_num / 1000;
					
					_referenceFrameRate.fixed = true;
					_referenceFrameRate.fps = fps;
					_referenceFrameRate.fps_num = fps_num;
					_referenceFrameRate.fps_den = 1000;
					_mediainfo.fps = fps;
				}
			}
			if (typeof _metadata.keyframes === 'object') {
				_mediainfo.hasKeyframesIndex = true;
			} else {
				_mediainfo.hasKeyframesIndex = false;
			}
		};
		
		_this.getMetaData = function() {
			return _metadata;
		};
		
		_this.offset = function() {
			return _offset;
		};
		
		_this.length = function() {
			return _length;
		};
		
		_this.destroy = function() {
			
		};
		
		_init();
	};
	
	muxer.flv.TAG = TAG;
	muxer.flv.FORMATS = FORMATS;
	muxer.flv.FRAMES = FRAMES;
	muxer.flv.CODECS = CODECS;
	muxer.flv.AVC = AVC;
	muxer.flv.AAC = AAC;
})(playease);

(function(playease) {
	var utils = playease.utils,
		events = playease.events,
		muxer = playease.muxer,
		
		FRAMES = muxer.flv.FRAMES,
		AAC = muxer.flv.AAC;
	
	var datas = {};
	
	try {
	
	datas.FTYP = new Uint8Array([
		0x69, 0x73, 0x6F, 0x6D, // major_brand: isom
		0x0,  0x0,  0x0,  0x1,  // minor_version: 0x01
		0x69, 0x73, 0x6F, 0x6D, // isom
		0x61, 0x76, 0x63, 0x31  // avc1
	]);
	
	datas.STSD_PREFIX = new Uint8Array([
		0x00, 0x00, 0x00, 0x00, // version(0) + flags
		0x00, 0x00, 0x00, 0x01  // entry_count
	]);
	
	datas.STTS = new Uint8Array([
		0x00, 0x00, 0x00, 0x00, // version(0) + flags
		0x00, 0x00, 0x00, 0x00  // entry_count
	]);
	
	datas.STSC = datas.STCO = datas.STTS;
	
	datas.STSZ = new Uint8Array([
		0x00, 0x00, 0x00, 0x00, // version(0) + flags
		0x00, 0x00, 0x00, 0x00, // sample_size
		0x00, 0x00, 0x00, 0x00  // sample_count
	]);
	
	datas.HDLR_VIDEO = new Uint8Array([
		0x00, 0x00, 0x00, 0x00, // version(0) + flags
		0x00, 0x00, 0x00, 0x00, // pre_defined
		0x76, 0x69, 0x64, 0x65, // handler_type: 'vide'
		0x00, 0x00, 0x00, 0x00, // reserved: 3 * 4 bytes
		0x00, 0x00, 0x00, 0x00,
		0x00, 0x00, 0x00, 0x00,
		0x56, 0x69, 0x64, 0x65,
		0x6F, 0x48, 0x61, 0x6E,
		0x64, 0x6C, 0x65, 0x72, 0x00 // name: VideoHandler
	]);
	
	datas.HDLR_AUDIO = new Uint8Array([
		0x00, 0x00, 0x00, 0x00, // version(0) + flags
		0x00, 0x00, 0x00, 0x00, // pre_defined
		0x73, 0x6F, 0x75, 0x6E, // handler_type: 'soun'
		0x00, 0x00, 0x00, 0x00, // reserved: 3 * 4 bytes
		0x00, 0x00, 0x00, 0x00,
		0x00, 0x00, 0x00, 0x00,
		0x53, 0x6F, 0x75, 0x6E,
		0x64, 0x48, 0x61, 0x6E,
		0x64, 0x6C, 0x65, 0x72, 0x00 // name: SoundHandler
	]);
	
	datas.DREF = new Uint8Array([
		0x00, 0x00, 0x00, 0x00, // version(0) + flags
		0x00, 0x00, 0x00, 0x01, // entry_count
		0x00, 0x00, 0x00, 0x0C, // entry_size
		0x75, 0x72, 0x6C, 0x20, // type 'url '
		0x00, 0x00, 0x00, 0x01  // version(0) + flags
	]);
	
	// Sound media header
	datas.SMHD = new Uint8Array([
		0x00, 0x00, 0x00, 0x00, // version(0) + flags
		0x00, 0x00, 0x00, 0x00  // balance(2) + reserved(2)
	]);
	
	// video media header
	datas.VMHD = new Uint8Array([
		0x00, 0x00, 0x00, 0x01, // version(0) + flags
		0x00, 0x00,             // graphicsmode: 2 bytes
		0x00, 0x00, 0x00, 0x00, // opcolor: 3 * 2 bytes
		0x00, 0x00
	]);
	
	} catch(err) {
		/* void */
	}
	
	AAC.getSilentFrame = function(channelCount) {
		if (channelCount === 1) {
			return new Uint8Array([0x00, 0xc8, 0x00, 0x80, 0x23, 0x80]);
		} else if (channelCount === 2) {
			return new Uint8Array([0x21, 0x00, 0x49, 0x90, 0x02, 0x19, 0x00, 0x23, 0x80]);
		} else if (channelCount === 3) {
			return new Uint8Array([0x00, 0xc8, 0x00, 0x80, 0x20, 0x84, 0x01, 0x26, 0x40, 0x08, 0x64, 0x00, 0x8e]);
		} else if (channelCount === 4) {
			return new Uint8Array([0x00, 0xc8, 0x00, 0x80, 0x20, 0x84, 0x01, 0x26, 0x40, 0x08, 0x64, 0x00, 0x80, 0x2c, 0x80, 0x08, 0x02, 0x38]);
		} else if (channelCount === 5) {
			return new Uint8Array([0x00, 0xc8, 0x00, 0x80, 0x20, 0x84, 0x01, 0x26, 0x40, 0x08, 0x64, 0x00, 0x82, 0x30, 0x04, 0x99, 0x00, 0x21, 0x90, 0x02, 0x38]);
		} else if (channelCount === 6) {
			return new Uint8Array([0x00, 0xc8, 0x00, 0x80, 0x20, 0x84, 0x01, 0x26, 0x40, 0x08, 0x64, 0x00, 0x82, 0x30, 0x04, 0x99, 0x00, 0x21, 0x90, 0x02, 0x00, 0xb2, 0x00, 0x20, 0x08, 0xe0]);
		}
		
		return null;
	};
	
	
	var sampleinfo = function(dts, pts, duration, originalDts, isSync) {
		var _this = this;
		
		function _init() {
			_this.dts = dts;
			_this.pts = pts;
			_this.duration = duration;
			_this.originalDts = originalDts;
			_this.isSyncPoint = isSync;
			_this.fileposition = null;
		}
		
		_init();
	};
	
	var segmentinfo = function() {
		var _this = this,
			_beginDts = 0,
			_endDts = 0,
			_beginPts = 0,
			_endPts = 0,
			_originalBeginDts = 0,
			_originalEndDts = 0,
			_syncPoints = [],    // SampleInfo[n], for video IDR frames only
			_firstSample = null, // SampleInfo
			_lastSample = null;  // SampleInfo
		
		function _init() {
			
		}
		
		_this.appendSyncPoint = function(sampleinfo) {
			sampleinfo.isSyncPoint = true;
			_syncPoints.push(sampleinfo);
		};
		
		_init();
	};
	
	var segmentinfolist = function(type) {
		var _this = this,
			_type = type,
			_list,
			_lastAppendLocation;
		
		function _init() {
			_list = [];
			_lastAppendLocation = -1;
		}
		
		_this.reset = _init;
		
		_this.searchNearestSegmentBefore = function(originalBeginDts) {
			if (_list.length === 0) {
				return -2;
			}
			
			var lastindex = _list.length - 1;
			var midindex = 0;
			var lbound = 0;
			var ubound = lastindex;
			
			var index = 0;
			if (originalBeginDts < _list[0].originalBeginDts) {
				index = -1;
				return index;
			}
			
			while (lbound <= ubound) {
				midindex = lbound + Math.floor((ubound - lbound) / 2);
				if (midindex === lastindex || originalBeginDts > _list[midindex].lastSample.originalDts && originalBeginDts < _list[midindex + 1].originalBeginDts) {
					index = midindex;
					break;
				}
				
				if (_list[midindex].originalBeginDts < originalBeginDts) {
					lbound = midindex + 1;
				} else {
					ubound = midindex - 1;
				}
			}
			
			return index;
		};
		
		_this.searchNearestSegmentAfter = function(originalBeginDts) {
			return _this.searchNearestSegmentBefore(originalBeginDts) + 1;
		};
		
		_this.append = function(seginfo) {
			var lastindex = _lastAppendLocation;
			var insertindex = 0;
			
			if (lastindex !== -1 && lastindex < _list.length
					&& seginfo.originalBeginDts >= _list[lastindex].lastSample.originalDts
					&& (lastindex === _list.length - 1 || lastindex < _list.length - 1
					&& seginfo.originalBeginDts < _list[lastindex + 1].originalBeginDts)) {
				insertindex = lastindex + 1; // use cached location idx
			} else {
				if (_list.length > 0) {
					insertindex = _this.searchNearestSegmentBefore(seginfo.originalBeginDts) + 1;
				}
			}
			
			_lastAppendLocation = insertindex;
			_list.splice(insertindex, 0, seginfo);
		};
		
		_this.getLastSegmentBefore = function(originalBeginDts) {
			var index = _this.searchNearestSegmentBefore(originalBeginDts);
			if (index < 0) {
				return null;
			}
			
			return _list[index];
		};
		
		_this.getLastSampleBefore = function(originalBeginDts) {
			var segment = _this.getLastSegmentBefore(originalBeginDts);
			if (segment == null) {
				return null;
			}
			
			return segment.lastSample;
		};
		
		_this.getLastSyncPointBefore = function(originalBeginDts) {
			var segindex = _this.searchNearestSegmentBefore(originalBeginDts);
			var syncPoints = _list[segindex].syncPoints;
			
			while (syncPoints.length === 0 && segindex--) {
				syncPoints = _list[segindex].syncPoints;
			}
			
			if (syncPoints.length <= 0) {
				return null;
			}
			
			return syncPoints[syncPoints.length - 1];
		};
		
		_this.isEmpty = function() {
			return _list.length === 0;
		};
		
		_this.clear = function() {
			_list = [];
			_lastAppendLocation = -1;
		};
		
		_init();
	};
	
	
	muxer.mp4 = function(config) {
		var _this = utils.extend(this, new events.eventdispatcher('muxer.mp4')),
			_defaults = {
				islive: false
			},
			_dtsBase,
			_videoNextDts,
			_audioNextDts,
			_videoMeta,
			_audioMeta,
			_videoseginfolist,
			_audioseginfolist,
			_fillSilentAfterSeek,
			
			_types = {
				avc1: [], avcC: [], btrt: [], dinf: [],
				dref: [], esds: [], ftyp: [], hdlr: [],
				mdat: [], mdhd: [], mdia: [], mfhd: [],
				minf: [], moof: [], moov: [], mp4a: [],
				mvex: [], mvhd: [], sdtp: [], stbl: [],
				stco: [], stsc: [], stsd: [], stsz: [],
				stts: [], tfdt: [], tfhd: [], traf: [],
				trak: [], trun: [], trex: [], tkhd: [],
				vmhd: [], smhd: []
			};
		
		function _init() {
			_this.config = utils.extend({}, _defaults, config);
			
			for (var name in _types) {
				_types[name] = [
					name.charCodeAt(0),
					name.charCodeAt(1),
					name.charCodeAt(2),
					name.charCodeAt(3)
				];
			}
			
			_dtsBase = 0;
			
			_videoseginfolist = new segmentinfolist('video');
			_audioseginfolist = new segmentinfolist('audio');
			
			_fillSilentAfterSeek = false;
		}
		
		_this.reset = function() {
			_dtsBase = 0;
			
			_videoNextDts = undefined;
			_audioNextDts = undefined;
			
			_videoseginfolist.reset();
			_audioseginfolist.reset();
			
			_fillSilentAfterSeek = false;
		};
		
		_this.getInitSegment = function(meta) {
			var ftyp = _this.box(_types.ftyp, datas.FTYP);
			var moov = _this.moov(meta);
			
			var seg = new Uint8Array(ftyp.byteLength + moov.byteLength);
			seg.set(ftyp, 0);
			seg.set(moov, ftyp.byteLength);
			
			_this.dispatchEvent(events.PLAYEASE_MP4_INIT_SEGMENT, { tp: meta.type, data: seg });
		};
		
		_this.getVideoSegment = function(track) {
			var samples = track.samples;
			var dtsCorrection = undefined;
			var firstDts = -1, lastDts = -1;
			var firstPts = -1, lastPts = -1;
			
			if (!samples || samples.length === 0) {
				return;
			}
			
			var pos = 0;
			
			var bytes = 8 + track.length;
			var mdatbox = new Uint8Array(bytes);
			mdatbox[pos++] = bytes >>> 24 & 0xFF;
			mdatbox[pos++] = bytes >>> 16 & 0xFF;
			mdatbox[pos++] = bytes >>>  8 & 0xFF;
			mdatbox[pos++] = bytes & 0xFF;
			
			mdatbox.set(_types.mdat, pos);
			pos += 4;
			
			var mp4Samples = [];
			var seginfo = new segmentinfo();
			
			while (samples.length) {
				var avcSample = samples.shift();
				var keyframe = avcSample.isKeyframe;
				var originalDts = avcSample.dts - _dtsBase;
				
				if (dtsCorrection == undefined) {
					if (_videoNextDts == undefined) {
						if (_videoseginfolist.isEmpty()) {
							dtsCorrection = 0;
						} else {
							var lastSample = _videoseginfolist.getLastSampleBefore(originalDts);
							if (lastSample != null) {
								var distance = originalDts - (lastSample.originalDts + lastSample.duration);
								if (distance <= 3) {
									distance = 0;
								}
								
								var expectedDts = lastSample.dts + lastSample.duration + distance;
								dtsCorrection = originalDts - expectedDts;
							} else {
								// lastSample == null
								dtsCorrection = 0;
							}
						}
					} else {
						dtsCorrection = originalDts - _videoNextDts;
					}
				}
				
				var dts = originalDts - dtsCorrection;
				var cts = avcSample.cts;
				var pts = dts + cts;
				
				if (firstDts === -1) {
					firstDts = dts;
					firstPts = pts;
				}
				
				// fill mdat box
				var sampleSize = 0;
				while (avcSample.units.length) {
					var unit = avcSample.units.shift();
					var data = unit.data;
					mdatbox.set(data, pos);
					pos += data.byteLength;
					sampleSize += data.byteLength;
				}
				
				var sampleDuration = 0;
				if (samples.length >= 1) {
					var nextDts = samples[0].dts - _dtsBase - dtsCorrection;
					sampleDuration = nextDts - dts;
				} else {
					if (mp4Samples.length >= 1) {
						sampleDuration = mp4Samples[mp4Samples.length - 1].duration;
					} else {
						sampleDuration = _videoMeta.refSampleDuration + dtsCorrection;
					}
				}
				
				if (keyframe) {
					var syncPoint = new sampleinfo(dts, pts, sampleDuration, avcSample.dts, true);
					syncPoint.fileposition = avcSample.fileposition;
					seginfo.appendSyncPoint(syncPoint);
				}
				
				var mp4Sample = {
					dts: dts,
					pts: pts,
					cts: cts,
					size: sampleSize,
					isKeyframe: keyframe,
					duration: sampleDuration,
					originalDts: originalDts,
					flags: {
						isLeading: 0,
						dependsOn: keyframe ? 2 : 1,
						isDependedOn: keyframe ? 1 : 0,
						hasRedundancy: 0,
						isNonSync: keyframe ? 0 : 1
					}
				};
				
				mp4Samples.push(mp4Sample);
			}
			
			var latest = mp4Samples[mp4Samples.length - 1];
			lastDts = latest.dts + latest.duration;
			lastPts = latest.pts + latest.duration;
			_videoNextDts = lastDts;
			
			// fill media segment info & add into info list
			seginfo.beginDts = firstDts;
			seginfo.endDts = lastDts;
			seginfo.beginPts = firstPts;
			seginfo.endPts = lastPts;
			seginfo.originalBeginDts = mp4Samples[0].originalDts;
			seginfo.originalEndDts = latest.originalDts + latest.duration;
			seginfo.firstSample = new sampleinfo(mp4Samples[0].dts, mp4Samples[0].pts, mp4Samples[0].duration, mp4Samples[0].originalDts, mp4Samples[0].isKeyframe);
			seginfo.lastSample = new sampleinfo(latest.dts, latest.pts, latest.duration, latest.originalDts, latest.isKeyframe);
			if (!_this.config.islive) {
				_videoseginfolist.append(seginfo);
			}
			
			track.samples = mp4Samples;
			track.sequenceNumber++;
			
			// workaround for chrome < 50: force first sample as a random access point
			// see https://bugs.chromium.org/p/chromium/issues/detail?id=229412
			/*if (_forceFirstIDR) {
				var flags = mp4Samples[0].flags;
				flags.dependsOn = 2;
				flags.isNonSync = 0;
			}*/
			
			var moofbox = _this.moof(track, firstDts);
			track.samples = [];
			track.length = 0;
			
			_this.dispatchEvent(events.PLAYEASE_MP4_SEGMENT, {
				tp: 'video',
				data: _mergeBoxes(moofbox, mdatbox),
				sampleCount: mp4Samples.length,
				info: seginfo
			});
		};
		
		_this.getAudioSegment = function(track) {
			var samples = track.samples;
			var dtsCorrection = undefined;
			var firstDts = -1, lastDts = -1;
			
			var remuxSilentFrame = false;
			var silentFrameDuration = -1;
			
			if (!samples || samples.length === 0) {
				return;
			}
			
			var pos = 0;
			
			var bytes = 8 + track.length;
			var mdatbox = new Uint8Array(bytes);
			mdatbox[pos++] = bytes >>> 24 & 0xFF;
			mdatbox[pos++] = bytes >>> 16 & 0xFF;
			mdatbox[pos++] = bytes >>>  8 & 0xFF;
			mdatbox[pos++] = bytes & 0xFF;
			
			mdatbox.set(_types.mdat, pos);
			pos += 4;
			
			var mp4Samples = [];
			
			while (samples.length) {
				var aacSample = samples.shift();
				var unit = aacSample.unit;
				var originalDts = aacSample.dts - _dtsBase;
				
				if (dtsCorrection == undefined) {
					if (_audioNextDts == undefined) {
						if (_audioseginfolist.isEmpty()) {
							dtsCorrection = 0;
							if (_fillSilentAfterSeek && !_videoseginfolist.isEmpty()) {
								remuxSilentFrame = true;
							}
						} else {
							var lastSample = _audioseginfolist.getLastSampleBefore(originalDts);
							if (lastSample != null) {
								var distance = originalDts - (lastSample.originalDts + lastSample.duration);
								if (distance <= 3) {
									distance = 0;
								}
								var expectedDts = lastSample.dts + lastSample.duration + distance;
								dtsCorrection = originalDts - expectedDts;
							} else {
								// lastSample == null
								dtsCorrection = 0;
							}
						}
					} else {
						dtsCorrection = originalDts - _audioNextDts;
					}
				}
				
				var dts = originalDts - dtsCorrection;
				if (remuxSilentFrame) {
					// align audio segment beginDts to match with current video segment's beginDts
					var videoSegment = _videoseginfolist.getLastSegmentBefore(originalDts);
					if (videoSegment != null && videoSegment.beginDts < dts) {
						silentFrameDuration = dts - videoSegment.beginDts;
						dts = videoSegment.beginDts;
					} else {
						remuxSilentFrame = false;
					}
				}
				if (firstDts === -1) {
					firstDts = dts;
				}
				
				if (remuxSilentFrame) {
					remuxSilentFrame = false;
					samples.unshift(aacSample);
					
					var frame = _generateSilentAudio(dts, silentFrameDuration);
					if (frame == null) {
						continue;
					}
					var mp4Spl = frame.mp4Sample;
					var unt = frame.unit;
					mp4Samples.push(mp4Spl);
					
					// re-allocate mdatbox buffer with new size, to fit with this silent frame
					pos = 0;
					
					bytes += unt.byteLength;
					mdatbox = new Uint8Array(bytes);
					mdatbox[pos++] = bytes >>> 24 & 0xFF;
					mdatbox[pos++] = bytes >>> 16 & 0xFF;
					mdatbox[pos++] = bytes >>>  8 & 0xFF;
					mdatbox[pos++] = bytes & 0xFF;
					
					mdatbox.set(_types.mdat, pos);
					pos += 4;
					
					mdatbox.set(unt, pos);
					pos += unt.byteLength;
					
					continue;
				}
				
				var sampleDuration = 0;
				
				if (samples.length >= 1) {
					var nextDts = samples[0].dts - _dtsBase - dtsCorrection;
					sampleDuration = nextDts - dts;
				} else {
					if (mp4Samples.length >= 1) {
						sampleDuration = mp4Samples[mp4Samples.length - 1].duration;
					} else {
						sampleDuration = _audioMeta.refSampleDuration + dtsCorrection;
					}
				}
				
				var mp4Sample = {
					dts: dts,
					pts: dts,
					cts: 0,
					size: unit.byteLength,
					duration: sampleDuration,
					originalDts: originalDts,
					flags: {
						isLeading: 0,
						dependsOn: 1,
						isDependedOn: 0,
						hasRedundancy: 0
					}
				};
				
				mp4Samples.push(mp4Sample);
				mdatbox.set(unit, pos);
				pos += unit.byteLength;
			}
			
			var latest = mp4Samples[mp4Samples.length - 1];
			lastDts = latest.dts + latest.duration;
			_audioNextDts = lastDts;
			
			// fill media segment info & add to info list
			var seginfo = new segmentinfo();
			seginfo.beginDts = firstDts;
			seginfo.endDts = lastDts;
			seginfo.beginPts = firstDts;
			seginfo.endPts = lastDts;
			seginfo.originalBeginDts = mp4Samples[0].originalDts;
			seginfo.originalEndDts = latest.originalDts + latest.duration;
			seginfo.firstSample = new sampleinfo(mp4Samples[0].dts, mp4Samples[0].pts, mp4Samples[0].duration, mp4Samples[0].originalDts, false);
			seginfo.lastSample = new sampleinfo(latest.dts, latest.pts, latest.duration, latest.originalDts, false);
			if (!_this.config.islive) {
				_audioseginfolist.append(seginfo);
			}
			
			track.samples = mp4Samples;
			track.sequenceNumber++;
			
			var moofbox = _this.moof(track, firstDts);
			track.samples = [];
			track.length = 0;
			
			_this.dispatchEvent(events.PLAYEASE_MP4_SEGMENT, {
				tp: 'audio',
				data: _mergeBoxes(moofbox, mdatbox),
				sampleCount: mp4Samples.length,
				info: seginfo
			});
		};
		
		function _generateSilentAudio(dts, frameDuration) {
			var unit = AAC.getSilentFrame(_audioMeta.channelCount);
			if (unit == null) {
				utils.log('Cannot generate silent aac frame, channelCount: ' + _audioMeta.channelCount + '.');
				return null;
			}
			
			var mp4Sample = {
				dts: dts,
				pts: dts,
				cts: 0,
				size: unit.byteLength,
				duration: frameDuration,
				originalDts: dts,
				flags: {
					isLeading: 0,
					dependsOn: 1,
					isDependedOn: 0,
					hasRedundancy: 0
				}
			};
			
			return {
				unit: unit,
				mp4Sample: mp4Sample
			};
		}
		
		_mergeBoxes = function(moof, mdat) {
			var res = new Uint8Array(moof.byteLength + mdat.byteLength);
			res.set(moof, 0);
			res.set(mdat, moof.byteLength);
			
			return res;
		};
		
		_this.setVideoMeta = function(meta) {
			_videoMeta = meta;
		};
		
		_this.setAudioMeta = function(meta) {
			_audioMeta = meta;
		};
		
		
		_this.box = function(type) {
			var size = 8;
			var arrs = Array.prototype.slice.call(arguments, 1);
			for (var i = 0; i < arrs.length; i++) {
				size += arrs[i].byteLength;
			}
			
			var data = new Uint8Array(size);
			var pos = 0;
			
			// set size
			data[pos++] = size >>> 24 & 0xFF;
			data[pos++] = size >>> 16 & 0xFF;
			data[pos++] = size >>>  8 & 0xFF;
			data[pos++] = size & 0xFF;
			
			// set type
			data.set(type, pos);
			pos += 4;
			
			// set data
			for (var i = 0; i < arrs.length; i++) {
				data.set(arrs[i], pos);
				pos += arrs[i].byteLength;
			}
			
			return data;
		};
		
		// Movie metadata box
		_this.moov = function(meta) {
			var mvhd = _this.mvhd(meta.timescale, meta.duration);
			var trak = _this.trak(meta);
			var mvex = _this.mvex(meta);
			
			return _this.box(_types.moov, mvhd, trak, mvex);
		}
		
		// Movie header box
		_this.mvhd = function(timescale, duration) {
			return _this.box(_types.mvhd, new Uint8Array([
				0x00, 0x00, 0x00, 0x00,    // version(0) + flags
				0x00, 0x00, 0x00, 0x00,    // creation_time
				0x00, 0x00, 0x00, 0x00,    // modification_time
				(timescale >>> 24) & 0xFF, // timescale: 4 bytes
				(timescale >>> 16) & 0xFF,
				(timescale >>>  8) & 0xFF,
				(timescale) & 0xFF,
				(duration >>> 24) & 0xFF,  // duration: 4 bytes
				(duration >>> 16) & 0xFF,
				(duration >>>  8) & 0xFF,
				(duration) & 0xFF,
				0x00, 0x01, 0x00, 0x00,    // Preferred rate: 1.0
				0x01, 0x00, 0x00, 0x00,    // PreferredVolume(1.0, 2bytes) + reserved(2bytes)
				0x00, 0x00, 0x00, 0x00,    // reserved: 4 + 4 bytes
				0x00, 0x00, 0x00, 0x00,
				0x00, 0x01, 0x00, 0x00,    // ----begin composition matrix----
				0x00, 0x00, 0x00, 0x00,
				0x00, 0x00, 0x00, 0x00,
				0x00, 0x00, 0x00, 0x00,
				0x00, 0x01, 0x00, 0x00,
				0x00, 0x00, 0x00, 0x00,
				0x00, 0x00, 0x00, 0x00,
				0x00, 0x00, 0x00, 0x00,
				0x40, 0x00, 0x00, 0x00,    // ----end composition matrix----
				0x00, 0x00, 0x00, 0x00,    // ----begin pre_defined 6 * 4 bytes----
				0x00, 0x00, 0x00, 0x00,
				0x00, 0x00, 0x00, 0x00,
				0x00, 0x00, 0x00, 0x00,
				0x00, 0x00, 0x00, 0x00,
				0x00, 0x00, 0x00, 0x00,    // ----end pre_defined 6 * 4 bytes----
				0xFF, 0xFF, 0xFF, 0xFF     // next_track_ID
			]));
		};
		
		// Track box
		_this.trak = function(meta) {
			return _this.box(_types.trak, _this.tkhd(meta), _this.mdia(meta));
		};
		
		// Track header box
		_this.tkhd = function(meta) {
			var trackId = meta.id;
			var duration = meta.duration;
			var width = meta.presentWidth;
			var height = meta.presentHeight;
			
			return _this.box(_types.tkhd, new Uint8Array([
				0x00, 0x00, 0x00, 0x07,   // version(0) + flags
				0x00, 0x00, 0x00, 0x00,   // creation_time
				0x00, 0x00, 0x00, 0x00,   // modification_time
				(trackId >>> 24) & 0xFF,  // track_ID: 4 bytes
				(trackId >>> 16) & 0xFF,
				(trackId >>>  8) & 0xFF,
				(trackId) & 0xFF,
				0x00, 0x00, 0x00, 0x00,   // reserved: 4 bytes
				(duration >>> 24) & 0xFF, // duration: 4 bytes
				(duration >>> 16) & 0xFF,
				(duration >>>  8) & 0xFF,
				(duration) & 0xFF,
				0x00, 0x00, 0x00, 0x00,   // reserved: 2 * 4 bytes
				0x00, 0x00, 0x00, 0x00,
				0x00, 0x00, 0x00, 0x00,   // layer(2bytes) + alternate_group(2bytes)
				0x00, 0x00, 0x00, 0x00,   // volume(2bytes) + reserved(2bytes)
				0x00, 0x01, 0x00, 0x00,   // ----begin composition matrix----
				0x00, 0x00, 0x00, 0x00,
				0x00, 0x00, 0x00, 0x00,
				0x00, 0x00, 0x00, 0x00,
				0x00, 0x01, 0x00, 0x00,
				0x00, 0x00, 0x00, 0x00,
				0x00, 0x00, 0x00, 0x00,
				0x00, 0x00, 0x00, 0x00,
				0x40, 0x00, 0x00, 0x00,   // ----end composition matrix----
				(width >>> 8) & 0xFF,     // width and height
				(width) & 0xFF,
				0x00, 0x00,
				(height >>> 8) & 0xFF,
				(height) & 0xFF,
				0x00, 0x00
			]));
		};
		
		// Media Box
		_this.mdia = function(meta) {
			return _this.box(_types.mdia, _this.mdhd(meta), _this.hdlr(meta), _this.minf(meta));
		};
		
		// Media header box
		_this.mdhd = function(meta) {
			var timescale = meta.timescale;
			var duration = meta.duration;
			
			return _this.box(_types.mdhd, new Uint8Array([
				0x00, 0x00, 0x00, 0x00,    // version(0) + flags
				0x00, 0x00, 0x00, 0x00,    // creation_time
				0x00, 0x00, 0x00, 0x00,    // modification_time
				(timescale >>> 24) & 0xFF, // timescale: 4 bytes
				(timescale >>> 16) & 0xFF,
				(timescale >>>  8) & 0xFF,
				(timescale) & 0xFF,
				(duration >>> 24) & 0xFF,  // duration: 4 bytes
				(duration >>> 16) & 0xFF,
				(duration >>>  8) & 0xFF,
				(duration) & 0xFF,
				0x55, 0xC4,                // language: und (undetermined)
				0x00, 0x00                 // pre_defined = 0
			]));
		};
		
		// Media handler reference box
		_this.hdlr = function(meta) {
			var data = null;
			
			if (meta.type === 'audio') {
				data = datas.HDLR_AUDIO;
			} else {
				data = datas.HDLR_VIDEO;
			}
			
			return _this.box(_types.hdlr, data);
		};
		
		// Media infomation box
		_this.minf = function(meta) {
			var xmhd = null;
			
			if (meta.type === 'audio') {
				xmhd = _this.box(_types.smhd, datas.SMHD);
			} else {
				xmhd = _this.box(_types.vmhd, datas.VMHD);
			}
			
			return _this.box(_types.minf, xmhd, _this.dinf(), _this.stbl(meta));
		};
		
		// Data infomation box
		_this.dinf = function() {
			return _this.box(_types.dinf, _this.box(_types.dref, datas.DREF));
		};
		
		// Sample table box
		_this.stbl = function(meta) {
			var result = _this.box(_types.stbl,   // type: stbl
				_this.stsd(meta),                   // Sample Description Table
				_this.box(_types.stts, datas.STTS), // Time-To-Sample
				_this.box(_types.stsc, datas.STSC), // Sample-To-Chunk
				_this.box(_types.stsz, datas.STSZ), // Sample size
				_this.box(_types.stco, datas.STCO)  // Chunk offset
			);
			
			return result;
		};
		
		// Sample description box
		_this.stsd = function(meta) {
			if (meta.type === 'audio') {
				return _this.box(_types.stsd, datas.STSD_PREFIX, _this.mp4a(meta));
			} else {
				return _this.box(_types.stsd, datas.STSD_PREFIX, _this.avc1(meta));
			}
		};
		
		_this.mp4a = function(meta) {
			var channelCount = meta.channelCount;
			var sampleRate = meta.audioSampleRate;
			
			var data = new Uint8Array([
				0x00, 0x00, 0x00, 0x00,    // reserved(4)
				0x00, 0x00, 0x00, 0x01,    // reserved(2) + data_reference_index(2)
				0x00, 0x00, 0x00, 0x00,    // reserved: 2 * 4 bytes
				0x00, 0x00, 0x00, 0x00,
				0x00, channelCount,        // channelCount(2)
				0x00, 0x10,                // sampleSize(2)
				0x00, 0x00, 0x00, 0x00,    // reserved(4)
				(sampleRate >>> 8) & 0xFF, // Audio sample rate
				(sampleRate) & 0xFF,
				0x00, 0x00
			]);
			
			return _this.box(_types.mp4a, data, _this.esds(meta));
		};
		
		_this.esds = function(meta) {
			var config = meta.config;
			var configSize = config.length;
			var data = new Uint8Array([
				0x00, 0x00, 0x00, 0x00, // version 0 + flags
				
				0x03,                   // descriptor_type
				0x17 + configSize,      // length3
				0x00, 0x01,             // es_id
				0x00,                   // stream_priority
				
				0x04,                   // descriptor_type
				0x0F + configSize,      // length
				0x40,                   // codec: mpeg4_audio
				0x15,                   // stream_type: Audio
				0x00, 0x00, 0x00,       // buffer_size
				0x00, 0x00, 0x00, 0x00, // maxBitrate
				0x00, 0x00, 0x00, 0x00, // avgBitrate
				
				0x05                    // descriptor_type
			].concat(
				[configSize]
			).concat(
				config
			).concat(
				[0x06, 0x01, 0x02]      // GASpecificConfig
			));
			
			return _this.box(_types.esds, data);
		};
		
		_this.avc1 = function(meta) {
			var avcc = meta.avcc;
			var width = meta.codecWidth;
			var height = meta.codecHeight;
			
			var data = new Uint8Array([
				0x00, 0x00, 0x00, 0x00, // reserved(4)
				0x00, 0x00, 0x00, 0x01, // reserved(2) + data_reference_index(2)
				0x00, 0x00, 0x00, 0x00, // pre_defined(2) + reserved(2)
				0x00, 0x00, 0x00, 0x00, // pre_defined: 3 * 4 bytes
				0x00, 0x00, 0x00, 0x00,
				0x00, 0x00, 0x00, 0x00,
				(width >>> 8) & 0xFF,   // width: 2 bytes
				(width) & 0xFF,
				(height >>> 8) & 0xFF,  // height: 2 bytes
				(height) & 0xFF,
				0x00, 0x48, 0x00, 0x00, // horizresolution: 4 bytes
				0x00, 0x48, 0x00, 0x00, // vertresolution: 4 bytes
				0x00, 0x00, 0x00, 0x00, // reserved: 4 bytes
				0x00, 0x01,             // frame_count
				0x0A,                   // strlen
				0x78, 0x71, 0x71, 0x2F, // compressorname: 32 bytes
				0x66, 0x6C, 0x76, 0x2E,
				0x6A, 0x73, 0x00, 0x00,
				0x00, 0x00, 0x00, 0x00,
				0x00, 0x00, 0x00, 0x00,
				0x00, 0x00, 0x00, 0x00,
				0x00, 0x00, 0x00, 0x00,
				0x00, 0x00, 0x00,
				0x00, 0x18,             // depth
				0xFF, 0xFF              // pre_defined = -1
			]);
			
			return _this.box(_types.avc1, data, _this.box(_types.avcC, avcc));
		};
		
		// Movie Extends box
		_this.mvex = function(meta) {
			return _this.box(_types.mvex, _this.trex(meta));
		};
		
		// Track Extends box
		_this.trex = function(meta) {
			var trackId = meta.id;
			var data = new Uint8Array([
				0x00, 0x00, 0x00, 0x00,  // version(0) + flags
				(trackId >>> 24) & 0xFF, // track_ID
				(trackId >>> 16) & 0xFF,
				(trackId >>>  8) & 0xFF,
				(trackId) & 0xFF,
				0x00, 0x00, 0x00, 0x01,  // default_sample_description_index
				0x00, 0x00, 0x00, 0x00,  // default_sample_duration
				0x00, 0x00, 0x00, 0x00,  // default_sample_size
				0x00, 0x01, 0x00, 0x01   // default_sample_flags
			]);
			
			return _this.box(_types.trex, data);
		};
		
		// Movie fragment box
		_this.moof = function(track, baseMediaDecodeTime) {
			return _this.box(_types.moof, _this.mfhd(track.sequenceNumber), _this.traf(track, baseMediaDecodeTime));
		};
		
		_this.mfhd = function(sequenceNumber) {
			var data = new Uint8Array([
				0x00, 0x00, 0x00, 0x00,
				(sequenceNumber >>> 24) & 0xFF, // sequence_number: int32
				(sequenceNumber >>> 16) & 0xFF,
				(sequenceNumber >>>  8) & 0xFF,
				(sequenceNumber) & 0xFF
			]);
			
			return _this.box(_types.mfhd, data);
		};
		
		// Track fragment box
		_this.traf = function(track, baseMediaDecodeTime) {
			var trackId = track.id;
			
			// Track fragment header box
			var tfhd = _this.box(_types.tfhd, new Uint8Array([
				0x00, 0x00, 0x00, 0x00,  // version(0) & flags
				(trackId >>> 24) & 0xFF, // track_ID
				(trackId >>> 16) & 0xFF,
				(trackId >>>  8) & 0xFF,
				(trackId) & 0xFF
			]));
			
			// Track Fragment Decode Time
			var tfdt = _this.box(_types.tfdt, new Uint8Array([
				0x00, 0x00, 0x00, 0x00,              // version(0) & flags
				(baseMediaDecodeTime >>> 24) & 0xFF, // baseMediaDecodeTime: int32
				(baseMediaDecodeTime >>> 16) & 0xFF,
				(baseMediaDecodeTime >>>  8) & 0xFF,
				(baseMediaDecodeTime) & 0xFF
			]));
			
			var sdtp = _this.sdtp(track);
			var trun = _this.trun(track, sdtp.byteLength + 16 + 16 + 8 + 16 + 8 + 8);
			
			return _this.box(_types.traf, tfhd, tfdt, trun, sdtp);
		};
		
		// Sample Dependency Type box
		_this.sdtp = function(track) {
			var samples = track.samples || [];
			var sampleCount = samples.length;
			var data = new Uint8Array(4 + sampleCount);
			
			// 0~4 bytes: version(0) & flags
			for (var i = 0; i < sampleCount; i++) {
				var flags = samples[i].flags;
				data[i + 4] = (flags.isLeading << 6) // is_leading: 2 (bit)
					| (flags.dependsOn << 4)           // sample_depends_on
					| (flags.isDependedOn << 2)        // sample_is_depended_on
					| (flags.hasRedundancy);           // sample_has_redundancy
			}
			
			return _this.box(_types.sdtp, data);
		};
		
		// Track fragment run box
		_this.trun = function(track, offset) {
			var samples = track.samples || [];
			var sampleCount = samples.length;
			var dataSize = 12 + 16 * sampleCount;
			var data = new Uint8Array(dataSize);
			
			offset += 8 + dataSize;
			
			data.set([
				0x00, 0x00, 0x0F, 0x01,      // version(0) & flags
				(sampleCount >>> 24) & 0xFF, // sample_count
				(sampleCount >>> 16) & 0xFF,
				(sampleCount >>>  8) & 0xFF,
				(sampleCount) & 0xFF,
				(offset >>> 24) & 0xFF,      // data_offset
				(offset >>> 16) & 0xFF,
				(offset >>>  8) & 0xFF,
				(offset) & 0xFF
			], 0);
			
			for (var i = 0; i < sampleCount; i++) {
				var duration = samples[i].duration;
				var size = samples[i].size;
				var flags = samples[i].flags;
				var cts = samples[i].cts;
				
				data.set([
					(duration >>> 24) & 0xFF, // sample_duration
					(duration >>> 16) & 0xFF,
					(duration >>>  8) & 0xFF,
					(duration) & 0xFF,
					(size >>> 24) & 0xFF,     // sample_size
					(size >>> 16) & 0xFF,
					(size >>>  8) & 0xFF,
					(size) & 0xFF,
					(flags.isLeading << 2) | flags.dependsOn, // sample_flags
					(flags.isDependedOn << 6) | (flags.hasRedundancy << 4) | flags.isNonSync,
					0x00, 0x00,               // sample_degradation_priority
					(cts >>> 24) & 0xFF,      // sample_composition_time_offset
					(cts >>> 16) & 0xFF,
					(cts >>>  8) & 0xFF,
					(cts) & 0xFF
				], 12 + 16 * i);
			}
			
			return _this.box(_types.trun, data);
		};
		
		_this.mdat = function(data) {
			return _this.box(_types.mdat, data);
		};
		
		
		_this.destroy = function() {
			
		};
		
		_init();
	};
})(playease);

(function(playease) {
	playease.net = {};
})(playease);

(function(playease) {
	var utils = playease.utils,
		events = playease.events,
		net = playease.net;
	
	net.responder = function(result, status) {
		var _this = this,
			_result,
			_status;
		
		function _init() {
			_this.result = result;
			_this.status = status;
		}
		
		_init();
	};
})(playease);

(function(playease) {
	var net = playease.net;
	
	net.netstatus = {
		NETCONNECTION_CALL_FAILED: 'NetConnection.Call.Failed',
		NETCONNECTION_CONNECT_APPSHUTDOWN: 'NetConnection.Connect.AppShutdown',
		NETCONNECTION_CONNECT_CLOSED: 'NetConnection.Connect.Closed',
		NETCONNECTION_CONNECT_FAILED: 'NetConnection.Connect.Failed',
		NETCONNECTION_CONNECT_IDLETIMEOUT: 'NetConnection.Connect.IdleTimeout',
		NETCONNECTION_CONNECT_INVALIDAPP: 'NetConnection.Connect.InvalidApp',
		NETCONNECTION_CONNECT_REJECTED: 'NetConnection.Connect.Rejected',
		NETCONNECTION_CONNECT_SUCCESS: 'NetConnection.Connect.Success',
		
		NETSTREAM_BUFFER_EMPTY: 'NetStream.Buffer.Empty',
		NETSTREAM_BUFFER_FLUSH: 'NetStream.Buffer.Flush',
		NETSTREAM_BUFFER_FULL: 'NetStream.Buffer.Full',
		NETSTREAM_FAILED: 'NetStream.Failed',
		NETSTREAM_PAUSE_NOTIFY: 'NetStream.Pause.Notify',
		NETSTREAM_PLAY_FAILED: 'NetStream.Play.Failed',
		NETSTREAM_PLAY_FILESTRUCTUREINVALID: 'NetStream.Play.FileStructureInvalid',
		NETSTREAM_PLAY_PUBLISHNOTIFY: 'NetStream.Play.PublishNotify',
		NETSTREAM_PLAY_RESET: 'NetStream.Play.Reset',
		NETSTREAM_PLAY_START: 'NetStream.Play.Start',
		NETSTREAM_PLAY_STOP: 'NetStream.Play.Stop',
		NETSTREAM_PLAY_STREAMNOTFOUND: 'NetStream.Play.StreamNotFound',
		NETSTREAM_PLAY_UNPUBLISHNOTIFY: 'NetStream.Play.UnpublishNotify',
		NETSTREAM_PUBLISH_BADNAME: 'NetStream.Publish.BadName',
		NETSTREAM_PUBLISH_IDLE: 'NetStream.Publish.Idle',
		NETSTREAM_PUBLISH_START: 'NetStream.Publish.Start',
		NETSTREAM_RECORD_ALREADYEXISTS: 'NetStream.Record.AlreadyExists',
		NETSTREAM_RECORD_FAILED: 'NetStream.Record.Failed',
		NETSTREAM_RECORD_NOACCESS: 'NetStream.Record.NoAccess',
		NETSTREAM_RECORD_START: 'NetStream.Record.Start',
		NETSTREAM_RECORD_STOP: 'NetStream.Record.Stop',
		NETSTREAM_SEEK_FAILED: 'NetStream.Seek.Failed',
		NETSTREAM_SEEK_INVALIDTIME: 'NetStream.Seek.InvalidTime',
		NETSTREAM_SEEK_NOTIFY: 'NetStream.Seek.Notify',
		NETSTREAM_STEP_NOTIFY: 'NetStream.Step.Notify',
		NETSTREAM_UNPAUSE_NOTIFY: 'NetStream.Unpause.Notify',
		NETSTREAM_UNPUBLISH_SUCCESS: 'NetStream.Unpublish.Success',
		NETSTREAM_VIDEO_DIMENSIONCHANGE: 'NetStream.Video.DimensionChange'
	};
})(playease);

(function(playease) {
	var utils = playease.utils,
		crypt = utils.crypt,
		events = playease.events,
		net = playease.net,
		status = net.netstatus,
		
		packages = {
			AUDIO:  0x08,
			VIDEO:  0x09,
			SCRIPT: 0x12
		},
		commands = {
			PLAY:    0x000001, // name, start = -2, length = -1, reset = 1
			PLAY2:   0x000002,
			RESUME:  0x000003,
			PAUSE:   0x000004,
			SEEK:    0x000005, // offset
			STOP:    0x000006,
			CLOSE:   0x000007,
			
			PUBLISH: 0x000010, // name = null, type = live
			
			ON_META_DATA: 0x000009
		};
	
	net.netconnection = function() {
		var _this = utils.extend(this, new events.eventdispatcher('net.netconnection')),
			_websocket,
			_connected,
			_url,
			_protocol,
			_responders,
			_requestId;
		
		function _init() {
			_connected = false;
			_responders = {};
			_requestId = 0;
		}
		
		_this.connect = function(url) {
			_url = url;
			
			if (_url === undefined || _url === null) {
				// http mode
				return;
			}
			
			try {
				window.WebSocket = window.WebSocket || window.MozWebSocket;
				_websocket = new WebSocket(_url);
				_websocket.binaryType = 'arraybuffer';
			} catch (err) {
				utils.log('Failed to initialize websocket: ' + err);
				return;
			}
			
			_websocket.onopen = _onOpen;
			_websocket.onmessage = _onMessage;
			_websocket.onerror = _onError;
			_websocket.onclose = _onClose;
		};
		
		_this.send = function(type, command, responder, data) {
			if (type !== packages.AUDIO && type !== packages.VIDEO && type !== packages.SCRIPT) {
				throw 'Failed to send package: Unknown type ' + type + '.';
				return;
			}
			
			if (_connected == false) {
				_this.dispatchEvent(events.PLAYEASE_IO_ERROR, { message: 'Connection not connected!' });
				return;
			}
			
			var req = _requestId++;
			if (responder) {
				_responders[req] = responder;
			}
			
			var ab, body;
			switch (utils.typeOf(data)) {
				case 'number':
					data = { value: data };
				case 'string':
					data = { message: data };
				case 'object':
					data.req = req;
					
					var json = JSON.stringify(data);
					body = crypt.stringToByteArray(json);
					
					ab = new Uint8Array(4 + body.length);
					ab.set(body, 4);
					break;
					
				case 'arraybuffer':
					body = new Uint8Array(data);
					
					ab = new Uint8Array(4 + body.byteLength);
					ab.set(body, 4);
					break;
					
				default:
					ab = new Uint8Array(4);
					break;
			}
			
			var pos = 0;
			ab[pos++] = type;
			ab[pos++] = command >>> 16;
			ab[pos++] = command >>> 8;
			ab[pos++] = command;
			
			_websocket.send(ab.buffer);
		};
		
		function _onOpen(e) {
			_connected = true;
			_this.dispatchEvent(events.PLAYEASE_NET_STATUS, { info: { level: 'status', code: status.NETCONNECTION_CONNECT_SUCCESS } });
		}
		
		function _onMessage(e) {
			var data = new Uint8Array(e.data);
			
			var pos = 0;
			var type = data[pos++];
			
			switch (type) {
				case packages.AUDIO:
				case packages.VIDEO:
					var segtype = type == packages.AUDIO ? 'audio' : 'video';
					var seg = new Uint8Array(e.data, pos);
					
					//pos += 3; // skip 3 bytes of command
					pos += 4; // skip 4 bytes of box size
					
					var evttype = events.PLAYEASE_MP4_SEGMENT;
					if (data[pos] === 0x66 && data[pos + 1] === 0x74 && data[pos + 2] === 0x79 && data[pos + 3] === 0x70) { // is ftyp box
						evttype = events.PLAYEASE_MP4_INIT_SEGMENT;
					}
					
					_this.dispatchEvent(evttype, { tp: segtype, data: seg });
					break;
					
				case packages.SCRIPT:
					var command = 0;
					command |= data[pos++] << 16;
					command |= data[pos++] << 8;
					command |= data[pos++];
					
					var tmp = data.slice(pos);
					
					if (command === commands.ON_META_DATA) {
						//_this.dispatchEvent(events.PLAYEASE_MEDIA_INFO, { info: tmp });
						return;
					}
					
					var str = String.fromCharCode.apply(null, tmp);
					var info = JSON.parse(str);
					if (info.hasOwnProperty('req') && _responders.hasOwnProperty(info.req)) {
						var responder = _responders[info.req];
						var fn = responder.result;
						if (info.level == 'error') {
							fn = responder.status;
						}
						
						if (fn) {
							fn.call(null, info);
						}
						
						delete _responders[info.req];
					}
					
					delete info.req;
					
					_this.dispatchEvent(events.PLAYEASE_NET_STATUS, { info: info });
					break;
					
				default:
					utils.log('Got an unknown package: ' + type + '.');
					break;
			}
		}
		
		function _onError(e) {
			_connected = false;
			_this.dispatchEvent(events.PLAYEASE_IO_ERROR, { message: 'Connection error occurred!' });
		}
		
		function _onClose(e) {
			_connected = false;
			_this.dispatchEvent(events.PLAYEASE_NET_STATUS, { info: { level: 'status', code: status.NETCONNECTION_CONNECT_CLOSED } });
		}
		
		_this.close = function() {
			if (_connected) {
				_this.send(packages.SCRIPT, commands.CLOSE);
			}
			
			if (_websocket && (_websocket.readyState == WebSocket.CONNECTING || _websocket.readyState == WebSocket.OPEN)) {
				_websocket.close();
			}
		};
		
		_this.connected = function() {
			return _connected;
		};
		
		_this.url = function() {
			return _url;
		};
		
		_this.protocol = function() {
			return _protocol;
		};
		
		_init();
	};
	
	net.netconnection.packages = packages;
	net.netconnection.commands = commands;
})(playease);

(function(playease) {
	var utils = playease.utils,
		events = playease.events,
		io = playease.io,
		readystates = io.readystates,
		net = playease.net,
		status = net.netstatus,
		netconnection = net.netconnection,
		
		packages = netconnection.packages,
		commands = netconnection.commands;
	
	net.netstream = function(connection, config) {
		var _this = utils.extend(this, new events.eventdispatcher('net.netstream')),
			_defaults = {
				bufferTime: .1
			},
			_connection,
			_bytesLoaded,
			_bytesTotal,
			_info;
		
		function _init() {
			_this.config = utils.extend({}, _defaults, config);
			
			_connection = connection;
			_connection.addEventListener(events.PLAYEASE_MEDIA_INFO, _onMediaInfo);
			_connection.addEventListener(events.PLAYEASE_MP4_INIT_SEGMENT, _forward);
			_connection.addEventListener(events.PLAYEASE_MP4_SEGMENT, _forward);
			
			_bytesLoaded = 0;
			_bytesTotal = 0;
			
			_info = {
				state: readystates.UNINITIALIZED
			};
		}
		
		_this.attach = function(c) {
			_connection = c;
		};
		
		_this.play = function(name, start, len, reset) {
			if (name === undefined) {
				throw 'Failed to invoke play: "name" not specified.';
				return;
			}
			
			if (start === undefined) {
				start = -2;
			}
			if (len === undefined) {
				len = -1;
			}
			if (reset === undefined) {
				reset = 1;
			}
			
			_info.resourceName = name;
			
			_connection.send(packages.SCRIPT, commands.PLAY, null, {
				name: name,
				start: start,
				len: len,
				reset: reset
			});
		};
		
		_this.play2 = function(name, start, length, reset) {
			if (name === undefined) {
				throw 'Failed to invoke play2: "name" not specified.';
				return;
			}
			
			if (start === undefined) {
				start = -2;
			}
			if (length === undefined) {
				length = -1;
			}
			if (reset === undefined) {
				start = 1;
			}
			
			_connection.send(packages.SCRIPT, commands.PLAY2, null, {
				name: name,
				start: start,
				length: length,
				reset: reset
			});
		};
		
		_this.resume = function() {
			_connection.send(packages.SCRIPT, commands.RESUME);
		};
		
		_this.pause = function() {
			_connection.send(packages.SCRIPT, commands.PAUSE);
		};
		
		_this.seek = function(offset) {
			_connection.send(packages.SCRIPT, commands.SEEK, null, {
				offset: offset || 0
			});
		};
		
		_this.close = function() {
			if (_connection.connected()) {
				//_connection.send(packages.SCRIPT, commands.STOP);
			}
		};
		
		_this.dispose = function() {
			if (_connection.connected()) {
				_connection.send(packages.SCRIPT, commands.STOP);
			}
			
			_bytesLoaded = 0;
			_bytesTotal = 0;
			
			_info = {};
		};
		
		
		_this.publish = function(name, type) {
			_connection.send(packages.SCRIPT, commands.PUBLISH, null, {
				name: name || null,
				type: type || 'live'
			});
		};
		
		_this.send = function(type, data) {
			_connection.send(type, 0, null, data);
		};
		
		
		function _onMediaInfo(e) {
			if (_this.client && _this.client.onMetaData) {
				_this.client.onMetaData(e.info);
			}
		}
		
		
		_this.bytesLoaded = function() {
			return _bytesLoaded;
		};
		
		_this.bytesTotal = function() {
			return _bytesTotal;
		};
		
		_this.info = function() {
			return _info;
		};
		
		_this.state = function() {
			return _info.state;
		};
		
		function _forward(e) {
			_this.dispatchEvent(e.type, e);
		}
		
		_init();
	};
})(playease);

(function(playease) {
	playease.core = {};
})(playease);

(function(playease) {
	playease.core.states = {
		BUFFERING: 'buffering',
		PLAYING: 'playing',
		PAUSED: 'paused',
		STOPPED: 'stopped',
		ERROR: 'error'
	};
})(playease);

(function(playease) {
	var renders = playease.core.renders = {};
	
	renders.types = {
		DEFAULT: 'def',
		FLV:     'flv',
		WSS:     'wss',
		DASH:    'dash',
		FLASH:   'flash'
	},
	
	renders.priority = [
		renders.types.DEFAULT,
		renders.types.FLV,
		renders.types.WSS,
		renders.types.DASH,
		renders.types.FLASH
	],
	
	renders.modes = {
		LIVE: 'live',
		VOD:  'vod'
	};
})(playease);

(function(playease) {
	var utils = playease.utils,
		css = utils.css,
		events = playease.events,
		core = playease.core,
		states = core.states,
		renders = core.renders,
		rendertypes = renders.types;
	
	renders.def = function(layer, config) {
		var _this = utils.extend(this, new events.eventdispatcher('renders.def')),
			_defaults = {},
			_video,
			_url,
			_src,
			_waiting;
		
		function _init() {
			_this.name = rendertypes.DEFAULT;
			
			_this.config = utils.extend({}, _defaults, config);
			
			_url = '';
			_src = '';
			_waiting = true;
			
			_video = utils.createElement('video');
			if (_this.config.airplay) {
				_video.setAttribute('x-webkit-airplay', 'allow');
			}
			if (_this.config.playsinline) {
				_video.setAttribute('playsinline', '');
				_video.setAttribute('x5-playsinline', '');
				_video.setAttribute('webkit-playsinline', '');
			}
			_video.preload = 'none';
			
			_video.addEventListener('durationchange', _onDurationChange);
			_video.addEventListener('waiting', _onWaiting);
			_video.addEventListener('canplay', _onPlaying);
			_video.addEventListener('playing', _onPlaying);
			_video.addEventListener('pause', _onPause);
			_video.addEventListener('ended', _onEnded);
			_video.addEventListener('error', _onError);
		}
		
		_this.setup = function() {
			_this.dispatchEvent(events.PLAYEASE_READY, { id: _this.config.id });
		};
		
		_this.play = function(url) {
			if (!_video.src || _video.src !== _src || url && url != _url) {
				if (url && url != _url) {
					if (!renders.def.isSupported(url)) {
						_this.dispatchEvent(events.PLAYEASE_RENDER_ERROR, { message: 'Resource not supported by render "' + _this.name + '".' });
						return;
					}
					
					_url = url;
				}
				
				_waiting = true;
				
				_video.src = _url;
				_video.load();
				
				_src = _video.src;
			}
			
			var promise = _video.play();
			if (promise) {
				promise['catch'](function(e) { /* void */ });
			}
			
			_video.controls = false;
		};
		
		_this.pause = function() {
			_waiting = false;
			
			_video.pause();
			_video.controls = false;
		};
		
		_this.reload = function() {
			_this.stop();
			_this.play(_url);
		};
		
		_this.seek = function(offset) {
			if (isNaN(_video.duration)) {
				_this.play();
			} else {
				_video.currentTime = offset * _video.duration / 100;
				
				var promise = _video.play();
				if (promise) {
					promise['catch'](function(e) { /* void */ });
				}
			}
			
			_video.controls = false;
		};
		
		_this.stop = function() {
			_src = '';
			_waiting = true;
			
			_video.removeAttribute('src');
			_video.load();
			_video.controls = false;
			
			_this.dispatchEvent(events.PLAYEASE_STATE, { state: states.STOPPED });
		};
		
		_this.mute = function(muted) {
			_video.muted = muted;
		};
		
		_this.volume = function(vol) {
			_video.volume = vol / 100;
		};
		
		_this.hd = function(index) {
			
		};
		
		
		_this.getRenderInfo = function() {
			var buffered;
			var position = _video.currentTime;
			var duration = _video.duration;
			
			var ranges = _video.buffered, start, end;
			for (var i = 0; i < ranges.length; i++) {
				start = ranges.start(i);
				end = ranges.end(i);
				if (start <= position && position < end) {
					buffered = duration ? Math.floor(end / _video.duration * 10000) / 100 : 0;
				}
			}
			
			if (_waiting && end - position >= _this.config.bufferTime) {
				_waiting = false;
				_this.dispatchEvent(events.PLAYEASE_VIEW_PLAY);
			}
			
			return {
				buffered: buffered,
				position: position,
				duration: duration
			};
		};
		
		
		function _onDurationChange(e) {
			_this.dispatchEvent(events.PLAYEASE_DURATION, { duration: e.target.duration });
		}
		
		function _onWaiting(e) {
			_waiting = true;
			_this.dispatchEvent(events.PLAYEASE_STATE, { state: states.BUFFERING });
		}
		
		function _onPlaying(e) {
			_this.dispatchEvent(events.PLAYEASE_STATE, { state: states.PLAYING });
		}
		
		function _onPause(e) {
			if (!_waiting) {
				_this.dispatchEvent(events.PLAYEASE_STATE, { state: states.PAUSED });
			}
		}
		
		function _onEnded(e) {
			_this.dispatchEvent(events.PLAYEASE_STATE, { state: states.STOPPED });
		}
		
		function _onError(e) {
			var message = 'Video error ocurred!';
			_this.dispatchEvent(events.PLAYEASE_RENDER_ERROR, { message: message });
			_this.dispatchEvent(events.PLAYEASE_STATE, { state: states.ERROR, message: message });
		}
		
		
		_this.element = function() {
			return _video;
		};
		
		_this.resize = function(width, height) {
			css.style(_video, {
				width: width + 'px',
				height: height + 'px'
			});
		};
		
		_this.destroy = function() {
			
		};
		
		_init();
	};
	
	renders.def.isSupported = function(file) {
		var protocol = utils.getProtocol(file);
		if (protocol != 'http' && protocol != 'https') {
			return false;
		}
		
		if (utils.isMSIE(8)) {
			return false;
		}
		
		var mobilemap = [
			'm3u8', 'm3u', 'hls',
			'mp4', 'f4v', 'm4v', 'mov',
			'm4a', 'f4a', 'aac',
			'ogv', 'ogg',
			'mp3',
			'oga',
			'webm'
		];
		var html5map = [
			'mp4', 'f4v', 'm4v', 'mov',
			'm4a', 'f4a', 'aac',
			'ogv', 'ogg',
			'mp3',
			'oga',
			'webm'
		];
		var map = utils.isMobile() ? mobilemap : html5map;
		var extension = utils.getExtension(file);
		for (var i = 0; i < map.length; i++) {
			if (extension === map[i]) {
				return true;
			}
		}
		
		return false;
	};
})(playease);

(function(playease) {
	var utils = playease.utils,
		css = utils.css,
		//filekeeper = utils.filekeeper,
		events = playease.events,
		io = playease.io,
		readystates = io.readystates,
		priority = io.priority,
		muxer = playease.muxer,
		core = playease.core,
		states = core.states,
		renders = core.renders,
		rendertypes = renders.types,
		rendermodes = renders.modes,
		
		AMF = muxer.AMF,
		TAG = muxer.flv.TAG,
		FORMATS = muxer.flv.FORMATS,
		CODECS = muxer.flv.CODECS;
	
	renders.flv = function(layer, config) {
		var _this = utils.extend(this, new events.eventdispatcher('renders.flv')),
			_defaults = {},
			_video,
			_url,
			_src,
			_range,
			_contentLength,
			_loader,
			_demuxer,
			_remuxer,
			_mediainfo,
			_ms,
			_sb,
			_segments,
			//_fileindex,
			//_filekeeper,
			_waiting,
			_endOfStream = false;
		
		function _init() {
			_this.name = rendertypes.FLV;
			
			_this.config = utils.extend({}, _defaults, config);
			
			_url = '';
			_src = '';
			_contentLength = 0;
			_waiting = true;
			
			_range = { start: 0, end: _this.config.mode == rendermodes.VOD ? 64 * 1024 * 1024 - 1 : '' };
			
			_sb = { audio: null, video: null };
			_segments = { audio: [], video: [] };
			
			_video = utils.createElement('video');
			if (_this.config.airplay) {
				_video.setAttribute('x-webkit-airplay', 'allow');
			}
			if (_this.config.playsinline) {
				_video.setAttribute('playsinline', '');
				_video.setAttribute('x5-playsinline', '');
				_video.setAttribute('webkit-playsinline', '');
			}
			_video.preload = 'none';
			
			_video.addEventListener('durationchange', _onDurationChange);
			_video.addEventListener('waiting', _onWaiting);
			_video.addEventListener('playing', _onPlaying);
			_video.addEventListener('pause', _onPause);
			_video.addEventListener('ended', _onEnded);
			_video.addEventListener('error', _onError);
			/*
			_fileindex = 0;
			_filekeeper = new filekeeper();
			*/
			_initMuxer();
			_initMSE();
		}
		
		function _initLoader() {
			var name, type = _this.config.loader.name;
			
			if (type && io.hasOwnProperty(type) && io[type].isSupported()) {
				name = type;
			} else {
				for (var i = 0; i < priority.length; i++) {
					type = priority[i];
					if (io[type].isSupported(_url)) {
						name = type;
						break;
					}
				}
			}
			
			if (_loader) {
				_loader.abort();
				
				if (_loader.name == name) {
					return;
				} else {
					_loader.removeEventListener(events.PLAYEASE_CONTENT_LENGTH, _onContenLength);
					_loader.removeEventListener(events.PLAYEASE_PROGRESS, _onLoaderProgress);
					_loader.removeEventListener(events.PLAYEASE_COMPLETE, _onLoaderComplete);
					_loader.removeEventListener(events.ERROR, _onLoaderError);
					
					delete _loader;
				}
			}
			
			try {
				_loader = new io[name](_this.config.loader);
				_loader.addEventListener(events.PLAYEASE_CONTENT_LENGTH, _onContenLength);
				_loader.addEventListener(events.PLAYEASE_PROGRESS, _onLoaderProgress);
				_loader.addEventListener(events.PLAYEASE_COMPLETE, _onLoaderComplete);
				_loader.addEventListener(events.ERROR, _onLoaderError);
				
				utils.log('"' + name + '" initialized.');
			} catch (err) {
				utils.log('Failed to init loader "' + name + '"!');
				_this.dispatchEvent(events.PLAYEASE_RENDER_ERROR, { message: 'No supported loader found.' });
			}
		}
		
		function _initMuxer() {
			_demuxer = new muxer.flv();
			_demuxer.addEventListener(events.PLAYEASE_FLV_TAG, _onFLVTag);
			_demuxer.addEventListener(events.PLAYEASE_MEDIA_INFO, _onMediaInfo);
			_demuxer.addEventListener(events.PLAYEASE_AVC_CONFIG_RECORD, _onAVCConfigRecord);
			_demuxer.addEventListener(events.PLAYEASE_AVC_SAMPLE, _onAVCSample);
			_demuxer.addEventListener(events.PLAYEASE_AAC_SPECIFIC_CONFIG, _onAACSpecificConfig);
			_demuxer.addEventListener(events.PLAYEASE_AAC_SAMPLE, _onAACSample);
			_demuxer.addEventListener(events.PLAYEASE_END_OF_STREAM, _onEndOfStream);
			_demuxer.addEventListener(events.ERROR, _onDemuxerError);
			
			_remuxer = new muxer.mp4();
			_remuxer.addEventListener(events.PLAYEASE_MP4_INIT_SEGMENT, _onMP4InitSegment);
			_remuxer.addEventListener(events.PLAYEASE_MP4_SEGMENT, _onMP4Segment);
			_remuxer.addEventListener(events.ERROR, _onRemuxerError);
		}
		
		function _initMSE() {
			window.MediaSource = window.MediaSource || window.WebKitMediaSource;
			
			_ms = new MediaSource();
			_ms.addEventListener('sourceopen', _onMediaSourceOpen);
			_ms.addEventListener('sourceended', _onMediaSourceEnded);
			_ms.addEventListener('sourceclose', _onMediaSourceClose);
			_ms.addEventListener('error', _onMediaSourceError);
			
			_ms.addEventListener('webkitsourceopen', _onMediaSourceOpen);
			_ms.addEventListener('webkitsourceended', _onMediaSourceEnded);
			_ms.addEventListener('webkitsourceclose', _onMediaSourceClose);
			_ms.addEventListener('webkiterror', _onMediaSourceError);
		}
		
		_this.setup = function() {
			_this.dispatchEvent(events.PLAYEASE_READY, { id: _this.config.id });
		};
		
		_this.play = function(url) {
			if (!_video.src || _video.src !== _src || url && url != _url) {
				if (url && url != _url) {
					if (!renders.flv.isSupported(url)) {
						_this.dispatchEvent(events.PLAYEASE_RENDER_ERROR, { message: 'Resource not supported by render "' + _this.name + '".' });
						return;
					}
					
					_url = url;
				}
				
				_waiting = true;
				
				_segments.audio = [];
				_segments.video = [];
				
				_initLoader();
				
				_demuxer.reset();
				_remuxer.reset();
				
				_video.src = URL.createObjectURL(_ms);
				_video.load();
				
				_src = _video.src;
			}
			
			var promise = _video.play();
			if (promise) {
				promise['catch'](function(e) { /* void */ });
			}
			
			_video.controls = false;
		};
		
		_this.pause = function() {
			_waiting = false;
			
			_video.pause();
			_video.controls = false;
		};
		
		_this.reload = function() {
			_this.stop();
			_this.play(_url);
		};
		
		_this.seek = function(offset) {
			if (isNaN(_video.duration)) {
				_this.play();
			} else {
				_video.currentTime = offset * _video.duration / 100;
				
				var promise = _video.play();
				if (promise) {
					promise['catch'](function(e) { /* void */ });
				}
			}
			
			_video.controls = false;
		};
		
		_this.stop = function() {
			_src = '';
			_waiting = true;
			
			if (_ms) {
				if (_sb.audio) {
					try {
						_ms.removeSourceBuffer(_sb.audio);
					} catch (err) {
						utils.log('Failed to removeSourceBuffer(audio): ' + err.toString());
					}
				}
				if (_sb.video) {
					try {
						_ms.removeSourceBuffer(_sb.video);
					} catch (err) {
						utils.log('Failed to removeSourceBuffer(video): ' + err.toString());
					}
				}
				
				_sb.audio = null;
				_sb.video = null;
			}
			
			_segments.audio = [];
			_segments.video = [];
			
			if (_loader) {
				_loader.abort();
			}
			
			_video.removeAttribute('src');
			_video.load();
			_video.controls = false;
			
			_this.dispatchEvent(events.PLAYEASE_STATE, { state: states.STOPPED });
		};
		
		_this.mute = function(muted) {
			_video.muted = muted;
		};
		
		_this.volume = function(vol) {
			_video.volume = vol / 100;
		};
		
		_this.hd = function(index) {
			
		};
		
		/**
		 * Loader
		 */
		function _onContenLength(e) {
			utils.log('onContenLength: ' + e.length);
			_contentLength = e.length;
		}
		
		function _onLoaderProgress(e) {
			//utils.log('onLoaderProgress: ' + e.data.byteLength);
			_demuxer.parse(e.data);
		}
		
		function _onLoaderComplete(e) {
			utils.log('onLoaderComplete');
		}
		
		function _onLoaderError(e) {
			utils.log(e.message);
			_this.dispatchEvent(events.PLAYEASE_RENDER_ERROR, { message: e.message });
		}
		
		/**
		 * Demuxer
		 */
		function _onFLVTag(e) {
			//utils.log('onFlvTag { tag: ' + e.tag + ', offset: ' + e.offset + ', size: ' + e.size + ' }');
			
			switch (e.tag) {
				case TAG.AUDIO:
					if (e.format && e.format != FORMATS.AAC) {
						utils.log('Unsupported audio format(' + e.format + ').');
						break;
					}
					
					_demuxer.parseAACAudioPacket(e.data, e.offset, e.size, e.timestamp, e.rate, e.samplesize, e.sampletype);
					break;
				case TAG.VIDEO:
					if (e.codec && e.codec != CODECS.AVC) {
						utils.log('Unsupported video codec(' + e.codec + ').');
						break;
					}
					
					_demuxer.parseAVCVideoPacket(e.data, e.offset, e.size, e.timestamp, e.frametype);
					break;
				case TAG.SCRIPT:
					var data = AMF.parse(e.data, e.offset, e.size);
					utils.log(data.key + ': ' + JSON.stringify(data.value));
					
					if (data.key == 'onMetaData') {
						_demuxer.setMetaData(data.value);
					}
					break;
				default:
					utils.log('Skipping unknown tag type ' + e.tag);
			}
		}
		
		function _onMediaInfo(e) {
			_mediainfo = e.info;
			
			_this.addSourceBuffer('audio');
			_this.addSourceBuffer('video');
		}
		
		function _onAVCConfigRecord(e) {
			_remuxer.setVideoMeta(e.data);
			_remuxer.getInitSegment(e.data);
		}
		
		function _onAVCSample(e) {
			_remuxer.getVideoSegment(e.data);
		}
		
		function _onAACSpecificConfig(e) {
			_remuxer.setAudioMeta(e.data);
			_remuxer.getInitSegment(e.data);
		}
		
		function _onAACSample(e) {
			_remuxer.getAudioSegment(e.data);
		}
		
		function _onEndOfStream(e) {
			_endOfStream = true;
		}
		
		function _onDemuxerError(e) {
			utils.log(e.message);
			_this.dispatchEvent(events.PLAYEASE_RENDER_ERROR, { message: 'Demuxer error ocurred.' });
		}
		
		/**
		 * Remuxer
		 */
		function _onMP4InitSegment(e) {
			/*if (e.tp == 'video') {
				_fileindex++
				_filekeeper.append(e.data);
				//_filekeeper.save('sample.' + e.tp + '.init.mp4');
			}*/
			
			_segments[e.tp].push(e.data);
		}
		
		function _onMP4Segment(e) {
			/*if (e.tp == 'video') {
				_fileindex++
				_filekeeper.append(e.data);
				//_filekeeper.save('sample.' + e.tp + '.' + (_fileindex++) + '.m4s');
				if (_fileindex == 500) {
					_filekeeper.save('sample.flv.mp4');
				}
			}*/
			
			e.data.info = e.info;
			
			_segments[e.tp].push(e.data);
			_this.appendSegment(e.tp);
		}
		
		function _onRemuxerError(e) {
			utils.log(e.message);
			_this.dispatchEvent(events.PLAYEASE_RENDER_ERROR, { message: 'Remuxer error ocurred.' });
		}
		
		/**
		 * MSE
		 */
		_this.addSourceBuffer = function(type) {
			var mimetype = type + '/mp4; codecs="' + _mediainfo[type + 'Codec'] + '"';
			utils.log('Mime type: ' + mimetype + '.');
			
			var issurpported = MediaSource.isTypeSupported(mimetype);
			if (!issurpported) {
				_this.dispatchEvent(events.PLAYEASE_RENDER_ERROR, { message: 'Mime type is not surpported: ' + mimetype + '.' });
				return;
			}
			
			if (_ms.readyState == 'closed') {
				_this.dispatchEvent(events.PLAYEASE_RENDER_ERROR, { message: 'MediaSource is closed while appending init segment.' });
				return;
			}
			
			var sb;
			try {
				sb = _sb[type] = _ms.addSourceBuffer(mimetype);
			} catch (err) {
				utils.log('Failed to addSourceBuffer for ' + type + ', mimeType: ' + mimetype + '.');
				return;
			}
			
			sb.type = type;
			sb.addEventListener('updateend', _onUpdateEnd);
			sb.addEventListener('error', _onSourceBufferError);
		};
		
		_this.appendSegment = function(type) {
			if (_segments[type].length == 0) {
				return;
			}
			
			var sb = _sb[type];
			if (!sb || sb.updating) {
				return;
			}
			
			var seg = _segments[type].shift();
			try {
				sb.appendBuffer(seg);
			} catch (err) {
				utils.log('Failed to appendBuffer: ' + err.toString());
			}
		};
		
		function _onMediaSourceOpen(e) {
			utils.log('media source open');
			
			_loader.load(_url, _range.start, _range.end);
		}
		
		function _onUpdateEnd(e) {
			//utils.log('update end');
			
			var type = e.target.type;
			
			if (_endOfStream) {
				if (!_ms || _ms.readyState !== 'open') {
					return;
				}
				
				if (!_segments.audio.length && !_segments.video.length) {
					//_filekeeper.save('sample.flv.mp4');
					_ms.endOfStream();
					return;
				}
			}
			
			_this.appendSegment(type);
		}
		
		function _onSourceBufferError(e) {
			utils.log('source buffer error');
		}
		
		function _onMediaSourceEnded(e) {
			utils.log('media source ended');
		}
		
		function _onMediaSourceClose(e) {
			utils.log('media source close');
		}
		
		function _onMediaSourceError(e) {
			utils.log('media source error');
			_this.dispatchEvent(events.PLAYEASE_RENDER_ERROR, { message: 'MediaSource error ocurred.' });
		}
		
		
		_this.getRenderInfo = function() {
			var buffered;
			var position = _video.currentTime;
			var duration = _video.duration;
			
			var ranges = _video.buffered, start, end;
			for (var i = 0; i < ranges.length; i++) {
				start = ranges.start(i);
				end = ranges.end(i);
				if (/*start <= position && */position < end) {
					buffered = duration ? Math.floor(end / _video.duration * 10000) / 100 : 0;
				}
				
				if (i == 0 && position < start) {
					_video.currentTime = start;
				}
			}
			
			if (_waiting && end - position >= _this.config.bufferTime) {
				_waiting = false;
				_this.dispatchEvent(events.PLAYEASE_STATE, { state: states.PLAYING });
			}
			
			if (_this.config.mode == rendermodes.VOD && _loader && _loader.state() == readystates.DONE) {
				var dts = end * 1000;
				
				if (_segments.video.length) {
					dts = Math.max(dts, _segments.video[_segments.video.length - 1].info.endDts);
				}
				if (_segments.audio.length) {
					dts = Math.max(dts, _segments.audio[_segments.audio.length - 1].info.endDts);
				}
				
				if (dts && dts / 1000 - position < 120 && _range.end < _contentLength - 1) {
					_range.start = _range.end + 1;
					_range.end += 32 * 1024 * 1024;
					_loader.load(_url, _range.start, _range.end);
				}
			}
			
			return {
				buffered: buffered,
				position: position,
				duration: duration
			};
		};
		
		
		function _onDurationChange(e) {
			_this.dispatchEvent(events.PLAYEASE_DURATION, { duration: e.target.duration });
		}
		
		function _onWaiting(e) {
			_waiting = true;
			_this.dispatchEvent(events.PLAYEASE_STATE, { state: states.BUFFERING });
		}
		
		function _onPlaying(e) {
			_this.dispatchEvent(events.PLAYEASE_STATE, { state: states.PLAYING });
		}
		
		function _onPause(e) {
			if (!_waiting) {
				_this.dispatchEvent(events.PLAYEASE_STATE, { state: states.PAUSED });
			}
		}
		
		function _onEnded(e) {
			_this.dispatchEvent(events.PLAYEASE_STATE, { state: states.STOPPED });
		}
		
		function _onError(e) {
			var message = 'Video error ocurred!';
			_this.dispatchEvent(events.PLAYEASE_RENDER_ERROR, { message: message });
			_this.dispatchEvent(events.PLAYEASE_STATE, { state: states.ERROR, message: message });
		}
		
		
		_this.element = function() {
			return _video;
		};
		
		_this.resize = function(width, height) {
			css.style(_video, {
				width: width + 'px',
				height: height + 'px'
			});
		};
		
		_this.destroy = function() {
			
		};
		
		_init();
	};
	
	renders.flv.isSupported = function(file) {
		var protocol = utils.getProtocol(file);
		if (protocol != 'http' && protocol != 'https'
				&& protocol != 'ws' && protocol != 'wss') {
			return false;
		}
		
		if (utils.isMSIE('(8|9|10)') || utils.isIETrident() || utils.isIOS()) {
			return false;
		}
		
		var extension = utils.getExtension(file);
		if (extension != 'flv' && extension != undefined) {
			return false;
		}
		
		return true;
	};
})(playease);

(function(playease) {
	var utils = playease.utils,
		css = utils.css,
		//filekeeper = utils.filekeeper,
		events = playease.events,
		io = playease.io,
		readystates = io.readystates,
		net = playease.net,
		responder = net.responder,
		status = net.netstatus,
		netconnection = net.netconnection,
		netstream = net.netstream,
		core = playease.core,
		states = core.states,
		renders = core.renders,
		rendertypes = renders.types,
		rendermodes = renders.modes;
	
	renders.wss = function(layer, config) {
		var _this = utils.extend(this, new events.eventdispatcher('renders.wss')),
			_defaults = {},
			_video,
			_url,
			_src,
			_range,
			_contentLength,
			_application,
			_streamname,
			_connection,
			_stream,
			_metadata,
			_ms,
			_sb,
			_segments,
			//_fileindex,
			//_filekeeper,
			_waiting,
			_endOfStream = false;
		
		function _init() {
			_this.name = rendertypes.WSS;
			
			_this.config = utils.extend({}, _defaults, config);
			
			_url = '';
			_src = '';
			_contentLength = 0;
			_waiting = true;
			
			_range = { start: 0, end: _this.config.mode == rendermodes.VOD ? 64 * 1024 * 1024 - 1 : '' };
			
			_metadata = {
				audioCodec: 'mp4a.40.2',
				videoCodec: 'avc1.42E01E'
			};
			
			_sb = { audio: null, video: null };
			_segments = { audio: [], video: [] };
			
			_video = utils.createElement('video');
			if (_this.config.airplay) {
				_video.setAttribute('x-webkit-airplay', 'allow');
			}
			if (_this.config.playsinline) {
				_video.setAttribute('playsinline', '');
				_video.setAttribute('x5-playsinline', '');
				_video.setAttribute('webkit-playsinline', '');
			}
			_video.preload = 'none';
			
			_video.addEventListener('durationchange', _onDurationChange);
			_video.addEventListener('waiting', _onWaiting);
			_video.addEventListener('playing', _onPlaying);
			_video.addEventListener('pause', _onPause);
			_video.addEventListener('ended', _onEnded);
			_video.addEventListener('error', _onError);
			/*
			_fileindex = 0;
			_filekeeper = new filekeeper();
			*/
			_initNetConnection();
			_initNetStream();
			_initMSE();
		}
		
		function _initNetConnection() {
			_connection = new netconnection();
			_connection.addEventListener(events.PLAYEASE_NET_STATUS, _statusHandler);
			_connection.addEventListener(events.PLAYEASE_SECURITY_ERROR, _onConnectionError);
			_connection.addEventListener(events.PLAYEASE_IO_ERROR, _onConnectionError);
			_connection.client = _this;
		}
		
		function _initNetStream() {
			_stream = new netstream(_connection);
			_stream.addEventListener(events.PLAYEASE_NET_STATUS, _statusHandler);
			_stream.addEventListener(events.PLAYEASE_MP4_INIT_SEGMENT, _onMP4InitSegment);
			_stream.addEventListener(events.PLAYEASE_MP4_SEGMENT, _onMP4Segment);
			_stream.addEventListener(events.PLAYEASE_IO_ERROR, _onStreamError);
			_stream.client = _this;
		}
		
		function _initMSE() {
			window.MediaSource = window.MediaSource || window.WebKitMediaSource;
			
			_ms = new MediaSource();
			_ms.addEventListener('sourceopen', _onMediaSourceOpen);
			_ms.addEventListener('sourceended', _onMediaSourceEnded);
			_ms.addEventListener('sourceclose', _onMediaSourceClose);
			_ms.addEventListener('error', _onMediaSourceError);
			
			_ms.addEventListener('webkitsourceopen', _onMediaSourceOpen);
			_ms.addEventListener('webkitsourceended', _onMediaSourceEnded);
			_ms.addEventListener('webkitsourceclose', _onMediaSourceClose);
			_ms.addEventListener('webkiterror', _onMediaSourceError);
		}
		
		_this.setup = function() {
			_this.dispatchEvent(events.PLAYEASE_READY, { id: _this.config.id });
		};
		
		function _statusHandler(e) {
			utils.log(e.info.code);
			
			switch (e.info.code) {
				case status.NETCONNECTION_CONNECT_SUCCESS:
					_this.play(_url);
					break;
					
				case status.NETCONNECTION_CONNECT_CLOSED:
				case status.NETSTREAM_FAILED:
				case status.NETSTREAM_PLAY_FAILED:
				case status.NETSTREAM_PLAY_FILESTRUCTUREINVALID:
				case status.NETSTREAM_PLAY_STOP:
				case status.NETSTREAM_PLAY_STREAMNOTFOUND:
				case status.NETSTREAM_PLAY_UNPUBLISHNOTIFY:
				case status.NETSTREAM_SEEK_FAILED:
					_this.dispatchEvent(events.PLAYEASE_RENDER_ERROR, { message: e.info.code });
					break;
			}
		}
		
		function _onConnectionError(e) {
			utils.log(e.message);
			_this.dispatchEvent(events.PLAYEASE_RENDER_ERROR, { message: 'NetConnection error ocurred.' });
		}
		
		function _onStreamError(e) {
			utils.log(e.message);
			_this.dispatchEvent(events.PLAYEASE_RENDER_ERROR, { message: 'NetStream error ocurred.' });
		}
		
		_this.play = function(url) {
			if (!_video.src || _video.src !== _src || url && url != _url) {
				if (url && url != _url) {
					if (!renders.wss.isSupported(url)) {
						_this.dispatchEvent(events.PLAYEASE_RENDER_ERROR, { message: 'Resource not supported by render "' + _this.name + '".' });
						return;
					}
					
					_url = url;
				}
				
				if (!_connection.connected()) {
					var re = new RegExp('^(ws[s]?\:\/\/[a-z0-9\.\-]+(\:[0-9]+)?(\/[a-z0-9\.\-_]+)+)\/([a-z0-9\.\-_]+)$', 'i');
					var arr = _url.match(re);
					if (arr && arr.length > 4) {
						_application = arr[1];
						_streamname = arr[4];
					} else {
						utils.log('Failed to match wss URL: ' + _url);
						_this.dispatchEvent(events.PLAYEASE_RENDER_ERROR, { message: 'Bad URL format!' });
						return;
					}
					
					utils.log('Connecting to ' + _application + ' ...');
					_connection.connect(_application);
					
					return;
				}
				
				if (_stream) {
					_stream.close();
				}
				
				_waiting = true;
				
				_segments.audio = [];
				_segments.video = [];
				
				_video.src = URL.createObjectURL(_ms);
				_video.load();
				
				_src = _video.src;
			}
			
			var promise = _video.play();
			if (promise) {
				promise['catch'](function(e) { /* void */ });
			}
			
			_video.controls = false;
		};
		
		_this.pause = function() {
			_waiting = false;
			
			_video.pause();
			_video.controls = false;
		};
		
		_this.reload = function() {
			_this.stop();
			_this.play(_url);
		};
		
		_this.seek = function(offset) {
			if (isNaN(_video.duration)) {
				_this.play();
			} else {
				if (_stream) {
					_stream.seek(offset * _video.duration / 100);
				}
				
				var promise = _video.play();
				if (promise) {
					promise['catch'](function(e) { /* void */ });
				}
			}
			
			_video.controls = false;
		};
		
		_this.stop = function() {
			if (_stream) {
				_stream.dispose();
			}
			_connection.close();
			
			_src = '';
			_waiting = true;
			
			if (_ms) {
				if (_sb.audio) {
					try {
						_ms.removeSourceBuffer(_sb.audio);
					} catch (err) {
						utils.log('Failed to removeSourceBuffer(audio): ' + err.toString());
					}
				}
				if (_sb.video) {
					try {
						_ms.removeSourceBuffer(_sb.video);
					} catch (err) {
						utils.log('Failed to removeSourceBuffer(video): ' + err.toString());
					}
				}
				
				_sb.audio = null;
				_sb.video = null;
			}
			
			_segments.audio = [];
			_segments.video = [];
			
			_video.removeAttribute('src');
			_video.load();
			_video.controls = false;
			
			_this.dispatchEvent(events.PLAYEASE_STATE, { state: states.STOPPED });
		};
		
		_this.mute = function(muted) {
			_video.muted = muted;
		};
		
		_this.volume = function(vol) {
			_video.volume = vol / 100;
		};
		
		_this.hd = function(index) {
			
		};
		
		
		_this.onMetaData = function(data) {
			_metadata = data;
			
			_this.addSourceBuffer('audio');
			_this.addSourceBuffer('video');
		};
		
		function _onMP4InitSegment(e) {
			/*if (e.tp == 'video') {
				_fileindex++
				_filekeeper.append(e.data);
				//_filekeeper.save('sample.' + e.tp + '.init.mp4');
			}*/
			
			_segments[e.tp].push(e.data);
		}
		
		function _onMP4Segment(e) {
			/*if (e.tp == 'video') {
				_fileindex++
				_filekeeper.append(e.data);
				//_filekeeper.save('sample.' + e.tp + '.' + (_fileindex++) + '.m4s');
				if (_fileindex == 500) {
					_filekeeper.save('sample.wss.normal.mp4');
				}
			}*/
			
			e.data.info = e.info;
			
			_segments[e.tp].push(e.data);
			_this.appendSegment(e.tp);
		}
		
		/**
		 * MSE
		 */
		_this.addSourceBuffer = function(type) {
			var mimetype = type + '/mp4; codecs="' + _metadata[type + 'Codec'] + '"';
			utils.log('Mime type: ' + mimetype + '.');
			
			var issurpported = MediaSource.isTypeSupported(mimetype);
			if (!issurpported) {
				_this.dispatchEvent(events.PLAYEASE_RENDER_ERROR, { message: 'Mime type is not surpported: ' + mimetype + '.' });
				return;
			}
			
			if (_ms.readyState == 'closed') {
				_this.dispatchEvent(events.PLAYEASE_RENDER_ERROR, { message: 'MediaSource is closed while appending init segment.' });
				return;
			}
			
			var sb;
			try {
				sb = _sb[type] = _ms.addSourceBuffer(mimetype);
			} catch (err) {
				utils.log('Failed to addSourceBuffer for ' + type + ', mimeType: ' + mimetype + '.');
				return;
			}
			
			sb.type = type;
			sb.addEventListener('updateend', _onUpdateEnd);
			sb.addEventListener('error', _onSourceBufferError);
		};
		
		_this.appendSegment = function(type) {
			if (_segments[type].length == 0) {
				return;
			}
			
			var sb = _sb[type];
			if (!sb || sb.updating) {
				return;
			}
			
			var seg = _segments[type].shift();
			try {
				sb.appendBuffer(seg);
			} catch (err) {
				utils.log('Failed to appendBuffer: ' + err.toString());
			}
		};
		
		function _onMediaSourceOpen(e) {
			utils.log('media source open');
			utils.log('Playing ' + _streamname + ' ...');
			
			// TODO: addSourceBuffer while metadata reached.
			_this.addSourceBuffer('audio');
			_this.addSourceBuffer('video');
			
			_stream.play(_streamname);
		}
		
		function _onUpdateEnd(e) {
			//utils.log('update end');
			
			var type = e.target.type;
			
			if (_endOfStream) {
				if (!_ms || _ms.readyState !== 'open') {
					return;
				}
				
				if (!_segments.audio.length && !_segments.video.length) {
					//_filekeeper.save('sample.wss.mp4');
					_ms.endOfStream();
					return;
				}
			}
			
			_this.appendSegment(type);
		}
		
		function _onSourceBufferError(e) {
			utils.log('source buffer error');
		}
		
		function _onMediaSourceEnded(e) {
			utils.log('media source ended');
		}
		
		function _onMediaSourceClose(e) {
			utils.log('media source close');
		}
		
		function _onMediaSourceError(e) {
			utils.log('media source error');
			_this.dispatchEvent(events.PLAYEASE_RENDER_ERROR, { message: 'MediaSource error ocurred.' });
		}
		
		
		_this.getRenderInfo = function() {
			var buffered;
			var position = _video.currentTime;
			var duration = _video.duration;
			
			var ranges = _video.buffered, start, end;
			for (var i = 0; i < ranges.length; i++) {
				start = ranges.start(i);
				end = ranges.end(i);
				if (/*start <= position && */position < end) {
					buffered = duration ? Math.floor(end / _video.duration * 10000) / 100 : 0;
				}
				
				if (i == 0 && position < start) {
					_video.currentTime = start;
				}
			}
			
			if (_waiting && end - position >= _this.config.bufferTime) {
				_waiting = false;
				_this.dispatchEvent(events.PLAYEASE_STATE, { state: states.PLAYING });
			}
			
			if (_this.config.mode == rendermodes.VOD && _stream.state() == readystates.DONE) {
				var dts = end * 1000;
				
				if (_segments.video.length) {
					dts = Math.max(dts, _segments.video[_segments.video.length - 1].info.endDts);
				}
				if (_segments.audio.length) {
					dts = Math.max(dts, _segments.audio[_segments.audio.length - 1].info.endDts);
				}
				
				if (dts && dts / 1000 - position < 120 && _range.end < _contentLength - 1) {
					_range.start = _range.end + 1;
					_range.end += 32 * 1024 * 1024;
					_loader.load(_url, _range.start, _range.end);
				}
			}
			
			return {
				buffered: buffered,
				position: position,
				duration: duration
			};
		};
		
		
		function _onDurationChange(e) {
			_this.dispatchEvent(events.PLAYEASE_DURATION, { duration: e.target.duration });
		}
		
		function _onWaiting(e) {
			_waiting = true;
			_this.dispatchEvent(events.PLAYEASE_STATE, { state: states.BUFFERING });
		}
		
		function _onPlaying(e) {
			_this.dispatchEvent(events.PLAYEASE_STATE, { state: states.PLAYING });
		}
		
		function _onPause(e) {
			if (!_waiting) {
				_this.dispatchEvent(events.PLAYEASE_STATE, { state: states.PAUSED });
			}
		}
		
		function _onEnded(e) {
			_this.dispatchEvent(events.PLAYEASE_STATE, { state: states.STOPPED });
		}
		
		function _onError(e) {
			var message = 'Video error ocurred!';
			_this.dispatchEvent(events.PLAYEASE_RENDER_ERROR, { message: message });
			_this.dispatchEvent(events.PLAYEASE_STATE, { state: states.ERROR, message: message });
		}
		
		
		_this.element = function() {
			return _video;
		};
		
		_this.resize = function(width, height) {
			css.style(_video, {
				width: width + 'px',
				height: height + 'px'
			});
		};
		
		_this.destroy = function() {
			
		};
		
		_init();
	};
	
	renders.wss.isSupported = function(file) {
		var protocol = utils.getProtocol(file);
		if (protocol != 'ws' && protocol != 'wss') {
			return false;
		}
		
		if (utils.isMSIE('(8|9|10)') || utils.isIOS()) {
			return false;
		}
		
		var map = [
			undefined, '', // live stream
			'flv',
			'mp4', 'f4v', 'm4v', 'mov',
			'm4a', 'f4a', 'aac',
			'mp3'
		];
		var extension = utils.getExtension(file);
		for (var i = 0; i < map.length; i++) {
			if (extension === map[i]) {
				return true;
			}
		}
		
		return false;
	};
})(playease);

(function(playease) {
	var utils = playease.utils,
		css = utils.css,
		//filekeeper = utils.filekeeper,
		events = playease.events,
		matchers = utils.matchers,
		io = playease.io,
		readystates = io.readystates,
		priority = io.priority,
		muxer = playease.muxer,
		core = playease.core,
		states = core.states,
		renders = core.renders,
		rendertypes = renders.types,
		rendermodes = renders.modes,
		
		fragmentTypes = {
			INIT_SEGMENT: 0,
			SEGMENT:      1
		},
		
		request = function(type) {
			var _this = this;
			
			function _init() {
				_this.type = type;
				_this.reset();
			}
			
			_this.reset = function() {
				_this.fragmentType = fragmentTypes.INIT_SEGMENT;
				_this.mimeType = type + '/mp4';
				_this.codecs = type == 'video' ? 'avc1.64001E' : 'mp4a.40.2';
				_this.index = NaN;
				_this.start = 0;
				_this.duration = NaN;
				_this.timescale = 1;
				_this.url = '';
			};
			
			_init();
		};
	
	renders.dash = function(layer, config) {
		var _this = utils.extend(this, new events.eventdispatcher('renders.dash')),
			_defaults = {
				videoOff: false
			},
			_video,
			_url,
			_src,
			_loader,
			_timer,
			_parser,
			_manifest,
			_range,
			_contentLength,
			_ms,
			_sb,
			_mpd,
			_segments,
			//_fileindex,
			//_filekeeper,
			_waiting,
			_endOfStream = false;
		
		function _init() {
			_this.name = rendertypes.DASH;
			
			_this.config = utils.extend({}, _defaults, config);
			
			_url = '';
			_src = '';
			_contentLength = 0;
			_waiting = true;
			
			_range = { start: 0, end: _this.config.mode == rendermodes.VOD ? 64 * 1024 * 1024 - 1 : '' };
			
			_sb = { audio: null, video: null };
			_segments = { audio: [], video: [] };
			
			_video = utils.createElement('video');
			if (_this.config.airplay) {
				_video.setAttribute('x-webkit-airplay', 'allow');
			}
			if (_this.config.playsinline) {
				_video.setAttribute('playsinline', '');
				_video.setAttribute('x5-playsinline', '');
				_video.setAttribute('webkit-playsinline', '');
			}
			_video.preload = 'none';
			
			_video.addEventListener('durationchange', _onDurationChange);
			_video.addEventListener('waiting', _onWaiting);
			_video.addEventListener('playing', _onPlaying);
			_video.addEventListener('pause', _onPause);
			_video.addEventListener('ended', _onEnded);
			_video.addEventListener('error', _onError);
			/*
			_fileindex = 0;
			_filekeeper = new filekeeper();
			*/
			_initMSE();
		}
		
		function _initLoader() {
			if (_loader && _videoloader && _audioloader) {
				return;
			}
			
			var name = 'xhr-chunked-loader';
			
			try {
				_loader = new io[name](_this.config.loader);
				_loader.addEventListener(events.PLAYEASE_CONTENT_LENGTH, _onContenLength);
				_loader.addEventListener(events.PLAYEASE_PROGRESS, _onLoaderProgress);
				_loader.addEventListener(events.PLAYEASE_COMPLETE, _onLoaderComplete);
				_loader.addEventListener(events.ERROR, _onLoaderError);
				
				utils.log('"' + name + '" for MPD files initialized.');
			} catch (err) {
				utils.log('Failed to init loader "' + name + '" for MPD files!');
				_this.dispatchEvent(events.PLAYEASE_RENDER_ERROR, { message: 'No supported loader found.' });
				return;
			}
			
			try {
				_audioloader = new io[name](utils.extend({}, _this.config.loader, { responseType: 'arraybuffer' }));
				_audioloader.addEventListener(events.PLAYEASE_CONTENT_LENGTH, _onContenLength);
				_audioloader.addEventListener(events.PLAYEASE_PROGRESS, _onLoaderProgress);
				_audioloader.addEventListener(events.PLAYEASE_COMPLETE, _onLoaderComplete);
				_audioloader.addEventListener(events.ERROR, _onLoaderError);
				_audioloader.request = new request('audio');
				
				utils.log('"' + name + '" for audio segments initialized.');
			} catch (err) {
				utils.log('Failed to init loader "' + name + '" audio segments!');
				_this.dispatchEvent(events.PLAYEASE_RENDER_ERROR, { message: 'No supported loader found.' });
				return;
			}
			
			try {
				_videoloader = new io[name](utils.extend({}, _this.config.loader, { responseType: 'arraybuffer' }));
				_videoloader.addEventListener(events.PLAYEASE_CONTENT_LENGTH, _onContenLength);
				_videoloader.addEventListener(events.PLAYEASE_PROGRESS, _onLoaderProgress);
				_videoloader.addEventListener(events.PLAYEASE_COMPLETE, _onLoaderComplete);
				_videoloader.addEventListener(events.ERROR, _onLoaderError);
				_videoloader.request = new request('video');
				
				utils.log('"' + name + '" for video segments initialized.');
			} catch (err) {
				utils.log('Failed to init loader "' + name + '" video segments!');
				_this.dispatchEvent(events.PLAYEASE_RENDER_ERROR, { message: 'No supported loader found.' });
				return;
			}
		}
		
		function _initParser() {
			if (!_parser) {
				_parser = new utils.xml2json({
					matchers: [
						new matchers.duration(),
						new matchers.datetime(),
						new matchers.numeric(),
						new matchers.string()
					]
				});
			}
		}
		
		function _initManifest() {
			if (!_manifest) {
				_manifest = new utils.manifest(_url);
			}
		}
		
		function _initMSE() {
			window.MediaSource = window.MediaSource || window.WebKitMediaSource;
			
			_ms = new MediaSource();
			_ms.addEventListener('sourceopen', _onMediaSourceOpen);
			_ms.addEventListener('sourceended', _onMediaSourceEnded);
			_ms.addEventListener('sourceclose', _onMediaSourceClose);
			_ms.addEventListener('error', _onMediaSourceError);
			
			_ms.addEventListener('webkitsourceopen', _onMediaSourceOpen);
			_ms.addEventListener('webkitsourceended', _onMediaSourceEnded);
			_ms.addEventListener('webkitsourceclose', _onMediaSourceClose);
			_ms.addEventListener('webkiterror', _onMediaSourceError);
		}
		
		_this.setup = function() {
			_this.dispatchEvent(events.PLAYEASE_READY, { id: _this.config.id });
		};
		
		_this.play = function(url) {
			if (!_video.src || _video.src !== _src || url && url != _url) {
				if (url && url != _url) {
					if (!renders.dash.isSupported(url)) {
						_this.dispatchEvent(events.PLAYEASE_RENDER_ERROR, { message: 'Resource not supported by render "' + _this.name + '".' });
						return;
					}
					
					_url = url;
				}
				
				_waiting = true;
				
				_segments.audio = [];
				_segments.video = [];
				
				_initLoader();
				_audioloader.request.reset();
				_videoloader.request.reset();
				
				_stopTimer();
				
				_video.src = URL.createObjectURL(_ms);
				_video.load();
				
				_src = _video.src;
			}
			
			var promise = _video.play();
			if (promise) {
				promise['catch'](function(e) { /* void */ });
			}
			
			_video.controls = false;
		};
		
		_this.pause = function() {
			_waiting = false;
			
			_video.pause();
			_video.controls = false;
		};
		
		_this.reload = function() {
			_this.stop();
			_this.play(_url);
		};
		
		_this.seek = function(offset) {
			if (isNaN(_video.duration)) {
				_this.play();
			} else {
				_video.currentTime = offset * _video.duration / 100;
				
				var promise = _video.play();
				if (promise) {
					promise['catch'](function(e) { /* void */ });
				}
			}
			
			_video.controls = false;
		};
		
		_this.stop = function() {
			_src = '';
			_waiting = true;
			
			if (_ms) {
				if (_sb.audio) {
					try {
						_ms.removeSourceBuffer(_sb.audio);
					} catch (err) {
						utils.log('Failed to removeSourceBuffer(audio): ' + err.toString());
					}
				}
				if (_sb.video) {
					try {
						_ms.removeSourceBuffer(_sb.video);
					} catch (err) {
						utils.log('Failed to removeSourceBuffer(video): ' + err.toString());
					}
				}
				
				_sb.audio = null;
				_sb.video = null;
			}
			
			_segments.audio = [];
			_segments.video = [];
			
			if (_loader) {
				_loader.abort();
			}
			if (_audioloader) {
				_audioloader.abort();
				_audioloader.request.reset();
			}
			if (_videoloader) {
				_videoloader.abort();
				_videoloader.request.reset();
			}
			
			_stopTimer();
			
			_video.removeAttribute('src');
			_video.load();
			_video.controls = false;
			
			_this.dispatchEvent(events.PLAYEASE_STATE, { state: states.STOPPED });
		};
		
		_this.mute = function(muted) {
			_video.muted = muted;
		};
		
		_this.volume = function(vol) {
			_video.volume = vol / 100;
		};
		
		_this.videoOff = function(off, playing) {
			_this.config.videoOff = off;
			
			if (playing) {
				if (off) {
					try {
						_ms.removeSourceBuffer(_sb.video);
						
						var mimetype = _videoloader.request.mimeType + '; codecs="' + _videoloader.request.codecs + '"';
						utils.log('Removed SourceBuffer(video), mimeType: ' + mimetype + '.');
					} catch (err) {
						utils.log('Failed to removeSourceBuffer(video): ' + err.toString());
					}
				} else {
					_this.reload();
				}
			}
		};
		
		_this.hd = function(index) {
			
		};
		
		/**
		 * Loader
		 */
		function _onContenLength(e) {
			var request = e.target.request;
			if (request) {
				if (_mpd['@profiles'] == 'urn:mpeg:dash:profile:isoff-on-demand:2011') {
					utils.log('onContenLength: ' + e.length);
					_contentLength += e.length;
				}
			}
		}
		
		function _onLoaderProgress(e) {
			var request = e.target.request;
			if (request) {
				if (request.fragmentType == fragmentTypes.INIT_SEGMENT) {
					request.fragmentType = fragmentTypes.SEGMENT;
				} else {
					request.index++;
					request.start += request.duration;
				}
				
				e.data.info = e.info;
				_segments[request.type].push(e.data);
				_this.appendSegment(request.type);
				
				_loadSegment(request);
				
				return;
			}
			
			_initParser();
			_initManifest();
			
			_mpd = _parser.parse(e.data);
			_manifest.update(_mpd);
			
			if (_audioloader.request.fragmentType == fragmentTypes.INIT_SEGMENT
					&& _videoloader.request.fragmentType == fragmentTypes.INIT_SEGMENT) {
				_this.addSourceBuffer('audio');
				_this.addSourceBuffer('video');
			}
			
			_loadSegment(_audioloader.request);
			_loadSegment(_videoloader.request);
			
			_startTimer(_mpd['@minimumUpdatePeriod'] * 1000 || 2000);
		}
		
		function _loadManifest() {
			_loader.load(_manifest.getLocation());
		}
		
		function _loadSegment(request) {
			var segmentLoader = request.type == 'audio' ? _audioloader : _videoloader;
			if (segmentLoader.state() != readystates.UNINITIALIZED && segmentLoader.state() != readystates.DONE) {
				return;
			}
			
			if (_this.config.videoOff && request.type == 'video') {
				return;
			}
			
			var segmentInfo = _manifest.getSegmentInfo(request.start, request.type, !request.fragmentType, request.start, request.index, 0);
			if (segmentInfo) {
				utils.extend(request, segmentInfo);
				segmentLoader.load(request.url);
			}
		}
		
		function _onLoaderComplete(e) {
			//utils.log('onLoaderComplete');
		}
		
		function _onLoaderError(e) {
			utils.log(e.message);
			_this.dispatchEvent(events.PLAYEASE_RENDER_ERROR, { message: e.message });
		}
		
		function _startTimer(delay) {
			if (!_timer) {
				_timer = new utils.timer(delay, 1);
				_timer.addEventListener(events.PLAYEASE_TIMER, _loadManifest);
			}
			
			_timer.delay = _timer.running() ? Math.min(_timer.delay, delay) : delay;
			
			_timer.reset();
			_timer.start();
		}
		
		function _stopTimer() {
			if (_timer) {
				_timer.stop();
			}
		}
		
		/**
		 * MSE
		 */
		_this.addSourceBuffer = function(type) {
			if (_this.config.videoOff && type == 'video') {
				return;
			}
			
			var request = type == 'audio' ? _audioloader.request : _videoloader.request;
			var mimetype = request.mimeType + '; codecs="' + request.codecs + '"';
			utils.log('Mime type: ' + mimetype + '.');
			
			var issurpported = MediaSource.isTypeSupported(mimetype);
			if (!issurpported) {
				_this.dispatchEvent(events.PLAYEASE_RENDER_ERROR, { message: 'Mime type is not surpported: ' + mimetype + '.' });
				return;
			}
			
			if (_ms.readyState == 'closed') {
				_this.dispatchEvent(events.PLAYEASE_RENDER_ERROR, { message: 'MediaSource is closed while appending init segment.' });
				return;
			}
			
			var sb;
			try {
				sb = _sb[type] = _ms.addSourceBuffer(mimetype);
			} catch (err) {
				utils.log('Failed to addSourceBuffer for ' + type + ', mimeType: ' + mimetype + '.');
				return;
			}
			
			sb.type = type;
			sb.addEventListener('updateend', _onUpdateEnd);
			sb.addEventListener('error', _onSourceBufferError);
		};
		
		_this.appendSegment = function(type) {
			if (_segments[type].length == 0) {
				return;
			}
			
			var sb = _sb[type];
			if (!sb || sb.updating) {
				return;
			}
			
			var seg = _segments[type].shift();
			try {
				sb.appendBuffer(seg);
			} catch (err) {
				utils.log('Failed to appendBuffer: ' + err.toString());
			}
		};
		
		function _onMediaSourceOpen(e) {
			utils.log('media source open');
			
			_loader.load(_url);
		}
		
		function _onUpdateEnd(e) {
			//utils.log('update end');
			
			var type = e.target.type;
			
			if (_endOfStream) {
				if (!_ms || _ms.readyState !== 'open') {
					return;
				}
				
				if (!_segments.audio.length && !_segments.video.length) {
					//_filekeeper.save('sample.flv.mp4');
					_ms.endOfStream();
					return;
				}
			}
			
			_this.appendSegment(type);
		}
		
		function _onSourceBufferError(e) {
			utils.log('source buffer error');
		}
		
		function _onMediaSourceEnded(e) {
			utils.log('media source ended');
		}
		
		function _onMediaSourceClose(e) {
			utils.log('media source close');
		}
		
		function _onMediaSourceError(e) {
			utils.log('media source error');
			_this.dispatchEvent(events.PLAYEASE_RENDER_ERROR, { message: 'MediaSource error ocurred.' });
		}
		
		
		_this.getRenderInfo = function() {
			var buffered;
			var position = _video.currentTime;
			var duration = _video.duration;
			
			var ranges = _video.buffered, start, end;
			for (var i = 0; i < ranges.length; i++) {
				start = ranges.start(i);
				end = ranges.end(i);
				if (/*start <= position && */position < end) {
					buffered = duration ? Math.floor(end / _video.duration * 10000) / 100 : 0;
				}
				
				if (i == 0 && position < start) {
					_video.currentTime = start;
				}
			}
			
			if (_waiting && end - position >= _this.config.bufferTime) {
				_waiting = false;
				_this.dispatchEvent(events.PLAYEASE_STATE, { state: states.PLAYING });
			}
			
			if (_mpd['@type'] == 'static' 
					&& _audioloader && _audioloader.state() == readystates.DONE
					&& _videoloader && _videoloader.state() == readystates.DONE) {
				var dts = end * 1000;
				
				if (_segments.video.length) {
					dts = Math.max(dts, _segments.video[_segments.video.length - 1].info.endDts);
				}
				if (_segments.audio.length) {
					dts = Math.max(dts, _segments.audio[_segments.audio.length - 1].info.endDts);
				}
				
				if (dts && dts / 1000 - position < 120 && _range.end < _contentLength - 1) {
					_range.start = _range.end + 1;
					_range.end += 32 * 1024 * 1024;
					_loader.load(_url, _range.start, _range.end);
				}
			}
			
			return {
				buffered: buffered,
				position: position,
				duration: duration
			};
		};
		
		
		function _onDurationChange(e) {
			var duration = e.target.duration;
			if (_mpd && _mpd.hasOwnProperty('@profiles')) {
				var profiles = _mpd['@profiles'];
				if (profiles.indexOf('urn:mpeg:dash:profile:isoff-live:2011') != -1) {
					duration = 0;
				}
			}
			
			_this.dispatchEvent(events.PLAYEASE_DURATION, { duration: duration });
		}
		
		function _onWaiting(e) {
			_waiting = true;
			_this.dispatchEvent(events.PLAYEASE_STATE, { state: states.BUFFERING });
		}
		
		function _onPlaying(e) {
			_this.dispatchEvent(events.PLAYEASE_STATE, { state: states.PLAYING });
		}
		
		function _onPause(e) {
			if (!_waiting) {
				_this.dispatchEvent(events.PLAYEASE_STATE, { state: states.PAUSED });
			}
		}
		
		function _onEnded(e) {
			_this.dispatchEvent(events.PLAYEASE_STATE, { state: states.STOPPED });
		}
		
		function _onError(e) {
			var message = 'Video error ocurred!';
			_this.dispatchEvent(events.PLAYEASE_RENDER_ERROR, { message: message });
			_this.dispatchEvent(events.PLAYEASE_STATE, { state: states.ERROR, message: message });
		}
		
		
		_this.element = function() {
			return _video;
		};
		
		_this.resize = function(width, height) {
			css.style(_video, {
				width: width + 'px',
				height: height + 'px'
			});
		};
		
		_this.destroy = function() {
			
		};
		
		_init();
	};
	
	renders.dash.isSupported = function(file) {
		var protocol = utils.getProtocol(file);
		if (protocol != 'http' && protocol != 'https') {
			return false;
		}
		
		if (utils.isMSIE('(8|9|10)') || utils.isIETrident() || utils.isIOS()) {
			return false;
		}
		
		var extension = utils.getExtension(file);
		if (extension != 'mpd') {
			return false;
		}
		
		return true;
	};
})(playease);

(function(playease) {
	var utils = playease.utils,
		css = utils.css,
		events = playease.events,
		core = playease.core,
		states = core.states,
		renders = core.renders,
		rendertypes = renders.types;
	
	renders.flash = function(layer, config) {
		var _this = utils.extend(this, new events.eventdispatcher('renders.flash')),
			_defaults = {
				debug: playease.debug
			},
			_video,
			_url,
			_duration;
		
		function _init() {
			_this.name = rendertypes.FLASH;
			
			_this.config = utils.extend({}, _defaults, config);
			
			_url = '';
			_duration = 0;
			
			if (utils.isMSIE(8)) {
				var div = utils.createElement('div');
				div.innerHTML = ''
					+ '<object id="pe-swf" name="pe-swf" align="middle" classid="clsid:D27CDB6E-AE6D-11cf-96B8-444553540000">'
						+ '<param name="movie" value="' + _this.config.swf + '">'
						+ '<param name="quality" value="high">'
						+ '<param name="bgcolor" value="#ffffff">'
						+ '<param name="allowscriptaccess" value="sameDomain">'
						+ '<param name="allowfullscreen" value="true">'
						+ '<param name="wmode" value="transparent">'
						+ '<param name="FlashVars" value="id=' + _this.config.id + '">'
					+ '</object>';
				
				_video = div.firstChild;
				
				return;
			}
			
			_video = utils.createElement('object');
			_video.id = _video.name = 'pe-swf';
			_video.align = 'middle';
			_video.innerHTML = ''
				+ '<param name="quality" value="high">'
				+ '<param name="bgcolor" value="#ffffff">'
				+ '<param name="allowscriptaccess" value="sameDomain">'
				+ '<param name="allowfullscreen" value="true">'
				+ '<param name="wmode" value="transparent">'
				+ '<param name="FlashVars" value="id=' + _this.config.id + '">';
			
			if (utils.isMSIE()) {
				_video.classid = 'clsid:D27CDB6E-AE6D-11cf-96B8-444553540000';
				_video.movie = _this.config.swf;
			} else {
				_video.type = 'application/x-shockwave-flash';
				_video.data = _this.config.swf;
			}
		}
		
		_this.setup = function() {
			if (_video.setup) {
				_video.setup(_this.config);
				_video.resize(_video.clientWidth, _video.clientHeight);
				_this.dispatchEvent(events.PLAYEASE_READY, { id: _this.config.id });
			}
		};
		
		_this.play = function(url) {
			if (url && url != _url) {
				if (!renders.flash.isSupported(url)) {
					_this.dispatchEvent(events.PLAYEASE_RENDER_ERROR, { message: 'Resource not supported by render "' + _this.name + '".' });
					return;
				}
				
				_url = url;
			}
			
			_video.xplay(_url);
		};
		
		_this.pause = function() {
			_video.pause();
		};
		
		_this.reload = function() {
			_video.reload();
		};
		
		_this.seek = function(offset) {
			_video.seek(offset);
		};
		
		_this.stop = function() {
			_video.istop();
			_duration = 0;
		};
		
		_this.mute = function(muted) {
			_video.muted(muted);
		};
		
		_this.volume = function(vol) {
			_video.volume(vol);
		};
		
		_this.hd = function(index) {
			
		};
		
		
		_this.getRenderInfo = function() {
			var info = _video.getRenderInfo();
			
			if (_duration !== info.duration) {
				_this.dispatchEvent(events.PLAYEASE_DURATION, { duration: info.duration });
			}
			
			return info;
		};
		
		_this.element = function() {
			return _video;
		};
		
		_this.resize = function(width, height) {
			if (!_video) {
				return;
			}
			
			css.style(_video, {
				width: width + 'px',
				height: height + 'px'
			});
			
			if (_video.resize) {
				_video.resize(width, height);
			}
		};
		
		_this.destroy = function() {
			
		};
		
		_init();
	};
	
	renders.flash.isSupported = function(file) {
		var protocol = utils.getProtocol(file);
		if (protocol != 'http' && protocol != 'https' && protocol != 'rtmp' && protocol != 'rtmpe') {
			return false;
		}
		
		if (utils.isMobile()) {
			return false;
		}
		
		var map = [
			undefined, '', // live stream
			'flv',
			'mp4', 'f4v', 'm4v', 'mov',
			'm4a', 'f4a', 'aac',
			'mp3'
		];
		var extension = utils.getExtension(file);
		for (var i = 0; i < map.length; i++) {
			if (extension === map[i]) {
				return true;
			}
		}
		
		return false;
	};
})(playease);

(function(playease) {
	var skins = playease.core.skins = {};
	
	skins.types = {
		DEFAULT: 'def'
	};
})(playease);

(function(playease) {
	var utils = playease.utils,
		events = playease.events,
		core = playease.core,
		states = core.states,
		rendermodes = core.renders.modes,
		skins = core.skins,
		skintypes = skins.types,
		css = utils.css,
		
		WRAP_CLASS = 'pe-wrapper',
		SKIN_CLASS = 'pe-skin',
		RENDER_CLASS = 'pe-render',
		CONTROLS_CLASS = 'pe-controls',
		CONTEXTMENU_CLASS = 'pe-contextmenu',
		
		POSTER_CLASS = 'pe-poster',
		DISPLAY_CLASS = 'pe-display',
		DISPLAY_ICON_CLASS = 'pe-display-icon',
		DISPLAY_LABEL_CLASS = 'pe-display-label',
		LOGO_CLASS = 'pe-logo',
		OVERLAY_CLASS = 'pe-overlay',
		
		LEFT_CLASS = 'pe-left',
		CENTER_CLASS = 'pe-center',
		RIGHT_CLASS = 'pe-right',
		
		DEVIDER_CLASS = 'pe-devider',
		LABEL_CLASS = 'pe-label',
		BUTTON_CLASS = 'pe-button',
		SLIDER_CLASS = 'pe-slider',
		RAIL_CLASS = 'pe-rail',
		THUMB_CLASS = 'pe-thumb',
		
		TOOLTIP_CLASS = 'pe-tooltip',
		TOOLTIP_ITEM_CLASS = 'pe-tooltip-item',
		
		FEATURED_CLASS = 'pe-featured',
		
		// For all api instances
		CSS_SMOOTH_EASE = 'opacity .25s ease',
		CSS_100PCT = '100%',
		CSS_ABSOLUTE = 'absolute',
		CSS_RELATIVE = 'relative',
		CSS_NORMAL = 'normal',
		CSS_IMPORTANT = ' !important',
		CSS_VISIBLE = 'visible',
		CSS_HIDDEN = 'hidden',
		CSS_NONE = 'none',
		CSS_BOLD = 'bold',
		CSS_CENTER = 'center',
		CSS_BLOCK = 'block',
		CSS_INLINE_BLOCK = 'inline-block',
		CSS_DEFAULT = 'default',
		CSS_POINTER = 'pointer',
		CSS_NO_REPEAT = 'no-repeat',
		CSS_NOWRAP = 'nowrap';
	
	skins.def = function(config) {
		var _this = utils.extend(this, new events.eventdispatcher('skins.def')),
			_width = config.width,
			_height = config.height;
		
		function _init() {
			_this.name = skintypes.DEFAULT;
			
			SKIN_CLASS += '-' + _this.name;
			
			css('.' + WRAP_CLASS, {
				width: CSS_100PCT,
				height: CSS_100PCT,
				position: CSS_RELATIVE,
				'box-shadow': '0 1px 1px rgba(0, 0, 0, 0.05)'
			});
			css('.' + WRAP_CLASS + ' *', {
				margin: '0',
				padding: '0',
				'font-family': 'Microsoft YaHei,arial,sans-serif',
				'font-size': '12px',
				'font-weight': CSS_NORMAL,
				'box-sizing': 'content-box'
			});
			
			css('.' + SKIN_CLASS + ' .' + DEVIDER_CLASS, {
				padding: '0 2px',
				'line-height': '40px',
				color: '#FFFFFF',
				cursor: CSS_DEFAULT
			});
			
			css('.' + SKIN_CLASS + ' .' + LABEL_CLASS, {
				'line-height': '40px',
				color: '#FFFFFF',
				cursor: CSS_DEFAULT
			});
			
			css('.' + SKIN_CLASS + ' .' + BUTTON_CLASS, {
				'text-align': CSS_CENTER,
				'background-repeat': CSS_NO_REPEAT,
				'background-position': CSS_CENTER,
				cursor: CSS_POINTER
			});
			css('.' + SKIN_CLASS + ' .' + BUTTON_CLASS + ' > span', {
				padding: '3px 12px',
				color: '#FFFFFF',
				'line-height': '40px',
				'border-radius': '2px',
				background: '#454545'
			});
			css('.' + SKIN_CLASS + ' .' + BUTTON_CLASS + ':hover > span', {
				color: '#00A0E9'
			});
			
			css('.' + SKIN_CLASS + ' .' + SLIDER_CLASS, {
				cursor: CSS_POINTER
			});
			
			css('.' + SKIN_CLASS + ' .' + TOOLTIP_CLASS, {
				'line-height': '12px',
				color: '#FFFFFF',
				background: '#454545',
				cursor: CSS_DEFAULT,
				display: CSS_INLINE_BLOCK,
				visibility: CSS_HIDDEN
			});
			css('.' + SKIN_CLASS + ' .' + TOOLTIP_ITEM_CLASS, {
				'margin': '4px 0',
				padding: '8px 12px',
				'text-align': CSS_CENTER,
				'white-space': CSS_NOWRAP,
				cursor: CSS_POINTER
			});
			css('.' + SKIN_CLASS + ' .' + TOOLTIP_ITEM_CLASS + ':hover'
				+ ', .' + SKIN_CLASS + ' .' + TOOLTIP_ITEM_CLASS + '.active', {
				background: '#00A0E9'
			});
			
			css('.' + SKIN_CLASS + ' .' + RENDER_CLASS, {
				width: CSS_100PCT,
				height: 'calc(100% - 40px)',
				'font-size': '0',
				'line-height': '0',
				position: CSS_RELATIVE,
				background: '#000000'
			});
			css('.' + SKIN_CLASS + '.fs .' + RENDER_CLASS, {
				height: CSS_100PCT
			});
			css('.' + SKIN_CLASS + ' .' + RENDER_CLASS + ' canvas', {
				position: CSS_ABSOLUTE
			});
			css('.' + SKIN_CLASS + ' .' + RENDER_CLASS + ' video'
				+ ', .' + SKIN_CLASS + ' .' + RENDER_CLASS + ' object', {
				width: CSS_100PCT,
				height: CSS_100PCT
			});
			css('.' + SKIN_CLASS + ' .' + RENDER_CLASS + ' video::-webkit-media-controls-start-playback-button', {
				display: CSS_NONE
			});
			
			css('.' + SKIN_CLASS + ' .' + RENDER_CLASS + ' .' + POSTER_CLASS, {
				width: CSS_100PCT,
				height: CSS_100PCT,
				position: CSS_ABSOLUTE,
				background: '#000000'
			});
			css('.' + SKIN_CLASS + ' .' + RENDER_CLASS + ' .' + POSTER_CLASS + ' img', {
				width: CSS_100PCT,
				height: CSS_100PCT,
				position: CSS_ABSOLUTE
			});
			css('.' + SKIN_CLASS + '.' + states.BUFFERING + ' .' + RENDER_CLASS + ' .' + POSTER_CLASS
				+ ', .' + SKIN_CLASS + '.' + states.PLAYING + ' .' + RENDER_CLASS + ' .' + POSTER_CLASS
				+ ', .' + SKIN_CLASS + '.' + states.PAUSED + ' .' + RENDER_CLASS + ' .' + POSTER_CLASS
				+ ', .' + SKIN_CLASS + '.' + states.ERROR + ' .' + RENDER_CLASS + ' .' + POSTER_CLASS, {
				display: CSS_NONE
			});
			
			css('.' + SKIN_CLASS + ' .' + RENDER_CLASS + ' .' + DISPLAY_CLASS, {
				width: CSS_100PCT,
				height: '10%',
				'min-height': '32px',
				'text-align': CSS_CENTER,
				top: '45%',
				position: CSS_ABSOLUTE,
				overflow: CSS_HIDDEN,
				display: CSS_NONE
			});
			css('.' + SKIN_CLASS + '.' + states.BUFFERING + ' .' + RENDER_CLASS + ' .' + DISPLAY_CLASS
				+ ', .' + SKIN_CLASS + '.' + states.PAUSED + ' .' + RENDER_CLASS + ' .' + DISPLAY_CLASS
				+ ', .' + SKIN_CLASS + '.' + states.STOPPED + ' .' + RENDER_CLASS + ' .' + DISPLAY_CLASS
				+ ', .' + SKIN_CLASS + '.' + states.ERROR + ' .' + RENDER_CLASS + ' .' + DISPLAY_CLASS, {
				display: CSS_INLINE_BLOCK
			});
			css('.' + SKIN_CLASS + ' .' + RENDER_CLASS + ' .' + DISPLAY_CLASS + ' > div', {
				display: CSS_INLINE_BLOCK
			});
			css('.' + SKIN_CLASS + ' .' + RENDER_CLASS + ' .' + DISPLAY_CLASS + ' .' + DISPLAY_ICON_CLASS, {
				'float': 'left',
				margin: '0 auto',
				width: '32px',
				height: '32px',
				'background-repeat': CSS_NO_REPEAT,
				'background-position': CSS_CENTER
			});
			
			css('.' + SKIN_CLASS + ' .' + RENDER_CLASS + ' .' + DISPLAY_CLASS + ' .' + DISPLAY_ICON_CLASS + ' .' + DISPLAY_ICON_CLASS, {
				'background-image': CSS_NONE
			});
			css('.' + SKIN_CLASS + '.' + states.BUFFERING + ' .' + RENDER_CLASS + ' .' + DISPLAY_CLASS + ' .' + DISPLAY_ICON_CLASS, {
				'background-image': 'url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAACaElEQVRYR8WXQW4aMRSG3wMjjVeBDZKfF0lPUHIC0hM03CCcoM0JmhuUnKDkBElPkPQEJSfobMYjsYGuQGKQq2d50HQy0GnAZCQ2g/H7nu3/9w/CGz+4q/50Ou21Wq240+nMQ3FWAnDhLMvuAeCMC1trx1rrYQiISoAkSSaI+L5U8JqIRoeGqAQwxtiKQj+I6OItAe6I6OooAEmS3CDil0Kx34jYU0rFRwHgIsaYSwC4tNbGjUZjHKI419kpw0N3WzWfAyjJLhZCDLrd7uRoAMYY3tvTvKC1dq617hwFwHf/s1wMET8opZ5CQ7gtqNK9lLIT0oLzxhxAmqZX1tpvm5eIQ6XUOHT3f6kgTVP2ff7EoSS3VQXH6LRYYzabtReLxb2UcrDxAb8NHwHgiYhuQ0Ox22qtbxxAhfU+ENEgNMTmDJR9gL8gomAuyTYvhIjZ7HIZst77xcuHiNqhVsDL3l3vRStmiBO3LIFlmKYp5wqnts0y88lcLpe9kDL0NdpFmW+LZJwHeEvmUsrhoRzRGMPh9gQR3+UQLwDKrggA34mIs8Hej8+aZ8Vw8wKgKg3tcyC9w/aVUne1nJAPiLX2sTDYZUE/0WkURc//syX5sgNAZarelopdHAOACUdxvrJXq9UjIrI0Yynl+TYIf8L7URTd8phXAZSXyhjD/wc+lW/LwvsREV3zKllrf/lx7uzkl9y2bFHL7YwxnwHgaw4ghDhfr9ft4lZxgGk2m/Msy1y4sdY+a61Z1jufWgA+tPAq8IR8T4xK3QJDsbV6FV0IIUZ1cmVtgKo28ujuoR7+1W0tFbxmkn1+8wdECS8NBZyNpgAAAABJRU5ErkJggg==)'
			});
			css('.' + SKIN_CLASS + ' .' + RENDER_CLASS + ' .' + DISPLAY_CLASS + ' .' + DISPLAY_LABEL_CLASS, {
				'font-size': '14px',
				'font-weight': CSS_BOLD,
				'line-height': '32px',
				color: '#FFFFFF',
				'text-align': CSS_CENTER
			});
			
			css('.' + SKIN_CLASS + ' .' + RENDER_CLASS + ' .' + LOGO_CLASS, {
				width: CSS_100PCT,
				height: CSS_100PCT,
				top: '0',
				position: CSS_ABSOLUTE,
				'z-index': '1'
			});
			css('.' + SKIN_CLASS + ' .' + RENDER_CLASS + ' .' + LOGO_CLASS + ' > div', {
				'max-width':'120px',
				position: CSS_ABSOLUTE,
				right:'0',
				top:'0',
				margin:'3% 5%'
			});
			css('.' + SKIN_CLASS + ' .' + RENDER_CLASS + ' .' + LOGO_CLASS + ' > div a img', {
				width: '100%',
				height: 'auto',
			});
			
			css('.' + SKIN_CLASS + ' .' + CONTROLS_CLASS, {
				width: CSS_100PCT,
				height: '40px',
				background: '#171717',
				position: CSS_RELATIVE,
				'z-index': '3'
			});
			css('.' + SKIN_CLASS + '.fs .' + CONTROLS_CLASS, {
				top: '-40px'
			});
			
			css('.' + SKIN_CLASS + ' .' + CONTROLS_CLASS + ' .' + SLIDER_CLASS + '.time', {
				width: CSS_100PCT,
				height: '2px',
				top: '-2px',
				position: CSS_ABSOLUTE,
				display: CSS_NONE
			});
			css('.' + SKIN_CLASS + ' .' + CONTROLS_CLASS + ':hover .' + SLIDER_CLASS + '.time', {
				height: '10px',
				top: '-10px'
			});
			css('.' + SKIN_CLASS + ' .' + CONTROLS_CLASS + ' .' + SLIDER_CLASS + '.time .' + RAIL_CLASS, {
				width: '0',
				height: CSS_100PCT,
				top: '0',
				position: CSS_ABSOLUTE
			});
			css('.' + SKIN_CLASS + ' .' + CONTROLS_CLASS + ' .' + SLIDER_CLASS + '.time .' + RAIL_CLASS + '.bg', {
				width: CSS_100PCT,
				background: '#CCCCCC',
				filter: 'alpha(opacity=70)',
				opacity: '0.7'
			});
			css('.' + SKIN_CLASS + ' .' + CONTROLS_CLASS + ' .' + SLIDER_CLASS + '.time .' + RAIL_CLASS + '.buf', {
				background: '#707070'
			});
			css('.' + SKIN_CLASS + ' .' + CONTROLS_CLASS + ' .' + SLIDER_CLASS + '.time .' + RAIL_CLASS + '.pro', {
				background: '#00A0E9'
			});
			
			css('.' + SKIN_CLASS + ' .' + CONTROLS_CLASS + ' .' + LEFT_CLASS
				+ ', .' + SKIN_CLASS + ' .' + CONTROLS_CLASS + ' .' + CENTER_CLASS
				+ ', .' + SKIN_CLASS + ' .' + CONTROLS_CLASS + ' .' + RIGHT_CLASS
				+ ', .' + SKIN_CLASS + ' .' + CONTROLS_CLASS + ' .' + LEFT_CLASS + ' > *'
				+ ', .' + SKIN_CLASS + ' .' + CONTROLS_CLASS + ' .' + CENTER_CLASS + ' > *'
				+ ', .' + SKIN_CLASS + ' .' + CONTROLS_CLASS + ' .' + RIGHT_CLASS + ' > *', {
				'float': 'left'
			});
			css('.' + SKIN_CLASS + ' .' + CONTROLS_CLASS + ' .' + RIGHT_CLASS, {
				right: '0',
				position: CSS_ABSOLUTE
			});
			
			css('.' + SKIN_CLASS + ' .' + CONTROLS_CLASS + ' .' + BUTTON_CLASS + '.play', {
				'margin-left': '8px',
				width: '26px',
				height: '40px',
				'background-image': 'url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABYAAAAWCAYAAADEtGw7AAAA7UlEQVRIS73Vuw2DMBAG4LvChelokA6qbJARMgqMkA1gA7JBRmCDZIMkGyQFQqJKeqSLjCBFeORsRFxbn3+fzmeElRau5MJ/4bIsU6VUEQTB1fVGg8RVVe2Y+WRAREyJKHPBZ+EOvCNiQkRnmwMkcO/lWuvM9/2n5AAb2Hji9LawOL0r3KYHgH0YhsVYaZbArcfMxyiKkm98Mdy15YaIzA0+ayn8AoB4rBxL4IPWOp1qPxf4gYjxrwdjC8+mdKmxKKUVzMyZ53m59Cn3+KAUdV1vm6a5MPNNKRW7js7RQW9wV3AysWRySfas9jW9AbDjlhedpANmAAAAAElFTkSuQmCC)'
			});
			css('.' + SKIN_CLASS + ' .' + CONTROLS_CLASS + ' .' + BUTTON_CLASS + '.play:hover', {
				'background-image': 'url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABYAAAAWCAYAAADEtGw7AAAA2klEQVRIS73U0RHBQBDG8f9OBs8eyLMOlKATuRJ0kHRABVGCDugAHfCIFxqwRgxjCLm7OFvA777b2V0hUEkglz/D+S4FmWG6K98fvSfODwPkPC9AIWUYZz74d7gQdYNGBtNZuDxgAd85GaONDNM+2jzgALuld4Tt03vC9/QywsSzstbUgB/clCQ2r/gvYNBmD9PePOP1YOUEJGXt8IdVJ9BKP42fO6y6hSipWhg3uCKle48tU7rBSgbNse0qP1bobbjzfR/RJcoaJPE9neWH/orXuMW3ixuogsEXAwpyFxd7ZW8AAAAASUVORK5CYII=)'
			});
			
			css('.' + SKIN_CLASS + ' .' + CONTROLS_CLASS + ' .' + BUTTON_CLASS + '.pause', {
				'margin-left': '8px',
				width: '26px',
				height: '40px',
				'background-image': 'url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABYAAAAWCAYAAADEtGw7AAAASElEQVRIS2NkoBFgpJG5DMPE4GfPnv1HDiIpKSkUnxGSB+nFGhSENBKSHzUYJeWOhjE8OEaDYjQoUAspnGUFNQr/YVLQUyMoAN6NcBeNBoG9AAAAAElFTkSuQmCC)',
				display: CSS_NONE
			});
			css('.' + SKIN_CLASS + ' .' + CONTROLS_CLASS + ' .' + BUTTON_CLASS + '.pause:hover', {
				'background-image': 'url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABYAAAAWCAYAAADEtGw7AAAAS0lEQVRIS2NkoBFgpJG5DMPF4AUv/6MEUYI4qs8IyTMw4AgKQhoJyY8ajBwv2JMboTAkJD8axqNhzMCAnuWHUaqgQuk/XAp6KgQFAKp5VBfJ2vW8AAAAAElFTkSuQmCC)'
			});
			
			css('.' + SKIN_CLASS + ' .' + CONTROLS_CLASS + ' .' + BUTTON_CLASS + '.reload', {
				'margin-left': '4px',
				width: '26px',
				height: '40px',
				'background-image': 'url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABcAAAASCAYAAACw50UTAAABo0lEQVQ4T61UzU0CURD+hnDg7UW4kOxwUDugA7ECpQKhAqQCsQKwArECoQKxAzoQDrxNuIAXOEAyZshiHsvuskQn2du8b+f7mSGcUdbaRwATZh5keUZZmrRnPp9XN5tNi4gaAAbGmGapVFqmvU8FV8DtdvskIjUiKrpAIrLM5XJt3/f7ST9IBLfW9gC0UiYbGmMaadPHgltrdZqHEHiYz+c75XJ5PJvNOkSkujey6H4EHprWVWAiarq0gyCoFQqF8Smt92wPwBeLRXG1Wn2pviLyXKlUOlkNj+s7AA+CoCEirwCmzHz1F+AdcxfA0fqFmVXbzKXJUl/cB1HwEYCbcyVRL0TkA8AbM+se7OpfwMMUPQH4ZOZaEvg+2wcTnNJmL2eUcXTyewDvun2e511niZybMAB1N/9xOZ8AuNT7wcz1DFPrEbuLS9gRuGMORKTveV47jkE4cTc8ZLpwt77vayB+K3b9nbxrozLpEZHGTPtFRKoANKq7XYhucqyhkcyr/mqwSpRUU/1J0p1JPblKfb1ea241XvpdAPgGoPRHxph+muk/W8LNEwZCyJwAAAAASUVORK5CYII=)'
			});
			css('.' + SKIN_CLASS + ' .' + CONTROLS_CLASS + ' .' + BUTTON_CLASS + '.reload:hover', {
				'background-image': 'url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABcAAAASCAYAAACw50UTAAABjElEQVQ4T62UwVECQRBFX4uFR/Egy03NgAzECIQI3IlAiACMQIxgMAIxAjEDMhBvLB7Ao1ZhW7O7VME6wELZ191+0/P/7xF2KTtugowwQT9Pm+T5Kf7HTqqI3gIh0EeLBnMy29S/GZ4A20ANKGVAM1RamHJv3QHr4XbcRcRN6i/lGYrhpun9cBv1EG5iagyRDqY8xEYdoBlLk0P3v3Bnmsh9Ahazcm37UYPD4TatF1ddhdtpCfl+i/VV7jCBm3TvysAnIaIW1XdM5XxvatqYgadaqz5gKk7b/OWS5XxZqgx8PEDkcmdJnBfy84LyiAncHsT1T/Cog9BG9RVTcTvhhSfZzkywVZtFdDMhyGpeR3gCZmjxIlfkVhPWWM6/L+cjRM7i9yMMGjmm7iNc+xLmgafmJNQeWmx5b5BM7JYtMVAPrjCng/VpWXyxad6TrhFCFykMmSMUUHReRd0zIMkuZDfZa+jysTaqgzqDnUT+csuGNNe9M1ue3GkJvkIQF68awjHKJzAAHcBRb5Ppv4ilpRPPrZusAAAAAElFTkSuQmCC)'
			});
			
			css('.' + SKIN_CLASS + ' .' + CONTROLS_CLASS + ' .' + BUTTON_CLASS + '.stop', {
				'margin-left': '4px',
				width: '26px',
				height: '40px',
				'background-image': 'url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABIAAAASCAYAAABWzo5XAAAAfUlEQVQ4T2NkoBJgpJI5DCgGvXr1yuDv37/8xBjOzMz8UUxM7AJMLdwgkCF//vw5T4whMDUsLCyGMMPgBj1//tzh////+0kxiJGR0VFSUvIASM+oQdhDbjSMCKco2oYROVkEq4tAHoFmWgHCnoKogGUPlCxCrGZc6qhWHgEATUBvE9w5bHsAAAAASUVORK5CYII=)',
				display: CSS_NONE
			});
			css('.' + SKIN_CLASS + ' .' + CONTROLS_CLASS + ' .' + BUTTON_CLASS + '.stop:hover', {
				'background-image': 'url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABIAAAASCAYAAABWzo5XAAAAd0lEQVQ4T2NkoBJgpJI5DKgGzX9lwMDMyE+U4X//f2RIFLsAU4swCGQI4//zRBkCU/Sf0RBmGJJBrx0YGP/tJ80gJkeGRNEDID2jBuEIuf+jYUQwTdE4jMjJIthiDeQPUH5jYBQg6CWYAmj2QM0iROvGrpBq5REAFKdRE3q6U4sAAAAASUVORK5CYII=)'
			});
			
			css('.' + SKIN_CLASS + ' .' + CONTROLS_CLASS + ' .' + LABEL_CLASS + '.alt'
				+ ', .' + SKIN_CLASS + ' .' + CONTROLS_CLASS + ' .' + LABEL_CLASS + '.elapsed', {
				'margin-left': '8px'
			});
			
			css('.' + SKIN_CLASS + '.' + states.BUFFERING + ' .' + CONTROLS_CLASS + ' .' + BUTTON_CLASS + '.play'
				+ ', .' + SKIN_CLASS + '.' + states.PLAYING + ' .' + CONTROLS_CLASS + ' .' + BUTTON_CLASS + '.play'
				+ ', .' + SKIN_CLASS + '.' + rendermodes.VOD + ' .' + CONTROLS_CLASS + ' .' + BUTTON_CLASS + '.reload'
				+ ', .' + SKIN_CLASS + '.' + rendermodes.VOD + ' .' + CONTROLS_CLASS + ' .' + LABEL_CLASS + '.alt'
				+ ', .' + SKIN_CLASS + ' .' + CONTROLS_CLASS + ' .' + LABEL_CLASS + '.elapsed'
				+ ', .' + SKIN_CLASS + ' .' + CONTROLS_CLASS + ' .' + DEVIDER_CLASS
				+ ', .' + SKIN_CLASS + ' .' + CONTROLS_CLASS + ' .' + LABEL_CLASS + '.duration', {
				display: CSS_NONE
			});
			css('.' + SKIN_CLASS + '.' + states.BUFFERING + ' .' + CONTROLS_CLASS + ' .' + BUTTON_CLASS + '.pause'
				+ ', .' + SKIN_CLASS + '.' + states.PLAYING + ' .' + CONTROLS_CLASS + ' .' + BUTTON_CLASS + '.pause'
				+ ', .' + SKIN_CLASS + '.' + rendermodes.VOD + ' .' + CONTROLS_CLASS + ' .' + SLIDER_CLASS + '.time'
				+ ', .' + SKIN_CLASS + '.' + rendermodes.VOD + ' .' + CONTROLS_CLASS + ' .' + BUTTON_CLASS + '.stop'
				+ ', .' + SKIN_CLASS + '.' + rendermodes.VOD + ' .' + CONTROLS_CLASS + ' .' + LABEL_CLASS + '.elapsed'
				+ ', .' + SKIN_CLASS + '.' + rendermodes.VOD + ' .' + CONTROLS_CLASS + ' .' + DEVIDER_CLASS
				+ ', .' + SKIN_CLASS + '.' + rendermodes.VOD + ' .' + CONTROLS_CLASS + ' .' + LABEL_CLASS + '.duration', {
				display: CSS_BLOCK
			});
			
			css('.' + SKIN_CLASS + ' .' + CONTROLS_CLASS + ' .' + BUTTON_CLASS + '.report', {
				'margin-right': '8px',
				width: '20px',
				height: '40px',
				'background-image': 'url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAYAAACNiR0NAAAB+klEQVQ4T52UzZHaQBCFuwd04QQXqjQcTAaWI7A2g3UEVgZLCDgDHIFxBusIFiIwG4HZg0ZVXOAGVULdrreloSQtyPLOaX6/6dczr5kqzTk3s9Yu9vv98Hg8JujvdruoKIphGIarLMsSIlqFYbitnqv2GYdPp9NHTIrIwhgzU9VIVRP0RQQQMsYssc7MS2beENHLNTA757aqemDmAxF9JqJ1eWNERDg4LceIChdty70RM0dNKIDKzHeQlKbpfDKZzAHw8iH5fD5PrbWPVcnVczXJtxZu5cjP41y/3/+EcVEUBx9pLcJ/Qarr5WMhBT+QsiAI7sbj8aYGdM7dE9GsBbyAdKxnWRYjvwBi7KHvihC5VNW5qj4ZY9YeSkTfa8Asy/CiH1oifCGiWFWHqvoVr6yqS0BFZDYYDOImMBYRSLnamBkXbjzMb1LVb/53dJZcyrxEVoE9I7LRaIR/TJ0kwznYeyWyGuwNEF8hz3O89KUxcwy7icgDcnYrMj/fKhnOMcZsmzDYk5nnvV7vgL/XySl4cVX9c+V1flprE+cc/H8Py3YCwsuoKmWFea1GRPQKK71+qQGdgGmaboIgSOBTEfnNzL887L+BXq6qPjPzipkfm9Jaqw0RffEexe0ounmeT5sJ99LKir73Za8peUFEDy12u7W0tta+cdVfayyTMVHcLB4AAAAASUVORK5CYII=)'
			});
			css('.' + SKIN_CLASS + ' .' + CONTROLS_CLASS + ' .' + BUTTON_CLASS + '.report:hover', {
				'background-image': 'url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAYAAACNiR0NAAAB3ElEQVQ4T52UwXnTQBCF/5FIzs6BODfUAaIClA5MBXgrwCWYDkwFEh2ECnAqQKkAc7PDwbriJBq+HUVCkq0kZk6r3Z2n92bnjdCOdD3DXSxItyP4M63WtzHICPd6SXo7hZMl7mzVyWt9iCWH929trywXBMEMfYhRmdq6LKd2FgSZnYtmSJjz8OrXIWAhXa9ACtACkfeoXlc/lBg0B6JHAv5eDKzsrq1P4z6okG0UDS4rSZs5bjw3gEa+l6wRbnzVkdzO60geOBiqUbNvefKu+j4paqZdhs+itC7YYxEjmgIFKpe487wveQI6G8aVhUm3kvxOrBQVoA8D/T+G1j7lHJHvqFw3oKpfegy3EeH9m0GGvlW4S6AcIfLRJENmoKbsNOkBehll8kQpI2ulf2DVVeVz3R0vl1zJbDOrwW48M9xZYd3b7cMByd45JXKAWQfsAKA18aQrWRMIMkQ/PdbsILM652nJ3jnIah/M2zOcmwXdubdnE8OA6TZCdj/3Hkj5ihtPSTcFBBOz7MsA1zMIc/AThmoa1WB+fbSX000O4udfgex+oHwzZnUcBVjLVW5AlxBe9aU9w5APjUfNp35i30X9gjfs/Lnsts3Y69QwXS8Q8S1xXPhB7C72XPUXUpIzkgX2T8IAAAAASUVORK5CYII=)'
			});
			
			css('.' + SKIN_CLASS + ' .' + CONTROLS_CLASS + ' .' + BUTTON_CLASS + '.volume', {
				'margin-right': '4px',
				width: '25px',
				height: '40px',
				'background-image': 'url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAYAAACNiR0NAAABRUlEQVQ4T8WUwW2DQBBFZyQ4cApckNg9xK4guAKTCtJC0kE6iFNJUoI7SNyBU0HsA7NHcoMTE40F1oI3GBlL4bis3vz5f3YQrvzhEM8Y81jX9UxrvRpb90+gwJj5DQA2SqlsEtCCCecEaIyZyY8kSXb9QicKezAnkIg+mfnO9/37OI63NrQDdMCOQCJ6RsS1qMrzfIWIL8y81VovOkAiWgPATXPo8mqDiOLnNwDsgiBYRFH0IyoBYImIT0mSvLdQJCI+Y/jBw6bwAzO/SurGmIyZP/oqRwOLogjLsixEpVJqLiKISEK5VUodrRsNdAGstudt4v8HtFreK6UOczip5YFQvrTWqZ2yjE3YHCwdidtjsw+CIB0cGxtwwWB31Anr4qcHAKnnedng02vVnlsOElBVVeGo5eCATl9fNvRqC3bsQu3f+wXvgQ4kgi83UAAAAABJRU5ErkJggg==)'
			});
			css('.' + SKIN_CLASS + ' .' + CONTROLS_CLASS + ' .' + BUTTON_CLASS + '.volume:hover', {
				'background-image': 'url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAYAAACNiR0NAAABOUlEQVQ4T8WUsVHDQBBF/yYoRE4sZdgVIFdguwJauOuADjCVrEtwB0AHpgLkTIJAxA5Y5k7InE+WOI81g0LNzdu/u38/YeCPenn8rgCZQCer0LrdQAMjYYi8QKeLy4ANzFBOAbma2AJ6lPuF2gpdWCeweAbRLYSW0OOtCz0G+jAXyMU9EG2sKi5XIDwA2EIls2MglxuQXNc/qT0r0zIiBdq/AZJDohn06BNsVc4hpKHH6wZKWJfSO/BmhrYw7iB4tFvnjwXo68lXeQawikH7yqpU6dSK4CIH0Q1UchhdOPAU4ND21bTZ+D8C+adlkR10Wvvwopa7liJ4hU6y3y2bh5C4dg3NWxt3bWPUIcr6beMSzjW2p85qaikKPT1QZg+h9/Qa+t/hYEYUh4WDDx0kvlzoYAEbmqjeu2/Qu+AVc0ee5wAAAABJRU5ErkJggg==)'
			});
			css('.' + SKIN_CLASS + ' .' + CONTROLS_CLASS + ' .' + BUTTON_CLASS + '.volume.mute', {
				'background-image': 'url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAYAAACNiR0NAAABFElEQVQ4T62UwY3CMBBFv6XJGU45OBc6gA6ATigBOqCD3Q5oYTtY6ACamEg5wTlWjMaykWVlWax4zvbz/D/fo1C41Dte27a7YRgWTdMcP333T6DArLUnABet9WYSMIIJZxowgU0DjsDygcz8A2DmPRrz6iWZmb8BLInoUNf1Ve50XbcyxnwBuGmt94qZ7T+Gx8AzgLW19l5V1Vbu9X3/q5SaB6+zgL4bgc4EKkAPexDRRrrOAkYSHdQre8HcAzmSAzCSiSA/eJoFFMkR7OE7dPLF02zJzOyGAsDJFKAxJsh3w5MOJTYyJSk5nFYamxUR7ZPYSJyuLjbx7SLBTtsp+vUCvOhyGIFO2zapp8UW7KcLNT33BBvV1hUPsh0RAAAAAElFTkSuQmCC)'
			});
			css('.' + SKIN_CLASS + ' .' + CONTROLS_CLASS + ' .' + BUTTON_CLASS + '.volume.mute:hover', {
				'background-image': 'url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAYAAACNiR0NAAABCklEQVQ4T62UzVHDMBCFv00D+BRyTAe4A6AT1EHoIB2QDkQJdEDowHSR+JQ0kGX0B7aYeBDWXjX69N7b1QqVSyZ5tn8CXWNut3999zrQwUQtqh+Y1cM8YII5ymzgEDYbmMP+BbTHN0RvQkbyO6uhZXvYIdyhi2fMsvNXbN8ilxeUT8xqI7wedTLwMXCPyD1wQuUxaNB3oElZFwL7FnSP4BydopAG5ezdmWVXBkwWf6AMYV5wkeXvzKLNIDHYj5mWAX0DUmbOppcU7EdoIfAQmpIy88SYaWye4MYGbcJrvoPjyscGWlhsRmPDZQd0YWyGVWWwc0VVv16CV10OOXT2tskzrbZgJz/49cMvxZO5FboZZaEAAAAASUVORK5CYII=)'
			});
			
			css('.' + SKIN_CLASS + ' .' + CONTROLS_CLASS + ' .' + SLIDER_CLASS + '.volume', {
				margin: '15px 8px 0 0',
				width: '60px',
				height: '12px',
				position: CSS_RELATIVE
			});
			css('.' + SKIN_CLASS + ' .' + CONTROLS_CLASS + ' .' + SLIDER_CLASS + '.volume .' + RAIL_CLASS, {
				width: CSS_100PCT,
				height: '4px',
				top: '4px',
				position: CSS_ABSOLUTE
			});
			css('.' + SKIN_CLASS + ' .' + CONTROLS_CLASS + ' .' + SLIDER_CLASS + '.volume .' + RAIL_CLASS + '.buf', {
				background: '#909090'
			});
			css('.' + SKIN_CLASS + ' .' + CONTROLS_CLASS + ' .' + SLIDER_CLASS + '.volume:hover .' + RAIL_CLASS + '.buf', {
				background: '#B0B0B0'
			});
			css('.' + SKIN_CLASS + ' .' + CONTROLS_CLASS + ' .' + SLIDER_CLASS + '.volume .' + RAIL_CLASS + '.pro', {
				width: '80%',
				background: '#E6E6E6'
			});
			css('.' + SKIN_CLASS + ' .' + CONTROLS_CLASS + ' .' + SLIDER_CLASS + '.volume:hover .' + RAIL_CLASS + '.pro', {
				background: '#FFFFFF'
			});
			css('.' + SKIN_CLASS + ' .' + CONTROLS_CLASS + ' .' + SLIDER_CLASS + '.volume .' + THUMB_CLASS, {
				width: '10px',
				height: '12px',
				'background-repeat': CSS_NO_REPEAT,
				'background-position': CSS_CENTER,
				'background-image': 'url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAMCAYAAABbayygAAAACXBIWXMAAAsTAAALEwEAmpwYAAAKTWlDQ1BQaG90b3Nob3AgSUNDIHByb2ZpbGUAAHjanVN3WJP3Fj7f92UPVkLY8LGXbIEAIiOsCMgQWaIQkgBhhBASQMWFiApWFBURnEhVxILVCkidiOKgKLhnQYqIWotVXDjuH9yntX167+3t+9f7vOec5/zOec8PgBESJpHmomoAOVKFPDrYH49PSMTJvYACFUjgBCAQ5svCZwXFAADwA3l4fnSwP/wBr28AAgBw1S4kEsfh/4O6UCZXACCRAOAiEucLAZBSAMguVMgUAMgYALBTs2QKAJQAAGx5fEIiAKoNAOz0ST4FANipk9wXANiiHKkIAI0BAJkoRyQCQLsAYFWBUiwCwMIAoKxAIi4EwK4BgFm2MkcCgL0FAHaOWJAPQGAAgJlCLMwAIDgCAEMeE80DIEwDoDDSv+CpX3CFuEgBAMDLlc2XS9IzFLiV0Bp38vDg4iHiwmyxQmEXKRBmCeQinJebIxNI5wNMzgwAABr50cH+OD+Q5+bk4eZm52zv9MWi/mvwbyI+IfHf/ryMAgQAEE7P79pf5eXWA3DHAbB1v2upWwDaVgBo3/ldM9sJoFoK0Hr5i3k4/EAenqFQyDwdHAoLC+0lYqG9MOOLPv8z4W/gi372/EAe/tt68ABxmkCZrcCjg/1xYW52rlKO58sEQjFu9+cj/seFf/2OKdHiNLFcLBWK8ViJuFAiTcd5uVKRRCHJleIS6X8y8R+W/QmTdw0ArIZPwE62B7XLbMB+7gECiw5Y0nYAQH7zLYwaC5EAEGc0Mnn3AACTv/mPQCsBAM2XpOMAALzoGFyolBdMxggAAESggSqwQQcMwRSswA6cwR28wBcCYQZEQAwkwDwQQgbkgBwKoRiWQRlUwDrYBLWwAxqgEZrhELTBMTgN5+ASXIHrcBcGYBiewhi8hgkEQcgIE2EhOogRYo7YIs4IF5mOBCJhSDSSgKQg6YgUUSLFyHKkAqlCapFdSCPyLXIUOY1cQPqQ28ggMor8irxHMZSBslED1AJ1QLmoHxqKxqBz0XQ0D12AlqJr0Rq0Hj2AtqKn0UvodXQAfYqOY4DRMQ5mjNlhXIyHRWCJWBomxxZj5Vg1Vo81Yx1YN3YVG8CeYe8IJAKLgBPsCF6EEMJsgpCQR1hMWEOoJewjtBK6CFcJg4Qxwicik6hPtCV6EvnEeGI6sZBYRqwm7iEeIZ4lXicOE1+TSCQOyZLkTgohJZAySQtJa0jbSC2kU6Q+0hBpnEwm65Btyd7kCLKArCCXkbeQD5BPkvvJw+S3FDrFiOJMCaIkUqSUEko1ZT/lBKWfMkKZoKpRzame1AiqiDqfWkltoHZQL1OHqRM0dZolzZsWQ8ukLaPV0JppZ2n3aC/pdLoJ3YMeRZfQl9Jr6Afp5+mD9HcMDYYNg8dIYigZaxl7GacYtxkvmUymBdOXmchUMNcyG5lnmA+Yb1VYKvYqfBWRyhKVOpVWlX6V56pUVXNVP9V5qgtUq1UPq15WfaZGVbNQ46kJ1Bar1akdVbupNq7OUndSj1DPUV+jvl/9gvpjDbKGhUaghkijVGO3xhmNIRbGMmXxWELWclYD6yxrmE1iW7L57Ex2Bfsbdi97TFNDc6pmrGaRZp3mcc0BDsax4PA52ZxKziHODc57LQMtPy2x1mqtZq1+rTfaetq+2mLtcu0W7eva73VwnUCdLJ31Om0693UJuja6UbqFutt1z+o+02PreekJ9cr1Dund0Uf1bfSj9Rfq79bv0R83MDQINpAZbDE4Y/DMkGPoa5hpuNHwhOGoEctoupHEaKPRSaMnuCbuh2fjNXgXPmasbxxirDTeZdxrPGFiaTLbpMSkxeS+Kc2Ua5pmutG003TMzMgs3KzYrMnsjjnVnGueYb7ZvNv8jYWlRZzFSos2i8eW2pZ8ywWWTZb3rJhWPlZ5VvVW16xJ1lzrLOtt1ldsUBtXmwybOpvLtqitm63Edptt3xTiFI8p0in1U27aMez87ArsmuwG7Tn2YfYl9m32zx3MHBId1jt0O3xydHXMdmxwvOuk4TTDqcSpw+lXZxtnoXOd8zUXpkuQyxKXdpcXU22niqdun3rLleUa7rrStdP1o5u7m9yt2W3U3cw9xX2r+00umxvJXcM970H08PdY4nHM452nm6fC85DnL152Xlle+70eT7OcJp7WMG3I28Rb4L3Le2A6Pj1l+s7pAz7GPgKfep+Hvqa+It89viN+1n6Zfgf8nvs7+sv9j/i/4XnyFvFOBWABwQHlAb2BGoGzA2sDHwSZBKUHNQWNBbsGLww+FUIMCQ1ZH3KTb8AX8hv5YzPcZyya0RXKCJ0VWhv6MMwmTB7WEY6GzwjfEH5vpvlM6cy2CIjgR2yIuB9pGZkX+X0UKSoyqi7qUbRTdHF09yzWrORZ+2e9jvGPqYy5O9tqtnJ2Z6xqbFJsY+ybuIC4qriBeIf4RfGXEnQTJAntieTE2MQ9ieNzAudsmjOc5JpUlnRjruXcorkX5unOy553PFk1WZB8OIWYEpeyP+WDIEJQLxhP5aduTR0T8oSbhU9FvqKNolGxt7hKPJLmnVaV9jjdO31D+miGT0Z1xjMJT1IreZEZkrkj801WRNberM/ZcdktOZSclJyjUg1plrQr1zC3KLdPZisrkw3keeZtyhuTh8r35CP5c/PbFWyFTNGjtFKuUA4WTC+oK3hbGFt4uEi9SFrUM99m/ur5IwuCFny9kLBQuLCz2Lh4WfHgIr9FuxYji1MXdy4xXVK6ZHhp8NJ9y2jLspb9UOJYUlXyannc8o5Sg9KlpUMrglc0lamUycturvRauWMVYZVkVe9ql9VbVn8qF5VfrHCsqK74sEa45uJXTl/VfPV5bdra3kq3yu3rSOuk626s91m/r0q9akHV0IbwDa0b8Y3lG19tSt50oXpq9Y7NtM3KzQM1YTXtW8y2rNvyoTaj9nqdf13LVv2tq7e+2Sba1r/dd3vzDoMdFTve75TsvLUreFdrvUV99W7S7oLdjxpiG7q/5n7duEd3T8Wej3ulewf2Re/ranRvbNyvv7+yCW1SNo0eSDpw5ZuAb9qb7Zp3tXBaKg7CQeXBJ9+mfHvjUOihzsPcw83fmX+39QjrSHkr0jq/dawto22gPaG97+iMo50dXh1Hvrf/fu8x42N1xzWPV56gnSg98fnkgpPjp2Snnp1OPz3Umdx590z8mWtdUV29Z0PPnj8XdO5Mt1/3yfPe549d8Lxw9CL3Ytslt0utPa49R35w/eFIr1tv62X3y+1XPK509E3rO9Hv03/6asDVc9f41y5dn3m978bsG7duJt0cuCW69fh29u0XdwruTNxdeo94r/y+2v3qB/oP6n+0/rFlwG3g+GDAYM/DWQ/vDgmHnv6U/9OH4dJHzEfVI0YjjY+dHx8bDRq98mTOk+GnsqcTz8p+Vv9563Or59/94vtLz1j82PAL+YvPv655qfNy76uprzrHI8cfvM55PfGm/K3O233vuO+638e9H5ko/ED+UPPR+mPHp9BP9z7nfP78L/eE8/sl0p8zAAAAIGNIUk0AAHolAACAgwAA+f8AAIDpAAB1MAAA6mAAADqYAAAXb5JfxUYAAACOSURBVHjalNEhDoNAFIThdTWEBNMSqgiiqagjAd9jcKE6RDWGPQuH2NN8NatQ20nG/Jnk5c0EXFDjhh6P7D6zGpeACi2emPHOnjNrUQU0GGKMS0rpkJVSOmKMCwY0AVe81nX9OCmzF64BHcZt29ZzMLMRXcAd077v33Mwswn3v4LFp4ufKa6nuPCiCX8DAAHygrRg7JuNAAAAAElFTkSuQmCC)',
				position: CSS_ABSOLUTE
			});
			
			css('.' + SKIN_CLASS + ' .' + CONTROLS_CLASS + ' .' + BUTTON_CLASS + '.videooff', {
				'margin-right': '8px',
				width: '25px',
				height: '40px',
				'background-image': 'url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABYAAAAWCAYAAADEtGw7AAABDklEQVRIS7XUsU3EMBgFYD+XqZLScsMG3AjHBmwAbHAbAJNwTMKNwAip7DJUUbqHfoRPSWT7cokvXSTn8++n+EHd6MGNXHWGnXNHkrTWvpTYbAIrpZ5IHkvgkyhk6lL4HD6QfAVQjyd3zj0CuI9E9GmMaWPRnWHv/Z7k13hRwLuuq/u+P81xku/W2jf5xnv/rJRqjTEnec/CsiCHB1hQkh8AHhbDOVxgrXUr6N+U18IpnOQ3gF2IbxV8KZbVE4epcpmvnvgSvhlOxVIEjuFa68NVv1uulMaZD8NQh5sYu9L10nYDcJfqls19nCquzbCc7r/Ld1VV7Zum+Zl0xdLjp9ZJUQW0KDzfsEgUsVP8AjbPIyaydhRcAAAAAElFTkSuQmCC)'
			});
			css('.' + SKIN_CLASS + ' .' + CONTROLS_CLASS + ' .' + BUTTON_CLASS + '.videooff:hover', {
				'background-image': 'url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABYAAAAWCAYAAADEtGw7AAABBklEQVRIS7WUwRGCMBBF/3LgjAeHqx1oCdqBHUg6oAO1kmAlWoIlcBQ96NkDcVZEIRAUE/bGTHi7eZP9hIGKBuLiA5ZZAoJCFAoXzXTwCkDiAl5XUUztBK6BTzGI1gCC2uQyW8LDtKEo93cQo7RNXUXFZQ7K99qhQou8BsD9ANLgCluIcPP8R54jgFKI8YE/v4H5jBleghlKSkJ5iz5gM5zBPCVDuf4Am+BHALO3vj/B3VosJi4H63De37H+otrhFiqqDZpwR+Cmc3hx3+fWlUuVyRGUm9hcaRCv8681MWWLfR4bgsse/MyJLCkWxZ9DjG71rPj18qZzHFQvqFuw1tCNipZbPACegZ0XwtDqewAAAABJRU5ErkJggg==)'
			});
			css('.' + SKIN_CLASS + ' .' + CONTROLS_CLASS + ' .' + BUTTON_CLASS + '.videooff.on', {
				'background-image': 'url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABYAAAAWCAYAAADEtGw7AAAAsElEQVRIS+2UwQkCQQxF89OAXsMWoSVoJ5ZgCVqJWomWoB3MaVLGlyy4oCzsLMyAh53bQOYxvOQH0uigEVcW8GD2S0XO+QhgNcP7zczSWP0AdvcdyfsMqJA8d113ijfufhCRZGaPuFcBB5TkBcC+GlhVU0D7X1YEPwFsP/qqgX/78f9gki8Am+oqYtxaNa+f4ybjNhmQ8BSRJrkuTZ+qXicjXQorrVv28fg+LvVXUvcGIO6bF1fJcVMAAAAASUVORK5CYII=)'
			});
			css('.' + SKIN_CLASS + ' .' + CONTROLS_CLASS + ' .' + BUTTON_CLASS + '.videooff.on:hover', {
				'background-image': 'url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABYAAAAWCAYAAADEtGw7AAAAsUlEQVRIS2NkoBFgpJG5DKMGw0MWNSjmvyhgYGLkJzrc/7EtZEgUfIBNPcLg+a8dGBj/7SfaUJDC/wyNDIniDWA9818lMDAwPmBIFD0A4lLHYJChjP/nM/xncqSewSBXggwF+4BaBjMwXGBgYDCABx8VDUaNksFv8H+GiwyMDPrUDwpQcqNJ5MHSMU2SG8EMAs49LwoYGBgFiM99bAsIZ2niTSNK5Wh5jKM8Jir0iFMEAFAJZBetwVsWAAAAAElFTkSuQmCC)'
			});
			
			css('.' + SKIN_CLASS + ' .' + CONTROLS_CLASS + ' .' + BUTTON_CLASS + '.videooff'
				+ ', .' + SKIN_CLASS + ' .' + CONTROLS_CLASS + ' .' + BUTTON_CLASS + '.videooff.on', {
				display: CSS_NONE
			});
			css('.' + SKIN_CLASS + ' .' + CONTROLS_CLASS + ' .' + BUTTON_CLASS + '.videooff.enable', {
				display: CSS_BLOCK
			});
			
			css('.' + SKIN_CLASS + ' .' + CONTROLS_CLASS + ' .' + BUTTON_CLASS + ' .' + TOOLTIP_CLASS, {
				bottom: '40px',
				position: CSS_ABSOLUTE
			});
			css('.' + SKIN_CLASS + ' .' + CONTROLS_CLASS + ' .' + BUTTON_CLASS + ':hover .' + TOOLTIP_CLASS, {
				visibility: CSS_VISIBLE
			});
			
			css('.' + SKIN_CLASS + ' .' + CONTROLS_CLASS + ' .' + BUTTON_CLASS + '.hd', {
				'margin-right': '8px',
				height: '40px',
				position: CSS_RELATIVE
			});
			css('.' + SKIN_CLASS + ' .' + CONTROLS_CLASS + ' .' + BUTTON_CLASS + '.hd .' + TOOLTIP_CLASS, {
				'z-index': '2'
			});
			css('.' + SKIN_CLASS + ' .' + CONTROLS_CLASS + ' .' + BUTTON_CLASS + '.hd .' + TOOLTIP_CLASS + ' .' + TOOLTIP_ITEM_CLASS, {
				'min-width': '40px'
			});
			
			css('.' + SKIN_CLASS + ' .' + CONTROLS_CLASS + ' .' + BUTTON_CLASS + '.bullet', {
				'margin-right': '8px',
				width: '58px',
				height: '40px',
				'background-image': 'url(data:image/png;base64,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)'
			});
			css('.' + SKIN_CLASS + ' .' + CONTROLS_CLASS + ' .' + BUTTON_CLASS + '.bullet.off', {
				'background-image': 'url(data:image/png;base64,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)'
			});
			
			css('.' + SKIN_CLASS + ' .' + CONTROLS_CLASS + ' .' + BUTTON_CLASS + '.fullpage', {
				'margin-right': '8px',
				width: '25px',
				height: '40px',
				'background-image': 'url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABIAAAASCAYAAABWzo5XAAAA1klEQVQ4T6WU0Q3CMAxEL2PEX4zABrAJZQNGYQPoJrABbMCXO0aQqziyoqTFxX9N69fzXZIARzHzA8Ch1RIcHDDzFcDe9BSoC2R/ysx3ACdd2wQykBHATsZ1gyyEiAb1zQWqITKWG9SCZNAcwE+KpmkaUko3AKOM81f8AosxSlLNWlS01myJXZB6EkI4Lykp+yi7/iKiiy72jF06BYGZE4AnER1zCrpju8Y2zbagLUrsaLMiAJ98dlxKapA+b4JIs3qkILlvtN42gLXrpgbZ70sAaxB5/wUKOHOr0JSnagAAAABJRU5ErkJggg==)'
			});
			css('.' + SKIN_CLASS + ' .' + CONTROLS_CLASS + ' .' + BUTTON_CLASS + '.fullpage:hover', {
				'background-image': 'url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABIAAAASCAYAAABWzo5XAAAA1ElEQVQ4T52U0RXCIAxFX5bQfjqCG+gmlg0cxQ3ATXQD3cDPtkvEE2oLeIAC+eSQm5cXAqEm9PAA0SmWQjUc6OEG4LjmeNA6kF9VjwaEy3LUBlogjDvAB2m3HuRD1L7Hz7c60D9E+qoGxSAzyA6gTJGeehBriCfSTiTKQLby1EPtTOq55EEbyT40DVo9IZVT4t6RuA68oLrrWiFlbGYNCGZkMD+hurO91wCRtBDUCAlBoI/dncyIcws+K1qiEeIUOZIYPwfjHQxg478JFfmX/QEUfFpfQyBuipf1nDYAAAAASUVORK5CYII=)'
			});
			css('.' + SKIN_CLASS + '.fp .' + CONTROLS_CLASS + ' .' + BUTTON_CLASS + '.fullpage', {
				display: CSS_NONE
			});
			
			css('.' + SKIN_CLASS + ' .' + CONTROLS_CLASS + ' .' + BUTTON_CLASS + '.fpexit', {
				'margin-right': '8px',
				width: '25px',
				height: '40px',
				'background-image': 'url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABIAAAASCAYAAABWzo5XAAAAt0lEQVQ4T72UQQ4CIQxF7ZKuZMsl9AjjyfUIegm2uIJlTc38hBAMFJNhRYC+/sIvdPpjpJTOGu69f9MsJ8YoejaE8I1RSM75rnNmvi2BACGiq4i8mHkzg5xzXpXUkKXSROTZQrQ8syINQjmqBHe8BGofSB/geNDIJtOKpkAwW+8wDHgsCNlqx2LNpKjuHZiNiC51b02V1uudUkoygXoQdWzb7UNFO+ixfwcbbG8G4X7wQY0y/9r/AJnWkc0bPWKhAAAAAElFTkSuQmCC)',
				display: CSS_NONE
			});
			css('.' + SKIN_CLASS + ' .' + CONTROLS_CLASS + ' .' + BUTTON_CLASS + '.fpexit:hover', {
				'background-image': 'url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABIAAAASCAYAAABWzo5XAAAAuUlEQVQ4T2NkoATMfy8A1p4o+IGRaHMWvPwPVpsgDtEDMoTx134w+z+bI3kGIQwxYPjPcJGBgc2BdIP+swlCXQI3hDyvMTBcYGBgQDEE5DvSXQQOE4h3QC6BhTF5BqHHUII44wAYRCCdEO8iogyCJTZsimEJkL4GwWxDTrEwMZJchJp3IImNkUEfJW8R5TUseYeB8dd70gzCZggoxaLndoIuApcpvw5A1CEle5INgoUPtIAiunxCUwgApE9cT85zkWYAAAAASUVORK5CYII=)'
			});
			css('.' + SKIN_CLASS + '.fp .' + CONTROLS_CLASS + ' .' + BUTTON_CLASS + '.fpexit', {
				display: CSS_BLOCK
			});
			
			css('.' + SKIN_CLASS + ' .' + CONTROLS_CLASS + ' .' + BUTTON_CLASS + '.fullscreen', {
				'margin-right': '8px',
				width: '25px',
				height: '40px',
				'background-image': 'url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABIAAAASCAYAAABWzo5XAAAAnElEQVQ4T+WU3Q3CMAyEOW8RZRi6GWWzdJgkW+TQIbUyEBR4qFRBnuLYcuzPPyil8NQ5JK8xxtmrcs4zgEvPHns4Wkim9TczSyGETdZ7rXVqrU2rDQDdz5K3iHqp9FJ4l+oBHakSCrfHZJSaZ4aR8af6X3Yk2GamMVmeG3DER7D/oSHd9CcAfkhfmHkm4kdSjO5DvMsaeSjSt4vtBtnsp8JMC9GXAAAAAElFTkSuQmCC)'
			});
			css('.' + SKIN_CLASS + ' .' + CONTROLS_CLASS + ' .' + BUTTON_CLASS + '.fullscreen:hover', {
				'background-image': 'url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABIAAAASCAYAAABWzo5XAAAAnUlEQVQ4T92UwQ3CMAxFn7MDYhyySiehTFJGScep2CGukkNjwFJAKhJqbo4tx//FtnBfFO8oN4bz+OSalhHh6oXL/olUZ5DUXguJ4WRsYHpEyLHFaETkUuxWkSfF1WwujdR/TFTKq8dh0pXWmEkv9lP/oRMV2AElh/mtAXuASoOGfPyG3NaIJsQMrcfMMKn4VCNIHeIfrJHXH/pysa1ohHWEOdPAyAAAAABJRU5ErkJggg==)'
			});
			css('.' + SKIN_CLASS + '.fs .' + CONTROLS_CLASS + ' .' + BUTTON_CLASS + '.fullscreen', {
				display: CSS_NONE
			});
			
			css('.' + SKIN_CLASS + ' .' + CONTROLS_CLASS + ' .' + BUTTON_CLASS + '.fsexit', {
				'margin-right': '8px',
				width: '25px',
				height: '40px',
				'background-image': 'url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABIAAAASCAYAAABWzo5XAAAAq0lEQVQ4T91TwQ3CMAz0eYsoS7ABdCOYgDIB3YiyAUsk2SJGrgpKW0vkkUeFn7Z18t35QEWllE4i8tCWiNy89305DyH0AK7aA9A558bPHPsDUjrKZKZzIKKhhhoRnQG8vtRijBPIun5ptN5HMyB1wrqImcfSFd1RGXLOKsWmFq5ZC7W9fwZSsZnZeoGnJTYRHU2xm9nfDGiOyHStiGhE7pURuSwisr/0t7roDbmXxCMvcdiYAAAAAElFTkSuQmCC)',
				display: CSS_NONE
			});
			css('.' + SKIN_CLASS + ' .' + CONTROLS_CLASS + ' .' + BUTTON_CLASS + '.fsexit:hover', {
				'background-image': 'url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABIAAAASCAYAAABWzo5XAAAArElEQVQ4T2NkQAbzXzswMP7bDxb6z9DIkCjegCr/soGBkaEeIs/kyJAoegAmzzgIDQJ5h5nhP8S5fw0Y/jNOIMprjP8LGBiZLyC8tuAlxBB0QCiM0NQzMlDNoPkvUWMGbhPTAeRYAQuDgoHhnwM2D6DGGlY/Eic4rA0CBTYTNB0hB8c/poNYA5vpnz32wKZa9FPNIHDagIG/BgyMjP1EZZH//wsZGJCzyLAtRgCyOYnaQdfFTQAAAABJRU5ErkJggg==)'
			});
			css('.' + SKIN_CLASS + '.fs .' + CONTROLS_CLASS + ' .' + BUTTON_CLASS + '.fsexit', {
				display: CSS_BLOCK
			});
			
			css('.' + SKIN_CLASS + ' .' + CONTEXTMENU_CLASS, {
				'white-space': CSS_NOWRAP,
				position: CSS_ABSOLUTE,
				display: CSS_NONE,
				'z-index': '4'
			});
			css('.' + SKIN_CLASS + ' .' + CONTEXTMENU_CLASS + ' ul', {
				'list-style': CSS_NONE
			});
			css('.' + SKIN_CLASS + ' .' + CONTEXTMENU_CLASS + ' ul li', {
				
			});
			css('.' + SKIN_CLASS + ' .' + CONTEXTMENU_CLASS + ' ul li a', {
				padding: '8px 14px',
				color: '#E6E6E6',
				'line-height': '20px',
				'text-decoration': CSS_NONE,
				background: '#252525',
				display: CSS_BLOCK
			});
			css('.' + SKIN_CLASS + ' .' + CONTEXTMENU_CLASS + ' ul li a:hover', {
				'text-decoration': CSS_NONE,
				background: '#303030'
			});
			css('.' + SKIN_CLASS + ' .' + CONTEXTMENU_CLASS + ' ul li.' + FEATURED_CLASS + ' a', {
				color: '#BDBDBD',
				background: '#454545'
			});
			css('.' + SKIN_CLASS + ' .' + CONTEXTMENU_CLASS + ' ul li.' + FEATURED_CLASS + ' a:hover', {
				'text-decoration': CSS_NONE,
				background: '#505050'
			});
			css('.' + SKIN_CLASS + ' .' + CONTEXTMENU_CLASS + ' ul li a span', {
				'margin-right': '10px',
				'padding-right': '10px',
				width: '20px',
				height: '20px',
				'border-right': '1px solid #BDBDBD',
				'vertical-align': 'middle',
				display: CSS_INLINE_BLOCK
			});
		}
		
		_this.resize = function(width, height) {
			utils.log('Resizing to ' + width + ', ' + height);
			
			_width = parseInt(width);
			_height = parseInt(height);
		};
		
		_init();
	};
})(playease);

(function(playease) {
	playease.core.components = {};
})(playease);

(function(playease) {
	var utils = playease.utils,
		events = playease.events,
		core = playease.core,
		components = core.components,
		
		directions = {
			HORIZONTAL: 0,
			VERTICAL:   1
		},
		
		SLIDER_CLASS = 'pe-slider'
		RAIL_CLASS = 'pe-rail',
		THUMB_CLASS = 'pe-thumb';
	
	components.slider = function(config) {
		var _this = utils.extend(this, new events.eventdispatcher('components.slider')),
			_defaults = {
				name: '',
				direction: directions.HORIZONTAL
			},
			_railnames = ['bg', 'buf', 'pro'],
			_rails,
			_thumb,
			_direction,
			_container,
			_percentage,
			_active,
			_value;
		
		function _init() {
			_this.config = utils.extend({}, _defaults, config);
			
			_rails = {};
			_direction = _this.config.direction;
			_percentage = 0;
			_active = false;
			
			_build();
			
			try {
				document.addEventListener('mousedown', _onMouseDown);
				document.addEventListener('mousemove', _onMouseMove);
				document.addEventListener('mouseup', _onMouseUp);
			} catch (err) {
				document.attachEvent('onmousedown', _onMouseDown);
				document.attachEvent('onmousemove', _onMouseMove);
				document.attachEvent('onmouseup', _onMouseUp);
			}
		}
		
		function _build() {
			_container = utils.createElement('div', SLIDER_CLASS + ' ' + _this.config.name);
			
			for (var i = 0; i < _railnames.length; i++) {
				var name = _railnames[i];
				var rail = _rails[name] = utils.createElement('span', RAIL_CLASS + ' ' + name);
				_container.appendChild(rail);
			}
			
			_thumb = utils.createElement('span', THUMB_CLASS);
			_container.appendChild(_thumb);
		}
		
		_this.buffered = function(percentage) {
			_rails.buf.style.width = (percentage || 0) + '%';
		};
		
		_this.update = function(percentage) {
			_percentage = percentage;
			_rails.pro.style.width = _percentage + '%';
			if (_direction == directions.HORIZONTAL) {
				try {
					_thumb.style.left = 'calc(' + _percentage + '% - 5px)';
				} catch (err) {
					setTimeout(function() {
						_thumb.style.left = _container.clientWidth * _percentage / 100 - 5 + 'px';
					});
				}
			} else {
				try {
					_thumb.style.bottom = 'calc(' + _percentage + '% - 5px)';
				} catch(err) {
					setTimeout(function() {
						_thumb.style.bottom = _container.clientHeight * _percentage / 100 - 5 + 'px';
					});
				}
			}
		};
		
		function _onMouseDown(e) {
			if (!e.target) {
				e.target = e.srcElement;
			}
			
			var target = e.target && e.target.parentNode === _container ? e.target.parentNode : e.target;
			if (target !== _container) {
				return;
			}
			
			var value = _getValue(e.clientX, e.clientY);
			if (value != _value) {
				_value = value;
				_this.dispatchEvent(events.PLAYEASE_SLIDER_CHANGE, { value: value });
			}
			
			_active = true;
		}
		
		function _onMouseMove(e) {
			if (!_active) {
				return;
			}
			
			var value = _getValue(e.clientX, e.clientY);
			if (value != _value) {
				_value = value;
				_this.dispatchEvent(events.PLAYEASE_SLIDER_CHANGE, { value: value });
			}
		}
		
		function _onMouseUp(e) {
			if (!_active) {
				return;
			}
			
			var value = _getValue(e.clientX, e.clientY);
			if (value != _value) {
				_value = value;
				_this.dispatchEvent(events.PLAYEASE_SLIDER_CHANGE, { value: value });
			}
			
			_active = false;
		}
		
		function _getValue(x, y) {
			var offsetX, offsetY, value;
			
			offsetX = x;
			offsetY = y;
			for (var node = _container; node; node = node.offsetParent) {
				offsetX -= node.offsetLeft;
				offsetY -= node.offsetTop;
			}
			
			if (_direction == directions.HORIZONTAL) {
				value = (offsetX / _container.clientWidth * 100).toFixed(2);
			} else {
				value = (offsetY / _container.clientHeight * 100).toFixed(2);
			}
			value = Math.max(0, Math.min(value, 100));
			
			return value;
		}
		
		_this.element = function() {
			return _container;
		};
		
		_init();
	};
})(playease);

(function(playease) {
	var utils = playease.utils,
		css = utils.css,
		events = playease.events,
		core = playease.core,
		components = core.components,
		
		TOOLTIP_CLASS = 'pe-tooltip';
	
	components.tooltip = function(config) {
		var _this = utils.extend(this, new events.eventdispatcher('components.tooltip')),
			_defaults = {
				name: 'tooltip'
			},
			_container,
			_elements;
		
		function _init() {
			_this.config = utils.extend({}, _defaults, config);
			
			_elements = {};
			
			_container = utils.createElement('div', TOOLTIP_CLASS + ' ' + _this.config.name);
		}
		
		_this.appendChild = function(node) {
			_elements[node.index] = node;
			_container.appendChild(node);
		};
		
		_this.removeChild = function(node) {
			delete _elements[node.index];
			_container.removeChild(node);
		};
		
		_this.activeItemAt = function(index) {
			utils.foreach(_elements, function(idx, node) {
				if (idx == index) {
					utils.addClass(node, 'active');
				} else {
					utils.removeClass(node, 'active');
				}
			});
			
			setTimeout(function() {
				_this.resize();
			});
		};
		
		_this.element = function() {
			return _container;
		};
		
		_this.resize = function(width, height) {
			var offsetX = (_container.parentNode.clientWidth - _container.clientWidth) / 2;
			
			css.style(_container, {
				left: offsetX + 'px'
			});
		};
		
		_init();
	};
})(playease);

(function(playease) {
	var utils = playease.utils,
		css = utils.css,
		events = playease.events,
		core = playease.core,
		components = core.components,
		
		types = {
			DEVIDER: 0,
			LABEL:   1,
			BUTTON:  2,
			SLIDER:  3
		},
		
		DEVIDER_CLASS = 'pe-devider',
		LABEL_CLASS = 'pe-label',
		BUTTON_CLASS = 'pe-button',
		
		OVERLAY_CLASS = 'pe-overlay',
		TOOLTIP_ITEM_CLASS = 'pe-tooltip-item';
	
	components.controlbar = function(layer, config) {
		var _this = utils.extend(this, new events.eventdispatcher('components.controlbar')),
			_defaults = {
				bulletscreen: {}
			},
			_layout,
			_labels,
			_buttons,
			_overlays,
			_timeBar,
			_volumeBar;
		
		function _init() {
			_this.config = utils.extend({}, _defaults, config);
			
			_labels = {};
			_buttons = {};
			_overlays = {};
			
			_layout = {
				left: [
					_layoutElement('play', types.BUTTON),
					_layoutElement('pause', types.BUTTON),
					_layoutElement('reload', types.BUTTON),
					_layoutElement('stop', types.BUTTON),
					_layoutElement('alt', types.LABEL),
					_layoutElement('elapsed', types.LABEL),
					_layoutElement('devider', types.DEVIDER),
					_layoutElement('duration', types.LABEL)
				],
				center: [
					
				],
				right: [
					_layoutElement('report', types.BUTTON),
					_layoutElement('volume', types.BUTTON),
					_layoutElement('volume', types.SLIDER),
					_layoutElement('videooff', types.BUTTON),
					_layoutElement('hd', types.BUTTON),
					_layoutElement('bullet', types.BUTTON, _this.config.bulletscreen.enable ? '' : 'off'),
					_layoutElement('fullpage', types.BUTTON),
					_layoutElement('fpexit', types.BUTTON),
					_layoutElement('fullscreen', types.BUTTON),
					_layoutElement('fsexit', types.BUTTON)
				]
			};
			
			_timeBar = new components.slider({ name: 'time' });
			_timeBar.addEventListener(events.PLAYEASE_SLIDER_CHANGE, _onTimeBarChange);
			layer.appendChild(_timeBar.element());
			
			_buildLayout();
			
			try {
				document.addEventListener('fullscreenchange', _onFullscreenChange);
				document.addEventListener('webkitfullscreenchange', _onFullscreenChange);
				document.addEventListener('mozfullscreenchange', _onFullscreenChange);
				document.addEventListener('MSFullscreenChange', _onFullscreenChange);
			} catch (err) {
				/* void */
			}
		}
		
		function _layoutElement(name, type, className) {
			return {
				name: name,
				type: type,
				className: className
			};
		}
		
		function _buildLayout() {
			_buildGroup('left', _layout.left);
			_buildGroup('center', _layout.center);
			_buildGroup('right', _layout.right);
		}
		
		function _buildGroup(pos, elts) {
			var group = utils.createElement('div', 'pe-' + pos);
			
			for (var i = 0; i < elts.length; i++) {
				var element = _buildElement(elts[i], pos);
				if (element) {
					group.appendChild(element);
				}
			}
			
			layer.appendChild(group);
		}
		
		function _buildElement(elt, pos) {
			var element;
			
			switch (elt.type) {
				case types.DEVIDER:
					element = _buildDevider(elt.name);
					break;
				case types.LABEL:
					element = _buildLabel(elt.name);
					break;
				case types.BUTTON:
					element = _buildButton(elt.name, pos, elt.className);
					break;
				case types.SLIDER:
					if (elt.name === 'volume' && !utils.isMobile()) {
						_volumeBar = new components.slider({ name: elt.name });
						_volumeBar.addEventListener(events.PLAYEASE_SLIDER_CHANGE, _onVolumeBarChange);
						element = _volumeBar.element();
					}
					break;
				default:
					break;
			}
			
			return element;
		}
		
		function _buildDevider(name) {
			var element = utils.createElement('span', DEVIDER_CLASS);
			element.innerHTML = '/';
			
			return element;
		}
		
		function _buildLabel(name) {
			var text = '';
			
			switch (name) {
				case 'alt':
					text = 'Live broadcast';
					break;
				case 'elapsed':
				case 'duration':
					text = '00:00';
					break;
				case 'devider':
					text = '/';
					break;
				default:
					break;
			}
			
			var element = utils.createElement('span', LABEL_CLASS + ' ' + name);
			element.innerHTML = text;
			
			_labels[name] = element;
			
			return element;
		}
		
		function _buildButton(name, pos, className) {
			// Don't show volume or mute controls on mobile, since it's not possible to modify audio levels in JS
			if (utils.isMobile() && (name === 'volume' || name.indexOf('volume') === 0)) {
				return null;
			}
			// Having issues with stock (non-chrome) Android browser and showing overlays.
			// Just remove HD/CC buttons in that case
			if (utils.isAndroid(4, true) && /hd|cc/.test(name)) {
				return null;
			}
			
			if (name === 'report' && !_this.config.report) {
				return null;
			}
			if (name === 'hd' && (utils.typeOf(_this.config.playlist.sources) !== 'array' || _this.config.playlist.sources.length < 2)) {
				return null;
			}
			if (name === 'bullet' && !_this.config.bulletscreen.visible) {
				return null;
			}
			
			var element = utils.createElement('span', BUTTON_CLASS + ' ' + name + (className ? ' ' + className : ''));
			element.name = name;
			try {
				element.addEventListener('click', _onButtonClick);
			} catch (err) {
				element.attachEvent('onclick', function(e) {
					_onButtonClick.call(element, arguments);
				});
			}
			
			if (name === 'hd') {
				var tooltip = new components.tooltip({ name: name });
				
				var sources = _this.config.playlist.sources;
				for (var i = 0; i < sources.length; i++) {
					var item = utils.createElement('div', TOOLTIP_ITEM_CLASS);
					item.index = i;
					item.innerText = sources[i].label || i;
					
					try {
						item.addEventListener('click', _onHDItemClick);
					} catch (err) {
						item.attachEvent('onclick', function(e) {
							_onHDItemClick.call(item, arguments);
						});
					}
					
					tooltip.appendChild(item);
				}
				
				_overlays[name] = tooltip;
				
				element.innerHTML = '<span>HD</span>';
				element.appendChild(tooltip.element());
			}
			
			_buttons[name] = element;
			
			return element;
		}
		
		function _onButtonClick(e) {
			var name = (e.target || this).name;
			
			switch (name) {
				case 'play':
					_this.dispatchEvent(events.PLAYEASE_VIEW_PLAY);
					break;
				case 'pause':
					_this.dispatchEvent(events.PLAYEASE_VIEW_PAUSE);
					break;
				case 'reload':
					_this.dispatchEvent(events.PLAYEASE_VIEW_RELOAD);
					break;
				case 'stop':
					_this.dispatchEvent(events.PLAYEASE_VIEW_STOP);
					break;
				case 'report':
					_this.dispatchEvent(events.PLAYEASE_VIEW_REPORT);
					break;
				case 'volume':
					_this.dispatchEvent(events.PLAYEASE_VIEW_MUTE);
					break;
				case 'videooff':
					_this.dispatchEvent(events.PLAYEASE_VIEW_VIDEOOFF);
					break;
				case 'hd':
					/* void */
					break;
				case 'bullet':
					_this.dispatchEvent(events.PLAYEASE_VIEW_BULLET);
					break;
				case 'fullpage':
					_this.dispatchEvent(events.PLAYEASE_VIEW_FULLPAGE, { exit: false });
					break;
				case 'fpexit':
					_this.dispatchEvent(events.PLAYEASE_VIEW_FULLPAGE, { exit: true });
					break;
				case 'fullscreen':
					_this.dispatchEvent(events.PLAYEASE_VIEW_FULLSCREEN, { exit: false });
					break;
				case 'fsexit':
					_this.dispatchEvent(events.PLAYEASE_VIEW_FULLSCREEN, { exit: true });
					break;
				default:
					break;
			}
		}
		
		function _onHDItemClick(e) {
			var item = e.target || this;
			_this.dispatchEvent(events.PLAYEASE_VIEW_HD, { index: item.index });
		}
		
		function _onFullscreenChange(e) {
			if (!document.fullscreenElement && !document.webkitFullscreenElement && !document.mozFullScreenElement && !document.msFullscreenElement) {
				_this.dispatchEvent(events.PLAYEASE_VIEW_FULLSCREEN, { exit: true });
			}
		}
		
		function _onTimeBarChange(e) {
			_this.dispatchEvent(events.PLAYEASE_VIEW_SEEK, { offset: e.value });
		}
		
		function _onVolumeBarChange(e) {
			_this.dispatchEvent(events.PLAYEASE_VIEW_VOLUME, { volume: e.value });
		}
		
		
		_this.setBuffered = function(buffered) {
			_timeBar.buffered(buffered);
		};
		
		_this.setPosition = function(position) {
			_timeBar.update(position);
		};
		
		_this.setElapsed = function(elapsed) {
			var h = Math.floor(elapsed / 3600);
			var m = Math.floor((elapsed % 3600) / 60);
			var s = Math.floor(elapsed % 60);
			var text = (h ? utils.pad(h, 2) + ':' : '') + utils.pad(m, 2) + ':' + utils.pad(s, 2);
			_labels.elapsed.innerHTML = text;
		};
		
		_this.setDuration = function(duration) {
			if (isNaN(duration) || duration === Infinity) {
				duration = 0;
			}
			
			var h = Math.floor(duration / 3600);
			var m = Math.floor((duration % 3600) / 60);
			var s = Math.floor(duration % 60);
			var text = (h ? utils.pad(h, 2) + ':' : '') + utils.pad(m, 2) + ':' + utils.pad(s, 2);
			_labels.duration.innerHTML = text;
		};
		
		_this.setMuted = function(muted, vol) {
			if (utils.isMobile()) {
				return;
			}
			
			if (muted) {
				utils.addClass(_buttons.volume, 'mute');
				_volumeBar.update(0);
			} else {
				utils.removeClass(_buttons.volume, 'mute');
				_volumeBar.update(vol);
			}
		};
		
		_this.setVolume = function(vol) {
			if (utils.isMobile()) {
				return;
			}
			
			if (vol) {
				utils.removeClass(_buttons.volume, 'mute');
			} else {
				utils.addClass(_buttons.volume, 'mute');
			}
			
			_volumeBar.update(vol);
		};
		
		_this.setVideoOff = function(off, enable) {
			if (enable) {
				utils.addClass(_buttons.videooff, 'enable');
			} else {
				utils.removeClass(_buttons.videooff, 'enable');
			}
			
			if (off) {
				utils.removeClass(_buttons.videooff, 'on');
			} else {
				utils.addClass(_buttons.videooff, 'on');
			}
		};
		
		_this.activeHDItem = function(index, label) {
			if (_overlays.hd) {
				_overlays.hd.activeItemAt(index);
				
				if (_buttons.hd) {
					_buttons.hd.childNodes[0].innerText = label || 'HD';
				}
			}
		};
		
		_this.setBullet = function(on) {
			if (on) {
				utils.removeClass(_buttons.bullet, 'off');
			} else {
				utils.addClass(_buttons.bullet, 'off');
			}
		};
		
		_this.resize = function(width, height) {
			utils.foreach(_overlays, function(name, tooltip) {
				tooltip.resize(width, height);
			});
		};
		
		_this.destroy = function() {
			
		};
		
		function _forward(e) {
			_this.dispatchEvent(e.type, e);
		}
		
		_init();
	};
})(playease);

(function(playease) {
	var utils = playease.utils,
		css = utils.css,
		events = playease.events,
		core = playease.core,
		components = core.components,
		
		POSTER_CLASS = 'pe-poster';
	
	components.poster = function(config) {
		var _this = utils.extend(this, new events.eventdispatcher('components.poster')),
			_defaults = {
				url: ''
			},
			_ratio,
			_container,
			_image;
		
		function _init() {
			_this.config = utils.extend({}, _defaults, config);
			
			_ratio = _this.config.width / _this.config.height;
			
			_container = utils.createElement('div', POSTER_CLASS);
			if (_this.config.url) {
				_image = new Image();
				_image.onload = function(e) {
					_ratio = _image.naturalWidth / _image.naturalHeight;
				};
				_image.onerror = function(e) {
					utils.log('Poster not available.');
				};
				
				_image.src = _this.config.url;
				_container.appendChild(_image);
			}
		}
		
		_this.element = function() {
			return _container;
		};
		
		_this.resize = function(width, height) {
			if (!_image || !_ratio) {
				return;
			}
			
			var w, h;
			if (width / height >= _ratio) {
				w = height * _ratio;
				h = height;
			} else {
				w = width;
				h = width / _ratio;
			}
			
			var top = (height - h) / 2;
			var left = (width - w) / 2;
			
			css.style(_image, {
				width: w + 'px',
				height: h + 'px',
				top: top + 'px',
				left: left + 'px'
			});
		};
		
		_init();
	};
})(playease);

(function(playease) {
	var utils = playease.utils,
		events = playease.events,
		core = playease.core,
		components = core.components,
		
		alphas = {
			NONE: 1,
			LOW:  0.75,
			MID:  0.5,
			HIGH: 0.25
		},
		positions = {
			FULLSCREEN: 0,
			TOP:        1,
			BOTTOM:     2
		};
	
	components.bulletscreen = function(config) {
		var _this = utils.extend(this, new events.eventdispatcher('components.bulletscreen')),
			_defaults = {
				width: 640,
				height: 360,
				enable: true,
				fontsize: 14,
				interval: 30,
				duration: 12000,
				alpha: alphas.LOW,
				position: positions.FULLSCREEN,
				visible: true
			},
			_rows,
			_timer,
			_canvas,
			_context;
		
		_this.bullet = function(text) {
			var _self = this;
			
			function _init() {
				_self.text = text;
				
				_self.doublechars = _getDoubleChars();
				_self.width = (_self.text.length + _self.doublechars * 0.96) / 2 * _this.config.fontsize;
				_self.weight = (_canvas.width + _self.width) / (_this.config.duration / _this.config.interval);
				_self.tick = 0;
			}
			
			function _getDoubleChars() {
				var chars = _self.text.match(/([^x00-xff])/gi);
				return chars ? chars.length : 0;
			}
			
			_init();
		};
		
		function _init() {
			_this.config = utils.extend({}, _defaults, config);
			
			_rows = [];
			
			_canvas = utils.createElement('canvas');
			
			_this.resize(_this.config.width, _this.config.height);
		}
		
		_this.shoot = function(text) {
			if (!_context || _this.config.enable == false) {
				return;
			}
			
			var bullet = new _this.bullet(text);
			var index = _getIndex(bullet.weight);
			var row = _rows[index];
			if (!row) {
				row = [];
				row.weight = 0;
				row.bitmap = 0x0000;
				
				_rows[index] = row;
			}
			
			var blockwidth = _canvas.width / 10;
			var bits = Math.ceil(bullet.width / blockwidth);
			var pos = 6 - bits;
			
			row.push(bullet);
			row.weight += bullet.weight;
			row.bitmap |= ((1 << bits) - 1) << pos;
			
			_startTimer();
		};
		
		function _getIndex(weight) {
			var index = 0;
			var best = 0;
			var minweight = 0;
			
			for (var i = 0; i < _rows.length; i++) {
				var row = _rows[i];
				if (!row || row.length == 0) {
					index = i;
					break;
				}
				
				if ((row.bitmap & 0x007F) == 0) {
					index = i;
					break;
				}
				
				if (!minweight || row.weight < minweight) {
					best = i;
					minweight = row.weight;
				}
				
				index = i + 1;
			}
			
			if (index >= Math.floor(_canvas.height / _this.config.fontsize)) {
				index = best;
			}
			
			return index;
		}
		
		function _update(e) {
			_context.clearRect(0, 0, _canvas.width, _canvas.height);
			
			var blockwidth = _canvas.width / 10;
			var hasContent = false;
			
			for (var i = 0; i < _rows.length; i++) {
				var row = _rows[i];
				if (!row || row.length == 0) {
					continue;
				}
				
				row.bitmap = 0x0000;
				
				var offsetY = i * _this.config.fontsize;
				for (var j = 0; j < row.length; j++) {
					var bullet = row[j];
					var offsetX = _canvas.width - bullet.weight * bullet.tick++;
					if (offsetX <= -1 * bullet.width) {
						row.splice(j--, 1);
						row.weight -= bullet.weight;
						
						bullet = undefined;
						
						continue;
					}
					
					var bits = Math.ceil(bullet.width / blockwidth);
					var pos = Math.floor(offsetX / blockwidth);
					row.bitmap |= ((1 << bits) - 1) << (10 - pos);
					
					hasContent = true;
					
					_context.fillText(bullet.text, offsetX, offsetY);
				}
			}
			
			if (!hasContent) {
				_stopTimer();
			}
		}
		
		function _startTimer() {
			if (!_timer) {
				_timer = new utils.timer(30);
				_timer.addEventListener(events.PLAYEASE_TIMER, _update);
			}
			_timer.start();
		}
		
		function _stopTimer() {
			if (_timer) {
				_timer.stop();
			}
		}
		
		_this.setProperty = function(key, value) {
			_this.config[key] = value;
			
			switch (key) {
				case 'enable':
					_this.dispatchEvent(events.PLAYEASE_BULLET, { bullet: value ? 'on' : 'off' });
					break;
				default:
					break;
			}
		};
		
		_this.element = function() {
			return _canvas;
		};
		
		_this.resize = function(width, height) {
			_canvas.width = width;
			_canvas.height = height;
			
			try {
				_context = _canvas.getContext("2d");
			} catch (err) {
				return;
			}
			
			_context.font = 'bold ' + _this.config.fontsize + 'px Microsoft YaHei,arial,sans-serif';
			_context.fillStyle = '#E6E6E6';
			_context.globalAlpha = _this.config.alpha;
			_context.textAlign = 'left';
			_context.textBaseline = 'top';
		};
		
		_init();
	};
	
	components.bulletscreen.alphas = alphas;
	components.bulletscreen.positions = positions;
})(playease);

(function(playease) {
	var utils = playease.utils,
		css = utils.css,
		events = playease.events,
		core = playease.core,
		states = core.states,
		components = core.components,
		
		DISPLAY_CLASS = 'pe-display',
		DISPLAY_ICON_CLASS = 'pe-display-icon',
		DISPLAY_LABEL_CLASS = 'pe-display-label';
	
	components.display = function(config) {
		var _this = utils.extend(this, new events.eventdispatcher('components.display')),
			_defaults = {
				id: 'pla-display'
			},
			_container,
			_group,
			_icon,
			_label,
			_timer;
		
		function _init() {
			_this.config = utils.extend({}, _defaults, config);
			
			_container = utils.createElement('div', DISPLAY_CLASS);
			_group = utils.createElement('div');
			
			_icon = utils.createElement('span', DISPLAY_ICON_CLASS);
			_label = utils.createElement('span', DISPLAY_LABEL_CLASS);
			_label.id = _this.config.id;
			
			_group.appendChild(_icon);
			_group.appendChild(_label);
			_container.appendChild(_group);
		}
		
		_this.show = function(state, message) {
			_label.innerText = message;
			
			switch (state) {
				case states.BUFFERING:
					_startTimer();
					break;
				default:
					_stopTimer();
					break;
			}
		};
		
		
		function _startTimer() {
			if (!_timer) {
				_timer = new utils.timer(80);
				_timer.addEventListener(events.PLAYEASE_TIMER, _rotateIcon);
			}
			_timer.start();
		}
		
		function _stopTimer() {
			if (_timer) {
				_timer.stop();
			}
		}
		
		function _rotateIcon(e) {
			var angle = _timer.currentCount() * 30 % 360;
			
			css.style(_icon, {
				filter: 'progid:DXImageTransform.Microsoft.BasicImage(rotation=' + angle * Math.PI / 180 + ')',
				'transform': 'rotate(' + angle + 'deg)',
				'-o-transform': 'rotate(' + angle + 'deg)',
				'-ms-transform': 'rotate(' + angle + 'deg)',
				'-moz-transform': 'rotate(' + angle + 'deg)',
				'-webkit-transform': 'rotate(' + angle + 'deg)'
			});
		}
		
		
		_this.element = function() {
			return _container;
		};
		
		_this.resize = function(width, height) {
			
		};
		
		_init();
	};
})(playease);

(function(playease) {
	var utils = playease.utils,
		css = utils.css,
		events = playease.events,
		core = playease.core,
		components = core.components,
		
		positions = {
			TOP_LEFT:     'top-left',
			TOP_RIGHT:    'top-right',
			BOTTOM_LEFT:  'bottom-left',
			BOTTOM_RIGHT: 'bottom-right'
		},
		
		LOGO_CLASS = 'pe-logo';
	
	components.logo = function(config) {
		var _this = utils.extend(this, new events.eventdispatcher('components.logo')),
			_defaults = {
				file: '',
				link: 'http://studease.cn/playease',
				target: '_blank',
				margin: '3% 5%',
				visible: true,
				position: positions.TOP_RIGHT
			},
			_container,
			_divimg,
			_logo,
			_logoimg,
			_img,
			_loaded = false;
		
		function _init() {
			_this.config = utils.extend({}, _defaults, config);
			
			_container = utils.createElement('div', LOGO_CLASS);
			_divimg = utils.createElement('div');
			_logo = utils.createElement('a');
			_logoimg = utils.createElement('img');
			_logoimg.src = _this.config.file;
			
			css.style(_container, {
				visibility: _this.config.visible ? 'visible' : 'hidden'
			});
			
			_img = new Image();
			_img.onload = _onload;
			_img.onabort = _onerror;
			_img.onerror = _onerror;
	
			_img.src = _this.config.file;
		}
		
		function _onload(e) {
			_loaded = true;
			
			var style = {
				width: _img.width + 'px',
				height: _img.height + 'px',
				'background-image': 'url(' + _this.config.file + ')'
			};
			
			var arr = _this.config.position.match(/([a-z]+)-([a-z]+)/i);
			if (arr && arr.length > 2) {
				style.margin = _this.config.margin;
				style[arr[1]] = '0';
				style[arr[2]] = '0';
			}

			
			_logo.href = _this.config.link;
			_logo.target = _this.config.target;
			
			_divimg.appendChild(_logo);
			_logo.appendChild(_logoimg);
			_container.appendChild(_divimg);
			
			setTimeout(function() {
				_this.resize();
			});
		}
		
		function _onerror(e) {
			utils.log('Logo image not available.');
		}
		
		
		_this.element = function() {
			return _container;
		};
		
		_this.resize = function(width, height) {
			if (!_loaded) {
				return;
			}
			
			width = _img.width * _container.clientWidth / 640;
			width = Math.max(width, _img.width * 0.7);
			width = Math.min(width, _img.width * 1.2);
			
			height = width * _img.height / _img.width;
			
			css.style(_logo, {
				width: width + 'px',
				height: height + 'px'
			});
		};
		
		_init();
	};
	
	components.logo.positions = positions;
})(playease);

(function(playease) {
	var utils = playease.utils,
		css = utils.css,
		events = playease.events,
		core = playease.core,
		components = core.components,
		
		FEATURED_CLASS = 'pe-featured';
	
	components.contextmenu = function(layer, config) {
		var _this = utils.extend(this, new events.eventdispatcher('components.contextmenu')),
			_defaults = {
				items: []
			},
			_info = {
				icon: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAMAAAC6V+0/AAAABGdBTUEAALGPC/xhBQAAAAFzUkdCAK7OHOkAAAA2UExURebm5ubm5ubm5ubm5ubm5ubm5ubm5kxpcebm5ubm5ubm5ubm5ubm5ubm5ubm5ubm5ubm5ubm5rnvS8UAAAASdFJOU/9GGpAEVa0AOw0vovB5tnDaudiwhIIAAACiSURBVBjTXZHbAsQQDERDkQS97P//7GaibLfzgJxgIoiHVHIWvQPysRZylbpg2mhpSwOmgx46kkPf10KMoflewGqLLsNBugXVIDxuZhRuTGrJZmHIXhBuUEIuMC7pJ3I4R9nGyHzCY2eONmWHesMyoQyI3BXncRgZ1M+16zJCSbMRqyT4LriKt2calP9nWkMM7q+GcEo/OFvnGrDIo/Ov7/gCDPoHpWEsixcAAAAASUVORK5CYII=',
				text: 'PLAYEASE ' + playease.version,
				link: 'http://studease.cn/playease',
				target: '_blank'
			},
			_container,
			_logo,
			_img,
			_loaded = false;
		
		function _init() {
			_this.config = utils.extend({}, _defaults, config);
			
			_this.config.items = [_info].concat(_this.config.items);
			
			var flashVersion = utils.getFlashVersion();
			if (flashVersion) {
				_this.config.items.push({
					text: 'Flash Version ' + flashVersion,
					link: 'http://get.adobe.com/cn/flashplayer/about/',
					target: '_blank'
				});
			}
			
			_container = utils.createElement('ul');
			
			for (var i = 0; i < _this.config.items.length; i++) {
				var item = _this.config.items[i];
				
				var a = utils.createElement('a');
				if (item.link) {
					a.href = item.link;
				}
				if (item.target) {
					a.target = item.target;
				}
				if (item.text) {
					a.innerText = item.text;
				}
				if (item.icon) {
					var span = utils.createElement('span');
					a.insertAdjacentElement('afterbegin', span);
					
					css.style(span, {
						background: 'url(' + item.icon + ') no-repeat center left'
					});
				}
				
				var li = utils.createElement('li', item.icon ? FEATURED_CLASS : '');
				li.appendChild(a);
				
				_container.appendChild(li);
			}
			
			layer.appendChild(_container);
		}
		
		_this.show = function(offsetX, offsetY) {
			css.style(layer, {
				left: offsetX + 'px',
				top: offsetY + 'px',
				display: 'block'
			});
		};
		
		_this.hide = function() {
			css.style(layer, {
				display: 'none'
			});
		};
		
		
		_this.element = function() {
			return _container;
		};
		
		_this.resize = function(width, height) {
			
		};
		
		_init();
	};
})(playease);

(function(playease) {
	var utils = playease.utils,
		core = playease.core,
		renders = core.renders,
		priority = renders.priority;
	
	utils.playlist = function(sources, prior) {
		var _this = this;
		
		function _init() {
			_this.index = 0;
			_this.sources = sources;
			_this.prior = prior;
		}
		
		_this.format = function() {
			var array = _this.sources.splice(0, _this.sources.length);
			
			for (var i = 0; i < array.length; i++) {
				var item = array[i];
				if (!item || !item.file) {
					continue;
				}
				
				var name = _this.getSupported(item.file, item.type || _this.prior);
				if (name) {
					_this.sources.push({
						file: item.file,
						type: name,
						label: item.label || _this.sources.length
					});
				}
			}
		};
		
		_this.getSupported = function(file, prior) {
			if (prior) {
				var render = renders[prior];
				if (render && render.isSupported(file)) {
					return prior;
				}
			}
			
			for (var i = 0; i < priority.length; i++) {
				var name = priority[i];
				var render = renders[name];
				if (render && render.isSupported(file)) {
					return name;
				}
			}
			
			return null;
		};
		
		_this.addItem = function(file, prior, label) {
			if (!file) {
				return null;
			}
			
			for (var i = 0; i < _this.sources.length; i++) {
				var item = _this.sources[i];
				if (item.file === file) {
					return item;
				}
			}
			
			var name = _this.getSupported(file, prior || _this.prior);
			if (name) {
				var item = {
					file: file,
					type: name,
					label: label || _this.sources.length
				};
				
				_this.sources.push(item);
				
				return item;
			}
			
			return null;
		};
		
		_this.getItemAt = function(index) {
			if (index < 0 || index >= _this.sources.length) {
				return null;
			}
			
			return _this.sources[index];
		};
		
		_this.activeItemAt = function(index) {
			if (index < 0 || index >= _this.sources.length) {
				return false;
			}
			
			_this.index = index;
			
			return true;
		};
		
		_this.activeNextItem = function() {
			if (!_this.sources || !_this.sources.length) {
				return false;
			}
			
			_this.index++;
			if (_this.index == _this.sources.length) {
				_this.index = 0;
			}
			
			return true;
		};
		
		_this.getNextItem = function() {
			if (_this.activeNextItem()) {
				return _this.sources[_this.index];
			}
			
			return null;
		};
		
		_init();
	};
})(playease);

(function(playease) {
	var utils = playease.utils,
		events = playease.events,
		core = playease.core;
	
	core.entity = function(config) {
		var _this = utils.extend(this, new events.eventdispatcher('core.entity')),
			_model,
			_view,
			_controller;
		
		function _init() {
			_this.id = config.id;
			
			_this.model = _model = new core.model(config);
			_this.view = _view = new core.view(_model);
			_this.controller = _controller = new core.controller(_model, _view);
			
			_controller.addGlobalListener(_forward);
			
			_initializeAPI();
		}
		
		function _initializeAPI() {
			_this.onSWFState = _view.onSWFState;
			
			_this.play = _controller.play;
			_this.pause = _controller.pause;
			_this.reload = _controller.reload;
			_this.seek = _controller.seek;
			_this.stop = _controller.stop;
			_this.report = _controller.report;
			_this.mute = _controller.mute;
			_this.volume = _controller.volume;
			_this.hd = _controller.hd;
			_this.bullet = _controller.bullet;
			_this.fullpage = _controller.fullpage;
			_this.fullscreen = _controller.fullscreen;
			
			_this.getState = _model.getState;
			
			_this.shoot = _view.shoot;
			_this.resize = _view.resize;
		}
		
		_this.setup = function() {
			setTimeout(function() {
				_controller.setup();
			});
		};
		
		function _forward(e) {
			_this.dispatchEvent(e.type, e);
		}
		
		_this.destroy = function() {
			if (_controller) {
				_controller.stop();
			}
			if (_view) {
				_view.destroy();
			}
			if (_model) {
				_model.destroy();
			}
		};
		
		_init();
	};
})(playease);

(function(playease) {
	var utils = playease.utils,
		events = playease.events,
		core = playease.core,
		states = core.states;
	
	core.model = function(config) {
		 var _this = utils.extend(this, new events.eventdispatcher('core.model')),
		 	_defaults = {},
		 	_state = states.STOPPED,
		 	_playlist,
		 	_properties;
		
		function _init() {
			_this.config = utils.extend({}, _defaults, config);
			
			_playlist = new utils.playlist(_this.config.sources, _this.config.render.name);
			_playlist.format();
			_playlist.addItem(_this.config.file);
			
			_properties = {
				ratio: _this.config.width / (_this.config.height - 40),
				playlist: _playlist,
				duration: 0,
				muted: false,
				volume: 80,
				videooff: false,
				bullet: _this.config.bulletscreen.enable,
				fullpage: false,
				fullscreen: false
			};
		}
		
		_this.setState = function(state) {
			if (state === _state) {
				return;
			}
			_state = state;
			_this.dispatchEvent(events.PLAYEASE_STATE, { state: state });
		};
		
		_this.getState = function() {
			return _state;
		};
		
		_this.setProperty = function(key, value) {
			if (_properties.hasOwnProperty(key) == true) {
				_properties[key] = value;
				_this.dispatchEvent(events.PLAYEASE_PROPERTY, { key: key, value: value });
			}
		};
		
		_this.getProperty = function(key) {
			return _properties[key];
		};
		
		_this.getConfig = function(name) {
			return _this.config[name];
		};
		
		_this.destroy = function() {
			
		};
		
		_init();
	};
})(playease);

(function(playease) {
	var utils = playease.utils,
		events = playease.events,
		core = playease.core,
		states = core.states,
		renders = core.renders,
		rendertypes = renders.types,
		priority = renders.priority,
		components = core.components,
		skins = core.skins,
		
		WRAP_CLASS = 'pe-wrapper',
		SKIN_CLASS = 'pe-skin',
		RENDER_CLASS = 'pe-render',
		CONTROLS_CLASS = 'pe-controls',
		CONTEXTMENU_CLASS = 'pe-contextmenu';
	
	core.view = function(model) {
		var _this = utils.extend(this, new events.eventdispatcher('core.view')),
			_wrapper,
			_renderLayer,
			_controlsLayer,
			_contextmenuLayer,
			_controlbar,
			_poster,
			_bulletscreen,
			_display,
			_logo,
			_contextmenu,
			_renders,
			_render,
			_skin,
			_canvas,
			_video,
			_timer,
			_autohidetimer,
			_previousClick = 0,
			_errorOccurred = false;
		
		function _init() {
			_wrapper = utils.createElement('div', WRAP_CLASS + ' ' + SKIN_CLASS + '-' + model.getConfig('skin').name + (model.getConfig('mode') === 'vod' ? ' vod' : ''));
			_wrapper.id = model.getConfig('id');
			//_wrapper.tabIndex = 0;
			
			_renderLayer = utils.createElement('div', RENDER_CLASS);
			_controlsLayer = utils.createElement('div', CONTROLS_CLASS);
			_contextmenuLayer = utils.createElement('div', CONTEXTMENU_CLASS);
			
			_wrapper.appendChild(_renderLayer);
			_wrapper.appendChild(_controlsLayer);
			_wrapper.appendChild(_contextmenuLayer);
			
			model.addEventListener(events.PLAYEASE_STATE, _modelStateHandler);
			
			_initComponents();
			_initRenders();
			_initSkin();
			
			_wrapper.oncontextmenu = function(e) {
				e = e || window.event;
				e.preventDefault ? e.preventDefault() : e.returnValue = false;
				return false;
			};
			
			try {
				window.addEventListener('resize', _onResize);
				_wrapper.addEventListener('keydown', _onKeyDown);
				_wrapper.addEventListener('mousedown', _onMouseDown);
				document.addEventListener('mousedown', _onMouseDown);
				_renderLayer.addEventListener('click', _onRenderClick);
			} catch (err) {
				window.attachEvent('onresize', _onResize);
				_wrapper.attachEvent('onkeydown', _onKeyDown);
				_wrapper.attachEvent('onmousedown', _onMouseDown);
				document.attachEvent('onmousedown', _onMouseDown);
				_renderLayer.attachEvent('onclick', _onRenderClick);
			}
			
			var replace = document.getElementById(model.getConfig('id'));
			replace.parentNode.replaceChild(_wrapper, replace);
		}
		
		function _modelStateHandler(e) {
			utils.removeClass(_wrapper, [states.BUFFERING, states.PLAYING, states.PAUSED, states.STOPPED, states.ERROR]);
			if (e.state != states.STOPPED) {
				utils.addClass(_wrapper, e.state);
			}
		}
		
		function _initComponents() {
			// controlbar
			var cbcfg = {
				report: model.getConfig('report'),
				playlist: model.getProperty('playlist'),
				bulletscreen: model.getConfig('bulletscreen')
			};
			
			try {
				_controlbar = new components.controlbar(_controlsLayer, cbcfg);
				_controlbar.addGlobalListener(_forward);
				
				_controlbar.setVolume(model.getProperty('volume'));
			} catch (err) {
				utils.log('Failed to init "controlbar" component!');
			}
			
			// poster
			var ptcfg = {
				url: model.getConfig('poster'),
				width: model.getConfig('width'),
				height: model.getConfig('height') - 40
			};
			
			try {
				_poster = new components.poster(ptcfg);
				_poster.addGlobalListener(_forward);
				
				_renderLayer.appendChild(_poster.element());
			} catch (err) {
				utils.log('Failed to init "poster" component!');
			}
			
			// bulletscreen
			var bscfg = utils.extend({}, model.getConfig('bulletscreen'), {
				width: model.getConfig('width'),
				height: model.getConfig('height') - 40
			});
			
			try {
				_bulletscreen = new components.bulletscreen(bscfg);
				_bulletscreen.addGlobalListener(_forward);
				
				_canvas = _bulletscreen.element();
				_renderLayer.appendChild(_canvas);
			} catch (err) {
				utils.log('Failed to init "bulletscreen" component!');
			}
			
			// display
			var dicfg = utils.extend({}, model.getConfig('display'), {
				id: model.getConfig('id') + '-display'
			});
			
			try {
				_display = new components.display(dicfg);
				_display.addGlobalListener(_forward);
				
				_renderLayer.appendChild(_display.element());
			} catch (err) {
				utils.log('Failed to init "display" component!');
			}
			
			// logo
			var lgcfg = utils.extend({}, model.getConfig('logo'), {
				width: model.getConfig('width'),
				height: model.getConfig('height') - 40
			});
			
			try {
				_logo = new components.logo(lgcfg);
				
				_renderLayer.appendChild(_logo.element());
			} catch (err) {
				utils.log('Failed to init "logo" component!');
			}
			
			// contextmenu
			var ctxcfg = utils.extend({}, model.getConfig('contextmenu'));
			
			try {
				_contextmenu = new components.contextmenu(_contextmenuLayer, ctxcfg);
				_contextmenu.addGlobalListener(_forward);
			} catch (err) {
				utils.log('Failed to init "contextmenu" component!');
			}
		}
		
		function _initRenders() {
			var cfg = utils.extend({}, model.getConfig('render'), {
				id: model.getConfig('id'),
				width: model.getConfig('width'),
				height: model.getConfig('height') - 40,
				aspectratio: model.getConfig('aspectratio'),
				playlist: model.getProperty('playlist'),
				mode: model.getConfig('mode'),
				bufferTime: model.getConfig('bufferTime'),
				muted: model.getProperty('muted'),
				volume: model.getProperty('volume'),
				autoplay: model.getConfig('autoplay'),
				airplay: model.getConfig('airplay'),
				playsinline: model.getConfig('playsinline'),
				poster: model.getConfig('poster'),
				loader: model.getConfig('loader')
			});
			
			_renders = {};
			
			for (var i = 0; i < priority.length; i++) {
				var name = priority[i];
				try {
					var render = new renders[name](_renderLayer, cfg);
					_renders[name] = render;
					
					utils.log('Render "' + name + '" initialized.');
				} catch (err) {
					utils.log('Failed to init render "' + name + '"!');
				}
			}
			
			var playlist = model.getProperty('playlist');
			for (var j = 0; j < playlist.sources.length; j++) {
				var name = playlist.sources[j].type;
				if (_renders.hasOwnProperty(name)) {
					_this.activeRender(name);
					break;
				}
			}
		}
		
		_this.activeRender = function(name) {
			if (_render && _render.name == name || _renders.hasOwnProperty(name) == false) {
				return;
			}
			
			if (_render) {
				_render.stop();
				_stopTimer();
				
				_render.removeEventListener(events.PLAYEASE_READY, _forward);
				_render.removeEventListener(events.PLAYEASE_STATE, _forward);
				_render.removeEventListener(events.PLAYEASE_DURATION, _forward);
				_render.removeEventListener(events.PLAYEASE_RENDER_ERROR, _onRenderError);
				
				_renderLayer.removeChild(_render.element());
			}
			
			_render = _this.render = _renders[name];
			_render.addEventListener(events.PLAYEASE_READY, _forward);
			_render.addEventListener(events.PLAYEASE_STATE, _forward);
			_render.addEventListener(events.PLAYEASE_DURATION, _forward);
			_render.addEventListener(events.PLAYEASE_RENDER_ERROR, _onRenderError);
			
			_video = _render.element();
			_renderLayer.appendChild(_video);
			
			_this.videoOff(model.getProperty('videooff'), name == rendertypes.DASH);
			_this.setup();
			
			utils.log('Actived render "' + _render.name + '".');
		};
		
		function _initSkin() {
			var cfg = utils.extend({}, model.getConfig('skin'), {
				id: model.getConfig('id'),
				width: model.getConfig('width'),
				height: model.getConfig('height')
			});
			
			try {
				_skin = new skins[cfg.name](cfg);
			} catch (err) {
				utils.log('Failed to init skin ' + cfg.name + '!');
			}
		}
		
		_this.setup = function() {
			// Ignore components & skin failure.
			if (!_render) {
				_this.dispatchEvent(events.PLAYEASE_SETUP_ERROR, { message: 'Render not available!', name: model.getConfig('render').name });
				return;
			}
			
			_render.setup();
			_this.resize();
		};
		
		_this.play = function(url) {
			if (_render) {
				_render.play(url);
			}
			
			_startTimer();
		};
		
		_this.pause = function() {
			if (_render) {
				_render.pause();
			}
		};
		
		_this.reload = function(url) {
			_this.stop();
			setTimeout(function() {
				_this.play(url);
			}, 100);
		};
		
		_this.seek = function(offset) {
			_controlbar.setPosition(offset);
			
			if (_render) {
				_render.seek(offset);
			}
			
			_startTimer();
		};
		
		_this.stop = function() {
			if (_render) {
				_render.stop();
			}
			
			_stopTimer();
			
			_controlbar.setBuffered(0);
			_controlbar.setPosition(0);
			_controlbar.setElapsed(0);
			_controlbar.setDuration(0);
		};
		
		_this.report = function() {
			
		};
		
		_this.mute = function(muted) {
			_controlbar.setMuted(muted, model.getProperty('volume'));
			
			if (_render) {
				_render.mute(muted);
				_this.dispatchEvent(events.PLAYEASE_MUTE, { muted: muted });
			}
		};
		
		_this.volume = function(vol) {
			_controlbar.setVolume(vol);
			
			if (_render) {
				_render.volume(vol);
				_this.dispatchEvent(events.PLAYEASE_VOLUME, { volume: vol });
			}
		};
		
		_this.videoOff = function(off) {
			var enable = _render && _render.name == rendertypes.DASH;
			_controlbar.setVideoOff(off, enable);
			
			if (enable) {
				var state = model.getState();
				var playing = state != states.STOPPED && state != states.ERROR;
				_render.videoOff(off, playing);
			}
		};
		
		_this.hd = function(index, label) {
			_controlbar.activeHDItem(index, label);
		};
		
		_this.bullet = function(bullet) {
			_controlbar.setBullet(bullet);
			_bulletscreen.setProperty('enable', bullet);
		};
		
		_this.fullpage = function(exit) {
			if (document.fullscreen || document.webkitIsFullScreen || document.mozFullScreen || document.msFullscreenElement) {
				document.exitFullscreen = document.exitFullscreen || document.webkitCancelFullScreen || document.mozCancelFullScreen || document.msExitFullscreen;
				if (!document.exitFullscreen) {
					return;
				}
				
				document.exitFullscreen();
			}
			
			utils.removeClass(_wrapper, 'fs');
			model.setProperty('fullscreen', false);
			
			if (exit) {
				utils.removeClass(_wrapper, 'fp');
			} else {
				utils.addClass(_wrapper, 'fp');
			}
			
			if (_autohidetimer) {
				_autohidetimer.stop();
			}
			_controlsLayer.style.display = 'block';
			
			try {
				_wrapper.removeEventListener('mousemove', _onMouseMove);
			} catch (err) {
				_wrapper.detachEvent('onmousemove', _onMouseMove);
			}
			
			model.setProperty('fullpage', !exit);
			_this.resize();
			
			_this.dispatchEvent(events.PLAYEASE_VIEW_FULLPAGE, { exit: exit });
		};
		
		_this.fullscreen = function(exit) {
			if (exit) {
				document.exitFullscreen = document.exitFullscreen || document.webkitCancelFullScreen || document.mozCancelFullScreen || document.msExitFullscreen;
				if (document.exitFullscreen) {
					document.exitFullscreen();
				} else {
					_this.dispatchEvent(events.PLAYEASE_VIEW_FULLPAGE, { exit: exit });
				}
				
				utils.removeClass(_wrapper, 'fs');
				
				if (_autohidetimer) {
					_autohidetimer.stop();
				}
				try {
					_wrapper.removeEventListener('mousemove', _onMouseMove);
				} catch (err) {
					_wrapper.detachEvent('onmousemove', _onMouseMove);
				}
			} else {
				_wrapper.requestFullscreen = _wrapper.requestFullscreen || _wrapper.webkitRequestFullScreen || _wrapper.mozRequestFullScreen || _wrapper.msRequestFullscreen;
				if (_wrapper.requestFullscreen) {
					_wrapper.requestFullscreen();
				} else {
					_this.dispatchEvent(events.PLAYEASE_VIEW_FULLPAGE, { exit: exit });
				}
				
				utils.addClass(_wrapper, 'fs');
				
				if (_autohidetimer) {
					_autohidetimer.start();
				}
				try {
					_wrapper.addEventListener('mousemove', _onMouseMove);
				} catch (err) {
					_wrapper.attachEvent('onmousemove', _onMouseMove);
				}
			}
			
			_controlsLayer.style.display = 'block';
			
			model.setProperty('fullscreen', !exit);
			_this.resize();
			
			_this.dispatchEvent(events.PLAYEASE_VIEW_FULLSCREEN, { exit: exit });
		};
		
		_this.setDuration = function(duration) {
			if (!duration || isNaN(duration) || duration == Infinity) {
				utils.removeClass(_wrapper, 'vod');
			} else {
				utils.addClass(_wrapper, 'vod');
			}
			
			_controlbar.setDuration(duration);
		};
		
		_this.shoot = function(text) {
			if (_bulletscreen) {
				_bulletscreen.shoot(text);
			}
		};
		
		
		function _startTimer() {
			if (!_timer) {
				_timer = new utils.timer(500);
				_timer.addEventListener(events.PLAYEASE_TIMER, _updateTime);
			}
			_timer.start();
		}
		
		function _stopTimer() {
			if (_timer) {
				_timer.stop();
			}
		}
		
		function _updateTime(e) {
			if (!_render || !_render.getRenderInfo) {
				return;
			}
			
			var data = _render.getRenderInfo();
			var position = Math.floor((data.duration ? data.position / data.duration : 0) * 10000) / 100;
			
			_controlbar.setBuffered(data.buffered);
			_controlbar.setPosition(position);
			_controlbar.setElapsed(data.position);
			_controlbar.setDuration(data.duration);
		}
		
		function _onMouseMove(e) {
			_controlsLayer.style.display = 'block';
			
			if (!_autohidetimer) {
				_autohidetimer = new utils.timer(3000, 1);
				_autohidetimer.addEventListener(events.PLAYEASE_TIMER, _autoHideControlBar);
			}
			_autohidetimer.start();
		}
		
		function _autoHideControlBar(e) {
			_controlsLayer.style.display = 'none';
		}
		
		function _onKeyDown(e) {
			if (e.ctrlKey || e.metaKey) {
				return true;
			}
			
			switch (e.keyCode) {
				case 13: // enter
					
					break;
				case 32: // space
					
					break;
				default:
					break;
			}
			
			if (/13|32/.test(e.keyCode)) {
				// Prevent keypresses from scrolling the screen
				e.preventDefault ? e.preventDefault() : e.returnValue = false;
				return false;
			}
		}
		
		function _onMouseDown(e) {
			if (!_contextmenu) {
				return;
			}
			
			if (e.currentTarget == undefined) {
				for (var node = e.srcElement; node; node = node.offsetParent) {
					if (node == _wrapper) {
						e.currentTarget = _wrapper;
						break;
					}
				}
			}
			
			if (e.button == (utils.isMSIE(8) ? 1 : 0) || e.currentTarget != _wrapper) {
				setTimeout(function() {
					_contextmenu.hide();
				}, 100);
			} else if (e.button == 2) {
				var offsetX = 0;
				var offsetY = 0;
				
				for (var node = e.srcElement; node && node != _wrapper; node = node.offsetParent) {
					offsetX += node.offsetLeft;
					offsetY += node.offsetTop;
				}
				
				_contextmenu.show(e.offsetX + offsetX, e.offsetY + offsetY);
				
				e.preventDefault ? e.preventDefault() : e.returnValue = false;
				e.stopPropagation ? e.stopPropagation() : e.cancelBubble = true;
				
				return false;
			}
		}
		
		function _onRenderClick(e) {
			var date = new Date();
			var time = date.getTime();
			if (time <= _previousClick + 700) {
				var fs = model.getProperty('fullscreen');
				_this.dispatchEvent(events.PLAYEASE_VIEW_FULLSCREEN, { exit: fs });
				return; // Avoid triple click
			}
			
			_previousClick = time;
		}
		
		
		_this.onSWFState = function(e) {
			utils.log('onSWFState: ' + e.state);
			_this.dispatchEvent(events.PLAYEASE_STATE, { state: e.state });
		};
		
		_this.display = function(state, message) {
			if (_display) {
				_display.show(state, message);
			}
		};
		
		function _onResize(e) {
			_this.resize();
		}
		
		_this.resize = function(width, height) {
			setTimeout(function() {
				var fp = model.getProperty('fullpage');
				var fs = model.getProperty('fullscreen');
				
				width = _renderLayer.clientWidth;
				height = model.getConfig('height');
				
				if (fs || fp) {
					height = _wrapper.clientHeight;
				}
				
				if (!fs) {
					height -= 40;
				}
				
				var ratio = model.getConfig('aspectratio');
				if (ratio && !fp && !fs) {
					var arr = ratio.match(/(\d+)\:(\d+)/);
					if (arr && arr.length > 2) {
						var w = parseInt(arr[1]);
						var h = parseInt(arr[2]);
						height = width * h / w;
					}
				}
				
				_controlbar.resize(width, height);
				_poster.resize(width, height);
				_bulletscreen.resize(width, height);
				_logo.resize(width, height);
				_contextmenu.resize(width, height);
				
				if (_render) {
					_render.resize(width, height);
				}
			});
		};
		
		_this.destroy = function() {
			if (_wrapper) {
				try {
					window.removeEventListener('resize', _onResize);
					_wrapper.removeEventListener('keydown', _onKeyDown);
				} catch (err) {
					window.detachEvent('onresize', _onResize);
					_wrapper.detachEvent('onkeydown', _onKeyDown);
				}
			}
			if (_render) {
				_render.destroy();
			}
		};
		
		function _onRenderError(e) {
			_stopTimer();
			_forward(e);
		}
		
		function _forward(e) {
			_this.dispatchEvent(e.type, e);
		}
		
		_init();
	};
})(playease);

(function(playease) {
	var utils = playease.utils,
		events = playease.events,
		core = playease.core,
		states = core.states;
	
	core.controller = function(model, view) {
		var _this = utils.extend(this, new events.eventdispatcher('core.controller')),
			_ready = false,
			_urgent,
			_timer,
			_retrycount = 0;
		
		function _init() {
			model.addEventListener(events.PLAYEASE_STATE, _modelStateHandler);
			
			view.addEventListener(events.PLAYEASE_READY, _onReady);
			view.addEventListener(events.PLAYEASE_SETUP_ERROR, _onSetupError);
			
			view.addEventListener(events.PLAYEASE_STATE, _renderStateHandler);
			
			view.addEventListener(events.PLAYEASE_VIEW_PLAY, _onPlay);
			view.addEventListener(events.PLAYEASE_VIEW_PAUSE, _onPause);
			view.addEventListener(events.PLAYEASE_VIEW_RELOAD, _onReload);
			view.addEventListener(events.PLAYEASE_VIEW_SEEK, _onSeek);
			view.addEventListener(events.PLAYEASE_VIEW_STOP, _onStop);
			view.addEventListener(events.PLAYEASE_VIEW_REPORT, _onReport);
			view.addEventListener(events.PLAYEASE_VIEW_MUTE, _onMute);
			view.addEventListener(events.PLAYEASE_VIEW_VOLUME, _onVolume);
			view.addEventListener(events.PLAYEASE_VIEW_VIDEOOFF, _onVideoOff);
			view.addEventListener(events.PLAYEASE_VIEW_HD, _onHD);
			view.addEventListener(events.PLAYEASE_VIEW_BULLET, _onBullet);
			view.addEventListener(events.PLAYEASE_VIEW_FULLPAGE, _onFullpage);
			view.addEventListener(events.PLAYEASE_VIEW_FULLSCREEN, _onFullscreen);
			
			view.addEventListener(events.PLAYEASE_DURATION, _onDuration);
			view.addEventListener(events.PLAYEASE_RENDER_ERROR, _onRenderError);
		}
		
		function _modelStateHandler(e) {
			view.display(e.state, '');
			
			switch (e.state) {
				case states.BUFFERING:
					_this.dispatchEvent(events.PLAYEASE_BUFFERING);
					break;
				case states.PLAYING:
					_this.dispatchEvent(events.PLAYEASE_PLAYING);
					break;
				case states.PAUSED:
					_this.dispatchEvent(events.PLAYEASE_PAUSED);
					break;
				case states.STOPPED:
					_this.dispatchEvent(events.PLAYEASE_STOPPED);
					break;
				case states.ERROR:
					_retry();
					break;
				default:
					_this.dispatchEvent(events.ERROR, { message: 'Unknown model state!', state: e.state });
					break;
			}
		}
		
		function _onReady(e) {
			if (!_ready) {
				utils.log('Player ready!');
				
				var playlist = model.getProperty('playlist');
				var item = playlist.getItemAt(playlist.index);
				view.hd(playlist.index, item.label);
				
				_ready = true;
				_forward(e);
				
				if (model.getConfig('autoplay') || _urgent) {
					_this.play(_urgent);
				}
				
				window.onbeforeunload = function(ev) {
					
				};
			}
		}
		
		_this.setup = function(e) {
			if (!_ready) {
				view.setup();
			}
		};
		
		_this.play = function(url) {
			playease.api.displayError('', model.config);
			
			if (!_ready) {
				_this.dispatchEvent(events.ERROR, { message: 'Player is not ready yet!' });
				return;
			}
			
			var playlist = model.getProperty('playlist');
			
			var type = view.render.name;
			if (url == undefined) {
				var item = playlist.getItemAt(playlist.index);
				if (!item) {
					_this.dispatchEvent(events.ERROR, { message: 'Failed to get playlist item at ' + playlist.index + '!' });
					return;
				}
				
				url = item.file;
				type = item.type;
			}
			
			var render = core.renders[type];
			if (render == undefined || render.isSupported(url) == false) {
				type = playlist.getSupported(url);
				if (!type) {
					_this.dispatchEvent(events.PLAYEASE_RENDER_ERROR, { message: 'No supported render found!' });
					return;
				}
			}
			
			if (view.render.name != type) {
				_ready = false;
				_urgent = url;
				view.activeRender(type);
				return;
			}
			
			view.play(url);
		};
		
		_this.pause = function() {
			view.pause();
		};
		
		_this.reload = function() {
			playease.api.displayError('', model.config);
			
			if (!_ready) {
				_this.dispatchEvent(events.ERROR, { message: 'Player is not ready yet!' });
				return;
			}
			
			var playlist = model.getProperty('playlist');
			
			var url = _urgent;
			var type = view.render.name;
			
			if (url == undefined) {
				var item = playlist.getItemAt(playlist.index);
				if (!item) {
					_this.dispatchEvent(events.ERROR, { message: 'Failed to get playlist item at ' + playlist.index + '!' });
					return;
				}
				
				url = item.file;
				type = item.type;
			}
			
			var render = core.renders[type];
			if (render == undefined || render.isSupported(url) == false) {
				type = playlist.getSupported(url);
				if (!type) {
					_this.dispatchEvent(events.PLAYEASE_RENDER_ERROR, { message: 'No supported render found!' });
					return;
				}
			}
			
			if (view.render.name != type) {
				_ready = false;
				view.activeRender(type);
				return;
			}
			
			view.reload(url);
		};
		
		_this.seek = function(offset) {
			if (!_ready) {
				_this.dispatchEvent(events.ERROR, { message: 'Player is not ready yet!' });
				return;
			}
			
			view.seek(offset);
		};
		
		_this.stop = function() {
			_urgent = undefined;
			view.stop();
		};
		
		_this.report = function() {
			view.report();
		};
		
		_this.mute = function() {
			var muted = model.getProperty('muted');
			
			model.setProperty('muted', !muted);
			view.mute(!muted);
		};
		
		_this.volume = function(vol) {
			if (vol == 0) {
				model.setProperty('muted', true);
			}
			
			model.setProperty('volume', vol);
			view.volume(vol);
		};
		
		_this.videoOff = function(off) {
			var off = model.getProperty('videooff');
			model.setProperty('videooff', !off);
			view.videoOff(!off);
		};
		
		_this.hd = function(index) {
			var playlist = model.getProperty('playlist');
			if (utils.typeOf(playlist.sources) !== 'array' || index >= playlist.sources.length) {
				return;
			}
			
			if (playlist.activeItemAt(index) == false) {
				return;
			}
			
			var item = playlist.getItemAt(playlist.index);
			view.hd(playlist.index, item.label);
			
			_this.play();
		};
		
		_this.bullet = function() {
			var bullet = model.getProperty('bullet');
			model.setProperty('bullet', !bullet);
			view.bullet(!bullet);
		};
		
		_this.fullpage = function(exit) {
			view.fullpage(exit);
		}
		_this.fullscreen = function(exit) {
			view.fullscreen(exit);
		};
		
		
		function _retry() {
			if (model.config.maxretries < 0 || _retrycount < model.config.maxretries) {
				var delay = Math.ceil(model.config.retrydelay + Math.random() * 5000);
				
				utils.log('Retry delay ' + delay / 1000 + 's ...');
				
				_retrycount++;
				_startTimer(delay);
			}
		}
		
		function _startTimer(delay) {
			if (!_timer) {
				_timer = new utils.timer(delay, 1);
				_timer.addEventListener(events.PLAYEASE_TIMER, function(e) {
					_this.play();
				});
			}
			_timer.delay = delay;
			_timer.reset();
			_timer.start();
		}
		
		function _stopTimer() {
			if (_timer) {
				_timer.stop();
			}
		}
		
		
		function _renderStateHandler(e) {
			model.setState(e.state);
			_forward(e);
		}
		
		function _onPlay(e) {
			_this.play(_urgent);
			_forward(e);
		}
		
		function _onPause(e) {
			_this.pause();
			_forward(e);
		}
		
		function _onReload(e) {
			_this.reload();
			_forward(e);
		}
		
		function _onSeek(e) {
			var state = model.getState();
			if (state != states.STOPPED && state != states.ERROR) {
				_this.seek(e.offset);
				_forward(e);
			}
		}
		
		function _onStop(e) {
			_this.stop();
			_forward(e);
		}
		
		function _onReport(e) {
			_this.report();
			_this.dispatchEvent(events.PLAYEASE_REPORT, e);
		}
		
		function _onMute(e) {
			_this.mute();
			_this.dispatchEvent(events.PLAYEASE_MUTE, e);
		}
		
		function _onVolume(e) {
			_this.volume(e.volume);
			_this.dispatchEvent(events.PLAYEASE_VOLUME, e);
		}
		
		function _onVideoOff(e) {
			_this.videoOff();
			_this.dispatchEvent(events.PLAYEASE_VIDEOOFF, e);
		}
		
		function _onHD(e) {
			_this.hd(e.index);
			_this.dispatchEvent(events.PLAYEASE_HD, e);
		}
		
		function _onBullet(e) {
			_this.bullet();
			_this.dispatchEvent(events.PLAYEASE_BULLET, e);
		}
		
		function _onFullpage(e) {
			var fp = model.getProperty('fullpage');
			if (e.exit == !fp) {
				return;
			}
			
			_this.fullpage(fp);
			_this.dispatchEvent(events.PLAYEASE_FULLPAGE, e);
		}
		
		function _onFullscreen(e) {
			var fs = model.getProperty('fullscreen');
			if (e.exit == !fs) {
				return;
			}
			
			_this.fullscreen(fs);
			_this.dispatchEvent(events.PLAYEASE_FULLSCREEN, e);
		}
		
		function _onSetupError(e) {
			model.setState(states.ERROR);
			view.display(states.ERROR, e.message);
			
			_this.stop();
			_forward(e);
		}
		
		function _onDuration(e) {
			model.setProperty('duration', e.duration);
			view.setDuration(e.duration);
			
			_forward(e);
		}
		
		function _onRenderError(e) {
			model.setState(states.ERROR);
			view.display(states.ERROR, e.message);
			
			_this.stop();
			_forward(e);
		}
		
		function _forward(e) {
			_this.dispatchEvent(e.type, e);
		}
		
		_init();
	};
})(playease);

(function(playease) {
	var utils = playease.utils,
		events = playease.events,
		renderModes = playease.core.renders.modes;
	
	var embed = playease.embed = function(api) {
		var _this = utils.extend(this, new events.eventdispatcher('embed')),
			_config = {},
			_errorOccurred = false,
			_embedder = null;
		
		function _init() {
			utils.foreach(api.config.events, function(e, cb) {
				var fn = api[e];
				if (utils.typeOf(fn) === 'function') {
					fn.call(api, cb);
				}
			});
		}
		
		_this.embed = function() {
			try {
				_config = new embed.config(api.config);
				_embedder = new embed.embedder(api, _config);
			} catch (e) {
				utils.log('Failed to init embedder!');
				_this.dispatchEvent(events.PLAYEASE_SETUP_ERROR, { message: 'Failed to init embedder!', render: _config.render.name });
				return;
			}
			_embedder.addGlobalListener(_onEvent);
			_embedder.embed();
		};
		
		_this.errorScreen = function(message) {
			if (_errorOccurred) {
				return;
			}
			
			_errorOccurred = true;
			playease.api.displayError(message, _config);
		};
		
		_this.clearScreen = function() {
			_errorOccurred = false;
			playease.api.displayError('', _config);
		};
		
		function _onEvent(e) {
			switch (e.type) {
				case events.ERROR:
				case events.PLAYEASE_SETUP_ERROR:
				case events.PLAYEASE_RENDER_ERROR:
				case events.PLAYEASE_ERROR:
					utils.log('[ERROR] ' + e.message);
					_this.errorScreen(e.message);
					_this.dispatchEvent(events.ERROR, e);
					break;
					
				case events.PLAYEASE_VIEW_PLAY:
				case events.PLAYEASE_VIEW_RELOAD:
				case events.PLAYEASE_VIEW_SEEK:
					_this.clearScreen();
					break;
					
				default:
					_forward(e);
					break;
			}
		}
		
		function _forward(e) {
			_this.dispatchEvent(e.type, e);
		}
		
		_init();
	};
})(playease);

(function(playease) {
	var utils = playease.utils,
		events = playease.events,
		embed = playease.embed,
		io = playease.io,
		iomodes = io.modes,
		credentials = io.credentials,
		caches = io.caches,
		redirects = io.redirects,
		core = playease.core,
		alphas = core.components.bulletscreen.alphas,
		positions = core.components.bulletscreen.positions,
		rendermodes = core.renders.modes,
		rendertypes = core.renders.types,
		skintypes = core.skins.types;
	
	embed.config = function(config) {
		var _defaults = {
			width: 640,
			height: 400,
			aspectratio: '16:9',
			file: '',
			sources: [],
			mode: rendermodes.VOD,
			bufferTime: .1,
			maxretries: 0,
			retrydelay: 3000,
			controls: true,
			autoplay: true,
			airplay: 'allow',
			playsinline: true,
			poster: '',
			report: true,
			debug: false,
			loader: {
				mode: iomodes.CORS
			},
			logo: {
				visible: true
			},
			bulletscreen: {
				enable: true,
				visible: true
			},
			render: {
				name: rendertypes.DEFAULT,
				swf: 'swf/playease.swf'
			},
			skin: {
				name: skintypes.DEFAULT
			},
			events: {
				
			}
		},
		
		_config = utils.extend({}, _defaults, config);
		
		return _config;
	};
	
	embed.config.addConfig = function(oldConfig, newConfig) {
		return utils.extend(oldConfig, newConfig);
	};
})(playease);

(function(playease) {
	var utils = playease.utils,
		events = playease.events,
		embed = playease.embed,
		core = playease.core;
	
	embed.embedder = function(api, config) {
		var _this = utils.extend(this, new events.eventdispatcher('embed.embedder'));
		
		_this.embed = function() {
			var entity = new core.entity(config);
			entity.addGlobalListener(_onEvent);
			entity.setup();
			api.setEntity(entity);
		};
		
		function _onEvent(e) {
			_forward(e);
		}
		
		function _forward(e) {
			_this.dispatchEvent(e.type, e);
		}
	};
})(playease);
