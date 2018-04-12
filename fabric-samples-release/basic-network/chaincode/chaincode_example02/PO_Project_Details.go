/*
Copyright Infosys Limited

*/

package main

import (
	"encoding/json"
	"errors"
	"fmt"
 // "strconv"

	"github.com/hyperledger/fabric/core/chaincode/shim"
)

// SimpleChaincode example simple Chaincode implementation
type SimpleChaincode struct {
}

var err error
var bytesArray []byte

type Entity struct {
	Entity_ID         string           `json:"Entity_ID"`   
	Entity_Role       string           `json:"EntityName"`  	
	Entity_Type       string		  `json:"Entity_Type"`
	Entity_Name       string           `json:"Entity_Role"`     
	Establishment_No  string 		  `json:"EstablishmentNo"`
	Entity_Business	  string		    `json:"Entity_Business"`
	Entity_Turn_Over   string		  `json:"Entity_Turn_Over"`
	SocialCredits	 string  		  `json:"SocialCredits"`
	Status	 		 string  		  `json:"Status"`
}


type socialProject struct {
	Project_ID           string    `json:"Project_ID"`   
	Project_Short_Desc   string    `json:"Project_Short_Desc"`  	
	Project_Long_Desc    string	  `json:"Project_Long_Desc"`
	Project_Goal         string    `json:"Project_Goal"`     
	Project_Start_Dt 	 string 	  `json:"Project_Start_Dt"`
	Project_End_Dt	  	 string	  `json:"Project_End_Dt"`
	Project_Benefits     string	  `json:"Project_Benefits"`
	Project_Country	 	 string    `json:"Project_Country"`
	Project_Created_Dt	 string    `json:"Project_Created_Dt"`
	Project_Created_ID	 string    `json:"Project_Created_ID"`
	Project_Modified_Dt	 string    `json:"Project_Modified_Dt"`
	Project_Modified_ID	 string    `json:"Project_Modified_ID"`
}

type socialProject_PO struct {
                Project_ID           string       `json:"Project_ID"`  
                Category_ID          string       `json:"Category_ID"`
                Sub_Category_ID      string       `json:"Sub_Category_ID"`           
                Project_Short_Desc   string       `json:"Project_Short_Desc"`       
                Project_Long_Desc    string       `json:"Project_Long_Desc"`
                Project_Start_Date   string       `json:"Project_Start_Date"`
                Project_End_Date     string       `json:"Project_End_Date"`
                Project_Accom_Date   string       `json:"Project_Accom_Date"`
                Project_Status       string       `json:"Project_Status"`
                Project_Remarks      string       `json:"Project_Remarks"`
                Entity_ID  			 string       `json:"Entity_ID"`
                Project_Created_DT   string       `json:"Project_Created_DT"`
                Project_Created_ID   string       `json:"Project_Created_ID"`
                Project_Modified_DT  string       `json:"Project_Modified_DT"`
                Project_Modified_ID  string       `json:"Project_Modified_ID"`
                
}



var AllEntity map[string]Entity

var AllProject map[string]socialProject

var m_socialProject_PO map[string]socialProject_PO

// set the AllEntity
func setAllEntity(stub shim.ChaincodeStubInterface) ([]byte, error) {
	bytesArray, err = json.Marshal(&AllEntity)
	if err != nil {
		fmt.Printf("Failed to set the AllEntity for block chain :%v\n", err)
		return nil, err
	}
	err = stub.PutState("AllEntity", bytesArray)
	if err != nil {
		fmt.Printf("Failed to set the AllEntity for block chain :%v\n", err)
		return nil, err
	}
	return nil, err
}

// get the AllEntity Map
func getAllEntity(stub shim.ChaincodeStubInterface) ([]byte, error) {

	bytesArray, err = stub.GetState("AllEntity")
	if err != nil {
		fmt.Printf("Failed to initialize the AllEntity for block chain :%v\n", err)
		return nil, err
	}
	if len(bytesArray) != 0 {
		fmt.Printf("AllEntity map exists.\n")
		err = json.Unmarshal(bytesArray, &AllEntity)
		if err != nil {
			fmt.Printf("Failed to initialize the AllEntity for block chain :%v\n", err)
			return nil, err
		}
	} else { // create a new map for AllEntity
		fmt.Printf("AllEntity map does not exist. To be created\n")
		AllEntity = make(map[string]Entity)
		bytesArray, err = json.Marshal(&AllEntity)
		if err != nil {
			fmt.Printf("Failed to initialize the AllEntity for block chain :%v\n", err)
			return nil, err
		}
		err = stub.PutState("AllEntity", bytesArray)
		if err != nil {
			fmt.Printf("Failed to initialize the AllEntity for block chain :%v\n", err)
			return nil, err
		}
	}
	fmt.Printf("Initiliazed AllEntity : %v\n", AllEntity)
	return nil, err
}



