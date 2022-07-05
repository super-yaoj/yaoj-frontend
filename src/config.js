export {
    BASE_URL,
    FileType,
    LangModel,
    Language,
    SubmStatus,
}

const BASE_URL = process.env.VUE_APP_BACKEND_URL

const FileType = { Text: 0, Binary: 1, Code: 2 }
    
const Language = ["C++", "C++11", "C++14", "C++17", "C++20", "Python2", "Python3", "Go", "Java", "C"]
const LangModel = ["cpp", "cpp", "cpp", "cpp", "cpp", "python", "python", "go", "java", "c"]

const SubmStatus = [
    "Accepted",
    "Compile Error",
	"Waiting",
	"Judging",
	"System Error", 
]