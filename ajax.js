/// <reference path="jquery-3.6.0.js" />
"use strict";
function getJSON(url) {
    return new Promise((resolve, reject) => {
        $.ajax({
            url: url,
            success: data => resolve(data),
            error: err => reject(err)
        });
    });
}
