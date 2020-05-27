module.exports = {
    isEmpty: function(data) {
        error = {}
        for (key in data) {
           value = data[key]
           if (value.length == 0) {
                error[key] = key + " cannot be empty"
           } 
        }

        if (Object.keys(error).length != 0) {
            let feedback = {
                status: false,
                error: error
            }
            return feedback
        }
        return {
            status: true
        }
    },

    isEqual: function(item1, item2, name1, name2) {
        error = {}
        if (item1 != item2) {
            error[name1] = name1 + " and " + name2 + " are not equal."
            return {
                status: false,
                error: error
            }
        }
        return {
            status:true
        }
    }
}