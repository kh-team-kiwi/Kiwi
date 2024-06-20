import errorimage from '../../images/xfile.svg'

const ErrorImageHandler =  (event) => {
    event.target.src = errorimage;
    event.target.onError=null;
}
export default ErrorImageHandler;