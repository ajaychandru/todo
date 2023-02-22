module.exports.getDay= function(){
    const today=new Date();

    const options = { weekday: 'long', month: 'long', day: 'numeric' };
    const day=today.toLocaleDateString("en-us",options);
    return day;
}


