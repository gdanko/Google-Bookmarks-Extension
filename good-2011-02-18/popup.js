if (window.top === window) {
	$(document).ready(function() {
		var extensionSettings
		var bookmarkItems;
		var bookmarkLabels = [];
		var bookmarksData  = '<ul id="labels">' + '\n';

		// Begin DOM injection
		//$('body').css('text-align', 'left');
		$('body').append('<div id="master">');
			$('#master').append('<div id="dialogs">');
				$('#dialogs').append('<div id="add">');
					$('#add').append('Name:<br><input type="text" id="add_name" class="dialog" size="37"><br>');
					$('#add').append('Location (URL):<br><input type="text" id="add_url" class="dialog" size="37"<br>');
					$('#add').append('Labels:<br><input type="text" id="add_labels" class="dialog" size="37"><br>');
					$('#add').append('Notes:<br><textarea rows="2" cols="26" id="add_notes" class="dialog"></textarea>');
				$('#dialogs').append('<div id="delete">');
					$('#delete').append('<p>Are you sure you want to delete?</p>');
				$('#dialogs').append('<div id="edit">');
					$('#edit').append('Name:<br><input type="text" id="edit_name" class="dialog" size="37"><br>');
					$('#edit').append('Location (URL):<br><input type="text" id="edit_url" class="dialog" size="37"<br>');
					$('#edit').append('Labels:<br><input type="text" id="edit_labels" class="dialog" size="37"><br>');
					$('#edit').append('Notes:<br><textarea rows="2" cols="26" id="edit_notes" class="dialog"></textarea>');


			$('#master').append('<div id="popup">');
				$('#popup').append('<div id="toolbar">');
					$('#toolbar').append('&nbsp;');
					$('#toolbar').append('<input type="image" id="refreshBookmarksButton" class="toolbarElement" src="' + safari.extension.baseURI + 'images/refresh.png' + '" title="Refresh Bookmarks" alt="Refresh Bookmarks" width="16" height="16"> &nbsp;');
					$('#toolbar').append('<input type="image" id="addBookmarkButton" class="toolbarElement" src="' + safari.extension.baseURI + 'images/add.png' + '" title="Bookmark Current Page" alt="Bookmark Current Page" width="16" height="16"> &nbsp;');
					$('#toolbar').append('<input type="image" id="deleteBookmarkButton" class="toolbarElement" src="' + safari.extension.baseURI + 'images/delete.png' + '" title="Delete Bookmark for Current Page" alt="Delete Bookmark for Current Page" width="16" height="16"> &nbsp;');
					$('#toolbar').append('<input type="image" id="editBookmarkButton" class="toolbarElement" src="' + safari.extension.baseURI + 'images/edit.png' + '" title="Edit Bookmark for Current Page" alt="Edit Bookmark for Current Page" width="16" height="16"> &nbsp;');
					$('#toolbar').append('<input id="bookmarkSearch" type="text" class="toolbarElement" value="Search Bookmarks" size="22">');
					$('#toolbar').append('<hr>');
				$('#popup').append('<div id="content">');
					$('#content').append('div id="labels">');
		// End DOM injection

		// Begin CSS
		$('#bookmarkSearch').css( { 'font-size' : '8pt', 'color' : '#D0D0D0' } );
		$('#content').css('background-color', '#F4F4F4');
		$('#popup').css( { 'overflow' : 'hidden', 'background-color' : '#F4F4F4' } );
		$('#toolbar').css('overflow', 'hidden');
		$('.toolbarElement').css( 'vertical-align', 'middle' );
		$('#content').find('li').each(function() {
			$(this).css('text-align', 'left');
		});
		// End CSS

		// Begin Handlers
		$('#bookmarkSearch').keyup(function(event) {
			if (event.keyCode == '13') {
				event.preventDefault();
			}
			if ($('#bookmarkSearch').val().length == 0) {
				$('#content').jstree("clear_search");
			} else {
				$('#content').jstree("search", $('#bookmarkSearch').val());
			}
			$('#content').jstree("search", $('#bookmarkSearch').val());
		})

		$('#bookmarkSearch').focus(function() {
			if(this.value == 'Search Bookmarks') {
				$('#bookmarkSearch').css('color', '#000000')
				this.value = '';
			}
		});

		$('#bookmarkSearch').blur(function() {
			if(this.value == '') {
				$('#bookmarkSearch').css('color', '#D0D0D0');
				this.value = 'Search Bookmarks';
			}
		});

		$('#refreshBookmarksButton').click(function() {
			safari.self.tab.dispatchMessage('refresh');
			$('#content').jstree('destroy');
			$('#content').children().remove();
		});

		$('#addBookmarkButton').click(function() {
			$('#add').dialog('open');
		});

		$('#deleteBookmarkButton').click(function() {
			$('#delete').dialog('open');
		});

		$('#editBookmarkButton').click(function() {
			$('#edit').dialog('open');
		});

		$('.googleBookmark').live('click', function() {
			safari.self.tab.dispatchMessage('openLink', $(this).attr('url'));
			bookmarksPopup.dialog('close');
		});
		// End Handlers

		var bookmarksPopup = $('#popup').dialog({
			'autoOpen' : false ,
			'draggable' : false,
			'modal' : false,
			'resizable' : false,
			'show' : 'slideDown',
			'hide' : 'slideUp',
			'position' : [10,10],
			'title' : 'Google Bookmarks',
			open: function() {
				$('#popup.ui-dialog-titlebar').remove();
				var dialogHeight = $('#popup').height();
				var toolbarHeight = $('#toolbar').height();
				$('#content').css( { 'overflow-x' : 'auto', 'overflow-x' : 'hidden', 'height' : dialogHeight - 52 } );
			},
			resize: function() {
				var dialogHeight = $('#popup').height();
				var toolbarHeight = $('#toolbar').height();
				$('#content').css( { 'overflow-x' : 'auto', 'overflow-x' : 'hidden', 'height' : dialogHeight - 52 } );
			}
		});

		var addBookmark = $('#add').dialog({
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

		var deleteBookmark = $('#delete').dialog({
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
					$('#delete').dialog('close');
				}
			}

		});

		var editBookmark = $('#edit').dialog({
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

		function messageHandler(msgEvent) {
			var messageName = msgEvent.name;
			var messageData = msgEvent.message;

			if (messageName === 'buttonPushed') {
				extensionSettings = messageData[1];
				if (bookmarksPopup.dialog('isOpen')) {
					bookmarksPopup.dialog('close');
					$('#content').jstree('destroy');
					$('#content').children().remove();
				} else {
					parseSettings(extensionSettings);
					generateHTML(messageData[0]);
				}
			}

			else if (messageName === 'dataRefreshed') {
				$('#content').children().remove();
				generateHTML(messageData);
			}

			else if (messageName === 'settingChange') {
				if (messageData[0] == 'fontSize') {
					$('#content').children().css('font-size', messageData[1]);
				} 

				else if (messageData[0] == 'jstreeTheme') {
					$('#content').jstree('set_theme', messageData[1]);
				}

				else if (messageData[0] == 'popupHeight') {
					bookmarksPopup.dialog( { 'height' : messageData[1] } );
					$('#content').height(messageData[1] - 50);
					bookmarksPopup.dialog('resize');
				}

				else if (messageData[0] == 'popupWidth') {
					bookmarksPopup.dialog( { 'width' : messageData[1] } );
					bookmarksPopup.dialog('resize');
				}

				else if (messageData[0] == 'showDotsInTree') {
					if (messageData[1] == true) {
						$('#content').jstree('show_dots');
					} else if (messageData[1] == false) {
						$('#content').jstree('hide_dots');
					}
				}

				else if (messageData[0] == 'showIconsInTree') {
					if (messageData[1] == true) {
						$('#content').jstree('show_icons');
					} else if (messageData[1] == false) {
						$('#content').jstree('hide_icons');
					}
				}

				else if (messageData[0] == 'sortKey') {
					sortKey = messageData[1];
				}

				else if (messageData[0] == 'sortOrder') {
					sortOrder = messageData[1];
				}

			}
		}

		function parseSettings(extensionSettings) {
			$('#content').children().css('font-size', extensionSettings.fontSize);
			bookmarksPopup.dialog( { 'height' : extensionSettings.popupHeight, 'width' : extensionSettings.popupWidth } );
			$('#content').css( { 'overflow-y' : 'auto', 'height' : extensionSettings.popupHeight - 50 } );
		}

		function generateHTML(bookmarkItems) {
			bookmarkLabels = bookmarkLabels.uniqueByKey(bookmarkItems, "label").sort();
			for(var x = 0; x < bookmarkLabels.length; x++) {
				var tempArray = [];
				bookmarksData += '<li id="' + Sha1.hash(bookmarkLabels[x]) + '" rel="label"><a href="#">' + bookmarkLabels[x] + '</a>' + '\n';
				for(var y in bookmarkItems) {
					if(bookmarkItems[y].label == bookmarkLabels[x]) {
						tempArray.push(bookmarkItems[y]);
					}
				}
				tempArray.sort(function(a, b) {
					if(extensionSettings.sortKey == "title") {
						var itemA = a.title; itemB = b.title;
					} else if(extensionSettings.sortKey == "date") {
						var itemA = a.timestamp; itemB = b.timestamp;
					}

					if(extensionSettings.sortOrder == "asc") {
						if (itemA < itemB)
							return -1;

					} else if(extensionSettings.sortOrder == "desc") {
						if (itemA > itemB)
							return -1;
					}
				});
				for(var y = 0; y < tempArray.length; y++) {
					bookmarksData += '<ul><li id="' + tempArray[y].id + '" label="' + tempArray[y].label + '" rel="bookmark" class="googleBookmark" url="' + tempArray[y].url + '" timestamp="' + tempArray[y].timestamp + '"><a href="#">' + tempArray[y].title + '</a></li></ul>' + '\n';
				}
				bookmarksData += '</li>' + '\n';
			}
			bookmarksData += '</ul>'+ '\n';
			$('#content').append(bookmarksData);
			generateTree();
			$('#popup').dialog('open');
		}

		function generateTree() {
			$('#content')
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