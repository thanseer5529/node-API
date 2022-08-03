// https://leeyet-api-test.herokuapp.com

const express = require("express");
const path = require("path")
const app = express();
const fs = require("fs")
const fp = require("express-fileupload");
app.use(express.json());
 
app.use((req,res,next)=>{ 

res.header("Access-Control-Allow-Origin","*")
res.header("Access-Control-Allow-Headers","")
if(req.method==="OPTIONS")
{
res.header("Access-Control-Allow-Methods","PUT,POST,PATCH,GET,DELETE")
return res.status(200).json({})
}
next()
})

app.use(express.static(`${__dirname}/images/products/`));
// app.use(express.static(path.join(__dirname, "/images")));
app.use(fp());
const db = require("../src/db/connection");
const product_db = require("../src/db/models/product");
const { log } = require("console");
const { fstat } = require("fs");
const product = require("../src/db/models/product");
const port = process.env.PORT || 4000;

app.listen(port, () => {
    console.log(`connection established on  port ${port}`);
});

// to connect database to server 
//
//
//
//
db.db_connect()
    .then(() => {
        console.log("db connected.....");
    })
    .catch((err) => {
        console.log("db connection problem : ", err);
    });

// welcome
//
//testFolder
//
//
app.get("/", (req, res) => {
    res.send("welcome to my api");
});
// get all product
//
//
//
//
app.get("/get_all", (req, res) => {
    product_db.get_all_product().then((data) => {
        res.json(data)
    }).catch(() => {
        res.json({ acknowledgement: false, err_message: "could not fetch  products", err: true });

    })
});
// to add product 
//
//
//
//
app.post("/add_product", (req, res) => {
    let keys = Object.keys(req.body);
    let err_message = [];
    console.log(req.body);

    if (keys.length != 3) {
        err_message.push("invalid  number of parameters");
    } else {
        let element = ["Name", "Description", "Price"];
        for (el of keys) {
            if (!element.includes(el)) {
                err_message.push("Enter fields properly ");
                break;
            }
        }

    }
    if (!req.files) {
        err_message.push("Product image required");
    }
    if (req.body.Price) {
        if (req.body.Price.search("[a-z A-Z]") >= 0) err_message.push("Price should be a number");
    }
    if (err_message.length > 0) {
        res.json({ acknowledgement: false, err_message: err_message });
    } else {

        // res.json()
        req.body.image_count = Array.isArray(req.files.Image) ? req.files.Image.length : 1;
        if (req.body.image_count == 1) {
            let temp = req.files.Image;
            req.files.Image = []
            req.files.Image.push(temp);
        }

        product_db
            .add_product(req.body)
            .then(async (data) => {
                let id = data.ops[0]._id;
                console.log(id, "id");
                let count = 0;
                let err_check = false;
                console.log(req.files.Image, "img");
                if (req.files.Image) {
                    for (let i in req.files.Image) {
                        count++;
                        await req.files.Image[i]
                            // .mv(path.join(__dirname,"/images/products/", id + "_", count, ".jpg"))
                            .mv(`${__dirname}/images/products/${id}_${count}.jpg`)
                            .then(() => {
                                console.log("product image uploaded", count);
                            })
                            .catch((err) => {
                                console.log("error while uploading ", count, " product image ", err);
                                err_check = true;
                            });
                    }
                    if (!err_check) res.json({ acknowledgement: true });
                    else res.json({ acknowledgement: true, err: true, err_message: " product uploaded and image could not uploaded" });
                }
            })
            .catch(() => {
                res.json({ acknowledgement: false, err_message: "product could not uploaded" });
            });
    }

});

