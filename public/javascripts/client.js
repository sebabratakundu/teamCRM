$(document).ready(()=>{
  $("[name=token]").val(token);
  // start display country code wrt country name
  $("[name=clientCountry]").on("input",async function(){

    const keyword = this.value.trim().toLowerCase();

    // check in localStorage
    const isKeyExistsInLocal = findInLocalStorage("countries");
    if(!isKeyExistsInLocal){
      try{
        const response = await ajax({
          method : "GET",
          url : "/json/country-code.json",
        });
        
        // store the response in localStorage
        localStorage.setItem("countries",JSON.stringify(response));
      }catch(error){
        console.log(error);
      }
    }else{
      const countries = isKeyExistsInLocal;
      countries.forEach((country)=>{
        if(country.name.toLowerCase().match(keyword) != null){
          $(".country-code").text(country.dial_code);
        }
      });
    }
  })

  $("#add-client-btn").on("click",()=>{
    $("#add-client-modal").modal("show");
    $("#client-form").addClass("add-client-form");
    $("#client-form").removeClass("update-client-form");
    $("#client-form").removeAttr("data-id");
    $(".add_client_btn").text("Add Client");
  });
  
  toolTip(".filter-change-btn");
  toolTip(".copy-link-btn");
  toolTip(".send-email-btn");
  toolTip(".send-wp-btn");
});

// store client data
$(document).on("submit",".add-client-form",async function(e){
  e.preventDefault();
  
  try{
    const response = await ajax({
      method : "POST",
      url : "/client",
      data : new FormData(this),
      loader_btn : ".add_client_loading_btn",
      submit_btn : ".add_client_btn"
    });
    this.reset();
    $("#add-client-modal").modal('hide');
    new sweetAlert({
      title : "Success",
      message : response.message,
      icon : "success",
      cnfBtnTxt : "Close"
    },"POST");

    if($("tr","tbody").length < 5){
      const content = createDynamicTR(response.data);
      if($("tr","tbody").first().hasClass("no-data-txt")){
        $("tr","tbody").first().remove();
      }
      $("tbody",".table").append(content);
    }

    createPagination();

  }catch(error){
    const errors = error.responseJSON;
    if(error.status == 409){
      $(`.${errors.field}`).addClass("border border-danger");
      $(`.${errors.field}-error`).text(errors.message);
      removeError(errors.field,2000);
    }else{
      let errMsg = '';
      errors.forEach((err)=>{
        errMsg += `<li class="text-danger">${err.message}</li>`;
      })
      $(".error-msg-box").html(errMsg);
      setTimeout(()=>{
        $(".error-msg-box").html("");
      },2000);
    }
  }
});


// after view intiated
document.addEventListener("DOMContentLoaded",async ()=>{

  // check for clients
  const isAnyClientExists = await getClientsCount();
  if(isAnyClientExists){
    // show clients
    showClients();
    // create pagination
    createPagination()
  }else{
    $("tbody",".table").html("<tr class='no-data-txt'><td colspan='6' class='text-center'><p class='badge badge-info'>No data found!</p></td></tr>");
  }

  toolTip(".edit-client-btn");
})

// start find data in localStorage coding

function findInLocalStorage(key){
  if(localStorage.getItem(key) != null){
    return JSON.parse(localStorage.getItem(key));
  }

  return false;
}

// end find data in localStorage coding

// start show clients

async function showClients(from=0,to=5){
  let pageNumber = getPageNumber();
  if(pageNumber > 1){
    from = to*(pageNumber-1);
    to = to;
  }
  try{
    const response = await ajax({
      method : "GET",
      url : `client/${from}/${to}`,
      loader_btn : ".tmp",
      submit_btn : ".tmp"
    });
    let content = "";
    if(response.data.length > 0){
      // store data in session
      sessionStorage.setItem("clients",JSON.stringify(response.data));

      response.data.forEach((client)=>{
        content += createDynamicTR(client);
      })

      $("tbody",".table").html(content);
    }
  }catch(error){
    console.log(error.responseJSON);
  }
}

