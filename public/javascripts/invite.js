$(document).ready(()=>{
  // create client accout
  $(".client-form").submit(async function(e){
    e.preventDefault();
    const id = $("[name=uid]").val();
    try{
      const response = await ajax({
        method : "POST",
        url : "/client/"+id,
        data : new FormData(this),
        loader_btn : ".confirm_loading_btn",
        submit_btn : ".confirm_btn"
      })
      const alertRes = await sweetAlert({
        title : "Success",
        message : response.message,
        icon : "success",
        cnfBtnTxt : "OK"
      },"POST")

      if(alertRes.isConfirmed){
        window.location = "/";
      }
    }catch(error){
      await sweetAlert({
        title : "Error",
        message : error.responseJSON.message,
        icon : "error",
        cnfBtnTxt : "OK"
      },"POST")
    }
  });
})
