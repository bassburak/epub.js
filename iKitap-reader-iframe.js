	/**
	 *!
	 * TODO: Touch Eventlerini Yönetir
	 * Frame içerisinde bulunan EPUBJS öğesinin
	 * mobil versiyonda ki kaydırma eylemlerini
	 * gerçekleştirebilmesi için yazılmıştır.
	 *
	 */

	;(function ( $, H, t, d, h, w ) {


		var reqAnimationFrame = (function() {
			return window[H.prefixed(window, 'requestAnimationFrame')] || function ( callback ) {
					window.setTimeout(callback, 1000 / 60);
				};
		})();

		"use strict";


		window.ReaderTouch = function (Book) {
			this.window = w;
			this.$window = $(w);
			this.options = {
				events: ['panstart', 'panend', 'panmove', 'tap']
			};
			this.attrs = {
				_CHANGE_PAGE_DISTANCE	: this.$window.width() / 3,
				_PAN_START_X_	: null,
				_PAN_START_Y_	: null
			}
			this.hammer = null;
			this.container = h;
			this.$container = $(h);
			this.ikitapReader = parent.GetCurrentEpubObject();
			this.leftPos = null;
			this.ticking = false;
			this.translateX = null;
			this.initialize();
		};

		ReaderTouch.prototype.initialize = function () {
			this.initHammer();
		};

		ReaderTouch.prototype.getEvents = function (seperator) {
			return this.options.events.join(seperator);
		};

		ReaderTouch.prototype.getPosFromReader = function () {
			this.leftPos = this.ikitapReader.book.renderer.render.leftPos;
			return this.leftPos;
		};

		ReaderTouch.prototype.getNextPagePos = function () {
			this.ikitapReader.book.nextPage();
			return this.getPosFromReader();
		};

		ReaderTouch.prototype.getPrevPagePos = function () {
			this.ikitapReader.book.prevPage();
			return this.getPosFromReader();
		};

		ReaderTouch.prototype.moveTransform = function (pos) {
			var value = 'translate3d('+ pos +'px, 0, 0)';
			this.container.className = 'animate';
			this.$container.css({
				'-webkit-transform': value,
				'-moz-transform': value,
				'-ms-transform': value,
				'-o-transform': value,
				'transform': value
			});
		}
		ReaderTouch.prototype.updateTransform = function (pos) {
			var value = 'translate3d('+ pos +'px, 0, 0)';
			this.$container.css({
				'-webkit-transform': value,
				'-moz-transform': value,
				'-ms-transform': value,
				'-o-transform': value,
				'transform': value
			});
			this.ticking = false;
		}

		ReaderTouch.prototype.initHammer = function () {
			var that = this;
			that.hammer = new H.Manager( that.container );
			that.hammer.add( new H.Pan({ threshold: 0, pointers: 0 }) );

			that.hammer.on('panstart panend panmove panleft panright', function( e ) {
				var selpagePos = 0;
				var curPagePos = -that.getPosFromReader();
				var nowDirection = e.direction;
				if(e.type == 'panstart') {

				}
				if( e.type == 'panend' ) {

					if( e.distance >= that.attrs._CHANGE_PAGE_DISTANCE )
					{
						selpagePos = curPagePos;
						( nowDirection == 2 ) ?
							selpagePos = that.getNextPagePos() * - 1 :
							( nowDirection == 4 ) ?
								selpagePos = that.getPrevPagePos() * - 1 : false;

						that.moveTransform(selpagePos);
					}
					else
					{
						that.moveTransform(curPagePos);
					}

				} else {
					that.container.className = '';
					that.updateTransform(curPagePos + e.deltaX);
				}
			});
		}




	})
	( jQuery, Hammer, TweenMax, document, document.documentElement, window );



