# Chaincode Investigator
This is a tool in the form of a web app to help test/develop chaincode. 
It is supposed to bridge the gap between developing your chaincode from scratch and having a working UI/app to test your chaincode. 
Simply create build-able chaincode and store it in GitHub. 
Then from this app deploy the cc to your IBM Blockchain network and get a UI to interact with your chaincode functions. 
Now you can invoke/query chaincode directly from this web app. 

It also has the ability to record and remember query/invoke sequences.
This allows for rapid testing of a complex flow.

### Deployment Tracking
Tracking numbers helps us judge interest. If you wish you may remove deployment tracking by deleting the 'Deployment Tracking' section towards the bottom app.js.

##Install
1. First up we need to install our dependencies. Open a command prompt/terminal and browse to the root of this project.
1. In the command prompt type:

	```
	> npm install
	> npm install gulp -g
	> gulp
	```
	
	(if gulp doesn't work, you can launch directly with `node app.js`)
	
1. If all goes well you should see this message in the console:
	
	```
	----------------------- Server Up - localhost:3001 -----------------------
	```
***

##Tutorial Steps
1. Open your favorite browser and go to [http://localhost:3001](http://localhost:3001)
2. You should see CCI's UI as seen below. Click the "Load" panel to expand it.

	![start](/imgs/1_start.png)

3. Now copy and paste the example JSON below into the textarea that appeared
	- Of course you can modify it to fit your own network and chaincode
	- The json needs to follow the format defined in our SDK for the function `ibc.load()` - [documentation](https://github.com/IBM-Blockchain/ibm-blockchain-js#ibcjs)
	- You will find your own blockchain network information from the service's Bluemix dashboard in the "Service Credentials" tab

	```
	{
		"network": {
			"peers": [
				{
					"api_host": "95fb4294-d05a-4afa-bbcd-355c6d90d261_vp1-api.blockchain.ibm.com",
					"api_port": 80,
					"api_port_tls": 443,
					"id": "95fb4294-d05a-4afa-bbcd-355c6d90d261_vp1"
				},
				{
					"api_host": "95fb4294-d05a-4afa-bbcd-355c6d90d261_vp2-api.blockchain.ibm.com",
					"api_port": 80,
					"api_port_tls": 443,
					"id": "95fb4294-d05a-4afa-bbcd-355c6d90d261_vp2"
				}
			],
			"users": [
				{
					"username": "user_type1_fd818482a0",
					"secret": "d5d1a2cd27",
					"enrollId": "user_type1_fd818482a0",
					"enrollSecret": "d5d1a2cd27"
				},
				{
					"username": "user_type1_93c0c7bc9e",
					"secret": "7fcd7a2d53",
					"enrollId": "user_type1_93c0c7bc9e",
					"enrollSecret": "7fcd7a2d53"
				},
				{
					"username": "user_type1_3aa39ba81d",
					"secret": "82f211728e",
					"enrollId": "user_type1_3aa39ba81d",
					"enrollSecret": "82f211728e"
				},
				{
					"username": "user_type1_763a40ba66",
					"secret": "711761f28f",
					"enrollId": "user_type1_763a40ba66",
					"enrollSecret": "711761f28f"
				},
				{
					"username": "user_type1_bb6cd75403",
					"secret": "c2f111c2cd",
					"enrollId": "user_type1_bb6cd75403",
					"enrollSecret": "c2f111c2cd"
				}
			]
		},
		"chaincode": {
			"zip_url": "https://github.com/ibm-blockchain/marbles-chaincode/archive/master.zip",
			"unzip_dir": "marbles-chaincode-master/hyperledger/part2",
			"git_url": "https://github.com/ibm-blockchain/marbles-chaincode/hyperledger/part2"
		}
	}
	```

	![](/imgs/2_load.png)
	
1. In addition to the json you need to set the "Deploy Function" name and argument field (see example above)
	- This is the name of the chaincode function that will be called immediately after the chaincode is deployed

1. Finally click the "Send to SDK" button
1. This will take approximately 1.5 minutes and then a new chaincode summary icon will appear as seen below.

	![](/imgs/3_load.png) 
	
1. Click the chaincode summary icon labeled "part2" to load this cc
1. The "Chaincode" panel should have expanded reveling your chaincode functions (these were parsed by the SDK)

	![](/imgs/4_chaincode.png)
	
1. Next lets query the current cc state for the value of `abc`. Simply type "abc" into the "Query - read([])" input box like below then click the "Run ->" button.
	- This `abc` variable was created in our cc's `Init()` chaincode function
	- You can change the peer we query against by expanding the "Network" button and selecting a different peer
	- The "Run All" button will query against all known peers in the network unlike the "Run" button which queries against a single selected peer
	
	![](/imgs/5_chaincode.png)
	
1. The log panel should have expanded showing you the results of the query.  The variable `abc` now has the value `"hello_there"`.
1. Next lets change the chaincode state of this variable with our `write()` function. Use the "Invoke - write()" by typing `abc, 101` and clicking "Run ->"
	
	![](/imgs/6_chaincode.png)
	
1. Verify that the value changed by sending another query to `abc`

That’s it!


##Panels

###Load
This panel is where you can load new cc aka chaincode into CCI. 
You can control whether or not cc is deployed by omitting or setting the chaincode.deployed_name field. 
If chaincode.depolyed_name is null CCI will deploy the chaincode against vp1. 
Past cc's that were parsed by the tool will be remembered and listed in this panel (they are saved to your browser's memory, so you will need to use the same browser) 
You can remove them by clicking the small "x". 
You must select a cc before you are able to use the rest of the tool. 
 
###Network
This panel allows you to set which peer tp run your query or invoke against and set its enrollID. 
The SDK will have registered 1 enrollID per peer during deployment. 
By default, selecting a new peer will also select its registered user. 

###Tests
In this panel you can create repeatable sequential tests. 
Click the start button to start recording then use the chaincode panel to send API requests. 
Each requesy will be recorded. 
To save and end the test, click the stop button. 
This test will be recorded to your browser.  
It can be played back at a later time to re-run your flow.

###Chaincode
This panel is where you can build up API requests to send. 
The invoke and query functions should be listed for your selected cc. 
The "Run" button will run the request against the selected peer. 
The "Run All" button will run the request against each peer in parallel. 
This is mostly handy to verify that the peers are seeing the same state. 
The output of the functions can be found in the "Logs" panel.

###Logs
This panel shows the pretty printed JSON inputs/outputs of the invokes and queries. 
The "x" in the right hand corner will clear the log panel.
