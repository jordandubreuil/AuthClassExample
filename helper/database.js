if(process.env.NODE_ENV === "production"){
    module.exports ={
        //connection to remote mongodb server 

    }
}
else{
    module.exports ={
        mongoURI:"mongodb://localhost:27017/gamelibrary"
    }
}