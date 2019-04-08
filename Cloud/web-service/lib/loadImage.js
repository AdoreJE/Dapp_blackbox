module.exports=function (image1, image2, i, contractAddr){
    var html = `
    <div style="width:1000px; height:250px; border:1px solid; ">
      <div style="width:400px; height:200px;  float:left">
        <img src = "${image1}" style="width:399px;   "/>
      </div>
      <div style="width:400px; height:200px;  float:left">
        <img src = "${image2}" style="width:399px; "/>
      </div>
      <div style="width:150px; height:230px;  float:left; ">    
      <form action="/topic/search_request" method="post">
        <p><input type="hidden" name="count" value="${i}" ></p>
        <p><input type="hidden" name="contractAddr" value="${contractAddr}"></p>
        <p>
          <input type="submit">
        </p>
      </form>
    </div>

    <div style="width:800px; text-align:center; margin:0; border:1px solid;">
      images
    </div>
  </div>
    
    `
    return html
  }