/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

/*
 * The sample smart contract for documentation topic:
 * Writing Your First Blockchain Application
 */

package main

import (
	"bytes"
	"encoding/json"
	"fmt"

	"github.com/hyperledger/fabric/core/chaincode/shim"
	sc "github.com/hyperledger/fabric/protos/peer"
)

// Define the Smart Contract structure
type SmartContract struct {
}


type Order struct {	
	TxId string `json:"txid"`
	DocType string `json:"doctype"`
	Consignee string `json:"consignee"`
	FreBroker  string `json:"freBroker"`
	Insurer string `json:"insurer"`
	Carrier string `json:"carrier"`
	Shipper string `json:"shipper"`	
	TotalWeight string `json:"totalweight"`
	TotalDim string `json:"totaldim"`
	Hazardous string `json:"hazardous"`
	Origin string `json:"origin"`
	Destination string `json:"destination"`	
	TrailerType string `json:"trailertype"`
	ServiceOptions string `json:"srvoptions"`
	SchDateTime string `json:"schdatetime"`
	Timeframe string `json:"timeframe"`
	Price string `json:"price"`
	Status string `json:"status"`
	StatusStr string `json:"statusstr"`
	CreateDT string `json:"createdt"`

}

/*
 * The Init method is called when the Smart Contract "faborder" is instantiated by the blockchain network
 * Best practice is to have any Ledger initialization in separate function -- see initLedger()
 */
func (s *SmartContract) Init(APIstub shim.ChaincodeStubInterface) sc.Response {
	return shim.Success(nil)
}

/*
 * The Invoke method is called as a result of an application request to run the Smart Contract "faborder"...
 * The calling application program has also specified the particular smart contract function to be called, with arguments...
 */
func (s *SmartContract) Invoke(APIstub shim.ChaincodeStubInterface) sc.Response {

	// Retrieve the requested Smart Contract function and arguments
	function, args := APIstub.GetFunctionAndParameters()
	// Route to the appropriate handler function to interact with the ledger appropriately
	if function == "getInProgress" {
		return s.getInProgress(APIstub, args)
	} else if function == "getAllOrders" {
		return s.getAllOrders(APIstub,args)
	} else if function == "getOrder" {
		return s.getOrder(APIstub,args)
	} else if function == "initLedger" {
		return s.initLedger(APIstub)
	} else if function == "createOrder" {
		return s.createOrder(APIstub, args)
	} else if function == "changeOrderStatus" {
		return s.changeOrderStatus(APIstub, args)
	}

	return shim.Error("Invalid Smart Contract function name.")
}

func (s *SmartContract) initLedger(APIstub shim.ChaincodeStubInterface) sc.Response {
	return shim.Success(nil)
}

func (s *SmartContract) getOrder(APIstub shim.ChaincodeStubInterface, args []string) sc.Response {

	if len(args) != 1 {
		return shim.Error("Incorrect number of arguments. Expecting 1")
	}

	orderAsBytes, _ := APIstub.GetState(args[0])
	return shim.Success(orderAsBytes)
}
func (s *SmartContract) getInProgress(APIstub shim.ChaincodeStubInterface, args []string) sc.Response {

	queryString := "{\"selector\":{\"doctype\":\"order\"}}"
	
	resultsIterator, _ := APIstub.GetQueryResult(queryString)
	//if err != nil {
		//return nil, err
	//}
	defer resultsIterator.Close()

	// buffer is a JSON array containing QueryRecords
	var buffer bytes.Buffer
	buffer.WriteString("[")

	bArrayMemberAlreadyWritten := false
	for resultsIterator.HasNext() {
		queryResponse, _ := resultsIterator.Next()
		//if err != nil {
			//return nil, err
		//}
		// Add a comma before array members, suppress it for the first array member
		if bArrayMemberAlreadyWritten == true {
			buffer.WriteString(",")
		}
		buffer.WriteString("{\"Key\":")
		buffer.WriteString("\"")
		buffer.WriteString(queryResponse.Key)
		buffer.WriteString("\"")

		buffer.WriteString(", \"Record\":")
		// Record is a JSON object, so we write as-is
		buffer.WriteString(string(queryResponse.Value))
		buffer.WriteString("}")
		bArrayMemberAlreadyWritten = true
	}
	buffer.WriteString("]")

	fmt.Printf("- getQueryResultForQueryString queryResult:\n%s\n", buffer.String())

	//return buffer.Bytes(), nil
	
	//if err != nil {
		//return shim.Error(err.Error())
	//}
	return shim.Success(buffer.Bytes())
}

