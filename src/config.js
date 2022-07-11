export {
    BASE_URL,
    FileType,
    FileTypeName,
    LangModel,
    Language,
    CalcMethod,
    UserGroup,
}

const BASE_URL = process.env.NODE_ENV == "development" ? "http://localhost:8081/" : "http://www.wzyhome.work:8081/"
const UserGroup = { Banned: 0, Normal: 1, Admin: 2, Root: 3 }

const FileType = { Text: 0, Binary: 1, Code: 2 }
const FileTypeName = ['Text File', 'Binary File', 'Source Code']

const Language = ["C++", "C++11", "C++14", "C++17", "C++20", "Python2", "Python3", "Go", "Java", "C"]
const LangModel = ["text/x-c++src", "text/x-c++src", "text/x-c++src", "text/x-c++src", "text/x-c++src", "text/x-python", "text/x-python", "text/x-go", "text/x-java", "text/x-csrc"]

const CalcMethod = ['MIN', 'MAX', 'SUM']
