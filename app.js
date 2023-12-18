// Express Declarations
const express = require('express');
const app = express();
app.use(express.static("public"));

// EJS Declarations
app.set('view engine', 'ejs');

// Body-Parser Declarations
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));

// Set Local Port Value
const port = 3000;

// MongoDB Declarations
const mongodb = require('mongodb');

// Mongoose Declarations
const mongoose = require('mongoose');
mongoose.connect("mongodb+srv://OmNC501:webproject@cluster0.w0b9oii.mongodb.net/todolistDB");

// Lodash Declarations
const _ = require('lodash');

const itemSchema = {
    name: String
}

const listSchema = {
    name: String,
    items: [itemSchema]
}

const List = mongoose.model("List", listSchema);

app.get("/", function (req, res) {
    res.redirect("/home");
});

app.post("/", function (req, res) {

    const itemName = req.body.newItem;
    const listName = req.body.button;
    const item = new List({
        name: itemName
    });

    List.findOne({ name: listName })
        .exec()
        .then(list => {
            list.items.push(item);
            list.save();
            res.redirect("/" + listName);
        })
});

app.get("/:type", function (req, res) {
    const title = _.capitalize(req.params.type);

    List.findOne({ name: title })
        .exec()
        .then(foundItem => {
            if (!foundItem) {
                console.log("Ain't exist");
                const list = new List({
                    name: title,
                });
                list.save();
                res.redirect("/" + title)
            } else {
                res.render("list", { listName: foundItem.name, newListItem: foundItem.items })
            }
        });
});

app.post("/delete", function (req, res) {
    const checkedItemID = req.body.checkbox;
    const listName = req.body.listName;

    List.findOneAndUpdate({ name: listName }, { $pull: { items: { _id: checkedItemID } } }).exec();
    res.redirect("/" + listName);
});



app.listen(port, function (req, res) {
    console.log("Server is running on port " + port);
});
