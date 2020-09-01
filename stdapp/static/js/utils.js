let utils = {
    csrftoken: '',
    sendRequest: (url, type, data, handlers) => {
        $.ajax({
            url: url,
            type: type,
            // some csrf token setups
            beforeSend: function (xhr) {
                const csrftoken = jQuery("[name=csrfmiddlewaretoken]").val();
                xhr.setRequestHeader("X-CSRFToken", utils.csrftoken);
            },
            data: data,
            contentType:"application/json; charset=utf-8",
            dataType:"json",
            success: handlers.success,
            error: handlers.error === undefined ? () => console.log('Internal Server Error.') : handlers.error
        })
    },
    generateHash: (str) => {
        let hash = 0;
        if (str.length == 0) {
            return hash;
        }
        for (let i = 0; i < str.length; i++) {
            let char = str.charCodeAt(i);
            hash = ((hash<<5)-hash)+char;
            hash = hash & hash; // Convert to 32bit integer
        }
        return hash;
    }
}
