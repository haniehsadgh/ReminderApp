let Database = require("../database").userModel
var myid = 0
let reminderController = {
    list: function(req, res) {
        // console.log(req.user);
        // let reminders = GetRemindersFromDatabase()
        const user = Database.findOne(req.user.email)
        let friendReminders = []

        // Find reminders of friends and mark them appropriately
        for (let friend of user.friends) {
            const friendUser = Database.findOne(friend)
            friendReminders.push({
                name: friendUser.name,
                email: friendUser.email,
                reminderList: friendUser.reminders
            })
        }

        res.render("reminder/index", {reminders: user.reminders, 
            friendReminders: friendReminders});
    },
    new: function(req, res) {
        res.render("reminder/create")
    },
    // express that we are using doesn't have the ability to take data from user's form and show it in webserver
    create: function(req, res) {
        let userData = req.body
        // returns a dictionary containing the user's inputed data
        const user = Database.findOne(req.user.email)
        // console.log(userData)
        let reminder = {
            id: user.reminders.length + 1, // Database.cindy.reminders.lenght == 0 + 1 = 1 then 2, ...
            title: req.body.title,
            date_time: req.body.datetime,
            description: req.body.description,
            completed: false
        }
        // for(let key in reminder){
        //     console.log(reminder[key].length)
        //     // if((reminder[key]).length == 0){
        //     //     window.alert("None of the fields can be empty")

        //     // }else{
        //         // }
        //     }
        user.reminders.push(reminder)
        res.redirect("/reminder")
    },
    listOne: function(req, res) {
        let reminderToFind = req.params.id // -> 1
        const user = Database.findOne(req.user.email)
        // .find() will return the value of the first element in the provided array that satisfies the provided testing function
        let searchResult = user.reminders.find(function(reminder) { 
            return reminder.id == reminderToFind
        })
        // console.log(searchResult)
        if(searchResult) {
            res.render("reminder/single-reminder", {reminderItem: searchResult})
        }
        else {
            // res.render("reminder/index", {reminders: Database.cindy.reminders})
            // easier way
            res.redirect("/reminder")
        }
        
    },
    edit: function(req, res) {
        let reminderToFind = req.params.id // -> 1
        console.log(req.params.id)
        const user = Database.findOne(req.user.email)
        let searchResult = user.reminders.find(function(reminder) { 
            return reminder.id == reminderToFind
        })
        if(searchResult != undefined) {
            res.render("reminder/edit", {reminderItem: searchResult})
        }
        else {
            res.redirect("/reminder")
        } 
    },
      update: (req, res) => {
        // implement this code
        let reminderToFind = req.params.id
        console.log("reminder to find", reminderToFind)
        const user = Database.findOne(req.user.email)
        let searchResult = user.reminders.findIndex((reminder) => reminder.id == req.params.id)
        if (searchResult != undefined) {
            user.reminders[searchResult]["title"] = req.body.title
            user.reminders[searchResult]["date_time"] = req.body.datetime,
            user.reminders[searchResult]["description"] = req.body.description
            if (req.body.completed === "True") {
                user.reminders[searchResult]["completed"] = true
            }
            else if (req.body.completed === "False") {
                user.reminders[searchResult]["completed"] = false 
            }
            // res.redirect("/reminder")
            res.redirect("/reminder/"+reminderToFind)
        }
      },
    subtask: function(req, res) {
        let reminderToFind = req.params.id // -> 1
        const user = Database.findOne(req.user.email)
        let searchResult = user.reminders.find(function(reminder) { 
            return reminder.id == reminderToFind
        })
        if(searchResult) {
            res.render("reminder/subtask", {reminderItem: searchResult})
        }
        else {
            res.redirect("/reminder")
        } 
    },
    add: function(req, res) {
        let reminderToFind = req.params.id
        const user = Database.findOne(req.user.email)
        let searchResult = user.reminders.findIndex((reminder) => reminder.id == req.params.id)
        console.log("search", searchResult)
        let sub 
        if (searchResult != undefined) {
            if(user.reminders[searchResult]["subtasks"]) {
                user.reminders[searchResult]["subtasks"].push(req.body.subtask)
            } else {
                user.reminders[searchResult]["subtasks"] = [req.body.subtask]
            }
            res.redirect("/reminder/"+reminderToFind)

        }
        console.log(user.reminders.subtasks)
    },
    tag: function(req, res) {
        let reminderToFind = req.params.id // -> 1
        const user = Database.findOne(req.user.email)
        let searchResult = user.reminders.find(function(reminder) { 
            return reminder.id == reminderToFind
        })
        if(searchResult) {
            res.render("reminder/tag", {reminderItem: searchResult})
        }
        else {
            res.redirect("/reminder")
        } 
    },
    addtag: function(req, res) {
        let reminderToFind = req.params.id
        const user = Database.findOne(req.user.email)
        let searchResult = user.reminders.findIndex((reminder) => reminder.id == req.params.id)
        // console.log("search", searchResult)
        if (searchResult != undefined) {
            // console.log("tag", user.reminders[searchResult]["tag"])
            if(user.reminders[searchResult]["tag"]) {
                // console.log("tag", user.reminders[searchResult]["tag"].length)
                let tag = {
                    tagid: user.reminders[searchResult]["tag"].length,
                    title: req.body.tag
                }
                user.reminders[searchResult]["tag"].push(tag)
            } else {
                let tag = {
                    tagid: 0,
                    title: req.body.tag
                }
                user.reminders[searchResult]["tag"] = [tag]
            }
            // console.log("tag", user.reminders[searchResult]["tag"])
            // if(user.reminders[searchResult]["tag"]) {
            //     user.reminders[searchResult]["tag"].push(req.body.tag)
            // } else {
            //     user.reminders[searchResult]["tag"] = [req.body.tag]
            // }
            res.redirect("/reminder/"+reminderToFind)

        }
        console.log("user", user)
    },
    delete: function(req, res) {
        let reminderToFind = req.params.id
        const user = Database.findOne(req.user.email)
        let searchResult = user.reminders.find(function(reminder) { 
            return reminder.id == reminderToFind
        })
        if(searchResult){
            user.reminders.splice(reminderToFind-1,1)
            res.redirect("/reminder")
        }
    },
    close: function(req, res) {
        let reminderToFind = req.params.id
        let tagtofind = req.params.tagid
        const user = Database.findOne(req.user.email)
        let searchResult = user.reminders.findIndex((reminder) => reminder.id == req.params.id)
        let searchtag = user.reminders[searchResult]["tag"].findIndex((tagn) => tagn.tagid == req.params.tagid)
        let taglist = user.reminders[searchResult]["tag"]

        if(searchResult != undefined){

            taglist.splice(searchtag,1)
            console.log("2",user.reminders[searchResult]["tag"])
            res.redirect("/reminder/"+reminderToFind)
        }
    },
    export: function(req, res) {
        const user = Database.findOne(req.user.email)
        const { jsPDF } = require("jspdf");
        const doc = new jsPDF({ putOnlyUsedFonts: true, orientation: "landscape" });
        // for( let key of user.reminders){
        //     exported.push(user.reminders[key])
        //     // exported.push(user.reminders[key])
        // }
        // console.log(exported)
        doc.text(JSON.stringify(user.reminders), 10, 10);
        // doc.text(exported, 10, 10)
        doc.save("list-of-reminders.pdf")
        res.redirect('/reminder');
    }
}




module.exports = reminderController