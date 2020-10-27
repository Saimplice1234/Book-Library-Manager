let chalk=require("chalk");
const sql=require('mysql');
let inquirer=require("inquirer");
const log=console.log;
let table = require("table");
let data, config,config2; 
let dataDbOutput=[];

const pool=sql.createPool(
    {
        host:"localhost",
        user:"root",
        password:"",
        database:"library_manager",
        connectionLimit:10
    }
);

data = [ 
  ["L", "I","B","R","A","R","Y"," ","M","A","N","A","G","E","R"],           
] 
config = { 
  border: table.getBorderCharacters("ramac"), 
} 
config2={
    singleLine: true,
    border: table.getBorderCharacters("ramac"), 
    columns: {
        0: {
          width: 20,
          wrapWord: true
        }
      }
}
  
let title = table.table(data, config); 
log(chalk.cyanBright(title)); 
log(chalk.greenBright("Copyright 2020-MIT license\n"));

inquirer.prompt({
    type:"list",
    choices:[
        "Get data from the library",
        "Search book by Author name",
        "Search Author by book name",
        "Add data to your library manager"
    ],
    name:"Choice"

}).then(answer=>{
    log(`${answer.Choice}`);
    if(answer.Choice =="Get data from the library"){

        pool.query(`select * from librarymanage`,(err,result,field)=>{
            if(err){
               return log(err);
            }
            if(result.length !=0){
            dataDbOutput=[
                ["Author","Book"],
            ];
            let dataReceive=table.table(dataDbOutput,config2);
            log(chalk.blueBright(dataReceive));
            
            result.forEach(element => {
                log(chalk.blueBright(`${element.author} <====> ${element.title}`));

            });
          }else{
              log(chalk.blueBright('No data have been added to our library'));
          }
            
        });    
    }

    else if(answer.Choice == "Search book by Author name"){
        inquirer.prompt(
            {   type:"input",
                message:"What is the name of the author:",
                name:"author"
            }
        ).then(answer=>{
            if(answer.author !='' || answer.author !=undefined){
                pool.query(`select title from librarymanage where author='${answer.author}'`,(err,result,field)=>{
                    if(err){
                       return log(err);
                    }
                    if(result.length !=0){
                    dataDbOutput=[
                        ["Book"],
                    ];
                    let dataReceive=table.table(dataDbOutput,config2);
                    log(chalk.blueBright(dataReceive));
                    
                    result.forEach(element => {
                        log(chalk.blueBright(`${element.title}`));
        
                    });
                  }else{
                      log(chalk.blueBright('Not found'));
                  }
                    
                });
            }
        });
    }

    else if(answer.Choice == "Search Author by book name"){
        inquirer.prompt(
            {   type:"input",
                message:"What is the name of the book:",
                name:"title"
            }
        ).then(answer=>{
            if(answer.title !='' || answer.title !=undefined){
                pool.query(`select author from librarymanage where title='${answer.title}'`,(err,result,field)=>{
                    if(err){
                       return log(err);
                    }
                    if(result.length !=0){
                    dataDbOutput=[
                        ["Author"],
                    ];
                    let dataReceive=table.table(dataDbOutput,config2);
                    log(chalk.blueBright(dataReceive));
                    
                    result.forEach(element => {
                        log(chalk.blueBright(`${element.author}`));
        
                    });
                  }else{
                      log(chalk.blueBright('Not found'));
                  }
                    
                });
            }
        });
    }
    else if(answer.Choice == "Add data to your library manager"){
        let getName;
        let getTitle;
        inquirer.prompt(
            {   type:"input",
                message:"What is the name of the author:",
                name:"newAuthor"
            },
        ).then(answer=>{
            if(answer.newAuthor !=""){
                getName=answer.newAuthor; 
                inquirer.prompt(
                    {   type:"input",
                        message:"What is the title of the book:",
                        name:"newTitle"
                    },
                ).then(res=>{
                    if( res.newTitle !=""){
                      getTitle=res.newTitle;
                    }
                    InsertData(getTitle,getName);

                });
            }
        });

        function InsertData(bookName,authorName){
          let query=`insert into librarymanage(author,title) values('${authorName}','${bookName}')`;
          pool.query(query,(err,result)=>{
              if(err){
                  log(err);
                  //return false;
              }
              log("Success the author and the book have been added");
              //return 0 or true
          });
        }
        
    }
})