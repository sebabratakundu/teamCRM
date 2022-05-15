$(document).ready(function(){
  // auto login
  if(document.cookie.includes("authToken")){
    window.location = "/profile";
  }


  // request login modal
  $("#login_request_btn").click((e)=>{
    e.preventDefault();
    requestModal("#signup_modal","#login_modal");
  });

  // request signup modal
  $("#signup_request_btn").click((e)=>{
    e.preventDefault();
    requestModal("#login_modal","#signup_modal");
  });

  // signup request coding
  $(".signup-form").submit((e)=>{
    e.preventDefault();
    signup(e.target);
  });

  // login request coding
  $(".login-form").submit((e)=>{
    e.preventDefault();
    login(e.target);
  });

  $("[name=role]").on("change",function(){
    $(".login_btn").attr("disabled",false);
  })
});

// request login signup modal
function requestModal(currentModal,modalTo){
  $(currentModal).modal("hide");
  $(modalTo).modal("show");
}

// signup function coding
function signup(form){
  $.ajax({
    type : "POST",
    url : "api/signup",
    data : new FormData(form),
    contentType : false,
    processData : false,
    beforeSend : function(){
      $(".signup_loading_btn").removeClass("d-none");
      $(".signup_btn").addClass("d-none");
    },
    success : function(response){
      console.log(response);

      $(".signup_loading_btn").addClass("d-none");
      $(".signup_btn").removeClass("d-none");
      if(response.isUserCreated){
        window.location = "/client";
      }else{
        console.log(response);
      }
    },
    error : function(error){
      $(".signup_loading_btn").addClass("d-none");
      $(".signup_btn").removeClass("d-none");
      
      // error handle
      const errors = error.responseJSON;
      $(`.${errors.data.field}`).addClass("border-danger");
      $(`.${errors.data.field}-error`).text(errors.data.message);
      removeError(errors.data.field,2000);
    }
  });
}

function login(form){
  $.ajax({
    type : "POST",
    url : "api/login",
    data : new FormData(form),
    contentType : false,
    processData : false,
    beforeSend : function(){
      $(".login_loading_btn").removeClass("d-none");
      $(".login_btn").addClass("d-none");
    },
    success : function(response){
      console.log(response);
      $(".login_loading_btn").addClass("d-none");
      $(".login_btn").removeClass("d-none");
      if(response.isLogged){
        if(response.role == "admin"){
          window.location = "/client";
        }else if(response.role == "client"){
          window.location = "/business";
        }
      }else{
        $(".error-msg-box").removeClass("d-none");
        $(".error-msg").text("somthing went wrong!");
      }
    },
    error : function(error){
      $(".login_loading_btn").addClass("d-none");
      $(".login_btn").removeClass("d-none");      
      // error handle
      const errors = error.responseJSON;
      $(".error-msg-box").removeClass("d-none");
      $(".error-msg").text(errors.message);
      // $(`.${errors.data.field}`).addClass("border-danger");
      // $(`.${errors.data.field}-error`).text(errors.data.message);
      // removeError(errors.data.field,2000);
    }
  });
}

function removeError(element,delay){
  setTimeout(()=>{
    $(`.${element}`).removeClass("border-danger");
    $(`.${element}-error`).html("");
  },delay);
}