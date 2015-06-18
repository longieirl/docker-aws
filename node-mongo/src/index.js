var express = require('express');
var app = express();
var mongoose = require('mongoose');
var fs = require('fs');
var Schema = mongoose.Schema;
var logger = require('morgan');
var fs = require('fs');

app.use(logger('combined'))

app.use(express.static(__dirname + '/static'));

// Application Settings
var imgs = ['png'];
var httpPort = 9000;
//var uristring = process.env.MONGOLAB_URI || process.env.MONGOHQ_URL || 'mongodb://localhost:27017/Build';
var uristring = 'mongodb://'+process.env.MONGODB_PORT_27017_TCP_ADDR+':'+process.env.MONGODB_PORT_27017_TCP_PORT+'/Build';

mongoose.connect(uristring, function (err, res) {
    if (err) {
        console.log('process.env ' + process.env);
        console.log('process.env.MONGOLAB_URI ' + process.env.MONGOLAB_URI);
        console.log('process.env.MONGOHQ_URL ' + process.env.MONGOHQ_URL);
        console.log('ERROR connecting to: ' + uristring + '. ' + err);
    } else {
        console.log('Succeeded connected to: ' + uristring);
    }
});

// Image Data Schema
var ImageDataSchema = new Schema({
    url: {type: String, trim: true},
    thumb: {type: String, trim: true},
    bin: {type: String, trim: true},
    contentType: {type: String, trim: true}
});

// Exclude bin(ar), version and _id from result set being returned to the UI
ImageDataSchema.set('toJSON', {
    transform: function (doc, ret, options) {
        ret.imgId = ret._id;
        delete ret.__v;
        delete ret._id;
        delete ret.bin;
    }
});

var TaskSchema = new Schema({
    name: {
        type: String,
        trim: true
    },
    kind: {
        type: String,
        enum: ['thumbnail', 'detail']
    },
    url: {type: String, trim: true},
    createdAt: {type: Date, required: true, default: Date.now()},
    imgs: [ImageDataSchema]
});

// Create schema index
TaskSchema.index({createdAt: 1});

// Create TaskSchema model
var TaskModel = mongoose.model("Task", TaskSchema);

// Middleware i.e. do some logic like fire an email or trigger some other event
TaskSchema.pre('save', function (next) {
    console.log('Task saved...');
    next();
});

// Exclude bin(ar), version and _id from result set being returned to the UI
TaskSchema.set('toJSON', {
    transform: function (doc, ret, options) {
        ret.taskId = ret._id;
        delete ret.data;
        delete ret.__v;
        delete ret._id;
    }
});

// Say hi!
app.get('/api', function (req, res) {
    console.log('api() ');
    res.json({message: 'API is running'});
});

// Say hi!
app.post('/api/tasks', function (req, res) {
    console.log('api/tasks(), post');
    var task = TaskModel({name: 'Test', kind: 'detail'});
    task.save(function(err, item){
        if (err){
            return res.json({error: err});
        } else {
            return res.json(item);
        }
    })
    
});

// Show ALL tasks restricted to 10 and sorted descending
app.get('/api/tasks', function (req, res) {
    console.log('api/tasks(), get');
    return TaskModel.find(function (err, tasks) {
        if (err || !tasks) {
            res.statusCode = 500;
            return res.json({error: 'Server Error'});
        } else {
            return res.json(tasks);
        }
    }).sort([['createdAt', 'descending']]).limit(10);
});

// Show a specific task
app.get('/api/tasks/:taskid', function (req, res) {
    console.log('api/tasks(), taskid - ' + req.param('taskid'));
    return TaskModel.findById(req.param('taskid'), function (err, task) {
        if (err || !task) {
            res.statusCode = 500;
            return res.json({error: 'Task not found'});
        } else {
            return res.json(task);
        }
    });
});

// Read file from loaded tmp
app.get('/api/file', function (req, res) {
    console.log('api/file(), get');

    fs.readFile('/var/app/current/build/build.json', 'utf8', function (err, data) {
        if (err) {
           return res.json(err);
        } else {
            return res.json(JSON.parse(data));
        }
    });
});

var server = app.listen(httpPort, function () {
    console.log('listening on port %d', server.address().port);
});