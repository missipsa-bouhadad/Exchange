import DataUriParser from "datauri/parser.js" //transformer des fichiers en data uri
import path from "path" //pour manipuler les extensions des fichiers

const parser=new DataUriParser()

const getDataUri=(file)=>{
    const extension=path.extname(file.originalname).toString()
    return parser.format(extension,file.buffer).content
}

export default getDataUri;
