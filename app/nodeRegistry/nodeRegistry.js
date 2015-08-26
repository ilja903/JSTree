define(['app/model/node.js', 'app/nodeRegistry/deserializer.js', 'app/nodeRegistry/serializer.js'], function (Node, Deserializer, Serializer) {

    return Backbone.Collection.extend({
        LOCAL_STORAGE_KEY: "nodeRegistryInfoNew",
        counter: 0,
        allRegisteredNodes: {},
        topLevelNodes: [],

        initialize: function () {
            this.deserializer = new Deserializer(this);
            this.serializer = new Serializer(this);
        },

        setTopLevelNodes: function (dirtyNodes) {
            var that = this;
            this.topLevelNodes = setNodeIdsIfNotSetAndRegisterThem(dirtyNodes);

            function setNodeIdsIfNotSetAndRegisterThem(dirtyNodes) {
                return _(dirtyNodes).map(function (dirtyNode) {
                    if (dirtyNode.doesNotHaveId()) {
                        dirtyNode.set('id', that.generateId());
                        that.registerNode(dirtyNode);
                    }
                    if (dirtyNode.hasChildNodes()) {
                        setNodeIdsIfNotSetAndRegisterThem(dirtyNode.getChildNodes())
                    }
                    return dirtyNode;
                });
            }
        },

        createNode: function (name) {
            var node = new Node({name: name, id: this.generateId()});
            this.registerNode(node);
            return node;
        },

        removeNode: function (node) {
            if (node.isSuperNode()) {
                var nodes = this.getTopLevelNodes();
                nodes.splice(nodes.indexOf(node), 1);
            } else {
                var childNodes = node.getParentNode().getChildNodes();
                childNodes.splice(childNodes.indexOf(node), 1);
            }
        },

        saveState: function () {
            var data = this.serializer.serializeToJson();
            localStorage.setItem(this.LOCAL_STORAGE_KEY, data);
            return data;
        },

        hasPreviousSession: function () {
            return localStorage.getItem(this.LOCAL_STORAGE_KEY);
        },

        loadState: function () {
            var deserializedInfo = this.deserializer.deserializeJson(localStorage.getItem(this.LOCAL_STORAGE_KEY));
            this.setTopLevelNodes(deserializedInfo.nodes);
            this.counter = parseInt(deserializedInfo.counter);
        },

        getTopLevelNodes: function () {
            return this.topLevelNodes;
        },

        getNodeById: function (id) {
            return this.allRegisteredNodes[id];
        },

        registerNode: function (node) {
            this.allRegisteredNodes[node.id] = node;
        },

        loadMockState: function () {
            var parent1 = new Node({name: "C:/"});
            var parent2 = new Node({name: "D:/"});
            var nodeJS = new Node({name: "NodeJS"});
            var child1 = new Node({name: "Program Files"});
            child1.addChild(new Node({name: "Java"}));
            child1.addChild(nodeJS);
            nodeJS.addChild(new Node({name: 'Grunt'}));
            nodeJS.addChild(new Node({name: 'Gulp'}));
            parent1.addChild(child1);
            var games = new Node({name: "Games"});
            parent1.addChild(games);
            games.addChild(new Node({name: "Solitare"}));
            this.setTopLevelNodes([parent1, parent2]);
            this.saveState();
        },

        generateId: function () {
            return ++this.counter;
        }

    });

});