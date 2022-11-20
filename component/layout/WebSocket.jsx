import SockJS from 'sockjs-client';
import { Stomp } from '@stomp/stompjs';
import { useDispatch, useSelector } from 'react-redux';
import { isLoggedIn, url } from "../../common/utils";
import { useEffect } from 'react';

let stompClient;
let account;
let dispatch;

const connect =() =>{
    let socket = new SockJS(url+'/fandom');
    stompClient = Stomp.over(socket);
    //stompClient.connect({}, onConnected, onError);
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
      let ob ={};
      ob[message.id] = message;
    //   processNotification({
    //     message: "Bạn có một tin nhắn mới",
    //     note: "Tin nhắn",
    //   })
    //   dispatch(addNewMessageCurrentMessageList(ob));
    });
  
    stompClient.subscribe(`/user/${account}/notification`, data =>{
      let notification = JSON.parse(data.body);
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
    account = useSelector(state => state.user.account);

    useEffect(() => {
        if(isLoggedIn()){
          connect();
        }
      }, []);


    return (
        <></>
    )
}

export {connect, stompClient, sendMessage};

export default WebSocket;