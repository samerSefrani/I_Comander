const fs = require('fs');
const bcrypt = require('bcrypt');

const userspath = __dirname + '/server-data/users.json';

let userdb = undefined;

function load() {
    fs.readFile(userspath, (err, data) => {
        if (err) {
            console.error(err);
            return;
        }
        userdb =  JSON.parse(data);
        // console.log(JSON.parse(data));
        console.log("Users Loaded")
    });
};

load();



async function save(){

    if(userdb == undefined) {
        console.log("Userdb undefined");
        return ;
    }
    let usersJson = JSON.stringify(userdb, null, 2);

    fs.writeFile(userspath, usersJson, err => {
        if (err) {
            console.error(err);
            // return false;
        } else {
            console.log("Saved Userdb to file");
        }
    });
};
exports.save = save;

  /**
   * Updates the user in the database and saves it to file.  IF the password is changes
   * it will compute the new password hash and updated the db. You cannot change the username or user id
   *
   * @param {number} id The id of the usere you want to update
   * @param {user} newuser The updated user object
   */
exports.update = function(id, newuser) {
    let i = userdb.users.findIndex(user=>user.id == id);

    if(userdb.users[i].username != newuser.username) throw "You Cant Change Userenames";
    if(userdb.users[i].id != newuser.id) throw "You Cant Change User Id";
    if(userdb.users[i].password != newuser.password) throw "User changePasswor(id, oldpw, newpw) to Change password";
    userdb.users[i] = newuser;
    console.log("Updated" + userdb.users[i].username);
    save();
};

function changePassword(id, oldpw, newpw){
    let i = userdb.users.findIndex(user=>user.id == id);

    let same = bcrypt.compareSync(oldpw, userdb.users[i].password);
    console.log(same);
    if(!same) return "Current Password Incorrect";
    if(oldpw == newpw) return true;

    let hashedPassword = bcrypt.hashSync(newpw, 10);
    userdb.users[i].password = hashedPassword;
    // console.log(hashedPassword);
    // console.log(userdb.users[i].password);
    save();
    return true
}
exports.changePassword = changePassword;


function addUser(req) {

    if(userdb.users.some(u=>u.username == req.body.username)) {
        throw "Username Already Exists";
    }

    let hashedPassword = bcrypt.hashSync(req.body.password, 10);
    console.log(hashedPassword);
    let newUser = {
        id: userdb.nextId++, //get next and increments
        username: req.body.username,
        displayName: req.body.username,
        email: req.body.email,
        role: 'guest',
        password: hashedPassword
    };
    console.log('Adding new User:', newUser);
    userdb.users.push(newUser);
    save();
    return newUser
}
exports.addUser = addUser;

exports.findByUsername = function(username, cb) {

    let u = userdb.users.find(user=>user.username == username);
    // console.log(userdb.users);
    // console.log(u);
    if (u == undefined) u = null;
    cb(null, u);
};

exports.findById = function(id, cb){
    let u = userdb.users.find(user=>user.id == id);
    if (u == undefined) u = null;
    cb(null, u);
};



// exports.findByUsername = function(username, cb) {
//     let jsonFile = __dirname + '/server-data/users.json';
//     fs.readFile(jsonFile, (err, data) => {
//         if (err) {
//             cb(err, null);
//             return;
//         }
//         let userdb = JSON.parse(data);
//         r = userdb.users.find(user => user.username == username);
//         console.log(r);
//         if (r == undefined) r = null;
//         cb(null, r);
//     });
// };
//
// exports.findById = function(id, cb){
//     let jsonFile = __dirname + '/server-data/users.json';
//     // console.log(jsonFile);
//     fs.readFile(jsonFile, (err, data) => {
//         // console.log(data)
//         if (err) {
//             cb(err, null);
//             return;
//         }
//         let userdb = JSON.parse(data);
//         r = userdb.users.find(user => user.id == id);
//         // console.log(r);
//         if (r == undefined) r = null;
//         cb(null, r);
//     });
// };

app.post('/api/edit_user', auth.apiAuthenticated, (req, res) => {

    // console.log(req.file.path);
    // console.log(req.file.encoding);
    // console.log(req.file.mimetype);

    console.log(req.body);
    let d;
    if (req.body.id == -1) {
        d = add();
    } else {
        d = get_user_by_id(req.body.id);
    }

   
    // console.log(d);
    // console.log(req.body);

    if (typeof req.body.username != "undefined") d.username = req.body.username;
    if (typeof req.body.password != "undefined") d.password = req.body.password;
    
    if (typeof req.body.displayName != "undefined") d.displayName = req.body.displayName;
    if (typeof req.body.role != "undefined") d.role = req.body.role;
    if (typeof req.body.email != "undefined") d.email = req.body.email;
    console.log(req.body.disabled);
    // if(typeof req.body.disabled != "undefined") {
    //if the disabled flag is not sent to the server the drone will be not disabled
    
    if (d.id == -1) {
        newd = users.add(d)
    }

    update(d);

    r = {
            users: users,
            updated_user: d
        };

    res.send(JSON.stringify(r));


});