import { useRef, useEffect, useState } from "react";
import PBFT from './Components/pbft';
import data from './data/data';
import './App.css';
import useWebSocket, { ReadyState } from "react-use-websocket";


function App() {
  //Get total transactions available, so when selecting a transaction we can check if its valid
  const transactionCount = useRef(0);
  //Choose which transaction we want to look at, if txn 1 is chosen display txn 1 data
  const [currentTransaction, setCurrentTransaction] = useState(0);
  //Info for PBFT diagram, sent to PBFT data=
  const [diagramInfo, setDiagramInfo] = useState({});
  const [prepareInfo, setPrepareInfo] = useState({});
  const [commitInfo, setCommitInfo] = useState({});
  //Stores all messages from ResDB
  const allMessages = useRef({});
  console.log("Check", allMessages.current);
  //For Websocket functionality, boot up start_service.sh on backend first, then
  //load websocket. If console says "Websocket Open" for all 4, functionality works
    
    let ws1 = new WebSocket('ws://localhost:21001');
    let ws2 = new WebSocket('ws://localhost:21002');
    let ws3 = new WebSocket('ws://localhost:21003');
    let ws4 = new WebSocket('ws://localhost:21004');
 
  ws1.onopen = () => {
    console.log('WebSocket1 Open');
  }
  ws2.onopen = () => {
    console.log('WebSocket2 Open');
  }
  ws3.onopen = () => {
    console.log('WebSocket3 Open');
  }
  ws4.onopen = () => {
    console.log('WebSocket4 Open');
  }

  class Lock{
    constructor(){
      this.lock=false;
      this.queue=[];
    }
    async getLock(){
      if(!this.lock){
        this.lock=true;
        return true;
      }
      else{
        return new Promise((resolve)=> {
          this.queue.push(resolve);
        });
      }
    }

    release(){
      if(this.queue.length>0){
        const resolve = this.queue.shift();
        resolve(true);
      }
      else{
        this.lock=false;
      }
    }
  }

  const messageLock= new Lock();
  ws1.onmessage = async (event) => {
    //console.log('Received 1 Data: ', event.data);
    await messageLock.getLock();
    console.log("Got Lock 1");
    console.log("Message List:", allMessages.current);
    addMessage(event.data);
    messageLock.release();
  }
  ws2.onmessage = async (event) => {
    //console.log('Received 2 Data: ', event.data);
    await messageLock.getLock();
    console.log("Got Lock 2");
    console.log("Message List:", allMessages.current);
    addMessage(event.data);
    messageLock.release();
  }
  ws3.onmessage = async (event) => {
    //console.log('Received 3 Data: ', event.data);
    await messageLock.getLock();
    console.log("Got Lock 3");
    console.log("Message List:", allMessages.current);
    addMessage(event.data);
    messageLock.release();
  }
  ws4.onmessage = async (event) => {
    //console.log('Received 4 Data: ', event.data);
    await messageLock.getLock();
    console.log("Got Lock 4");
    console.log("Message List:", allMessages.current);
    addMessage(event.data);
    messageLock.release();
  }

  ws1.onclose= () =>{
    console.log('WebSocket1 Close');
  }
  ws2.onclose= () =>{
    console.log('WebSocket2 Close');
  }
  ws3.onclose= () =>{
    console.log('WebSocket3 Close');
  }
  ws4.onclose= () =>{
    console.log('WebSocket4 Close');
  }

  const addMessage = (receivedMessage) => {
    let newMessage=JSON.parse(receivedMessage);
    const reply= new Date().getTime();
    newMessage = {
      ...newMessage,
      reply_time: reply,
    }
    const txn_number = String(newMessage.txn_number);
    const replica_number = String(newMessage.replica_id);
    let updatedMessageList = allMessages.current;
    if(txn_number in updatedMessageList){
      let txn_messages = updatedMessageList[txn_number];
      txn_messages = {
        ...txn_messages,
        [replica_number]: newMessage,
      };
      updatedMessageList[txn_number]= txn_messages;
      console.log("Received Message: ", updatedMessageList)
      allMessages.current=updatedMessageList;
    }
    else{
      let txn_messages = {
        [replica_number]: newMessage,
      }
      updatedMessageList[txn_number]= txn_messages;
      console.log("Received Message: ", updatedMessageList)
      allMessages.current=updatedMessageList;
      transactionCount.current = transactionCount.current+1;
    }
    console.log(allMessages.current);
  }

  const chooseTransaction = (newTransactionNumber) => {
    if(newTransactionNumber<=transactionCount.current && newTransactionNumber>0 && String(newTransactionNumber) in allMessages.current){
      let transactionMessages = allMessages.current[String(newTransactionNumber)];
      let diagramData;
      for ( const key in transactionMessages){
        diagramData = {
          primaryId: "Replica"+String(transactionMessages[key]["primary_id"]),
          replicas: [],
        };
        break;
      }
      let prepareList = {};
      let commitList = {};
      for ( const key in transactionMessages){
        let replicaData = {
          id: "Replica"+String(transactionMessages[key]["replica_id"]),
          states: {
            prepare: transactionMessages[key]["prepare_time"],
            commit: transactionMessages[key]["commit_time"],
            reply: transactionMessages[key]["reply_time"],
          },
        };
        if(replicaData.id==diagramData.primaryId){
          replicaData["states"].propose = transactionMessages[key]["propose_pre_prepare_time"];
        }
        else{
          replicaData["states"].pre_prepare = transactionMessages[key]["propose_pre_prepare_time"];
        }
        diagramData.replicas.push(replicaData);
        let prepareData=[[0, transactionMessages[key]["prepare_time"]]];
        let pos=1;
        for( const _ of transactionMessages[key]["prepare_message_timestamps"]){
          prepareData.push([pos, transactionMessages[key]["prepare_message_timestamps"][pos-1]]);
          pos=pos+1;
        }
        prepareList[key]=prepareData;
        let commitData=[[0, transactionMessages[key]["commit_time"]]];
        pos=1;
        for( const _ of transactionMessages[key]["commit_message_timestamps"]){
          commitData.push([pos, transactionMessages[key]["commit_message_timestamps"][pos-1]]);
          pos=pos+1;
        }
        commitList[key]=commitData;
      }
      setDiagramInfo(diagramData);
      setPrepareInfo(prepareList);
      setCommitInfo(commitList);
      setCurrentTransaction(newTransactionNumber);
      console.log("Diagram data", diagramInfo);
      console.log("Prepare data", prepareInfo)
      console.log("Commit data", commitInfo);
      console.log("Diagram data2", diagramData);
      console.log("Prepare data2", prepareList)
      console.log("Commit data2", commitList);
    }
    else{
      console.log("INVALID TRANSACTION NUMBER");
    }
  }

  let txn_1_replicaMessage_1 ={
    commit_message_timestamps:["1699498916980955291","1699498917019202616","1699498917020796980"],
    commit_time:"1699498917020812647",
    execution_time:"1699498917020924446",
    ip:"127.0.0.1",
    port:10001,
    prepare_message_timestamps:["1699498916959061909","1699498916969625301","1699498916969659372","1699498916990955019"],
    prepare_time:"1699498916969663414",
    primary_id:1,
    propose_pre_prepare_time:"1699498916930937081",
    replica_id:1,
    txn_commands:["SET"],
    txn_keys:["test"],
    txn_number: 1,
    txn_values:["test_value"]
  };

  let txn_1_replicaMessage_2 ={
    commit_message_timestamps:["1699498916998967192","1699498917019423780","1699498917028727456"],
    commit_time:"1699498917028787428",
    execution_time:"1699498917028853968",
    ip:"127.0.0.1",
    port:10002,
    prepare_message_timestamps:["1699498916959764453","1699498916998844988","1699498916999055053","1699498917019403782"],
    prepare_time:"1699498916999059459",
    primary_id:1,
    propose_pre_prepare_time:"1699498916949648356",
    replica_id:2,
    txn_commands:["SET"],
    txn_keys:["test"],
    txn_number: 1,
    txn_values:["test_value"]
  };

  let txn_1_replicaMessage_3 ={
    commit_message_timestamps:["1699498916989884752","1699498917010008941","1699498917010854301"],
    commit_time:"1699498917018692475",
    execution_time:"1699498917019099277",
    ip:"127.0.0.1",
    port:10003,
    prepare_message_timestamps:["1699498916960155418","1699498916990012000","1699498917008930753","1699498917009136797"],
    prepare_time:"1699498917008937079",
    primary_id:1,
    propose_pre_prepare_time:"1699498916959920946",
    replica_id:3,
    txn_commands:["SET"],
    txn_keys:["test"],
    txn_number: 1,
    txn_values:["test_value"]
  };

  let txn_1_replicaMessage_4 ={
    commit_message_timestamps:["1699498916988676310","1699498917018959109","1699498917019124910"],
    commit_time:"1699498917019135078",
    execution_time:"1699498917019563283",
    ip:"127.0.0.1",
    port:10004,
    prepare_message_timestamps:["1699498916998840757","1699498917000213891","1699498917000342843"],
    prepare_time:"1699498917000347390",
    primary_id:1,
    propose_pre_prepare_time:"1699498916950882518",
    replica_id:4,
    txn_commands:["SET"],
    txn_keys:["test"],
    txn_number: 1,
    txn_values:["test_value"]
  };

  let txn_2_replicaMessage_1 ={
    commit_message_timestamps:["1699498917070886051","1699498922229122655","1699498922229158009","1699498922229210601","1699498922229249484"],
    commit_time:"1699498922229218622",
    execution_time:"1699498922229342067",
    ip:"127.0.0.1",
    port:10001,
    prepare_message_timestamps:["1699498922190342885","1699498922200311399","1699498922209066360","1699498922209070944"],
    prepare_time:"1699498922209073251",
    primary_id:1,
    propose_pre_prepare_time:"1699498922190113641",
    replica_id:1,
    txn_commands:["GET"],
    txn_keys:["test"],
    txn_number: 2,
    txn_values:[""]
  };

  let txn_2_replicaMessage_2 ={
    commit_message_timestamps:["1699498917070886051","1699498922229122655","1699498922229158009","1699498922229210601","1699498922229249484"],
    commit_time:"1699498922229218622",
    execution_time:"1699498922229342067",
    ip:"127.0.0.1",
    port:10002,
    prepare_message_timestamps:["1699498922190342885","1699498922200311399","1699498922209066360","1699498922209070944"],
    prepare_time:"1699498922209073251",
    primary_id:1,
    propose_pre_prepare_time:"1699498922190113641",
    replica_id:2,
    txn_commands:["GET"],
    txn_keys:["test"],
    txn_number: 2,
    txn_values:[""]
  };

  let txn_2_replicaMessage_3 ={
    commit_message_timestamps:["1699498917059278411","1699498922209748259","1699498922219468424","1699498922219603912",1699498922220132804],
    commit_time:"1699498922219640882",
    execution_time:"1699498922229327258",
    ip:"127.0.0.1",
    port:10003,
    prepare_message_timestamps:["1699498922180693768","1699498922199077851","1699498922209739294","1699498922209748128"],
    prepare_time:"1699498922209745927",
    primary_id:1,
    propose_pre_prepare_time:"1699498922179155079",
    replica_id:3,
    txn_commands:["GET"],
    txn_keys:["test"],
    txn_number: 2,
    txn_values:[""]
  };

  let txn_2_replicaMessage_4 ={
    commit_message_timestamps:["1699498917079031681","1699498922210941218","1699498922220435115","1699498922220441389"],
    commit_time:"1699498922220497392",
    execution_time:"1699498922229050481",
    ip:"127.0.0.1",
    port:10004,
    prepare_message_timestamps:["1699498917040604203","1699498922180907097","1699498922208765459","1699498922209140418",1699498922209849630],
    prepare_time:"1699498922209145223",
    primary_id:1,
    propose_pre_prepare_time:"1699498922179797657",
    replica_id:4,
    txn_commands:["GET"],
    txn_keys:["test"],
    txn_number: 2,
    txn_values:[""]
  };

  const testSetup = ()=> {
    console.log("Messages:", allMessages.current);
    chooseTransaction(1);
    console.log(diagramInfo);
  };

  const sendMessage = (replicaNumber) => {
    const ws_list = ['22001', '22002', '22003', '22004'];  
    const sendWs = new WebSocket('ws://localhost:'+ws_list[replicaNumber]);
    sendWs.onopen = () => {
      sendWs.send("Message");
    }
  }


  return (
    <>
      <div>
        <button onClick={testSetup}>Test</button>
        <button onClick={()=>sendMessage(0)}>Message to Replica 1</button>
        <button onClick={()=>sendMessage(1)}>Message to Replica 2</button>
        <button onClick={()=>sendMessage(2)}>Message to Replica 3</button>
        <button onClick={()=>sendMessage(3)}>Message to Replica 4</button>
        <PBFT data={diagramInfo} />
      </div>
    </>
  );
}

export default App;