// set the AllProject
func setAllProject(stub shim.ChaincodeStubInterface) ([]byte, error) {
	bytesArray, err = json.Marshal(&AllProject)
	if err != nil {
		fmt.Printf("Failed to set the AllProject for block chain :%v\n", err)
		return nil, err
	}
	err = stub.PutState("AllProject", bytesArray)
	if err != nil {
		fmt.Printf("Failed to set the AllProject for block chain :%v\n", err)
		return nil, err
	}
	return nil, err
}

// set setSocialProject_PO
func setSocialProject_PO(stub shim.ChaincodeStubInterface) ([]byte, error) {
	bytesArray, err = json.Marshal(&m_socialProject_PO)
	if err != nil {
		fmt.Printf("Failed to set the m_socialProject_PO for block chain :%v\n", err)
		return nil, err
	}
	err = stub.PutState("m_socialProject_PO", bytesArray)
	if err != nil {
		fmt.Printf("Failed to set the m_socialProject_PO for block chain :%v\n", err)
		return nil, err
	}
	return nil, err
}

// get the AllProject Map
func getAllProject(stub shim.ChaincodeStubInterface) ([]byte, error) {

	bytesArray, err = stub.GetState("AllProject")
	if err != nil {
		fmt.Printf("Failed to initialize the AllProject for block chain :%v\n", err)
		return nil, err
	}
	if len(bytesArray) != 0 {
		fmt.Printf("AllProject map exists.\n")
		err = json.Unmarshal(bytesArray, &AllProject)
		if err != nil {
			fmt.Printf("Failed to initialize the AllProject for block chain :%v\n", err)
			return nil, err
		}
	} else { // create a new map for AllProject
		fmt.Printf("AllProject map does not exist. To be created\n")
		AllProject = make(map[string]socialProject)
		bytesArray, err = json.Marshal(&AllProject)
		if err != nil {
			fmt.Printf("Failed to initialize the AllProject for block chain :%v\n", err)
			return nil, err
		}
		err = stub.PutState("AllProject", bytesArray)
		if err != nil {
			fmt.Printf("Failed to initialize the AllProject for block chain :%v\n", err)
			return nil, err
		}
	}
	fmt.Printf("Initiliazed AllProject : %v\n", AllProject)
	return nil, err
}

// get All PO Project from Map
func getAllPOProject(stub shim.ChaincodeStubInterface) ([]byte, error) {

	bytesArray, err = stub.GetState("m_socialProject_PO")
	if err != nil {
		fmt.Printf("Failed to initialize the m_socialProject_PO for block chain :%v\n", err)
		return nil, err
	}
	if len(bytesArray) != 0 {
		fmt.Printf("AllProject map exists.\n")
		err = json.Unmarshal(bytesArray, &m_socialProject_PO)
		if err != nil {
			fmt.Printf("Failed to initialize the m_socialProject_PO for block chain :%v\n", err)
			return nil, err
		}
	} else { // create a new map for m_socialProject_PO
		fmt.Printf("m_socialProject_PO map does not exist. To be created\n")
		m_socialProject_PO = make(map[string]socialProject_PO)
		bytesArray, err = json.Marshal(&m_socialProject_PO)
		if err != nil {
			fmt.Printf("Failed to initialize the m_socialProject_PO for block chain :%v\n", err)
			return nil, err
		}
		err = stub.PutState("m_socialProject_PO", bytesArray)
		if err != nil {
			fmt.Printf("Failed to initialize the m_socialProject_PO for block chain :%v\n", err)
			return nil, err
		}
	}
	fmt.Printf("Initiliazed m_socialProject_PO : %v\n", AllProject)
	return nil, err
}


