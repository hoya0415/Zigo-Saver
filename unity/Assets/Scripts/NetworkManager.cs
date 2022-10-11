using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using Photon.Pun;
using Photon.Realtime;
using UnityEngine.UI;
using System.Runtime.InteropServices;
using System.IO;
using UnityEngine.Networking;

public class NetworkManager : MonoBehaviourPunCallbacks
{
    // public InputField NickNameInput;
    // public GameObject DisconnectPanel;
    // public GameObject RespawnPanel;
    
    // public string nowserver;
    // public string Inputname;

    // public void namename (string username)
    // {
    //     username = "test";
    // }
    // public username = "test";

    // Then create a function that is going to trigger
    // the imported function from our JSLib.

    // // [SerializeField] 
    // private Text Inputname;
    // // [SerializeField] 
    // private Text Servername;

    // public void Inputusername(string nickname) {
    //     Inputname.text = nickname;
    //     user = nickname;
    // }

    // public void Inputserver(string forestSinger) {
    //     Servername.text = forestSinger;
    //     nowserver = forestSinger;
    // }


    // [DllImport("__Internal")]
    // private static extern void CallReact (string nickname, string forestSinger);
    
    // [SerializeField] private Text user;

    
    // public void UnityCallReact (string nickname) 
    // {
    //     user = nickname;
    // } 
    
    // public Text user;

    // void start()
    // {
    //     StartCoroutine(GetNickname());
    // }

    // IEnumerator GetNickname() {
    //     UnityWebRequest www = UnityWebRequest.Get("http://k6d202.p.ssafy.io:5000/forest/");
    //     yield return www.SendWebRequest();
 
    //     if (www.result != UnityWebRequest.Result.Success) {
    //         Debug.Log(www.error);
    //     }
    //     else {
    //         // Show results as text
    //         Debug.Log(www.downloadHandler.text);
 
    //         // Or retrieve results as binary data
    //         byte[] results = www.downloadHandler.data;
    //     }
    // }

    // public void UnityCallReact (string name) {
    //     Debug.Log ($"nickname is {name}!");
    //     user.text = name;
    // }

    public string user;

    public void getnickname (string nickname)
    {
        // Debug.Log ($"닉네임은 {nickname} 이거다!");
        user = nickname;
    }

    void Awake()
    {
        // Inputname = "username";
        // username = Inputname.text;
        // Inputname = CallReact(forestSinger);
        // user = "text";
        
        Screen.SetResolution(1920, 1080, false);
        PhotonNetwork.SendRate = 60;
        PhotonNetwork.SerializationRate = 30;
        PhotonNetwork.ConnectUsingSettings();
        // getnickname(user);
    }

    // public void Connect() => PhotonNetwork.ConnectUsingSettings();
    public override void OnConnectedToMaster()
    {
        // 닉네임 받고
        PhotonNetwork.LocalPlayer.NickName = user;
        // PhotonNetwork.LocalPlayer.NickName = "user";
        // 방생성 후 입장
        PhotonNetwork.JoinOrCreateRoom("svt", new RoomOptions { MaxPlayers = 10 }, null);
    }

    public override void OnJoinedRoom()
    {
        GameObject player = PhotonNetwork.Instantiate("Player", Vector3.zero, Quaternion.identity);
        // DisconnectPanel.SetActive(false);
        // Spawn();
    }

    // public void Spawn()
    // {
    //     PhotonNetwork.Instantiate("Player", new Vector3(Random.Range(-6f, 19f), 4, 0), Quaternion.identity);
    //     // RespawnPanel.SetActive(false);
    // }

    // void Update() { if (Input.GetKeyDown(KeyCode.Escape) && PhotonNetwork.IsConnected) PhotonNetwork.Disconnect(); }

    // public override void OnDisconnected(DisconnectCause cause)
    // {
    //     // DisconnectPanel.SetActive(true);
    //     // RespawnPanel.SetActive(false);
    // }
}
