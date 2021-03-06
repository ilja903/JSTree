function Serializer(registry) {
    this.registry = registry;
    var that = this;

    this.serialize = function () {
        var cache = [];
        var nodes = JSON.stringify(that.registry.getNodes(), function (key, value) {
            if (value !== null) {
                if (cache.indexOf(value) !== -1) {
                    // Circular reference found, discard key
                    return;
                }
                // Store value in our collection
                cache.push(value);
            }
            return value;
        });
        cache = null; // Enable garbage collection
        return JSON.stringify({nodes: nodes, counter: registry.counter});
    };
}