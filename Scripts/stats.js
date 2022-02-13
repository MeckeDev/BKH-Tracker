const db = require('electron-db');
const path = require('path');
var gkm = require('gkm');


const db_location = path.join(__dirname, '')
db.createTable('bkh_drops', db_location, (succ, msg) => {
})

async function is_empty(){
    if(document.getElementById("stats").innerHTML.trim() == ""){
        create_dashboard()
    }
}

gkm.events.on('key.*', function(data) {

    if(this.event == "key.pressed"){
        if(data == "NumPad 8"){
            add_bkh(1)
        }
        if(data == "NumPad 2"){
            add_bkh(0)
        }
        if(data == "NumPad 5"){
            remove_last()
        }
    }
});

function padTo2Digits(num) {
    return num.toString().padStart(2, '0');
}
  
function formatDate(date) {
    return (
        [
        padTo2Digits(date.getDate()),
        padTo2Digits(date.getMonth() + 1),
        date.getFullYear(),
        ].join('.') +
        ' ' +
        [
        padTo2Digits(date.getHours()),
        padTo2Digits(date.getMinutes()),
        padTo2Digits(date.getSeconds()),
        ].join(':')
    );
}

function is_between_Date(check, days){

    var to = new Date();
    var from = formatDate(new Date(new Date().setDate(to.getDate() - days))).split(" ")[0].split(".");
    to = formatDate(to).split(" ")[0].split(".")
    var check = check.split(" ")[0].split(".")
    
    var from = new Date(from[2], parseInt(from[1])-1, from[0]); 
    var to   = new Date(to[2], parseInt(to[1])-1, to[0]);
    var check = new Date(check[2], parseInt(check[1])-1, check[0]);

    return (check >= from && check <= to)
}

async function add_bkh(dropped=1){

    let obj = new Object();
 
    obj.time = formatDate(new Date());
    obj.drop = dropped;

    
    const db_location = path.join(__dirname, '')
     
    if (db.valid('bkh_drops')) {
      db.insertTableContent('bkh_drops', db_location, obj, (succ, msg) => {
      })
    }

    location.reload()
}

async function set_buttons(btn=document.getElementById("btn_menu")){

    document.getElementById("btn_menu").style.backgroundColor = "white"
    document.getElementById("btn_today").style.backgroundColor = "white"
    document.getElementById("btn_week").style.backgroundColor = "white"
    document.getElementById("btn_month").style.backgroundColor = "white"
    document.getElementById("btn_year").style.backgroundColor = "white"
    document.getElementById("btn_all").style.backgroundColor = "white"

    btn.style.backgroundColor = "green"

}

async function remove_last(){

    var all_ids = []
    const db_location = path.join(__dirname, '')

    db.getAll('bkh_drops', db_location, (succ, data) => {
        if (succ) {

            for(x in data){
                all_ids.push(data[x]["id"])                
            }
        }
    })

    db.deleteRow('bkh_drops', db_location, {'id':  all_ids[all_ids.length - 1]}, (succ, msg) => {
        console.log(msg);
      });

      location.reload()
}

async function get_count(range, get=true){

    const db_location = path.join(__dirname, '')

    var got = 0
    var not = 0

    db.getAll('bkh_drops', db_location, (succ, data) => {
        if (succ) {

            for(x in data){

                if (is_between_Date(data[x]["time"], range)){
                    
                    if (data[x]["drop"] == 1){
                        got += 1
                    }
                    else{
                        not += 1
                    }

                }

            }
        }
    })

    if (get) return got
    return not
}

