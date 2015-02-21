module.exports = {
    generateId: function(length) {
        var chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789',
            id = '';

        for (var i = 0; i < length; i++) {
            id += chars.charAt(Math.floor(Math.random() * chars.length));
        }

        return id;
    }
};