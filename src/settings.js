const setPath = (path) => {
    localStorage.setItem('path', path.value)
    console.log(path)
    document.getElementById('currentpath').textContent = path.value;
}
const getPath = () => {
    return localStorage.getItem('path')
    console.log(localStorage.getItem('path'))
}
const getPathB = () => {
    document.getElementById('currentpath').textContent = getPath()
}