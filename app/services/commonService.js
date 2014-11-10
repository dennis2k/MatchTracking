function CommonService(HttpWrapper) {

    var service = {};
    service.name = null;
    service.delete = _delete;
    service.query = query;
    service.create = create;
    service.configure = configure;

    function configure(name)
    {
        service.name = name;
        service.isConfigured = true;
    }

    function query(params) {
        if(!service.isConfigured)
            console.error('Service is not configured');
        HttpWrapper.get(service.name + "/query",params);
    }

    function create(params) {
        if(!service.isConfigured)
            console.error('Service is not configured');
        HttpWrapper.post(service.name + "/create",params);
    }

    function _delete(id) {
        if(!service.isConfigured)
            console.error('Service is not configured');
        HttpWrapper.post(service.name + "/remove",{id : id});
    }
    return service;
}