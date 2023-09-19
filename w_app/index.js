var http = require("http");
var requests = require("requests");
var fs = require("fs");

const homeFile = fs.readFileSync("index.html","utf-8");

const replaceVal = (tempVal, oriVal) =>
{
    let tempreture = tempVal.replace("{%tempval%}",(oriVal.main.temp - 273.15).toFixed(2));
     tempreture = tempreture.replace("{%tempmin%}",(oriVal.main.temp_min - 273.15).toFixed(2));
     tempreture = tempreture.replace("{%tempmax%}",(oriVal.main.temp_max - 273.15).toFixed(2));
     tempreture = tempreture.replace("{%location%}",oriVal.name);
     tempreture = tempreture.replace("{%country%}",oriVal.sys.country);
    return {tempreture};
}



const server = http.createServer((req,res,err)=>
{
    if(req.url == "/")
    {
        requests(
            "http://api.openweathermap.org/data/2.5/weather?q=pune&appid=c12b23ebc36093ceec59e5610f86d2bc"
        ).on("data", (chunk)=>
        {
            let objdata = JSON.parse(chunk);
            let arrobj= [objdata];
            // console.log((arrobj[0].main));
            const realTimeData = arrobj.map(val=> replaceVal(homeFile, val ));
             
            res.write(realTimeData[0].tempreture);
             console.log(realTimeData);
        }).on("end",(err)=>
        {
             res.end(); 
            if(err)return console.log("connection closed",err);
            console.log("end");
        });
    }
       
});

 server.listen(8000,(err)=>{});