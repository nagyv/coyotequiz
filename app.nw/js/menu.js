var Os = require('os')
var menu = new nw.Menu({ type: 'menubar' });

var menuNewQuiz = new nw.MenuItem({
	label: 'New',
	click: function () {
		nw.Window.open('new.html');
	}
});

if(Os.platform() == 'darwin') {
	menu.createMacBuiltin('Coyote Quiz', {
		hideEdit: true
	});
	menu.items[0].submenu.insert(menuNewQuiz, 1);
} else {
	menu.append(new nw.MenuItem({
		label: 'File',
		submenu: new nw.Menu()
	}));

	menu.items[0].submenu.append(menuNewQuiz);
	menu.items[0].submenu.append(new nw.MenuItem({
		type: 'separator'
	}));
	menu.items[0].submenu.append(new nw.MenuItem({
		label: 'Close',
		key: 'q',
		modifiers: 'cmd',
		click: function () {
			nw.Window.get().close();
		}
	}));

}

nw.Window.get().menu = menu;