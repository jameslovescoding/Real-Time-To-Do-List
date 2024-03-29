const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const autoIncrement = require('mongoose-auto-increment')
const http = require('http')
const socketServer = require('socket.io')

const app = express();

const todoModel = require('./models/todoModel')  //todo model

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

// MONGOOSE CONNECT
// ===========================================================================
mongoose.connect('mongodb://localhost:27017/local')

var db = mongoose.connection
db.on('error', () => { console.log('---Gethyl FAILED to connect to mongoose') })
db.once('open', () => {
	console.log('+++Gethyl connected to mongoose')
})

var serve = http.createServer(app);
var io = socketServer(serve);
serve.listen(3000, () => { console.log("+++Gethyl Express Server with Socket Running!!!") })


/***************************************************************************************** */
/* Socket logic starts here																   */
/***************************************************************************************** */
const connections = [];
io.on('connection', function (socket) {
	console.log("Connected to Socket!!" + socket.id)
	connections.push(socket)
	socket.on('disconnect', function () {
		console.log('Disconnected - ' + socket.id);
	});

	var cursor = todoModel.find({}, "-_id itemId item completed")
		.then(result => {
			socket.emit('initialList', result)
			console.log("+++Gethyl GET worked!!")
		})
		.catch(err => {
			console.log("---Gethyl GET failed!!", err)
		})
	// 		.cursor()
	// cursor.on('data',(res)=> {socket.emit('initialList',res)})

	socket.on('addItem', (addData) => {
		var todoItem = new todoModel({
			itemId: addData.id,
			item: addData.item,
			completed: addData.completed
		})

		todoItem.save()
			.then(result => {
				io.emit('itemAdded', addData)
				console.log({ message: "+++Gethyl ADD NEW ITEM worked!!" })
			})
			.catch(err => {
				console.log("---Gethyl ADD NEW ITEM failed!! " + err)
			})
	})

	socket.on('markItem', (markedItem) => {
		var condition = { itemId: markedItem.id },
			updateValue = { completed: markedItem.completed }
		console.log(markedItem)
		todoModel.updateOne(condition, updateValue)
			.then((result) => {
				io.emit('itemMarked', markedItem)
				console.log({ message: "+++Gethyl MARK COMPLETE worked!!" })
			})
			.catch(err => {
				console.log("---Gethyl MARK COMPLETE failed!! " + err)
			})
	})

});