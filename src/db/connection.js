const mongodb = require("mongodb");
const offline = "mongodb://localhost/27017";
const db_status = {
    connection: null,
};
module.exports = {
    db_connect: function () {
        return new Promise((resolve, reject) => {
            mongodb.MongoClient.connect(online, { useUnifiedTopology: true }, (err, data) => {
                if (err) {                    
                    reject(err);
                } else {
                    db_status.connection = data;
                    resolve(data);
                }
            });
        });
    },
    get_db: function () {       
        return new Promise((resolve) => {
            
            if (db_status.connection === null)
            {
                tt = setInterval(() => {
                    console.log("did not");
                    if (db_status.connection !== null) {
                        console.log("db connected");
                        resolve(db_status.connection);
                        clearInterval(tt);
                    }
                }, 500);
            }
            else if (db_status.connection !== null) {
                resolve(db_status.connection);
        }
             else {
                console.log("something went wrong on fetching db");
            }
        });
         
    }   
};
