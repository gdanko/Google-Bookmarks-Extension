if (window.top === window) {
	$(document).ready(function() {
		var isLoaded;
		var extensionSettings;
		var bookmarkItems = [];
		var bookmarksData;
		
		function bookmarkItem(id, title, url, timestamp, label) {
			this.id = id;
			this.title = title;
			this.url = url;
			this.timestamp = timestamp;
			this.label = label;
		}

		// Begin DOM injection
		$('body').append('<div id="gbm-master">');
			$('#gbm-master').append('<div id="gbm-dialogs">');
				$('#gbm-dialogs').append('<div id="gbm-add">');
					$('#gbm-add').append('Name:<br><input type="text" id="add_name" class="dialog" size="37"><br>');
					$('#gbm-add').append('Location (URL):<br><input type="text" id="add_url" class="dialog" size="37"<br>');
					$('#gbm-add').append('Labels:<br><input type="text" id="add_labels" class="dialog" size="37"><br>');
					$('#gbm-add').append('Notes:<br><textarea rows="2" cols="26" id="add_notes" class="dialog"></textarea>');
				$('#gbm-dialogs').append('<div id="gbm-delete">');
					$('#gbm-delete').append('<p>Are you sure you want to delete?</p>');
				$('#gbm-dialogs').append('<div id="gbm-edit">');
					$('#gbm-edit').append('Name:<br><input type="text" id="edit_name" class="dialog" size="37"><br>');
					$('#gbm-edit').append('Location (URL):<br><input type="text" id="edit_url" class="dialog" size="37"<br>');
					$('#gbm-edit').append('Labels:<br><input type="text" id="edit_labels" class="dialog" size="37"><br>');
					$('#gbm-edit').append('Notes:<br><textarea rows="2" cols="26" id="edit_notes" class="dialog"></textarea>');
			$('#gbm-master').append('<div id="gbm-popup">');
				$('#gbm-popup').append('<div id="gbm-toolbar">');
					$('#gbm-toolbar').append('&nbsp;');
					$('#gbm-toolbar').append('<input id="gbm-refresh-button" type="image" class="gbm-toolbar-element" src="' + safari.extension.baseURI + 'images/refresh.png' + '" title="Refresh Bookmarks" alt="Refresh Bookmarks" width="16" height="16"> &nbsp;');
					$('#gbm-toolbar').append('<input id="gbm-add-button" type="image" class="gbm-toolbar-element" src="' + safari.extension.baseURI + 'images/add.png' + '" title="Bookmark Current Page" alt="Bookmark Current Page" width="16" height="16"> &nbsp;');
					$('#gbm-toolbar').append('<input id="gbm-delete-button" type="image" class="gbm-toolbar-element" src="' + safari.extension.baseURI + 'images/delete.png' + '" title="Delete Bookmark for Current Page" alt="Delete Bookmark for Current Page" width="16" height="16"> &nbsp;');
					$('#gbm-toolbar').append('<input id="gbm-edit-button" type="image" class="gbm-toolbar-element" src="' + safari.extension.baseURI + 'images/edit.png' + '" title="Edit Bookmark for Current Page" alt="Edit Bookmark for Current Page" width="16" height="16"> &nbsp;');
					$('#gbm-toolbar').append('<input id="gbm-search-box" type="text" class="gbmToolbarElement" value="Search Bookmarks" size="22">');
					$('#gbm-toolbar').append('<hr>');
				$('#gbm-popup').append('<div id="gbm-content">');
		// End DOM injection

		// Begin CSS
		$('#gbm-search-box').css( { 'font-size' : '8pt', 'color' : '#D0D0D0' } );
		$('.gbm-toolbar-element').css( 'vertical-align', 'middle !important' );
		$('#gbm-toolbar').css('overflow', 'hidden');
		$('#gbm-toolbar').css( { 'text-align' : 'left !important', 'background-color' : '#F4F4F4 !important' } );
		// End CSS

		// Begin Handlers
		$('#gbm-search-box').keyup(function(event) {
			if (event.keyCode == '13') {
				event.preventDefault();
			}
			if ($('#gbm-search-box').val().length == 0) {
				$('#gbm-content').jstree("clear_search");
			} else {
				$('#gbm-content').jstree("search", $('#gbm-search-box').val());
			}
			$('#gbm-content').jstree("search", $('#gbm-search-box').val());
		})

		$('#gbm-search-box').focus(function() {
			if(this.value == 'Search Bookmarks') {
				$('#gbm-search-box').css('color', '#000000')
				this.value = '';
			}
		});

		$('#gbm-search-box').blur(function() {
			if(this.value == '') {
				$('#gbm-search-box').css('color', '#D0D0D0');
				this.value = 'Search Bookmarks';
			}
		});

		$('#gbm-refresh-button').click(function() {
			$('#gbm-content').children().empty();
			$('#gbm-content').jstree('destroy');
			retrieveXML(function(bookmarkItems) {
				generateTree();
			});
		});

		$('#gbm-add-button').click(function() {
			//$('li[url="' + window.location.href + '"]').next().text(' is bookmark');
			$('#gbm-add').dialog('open');
		});

		$('#gbm-delete-button').click(function() {
			//$('li[url="' + window.location.href + '"]').next().text(' is bookmark');
			$('#gbm-delete').dialog('open');
		});

		$('#gbm-edit-button').click(function() {
			//$('li[url="' + window.location.href + '"]').next().text(' is bookmark');
			$('#gbm-edit').dialog('open');
		});

		$('.googleBookmark').live('click', function() {
			safari.self.tab.dispatchMessage('openLink', $(this).attr('url'));
			bookmarksPopup.dialog('close');
		});
		// End Handlers

		var bookmarksPopup = $('#gbm-popup').dialog({
			'autoOpen' : false ,
			'draggable' : false,
			'modal' : false,
			'resizable' : false,
			'show' : 'slideDown',
			'hide' : 'slideUp',
			'position' : [10,10],
			'title' : 'Google Bookmarks',
			open: function() {
				//$('#gbm-popup.ui-dialog-titlebar').remove();
				var dialogHeight = $('#gbm-popup').height();
				var toolbarHeight = $('#gbm-toolbar').height();
				$('#gbm-content').css( { 'overflow-x' : 'auto', 'overflow-x' : 'hidden', 'height' : dialogHeight - 52 } );
			},
			resize: function() {
				var dialogHeight = $('#gbm-popup').height();
				var toolbarHeight = $('#gbm-toolbar').height();
				$('#gbm-content').css( { 'overflow-x' : 'auto', 'overflow-x' : 'hidden', 'height' : dialogHeight - 52 } );
			}
		});

		var addBookmark = $('#gbm-add').dialog({
			'autoOpen' : false ,
			'draggable' : false,
			'modal' : false,
			'resizable' : false,
			'height' : 310,
			'width' : 300,
			'position' : [60,60],
			'title' : 'Add Bookmark',
			'buttons' : {
				'Add' : function() {
					// Add
				},
				'Cancel' : function() {
					// Cancel
				}
			}
		});

		var deleteBookmark = $('#gbm-delete').dialog({
			'autoOpen' : false ,
			'draggable' : false,
			'modal' : false,
			'resizable' : false,
			'height' : 200,
			'width' : 300,
			'position' : [60,60],
			'title' : 'Delete Bookmark',
			'buttons' : {
				'Delete' : function() {
					// Delete
				},
				'Cancel' : function() {
					$('#gbm-delete').dialog('close');
				}
			}

		});

		var editBookmark = $('#gbm-edit').dialog({
			'autoOpen' : false ,
			'draggable' : false,
			'modal' : false,
			'resizable' : false,
			'height' : 310,
			'width' : 300,
			'position' : [60,60],
			'title' : 'Edit Bookmark',
			'buttons' : {
				'Save' : function() {
					// Save
				},
				'Cancel' : function() {
					// Cancel
				}
			}
		});

		Array.prototype.uniqueByKey = function(array, key) {
			// unique = bookmarkLabels.uniqueByKey(bookmarkItems, "label").sort();
			var r = [];
			for(var i = 0; i < array.length; i++) {
				if(r.indexOf(array[i][key]) == -1) {
					r.push(array[i][key]);
				}
			}
			return r;
		}

		Array.prototype.unique = function () {
		    var r = new Array();
		    for(var i = 0, n = this.length; i < n; i++) {
		        if (this.lastIndexOf(this[i]) == i) r.push(this[i]);
		    }
		    return r;
		}

		$.expr[':'].contentIs = function(el, idx, meta) {
		    return $(el).text() === meta[3];
		};

		function messageHandler(msgEvent) {
			var messageName = msgEvent.name;
			var messageData = msgEvent.message;

			if (messageName === 'buttonPushed') {
				isLoaded = messageData[0];
				extensionSettings = messageData[1];
				
				if (bookmarksPopup.dialog('isOpen')) {
					bookmarksPopup.dialog('close');
					return;
				}

				parseSettings(extensionSettings);

				retrieveXML(function(bookmarkItems) {
					generateTree();
					bookmarksPopup.dialog('open');
					window.open("", "myPopup", "status=0, toolbar=0, location=0, menubar=0, directories=0, resizable=0, height=600, width=400, top=10, left=10");
				
				});

				/*if(isLoaded != 10) {
					retrieveXML(function(bookmarkItems) {
						generateTree();
						bookmarksPopup.dialog('open');
						safari.self.tab.dispatchMessage('dataLoaded');
					});
					return;
				} else if(isLoaded == 1) {
					bookmarksPopup.dialog('open');
				}*/
			}

			if (messageName === 'settingChange') {
				extensionSettings.fontSize = messageData[1];

				if (messageData[0] == 'fontSize') {
					$('#gbm-content').children().css('font-size', messageData[1]);
					return;
				} 

				if (messageData[0] == 'jstreeTheme') {
					extensionSettings.jstreeTheme = messageData[1];
					$('#gbm-content').jstree('set_theme', messageData[1]);
					return;
				}

				if (messageData[0] == 'popupHeight') {
					extensionSettings.popupHeight = messageData[1];
					bookmarksPopup.dialog( { 'height' : messageData[1] } );
					$('#gbm-content').height(messageData[1] - 50);
					bookmarksPopup.dialog('resize');
					return;
				}

				if (messageData[0] == 'popupWidth') {
					extensionSettings.popupWidth = messageData[1];
					bookmarksPopup.dialog( { 'width' : messageData[1] } );
					bookmarksPopup.dialog('resize');
					return;
				}

				if (messageData[0] == 'showDotsInTree') {
					if (messageData[1] == true) {
						extensionSettings.showDotsInTree = true;
						$('#gbm-content').jstree('show_dots');
					} else if (messageData[1] == false) {
						extensionSettings.showDotsInTree = false;
						$('#gbm-content').jstree('hide_dots');
					}
					return;
				}

				if (messageData[0] == 'showIconsInTree') {
					if (messageData[1] == true) {
						extensionSettings.showIconsInTree = true
						$('#gbm-content').jstree('show_icons');
					} else if (messageData[1] == false) {
						extensionSettings.showIconsInTree = false
						$('#gbm-content').jstree('hide_icons');
					}
					return;
				}

				if (messageData[0] == 'sortKey') {
					extensionSettings.sortKey = messageData[1];
					return;
				}

				if (messageData[0] == 'sortOrder') {
					extensionSettings.sortOrder = messageData[1];
					return;
				}
			}
		}

		function isBookmark(url) {
			console.log(bookmarkItems[1]);
		}

		function parseSettings(extensionSettings) {
			$('body #gbm-master *').css('font-size', extensionSettings.fontSize);
			bookmarksPopup.dialog( { 'height' : extensionSettings.popupHeight, 'width' : extensionSettings.popupWidth } );
			$('#gbm-content').css( { 'overflow-y' : 'auto', 'height' : extensionSettings.popupHeight - 50 } );
		}

		function retrieveXML(callback) {
			if(extensionSettings.debugMode == true) {
				console.log(extensionSettings.debugText + "Force data load requested");
			}
			bookmarksData = '<ul id="gbm-labels">';
			$.ajax({
				type : "GET",
				url : "http://www.google.com/bookmarks/",
				beforeSend : function(XMLHttpRequest) {
					return true;
				},
				data: {
					zx : (new Date()).getTime(),
					output : "xml",
					num : "20000",
					start : "0"
				},
				timeout : 5000,
				dataType : "xml",
				success : function(data) {
					var bookmarkItems = [];
					var bookmarkLabels = [];
					$(data).find('label').each(function() {
						bookmarkLabels.push($(this).text());
					});
					bookmarkLabels = bookmarkLabels.unique().sort();
					for (x = 0; x < bookmarkLabels.length; x++) {
						bookmarkItemsByLabel = [];
						bookmarksData += '<li id="' + Sha1.hash(bookmarkLabels[x]) + '" rel="label"><a href="#">' + bookmarkLabels[x] + '</a>';
						$(data).find("label:contentIs('" + bookmarkLabels[x] + "')").each(function() {
							var title = $(this).closest('bookmark').find('title').text();
							var url = $(this).closest('bookmark').find('url').text();
							var id = $(this).closest('bookmark').find('id').text();
							var timestamp = $(this).closest('bookmark').find('timestamp').text();
							var bookmark = new bookmarkItem(id, title, url, timestamp, bookmarkLabels[x]);
							bookmarkItemsByLabel.push(bookmark)
						});
						bookmarkItemsByLabel.sort(function(a, b) {
							if(extensionSettings.sortKey == "title") {
								var itemA = a.title.toLowerCase(); itemB = b.title.toLowerCase();
							} else if(extensionSettings.sortKey == "date") {
								var itemA = a.timestamp; itemB = b.timestamp;
							}

							if(extensionSettings.sortOrder == "asc") {
								if (itemA < itemB)
									return -1;
							}

							if(extensionSettings.sortOrder == "desc") {
								if (itemA > itemB)
									return -1;
							}
						});

						for(var q = 0; q < bookmarkItemsByLabel.length; q++) {
							bookmarksData += '<ul><li id="' + bookmarkItemsByLabel[q].id + '" label="' + bookmarkItemsByLabel[q].label + '" rel="bookmark" class="googleBookmark" url="' + bookmarkItemsByLabel[q].url + '" timestamp="' + bookmarkItemsByLabel[q].timestamp + '"><a href="#">' + bookmarkItemsByLabel[q].title + '</a></li></ul>';
						}
						bookmarkItems.push(bookmarkItemsByLabel);
						bookmarksData += '</li>' + '\n';
					}
					bookmarksData += '</ul>'+ '\n';
					$('#gbm-content').append(bookmarksData);
					callback(bookmarkItems);
				},

				error : function() {
					var errorData = '<p style="font-weight: bold; color: red">ERROR: error<br><br>';
					errorData += 'Please <a href="http://www.google.com/accounts/Login">login</a></p>';
					callback(errorData);
				}
			});
		}

		function generateTree() {
			$('#gbm-content')
			.bind("search.jstree", function (e, data) {
				$(this).find("li").hide().removeClass("jstree-last");
				data.rslt.nodes.parentsUntil(".jstree").andSelf().show()
				.filter("ul").each(function () {
					$(this).children("li:visible").eq(-1).addClass("jstree-last");
				});
			})

			.bind("clear_search.jstree", function () {
				$(this).find("li").css("display","");
				$(this).jstree("clean_node", -1);
				$(this).jstree("close_all", -1);
			})

			.jstree({
				'core' : {
					'animation' : false
				},

				'themes' : {
					'theme' : extensionSettings.jstreeTheme,
					'dots' : extensionSettings.showDotsInTree,
					'icons' : extensionSettings.showIconsInTree
				},

				'search' : {
					'case_insensitive' : true,
				},

				'types' : {
					'valid_children' : [ 'label' ],
					'types' : {
						'label' : {
							'valid_children' : [ 'bookmark'],
							'max_depth' : 1
						},

						'bookmark' : {
							'valid_children' : [ 'none' ],
							'icon' : { 'image' : safari.extension.baseURI + 'images/file.png' },
						}
					}
				},

				'plugins' : [
					'html_data',
					'themes',
					'types',
					'contextmenu',
					'search'
				]
			});
		}

		safari.self.addEventListener('message', messageHandler, false);
	});
}