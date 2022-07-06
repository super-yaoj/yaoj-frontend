export {
    BASE_URL,
    FileType,
    FileTypeName,
    LangModel,
    Language,
    SubmStatus,
    CalcMethod,
}

const BASE_URL = process.env.NODE_ENV == "development" ? "http://localhost:8081/" : "http://www.wzyhome.work:8081/"

const FileType = { Text: 0, Binary: 1, Code: 2 }
const FileTypeName = ['Text File', 'Binary File', 'Source Code']
    
const Language = ["C++", "C++11", "C++14", "C++17", "C++20", "Python2", "Python3", "Go", "Java", "C"]
const LangModel = ["cpp", "cpp", "cpp", "cpp", "cpp", "python", "python", "go", "java", "c"]

const SubmStatus = ["OK", "Internal Server Error", "Waiting", "Judging",]

const CalcMethod = ['MIN', 'MAX', 'SUM']