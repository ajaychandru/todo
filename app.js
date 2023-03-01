const express = require('express');
const bodyParser = require('body-parser');
const _ = require('lodash');
// const date=require(__dirname+"/date.js");
const mongoose = require('mongoose');
const fs = require('fs');

const uri = fs.readFileSync('mongodb-uri.txt', 'utf8').trim();

const { urlencoded } = require('body-parser');
const { name } = require('ejs');
const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.set('view engine', 'ejs');
mongoose.set('strictQuery', true);
mongoose.connect(uri);

const homeListSchema = {
    name: {
        type: String,
        required: true
    }
};
const HomeList = new mongoose.model('HomeList', homeListSchema);
// let newItemArray=[];
// let newWorkListArray=[];

// const item1=new HomeList({
//     name:"Do Assignment"
// });

// const item2=new HomeList({
//     name:"Take tablets"
// });
// const item3=new HomeList({
//     name:"Do meditation"
// });

const defaultItems = [];

const customListSchema = {
    name: String,
    items: [homeListSchema]
}

const CustomList = mongoose.model('customList', customListSchema);




app.get("/", function (req, res) {
    // let day=date.getDay();
    HomeList.find({}, (err, foundItem) => {



        if (err)
            console.log(err);
        else {
            res.render('list', { title: "Today", newItemArray: foundItem });
        }




    });

});

app.get('/:listName', (req, res) => {  // custom list url
    const customListName = _.capitalize(req.params.listName);

    CustomList.findOne({ name: customListName }, (err, result) => {
        if (err) {
            console.log(err);
        } else {
            if (result == null) {
                const list = new CustomList({
                    name: customListName,
                    items: defaultItems
                });
                list.save();
                res.redirect("/" + customListName);
            } else {
                res.render('list', { title: result.name, newItemArray: result.items })
            }
        }
    })

})
app.get("/about", (req, res) => {
    res.render("about");
})

app.post("/", (req, res) => {
    let newItem = req.body.newItem;
    // get data from form
    const btnValue = req.body.button;


    const itemEntered = new HomeList({ // creating new model
        name: newItem // assigning newitem to name and sending to database
    });

    if (btnValue === "Today") {
        itemEntered.save();
        res.redirect('/');

    } else {
        CustomList.findOne({ name: btnValue }, (err, result) => {
            result.items.push(itemEntered);
            result.save();
            res.redirect('/' + btnValue);
        });
    }

});

app.post("/delete", (req, res) => {
    const itemDelete = req.body.checked;
    const listNameDelete = req.body.deleteItem;

    if (listNameDelete === "Today") {
        HomeList.findByIdAndRemove(itemDelete, (err) => { // deleting based on id
            if (err)
                console.log(err);
            else
                console.log("successfully deleted");
        });
        res.redirect('/');
    } else {
        CustomList.findOneAndUpdate({ name: listNameDelete }, { $pull: { items: { _id: itemDelete } } }, (err, result) => {
            if (!err) {
                res.redirect("/" + listNameDelete);
            }
        })
    }

});

app.listen(process.env.PORT || 3000, function () {
    console.log("listening in port 3000");
});
