const db = require('../Config/database')
// const firebase = require('../firebase')

module.exports = {
    uploadPersondata: async(req, res) => {
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
    
      return true 
    }
}

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