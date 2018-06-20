
//expects the object and array of the object key, returns the object with white spaces removed
let trimSpace = function(obj){
    //performs valiation and ensure it is an object
    if(typeof obj !== "undefined" && obj !== '' && typeof obj === 'object' && typeof obj.length === "undefined"){
            //Object.keys gets the key of the object in arrays and foreach loops through each property of the array
            Object.keys(obj).forEach(function(key){ obj[key] = obj[key].trim() });
            return obj;
        
    }else{
        return '';
    }
}

export default trimSpace;