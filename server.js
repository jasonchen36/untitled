console.log('hello world');
console.log(process.env.MYSQL_URL);

const bookshelf = require('./app/database/index');

var User = bookshelf.Model.extend({
    tableName: 'users'
});

User.where('id', 1).fetch().then(function(user) {
    console.log(user.toJSON());
}).catch(function(err) {
    console.error(err);
});