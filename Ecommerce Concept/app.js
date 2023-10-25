var firebaseConfig = {

};

var app = firebase.initializeApp(firebaseConfig);
var uid;
var userId;

function signUpUser() {
    var userEmail = document.getElementById("email").value
    var userPass = document.getElementById("pass").value
    app.auth().createUserWithEmailAndPassword(userEmail, userPass)
    .then(function (res) {
        console.log(res);
        // var keys = app.database().ref('/').child("usersData/").push().key;
        var userData = {
            username: userEmail,
            pass: userPass,
            key:res.user.uid

        }
            app.database().ref('/').child("usersData/").push(userData);
        })
        .catch(function (err) {
            console.log(err)
            alert(err.message)
        })
    // 
}

function loginUser() {
    var userEmail = document.getElementById("emailLogin").value
    var userPass = document.getElementById("passLogin").value

    app.auth().signInWithEmailAndPassword(userEmail, userPass)
        .then(function (res) {
            console.log(res);
            // app.database().ref('/').child("usersData/").push(userData);
        })
        .catch(function (err) {
            console.log(err)
            alert(err.message)
        })
    // 
}


function addToCart(eleThis){
console.log(uid,eleThis)
if(uid){
    console.log(eleThis.parentNode.childNodes[0])
    console.log("logined");
    // var allUser=[] ;
    var proObj={
        title:eleThis.parentNode.childNodes[0].innerHTML,
        price:23232
    }
    app.database().ref('/usersData').on('child_added', (snapshot) => {
        const data = snapshot.val();
        console.log(data)
        // allUser.push(data);
        if(uid == snapshot.val().key){
            app.database().ref('/usersData').child(snapshot.key).child("cartList").push(proObj)
        }
        // updateStarCount(postElement, data);
      });
      
}
else{
alert('please login first')
}
}

function getAllPost(){
    app.database().ref('/products').on("child_added",function(data){
        console.log(data.val());
        var proList = document.getElementById("proList");
        var proDiv = document.createElement('div');
        proDiv.setAttribute("class","proCon")
        
        var btnAddCart = document.createElement("button");
        btnAddCart.innerHTML="Add to Cart"
        btnAddCart.setAttribute("id",data.val().key)
        btnAddCart.setAttribute("onclick",`addToCart(this)`)
        var proTitle = document.createElement('p');
        proTitle.innerHTML = data.val().title;
        var proDesc = document.createElement('p');
        proDesc.innerHTML = data.val().desc;
        var proPrice = document.createElement('p');
        proPrice.innerHTML = data.val().price;
        var proimg = document.createElement('img');
        proimg.setAttribute("height","100")
        proimg.setAttribute("width","100")
        proimg.src=data.val().proImage;
        proDiv.appendChild(proTitle);
        proDiv.appendChild(proDesc);
        proDiv.appendChild(proPrice);
        proDiv.appendChild(proimg);
        proDiv.appendChild(btnAddCart);
        proList.appendChild(proDiv);
    })
}

function addPost() {
    var title = document.getElementById('title')
    var desc = document.getElementById('desc')
    var price = document.getElementById('price')
    var proImage = document.getElementById('proImage')
    var key=  app.database().ref('/').child('products').push().key
    var proObj = {
        title: title.value,
        desc: desc.value,
        price: price.value,
        proImage: proImage.value,
        key
    }
app.database().ref('/products').child(key).set(proObj);
        // .then((success) => {
        //     title.value = ""
        //     desc.value = ""
        //     price.value = ""
        //     proImage.value = ""
        // })
        // .catch((err) => {
        //     console.log(err)
        // })
}

function onAuth(){

    app.auth().onAuthStateChanged((user) => {
        if (user) {
            // User is signed in, see docs for a list of available properties
            // https://firebase.google.com/docs/reference/js/firebase.User
            uid = user.uid;
            console.log(uid, user)
            // ...
        } else {
            // User is signed out
            uid=undefined
            console.log("logout");
            // ...
        }
    });
}


function logout() {
    firebase.auth().signOut().then((data) => {
        console.log(data)
        // Sign-out successful.
        uid=undefined;
    }).catch((error) => {
        console.log(error)
        // An error happened.
    });
}