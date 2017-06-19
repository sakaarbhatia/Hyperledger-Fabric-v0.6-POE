# Replicating Proof of existence on hyperledger fabric v0.6 #

The application has been divided into 2 different modules : 
1. First one, utilizes rest API provided by hyperledger fabric v0.6 
2. Second utilizes server to chain interaction using hfc module  


### Rest Service: ###
To bootstrap application with blockchain rest services as provider use file server-rest.js

Command: ***node server-rest.js***

and you would see on your screen: 
Server is listening on port 3001 
You can now access the application from your browser using localhost:3001 


###  HFC Service: ###
To bootstrap application with block chain’s hfc module as provider use file server.js 

Command: ***node server-hfc.js***

and you would see on your screen: 
Server is listening on port 3000 Connected!  
You can now access the application from your browser using localhost:3000 



*For detailed information of APIs to use refer to readme.pdf*
