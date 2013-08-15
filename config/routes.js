exports.routes = function (map) {
    map.get('/', 'documentation#index');
    map.get('/controllers/:name', 'documentation#controller');
    map.get('/models/:name', 'documentation#model');
};
