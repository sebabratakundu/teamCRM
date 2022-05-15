const PDFKit = require("pdfkit-table");
const fs = require("fs");
const crypto = require("crypto");
const pdf = new PDFKit({
  size : "A4"
})

const generatePDF = (pdfData)=>{
  const fileName = crypto.randomBytes(6).toString("hex");
  pdf.pipe(fs.createWriteStream("public/exports/"+fileName+".pdf"));
  const {companyInfo,data} = pdfData;
  pdf
  .fontSize(20)
  .text(companyInfo.company_name,{
    align : "center"
  })
  .moveDown();
  const table = {
    headers : [
      {
        label : "Name",
        property : "name"
      },
      {
        label : "Email",
        property : "email"
      },
      {
        label : "Phone",
        property : "phone"
      },
      {
        label : "Country",
        property : "country"
      },
      {
        label : "Registered At",
        property : "register"
      }
    ],
    datas : data.map((client)=>{
      return{
        name : client.clientName,
        email : client.clientEmail,
        phone : client.clientPhone,
        country : client.clientCountry,
        register : new Date(client.createdAt).toLocaleDateString()
      }
    })
  } 
  pdf
  .table(table,{
    title : companyInfo.company_name+" Clients",
    width : 500,
  })
  .moveDown();
  pdf.end();

  return fileName;
}

module.exports = {
  generatePDF
}