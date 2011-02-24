if (window.top === window) {
	$(document).ready(function() {
		var extensionSettings;
		var strBookmarksData;
		var bookmarksAllObjectsArray = [];

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
			console.log("Add: " + window.location.href);
			$('#gbm-add').dialog('open');
		});

		$('#gbm-delete-button').click(function() {
			console.log("Delete: " + window.location.href);
			$('#gbm-delete').dialog('open');
		});

		$('#gbm-edit-button').click(function() {
			console.log("Edit: " + window.location.href);
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

		function messageHandler(msgEvent) {
			var messageName = msgEvent.name;
			var messageData = msgEvent.message;

			if (messageName === 'buttonPushed') {
				extensionSettings = messageData[0];
				strBookmarksData = messageData[1];
				if (bookmarksPopup.dialog('isOpen')) {
					bookmarksPopup.dialog('close');
					return;
				}
				parseSettings(extensionSettings);
				
				if(extensionSettings.debugMode == true) {
					if($('#gbm-labels').length == 0) {
						console.log("DOM not loaded");
					} else {
						console.log("DOM loaded");
						console.log($('#gbm-labels').length);
					}
				}

				if(extensionSettings.debugMode == true) {
					console.log(extensionSettings.debugText + "Appending the DOM.");
				}
				$('#gbm-content').children().empty();
				$('#gbm-content').jstree('destroy')
				$('#gbm-content').append(strBookmarksData);
				generateTree();
				safari.self.tab.dispatchMessage('dataLoaded')
				bookmarksPopup.dialog('open');
				return;	
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

		//function include(arr,obj) {
		//	return (arr.indexOf(obj) != -1);
		//}

		function parseSettings(extensionSettings) {
			$('body #gbm-master *').css('font-size', extensionSettings.fontSize);
			bookmarksPopup.dialog( { 'height' : extensionSettings.popupHeight, 'width' : extensionSettings.popupWidth } );
			$('#gbm-content').css( { 'overflow-y' : 'auto', 'height' : extensionSettings.popupHeight - 50 } );
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