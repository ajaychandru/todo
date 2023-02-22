const btn=document.querySelector('#my-button');
const newItem=document.querySelector('#new-item');
btn.addEventListener('click',function(event){
  if(newItem.value.trim()===''){
    alert("New Item cannot be empty");
    event.preventDefault();
  }
}) 
   