func (s *SmartContract) getAllOrders(APIstub shim.ChaincodeStubInterface, args []string) sc.Response {


	queryString := "{\"selector\":{\"doctype\":\"order\"}}"
	
	resultsIterator, _ := APIstub.GetQueryResult(queryString)
	//if err != nil {
		//return nil, err
	//}
	defer resultsIterator.Close()

	// buffer is a JSON array containing QueryRecords
	var buffer bytes.Buffer
	buffer.WriteString("[")

	bArrayMemberAlreadyWritten := false
	for resultsIterator.HasNext() {
		queryResponse, _ := resultsIterator.Next()
		//if err != nil {
			//return nil, err
		//}
		// Add a comma before array members, suppress it for the first array member
		if bArrayMemberAlreadyWritten == true {
			buffer.WriteString(",")
		}
		buffer.WriteString("{\"Key\":")
		buffer.WriteString("\"")
		buffer.WriteString(queryResponse.Key)
		buffer.WriteString("\"")

		buffer.WriteString(", \"Record\":")
		// Record is a JSON object, so we write as-is
		buffer.WriteString(string(queryResponse.Value))
		buffer.WriteString("}")
		bArrayMemberAlreadyWritten = true
	}
	buffer.WriteString("]")

	//fmt.Printf("- getQueryResultForQueryString queryResult:\n%s\n", buffer.String())

	//return buffer.Bytes(), nil
	
	//if err != nil {
		//return shim.Error(err.Error())
	//}
	return shim.Success(buffer.Bytes())
		
	
}

func (s *SmartContract) createOrder(APIstub shim.ChaincodeStubInterface, args []string) sc.Response {

	fmt.Printf("- getQueryResultForQueryString queryResult:\n%s\n", args[1])
	if len(args) < 15 {
		return shim.Error("Incorrect number of arguments. Expecting 15" )
	}

	//var order = Order{Make: args[1], Model: args[2], Colour: args[3], Owner: args[4]}
	
	var order = Order{ DocType: args[1],Consignee: args[2],FreBroker: args[3],Insurer: args[4],Carrier: args[5],Shipper: args[6],TotalWeight: args[7],TotalDim: args[8],Hazardous: args[9],Origin: args[10],Destination: args[11],TrailerType: args[12],ServiceOptions: args[13],SchDateTime: args[14],Timeframe: args[15],Price: args[16],Status: args[17],StatusStr: args[18],CreateDT: args[19]}

	orderAsBytes, _ := json.Marshal(order)
	APIstub.PutState(args[0], orderAsBytes)

	return shim.Success(nil)
}

func (s *SmartContract) changeOrderStatus(APIstub shim.ChaincodeStubInterface, args []string) sc.Response {

	//if len(args) > 3 {
		//return shim.Error("Incorrect number of arguments. Expecting 3")
	//}

	orderAsBytes, _ := APIstub.GetState(args[0])
	order := Order{}

	json.Unmarshal(orderAsBytes, &order)
	order.Status = args[1]
	order.StatusStr = args[2]
	
	if len(args) == 4 {
		order.Price = args[3]
	}

	orderAsBytes, _ = json.Marshal(order)
	APIstub.PutState(args[0], orderAsBytes)

	return shim.Success(nil)
}

// The main function is only relevant in unit test mode. Only included here for completeness.
func main() {

	// Create a new Smart Contract
	err := shim.Start(new(SmartContract))
	if err != nil {
		fmt.Printf("Error creating new Smart Contract: %s", err)
	}
}
