module.exports = ApplicationController;

function ApplicationController(init) {
    init.before(function protectFromForgeryHook(ctl) {
        ctl.protectFromForgery('16b17bf22bb9a97359de28be32169717c6442cc2');
    });

    init.before(function makeTree(c) {
        this.title = 'Documentation';
        c.locals.controllers = [];
        c.locals.models = [];
        c.locals.rootApp = c.compound;
        if (c.locals.rootApp.parent) {
            c.locals.rootApp = c.locals.rootApp.parent;
        }
        c.locals.className = '';
        c.locals.fileType = 'controller';
        c.locals.fileName = c.params.name.split(':')[1]
        c.locals.appRoute = c.params.name.split(':')[0].replace(/-/g, '/');
        c.locals.currentApp = c.locals.rootApp;
        loadStructure(c.locals.rootApp);

        function loadStructure(compound) {
            if (compound.app.path().replace(/-/g, '/') === c.locals.appRoute) {
                c.locals.currentApp = compound;
            }
            var cc = compound.structure.paths.controllers;
            var ccc = compound.structure.controllers;
            console.log(cc);
            Object.keys(cc).forEach(function(ctl) {
                console.log(ctl);
                var className = ccc[ctl].name;

                if (!className) {
                    return;
                }
                if (ctl === c.locals.fileName) {
                    c.locals.className = className;
                }
                c.locals.controllers.push({
                    path: compound.app.path(),
                    name: ctl,
                    className: className
                });
            });
            var cmd = compound.structure.paths.models;
            Object.keys(cmd).forEach(function(model) {
                c.locals.models.push({
                    path: compound.app.path(),
                    name: model
                });
                if (model === c.locals.fileName) {
                    c.locals.className = model;
                }
            });
            compound.elements.forEach(function(el) {
                loadStructure(el);
            });
        }
        c.next();
    });
}
