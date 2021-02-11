let chalk=require("chalk");
const sql=require('mysql');
let inquirer=require("inquirer");
const log=console.log;
let table = require("table");
let data, config,config2; 
let dataDbOutput=[];

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

var connection =sql.createConnection({
    host     : 'localhost',
    user     : 'root',
    password : '',
    database : 'library_manager'
});

connection.connect(function(error){
    if(error){return log(chalk.cyanBright("Please connect the cli with the database !"));}
    else{main();}
});

let main=()=>{

    inquirer.prompt({
        type:"list",
        choices:[
            "Get data from the library",
            "Search book by Author name",
            "Search Author by book name",
            "Add data to your library manager"
        ],
        name:"choice"
    
    }).then(answer=>{

        if(answer.choice == "Get data from the library" && answer.choice !=null){getData();}
        else if(answer.choice == "Search book by Author name"  && answer.choice !=null){searchBookByAuthor();}
        else if(answer.choice == "Search Author by book name"  && answer.choice !=null){searchAuthorByBook();} 
        else if(answer.choice == "Add data to your library manager"  && answer.choice !=null){addDataToDb();}
    });
}

let getData=()=>{
    connection.query(`select * from librarymanage`,(err,result,field)=>{

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
          invokeMain();
      }
        
    });    
}

let searchBookByAuthor=()=>{
   
    inquirer.prompt(
        {   type:"input",
            message:"What is the name of the author:",
            name:"author"
        }
    ).then(answer=>{
       
        if(answer.author !='' && answer.author !=null){
            connection.query(`SELECT title from librarymanage manage WHERE author='${answer.author}' LIKE '%${answer.author}%'`,(err,result,field)=>{
                if(err){
                   return log(err);
                }
                if(result.length !=0){
                dataDbOutput=[
                    ["Book"],3
                ];
                let dataReceive=table.table(dataDbOutput,config2);
                log(chalk.blueBright(dataReceive));
                
                result.forEach(element => {
                    log(chalk.blueBright(`${element.title}`));
    
                });
              }else{
                  log(chalk.blueBright('Not found'));
                  invokeMain();
              }
                
            });
        }else if(answer.author == null || answer.author == ""){
            searchBookByAuthor();
        }

    });
}

let searchAuthorByBook=()=>{
    inquirer.prompt(
        {   type:"input",
            message:"What is the name of the book:",
            name:"title"
        }
    ).then(answer=>{
        if(answer.title !='' || answer.title !=null){
            connection.query(`SELECT author FROM librarymanage WHERE title='${answer.title}' LIKE '%${answer.title}%' `,(err,result,field)=>{
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
                  invokeMain();
              }
                
            });
        }else if(answer.title == null || answer.title == ""){
             searchAuthorByBook();
        }
    });
}
let addDataToDb=()=>{

    let getName = null;
    let getBookName = null;

    (function getAuthor(){
        inquirer.prompt(
            {   type:"input",
                message:"What is the name of the author:",
                name:"newAuthor"
            }
        ).then((response)=>{
            if(response.newAuthor == null || response.newAuthor ==""){
                getAuthor();
            }else if(response.newAuthor != null || response.newAuthor !=""){
               getName = response.newAuthor;
               getTitle();
            }
        });
    })();
    function getTitle(){

        inquirer.prompt(
            {   type:"input",
                message:"What is the title of the book:",
                name:"newTitle"
            }
        ).then((response)=>{
            if(response.newTitle == null || response.newTitle ==""){
                getTitle();
            }else if(response.newTitle != null || response.newTitler !=""){
                getBookName = response.newTitle;
                addData(getName,getBookName);
            }
        });
    }

    function addData(author,title){
        let query=`insert into librarymanage(author,title) values('${author}','${title}')`;
        connection.query(query,(err,result)=>{
            if(err){
               return log("Have an error");
            }
            log("Success the author and the book have been added in the library");
            invokeMain();
        });
    }

}

let invokeMain=()=>{

    inquirer.prompt({
        type:"confirm",
        message:"Do you want exit to the program ?",
        default:false,
        name:"confirmation",


    }).then((response)=>{
         if(response.confirmation == true){
               process.exit(22);
         }else if(response.confirmation == false ){
               main();
         }
    });

}