// Init create tables for tests
func (t *SimpleChaincode) Init(stub shim.ChaincodeStubInterface, function string, args []string) ([]byte, error) {
	
	// Create table one
	AllEntity = make(map[string]Entity)
	
	AllProject = make(map[string]socialProject)
	
	m_socialProject_PO = make(map[string]socialProject_PO)

	return nil, nil
}

// Invoke callback representing the invocation of a chaincode
func (t *SimpleChaincode) Invoke(stub shim.ChaincodeStubInterface, function string, args []string) ([]byte, error) {

	
	getAllEntity(stub)
	
	switch function {

	case "EntityDetails":
		if len(args) < 9 {
			return nil, errors.New("EntityDetails failed. Must include 9 column values")
		}
		
		var eData Entity	
		
		eData.Entity_ID = args[0]        
		eData.Entity_Role = args[1]        	
		eData.Entity_Type = args[2]      
		eData.Entity_Name = args[3]          
		eData.Establishment_No = args[4]
		eData.Entity_Business = args[5]		 
		eData.Entity_Turn_Over = args[6]
		eData.SocialCredits = args[7]	
		eData.Status = args[8]

		AllEntity[eData.Entity_ID] = eData
		
		_, err = setAllEntity(stub)
		
		
		if err != nil {
			return nil, fmt.Errorf("EntityDetails operation failed. %s", err)
		}
				
	case "CreateProject":
		if len(args) < 12 {
			return nil, errors.New("Project creation failed. Must include 12 args")
		}
		
		var projData socialProject

			projData.Project_ID  = args[0]
			projData.Project_Short_Desc = args[1]	
			projData.Project_Long_Desc = args[2]
			projData.Project_Goal  = args[3]
			projData.Project_Start_Dt = args[4]
			projData.Project_End_Dt	 = args[5]
			projData.Project_Benefits = args[6]
			projData.Project_Country = args[7]
			projData.Project_Created_Dt	= args[8]
			projData.Project_Created_ID	 = args[9]
			projData.Project_Modified_Dt = args[10]
			projData.Project_Modified_ID = args[11]
		
		AllProject[projData.Project_ID] = projData
		
		_, err = setAllProject(stub)
		
		
		if err != nil {
			return nil, fmt.Errorf("Project create operation failed. %s", err)
		}

				
	case "CreateProject_PO":
		if len(args) < 12 {
			return nil, errors.New("Project creation failed. Must include 12 args")
		}
		
		var POprojData socialProject

			POprojData.Project_ID  = args[0]
			POprojData.Category_ID = args[1]	
			POprojData.Sub_Category_ID = args[2]
			POprojData.Project_Short_Desc  = args[3]
			POprojData.Project_Long_Desc = args[4]
			POprojData.Project_Start_Date	 = args[5]
			POprojData.Project_End_Date = args[6]
			POprojData.Project_Accom_Date = args[7]
			POprojData.Project_Status	= args[8]
			POprojData.Project_Remarks	 = args[9]
			POprojData.Entity_ID = args[10]
			POprojData.Project_Created_DT = args[11]
			POprojData.Project_Created_ID = args[12]
			POprojData.Project_Modified_DT = args[13]
			POprojData.Project_Modified_ID = args[14]
		
		m_socialProject_PO[POprojData.Project_ID] = POprojData
		
		_, err = setSocialProject_PO(stub)
		
		
		if err != nil {
			return nil, fmt.Errorf("Project create operation failed. %s", err)
		}
					

	default:
		return nil, errors.New("Unsupported operation")
	}
	return nil, nil
}


func getAllEntityForMap(stub shim.ChaincodeStubInterface) ([]Entity, error) {
	var entityData []Entity
	
	getAllEntity(stub)
	
	if len(AllEntity) > 0 {
		for _, entity := range AllEntity {
			// get details of each entity
			fmt.Printf("entityData are : %v\n", entity)
			entityData = append(entityData, entity)
		}
		fmt.Printf("List Of entity : %v \n", entityData)
		return entityData, nil
	}
	return nil, errors.New("Unable to find any entity details")

}

func getEntityForMap(entityID string, stub shim.ChaincodeStubInterface) (Entity, error) {

	var entityData Entity
	
	getAllEntity(stub)
	
	if len(AllEntity) > 0 {
		for _, entity := range AllEntity {
			
			if entity.Entity_ID == entityID {
				fmt.Printf("Entity Data are : %v\n", entity)
				entityData = entity
			}
		}
		fmt.Printf("List Of entity : %v \n", entityData)
		return entityData, nil
	}
	return entityData, errors.New("Unable to find any entity data")
}

