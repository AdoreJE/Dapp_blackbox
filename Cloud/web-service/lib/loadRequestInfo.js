module.exports=function (requestContractAddress){
    var html = `  
      <form action="/topic/owner_process" method="post">
        
        <p><input type="hidden" name="requestContractAddress" value="${requestContractAddress}" ></p>
        
        <p>
          <input type="submit" value="${requestContractAddress}">
        </p>
      </form>
     
    
    `
    return html
  }