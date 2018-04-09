/*
Copyright Infosys Limited

*/

package main

import (
	"bytes"
	"encoding/json"
	"fmt"
	"github.com/hyperledger/fabric/core/chaincode/shim"
	sc "github.com/hyperledger/fabric/protos/peer"
	
)



type StudentDetails struct {
	DocType          string       `json:"doctype"`
	Student_ID		 string       `json:"Student_ID"` 
	Student_Name	 string   	  `json:"Student_Name"` 
	Age		 	 	 string       `json:"Desc"`
}

// SmartContract example SmartContract implementation
type SmartContract struct {
}

func (s *SmartContract) Init(APIstub shim.ChaincodeStubInterface) sc.Response {
	return shim.Success(nil)
}

func (s *SmartContract) Invoke(APIstub shim.ChaincodeStubInterface) sc.Response {

	// Retrieve the requested Smart Contract function and arguments
	function, args := APIstub.GetFunctionAndParameters()
	// Route to the appropriate handler function to interact with the ledger appropriately
	
	fmt.Printf("\nhello from invoke :\n\n\n\n")
	fmt.Println("\nhello from invoke :\n\n\n\n")
	
	if function == "CreateStudent" {
		return s.CreateStudent(APIstub, args)
	} else if function == "getSinglePOProject" {
		return s.getSinglePOProject(APIstub,args)
	} else if function == "getallProjects" {
		return s.getallProjects(APIstub,args)
	} 
 	
	return shim.Error("Invalid Smart Contract function name.")
}

func (s *SmartContract) CreateStudent(APIstub shim.ChaincodeStubInterface, args []string) sc.Response {

	if len(args) != 3 {
			return shim.Error("Create PO Project failed. Must include 13 parameters")
	}	

	var socialProjPO = StudentDetails{DocType: "StudentDetails", Student_ID: args[0], Student_Name : args[1], Age : args[2] }
				
	var buffer bytes.Buffer
	buffer.WriteString("CSD-")
	buffer.WriteString(args[0])

	POProjAsBytes, _ := json.Marshal(socialProjPO)
	APIstub.PutState(buffer.String(), POProjAsBytes)
	
	return shim.Success(nil)
}

func (s *SmartContract) getSinglePOProject(APIstub shim.ChaincodeStubInterface, args []string) sc.Response {

	if len(args) < 1 {
		return shim.Error("Incorrect number of arguments. Expecting 1")
	}
	var buffer bytes.Buffer
	buffer.WriteString("CSD-")
	buffer.WriteString(args[0])

	projectAsBytes, _ := APIstub.GetState(buffer.String())	
	return shim.Success(projectAsBytes)
}

func (s *SmartContract) getallProjects(APIstub shim.ChaincodeStubInterface, args []string) sc.Response {

	queryString := "{\"selector\":{\"doctype\":\"StudentDetails\", \"Student_ID\": \""+args[0]+"\"}}"	
	
	resultsIterator, _ := APIstub.GetQueryResult(queryString)
	
	defer resultsIterator.Close()

	// buffer is a JSON array containing QueryRecords
	var buffer bytes.Buffer
	buffer.WriteString("[")

	bArrayMemberAlreadyWritten := false
	for resultsIterator.HasNext() {
		queryResponse, _ := resultsIterator.Next()	
		
		// Add a comma before array members, suppress it for the first array member
		if bArrayMemberAlreadyWritten == true {
			buffer.WriteString(",")
		}		
		buffer.WriteString(string(queryResponse.Value))		
		bArrayMemberAlreadyWritten = true	
		
	}
	buffer.WriteString("]")
	
	return shim.Success(buffer.Bytes())
}


func (s *SmartContract) initLedger(APIstub shim.ChaincodeStubInterface) sc.Response {
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


// END OF CHAINCODE
