const db = require('../Config/database')
const firebase = require('../firebase')

module.exports = {
    uploadImage: async(req, res) => {
        if(!req.file) {
            res.status(400).send("Error: No files found")
            } else {
            const imagefile = req.file
            const imageUrl = await getImageUrl(req, imagefile)
            console.log('hello', imageUrl)
            res.status(200).send({ message: "File uploaded.", imageUrl: imageUrl })
        }
    },
    Uppost: async(req, res) => {
            const data_postConfirm = req.body.data_postConfirm
            console.log('test', data_postConfirm)
            var addpost_sql = `INSERT INTO admin_post (date_post, image_post ,detail_post) VALUES 
          (
            '${data_postConfirm.date_post}', 
            '${data_postConfirm.image_post}', 
            '${data_postConfirm.detail_post}'
          )`;
          let addpost_result = await save_post(addpost_sql);
          console.log('resul', addpost_result)
    },
    getAlldata: async(req, res) => {
        db.query('SELECT * FROM person_info order by create_date DESC',(error, result) => {
            if(error) {
              console.log("error",error)
            }
            if(result.length) {
              res.send({
                status: 200,
                data : result
              })
            }
            else{
              res.send({
                status: 201,
                data : null
              })
            }
          })
    },
    getID: async(req, res) => {
        const data = req.query
    // console.log(data.id)
        db.query(`SELECT * FROM person_info AS a 
        INNER JOIN address AS b on a.num_id = b.num_id 
        INNER JOIN store_decoration AS c on a.num_id = c.num_id 
        INNER JOIN environment_place AS d on a.num_id = d.num_id  
        INNER JOIN surround_place AS e on a.num_id = e.num_id WHERE a.num_id = '${data.id} '` ,(error, result) => {
        if(error) {
            console.log("error",error)
        }
        if(result.length) {
            // console.log(result)
            res.send({
            status: 200,
            data : result
            
            })
        }
        else{
            res.send({
            status: 201,
            // data : null,
            
            })
            console.log("result")
        }
        })
    },
    approveUser: async(req, res) => {
        const data = req.body
        db.query(`UPDATE person_info SET status = 'อนุมัติแล้ว' WHERE num_id = '${data.id}'` ,(err) => {
          if(err) {
            console.log("err",err)
          }
          else{
            res.send({
              status: 200,
              messege: "Update success"
            })
            console.log("success")
          }
        })
    },
    rejectUser: async(req, res) => {
        const data = req.body
        db.query(`UPDATE person_info SET status = 'ไม่อนุมัติ' WHERE num_id = '${data.id}'` ,(err) => {
          if(err) {
            console.log("err",err)
          }
          else{
            res.send({
              status: 200,
              messege: "Update success"
            })
            console.log("success")
          }
        })
    },
    deleteUser: async(req, res) => {
        const id = req.body.id
        // console.log('hello', id)
        db.query(`DELETE FROM address WHERE num_id ='${id} '` ,(error, result) => {
          if(error) {
            console.log("error",error)
          }
    
          else{
            db.query(`DELETE FROM environment_place WHERE num_id ='${id} '` ,(error, result) => {
              if(error) {
                console.log("error",error)
              }
        
              else{
                db.query(`DELETE FROM store_decoration WHERE num_id ='${id} '` ,(error, result) => {
                  if(error) {
                    console.log("error",error)
                  }
            
                  else{
                    db.query(`DELETE FROM surround_place WHERE num_id ='${id} '` ,(error, result) => {
                      if(error) {
                        console.log("error",error)
                      }
                
                      else{
                        db.query(`DELETE FROM person_info WHERE num_id ='${id} '` ,(error, result) => {
                          if(error) {
                            console.log("error",error)
                          }
                    
                          else{
                            console.log('success')
                            res.send("Delete Success")
                            
                          }
                        })
                        
                      }
                    })
                    
                  }
                })
                
              }
            })
             
          }
        })
    },
    getPost: async(req, res) => {
        db.query('SELECT * FROM admin_post order by date_post DESC',(error, result) => {
            if(error) {
              console.log("error",error)
            }
            if(result.length) {
              res.send({
                status: 200,
                data : result
              })
            }
            else{
              res.send({
                status: 201,
                data : null
              })
            }
          })
    },
    deletePost: async(req, res) => {
        const post_id = req.body.post_id
        // console.log('hello', post_id)
        db.query(`DELETE FROM admin_post WHERE post_id ='${post_id} '` ,(error, result) => {
          if(error) {
            console.log("error",error)
          }
        })
    },
    // editPost: async(req, res) => {
    //     const post_id = req.body.post_id
    //     // console.log('hello', post_id)
    //     db.query(`UPDATE FROM admin_post SET image_post = ? , detail_post = ? WHERE post_id ='${post_id} '` ,(error, result) => {
    //       if(error) {
    //         console.log("error",error)
    //       }
    //     })
    // }
}

    async function save_post(sql) {
        return new Promise((resolve, reject) => {
        try {
            db.query(sql, function (err, result) {
            if (err) throw err;
            resolve(result);
            });
        }
        catch (ex) {
            reject(ex);
        }
        });
    }
    async function getImageUrl(req, imagefile) {
        return new Promise((resolve, reject) => {
            try {
                const nameArquivo = Date.now() + "." + imagefile.originalname.split(".").pop();
      
                const file = firebase.bucket.file(nameArquivo);
                
                const stream = file.createWriteStream({
                    metadata: {
                        contentType: req.file.mimetype
                    }
                })
                stream.on('error', (err) => {
                    console.log(err)
                })
                
                stream.on('finish', async() => {
                    const result = await file.makePublic()
                    const imageUrl = await `https://storage.googleapis.com/${result[0].bucket}/${nameArquivo}`
                    resolve(imageUrl);
                })
                stream.end(imagefile.buffer)
            }
            catch (ex) {
                reject(ex);
            }
        });
      }