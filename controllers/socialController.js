const Database = require("../database").userModel;

const listFriends = (user) => {
    let friendNames = [];
    for (let friendEmail of user.friends) {
        let friend = Database.findOne(friendEmail)
        friendNames.push(`${friend.name} (${friend.email})`);
    }
    return friendNames
}

const socialController = {
    findAndAddFriend: function(req, res) {
        const user = Database.findOne(req.user.email);
        const friendNames = listFriends(user)
        try {        
            let friendSearch = Database.findOne(req.body.email);
            let friendName = `${friendSearch.name} (${friendSearch.email})`;
            
            if (friendSearch.email == user.email) {
                throw new Error("Cannot add yourself as a friend");
            } else if (friendNames.indexOf(friendName) > -1) {
                throw new Error(`${friendName} is already your friend!`);
            } else {
                user.friends.push(friendSearch.email);
                res.redirect("/friends")
            }
        } catch (err) {
            const friendNames = listFriends(user)
            res.render("reminder/friends", {friends: friendNames, 
                                            addError: err});
        }

    },
    list: function(req, res) {
        console.log(req.user);
        const user = Database.findOne(req.user.email)
        const friendNames = listFriends(user)
        res.render("reminder/friends", {friends: friendNames, addError: null});
    },
}

module.exports = socialController