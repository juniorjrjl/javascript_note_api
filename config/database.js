const mongoose = require('mongoose');
mongoose.Promise = global.Promise

mongoose.connect('mongodb://notedbmongo/javascriptNote', {
    useNewUrlParser: true, 
    useUnifiedTopology: true, 
    useCreateIndex: true,
    useFindAndModify: false
})
.then(() => console.log('Mongodb conectado'))
.catch((err) => console.log(err))
