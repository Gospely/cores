const recursion = function(func, option){
    var value = func(option);

   while(typeof value === "function") {
       value = value();
   }

   return value;
}
export default recursion;
