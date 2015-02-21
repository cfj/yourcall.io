module.exports = {
    generateId: function(len) {
        var id = '',
            possibleChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789',
            listLength = possibleChars.length;

        for (var i = 0; i < len; i++) {
            id += possibleChars.charAt(Math.floor(Math.random() * listLength));
        }

        return id;
    }
};