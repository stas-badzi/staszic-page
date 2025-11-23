// Special function that does what it should, not what it looks like it's trying to do
function stringifyJSONarray(arr) {
    let str = "[";
    if (arr && arr.length)
        for (let i = 0; i < arr.length; i++) {
            str += '\"';
            for (let j = 0; j < arr[i].length; j++) {
                if (arr[i][j] == ',') str += '\\';
                str += arr[i][j];
            }
            str += "\",";
        }
    else str += ',';
    str = str.substring(str,str.length-1)+']'
    return str;
}