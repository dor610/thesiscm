import SockJS from 'sockjs-client';
import { Stomp } from '@stomp/stompjs';
import { useDispatch, useSelector } from 'react-redux';
import { isLoggedIn, url } from "../../common/utils";
import { useEffect } from 'react';
import { notify, successNotify } from '../../common/toastify';
import { setPresentationReloadReport, setPresentationReportApproved, setStartPresent } from '../../features/presentationSlice';

let stompClient;
let account;
let dispatch;

const connect =(userAccount) =>{
    account = userAccount;
    stompClient = Stomp.over(function(){
      return new SockJS(url+'/fandom')
    });
    stompClient.connect({}, onConnected, onError);
  }

  const onConnected = () =>{
  
    stompClient.subscribe('/topic/newMember', data =>{
      let friend = data.body
      console.log(friend);
    });
  
    stompClient.subscribe('/topic/disconnect', data =>{
      let friend = data.body;
      console.log(friend);
    });
  
  
      // Tell your username to the server
    sendMessage('/app/register', account);
  
    stompClient.subscribe(`/user/${account}/msg`,  data =>{
      let message = JSON.parse(data.body);
      notify(message.content, 1);
      if(message.typeCode == "1"){
        dispatch(setStartPresent(true));
      } 
      if(message.typeCode == "6") {
        dispatch(setPresentationReloadReport(true));
        dispatch(setPresentationReportApproved(true));
      }
      
    });
  
    stompClient.subscribe(`/user/${account}/notification`, data =>{
      let notification = JSON.parse(data.body);
      console.log(notification);
      let ob = {};
      ob[notification.id] = notification;
    //   dispatch(addNotification(ob));
    //   processNotification(notification);
    })
  
  }
  
  function sendMessage(url, message) {
    stompClient.send(url, {}, message);
  }
  
  const onError = () =>{
    console.log("Erorrororororo");
  }

const WebSocket = () => {
    dispatch = useDispatch();
    let userAccount = useSelector(state => state.user.account);

    useEffect(() => {
        if(isLoggedIn() && userAccount){
          connect(userAccount);
        }
      }, [userAccount]);


    return (
        <></>
    )
}

export {connect, stompClient, sendMessage};

export default WebSocket;