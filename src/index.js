const express = require('express')
const cors = require('cors')
const mysql = require('mysql')
const bodyparser = require('body-parser')
const { response } = require('express')

const firebase = require('./firebase')
const multer = require('multer')
const upload = multer({
  storage: multer.memoryStorage()
})

const app = express()
const port = 3001
app.use(cors())

app.use(bodyparser.json())
app.use(bodyparser.urlencoded({ extended: true }))

app.use(express.static('public'))

const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "root",
    database: "mydb",
    port:"8889" 
  });

    db.connect(function(err) {
    if (err) throw err;
    console.log("Connected!")
  });
  
  app.post('/upload', upload.single('file'), async(req, res) => {
    if(!req.file) {
        res.status(400).send("Error: No files found")
    } else {

        const imagefile = req.file
        const imageUrl = await getImageUrl(req, imagefile)
        console.log('hello', imageUrl)
        res.status(200).send({ message: "File uploaded.", imageUrl: imageUrl })
    }
})

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

  app.post('/insert-data',async (req,res) => {
    const data_personConfirm = req.body.data_personConfirm
    const data_detailConfirm = req.body.data_detailConfirm
    // console.log(data_personConfirm)
    // console.log(data_detailConfirm)

  //Insert a record in the "customers" table:
  var person_sql = `INSERT INTO person_info (num_id,create_date ,prefix , name, lastname, img_card,  num_phone, num_phone_home, fax, email, experience, experience_detail, status) VALUES 
  (
    '${data_personConfirm.num_id}', 
    '${data_personConfirm.create_date}', 
    '${data_personConfirm.prefix}',
    '${data_personConfirm.name}',
    '${data_personConfirm.lastname}',
    '${data_personConfirm.img_card}',
    '${data_personConfirm.num_phone}',
    '${data_personConfirm.num_phone_home}',
    '${data_personConfirm.fax}',
    '${data_personConfirm.email}',
    '${data_personConfirm.experience}',
    '${data_personConfirm.experience_detail}',
    '${data_personConfirm.status}'
  )`;

  var address_sql = `INSERT INTO address (num_id, province ,district , sup_district, zipecode, home_number,  home_group, home_build, home_floor, room, home_road) VALUES 
  (
    '${data_personConfirm.num_id}', 
    '${data_detailConfirm.province}', 
    '${data_detailConfirm.district}',
    '${data_detailConfirm.sup_district}',
    '${data_detailConfirm.zipecode}',
    '${data_detailConfirm.home_number}',
    '${data_detailConfirm.home_group}',
    '${data_detailConfirm.home_build}',
    '${data_detailConfirm.home_floor}',
    '${data_detailConfirm.room}',
    '${data_detailConfirm.home_road}'
  )`;

  var store_decoration_sql = `INSERT INTO store_decoration (num_id, n_place ,latitude , longitude, landload, meter_area,  store_decorate, store_descrip) VALUES 
  (
    '${data_personConfirm.num_id}', 
    '${data_detailConfirm.n_place}', 
    '${data_detailConfirm.latitude}',
    '${data_detailConfirm.longitude}',
    '${data_detailConfirm.landlord}',
    '${data_detailConfirm.meter_area}',
    '${data_detailConfirm.store_decorate}',
    '${data_detailConfirm.store_descrip}'
  )`;

  var environment_place_sql = `INSERT INTO environment_place (num_id, environment ,environment_descrip,parking, raeson_detail) VALUES 
  (
    '${data_personConfirm.num_id}', 
    '${data_detailConfirm.environment}', 
    '${data_detailConfirm.environment_descrip}',
    '${data_detailConfirm.parking}',
    '${data_detailConfirm.raeson_detail}'
  )`;

  var surround_place_sql = `INSERT INTO surround_place (num_id, local_mall ,local_tea , local_office, local_accom, local_study, local_gas, local_community, local_other) VALUES 
  (
    '${data_personConfirm.num_id}', 
    '${JSON.stringify(data_detailConfirm.local_mall)}', 
    '${JSON.stringify(data_detailConfirm.local_tea)}',
    '${JSON.stringify(data_detailConfirm.local_office)}',
    '${JSON.stringify(data_detailConfirm.local_accom)}',
    '${JSON.stringify(data_detailConfirm.local_study)}',
    '${JSON.stringify(data_detailConfirm.local_gas)}',
    '${JSON.stringify(data_detailConfirm.local_community)}',
    '${JSON.stringify(data_detailConfirm.local_other)}'
  )`;
  
  let person_result = await save_info(person_sql);
  console.log('resul', person_result)

  let address_result = await save_info(address_sql)
  console.log('resul', address_result)

  let store_dec_result = await save_info(store_decoration_sql)
  console.log('resul', store_dec_result)

  let environment_place_result = await save_info(environment_place_sql)
  console.log('resul', environment_place_result)

  let surround_place_result = await save_info(surround_place_sql)
  console.log('resul', surround_place_result)

  return true })

  async function save_info(sql) {
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


  app.get('/person-info/all' , async (req,res) => {
    // console.log("XOXOXO")
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
  }),

  app.get('/person-info/id' , async (req,res) => {
    // console.log("XOXOXO")
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
  }),

  app.put('/admin/approve/status' , async(req, res) => {
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
    // console.log(req.body)
  }),

  app.put('/admin/noneapprove/status' , async(req, res) => {
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
    // console.log(req.body)
  })
  app.post('/delete-data/id' , async (req,res) => {
    const id = req.body.id
    console.log('hello', id)
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
  }),
 


app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
  })


  

