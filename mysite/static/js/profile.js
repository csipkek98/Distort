

const cookie_username = JSON.parse(document.getElementById('json-username').textContent)

const base = document.getElementById("profile-base")
const profile_picture = document.getElementById("profile-picture")
const username = document.getElementById("value-username").innerText
const user_email = document.getElementById("value-email").innerText
const self_profile = cookie_username ==  username
const no_email = user_email == "-"
let APIbody = ""

if (self_profile){
    place_profile_button("edit-profile-button", "edit")
    init_edit_button()
    // place_profile_button("save-profile-button", "save") 
}

if (self_profile && no_email){
    let div = build_missing_error_element()
    base.insertBefore(div, profile_picture)
    document.getElementById("title-email").innerHTML = "<b id='warning-info'>❗<span class='tooltip'>Mandatory if you forget your password</span></b> Email: "
    init_hide_error_button()
}

function init_hide_error_button(){
    const cross = document.getElementById("email-error-x")
    cross.addEventListener("click", (e) =>{
        e.target.closest("#email-error").remove()
      })
}

function place_profile_button(id, name){
    let button = document.createElement("button")
    button.id = id
    button.innerText = name
    document.getElementById("button-container").appendChild(button)
}

function init_edit_button(){
    const button = document.getElementById("edit-profile-button")
    button.addEventListener("click", (e) =>{
        e.target.remove()
        const values = document.querySelectorAll("[id^='value-'")
        for (let i = 0;i<values.length; i++){
            if(values[i].id != "value-staff" && values[i].id != "value-admin"){
                let input = document.createElement("input")
                const div = document.createElement("div")
                div.appendChild(input)
                input.id = values[i].id
                if(values[i].innerText == "-"){
                    input.value = ""
                }else{
                    input.value = values[i].innerText
                }
                values[i].parentElement.appendChild(div)
                values[i].remove()
            }
            
        }
        place_profile_button("save-profile-button", "save")
        init_save_button()
    })
}

function init_save_button(){
    const button = document.getElementById("save-profile-button")
    button.addEventListener("click", (e) =>{
        const values = document.querySelectorAll("[id^='value-'")
        const email_field_value = document.getElementById("value-email").value
        const username_field_value = document.getElementById("value-username").value
        if (!email_field_value.match(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g) && email_field_value.length != 0){
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: "Invalid email format, please try again!",
              })
        }else if(no_email && email_field_value.length == 0){
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: "You cannot change your profile without an email adress, pleas add one to your profile!",
              })
        }else if(email_field_value.length == 0){
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: "Email field cannot be empty! Please add an email!",
              })
        }else if(!username_field_value.match(/^[a-zA-Z0-9]{4,20}$/g)){
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: "Username can't contain special characters and must be 4-20 characters long",
              })
        }else{
            APIbody = "{"
            for (let i = 0;i<values.length; i++){
                if(values[i].id != "value-staff" && values[i].id != "value-admin"){
                    if(values[i].value == ""){
                        APIbody += ""+'"'+values[i].id.split("-")[1]+'"'+": "+'""'+", "
                    }else{
                        console.log("Have value:",values[i].id.split("-")[1])
                        APIbody += ""+'"'+values[i].id.split("-")[1]+'"'+": "+'"'+values[i].value+'"'+", "
                    }
                }
            }
            APIbody = APIbody.substring(0,APIbody.length-2)
            console.log(APIbody)
            APIbody+="}"
            send_new_profile_data()
        }
        
    })
}


function build_missing_error_element(){
    let div = document.createElement("div")
    div.id = "email-error"
    let innerdiv = document.createElement("div")
    innerdiv.id = "email-error-text"
    innerdiv.innerHTML = "<b>You didn't bound an email to your account yet. It is vital if you want to use the 'forgotten password' option. Please bound one as soon as possible</b><b id='email-error-x'>❌</b>"
    div.appendChild(innerdiv)
    return div
}

async function send_new_profile_data(){
    let csrftoken = getCookie('csrftoken');
    console.log(APIbody)
    const response = await fetch(window.location.href, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          "X-CSRFToken": csrftoken
        },
        body: JSON.stringify(APIbody),
        });
        
        return response.json().then(data => {
            if(data["message"] != ""){
                if(data["status"] == "success"){
                    Swal.fire({
                        icon: 'success',
                        title: 'Profile updated',
                        text: data["message"],
                        timer: 2500,
                        didClose: () => {
                            window.location.href = window.location.origin+"/profile/"+data["username"]
                          }
                      })
                }else if(data["status"] == "failed"){
                    Swal.fire({
                        icon: 'error',
                        title: 'Oops...',
                        text: data["message"],
                      }).then()
                }
            }else{
                window.location.href = window.location.origin+"/profile/"+data["username"]
            }
        });
}

function getCookie(name) {
    var cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        var cookies = document.cookie.split(';');
        for (var i = 0; i < cookies.length; i++) {
            var cookie = cookies[i].trim();
            // Does this cookie string begin with the name we want?
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}