// end show clients


// start create dynamic TR

function createDynamicTR(client){
  let clientStr = JSON.stringify(client);
  clientStr = clientStr.replace(/"/g,"'");
  return `<tr class="animate__animated animate__fadeIn">
        <td>
          <div class="d-flex align-items-center">
            <i class="fa fa-user-circle mr-2" style="font-size: 40px;"></i>
            <div>
            <p class="m-0 p-0 font-weight-bold client-name text-capitalize">${client.clientName}</p>
            <small class="text-info text-capitalize">${client.clientCountry}</small>
            </div>
          </div>
        </td>
        <td class="client-email">
          ${client.clientEmail}
        </td>
        <td>
          ${client.clientPhone}
        </td>
        <td>
          <span class="badge badge-danger">offline</span>
        </td>
        <td>
          ${formatDate(client.createdAt)}
        </td>
        <td>
          <div class="d-flex">
            <button class="icon-btn-primary mr-3 edit-client-btn" data-id="${client._id}" data-client="${clientStr}" data-toggle="tooltip" title="edit"><i class="fa fa-edit"></i></button>
            <button class="icon-btn-danger mr-3 delete-client-btn" data-id="${client._id}"><i class="fa fa-trash"></i></button>
            <button class="icon-btn-info share-client-btn" data-id="${client._id}" data-email="${client.clientEmail}" data-name="${client.clientName}"><i class="fa fa-share-alt"></i></button>
          </div>
        </td>
        </tr>`;
}

// end create dynamic TR

// start client action

// update
$(document).on("click",".edit-client-btn",function(){
  const parentTR = $(this).parent().parent().parent();
  const str = $(this).data("client");
  const obj = JSON.parse(str.replace(/'/g,'"'));

  for (const [key,value] of Object.entries(obj)) {
    $(`[name=${key}]`,"#client-form").val(value);
  }

  $("#add-client-modal").modal("show");
  $("#client-form").addClass("update-client-form");
  $("#client-form").removeClass("add-client-form");
  $("#client-form").attr("data-id",obj._id);
  $(".add_client_btn").text("Update Client");
  updateClient(parentTR);
})

function updateClient(parent){
  $(document).on("submit",".update-client-form",async function(e){
    e.preventDefault();
    const clientId = $(this).data("id");
    try{
      const response = await ajax({
        method : "PUT",
        url : `/client/${clientId}`,
        data : new FormData(this),
        submit_btn : ".add_client_btn",
        loader_btn : ".add_client_loading_btn"
      })
      $("#add-client-modal").modal("hide");
      new sweetAlert({
        title : "Success!",
        message : response.message,
        icon : "success",
        cnfBtnTxt : "OK"
      },"PUT")
      const updatedTR = createDynamicTR(response.data);
      const updatedTDs = $(updatedTR).html();
      $(parent).html(updatedTDs);
    }catch(error){
      $(".error-msg-box").html(`<li>${error.message}</li>`);
      setTimeout(()=>{
        $(".error-msg-box").html("");
      },2000);
    } 
  });
}

// delete
$(document).on("click",".delete-client-btn",async function(){
  const clientId = $(this).data("id");
  const parentRow = $(this).parent().parent().parent();
  // open dialog
  const deleteAlertRes = await new sweetAlert({
    title : "Are you sure",
    message : "You won't be able to revert this!",
    icon : "warning",
    cnfBtnTxt : "Yes, delete it!"
  },"DELETE")

  if(deleteAlertRes.isConfirmed){
    try{
      const response = await ajax({
        method : "DELETE",
        url : `/client/${clientId}`,
        data : {token},
        loader_btn : ".tmp",
        submit_btn : ".tmp"
      })
      new sweetAlert({
        title : "Deleted!",
        message : response.message,
        icon : "success",
        cnfBtnTxt : "OK"
      },"")

      $(parentRow).removeClass("animate__animated animate__fadeIn");
      $(parentRow).addClass("animate__animated animate__fadeOut");
      removeElement(parentRow,2000);
  
    }catch(error){
      new sweetAlert({
        title : "Sorry",
        message : error.responseJSON.message,
        icon : "error",
        cnfBtnTxt : "OK"
      },"")
    }
  }

})

// share
$(document).on("click",".share-client-btn",async function(){
  $("#share-client-modal").modal("show");
  const userInfo = decodeToken(token);
  const id = $(this).data("id");
  const customerEmail = $(this).data("email");
  const customerName = $(this).data("name");

  const clientToken = await ajax({
    method : "GET",
    url : `/token/generate/${id}`,
    data : {
      customerName,
      companyInfo : JSON.stringify(userInfo)
    },
    loader_btn : ".tmp",
    submit_btn :".tmp"
  })

  const inviteLink = `${window.location.origin}/invite/${clientToken.token}`;
  const inviteLinkInput = document.querySelector("[name=inviteLink]");
  inviteLinkInput.value = inviteLink; 
  // copy link
  $(".copy-link-btn").on("click",function(){
    inviteLinkInput.select();
    document.execCommand("copy");
    $("i",this).removeClass("fa-copy");
    $("i",this).addClass("fa-check");
    $(this).tooltip('hide')
    .attr('data-original-title', "copied!")
    .tooltip('show');
    setTimeout(()=>{
      $("i",".copy-link-btn").removeClass("fa-check");
      $("i",".copy-link-btn").addClass("fa-copy");
      $(".copy-link-btn").tooltip('hide')
      .attr('data-original-title', "copy")
      .tooltip('show');
    },2000)
  })

  // send invite email link
  $(".send-email-btn").on("click",async function(){
    const emailInfo = {
      from : userInfo.data.email,
      companyName : userInfo.data.company_name,
      companyLogo : userInfo.data.company_logo,
      companyPhone : userInfo.data.phone,
      inviteLink,
      to : customerEmail,
      subject:"Front Leadership invitation link"
    }
    const formdata = new FormData();
    formdata.append("token",token);
    formdata.append("emailInfo",JSON.stringify(emailInfo));
    
    try{
      const response = await ajax({
        method : "POST",
        url : "/email/invite",
        data : formdata,
        loader_btn : ".progressive-loading",
        submit_btn : ".tmp"
      })
      $("#share-client-modal").modal("hide");
      new sweetAlert({
        title : "Success",
        message : response.message,
        icon : "success",
        cnfBtnTxt : "OK"
      },"POST")
    }catch(error){
      new sweetAlert({
        title : "Error",
        message : "Someting went wrong!",
        icon : "error",
        cnfBtnTxt : "OK"
      },"POST")
    }
  })
})

// end client action

// get page number
function getPageNumber(){
  const currentPage = location.href;
  if(currentPage.indexOf("?") != -1){
    if(currentPage.split("?")[1].indexOf("page") != -1){
      return Number(currentPage.split("?")[1].split("=")[1]);
    }
    return 1;
  }
  return 1;
}

// client count
async function getClientsCount(){
  try{
    const response = await ajax({
      method : "GET",
      url :"/client/total",
      submit_btn : ".tmp",
      loader_btn : ".tmp"
    })
  
    return response.data;
  }catch(error){
    return false;
  }
}

// pagination
async function createPagination(noOfItemPerPage=5){
  let pageNumber = getPageNumber();
  let content = `<li class='page-item ${pageNumber == 1 ? 'disabled' : '' }'><a href='/client?page=${pageNumber>1 ? pageNumber-1 : 1}' class='page-link'>Previous</a></li>`;

  const dataCount = await getClientsCount();
  let pageCount = (dataCount/noOfItemPerPage);
  if(pageCount.toString().indexOf(".") != -1){
    pageCount = Math.trunc(pageCount += 1);
  }
  for (let i = 1; i <= pageCount; i++) {
    content += `<li class="page-item">
    <a href="/client?page=${i}" class="page-link">${i}</a>
    </li>`;
  }
  content += `<li class='page-item ${pageNumber === pageCount ? 'disabled' : ''}'><a href='/client?page=${pageNumber < pageCount ? pageNumber+1 : pageCount}' class='page-link'>Next</a></li>`;
  $(".client-pagination").html(content);
  $(".page-item").eq(pageNumber).addClass("active");
}


// change search filter
function changeFilter(elm){
  const nextElement = $(elm).next();
  if(nextElement.hasClass("filter-by-name")){
    nextElement.removeClass("filter-by-name");
    nextElement.addClass("filter-by-email");
    nextElement.attr("placeholder","Filter by Email");
  }else{
    nextElement.addClass("filter-by-name");
    nextElement.removeClass("filter-by-email");
    nextElement.attr("placeholder","Filter by Name");
  }
}

// search filter by name
$(document).on("input",".filter-by-name",function(){
  let keyword = this.value.trim().toLowerCase();
  $(".client-name").each(function(){
    if($(this).text().trim().toLowerCase().indexOf(keyword) == -1){
      $(this).parent().parent().parent().parent().hide();
    }else{
      $(this).parent().parent().parent().parent().show();
    }
  })
})

// search filter by email
$(document).on("input",".filter-by-email",function(){
  let keyword = this.value.trim().toLowerCase();
  $(".client-email").each(function(){
    if($(this).text().trim().toLowerCase().indexOf(keyword) == -1){
      $(this).parent().hide();
    }else{
      $(this).parent().show();
    }
  })
})

// export to pdf
$(document).on("click",".export-to-pdf-btn",async function(e){
  e.preventDefault();
  
  if(sessionStorage.getItem("clients") != null){

    const clients = sessionStorage.getItem("clients");
    exportData(clients);
  }else{
    console.log("no data");
  }

})

// export all data to pdf
$(document).on("click",".export-to-pdf-all-btn",async function(e){
  e.preventDefault();
  if(sessionStorage.getItem("all_clients") != null){
    const allClients = sessionStorage.getItem("all_clients");
    exportData(allClients);
  }else{
    try{
      const response = await ajax({
        method : "GET",
        url : `/client/all`,
        loader_btn : ".tmp",
        submit_btn : ".tmp"
      });
      sessionStorage.setItem("all_clients",JSON.stringify(response.data));
      exportData(JSON.stringify(response.data));
    }catch(error){
  
    }
  }  
})

async function exportData(clients){
  const formdata = new FormData();
    formdata.append("token",token);
    formdata.append("data",clients);

    try{
      const response = await ajax({
        method : "POST",
        url : "/export/pdf",
        data : formdata,
        loader_btn : ".tmp",
        submit_btn : ".tmp"
      })
      // download pdf request
      try{
        const pdfBlob = await ajaxDownload({
          method : "GET",
          url : `/exports/${response.filename}.pdf`
        });

        const blob = URL.createObjectURL(pdfBlob);
        let a = document.createElement("a");
        a.href = blob;
        a.download = response.filename+".pdf";
        a.click();
        a.remove();

        // remove the file from server requrest
        try{
          const deleteRes = await ajax({
            method : "DELETE",
            url : `/export/${response.filename}`,
            data : {token},
            loader_btn : ".tmp",
            submit_btn : ".tmp"
          })
        }catch(error){
          console.log(error.responseJSON);
        }
      }catch(err){
        console.log("error");
      }
    }catch(error){
      new sweetAlert({
        title : "Error",
        message : error.message,
        icon : "error",
        cnfBtnTxt : "OK"
      },"POST")
    }
}