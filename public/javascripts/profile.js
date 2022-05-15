// start controlling sidenav
let token;
$(document).ready(()=>{
  $(".toggle-sidenav-btn").click(()=>{
    toggle("sidenav","sidenav-open");
    toggle("section","section-open");
  });
  token = getCookieData("authToken");
  showCompanyDetails();
});

// end controlling sidenav

// show company details
async function showCompanyDetails(){
  let companyInfo = decodeToken(token);
  $(".companyName").text(companyInfo.data.company_name);
  $(".companyEmail").text(companyInfo.data.email);
  if(companyInfo.data.isLogo){
    $(".companyImageBtn").html("");
    $(".companyImageBtn").removeClass("btn-primary");
    $(".companyImage").css({
      backgroundColor : 'white',
      backgroundImage : `url(${companyInfo.data.company_logo})`,
      backgroundRepeat : 'no-repeat',
      backgroundSize : "cover"
    })
  }

  const roleAccessRes = await ajax({
    method : "GET",
    url : "/access",
    loader_btn : ".tmp",
    submit_btn : ".tmp"
  })
  createMenu(roleAccessRes.data);
}

// create dynamic menu based on role
function createMenu(menus){
  let content = '';
  for (const menu of menus) {
    content += `<li class="nav-item">
    <button class="btn mr-2 p-0">
      <a href="${menu.link}" class="nav-link ${menu.color}">
        <i class="${menu.icon}"></i>
      </a>
    </button>
    </li>`;
  }

  $(".profile-nav-menu").html(content);
}

// upload company image
$(document).on("click",".companyImageBtn",function(){
  const input = document.createElement("input");
  input.type = "file";
  input.accept = "image/*";
  input.click();

  input.onchange = async function(){
    const tmpImgUrl = URL.createObjectURL(this.files[0]);
    $(".companyImageBtn").attr("disabled",true);
    const imageUrl = await uploadCompanyImageAndGetUrl(this.files[0],".companyImage");
    const updateUrl = await updateCompanyDetails(imageUrl);
    $(".companyImageBtn").html("");
    $(".companyImageBtn").attr("disabled",false);
    $(".companyImageBtn").removeClass("btn-primary");
    $(".companyImage").css({
      backgroundColor : 'white',
      backgroundImage : `url(${tmpImgUrl})`,
      backgroundRepeat : 'no-repeat',
      backgroundSize : "cover"
    })
  }

});

async function uploadCompanyImageAndGetUrl(image,element){
  if(isImage(image)){
    const response = await uploadToS3(image,element);
    return response.Location;
  }else{
    new sweetAlert({
      title : "Error",
      message : "Please upload a valid image",
      icon : "error",
      cnfBtnTxt : "Close"
    },"");
  }
}

async function updateCompanyDetails(data){
  let id = decodeToken(token).data._id;
  const formdata = new FormData();
  formdata.append("token",token);
  formdata.append("data",JSON.stringify({
    isLogo : true,
    company_logo : data
  }));
  
  const res = await ajax({
    method : "PUT",
    url : "/api/private/company/"+id,
    data : formdata,
    loader_btn : ".tmp",
    submit_btn : ".tmp"
  })

  console.log(res);
}
