package main

import (
    "errors"
    "fmt"
    "encoding/json"
    "github.com/hyperledger/fabric/core/chaincode/shim"
)

// Proof Of Existence (POE) Chaincode implementation
type POEChaincode struct {}


// Structure to hold the information related to documents
type InformationHolder struct {
    Hash string `json:"hash"`  // Actual hash value
    Bytes string `json:"bytes"` //Base64 encodeed string stored corresponsing to the hash value
}

/*
Chaincode comprises of 3 sections : 1. Deploy, Invoke and query
Deploy will instantiate a chaincode in the containers of the peer
Invoke represents any transactionthat is recorded
Query Represents query the current state
*/


// Init - reset all the things
func(t * POEChaincode) Init(stub shim.ChaincodeStubInterface, function string, args[] string)([] byte, error) {

    // Need to check if initialisation required with specificity or not
    return nil, nil
}


// Invoke - entry point for Invocations
func(t * POEChaincode) Invoke(stub shim.ChaincodeStubInterface, function string, args[] string)([] byte, error) {

    switch
    function {

        case "add_hash_details":
            return t.add_hash_details(stub, args)

        default:
            return nil, errors.New("Function of the name " + function +" doesn't exist.")

    }

}

// Query - entry point for Queries
func(t * POEChaincode) Query(stub shim.ChaincodeStubInterface, function string, args[] string)([] byte, error) {

    switch
    function {

        case "get_hash_details":
            return t.get_hash_details(stub, args)

        default:
            return nil, errors.New("Received unknown function invocation " + function)
    }
}

//Add hash on the fabric + details

func(t * POEChaincode) add_hash_details(stub shim.ChaincodeStubInterface, args[] string)([] byte, error) {

    // How to take this arguement??
    // As a single base64 encrypted string or individual??
    // Currenly : Individual arguements are taken
    if len(args) != 2 {
        return nil, errors.New("No. of arguements not match requirements")
    }

    hash := args[0]
    otherInfo := args[1]

    bytes, err := stub.GetState(hash);
    if err != nil {
        return nil, errors.New("Error while checking for hash")
    }
    if bytes != nil {
        return nil, errors.New("Hash already exist")
    }

    var holder InformationHolder;
    holder.Hash = hash;
    holder.Bytes = otherInfo;

    bytes, err = json.Marshal(holder)

    if err != nil {
        return nil, errors.New("Error converting hash record")
    }

    err = stub.PutState(holder.Hash, bytes)

    if err != nil {
        return nil, errors.New("Error storing hash record")
    }

    return nil, nil
}

// Function to retreive the hash
func(t * POEChaincode) get_hash_details(stub shim.ChaincodeStubInterface, args[] string)([] byte, error) {

    if len(args) != 1 {
        return nil, errors.New("No. of arguements not match requirements")
    }

    hash := args[0]

    // check if hash is present and bytes are not nil
    bytes, err := stub.GetState(hash);
    if err != nil {
        return nil, errors.New("Error while checking for hash")
    }
    if bytes == nil {
        return []byte("Hash does not Exist"), nil
    }

    return bytes, nil
}


// Main : Entry point of the chaincode
func main() {
    err := shim.Start(new(POEChaincode))
    if err != nil {
        fmt.Printf("Error starting POE Chaincode: %s", err)
    }
}