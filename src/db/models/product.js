const db = require("../connection");
var Obj = require("mongodb").ObjectId;
module.exports = {
    add_product: (data) => {
        return new Promise((resolve, reject) => {
            db.get_db()
                .then((con) => {
                    con.db("Leeyet")
                        .collection("products")
                        .insertOne( data )
                        .then((data) => {                            
                            resolve(data);
                        })
                        .catch((err) => {
                            console.log("error occured in inserting product to database (db/models/product.js/add_product)  : ", err);
                            reject();
                        });
                })                                    
                
        });
    },
    update_product: (whom,which, what) => {
        return new Promise((resolve, reject) => {
            db.get_db()
                .then((con) => {
                    con.db("Leeyet")
                        .collection("products")
                        .updateOne({_id:Obj(whom)},{$set:{[which]:what}})
                        .then((data) => {                            
                            resolve(data);
                        })
                        .catch((err) => {
                            console.log("error occured while  updating  a product in database  (db/models/product.js/update_product)  : ", err);
                            reject();
                        });
                })                                    
                
        })
    },
    edit_product: (whom,data) => {
        return new Promise((resolve, reject) => {
            db.get_db()
                .then((con) => {
                    con.db("Leeyet")
                        .collection("products")
                        .updateOne({ _id: Obj(whom) }, { $set:data })
                        .then((data) => {                            
                            resolve(data);
                        })
                        .catch((err) => {
                            console.log("error occured while  editing  a product in database  (db/models/product.js/edit_product)  : ", err);
                            reject();
                        });
                })                                    
                
        })
    },
    delete_product: (whom) => {
        return new Promise((resolve, reject) => {
            db.get_db()
                .then((con,data) => {
                    con.db("Leeyet")
                        .collection("products")
                        .deleteOne({_id:Obj(whom)})
                        .then((data) => {                            
                            resolve(data);
                        })
                        .catch((err) => {
                            console.log("error occured while  deleting  a product from database  (db/models/product.js/delete_product)  : ", err);
                            reject();
                        });
                })                                    
                
        }) 
    },
    get_all_product: () => {
        return new Promise((resolve, reject) => {
            db.get_db().then((con) => {
                let data = con.db("Leeyet").collection("products").find().toArray();
                resolve(data);
            }).catch(()=>reject())

        })
    }
};
