const cookie_username = JSON.parse(document.getElementById('json-username').textContent)

const base = document.getElementById("profile-base")
const profile_picture = document.getElementById("profile-picture")
const username = document.getElementById("value-username").innerText
const email = document.getElementById("value-email").innerText
const self_profile = cookie_username ==  username

if (self_profile && email == "-"){
    let div = build_missing_error_element()
    base.insertBefore(div, profile_picture)
    document.getElementById("title-email").innerHTML = "<b id='warning-info'>❗<span class='tooltip'>Mandatory if you forget your password</span></b> Email: "
    init_hide_error()
}

function init_hide_error(){
    const cross = document.getElementById("email-error-x")
    cross.addEventListener("click", (e) =>{
        e.target.closest("#email-error").remove()
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