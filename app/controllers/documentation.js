var dox = require('dox');
var fs = require('fs');
var path = require('path');
var ApplicationController = require('./application.js');

module.exports = DocumentationController;

function DocumentationController(init) {
    ApplicationController.call(this, init);
}

/**
 * Display documentation for given controller
 *
 * @param {String} name - name of controller.
 */
DocumentationController.prototype.controller = function(c) {
    var compound = c.locals.currentApp;
    var routes = compound.map.dump;

    this.docs = dox.parseComments(fs.readFileSync(compound.structure.paths.controllers[c.locals.fileName].file, 'utf-8'));
    this.docs.forEach(function(doc) {
        var route = '';
        routes.forEach(function(r) {
            if (r.name === c.locals.fileName && r.action === doc.ctx.name) {
                doc.route = r;
            }
        });
    });
    c.render();
};

/**
 * Display documentation for given model
 *
 * @param {String} name - name of model.
 */
DocumentationController.prototype.model = function(c) {
    var compound = c.locals.currentApp;
    var routes = compound.map.dump;
    this.className = this.fileName;

    this.docs = dox.parseComments(fs.readFileSync(path.join(compound.root, 'app', 'models', c.locals.fileName + '.js'), 'utf-8'));
    this.docs.forEach(function(doc) {
        var route = '';
        routes.forEach(function(r) {
            if (r.name === c.locals.fileName && r.action === doc.ctx.name) {
                doc.route = r;
            }
        });
    });
    c.render();
};

DocumentationController.prototype.index = function(c) {
    c.render();
};