func getAllProjectForMap(stub shim.ChaincodeStubInterface) ([]socialProject, error) {

	var projectDetail []socialProject
	
	getAllProject(stub)
	
	if len(AllProject) > 0 {
		for _, project := range AllProject {
			// get details of each project
			fmt.Printf("projectDetail are : %v\n", project)
			projectDetail = append(projectDetail, project)
		}
		fmt.Printf("List Of projects : %v \n", projectDetail)
		return projectDetail, nil
	}
	return nil, errors.New("Unable to find any project details")

}

func getProjectForMap(projectID string, stub shim.ChaincodeStubInterface) (socialProject, error) {

	var projectDetail socialProject
	
	getAllProject(stub)
	
	if len(AllProject) > 0 {
		for _, project := range AllProject {
			
			if project.Project_ID == projectID {
				fmt.Printf("project Data are : %v\n", project)
				projectDetail = project
			}
		}
		fmt.Printf("project is : %v \n", projectDetail)
		return projectDetail, nil
	}
	return projectDetail, errors.New("Unable to find any project data")
}

func get_POProject_FromMap(projectID string, stub shim.ChaincodeStubInterface) (socialProject, error) {

	var POProject_Detail socialProject_PO
	
	getAllPOProject(stub)
	
	if len(m_socialProject_PO) > 0 {
		for _, project := range m_socialProject_PO {
			
			if project.Project_ID == projectID {
				fmt.Printf("project Data are : %v\n", project)
				POProject_Detail = project
			}
		}
		fmt.Printf("project is : %v \n", POProject_Detail)
		return POProject_Detail, nil
	}
	return POProject_Detail, errors.New("Unable to find any PO project data")
}

// Query callback representing the query of a chaincode
func (t *SimpleChaincode) Query(stub shim.ChaincodeStubInterface, function string, args []string) ([]byte, error) {
	switch function {

	
	case "GetSingleEntity":
		if len(args) < 1 {
			return nil, errors.New("GetSingleEntity failed. Must include 1 key values")
		}
		
		entityData,err := getEntityForMap(args[0], stub)
		
		jsonRows, err := json.Marshal(&entityData)
		
		if err != nil {
			return nil, fmt.Errorf("GetSingleEntity operation failed. Error marshaling JSON: %s", err)
		}
		
	return jsonRows, nil

	case "GetAllEntity":
		
		var allEntity []Entity
		
		allEntity, err = getAllEntityForMap(stub)

		jsonRows, err := json.Marshal(&allEntity)
		if err != nil {
			return nil, fmt.Errorf("GetAllEntity operation failed. Error marshaling JSON: %s", err)
		}

	return jsonRows, nil
		
	case "GetSingleProject":
		if len(args) < 1 {
			return nil, errors.New("GetSingleProject failed. Must include 1 key values")
		}
		
		projectData,err := getProjectForMap(args[0], stub)
		
		jsonRows, err := json.Marshal(&projectData)
		
		if err != nil {
			return nil, fmt.Errorf("GetSingleProject operation failed. Error marshaling JSON: %s", err)
		}
		
	return jsonRows, nil

	case "GetAllProject":
		
		var allProject []socialProject
		
		allProject, err = getAllProjectForMap(stub)

		jsonRows, err := json.Marshal(&allProject)
		if err != nil {
			return nil, fmt.Errorf("GetAllProject operation failed. Error marshaling JSON: %s", err)
		}

	return jsonRows, nil

		
	case "GetSingleProject_PO":
		if len(args) < 1 {
			return nil, errors.New("GetSingleProject_PO failed. Must include 1 key values")
		}
		
		projectData,err := get_POProject_FromMap(args[0], stub)
		
		jsonRows, err := json.Marshal(&projectData)
		
		if err != nil {
			return nil, fmt.Errorf("GetSingleProject operation failed. Error marshaling JSON: %s", err)
		}
		
	return jsonRows, nil

	
	default:
		return nil, errors.New("Unsupported operation")
	}
}

func main() {
	err := shim.Start(new(SimpleChaincode))
	if err != nil {
		fmt.Printf("Error starting Simple chaincode: %s", err)
	}
}

