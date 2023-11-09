import { useState } from "react";
import PBFT from './Components/pbft';
import data from './data/data';
import './App.css';



function App() {
  const [transactionCount, setTransactionCount] = useState(0);
  const [allMessages, setAllMessage] = useState({});
  const [diagramInfo, setDiagramInfo] = useState({});

  const addMessage = (newMessage) => {
    const txn_number = String(newMessage.txn_number);
    const replica_number = String(newMessage.replica_id);
    let updatedMessageList = allMessages;
    if(txn_number in updatedMessageList){
      let txn_messages = updatedMessageList[txn_number];
      txn_messages = {
        ...txn_messages,
        [replica_number]: newMessage,
      };
      updatedMessageList[txn_number]= txn_messages;
      setAllMessage(updatedMessageList);
    }
    else{
      let txn_messages = {
        [replica_number]: newMessage,
      }
      updatedMessageList[txn_number]= txn_messages;
      setAllMessage(updatedMessageList);
      setTransactionCount(transactionCount+1);
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

  addMessage(txn_1_replicaMessage_1);
  addMessage(txn_1_replicaMessage_2);
  addMessage(txn_1_replicaMessage_3);
  addMessage(txn_1_replicaMessage_4);
  addMessage(txn_2_replicaMessage_1);
  addMessage(txn_2_replicaMessage_2);
  addMessage(txn_2_replicaMessage_3);
  addMessage(txn_2_replicaMessage_4);

  console.log(allMessages);
  return (
    <>
      <div>
        <PBFT data={data} />
      </div>
    </>
  );
}

export default App;
