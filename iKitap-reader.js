
	//!		version: 1.0.0;
	// Not: bu kütüphane iKitap.js den kalıtılmıştır.
	// EPUB dosyalarının cross-platform bir şekilde çalışmasını amaçlar.
	// Gerekli eklentiler;
	// 	futurepress/epub.js:
	//!



	;(function( $, window, document) {

		"use strict";

		$.iKitapReader = function (options) {

			var that	= this;
			var $that	= $(this);
			var temp	= null;
			var $document	= null;
			var $body = $('body');
			var $window = $(window);

			// Eğer dışarıda oluşturulan bu objenin tüm
			// parametrelerinin tam gönderilmemesi ihtimaline
			// karşın varsayılan değerler atıyoruz.
			var options = {
				epubURL 	: options.url			|| null,
				container	: options.container		|| 'area',
				width		: options.width			|| 600,
				height		: options.height		|| 400
			}

			that.attrs = {
				_DEBUG_		: false,
				_W_WIDTH	: null,
				_W_HEIGHT 	: null,
				_D_WIDTH	: null,
				_D_HEIGHT	: null,
				_LOG_WARNING	: 1,
				SLIDE_NEXT		: 2,
				SLIDE_PREV		: 3,
				SLIDE_CURRENT	: 4,
				_SLIDE_CURRENT_SELECTOR_	: 'data-current-visible'

			}

			// book viewport
			that.viewport = null;
			that.$viewport = null;

			that.bookURL = 'books/alayx/';

			that.globalPadding = 50;

			// default ayarları ekle
			that.options = options;

			// epub objesi
			that.book = null;

			// Yardımcı fonksiyonlar
			that.helperClasses = {

				// Gönderilen objenin width ve height
				// değerlerini döndürür.
				// sizeType gönderilmiş ise; offsetWidth ( margin - padding ) dahil.
				fillSizes : function( object, sizeType ) {
					temp = {width: $(object).outerWidth(true), height: $(object).outerHeight(true)}
					return temp;
				},

				//-- bir dizinin orta index ini döndürür
				getMiddleIndexOfAnArray : function (arr) {
					return Math.floor((arr.length - 1) / 2);
				},

				//-- Varsayılan etiket değerlerini günceller
				updateAttrs: function () {
					that.attrs._W_WIDTH = that.helperClasses.fillSizes(window).width;
					that.attrs._W_HEIGHT = that.helperClasses.fillSizes(window).height;
					that.attrs._D_WIDTH = that.helperClasses.fillSizes(document).width;
					that.attrs._D_HEIGHT = that.helperClasses.fillSizes(document).height;
				},

				//-- Viewport'un olması gereken ölçülerini döndürür
				getViewportActualSizes: function () {

					var actualAreaWidth = $window.width() - that.globalPadding,
						actualAreaHeight = $window.height() - that.globalPadding,
						actualMarginLeft = that.globalPadding / 2,
						actualMarginTop = that.globalPadding / 2

					return {
						width: actualAreaWidth,
						height: actualAreaHeight,
						marginLeft: actualMarginLeft,
						marginTop: actualMarginTop
					}
				},

				// Sadece konsola loglamak için kullanılır.
				__log: function(message, type) {
					that.attrs._DEBUG_ ?
						type == that.attrs._LOG_WARNING ?
							console.warn(message) :
							console.log(message) : false ;
				}
			};

			// epub çerçevesinin içine kod enjekte etmeyi sağlar.
			// SWIPE için gerekli kütüphaneleri ekler.
			that.injectLibraries = function () {
				var scriptList = [
					"http://127.0.0.1:8181/libs/jquery-2.1.0.min.js",
					"http://127.0.0.1:8181/libs/hammer.js",
					"http://127.0.0.1:8181/libs/TweenMax.js",
					"http://127.0.0.1:8181/libs/TweenMax-scrollTo.js",
					"http://127.0.0.1:8181/iKitap-reader-iframe.js"
				];
				var style =  "http://127.0.0.1:8181/iKitap-reader-iframe.css";
				EPUBJS.Hooks.register('beforeChapterDisplay').injectScripts = function( callback, renderer ) {
					EPUBJS.core.addScripts(scriptList, function() {
						that.helperClasses.__log('javascript kütüphaneler iframe içine yüklendi', that.attrs._LOG_WARNING);
						var script = document.createElement('script');
						script.text = 'var touchEvents = new ReaderTouch();'
						renderer.doc.head.appendChild(script);
						that.manageBook();
						if(callback) callback();
					}, renderer.doc.head);
				};
				EPUBJS.Hooks.register('beforeChapterDisplay').injectStyles = function( callback, renderer ) {
					EPUBJS.core.addCss(style, function() {
						that.helperClasses.__log('css kütüphaneleri iframe içine yüklendi', that.attrs._LOG_WARNING);
						if(callback) callback();
					}, renderer.doc.head);
				};
			};

			//-- Tüm kitapların sayfa listelerini günceller
			that.updatePageList = function (callback) {
				var book = that.book;
				book.on('book:ready', function(event) {
					book.generatePagination();
					book.pageListReady.then(function() {
						callback();
					});
				})
			};

			//-- EPUBJS nesnelerini oluşturur
			that.initBooks = function () {
				that.book = new EPUBJS.Book({bookPath: that.bookURL});
			};

			//-- her Book nesnesini divlere render eder
			that.renderBook = function () {
				that.book.renderTo(that.viewport);
			};

			//-- sayfada bulunan görünümleri diziye almaya yarar
			that.makeViewport = function () {
				that.viewport = document.getElementById(that.options.container);
				that.$viewport = $(that.viewport);
			}

			that.manageBook = function () {

			};

			// Sınıfın kurucu fonksiyonudur
			// varsayılan ayarları tanımlar
			// bu obje her yeni oluşturulduğunda çağrılır.
			that.init = function() {

				EPUBJS.filePath = "reader/js/libs/";
				EPUBJS.cssPath = "reader/css/";

				//-- görünür alanları viewport olarak diziye atıyoruz
				that.makeViewport();

				//-- touch eventlerini her kitaba enjekte ediyoruz
				that.injectLibraries();

				that.initBooks();

				//-- kitapları render ediyoruz
				that.renderBook();

				//-- eventleri register ediyoruz
				that.initEvents();



			};
			// Bir sonraki sayfayı ekrana getirir
			that.getNextPage = function () {
				that.book.nextPage();
			};

			// Bir önceki sayfayı ekrana getirir
			that.getPrevPage = function () {
			};

			// Tüm eventleri burada tanımlıyoruz
			that.initEvents = function () {

				// KEYUP EVENT REGISTER
				$(window).on('keyup', function( event ) {
					switch ( event.keyCode ) {
						// D
						case 68:
							break;
						// E
						case 65:
							break;
						// ->
						case 39:
							break;
						// <-
						case 37:
							break;
					}
				});


			}

			// Sayfa yeniden boyutlandırıldığında
			// kullanılır sayfa yapısının boyuta
			// göre bozulmadan düzenlenmesi için.
			that.updateStage = function() {

				//-- her resize olduğunda tüm değişkenleri güncelle
				that.helperClasses.updateAttrs();

				//-- viewport boyutunu çözünürlüğe göre ayarlıyoruz.
				var v = that.helperClasses.getViewportActualSizes();
				that.$viewport.css({
					width: v.width,
					height: v.height
				});
			};

			// let's party
			that.init();
		}

	})( jQuery, window, window.document );



