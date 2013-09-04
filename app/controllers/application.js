var path = require('path');

module.exports = ApplicationController;

function ApplicationController(init) {
    init.before(function protectFromForgeryHook(ctl) {
        ctl.protectFromForgery('16b17bf22bb9a97359de28be32169717c6442cc2');
    });

    init.before(function makeTree(c) {
        var whitelist = c.app.get('docs whitelist');
        whitelist = whitelist && new RegExp(whitelist);

        this.title = 'Documentation';
        c.locals.controllers = [];
        c.locals.models = [];
        c.locals.docsPath = c.app.get('docs route') || '/docs';
        c.locals.rootApp = c.compound;
        if (c.locals.rootApp.parent) {
            c.locals.rootApp = c.locals.rootApp.parent;
        }
        c.locals.className = '';
        c.locals.fileType = 'controller';
        var name = c.params.name || ':';
        c.locals.fileName = name.split(':')[1]
        c.locals.appRoute = name.split(':')[0].replace(/-/g, '/');
        c.locals.currentApp = c.locals.rootApp;
        loadStructure(c.locals.rootApp);

        function loadStructure(compound) {
            if (compound.app.path().replace(/-/g, '/') === c.locals.appRoute) {
                c.locals.currentApp = compound;
            }
            var cc = compound.structure.paths.controllers;
            var ccc = compound.structure.controllers;
            
            Object.keys(cc).forEach(function(ctl) {
                var className = ccc[ctl].name;

                if (!className) {
                    return;
                }
                if (ctl === c.locals.fileName) {
                    c.locals.className = className;
                }
                
                var controller = {
                    path: compound.app.path(),
                    name: ctl,
                    className: className
                };

                // exclude the documentation controllers
                if (controller.path === (c.app.get('docs route') || '/docs')) {
                    return;
                }

                // check vs whitelist
                if (whitelist && !whitelist.test(path.join('controllers', controller.path, controller.name))) {
                    return;
                }

                c.locals.controllers.push(controller);
            });
            var cmd = compound.structure.paths.models;
            Object.keys(cmd).forEach(function(modelName) {
                var model = {
                    path: compound.app.path(),
                    name: modelName
                };

                // check vs whitelist
                if (whitelist && !whitelist.test(path.join('models', model.path, model.name))) {
                    return;
                }

                if (modelName === c.locals.fileName) {
                    c.locals.className = modelName;
                }

                c.locals.models.push(model);
            });
            compound.elements.forEach(function(el) {
                loadStructure(el);
            });
        }
        c.next();
    });
}