async function create_dashboard(btn){

    set_buttons(btn)

    drop_day = await get_count(1)
    drop_week = await get_count(7)
    drop_month = await get_count(30)
    drop_year = await get_count(365)
    drop_all = await get_count(50000)
    
    not_drop_day = await get_count(1, false)
    not_drop_week = await get_count(7, false)
    not_drop_month = await get_count(30, false)
    not_drop_year = await get_count(365, false)
    not_drop_all = await get_count(50000, false)

    html = `    
    <div style="color: #000; width: 90%" class="card text-center ml-5 mt-3">

        <h5>Add new Drop</h5>

        <div class="card-body">
        <button style="width: 30%" onclick="add_bkh(1)" type="button" class="btn float-left mr-1 bg-success">Dropped<br/> Numpad 8</button> 
        <button style="width: 30%" onclick="remove_last()" type="button" class="btn float-left mr-1 bg-warning">Remove last<br/> Numpad 5</button> 
            <button style="width: 30%" onclick="add_bkh(0)" type="button" class="btn float-left bg-danger">Not Dropped<br/> Numpad 2</button><br/>
        </div>
    </div>

    <div style="color: #000; width: 30%" class="card text-center float-left ml-4 mt-3">

        <h5>Today</h5>

        <div class="card-body">
            <p style="width: 48%" class="float-left mr-1 p-2 bg-success rounded">Yes<br/>${drop_day}</p> 
            <p style="width: 48%" class="float-left p-2 bg-danger rounded">No<br/>${not_drop_day}</p><br/>
            <p style="width: 98%" class="float-left mt-2 p-2 bg-warning rounded">Droprate<br/>${Math.round((100*drop_day)/(drop_day + not_drop_day))}%</p>
        </div>
    </div>

    <div style="color: #000; width: 30%" class="card text-center float-left ml-4 mt-3">

        <h5>Week</h5>

        <div class="card-body">
            <p style="width: 48%" class="float-left mr-1 p-2 bg-success rounded">Yes<br/>${drop_week}</p> 
            <p style="width: 48%" class="float-left p-2 bg-danger rounded">No<br/>${not_drop_week}</p><br/>
            <p style="width: 98%" class="float-left mt-2 p-2 bg-warning rounded">Droprate<br/>${Math.round((100*drop_week)/(drop_week + not_drop_week))}%</p>
        </div>
    </div>

    <div style="color: #000; width: 30%" class="card text-center float-left ml-4 mt-3">

        <h5>Month</h5>

        <div class="card-body">
            <p style="width: 48%" class="float-left mr-1 p-2 bg-success rounded">Yes<br/>${drop_month}</p> 
            <p style="width: 48%" class="float-left p-2 bg-danger rounded">No<br/>${not_drop_month}</p><br/>
            <p style="width: 98%" class="float-left mt-2 p-2 bg-warning rounded">Droprate<br/>${Math.round((100*drop_month)/(drop_month + not_drop_month))}%</p>
        </div>
    </div>

    <div style="color: #000; width: 30%" class="card text-center float-left ml-4 mt-3">

        <h5>Year</h5>

        <div class="card-body">
            <p style="width: 48%" class="float-left mr-1 p-2 bg-success rounded">Yes<br/>${drop_year}</p> 
            <p style="width: 48%" class="float-left p-2 bg-danger rounded">No<br/>${not_drop_year}</p><br/>
            <p style="width: 98%" class="float-left mt-2 p-2 bg-warning rounded">Droprate<br/>${Math.round((100*drop_year)/(drop_year + not_drop_year))}%</p>
        </div>
    </div>

    <div style="color: #000; width: 30%" class="card text-center float-left ml-4 mt-3">

        <h5>All-Time</h5>

        <div class="card-body">
            <p style="width: 48%" class="float-left mr-1 p-2 bg-success rounded">Yes<br/>${drop_all}</p> 
            <p style="width: 48%" class="float-left p-2 bg-danger rounded">No<br/>${not_drop_all}</p><br/>
            <p style="width: 98%" class="float-left mt-2 p-2 bg-warning rounded">Droprate<br/>${Math.round((100*drop_all)/(drop_all + not_drop_all))}%</p>
        </div>
    </div>
    
`
    document.getElementById("stats").innerHTML = html

}

async function open_link(link){
    require('electron').shell.openExternal(link);
}

async function show_stats(range, btn){

    set_buttons(btn)
    
    const db_location = path.join(__dirname, '')
    range = parseInt(range)

    var got = 0
    var didnt = 0
 
    var html = `
<style>
.my-custom-scrollbar {
    position: relative;
    height: 62vh;
    overflow: auto;
    }
    .table-wrapper-scroll-y {
    display: hidden;
    }
</style>
<div class="table-wrapper-scroll-y my-custom-scrollbar mt-5">
    <table class="table table-dark table-striped text-center">
        <thead>
            <tr>
                <th>Date</th>
                <th>Time</th>
                <th>Dropped?</th>
            </tr>
        </thead>

        <tbody>`
    
        db.getAll('bkh_drops', db_location, (succ, data) => {
            if (succ) {

                if(data.length <= 0){

                    html = `<div style="font-size: 32px; color: #000;" class="w-100 bg-warning text-center rounded p-3 mt-5">No Drops saved.</div>`

                }

                else{

                    for(x in data){

                        if (is_between_Date(data[x]["time"], range)){
                          
                          if (data[x]["drop"] == 1) {
      
                              var dropped = "✔"
                              var bg = "bg-success"
                              got += 1
      
                          }

                          if (data[x]["drop"] == 0) {
                              var dropped = "❌"
                              var bg = "bg-danger"
                              didnt += 1
                          }
      
                          html += `
                              <tr class="${bg}">
                                  <td class="align-middle lh-1" >${data[x]["time"].split(" ")[0]}</td>
                                  <td class="align-middle lh-1" >${data[x]["time"].split(" ")[1]}</td>
                                  <td class="align-middle lh-1" >${dropped}</td>
                              </tr>`
      
                        }
                    }
                }
      
      
                  html += `
        </tbody>
    </table>
</div>`
            }
        })    
    
    document.getElementById("stats").innerHTML = html

}

async function save_file(stats){

    const fs = require("fs")

    fs.writeFile("Info/stats.json", JSON.stringify(stats, null, 4), function(err) {
        if (err) {
            console.log(err);
        }
    });
}