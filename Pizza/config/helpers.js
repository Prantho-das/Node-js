const path = require("path")
const fs = require("fs")
const fileUploader = (files) => {
    const filename = `${new Date().getTime()}` + path.extname(files.file.name).toLowerCase()
    const destination = path.resolve("./public/upload/") + "/" + filename
    files.file.mv(destination, (err) => {
        if (err) {
            console.log(err)
        } else {
            console.log("file uploaded")
        }
    })
    return filename
}
module.exports={fileUploader}