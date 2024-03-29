// start ajax coding

function ajax(request) {
	return new Promise((resolve, reject) => {
		let options = {
			type: request.method,
			url: request.url,
			data: request.data || {},
			beforeSend: function () {
				$(request.loader_btn).removeClass("d-none");
				$(request.submit_btn).addClass("d-none");
			},
			success: function (response) {
				$(request.loader_btn).addClass("d-none");
				$(request.submit_btn).removeClass("d-none");
				resolve(response);
			},
			error: function (error) {
				$(request.loader_btn).addClass("d-none");
				$(request.submit_btn).removeClass("d-none");
				reject(error);
			}
		}
		if (request.method == "POST" || request.method == "PUT") {
			options["processData"] = false;
			options["contentType"] = false;
		}

		$.ajax(options)
	})
}

// end ajax coding

// start getting data from cookie

function getCookieData(cookieKey) {
	const cookies = document.cookie.split(";");
	let returnVal;
	for (let cookie of cookies) {
		const [key, value] = cookie.split("=");
		if (key.trim() === cookieKey.trim()) {
			returnVal = value;
			break;
		}
	}

	return returnVal;
}

// end getting data from cookie

// format date
function formatDate(dateUTC) {
	const date = new Date(dateUTC);
	let dd = formatNumber(date.getDate());
	let mm = formatNumber(date.getMonth() + 1);
	const yy = date.getFullYear();
	const time = date.toLocaleTimeString();
	const formatedDate = `${dd}-${mm}-${yy} ${time}`;
	return formatedDate;
}

function formatNumber(num) {
	return num < 10 ? `0${num}` : num;
}

// start alert coding

async function sweetAlert(alert, method) {
	const response = await Swal.fire({
		title: alert.title,
		text: alert.message,
		icon: alert.icon,
		confirmButtonText: alert.cnfBtnTxt,
		showCancelButton: method === "DELETE" ? true : false,
		customClass: {
			confirmButton: "btn btn-primary",
		},
	})

	return response;
}

// end alert coding

// start remove alert coding

function removeError(element, delay) {
	setTimeout(() => {
		$(`.${element}`).removeClass("border border-danger");
		$(`.${element}-error`).html("");
	}, delay);
}

// end remove alert coding

// start toast coding

// function toast(toastInfo){
//   const Toast = Swal.mixin({
//     toast: true,
//     position: 'top-end',
//     showConfirmButton: false,
//     didOpen: (toast) => {
//       Swal.showLoading();
//     },
//   })

//   Toast.fire({
//     icon: toastInfo.icon,
//     title: `${toastInfo.title} <span class='progress-txt'></span>`,
//   })
// }

// end toast coding

// remove element
function removeElement(elem, time) {
	setTimeout(() => {
		elem.remove();
	}, time);
}

// start add tooltip coding

function toolTip(element) {
	$(element).tooltip();
}

// end add tooltip coding

// toggle class
function toggle(element, className) {
	$(`.${element}`).toggleClass(className);
}

// decode token
function decodeToken(token) {
	return JSON.parse(atob(token.split(".")[1]));
}

// check image file
function isImage(image) {
	const acceptType = ["image/jpg", "image/png", "image/jpeg", "image/webp"];
	const currentImageType = image.type;
	return acceptType.includes(currentImageType) ? true : false;
}

// upload files to s3
async function uploadToS3(file, element) {
	const fileInfo = {
		Key: file.name,
		Body: file,
		ACL: "public-read"
	}
	const uploadRes = await S3.upload(fileInfo)
		.on("httpUploadProgress", (progress) => {
			let loaded = progress.loaded;
			let total = progress.total;
			let percentage = Math.floor((loaded / total) * 100);
			$(element).html(`<span class='badge badge-primary'>${percentage}%</span>`);
		})
		.promise();
	return uploadRes;
}

// download request
async function ajaxDownload(request) {
	return $.ajax({
		type: request.method,
		url: request.url,
		xhr: function () {
			const xml = new XMLHttpRequest();
			xml.responseType = "blob";
			return xml;
		}
	}).promise();
}

// pagination
async function createPagination(entity, noOfItemPerPage = 5) {
	let pageNumber = getPageNumber();
	let content = `<li class='page-item ${pageNumber == 1 ? 'disabled' : ''}'><a href='/${entity}?page=${pageNumber > 1 ? pageNumber - 1 : 1}' class='page-link'>Previous</a></li>`;

	const dataCount = await getEntitiesCount(entity);
	let pageCount = (dataCount / noOfItemPerPage);
	if (pageCount.toString().indexOf(".") != -1) {
		pageCount = Math.trunc(pageCount += 1);
	}
	for (let i = 1; i <= pageCount; i++) {
		content += `<li class="page-item">
    <a href="/${entity}?page=${i}" class="page-link">${i}</a>
    </li>`;
	}
	content += `<li class='page-item ${pageNumber === pageCount ? 'disabled' : ''}'><a href='/${entity}?page=${pageNumber < pageCount ? pageNumber + 1 : pageCount}' class='page-link'>Next</a></li>`;
	$(`.${entity}-pagination`).html(content);
	$(".page-item").eq(pageNumber).addClass("active");
}

// get page number
function getPageNumber() {
	const currentPage = location.href;
	if (currentPage.indexOf("?") != -1) {
		if (currentPage.split("?")[1].indexOf("page") != -1) {
			return Number(currentPage.split("?")[1].split("=")[1]);
		}
		return 1;
	}
	return 1;
}

// client count
async function getEntitiesCount(entity){
	try{
		const response = await ajax({
			method : "GET",
			url :`/${entity}/total`,
			submit_btn : ".tmp",
			loader_btn : ".tmp"
		})

		return response.data;
	}catch(error){
		return false;
	}
}