// to update product 
//
//
//
//
app.put("/update_product", (req, res) => {
    if (!req.body.Id || !req.body.Key) {
        res.json({ acknowledgement: false, err_message: "please provide the necessary  fields to update", err: true });
    }
    else {


        let element = ["Name", "Description", "Price", "Image"];
        console.log(req.body);
        if (element.includes(req.body.Key)) {
            // if (req.files && req.body.Key=="Image")
            // {
            //     console.log("ertetrwtwerere");
            //     }
            if (req.files && req.body.Key == "Image") {
                if (req.files.Value) {
                    let img_id = req.body.Id
                    let rm_err = [];
                    let up_err = [];
                    fs.readdir(__dirname + "/images/products/", async (err, files) => {
                        if (!err) {
                            files.forEach(file => {
                                if (file.startsWith(img_id)) {
                                    fs.unlink(__dirname + "/images/products/" + file, (err) => {
                                        if (!err) {
                                            rm_err.push(file);
                                        }
                                    })
                                }
                            });


                            let img_count = Array.isArray(req.files.Value) ? req.files.Value.length : 1;
                            if (img_count == 1) {
                                let temp = req.files.Value;
                                req.files.Value = []
                                req.files.Value.push(temp);
                            }
                            let img_c = 0
                            // console.log("img",req.files.Value);
                            for (let j of req.files.Value) {
                                console.log(j.name);
                                img_c++
                                j.mv(__dirname + "/images/products/" + img_id + "_" + img_c + ".jpg", (err) => {
                                    if (err)
                                        up_err.push()
                                })
                            }
                            let res_obj = {

                            }
                            if (up_err.length > 0 || rm_err.length > 0) {
                                res_obj.acknowledgement = false
                                res_obj.err_message = "error occured"
                                res_obj.err = {
                                    image_removing: rm_err,
                                    image_insertion: up_err
                                }
                            }
                            else {
                                res_obj.acknowledgement = true
                                res_obj.message = "product image updated",
                                    err = false

                            }
                            res.json(res_obj)


                        }
                        else {
                            res.json({ acknowledgement: false, err_message: "error in reading image file", err: true });

                        }
                    });




                }
                else {
                    res.json({ acknowledgement: false, err_message: "must need Value field to contain image ", err: true });
                }

            }
            else {
                if (!req.body.Value) {
                    res.json({ acknowledgement: false, err_message: "please provide the necessary  fields to update11", err: true });

                }
                else {

                    product_db
                        .update_product(req.body.Id, req.body.Key, req.body.Value)
                        .then((data) => {
                            console.log(data.result, "data");
                            if (data.result.n >= 1)
                                res.json({ acknowledgement: true, msg: "product updated", err: false })
                            else
                                res.json({ acknowledgement: true, msg: "no product updated", err: true })
                        })
                        .catch(() => {
                            res.json({ acknowledgement: false, err_message: "could not update product", err: true });
                        });
                }
            }

        } else {
            res.json({ acknowledgement: false, err_message: "there is no key like you entered", err: true });
        }
    }
});
// to edit product 
//
//
//
//
app.patch("/edit_product", (req, res) => {
    console.log(req.body, "vokkey");
    let keys = Object.keys(req.body);
    let err_message = [];
    console.log(req.body);
    if (keys.length != 5) {
        err_message.push("invalid  number of parameters");
    } else {
        let element = ["Name", "Description", "Price", "Id", "Count"]
        keys.forEach((el) => {
            if (!element.includes(el)) err_message.push("Enter fields properly ");
        });
    }
    if (req.body.Price) {
        if (req.body.Price.search("[a-z A-Z]") >= 0) err_message.push("Price should be a number");
    }
    if (!req.files) {
        err_message.push("Product image required");
    }
    if (err_message.length > 0) {
        res.json({ acknowledgement: false, err_message: err_message, err: true });
    }
    else {
        let id = req.body.Id
        delete req.body.Id
        req.body.image_count = Array.isArray(req.files.Image) ? req.files.Image.length : 1;
        if (req.body.image_count == 1) {
            let temp = req.files.Image;
            req.files.Image = []
            req.files.Image.push(temp);
        }
        product_db.edit_product(id, req.body).then(async (data) => {
            if (data.result.n >= 1) {
                let count = Number(req.body.Count)
                console.log(count, "count");

                let unlink_err = false
                for (let i = 1; i <= count; i++) {

                    fs.unlink(__dirname + "/images/products/" + id + "_" + i + ".jpg", (err) => {
                        if (err) {
                            unlink_err = true
                            console.log("error while uploading ", i, " product image ", err);
                        }
                        else {
                            console.log("product image removed", i);
                        }
                    })
                }
                let err_check = false;
                let img_number = 0

                for (let i in req.files.Image) {
                    img_number++
                    await req.files.Image[i]
                        .mv(`${__dirname}/images/products/${id}_${img_number}.jpg`)
                        .then(() => {
                            console.log("product image uploaded", img_number);
                        })
                        .catch((err) => {
                            console.log("error while uploading ", img_number, " product image ", err);
                            err_check = true;
                        });
                }
                res.json({
                    acknowledgement: true, msg: "product edited", err: {
                        remove_image_err: unlink_err,
                        insert_image_err: err_check
                    }
                })
            }
            else {
                res.json({ acknowledgement: true, msg: "no product edited", err: true })

            }

        }).catch(() => {
            res.json({ acknowledgement: false, err_message: "could not edit the product", err: true });

        })
    }
})
// to delete product 
//
//
//
//

app.delete("/delete_product", (req, res) => {
    product_db.delete_product(req.query.Id).then((data) => {
        console.log(data.result);
        let rm_err = [];
        if (data.result.n >= 1) {

            fs.readdir(__dirname + "/images/products/", (err, files) => {
                if (!err) {
                    files.forEach(file => {
                        if (file.startsWith(req.query.Id)) {
                            fs.unlink(__dirname + "/images/products/" + file, (err) => {
                                if (!err) {
                                    rm_err.push(file);
                                }
                            })
                        }
                    });

                    let obj = {
                        oacknowledgement: true,
                        err: rm_err

                    }
                    if (rm_err.length > 0) {
                        obj.msg = "product removed but product image not"
                    }
                    else {
                        obj.msg = "product sucessfully removed"
                    }
                    res.json(obj)
                }

            })
        }
        else {
            res.json({ acknowledgement: true, msg: "no product delted", err: true })
        }

    }).catch(() => {
        res.json({ acknowledgement: false, err_message: "could not delete the product", err: true });
    })
})

          
